#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Run this script to test your MongoDB Atlas connection
 * Usage: node test-mongodb-connection.js
 */

require('dotenv').config();

const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');

  // Get connection string from environment
  const connectionString = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!connectionString) {
    console.error('❌ No MongoDB connection string found!');
    console.error('Please set MONGODB_URL or MONGODB_URI in your .env file');
    process.exit(1);
  }

  console.log('📋 Connection Details:');
  console.log(`   String: ${connectionString.replace(/\/\/.*@/, '//***:***@')}`);
  console.log('');

  try {
    console.log('🔌 Attempting to connect...');

    const conn = await mongoose.connect(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Test a simple operation
    console.log('\n🧪 Testing database operations...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Found ${collections.length} collections`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication Issue:');
      console.error('   - Check username and password in connection string');
      console.error('   - Verify database user exists and has correct permissions');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('\n💡 DNS/Network Issue:');
      console.error('   - Check if the hostname in connection string is correct');
      console.error('   - Verify your internet connection');
    } else if (error.message.includes('connection timed out')) {
      console.error('\n💡 Connection Timeout:');
      console.error('   - Check firewall settings');
      console.error('   - Verify IP whitelist in MongoDB Atlas');
    } else if (error.message.includes('option') && error.message.includes('not supported')) {
      console.error('\n💡 Deprecated Option Issue:');
      console.error('   - This should be fixed in the latest server.js');
      console.error('   - Try running the updated server');
    }

    console.error('\n🔧 Troubleshooting Steps:');
    console.error('   1. Verify connection string format');
    console.error('   2. Check MongoDB Atlas dashboard for IP whitelist');
    console.error('   3. Confirm database user credentials');
    console.error('   4. Check Atlas cluster status');
    console.error('   5. If recently upgraded, get new connection string from Atlas');

    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);
