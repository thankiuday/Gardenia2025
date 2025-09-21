#!/usr/bin/env node

/**
 * Test PDF Download Script
 * Tests the actual PDF download and validates the content
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const { uploadTicketToS3 } = require('../utils/s3Upload');
const config = require('../config');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing PDF Download Content for Gardenia 2025');
console.log('================================================\n');

async function testPDFDownload() {
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

    // Test the download endpoint and save the file
    console.log('\n🔍 Testing PDF download and content validation...');
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

    // Download the file and save it locally for validation
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        console.log(`📊 Content-Disposition: ${res.headers['content-disposition']}`);
        
        if (res.statusCode !== 200) {
          console.log(`❌ Download endpoint returned status: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        // Save the downloaded file
        const testFilePath = path.join(__dirname, `test-${regId}.pdf`);
        const writeStream = fs.createWriteStream(testFilePath);
        
        res.pipe(writeStream);
        
        writeStream.on('finish', () => {
          console.log(`✅ PDF downloaded and saved: ${testFilePath}`);
          
          // Validate the PDF content
          try {
            const downloadedBuffer = fs.readFileSync(testFilePath);
            console.log(`📊 Downloaded file size: ${downloadedBuffer.length} bytes`);
            
            // Check if it's a valid PDF (starts with %PDF)
            if (downloadedBuffer.toString('ascii', 0, 4) === '%PDF') {
              console.log('✅ Downloaded file is a valid PDF');
            } else {
              console.log('❌ Downloaded file is NOT a valid PDF');
              console.log('First 20 bytes:', downloadedBuffer.toString('ascii', 0, 20));
            }
            
            // Compare with original
            if (downloadedBuffer.length === pdfBuffer.length) {
              console.log('✅ Downloaded file size matches original');
            } else {
              console.log(`❌ Size mismatch: Original ${pdfBuffer.length} bytes, Downloaded ${downloadedBuffer.length} bytes`);
            }
            
            // Clean up test file
            fs.unlinkSync(testFilePath);
            console.log('✅ Test file cleaned up');
            
          } catch (error) {
            console.error('❌ Error validating PDF:', error.message);
          }
          
          resolve();
        });
        
        writeStream.on('error', (error) => {
          console.error('❌ Error writing file:', error.message);
          reject(error);
        });
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

    console.log('\n🎉 PDF Download Test COMPLETED!');
    console.log('================================');
    console.log(`✅ Registration ID: ${regId}`);
    console.log(`✅ S3 URL: ${pdfUrl}`);
    console.log(`✅ Download Endpoint: ${downloadUrl}`);
    console.log('\n💡 PDF download and validation completed successfully!');

  } catch (error) {
    console.error('\n❌ PDF Download Test FAILED!');
    console.error('==============================');
    console.error(`Error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🏁 Test script completed');
  }
}

// Run the test
testPDFDownload();
