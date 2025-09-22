const mongoose = require('mongoose');
const config = require('../config');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const fixEventIdTypes = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Fixing EventId Types in Registrations...\n');

    // Get all events
    const events = await Event.find().select('_id customId title');
    console.log(`📅 Found ${events.length} events in database`);

    // Create mappings
    const customIdToIdMap = {};
    const idToIdMap = {};
    
    events.forEach(event => {
      customIdToIdMap[event.customId] = event._id;
      idToIdMap[event._id.toString()] = event._id;
    });

    console.log('\n📋 Event ID Mappings:');
    console.log(`   CustomId mappings: ${Object.keys(customIdToIdMap).length}`);
    console.log(`   String ID mappings: ${Object.keys(idToIdMap).length}`);

    // Get all registrations
    const registrations = await Registration.find().select('_id regId eventId leader.name');
    console.log(`\n📊 Found ${registrations.length} registrations`);

    let fixedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const registration of registrations) {
      try {
        const currentEventId = registration.eventId;
        
        // Skip if already an ObjectId
        if (currentEventId instanceof mongoose.Types.ObjectId) {
          skippedCount++;
          continue;
        }
        
        // Skip if null or undefined
        if (!currentEventId) {
          skippedCount++;
          continue;
        }

        let newEventId = null;
        
        // Try to find by string ID first
        if (idToIdMap[currentEventId]) {
          newEventId = idToIdMap[currentEventId];
          console.log(`🔧 Fixing ${registration.regId}: String ID ${currentEventId} -> ObjectId ${newEventId}`);
        }
        // Try to find by customId
        else if (customIdToIdMap[currentEventId]) {
          newEventId = customIdToIdMap[currentEventId];
          console.log(`🔧 Fixing ${registration.regId}: CustomId ${currentEventId} -> ObjectId ${newEventId}`);
        }
        // If not found, set to null
        else {
          console.log(`⚠️  Registration ${registration.regId} has unknown eventId: ${currentEventId}`);
          newEventId = null;
          errorCount++;
        }

        // Update the registration
        if (newEventId !== null) {
          registration.eventId = newEventId;
          await registration.save();
          fixedCount++;
        } else {
          // Set to null for unknown eventIds
          registration.eventId = null;
          await registration.save();
        }
        
      } catch (error) {
        console.log(`❌ Error fixing registration ${registration.regId}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Fix completed:`);
    console.log(`   Fixed: ${fixedCount} registrations`);
    console.log(`   Errors: ${errorCount} registrations`);
    console.log(`   Skipped: ${skippedCount} registrations`);
    console.log(`   Total: ${registrations.length} registrations`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    
    // Check ObjectId types
    const registrationsWithObjectIds = await Registration.find({
      eventId: { $type: 'objectId' }
    }).countDocuments();
    
    const registrationsWithStrings = await Registration.find({
      eventId: { $type: 'string' }
    }).countDocuments();
    
    const registrationsWithNulls = await Registration.find({
      eventId: null
    }).countDocuments();

    console.log(`   Registrations with ObjectId eventIds: ${registrationsWithObjectIds}`);
    console.log(`   Registrations with string eventIds: ${registrationsWithStrings}`);
    console.log(`   Registrations with null eventIds: ${registrationsWithNulls}`);

    // Test population
    const testRegistrations = await Registration.find({
      eventId: { $exists: true, $ne: null }
    }).populate('eventId', 'title customId').limit(5);

    console.log(`\n📋 Sample registrations with populated events:`);
    testRegistrations.forEach((reg, index) => {
      console.log(`   ${index + 1}. ${reg.regId} - ${reg.leader.name} - ${reg.eventId?.title || 'NULL'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

fixEventIdTypes().catch(console.error);
