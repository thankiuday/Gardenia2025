# S3 Setup Instructions for Gardenia 2025

## Overview
This guide will help you set up AWS S3 for storing event registration tickets instead of local storage.

## Prerequisites
- AWS Account
- AWS CLI installed (optional but recommended)

## Step 1: Create S3 Bucket

1. **Go to AWS S3 Console**
   - Log in to your AWS account
   - Navigate to S3 service

2. **Create New Bucket**
   - Click "Create bucket"
   - Bucket name: `gardenia2025-assets` (or your preferred name)
   - Region: Choose your preferred region (e.g., `us-east-1`)
   - Uncheck "Block all public access" (we need public read access for tickets)
   - Acknowledge the warning about public access
   - Click "Create bucket"

3. **Configure Bucket Policy**
   - Go to your bucket → Permissions → Bucket Policy
   - Add this policy (replace `your-bucket-name` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/tickets/*"
        }
    ]
}
```

4. **Disable Block Public Access** (Important!)
   - Go to your bucket → Permissions → Block public access
   - Click "Edit" and **UNCHECK** "Block all public access"
   - Click "Save changes"
   - Type "confirm" when prompted

## Step 2: Create IAM User

1. **Go to AWS IAM Console**
   - Navigate to IAM service
   - Click "Users" → "Create user"

2. **User Details**
   - Username: `gardenia-backend-s3`
   - Access type: "Programmatic access"

3. **Attach Policies**
   - Click "Attach existing policies directly"
   - Search and select: `AmazonS3FullAccess`
   - Click "Next" → "Create user"

4. **Save Credentials**
   - **IMPORTANT**: Save the Access Key ID and Secret Access Key
   - You won't be able to see the Secret Access Key again

## Step 3: Configure Backend

1. **Create .env file** (if not exists):
```bash
cd backend
cp env.example .env
```

2. **Update .env file** with your AWS credentials:
```bash
# AWS S3 Configuration for Ticket Storage
AWS_ACCESS_KEY_ID=your-actual-access-key-id
AWS_SECRET_ACCESS_KEY=your-actual-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gardenia2025-assets
```

3. **Restart Backend Server**:
```bash
npm start
```

## Step 4: Test S3 Integration

1. **Run the setup script**:
```bash
node scripts/setupS3.js
```

2. **Test registration**:
   - Go to frontend
   - Register for an event
   - Check backend logs for S3 upload confirmation
   - Verify ticket downloads automatically

## Step 5: Verify Setup

### Check Backend Logs
Look for these messages:
```
✅ PDF uploaded to S3: https://your-bucket.s3.region.amazonaws.com/tickets/GDN2025-1234.pdf
```

### Check S3 Bucket
- Go to your S3 bucket
- Navigate to `tickets/` folder
- Verify PDF files are being uploaded

### Test Download
- Complete a registration
- Verify the PDF downloads automatically
- Check that the download URL points to S3

## Troubleshooting

### Common Issues

1. **"S3 not configured" message**
   - Check that .env file exists and has correct values
   - Restart backend server after updating .env

2. **"Access Denied" errors**
   - Verify IAM user has S3 permissions
   - Check bucket policy allows public read access

3. **"Bucket does not exist" errors**
   - Verify bucket name in .env matches actual bucket name
   - Check AWS region is correct

4. **Files not downloading**
   - Check browser console for errors
   - Verify S3 URLs are accessible
   - Test direct S3 URL in browser

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env.AWS_ACCESS_KEY_ID ? 'Configured' : 'Not configured')"

# Test S3 connection
node scripts/testS3Connection.js

# Check bucket contents
aws s3 ls s3://your-bucket-name/tickets/ --recursive
```

## Security Notes

- **Never commit .env file** to version control
- **Use IAM roles** in production instead of access keys
- **Limit S3 permissions** to only what's needed
- **Enable S3 access logging** for monitoring
- **Set up S3 lifecycle policies** to manage old tickets

## Production Considerations

1. **Use IAM Roles** instead of access keys
2. **Enable S3 versioning** for backup
3. **Set up CloudFront** for faster downloads
4. **Configure S3 lifecycle policies** to archive old tickets
5. **Monitor S3 costs** and set up billing alerts

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review AWS CloudTrail logs for API errors
3. Check backend console logs for detailed error messages
4. Verify all environment variables are set correctly
