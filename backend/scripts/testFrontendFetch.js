#!/usr/bin/env node

/**
 * Test Frontend Fetch Download Script
 * Simulates the exact frontend fetch approach for downloading PDFs
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

console.log('🧪 Testing Frontend Fetch Download for Gardenia 2025');
console.log('===================================================\n');

async function testFrontendFetch() {
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

    // Simulate frontend fetch approach
    console.log('\n🔍 Simulating frontend fetch download...');
    const http = require('http');
    const url = require('url');
    
    const downloadUrl = `http://localhost:5000/api/register/${regId}/pdf`;
    const fileName = `Gardenia2025-Ticket-${regId}.pdf`;
    console.log(`📥 Frontend fetch URL: ${downloadUrl}`);
    
    const parsedUrl = url.parse(downloadUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    };

    // Test the fetch approach
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        console.log(`📊 Content-Disposition: ${res.headers['content-disposition']}`);
        console.log(`📊 Content-Length: ${res.headers['content-length']}`);
        console.log(`📊 Accept-Ranges: ${res.headers['accept-ranges']}`);
        console.log(`📊 Content-Transfer-Encoding: ${res.headers['content-transfer-encoding']}`);
        
        if (res.statusCode !== 200) {
          console.log(`❌ Fetch failed with status: ${res.statusCode}`);
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

        // Collect the response data as binary
        const chunks = [];
        
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          try {
            // Combine chunks into buffer
            const responseBuffer = Buffer.concat(chunks);
            console.log(`📊 Response buffer size: ${responseBuffer.length} bytes`);
            
            // Check if it looks like a PDF
            if (responseBuffer.toString('ascii', 0, 4) === '%PDF') {
              console.log('✅ Response buffer is a valid PDF');
            } else {
              console.log('❌ Response buffer is NOT a valid PDF');
              console.log('First 20 bytes:', responseBuffer.toString('ascii', 0, 20));
            }
            
            // Compare with original
            if (responseBuffer.length === pdfBuffer.length) {
              console.log('✅ Response buffer size matches original');
            } else {
              console.log(`❌ Size mismatch: Original ${pdfBuffer.length} bytes, Response ${responseBuffer.length} bytes`);
            }
            
            // Save the response as a file to test
            const testFilePath = path.join(__dirname, `frontend-test-${regId}.pdf`);
            fs.writeFileSync(testFilePath, responseBuffer);
            console.log(`✅ Response saved to: ${testFilePath}`);
            
            // Clean up test file
            fs.unlinkSync(testFilePath);
            console.log('✅ Test file cleaned up');
            
          } catch (error) {
            console.error('❌ Error processing response:', error.message);
          }
          
          resolve();
        });

        res.on('error', (error) => {
          console.error('❌ Error reading response:', error.message);
          reject(error);
        });
      });

      req.on('error', (error) => {
        console.log(`❌ Error making request: ${error.message}`);
        reject(error);
      });

      req.end();
    });

    // Clean up test registration
    console.log('\n🧹 Cleaning up test registration...');
    await Registration.deleteOne({ regId: regId });
    console.log('✅ Test registration cleaned up');

    console.log('\n🎉 Frontend Fetch Test COMPLETED!');
    console.log('==================================');
    console.log(`✅ Registration ID: ${regId}`);
    console.log(`✅ S3 URL: ${pdfUrl}`);
    console.log(`✅ Download Endpoint: ${downloadUrl}`);
    console.log('\n💡 Frontend fetch simulation completed successfully!');

  } catch (error) {
    console.error('\n❌ Frontend Fetch Test FAILED!');
    console.error('================================');
    console.error(`Error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🏁 Test script completed');
  }
}

// Run the test
testFrontendFetch();
