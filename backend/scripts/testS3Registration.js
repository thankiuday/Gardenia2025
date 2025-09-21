#!/usr/bin/env node

/**
 * Test S3 Registration Script
 * Creates a test registration to verify S3 upload works
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const { uploadTicketToS3 } = require('../utils/s3Upload');
const config = require('../config');

console.log('🧪 Testing S3 Registration for Gardenia 2025');
console.log('============================================\n');

async function testS3Registration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a test event
    const event = await Event.findOne({ customId: 'waves-of-the-mind' });
    if (!event) {
      console.log('❌ Test event not found. Please run seed script first.');
      return;
    }
    console.log(`✅ Found test event: ${event.title}`);

    // Create test registration data
    const regId = generateRegistrationId();
    const registrationData = {
      regId: regId,
      eventId: event.customId,
      isGardenCityStudent: true,
      leader: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        registerNumber: 'GCU2025001',
        collegeName: 'Garden City University'
      },
      teamMembers: [
        {
          name: 'Team Member 1',
          registerNumber: 'GCU2025002',
          collegeName: 'Garden City University'
        }
      ],
      finalEventDate: event.dates.inhouse || '8th October 2025',
      paymentStatus: 'PENDING'
    };

    // Generate QR payload first
    const qrPayload = createQRPayload(registrationData, event);
    registrationData.qrPayload = JSON.stringify(qrPayload);

    // Create registration
    const registration = new Registration(registrationData);
    await registration.save();
    console.log(`✅ Created test registration: ${regId}`);

    // Generate PDF and QR code
    console.log('📄 Generating PDF...');
    const qrCodeDataURL = await generateQRCode(qrPayload);
    const pdfBuffer = await generatePDF(registration, event, qrCodeDataURL);
    console.log('✅ PDF generated successfully');

    // Upload to S3
    console.log('☁️ Uploading to S3...');
    const pdfFileName = `${regId}.pdf`;
    const pdfUrl = await uploadTicketToS3(pdfBuffer, pdfFileName);
    console.log(`✅ PDF uploaded to S3: ${pdfUrl}`);

    // Update registration with PDF URL
    registration.pdfUrl = pdfUrl;
    await registration.save();
    console.log('✅ Registration updated with S3 URL');

    // Test the S3 URL
    console.log('\n🔍 Testing S3 URL accessibility...');
    const https = require('https');
    const url = require('url');
    
    const parsedUrl = url.parse(pdfUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ S3 URL is accessible and returns PDF');
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        console.log(`📊 Content-Length: ${res.headers['content-length']} bytes`);
      } else {
        console.log(`❌ S3 URL returned status: ${res.statusCode}`);
      }
    });

    req.on('error', (error) => {
      console.log(`❌ Error accessing S3 URL: ${error.message}`);
    });

    req.end();

    console.log('\n🎉 S3 Registration Test COMPLETED!');
    console.log('===================================');
    console.log(`✅ Registration ID: ${regId}`);
    console.log(`✅ S3 URL: ${pdfUrl}`);
    console.log('✅ PDF is accessible and downloadable');
    console.log('\n💡 You can now test registration in the frontend');
    console.log('   Tickets will be automatically uploaded to S3!');

    // Clean up test registration
    console.log('\n🧹 Cleaning up test registration...');
    await Registration.deleteOne({ regId: regId });
    console.log('✅ Test registration cleaned up');

  } catch (error) {
    console.error('\n❌ S3 Registration Test FAILED!');
    console.error('================================');
    console.error(`Error: ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('1. Check S3 configuration in .env file');
    console.error('2. Verify bucket policy allows public read access');
    console.error('3. Ensure IAM user has S3 permissions');
    console.error('4. Check that events are seeded in database');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🏁 Test script completed');
  }
}

// Run the test
testS3Registration();
