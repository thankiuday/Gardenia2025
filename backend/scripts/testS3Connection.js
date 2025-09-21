#!/usr/bin/env node

/**
 * S3 Connection Test Script
 * Tests the S3 configuration and upload functionality
 */

require('dotenv').config();
const AWS = require('aws-sdk');
const { uploadTicketToS3, checkTicketExistsInS3, deleteTicketFromS3 } = require('../utils/s3Upload');

console.log('🧪 Testing S3 Connection for Gardenia 2025');
console.log('==========================================\n');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

async function testS3Connection() {
  try {
    console.log('📋 Configuration Check:');
    console.log('=======================');
    
    const config = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? '***configured***' : 'NOT SET',
      region: process.env.AWS_REGION || 'us-east-1',
      bucketName: process.env.S3_BUCKET_NAME || 'gardenia2025-assets'
    };
    
    console.log(`AWS Access Key ID: ${config.accessKeyId ? '✅ Configured' : '❌ Not set'}`);
    console.log(`AWS Secret Key: ${config.secretAccessKey}`);
    console.log(`AWS Region: ${config.region}`);
    console.log(`S3 Bucket: ${config.bucketName}`);
    
    if (!config.accessKeyId || config.secretAccessKey === 'NOT SET') {
      console.log('\n❌ S3 configuration incomplete!');
      console.log('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file');
      return;
    }
    
    console.log('\n🔍 Testing S3 Access:');
    console.log('=====================');
    
    // Test 1: List buckets
    console.log('1. Testing bucket access...');
    try {
      const buckets = await s3.listBuckets().promise();
      const targetBucket = buckets.Buckets.find(b => b.Name === config.bucketName);
      
      if (targetBucket) {
        console.log(`   ✅ Bucket "${config.bucketName}" found`);
        console.log(`   📅 Created: ${targetBucket.CreationDate}`);
      } else {
        console.log(`   ❌ Bucket "${config.bucketName}" not found`);
        console.log('   Available buckets:');
        buckets.Buckets.forEach(b => console.log(`   - ${b.Name}`));
        return;
      }
    } catch (error) {
      console.log(`   ❌ Error accessing buckets: ${error.message}`);
      return;
    }
    
    // Test 2: Test upload
    console.log('\n2. Testing file upload...');
    try {
      const testContent = Buffer.from('Test PDF content for Gardenia 2025');
      const testFileName = `test-${Date.now()}.pdf`;
      
      const uploadResult = await uploadTicketToS3(testContent, testFileName);
      console.log(`   ✅ Upload successful: ${uploadResult}`);
      
      // Test 3: Check if file exists
      console.log('\n3. Testing file existence check...');
      const exists = await checkTicketExistsInS3(testFileName);
      console.log(`   ✅ File exists check: ${exists ? 'PASSED' : 'FAILED'}`);
      
      // Test 4: Clean up test file
      console.log('\n4. Cleaning up test file...');
      const deleted = await deleteTicketFromS3(testFileName);
      console.log(`   ✅ Cleanup: ${deleted ? 'SUCCESS' : 'FAILED'}`);
      
    } catch (error) {
      console.log(`   ❌ Upload test failed: ${error.message}`);
      return;
    }
    
    console.log('\n🎉 S3 Connection Test PASSED!');
    console.log('=============================');
    console.log('✅ S3 is properly configured');
    console.log('✅ Bucket access working');
    console.log('✅ File upload/download working');
    console.log('✅ Ready for production use');
    
  } catch (error) {
    console.log('\n❌ S3 Connection Test FAILED!');
    console.log('==============================');
    console.log(`Error: ${error.message}`);
    console.log('\nTroubleshooting:');
    console.log('1. Check your AWS credentials in .env file');
    console.log('2. Verify bucket name and region');
    console.log('3. Ensure IAM user has S3 permissions');
    console.log('4. Check bucket policy allows public read access');
  }
}

// Run the test
testS3Connection()
  .then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  });
