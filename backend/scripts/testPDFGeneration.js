const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generatePDF } = require('../utils/pdfGen');
const { generateProperPDF } = require('../utils/properPdfGen');
const { generateQRCode, createQRPayload } = require('../utils/qrGen');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardenia2025');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test PDF Generation for Outside Students
const testPDFGeneration = async () => {
  try {
    console.log('🔍 Testing PDF Generation for Outside Students...\n');

    // Find an existing event
    const event = await Event.findOne();
    if (!event) {
      console.log('❌ No events found. Please create an event first.');
      return;
    }

    console.log('📅 Using event:', event.title);

    // Create test data for outside student
    const testRegistrationData = {
      regId: 'GDN2025-PDFTEST001',
      registrationId: 'GDN2025-PDFTEST001',
      eventId: event._id,
      isGardenCityStudent: false,
      leader: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        collegeName: 'ABC Engineering College',
        collegeRegisterNumber: 'ABC2024001'
      },
      teamMembers: [
        {
          name: 'Jane Smith',
          collegeName: 'XYZ University',
          collegeRegisterNumber: 'XYZ2024002'
        },
        {
          name: 'Bob Johnson',
          collegeName: 'DEF Institute of Technology',
          collegeRegisterNumber: 'DEF2024003'
        }
      ],
      finalEventDate: event.dates.outside,
      status: 'APPROVED'
    };

    // Generate QR code
    console.log('📱 Generating QR code...');
    const qrPayload = createQRPayload(testRegistrationData, event);
    const qrCodeDataURL = await generateQRCode(qrPayload);
    console.log('✅ QR Code generated successfully');

    // Test both PDF generation methods
    console.log('\n🔧 Testing PDF generation methods...');

    // Test 1: Puppeteer PDF generation
    try {
      console.log('📄 Testing Puppeteer PDF generation...');
      const puppeteerPDF = await generatePDF(testRegistrationData, event, qrCodeDataURL);
      
      // Save test PDF
      const puppeteerPath = path.join(__dirname, '../uploads/test-outside-student-puppeteer.pdf');
      fs.writeFileSync(puppeteerPath, puppeteerPDF);
      console.log('✅ Puppeteer PDF generated successfully:', puppeteerPath);
    } catch (puppeteerError) {
      console.log('⚠️ Puppeteer PDF generation failed:', puppeteerError.message);
    }

    // Test 2: html-pdf-node PDF generation
    try {
      console.log('📄 Testing html-pdf-node PDF generation...');
      const properPDF = await generateProperPDF(testRegistrationData, event, qrCodeDataURL);
      
      // Save test PDF
      const properPath = path.join(__dirname, '../uploads/test-outside-student-proper.pdf');
      fs.writeFileSync(properPath, properPDF);
      console.log('✅ html-pdf-node PDF generated successfully:', properPath);
    } catch (properError) {
      console.log('⚠️ html-pdf-node PDF generation failed:', properError.message);
    }

    // Display test data for verification
    console.log('\n📋 Test Registration Data:');
    console.log('   - Student Type: Outside Student');
    console.log('   - Leader Name:', testRegistrationData.leader.name);
    console.log('   - Leader College/School:', testRegistrationData.leader.collegeName);
    console.log('   - Leader Registration Number:', testRegistrationData.leader.collegeRegisterNumber);
    console.log('   - Team Members:', testRegistrationData.teamMembers.length);
    
    testRegistrationData.teamMembers.forEach((member, index) => {
      console.log(`     - Member ${index + 1}: ${member.name}`);
      console.log(`       College/School: ${member.collegeName}`);
      console.log(`       Registration Number: ${member.collegeRegisterNumber}`);
    });

    console.log('\n✅ PDF Generation test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Check the generated PDF files in the uploads folder');
    console.log('   2. Verify that outside student registration numbers are displayed correctly');
    console.log('   3. Test the registration form to create a real outside student registration');
    console.log('   4. Download the generated ticket and verify all information is correct');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testPDFGeneration();
  await mongoose.connection.close();
  console.log('\n👋 Test completed. Database connection closed.');
};

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPDFGeneration };
