const mongoose = require('mongoose');
const config = require('../config');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const testQRScanner = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing QR Scanner Data for GDN2025-1211...\n');

    // Test the specific registration
    const regId = 'GDN2025-1211';
    const registration = await Registration.findOne({ regId })
      .populate('eventId', 'title category department type time teamSize rules date location dates')
      .lean();

    if (!registration) {
      console.log('❌ Registration not found');
      return;
    }

    console.log('📋 Raw Registration Data:');
    console.log(`   Registration ID: ${registration.regId}`);
    console.log(`   Event ID: ${registration.eventId}`);
    console.log(`   Event Title: ${registration.eventId?.title || 'NULL'}`);
    console.log(`   Event Category: ${registration.eventId?.category || 'NULL'}`);
    console.log(`   Event Department: ${registration.eventId?.department || 'NULL'}`);
    console.log(`   Event Type: ${registration.eventId?.type || 'NULL'}`);
    console.log(`   Event Time: ${registration.eventId?.time || 'NULL'}`);
    console.log(`   Event Location: ${registration.eventId?.location || 'NULL'}`);
    console.log(`   Event Dates: ${JSON.stringify(registration.eventId?.dates || 'NULL')}`);
    console.log(`   Final Event Date: ${registration.finalEventDate || 'NULL'}`);
    console.log(`   Is Garden City Student: ${registration.isGardenCityStudent}`);
    console.log(`   Status: ${registration.status}`);

    console.log('\n👤 Leader Information:');
    console.log(`   Name: ${registration.leader?.name || 'NULL'}`);
    console.log(`   Email: ${registration.leader?.email || 'NULL'}`);
    console.log(`   Phone: ${registration.leader?.phone || 'NULL'}`);
    console.log(`   Register Number: ${registration.leader?.registerNumber || 'NULL'}`);
    console.log(`   College Name: ${registration.leader?.collegeName || 'NULL'}`);
    console.log(`   College Register Number: ${registration.leader?.collegeRegisterNumber || 'NULL'}`);

    // Simulate the validation endpoint response
    console.log('\n🔍 Simulating QR Scanner Validation Response:');
    
    const responseData = {
      ...registration,
      eventId: {
        title: registration.eventId?.title || 'Event',
        category: registration.eventId?.category || 'General',
        department: registration.eventId?.department || 'General',
        type: registration.eventId?.type || 'Competition',
        time: registration.eventId?.time || 'TBA',
        date: registration.eventId?.date || 'TBA',
        location: registration.eventId?.location || 'Garden City University',
        dates: registration.eventId?.dates || { inhouse: 'TBA', outside: 'TBA' },
        teamSize: registration.eventId?.teamSize || { min: 1, max: 1 },
        rules: registration.eventId?.rules || []
      },
      leader: {
        name: registration.leader?.name || 'N/A',
        email: registration.leader?.email || 'N/A',
        phone: registration.leader?.phone || 'N/A',
        registerNumber: registration.leader?.registerNumber || 'N/A',
        collegeName: registration.leader?.collegeName || 'Garden City University',
        collegeRegisterNumber: registration.leader?.collegeRegisterNumber || 'N/A'
      },
      teamMembers: registration.teamMembers || [],
      finalEventDate: registration.finalEventDate || 'TBA',
      regId: registration.regId || 'N/A',
      status: registration.status || 'PENDING',
      isGardenCityStudent: registration.isGardenCityStudent || false
    };

    console.log('\n📱 QR Scanner Display Data:');
    console.log('   Event:');
    console.log(`     Event: ${responseData.eventId.title}`);
    console.log(`     Category: ${responseData.eventId.category}`);
    console.log(`     Date: ${responseData.finalEventDate}`);
    console.log(`     Registration ID: ${responseData.regId}`);
    console.log(`     Event Type: ${responseData.eventId.type}`);
    console.log(`     Department: ${responseData.eventId.department}`);
    console.log(`     Time: ${responseData.eventId.time}`);
    console.log(`     Location: ${responseData.eventId.location}`);
    
    console.log('\n   Participant Details:');
    console.log(`     Name: ${responseData.leader.name}`);
    console.log(`     Email: ${responseData.leader.email}`);
    console.log(`     Phone: ${responseData.leader.phone}`);
    console.log(`     Institution: ${responseData.leader.collegeName}`);
    console.log(`     Registration/Roll No: ${responseData.leader.collegeRegisterNumber}`);
    console.log(`     Status: ${responseData.status}`);

    // Check for any issues
    console.log('\n🔍 Data Quality Check:');
    
    const issues = [];
    
    if (responseData.eventId.title === 'Event') {
      issues.push('Event title is showing default value');
    }
    
    if (responseData.eventId.category === 'General') {
      issues.push('Event category is showing default value');
    }
    
    if (responseData.eventId.department === 'General') {
      issues.push('Event department is showing default value');
    }
    
    if (responseData.eventId.type === 'Competition') {
      issues.push('Event type is showing default value');
    }
    
    if (responseData.eventId.time === 'TBA') {
      issues.push('Event time is showing default value');
    }
    
    if (responseData.eventId.location === 'Garden City University') {
      issues.push('Event location is showing default value');
    }
    
    if (responseData.finalEventDate === 'TBA') {
      issues.push('Final event date is showing default value');
    }
    
    if (responseData.leader.collegeName === 'Garden City University' && !responseData.isGardenCityStudent) {
      issues.push('College name is showing default value for external student');
    }
    
    if (responseData.leader.collegeRegisterNumber === 'N/A') {
      issues.push('College register number is showing default value');
    }

    if (issues.length > 0) {
      console.log('\n⚠️  Issues Found:');
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      console.log('\n✅ No issues found - all data is displaying correctly!');
    }

    // Test the actual API endpoint
    console.log('\n🌐 Testing API Endpoint:');
    try {
      const axios = require('axios');
      const backendUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/register/validate/${regId}`);
      
      if (response.data.success) {
        console.log('✅ API endpoint is working correctly');
        console.log(`   Event Title: ${response.data.data.eventId.title}`);
        console.log(`   Participant Name: ${response.data.data.leader.name}`);
        console.log(`   Status: ${response.data.data.status}`);
      } else {
        console.log('❌ API endpoint returned error:', response.data.message);
      }
    } catch (error) {
      console.log('⚠️  API endpoint test skipped - server not running or not accessible');
    }

  } catch (error) {
    console.error('❌ Error testing QR scanner:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testQRScanner().catch(console.error);