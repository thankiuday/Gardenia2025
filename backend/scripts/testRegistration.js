const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration system...');
    
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if events exist
    const eventCount = await Event.countDocuments();
    console.log(`📊 Total events in database: ${eventCount}`);

    // Test 2: Find a specific event by customId
    const testEvent = await Event.findOne({ customId: 'waves-of-the-mind' });
    if (testEvent) {
      console.log(`✅ Found test event: ${testEvent.title}`);
      console.log(`   ID: ${testEvent.customId}`);
      console.log(`   Type: ${testEvent.type}`);
      console.log(`   Team Size: ${testEvent.teamSize.min}-${testEvent.teamSize.max}`);
    } else {
      console.log('❌ Test event not found');
    }

    // Test 3: List a few events
    const sampleEvents = await Event.find().limit(5).select('title customId type');
    console.log('\n📋 Sample events:');
    sampleEvents.forEach(event => {
      console.log(`   - ${event.title} (${event.customId}) - ${event.type}`);
    });

    console.log('\n🎉 Registration system test completed!');
    console.log('💡 You can now test registration in the frontend');

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run test if this script is executed directly
if (require.main === module) {
  testRegistration()
    .then(() => {
      console.log('🏁 Test script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testRegistration };
