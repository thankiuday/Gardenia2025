const mongoose = require('mongoose');
const config = require('../config');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const checkEvents = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Checking Events and Registrations...\n');

    // Check events
    const totalEvents = await Event.countDocuments();
    console.log(`📅 Total Events in Database: ${totalEvents}`);

    if (totalEvents > 0) {
      const events = await Event.find().select('_id customId title category type');
      console.log('\n📋 Events List:');
      events.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title} (ID: ${event._id}, CustomID: ${event.customId})`);
      });
    } else {
      console.log('❌ No events found in database!');
    }

    // Check registrations and their event references
    const totalRegistrations = await Registration.countDocuments();
    console.log(`\n📊 Total Registrations: ${totalRegistrations}`);

    if (totalRegistrations > 0) {
      const registrations = await Registration.find().select('_id regId eventId leader.name');
      console.log('\n📋 Registration Event References:');
      
      const eventIdCounts = {};
      registrations.forEach((reg, index) => {
        const eventId = reg.eventId ? reg.eventId.toString() : 'NULL';
        eventIdCounts[eventId] = (eventIdCounts[eventId] || 0) + 1;
        
        if (index < 10) { // Show first 10
          console.log(`   ${index + 1}. ${reg.leader.name} - EventID: ${eventId}`);
        }
      });

      console.log('\n📈 Event ID Distribution:');
      Object.entries(eventIdCounts).forEach(([eventId, count]) => {
        console.log(`   EventID ${eventId}: ${count} registrations`);
      });

      // Check for registrations with valid event references
      const registrationsWithValidEvents = await Registration.find({
        eventId: { $exists: true, $ne: null }
      }).populate('eventId', 'title customId');

      console.log(`\n✅ Registrations with valid event references: ${registrationsWithValidEvents.length}`);
      
      if (registrationsWithValidEvents.length > 0) {
        console.log('\n📋 Sample registrations with valid events:');
        registrationsWithValidEvents.slice(0, 5).forEach((reg, index) => {
          console.log(`   ${index + 1}. ${reg.leader.name} - ${reg.eventId?.title || 'N/A'} (${reg.eventId?.customId || 'N/A'})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

checkEvents().catch(console.error);
