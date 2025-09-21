#!/usr/bin/env node

/**
 * Test Download Endpoint Script
 * Tests the backend download endpoint to ensure it serves files correctly
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const { uploadTicketToS3 } = require('../utils/s3Upload');
const config = require('../config');

console.log('🧪 Testing Download Endpoint for Gardenia 2025');
console.log('==============================================\n');

async function testDownloadEndpoint() {
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

    // Test the download endpoint
    console.log('\n🔍 Testing download endpoint...');
    const http = require('http');
    const url = require('url');
    
    const downloadUrl = `http://localhost:5000/api/register/${regId}/pdf`;
    console.log(`📥 Testing: ${downloadUrl}`);
    
    const parsedUrl = url.parse(downloadUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET'
    };

    // Make the test synchronous
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        console.log(`📊 Content-Disposition: ${res.headers['content-disposition']}`);
        
        if (res.statusCode === 200) {
          console.log('✅ Download endpoint working correctly');
          console.log('✅ Headers set for forced download');
        } else {
          console.log(`❌ Download endpoint returned status: ${res.statusCode}`);
        }
        resolve();
      });

      req.on('error', (error) => {
        console.log(`❌ Error testing download endpoint: ${error.message}`);
        reject(error);
      });

      req.end();
    });

    // Clean up test registration
    console.log('\n🧹 Cleaning up test registration...');
    await Registration.deleteOne({ regId: regId });
    console.log('✅ Test registration cleaned up');

    console.log('\n🎉 Download Endpoint Test COMPLETED!');
    console.log('=====================================');
    console.log(`✅ Registration ID: ${regId}`);
    console.log(`✅ S3 URL: ${pdfUrl}`);
    console.log(`✅ Download Endpoint: ${downloadUrl}`);
    console.log('\n💡 You can now test registration in the frontend');
    console.log('   Downloads will be served through the backend endpoint!');

  } catch (error) {
    console.error('\n❌ Download Endpoint Test FAILED!');
    console.error('==================================');
    console.error(`Error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🏁 Test script completed');
  }
}

// Run the test
testDownloadEndpoint();
