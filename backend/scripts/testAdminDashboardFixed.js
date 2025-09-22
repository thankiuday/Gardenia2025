const mongoose = require('mongoose');
const config = require('../config');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const TicketDownload = require('../models/TicketDownload');

const testAdminDashboardFixed = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing Fixed Admin Dashboard Data...\n');

    // Test 1: Check Registration Data with improved aggregation
    console.log('1. 📊 Registration Statistics:');
    const totalRegistrations = await Registration.countDocuments();
    const gcuRegistrations = await Registration.countDocuments({ isGardenCityStudent: true });
    const outsideRegistrations = await Registration.countDocuments({ isGardenCityStudent: false });
    
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   GCU Students: ${gcuRegistrations}`);
    console.log(`   External Students: ${outsideRegistrations}`);
    
    // Check for recent registrations with proper event data
    const recentRegistrations = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $addFields: {
          event: {
            $cond: {
              if: { $gt: [{ $size: '$event' }, 0] },
              then: '$event',
              else: '$eventByCustomId'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          regId: 1,
          'leader.name': 1,
          'event.title': 1,
          'event.customId': 1,
          isGardenCityStudent: 1,
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    console.log(`   Recent Registrations (last 5):`);
    recentRegistrations.forEach((reg, index) => {
      console.log(`     ${index + 1}. ${reg.leader.name} - ${reg.event?.title || 'Unknown Event'} (${reg.isGardenCityStudent ? 'GCU' : 'EXTERNAL'})`);
    });

    // Test 2: Check Event Distribution
    console.log('\n2. 📈 Event Registration Distribution:');
    const eventDistribution = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $addFields: {
          event: {
            $cond: {
              if: { $gt: [{ $size: '$event' }, 0] },
              then: '$event',
              else: '$eventByCustomId'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $ne: ['$event.title', null] },
              then: '$event.title',
              else: 'Unknown Event'
            }
          },
          count: { $sum: 1 },
          gcuCount: { $sum: { $cond: ['$isGardenCityStudent', 1, 0] } },
          externalCount: { $sum: { $cond: ['$isGardenCityStudent', 0, 1] } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    eventDistribution.forEach(event => {
      console.log(`   ${event._id}: ${event.count} total (${event.gcuCount} GCU, ${event.externalCount} External)`);
    });

    // Test 3: Check Contact Data
    console.log('\n3. 📧 Contact Statistics:');
    const totalContacts = await Contact.countDocuments();
    console.log(`   Total Contacts: ${totalContacts}`);
    
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log(`   Recent Contacts (last 5):`);
    recentContacts.forEach((contact, index) => {
      console.log(`     ${index + 1}. ${contact.name} - ${contact.email}`);
    });

    // Test 4: Check Visitor Data
    console.log('\n4. 👥 Visitor Statistics:');
    const totalVisitors = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.countDocuments({ isUnique: true });
    console.log(`   Total Visitors: ${totalVisitors}`);
    console.log(`   Unique Visitors: ${uniqueVisitors}`);

    // Test 5: Check Ticket Download Data
    console.log('\n5. 🎫 Ticket Download Statistics:');
    const totalTicketDownloads = await TicketDownload.countDocuments();
    const uniqueTicketDownloadsArray = await TicketDownload.distinct('registrationId');
    const uniqueTicketDownloads = uniqueTicketDownloadsArray.length;
    console.log(`   Total Downloads: ${totalTicketDownloads}`);
    console.log(`   Unique Downloads: ${uniqueTicketDownloads}`);

    // Test 6: Data Quality Check
    console.log('\n6. 🔍 Data Quality Check:');
    
    // Check for registrations with proper event references
    const registrationsWithValidEvents = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $addFields: {
          event: {
            $cond: {
              if: { $gt: [{ $size: '$event' }, 0] },
              then: '$event',
              else: '$eventByCustomId'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'event.title': { $ne: null }
        }
      },
      {
        $count: 'validEventReferences'
      }
    ]);

    const validEventReferences = registrationsWithValidEvents[0]?.validEventReferences || 0;
    const invalidEventReferences = totalRegistrations - validEventReferences;
    
    console.log(`   Registrations with valid event references: ${validEventReferences}`);
    console.log(`   Registrations with invalid/missing event references: ${invalidEventReferences}`);

    console.log('\n✅ Fixed Admin Dashboard Data Test Completed!');
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   Valid Event References: ${validEventReferences}/${totalRegistrations} (${Math.round((validEventReferences/totalRegistrations)*100)}%)`);
    console.log(`   Total Contacts: ${totalContacts}`);
    console.log(`   Total Visitors: ${totalVisitors}`);
    console.log(`   Total Ticket Downloads: ${totalTicketDownloads}`);

  } catch (error) {
    console.error('❌ Error testing admin data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testAdminDashboardFixed().catch(console.error);
