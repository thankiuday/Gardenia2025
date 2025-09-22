const mongoose = require('mongoose');
const config = require('../config');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const debugEventIds = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Debugging Event IDs...\n');

    // Get all events
    const events = await Event.find().select('_id customId title');
    console.log(`📅 Total Events: ${events.length}`);
    
    const eventIds = events.map(e => e._id.toString());
    console.log('\n📋 Event ObjectIds:');
    eventIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    // Get all registrations and their eventIds
    const registrations = await Registration.find().select('_id regId eventId leader.name');
    console.log(`\n📊 Total Registrations: ${registrations.length}`);
    
    console.log('\n📋 Registration EventIds:');
    const uniqueEventIds = new Set();
    registrations.forEach((reg, index) => {
      const eventId = reg.eventId ? reg.eventId.toString() : 'NULL';
      uniqueEventIds.add(eventId);
      
      if (index < 10) { // Show first 10
        console.log(`   ${index + 1}. ${reg.regId} - ${reg.leader.name} - EventID: ${eventId}`);
      }
    });

    console.log('\n📈 Unique EventIds in Registrations:');
    Array.from(uniqueEventIds).forEach((eventId, index) => {
      const isInEvents = eventIds.includes(eventId);
      console.log(`   ${index + 1}. ${eventId} ${isInEvents ? '✅' : '❌'}`);
    });

    // Check which registrations have valid event references
    const validRegistrations = registrations.filter(reg => {
      if (!reg.eventId) return false;
      return eventIds.includes(reg.eventId.toString());
    });

    console.log(`\n✅ Registrations with valid event references: ${validRegistrations.length}/${registrations.length}`);

    // Check which registrations have invalid event references
    const invalidRegistrations = registrations.filter(reg => {
      if (!reg.eventId) return true;
      return !eventIds.includes(reg.eventId.toString());
    });

    console.log(`❌ Registrations with invalid event references: ${invalidRegistrations.length}/${registrations.length}`);

    if (invalidRegistrations.length > 0) {
      console.log('\n📋 Invalid Event References:');
      invalidRegistrations.slice(0, 10).forEach((reg, index) => {
        console.log(`   ${index + 1}. ${reg.regId} - ${reg.leader.name} - EventID: ${reg.eventId}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

debugEventIds().catch(console.error);
