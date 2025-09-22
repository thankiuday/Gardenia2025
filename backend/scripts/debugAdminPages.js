const mongoose = require('mongoose');
const config = require('../config');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Event = require('../models/Event');

const debugAdminPages = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Debugging Admin Pages Data...\n');

    // Test 1: Check individual registration with event population
    console.log('1. 🔍 Testing Individual Registration Population:');
    
    const sampleRegistration = await Registration.findOne()
      .populate('eventId', 'title category type customId');
    
    console.log(`   Sample Registration: ${sampleRegistration.regId}`);
    console.log(`   EventId: ${sampleRegistration.eventId}`);
    console.log(`   Event Title: ${sampleRegistration.eventId?.title || 'NULL'}`);
    console.log(`   Event CustomId: ${sampleRegistration.eventId?.customId || 'NULL'}`);

    // Test 2: Check if eventId is ObjectId or String
    console.log('\n2. 🔍 Checking EventId Types:');
    
    const registrations = await Registration.find().limit(5);
    registrations.forEach((reg, index) => {
      console.log(`   ${index + 1}. ${reg.regId}:`);
      console.log(`      EventId: ${reg.eventId} (type: ${typeof reg.eventId})`);
      console.log(`      Is ObjectId: ${reg.eventId instanceof mongoose.Types.ObjectId}`);
    });

    // Test 3: Test direct event lookup
    console.log('\n3. 🔍 Testing Direct Event Lookup:');
    
    const regWithEventId = await Registration.findOne({ eventId: { $exists: true } });
    if (regWithEventId) {
      console.log(`   Registration: ${regWithEventId.regId}`);
      console.log(`   EventId: ${regWithEventId.eventId}`);
      
      // Try to find the event directly
      const event = await Event.findById(regWithEventId.eventId);
      console.log(`   Direct Event Lookup: ${event ? event.title : 'NOT FOUND'}`);
      
      // Try to find by customId if it's a string
      if (typeof regWithEventId.eventId === 'string') {
        const eventByCustomId = await Event.findOne({ customId: regWithEventId.eventId });
        console.log(`   Event by CustomId: ${eventByCustomId ? eventByCustomId.title : 'NOT FOUND'}`);
      }
    }

    // Test 4: Test the aggregation pipeline step by step
    console.log('\n4. 🔍 Testing Aggregation Pipeline:');
    
    const testReg = await Registration.findOne();
    console.log(`   Test Registration: ${testReg.regId}`);
    console.log(`   EventId: ${testReg.eventId}`);
    
    // Step 1: First lookup by _id
    const step1 = await Registration.aggregate([
      { $match: { _id: testReg._id } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      }
    ]);
    
    console.log(`   Step 1 - Lookup by _id: ${step1[0]?.event?.length || 0} results`);
    if (step1[0]?.event?.length > 0) {
      console.log(`     Event found: ${step1[0].event[0].title}`);
    }
    
    // Step 2: Second lookup by customId
    const step2 = await Registration.aggregate([
      { $match: { _id: testReg._id } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      }
    ]);
    
    console.log(`   Step 2 - Lookup by customId: ${step2[0]?.eventByCustomId?.length || 0} results`);
    if (step2[0]?.eventByCustomId?.length > 0) {
      console.log(`     Event found: ${step2[0].eventByCustomId[0].title}`);
    }

    // Test 5: Check what events exist
    console.log('\n5. 🔍 Checking Available Events:');
    
    const events = await Event.find().select('_id customId title').limit(5);
    console.log(`   Total Events: ${await Event.countDocuments()}`);
    console.log('   Sample Events:');
    events.forEach((event, index) => {
      console.log(`     ${index + 1}. ${event.title} (ID: ${event._id}, CustomId: ${event.customId})`);
    });

    // Test 6: Check registrations with valid event references
    console.log('\n6. 🔍 Checking Valid Event References:');
    
    const validRegistrations = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $match: {
          'event.0': { $exists: true }
        }
      },
      {
        $count: 'validCount'
      }
    ]);
    
    const validCount = validRegistrations[0]?.validCount || 0;
    console.log(`   Registrations with valid _id references: ${validCount}`);
    
    const validCustomIdRegistrations = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $match: {
          'eventByCustomId.0': { $exists: true }
        }
      },
      {
        $count: 'validCount'
      }
    ]);
    
    const validCustomIdCount = validCustomIdRegistrations[0]?.validCount || 0;
    console.log(`   Registrations with valid customId references: ${validCustomIdCount}`);

    // Test 7: Test the complete aggregation
    console.log('\n7. 🔍 Testing Complete Aggregation:');
    
    const completeAggregation = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $addFields: {
          event: {
            $cond: {
              if: { $gt: [{ $size: '$event' }, 0] },
              then: '$event',
              else: '$eventByCustomId'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          regId: 1,
          'leader.name': 1,
          'event.title': 1,
          'event.customId': 1,
          eventId: 1
        }
      },
      {
        $limit: 5
      }
    ]);
    
    console.log('   Complete Aggregation Results:');
    completeAggregation.forEach((reg, index) => {
      console.log(`     ${index + 1}. ${reg.regId} - ${reg.leader.name}`);
      console.log(`        EventId: ${reg.eventId}`);
      console.log(`        Event Title: ${reg.event?.title || 'NULL'}`);
      console.log(`        Event CustomId: ${reg.event?.customId || 'NULL'}`);
    });

  } catch (error) {
    console.error('❌ Error debugging admin pages:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

debugAdminPages().catch(console.error);
