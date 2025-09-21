#!/usr/bin/env node

/**
 * S3 Setup Script for Gardenia 2025
 * This script helps you configure S3 for ticket storage
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Gardenia 2025 - S3 Setup Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 S3 Configuration Required:');
console.log('==============================');
console.log('To enable S3 ticket storage, you need to:');
console.log('');
console.log('1. Create an AWS S3 bucket:');
console.log('   - Go to AWS S3 Console');
console.log('   - Create a new bucket (e.g., "gardenia2025-assets")');
console.log('   - Enable public read access for the bucket');
console.log('');
console.log('2. Create IAM user with S3 permissions:');
console.log('   - Go to AWS IAM Console');
console.log('   - Create a new user with programmatic access');
console.log('   - Attach policy: AmazonS3FullAccess (or custom policy)');
console.log('   - Save the Access Key ID and Secret Access Key');
console.log('');
console.log('3. Update your .env file with:');
console.log('   AWS_ACCESS_KEY_ID=your-actual-access-key-id');
console.log('   AWS_SECRET_ACCESS_KEY=your-actual-secret-access-key');
console.log('   AWS_REGION=us-east-1');
console.log('   S3_BUCKET_NAME=your-bucket-name');
console.log('');
console.log('4. Restart the backend server');
console.log('');
console.log('🔧 Current Status:');
console.log('==================');

// Check current environment variables
const requiredVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY', 
  'AWS_REGION',
  'S3_BUCKET_NAME'
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `your-${varName.toLowerCase().replace(/_/g, '-')}`) {
    console.log(`✅ ${varName}: Configured`);
  } else {
    console.log(`❌ ${varName}: Not configured`);
    allConfigured = false;
  }
});

if (allConfigured) {
  console.log('\n🎉 S3 is properly configured!');
  console.log('Tickets will be stored in S3 bucket.');
} else {
  console.log('\n⚠️  S3 is not configured yet.');
  console.log('Tickets will be stored locally until S3 is configured.');
}

console.log('\n📚 For detailed setup instructions, see:');
console.log('   - S3_SETUP_GUIDE.md');
console.log('   - backend/S3_TICKET_STORAGE.md');
console.log('');
console.log('🏁 Setup script completed!');
