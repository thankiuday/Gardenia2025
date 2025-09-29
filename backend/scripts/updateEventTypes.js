const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Script to update event types for events that support both individual and group participation
const updateEventTypes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // List of events that can be both individual and group
    const flexibleEvents = [
      'badminton-singles-doubles',
      // Add more event customIds here if needed in the future
    ];

    for (const customId of flexibleEvents) {
      const event = await Event.findOne({ customId });
      if (event) {
        // Update the event to support both individual and group participation
        event.type = 'Individual/Group';
        event.participationTypes = ['Individual', 'Group'];
        
        // For badminton, set team size to 1-2 (singles or doubles)
        if (customId === 'badminton-singles-doubles') {
          event.teamSize = { min: 1, max: 2 };
        }
        
        await event.save();
        console.log(`✅ Updated ${event.title} to support Individual/Group participation`);
        console.log(`   Type: ${event.type}`);
        console.log(`   Participation Types: ${event.participationTypes.join(', ')}`);
        console.log(`   Team Size: ${event.teamSize.min}-${event.teamSize.max} members`);
      } else {
        console.log(`❌ Event with customId '${customId}' not found`);
      }
    }

    console.log('\n🎯 Event type updates completed!');
    console.log('📊 Events now support flexible participation types.');

  } catch (error) {
    console.error('Error updating event types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
updateEventTypes();
