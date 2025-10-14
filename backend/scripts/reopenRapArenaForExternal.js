const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

const reopenRapArenaForExternal = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update the Rap Arena event
    const result = await Event.findOneAndUpdate(
      { title: 'Gardenia 2K25: The Rap Arena' },
      { $set: { registrationOpen: true } },
      { new: true }
    );

    if (result) {
      console.log('\n✅ Successfully reopened registration for Rap Arena event');
      console.log('\n⚠️  IMPORTANT: Registration is now open ONLY for EXTERNAL students');
      console.log('   GCU students will be blocked from registering');
      console.log('\nEvent Details:');
      console.log('- Title:', result.title);
      console.log('- ID:', result._id);
      console.log('- Custom ID:', result.customId);
      console.log('- Registration Open:', result.registrationOpen);
      console.log('- Event Date:', '16th October 2025');
      console.log('\n📝 Note: The registration route has been updated to allow');
      console.log('   ONLY external students to register for Rap Arena.');
    } else {
      console.log('\n❌ Rap Arena event not found in database');
      console.log('\nPlease make sure the event exists with the exact title: "Gardenia 2K25: The Rap Arena"');
    }

  } catch (error) {
    console.error('\n❌ Error reopening registration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
reopenRapArenaForExternal();

