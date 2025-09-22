const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generateQRCode, createQRPayload, generateRegistrationId } = require('../utils/qrGen');

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

// Test QR Scanner functionality
const testQRScanner = async () => {
  try {
    console.log('🔍 Testing QR Scanner functionality...\n');

    // Find an existing event
    const event = await Event.findOne();
    if (!event) {
      console.log('❌ No events found. Please create an event first.');
      return;
    }

    console.log('📅 Using event:', event.title);

    // Find an existing registration
    const registration = await Registration.findOne({ eventId: event._id })
      .populate('eventId', 'title category department type time teamSize rules date location dates')
      .lean();

    if (!registration) {
      console.log('❌ No registrations found for this event. Please create a registration first.');
      return;
    }

    console.log('👤 Found registration:', registration.regId);
    console.log('📋 Registration details:');
    console.log('   - Name:', registration.leader?.name || 'N/A');
    console.log('   - Email:', registration.leader?.email || 'N/A');
    console.log('   - Phone:', registration.leader?.phone || 'N/A');
    console.log('   - Event:', registration.eventId?.title || 'N/A');
    console.log('   - Category:', registration.eventId?.category || 'N/A');
    console.log('   - Department:', registration.eventId?.department || 'N/A');
    console.log('   - Type:', registration.eventId?.type || 'N/A');
    console.log('   - Time:', registration.eventId?.time || 'N/A');
    console.log('   - Location:', registration.eventId?.location || 'N/A');
    console.log('   - Status:', registration.status || 'N/A');

    // Test the validation endpoint data structure
    console.log('\n🔧 Testing validation endpoint data structure...');
    
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
    console.log('   - Event Title:', responseData.eventId.title);
    console.log('   - Event Category:', responseData.eventId.category);
    console.log('   - Event Department:', responseData.eventId.department);
    console.log('   - Event Type:', responseData.eventId.type);
    console.log('   - Event Time:', responseData.eventId.time);
    console.log('   - Event Location:', responseData.eventId.location);
    console.log('   - Leader Name:', responseData.leader.name);
    console.log('   - Leader Email:', responseData.leader.email);
    console.log('   - Leader Phone:', responseData.leader.phone);
    console.log('   - Registration Status:', responseData.status);

    // Generate QR code for testing
    console.log('\n📱 Generating QR code for testing...');
    const qrPayload = createQRPayload(registration, event);
    const qrCodeDataURL = await generateQRCode(qrPayload);
    
    console.log('✅ QR Code generated successfully');
    console.log('📊 QR Payload:', JSON.stringify(qrPayload, null, 2));

    // Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    console.log(`📡 You can test the validation endpoint at:`);
    console.log(`   GET /api/registrations/validate/${registration.regId}`);
    console.log(`   Or visit: http://localhost:5000/api/registrations/validate/${registration.regId}`);

    console.log('\n✅ QR Scanner test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your backend server');
    console.log('   2. Open the QR Scanner page in your frontend');
    console.log('   3. Scan the QR code or manually enter the registration ID');
    console.log('   4. Verify that all fields are populated correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testQRScanner();
  await mongoose.connection.close();
  console.log('\n👋 Test completed. Database connection closed.');
};

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testQRScanner };
