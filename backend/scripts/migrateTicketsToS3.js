const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const { uploadTicketToS3 } = require('../utils/s3Upload');
const config = require('../config');

/**
 * Migration script to move existing local tickets to S3
 * This script will:
 * 1. Find all registrations with local PDF URLs
 * 2. Upload the PDFs to S3
 * 3. Update the registration records with S3 URLs
 */

const migrateTicketsToS3 = async () => {
  try {
    console.log('🚀 Starting ticket migration to S3...');
    
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all registrations with local PDF URLs
    const registrations = await Registration.find({
      pdfUrl: { $regex: '^/uploads/' }
    });

    console.log(`📋 Found ${registrations.length} registrations with local PDFs`);

    if (registrations.length === 0) {
      console.log('✅ No local tickets to migrate');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const registration of registrations) {
      try {
        console.log(`\n🔄 Processing registration: ${registration.regId}`);
        
        // Extract filename from local URL
        const fileName = path.basename(registration.pdfUrl);
        const localPath = path.join(__dirname, '../uploads', fileName);
        
        // Check if local file exists
        if (!fs.existsSync(localPath)) {
          console.log(`❌ Local file not found: ${localPath}`);
          errorCount++;
          continue;
        }

        // Read the PDF file
        const pdfBuffer = fs.readFileSync(localPath);
        console.log(`📄 Read PDF file: ${fileName} (${pdfBuffer.length} bytes)`);

        // Upload to S3
        const s3Url = await uploadTicketToS3(pdfBuffer, fileName);
        console.log(`☁️  Uploaded to S3: ${s3Url}`);

        // Update registration with S3 URL
        registration.pdfUrl = s3Url;
        await registration.save();
        console.log(`💾 Updated registration record`);

        successCount++;

        // Optional: Delete local file after successful upload
        // Uncomment the following lines if you want to remove local files
        // fs.unlinkSync(localPath);
        // console.log(`🗑️  Deleted local file: ${localPath}`);

      } catch (error) {
        console.error(`❌ Error processing ${registration.regId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} tickets`);
    console.log(`❌ Failed migrations: ${errorCount} tickets`);
    console.log(`📋 Total processed: ${registrations.length} tickets`);

    if (successCount > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 You can now safely remove the local uploads directory if desired');
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateTicketsToS3()
    .then(() => {
      console.log('🏁 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateTicketsToS3 };
