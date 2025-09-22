const mongoose = require('mongoose');
const config = require('../config');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const fixEventReferences = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Fixing Event References in Registrations...\n');

    // Get all events
    const events = await Event.find().select('_id customId title');
    console.log(`📅 Found ${events.length} events in database`);

    // Create a mapping of customId to _id
    const customIdToIdMap = {};
    events.forEach(event => {
      customIdToIdMap[event.customId] = event._id;
    });

    console.log('\n📋 Event ID Mapping:');
    Object.entries(customIdToIdMap).forEach(([customId, id]) => {
      console.log(`   ${customId} -> ${id}`);
    });

    // Get all registrations
    const registrations = await Registration.find().select('_id regId eventId leader.name');
    console.log(`\n📊 Found ${registrations.length} registrations`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const registration of registrations) {
      try {
        const currentEventId = registration.eventId;
        
        // Check if eventId is a string (customId) instead of ObjectId
        if (typeof currentEventId === 'string' && customIdToIdMap[currentEventId]) {
          console.log(`🔧 Fixing registration ${registration.regId} (${registration.leader.name}): ${currentEventId} -> ${customIdToIdMap[currentEventId]}`);
          
          registration.eventId = customIdToIdMap[currentEventId];
          await registration.save();
          fixedCount++;
        } else if (typeof currentEventId === 'string' && !customIdToIdMap[currentEventId]) {
          console.log(`⚠️  Registration ${registration.regId} has unknown eventId: ${currentEventId}`);
          errorCount++;
        }
        // If eventId is already an ObjectId, leave it as is
      } catch (error) {
        console.log(`❌ Error fixing registration ${registration.regId}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Fix completed:`);
    console.log(`   Fixed: ${fixedCount} registrations`);
    console.log(`   Errors: ${errorCount} registrations`);
    console.log(`   Total: ${registrations.length} registrations`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const registrationsWithValidEvents = await Registration.find({
      eventId: { $exists: true, $ne: null }
    }).populate('eventId', 'title customId');

    console.log(`✅ Registrations with valid event references: ${registrationsWithValidEvents.length}`);
    
    if (registrationsWithValidEvents.length > 0) {
      console.log('\n📋 Sample registrations with valid events:');
      registrationsWithValidEvents.slice(0, 5).forEach((reg, index) => {
        console.log(`   ${index + 1}. ${reg.leader.name} - ${reg.eventId?.title || 'N/A'} (${reg.eventId?.customId || 'N/A'})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

fixEventReferences().catch(console.error);
