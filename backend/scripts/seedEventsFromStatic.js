const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Import the static events data
const { allEvents } = require('../../frontend/src/data/events');

const seedEventsFromStatic = async () => {
  try {
    console.log('🌱 Starting to seed events from static data...');
    
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing events');

    let successCount = 0;
    let errorCount = 0;

    for (const eventData of allEvents) {
      try {
        // Clean and validate the data
        const cleanedEventData = {
          customId: eventData.id, // Use the string ID as customId
          title: eventData.title,
          category: eventData.category,
          type: eventData.type === 'Individual/Group' ? 'Individual' : eventData.type, // Fix invalid type
          teamSize: eventData.teamSize,
          department: eventData.department,
          club: eventData.club || '',
          time: eventData.time,
          dates: eventData.dates,
          description: eventData.description,
          eligibility: eventData.eligibility,
          rules: eventData.rules,
          contacts: eventData.contacts.map(contact => ({
            name: contact.name,
            phone: contact.phone || '', // Handle empty phone numbers
            role: contact.role
          }))
        };

        // Create event with cleaned data
        const event = new Event(cleanedEventData);
        await event.save();
        console.log(`✅ Created event: ${eventData.title} (ID: ${eventData.id})`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error creating event ${eventData.title}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Successfully created: ${successCount} events`);
    console.log(`❌ Failed to create: ${errorCount} events`);
    console.log(`📋 Total processed: ${allEvents.length} events`);

    if (successCount > 0) {
      console.log('\n🎉 Events seeded successfully!');
      console.log('💡 You can now register for events using their string IDs');
    }

  } catch (error) {
    console.error('💥 Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  seedEventsFromStatic()
    .then(() => {
      console.log('🏁 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedEventsFromStatic };
