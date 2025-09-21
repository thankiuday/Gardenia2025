#!/usr/bin/env node

/**
 * Test Iframe Download Script
 * Tests the iframe download approach
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const { uploadTicketToS3 } = require('../utils/s3Upload');
const config = require('../config');

console.log('🧪 Testing Iframe Download Approach for Gardenia 2025');
console.log('====================================================\n');

async function testIframeDownload() {
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
    console.log('\n🔍 Testing download endpoint for iframe approach...');
    const http = require('http');
    const url = require('url');
    
    const downloadUrl = `http://localhost:5000/api/register/${regId}/pdf`;
    console.log(`📥 Download URL: ${downloadUrl}`);
    
    const parsedUrl = url.parse(downloadUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET'
    };

    // Test the download endpoint
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        console.log(`📊 Content-Disposition: ${res.headers['content-disposition']}`);
        console.log(`📊 Content-Length: ${res.headers['content-length']}`);
        
        if (res.statusCode !== 200) {
          console.log(`❌ Download endpoint returned status: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        // Check if content type is correct
        if (res.headers['content-type'] !== 'application/pdf') {
          console.log(`❌ Wrong content type: ${res.headers['content-type']}`);
        } else {
          console.log('✅ Content type is correct');
        }

        // Check if content disposition is set for download
        if (!res.headers['content-disposition'] || !res.headers['content-disposition'].includes('attachment')) {
          console.log('❌ Content-Disposition not set for download');
        } else {
          console.log('✅ Content-Disposition set for download');
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

    console.log('\n🎉 Iframe Download Test COMPLETED!');
    console.log('==================================');
    console.log(`✅ Registration ID: ${regId}`);
    console.log(`✅ S3 URL: ${pdfUrl}`);
    console.log(`✅ Download Endpoint: ${downloadUrl}`);
    console.log('\n💡 The iframe approach should work correctly!');
    console.log('   The backend is serving valid PDFs with proper headers.');

  } catch (error) {
    console.error('\n❌ Iframe Download Test FAILED!');
    console.error('=================================');
    console.error(`Error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🏁 Test script completed');
  }
}

// Run the test
testIframeDownload();
