const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardenia2025');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test Outside Student Registration Flow
const testOutsideStudentFlow = async () => {
  try {
    console.log('🔍 Testing Outside Student Registration Flow...\n');

    // Find an existing event
    const event = await Event.findOne();
    if (!event) {
      console.log('❌ No events found. Please create an event first.');
      return;
    }

    console.log('📅 Using event:', event.title);

    // Create a test outside student registration
    const testRegistrationData = {
      regId: 'GDN2025-TEST001',
      eventId: event._id,
      isGardenCityStudent: false,
      leader: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        collegeName: 'ABC Engineering College',
        collegeRegisterNumber: 'ABC2024001'
      },
      teamMembers: [
        {
          name: 'Jane Smith',
          collegeName: 'XYZ University',
          collegeRegisterNumber: 'XYZ2024002'
        }
      ],
      finalEventDate: event.dates.outside,
      status: 'APPROVED',
      qrPayload: JSON.stringify({
        regId: 'GDN2025-TEST001',
        name: 'John Doe',
        event: event.title,
        type: event.type,
        affiliation: 'Outside',
        status: 'APPROVED',
        paymentStatus: 'PENDING',
        timestamp: new Date().toISOString()
      })
    };

    // Check if test registration already exists
    const existingRegistration = await Registration.findOne({ regId: 'GDN2025-TEST001' });
    if (existingRegistration) {
      console.log('📋 Test registration already exists, updating...');
      await Registration.findOneAndUpdate({ regId: 'GDN2025-TEST001' }, testRegistrationData);
    } else {
      console.log('📋 Creating new test registration...');
      const testRegistration = new Registration(testRegistrationData);
      await testRegistration.save();
    }

    console.log('✅ Test registration created/updated successfully');

    // Test the validation endpoint data structure
    console.log('\n🔧 Testing validation endpoint for outside student...');
    
    const registration = await Registration.findOne({ regId: 'GDN2025-TEST001' })
      .populate('eventId', 'title category department type time teamSize rules date location dates')
      .lean();

    if (!registration) {
      console.log('❌ Test registration not found');
      return;
    }

    // Simulate the validation endpoint response
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

    console.log('✅ Validation endpoint would return:');
    console.log('   - Student Type: Outside Student');
    console.log('   - Leader Name:', responseData.leader.name);
    console.log('   - Leader Email:', responseData.leader.email);
    console.log('   - Leader Phone:', responseData.leader.phone);
    console.log('   - College Name:', responseData.leader.collegeName);
    console.log('   - College Registration Number:', responseData.leader.collegeRegisterNumber);
    console.log('   - Event Title:', responseData.eventId.title);
    console.log('   - Event Date:', responseData.finalEventDate);
    console.log('   - Registration Status:', responseData.status);

    if (responseData.teamMembers.length > 0) {
      console.log('\n👥 Team Members:');
      responseData.teamMembers.forEach((member, index) => {
        console.log(`   - Member ${index + 1}: ${member.name}`);
        console.log(`     College: ${member.collegeName}`);
        console.log(`     Registration Number: ${member.collegeRegisterNumber}`);
      });
    }

    // Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    console.log(`📡 You can test the validation endpoint at:`);
    console.log(`   GET /api/registrations/validate/${registration.regId}`);
    console.log(`   Or visit: http://localhost:5000/api/registrations/validate/${registration.regId}`);

    console.log('\n✅ Outside Student Registration Flow test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your backend server');
    console.log('   2. Open the QR Scanner page in your frontend');
    console.log('   3. Scan the QR code or manually enter the registration ID: GDN2025-TEST001');
    console.log('   4. Verify that all outside student information is displayed correctly');
    console.log('   5. Test the registration form to ensure outside students can enter their college registration numbers');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testOutsideStudentFlow();
  await mongoose.connection.close();
  console.log('\n👋 Test completed. Database connection closed.');
};

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOutsideStudentFlow };
