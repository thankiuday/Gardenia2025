const mongoose = require('mongoose');
const config = require('../config');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Event = require('../models/Event');

const testAdminPages = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing Admin Pages Data...\n');

    // Test 1: Admin Registrations Page
    console.log('1. 📊 Admin Registrations Page Test:');
    
    // Test pagination
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const registrations = await Registration.find()
      .populate({
        path: 'eventId',
        select: 'title category type customId',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRegistrations = await Registration.countDocuments();
    const totalPages = Math.ceil(totalRegistrations / limit);

    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   Page: ${page}/${totalPages}`);
    console.log(`   Registrations on this page: ${registrations.length}`);
    
    console.log('\n   📋 Sample Registrations:');
    registrations.slice(0, 5).forEach((reg, index) => {
      console.log(`     ${index + 1}. ${reg.regId} - ${reg.leader.name}`);
      console.log(`        Event: ${reg.eventId?.title || 'Unknown Event'}`);
      console.log(`        Type: ${reg.isGardenCityStudent ? 'GCU' : 'EXTERNAL'}`);
      console.log(`        Date: ${reg.createdAt.toLocaleDateString()}`);
      console.log(`        Team Size: ${reg.teamMembers ? reg.teamMembers.length + 1 : 1}`);
      console.log('');
    });

    // Test search functionality
    console.log('   🔍 Testing Search Functionality:');
    const searchTerm = 'uday';
    const searchResults = await Registration.find({
      $or: [
        { 'leader.name': { $regex: searchTerm, $options: 'i' } },
        { 'leader.email': { $regex: searchTerm, $options: 'i' } },
        { 'leader.phone': { $regex: searchTerm, $options: 'i' } },
        { regId: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('eventId', 'title category type customId');

    console.log(`     Search for "${searchTerm}": ${searchResults.length} results`);
    searchResults.slice(0, 3).forEach((reg, index) => {
      console.log(`       ${index + 1}. ${reg.regId} - ${reg.leader.name} - ${reg.eventId?.title || 'Unknown Event'}`);
    });

    // Test filtering by student type
    console.log('\n   🎯 Testing Student Type Filter:');
    const gcuRegistrations = await Registration.find({ isGardenCityStudent: true }).countDocuments();
    const externalRegistrations = await Registration.find({ isGardenCityStudent: false }).countDocuments();
    
    console.log(`     GCU Students: ${gcuRegistrations}`);
    console.log(`     External Students: ${externalRegistrations}`);

    // Test 2: Admin Contacts Page
    console.log('\n2. 📧 Admin Contacts Page Test:');
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10);

    const totalContacts = await Contact.countDocuments();
    const totalContactPages = Math.ceil(totalContacts / 10);

    console.log(`   Total Contacts: ${totalContacts}`);
    console.log(`   Page: 1/${totalContactPages}`);
    console.log(`   Contacts on this page: ${contacts.length}`);
    
    console.log('\n   📋 Sample Contacts:');
    contacts.forEach((contact, index) => {
      console.log(`     ${index + 1}. ${contact.name} - ${contact.email}`);
      console.log(`        Phone: ${contact.phone || 'N/A'}`);
      console.log(`        Date: ${contact.createdAt.toLocaleDateString()}`);
      console.log(`        Message: ${contact.message.substring(0, 50)}...`);
      console.log('');
    });

    // Test contact search
    console.log('   🔍 Testing Contact Search:');
    const contactSearchTerm = 'uday';
    const contactSearchResults = await Contact.find({
      $or: [
        { name: { $regex: contactSearchTerm, $options: 'i' } },
        { email: { $regex: contactSearchTerm, $options: 'i' } },
        { phone: { $regex: contactSearchTerm, $options: 'i' } },
        { message: { $regex: contactSearchTerm, $options: 'i' } }
      ]
    });

    console.log(`     Search for "${contactSearchTerm}": ${contactSearchResults.length} results`);
    contactSearchResults.forEach((contact, index) => {
      console.log(`       ${index + 1}. ${contact.name} - ${contact.email}`);
    });

    // Test 3: Data Quality Check
    console.log('\n3. 🔍 Data Quality Check:');
    
    // Check for registrations with missing data
    const registrationsWithoutLeader = await Registration.find({
      $or: [
        { 'leader.name': { $exists: false } },
        { 'leader.email': { $exists: false } },
        { 'leader.phone': { $exists: false } }
      ]
    }).countDocuments();

    const registrationsWithoutEvent = await Registration.find({
      eventId: { $exists: false }
    }).countDocuments();

    console.log(`   Registrations without leader info: ${registrationsWithoutLeader}`);
    console.log(`   Registrations without event: ${registrationsWithoutEvent}`);

    // Check for contacts with missing data
    const contactsWithoutName = await Contact.find({
      name: { $exists: false }
    }).countDocuments();

    const contactsWithoutEmail = await Contact.find({
      email: { $exists: false }
    }).countDocuments();

    console.log(`   Contacts without name: ${contactsWithoutName}`);
    console.log(`   Contacts without email: ${contactsWithoutEmail}`);

    // Test 4: Event Distribution Analysis
    console.log('\n4. 📈 Event Distribution Analysis:');
    
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
      },
      {
        $limit: 10
      }
    ]);

    console.log('   Top 10 Events by Registration Count:');
    eventDistribution.forEach((event, index) => {
      console.log(`     ${index + 1}. ${event._id}: ${event.count} total (${event.gcuCount} GCU, ${event.externalCount} External)`);
    });

    // Test 5: Recent Activity
    console.log('\n5. ⏰ Recent Activity:');
    
    const recentRegistrations = await Registration.find()
      .populate('eventId', 'title customId')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    console.log('   Recent Registrations:');
    recentRegistrations.forEach((reg, index) => {
      console.log(`     ${index + 1}. ${reg.leader.name} - ${reg.eventId?.title || 'Unknown Event'} (${reg.createdAt.toLocaleDateString()})`);
    });

    console.log('\n   Recent Contacts:');
    recentContacts.forEach((contact, index) => {
      console.log(`     ${index + 1}. ${contact.name} - ${contact.email} (${contact.createdAt.toLocaleDateString()})`);
    });

    console.log('\n✅ Admin Pages Test Completed!');
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   Total Contacts: ${totalContacts}`);
    console.log(`   Valid Event References: ${eventDistribution.filter(e => e._id !== 'Unknown Event').reduce((sum, e) => sum + e.count, 0)}/${totalRegistrations}`);
    console.log(`   Data Quality: ${registrationsWithoutLeader === 0 && contactsWithoutName === 0 ? 'Good' : 'Needs Attention'}`);

  } catch (error) {
    console.error('❌ Error testing admin pages:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testAdminPages().catch(console.error);
