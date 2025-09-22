const axios = require('axios');
const mongoose = require('mongoose');
const config = require('../config');

// Import models
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const TicketDownload = require('../models/TicketDownload');
const Admin = require('../models/Admin');

// Test admin dashboard data
const testAdminData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing Admin Dashboard Data...\n');

    // Test 1: Check Registration Data
    console.log('1. 📊 Registration Statistics:');
    const totalRegistrations = await Registration.countDocuments();
    const gcuRegistrations = await Registration.countDocuments({ isGardenCityStudent: true });
    const outsideRegistrations = await Registration.countDocuments({ isGardenCityStudent: false });
    
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   GCU Students: ${gcuRegistrations}`);
    console.log(`   External Students: ${outsideRegistrations}`);
    
    // Check for recent registrations
    const recentRegistrations = await Registration.find()
      .populate('eventId', 'title category type')
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log(`   Recent Registrations (last 5):`);
    recentRegistrations.forEach((reg, index) => {
      console.log(`     ${index + 1}. ${reg.leader.name} - ${reg.eventId?.title || 'N/A'} (${reg.isGardenCityStudent ? 'GCU' : 'EXTERNAL'})`);
    });

    // Test 2: Check Contact Data
    console.log('\n2. 📧 Contact Statistics:');
    const totalContacts = await Contact.countDocuments();
    console.log(`   Total Contacts: ${totalContacts}`);
    
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log(`   Recent Contacts (last 5):`);
    recentContacts.forEach((contact, index) => {
      console.log(`     ${index + 1}. ${contact.name} - ${contact.email}`);
    });

    // Test 3: Check Visitor Data
    console.log('\n3. 👥 Visitor Statistics:');
    const totalVisitors = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.countDocuments({ isUnique: true });
    console.log(`   Total Visitors: ${totalVisitors}`);
    console.log(`   Unique Visitors: ${uniqueVisitors}`);

    // Test 4: Check Ticket Download Data
    console.log('\n4. 🎫 Ticket Download Statistics:');
    const totalTicketDownloads = await TicketDownload.countDocuments();
    const uniqueTicketDownloads = await TicketDownload.distinct('registrationId').length;
    console.log(`   Total Downloads: ${totalTicketDownloads}`);
    console.log(`   Unique Downloads: ${uniqueTicketDownloads}`);

    // Test 5: Check Admin Users
    console.log('\n5. 👤 Admin Users:');
    const adminUsers = await Admin.find().select('username createdAt');
    console.log(`   Total Admin Users: ${adminUsers.length}`);
    adminUsers.forEach((admin, index) => {
      console.log(`     ${index + 1}. ${admin.username} (created: ${admin.createdAt.toLocaleDateString()})`);
    });

    // Test 6: Check Data Consistency
    console.log('\n6. 🔍 Data Consistency Checks:');
    
    // Check for registrations without event references
    const registrationsWithoutEvents = await Registration.find({ eventId: { $exists: false } });
    console.log(`   Registrations without event references: ${registrationsWithoutEvents.length}`);
    
    // Check for registrations with invalid event references
    const registrationsWithInvalidEvents = await Registration.find({ 
      eventId: { $exists: true, $ne: null },
      $expr: { $not: { $in: ['$eventId', { $map: { input: { $objectToArray: '$$ROOT' }, as: 'item', in: '$$item.v' } }] } }
    });
    console.log(`   Registrations with invalid event references: ${registrationsWithInvalidEvents.length}`);

    // Check for missing leader information
    const registrationsWithoutLeader = await Registration.find({
      $or: [
        { 'leader.name': { $exists: false } },
        { 'leader.email': { $exists: false } },
        { 'leader.phone': { $exists: false } }
      ]
    });
    console.log(`   Registrations with missing leader info: ${registrationsWithoutLeader.length}`);

    // Test 7: Check API Endpoints (if server is running)
    console.log('\n7. 🌐 API Endpoint Tests:');
    const backendUrl = process.env.API_URL || 'http://localhost:5000';
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get(`${backendUrl}/api/health`);
      console.log(`   ✅ Health endpoint: ${healthResponse.data.status}`);
      
      // Test admin stats endpoint (without auth - should fail)
      try {
        await axios.get(`${backendUrl}/api/admin/stats`);
        console.log(`   ❌ Admin stats endpoint: Should require authentication`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   ✅ Admin stats endpoint: Properly protected (401 Unauthorized)`);
        } else {
          console.log(`   ⚠️  Admin stats endpoint: Unexpected error - ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`   ⚠️  API tests skipped - server not running or not accessible`);
    }

    // Test 8: Sample Data Analysis
    console.log('\n8. 📈 Sample Data Analysis:');
    
    if (totalRegistrations > 0) {
      // Get registration distribution by event
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
          $unwind: '$event'
        },
        {
          $group: {
            _id: '$event.title',
            count: { $sum: 1 },
            gcuCount: { $sum: { $cond: ['$isGardenCityStudent', 1, 0] } },
            externalCount: { $sum: { $cond: ['$isGardenCityStudent', 0, 1] } }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      
      console.log(`   Event Registration Distribution:`);
      eventDistribution.forEach(event => {
        console.log(`     ${event._id}: ${event.count} total (${event.gcuCount} GCU, ${event.externalCount} External)`);
      });
    }

    console.log('\n✅ Admin Dashboard Data Test Completed!');
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   Total Contacts: ${totalContacts}`);
    console.log(`   Total Visitors: ${totalVisitors}`);
    console.log(`   Total Ticket Downloads: ${totalTicketDownloads}`);
    console.log(`   Admin Users: ${adminUsers.length}`);

  } catch (error) {
    console.error('❌ Error testing admin data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the test
testAdminData().catch(console.error);
