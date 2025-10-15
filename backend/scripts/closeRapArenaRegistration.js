const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

const closeRapArenaRegistration = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update the Rap Arena event
    const result = await Event.findOneAndUpdate(
      { title: 'Gardenia 2K25: The Rap Arena' },
      { $set: { registrationOpen: false } },
      { new: true }
    );

    if (result) {
      console.log('\n✅ Successfully closed registration for Rap Arena event');
      console.log('\nEvent Details:');
      console.log('- Title:', result.title);
      console.log('- ID:', result._id);
      console.log('- Custom ID:', result.customId);
      console.log('- Registration Open:', result.registrationOpen);
    } else {
      console.log('\n❌ Rap Arena event not found in database');
      console.log('\nPlease make sure the event exists with the exact title: "Gardenia 2K25: The Rap Arena"');
    }

  } catch (error) {
    console.error('\n❌ Error closing registration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
closeRapArenaRegistration();












