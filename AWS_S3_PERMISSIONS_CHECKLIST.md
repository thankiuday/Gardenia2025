# 🔐 AWS S3 Permissions Checklist for Gardenia 2025

## 📋 Required AWS S3 Permissions

### 1. IAM User Permissions
Your AWS IAM user needs these permissions for the `gardenia2025-assets` bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:GetObjectVersion"
            ],
            "Resource": [
                "arn:aws:s3:::gardenia2025-assets",
                "arn:aws:s3:::gardenia2025-assets/*"
            ]
        }
    ]
}
```

### 2. S3 Bucket Policy (Optional - for public ticket access)
If you want tickets to be publicly accessible:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::gardenia2025-assets/tickets/*"
        }
    ]
}
```

### 3. CORS Configuration
Add this CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": [
            "https://gardenia.gardencity.university",
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        "ExposeHeaders": ["ETag"]
    }
]
```

## 🔍 Verification Steps

### 1. Test S3 Connection
Run this command on your VPS to test S3 connectivity:

```bash
cd /var/www/Gardenia2025/backend
node -e "
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
client.send(new ListBucketsCommand({})).then(data => {
  console.log('✅ S3 connection successful');
  console.log('Available buckets:', data.Buckets.map(b => b.Name));
}).catch(err => {
  console.error('❌ S3 connection failed:', err.message);
});
"
```

### 2. Test Upload Permission
```bash
cd /var/www/Gardenia2025/backend
node -e "
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET || 'gardenia2025-assets',
  Key: 'test/connection-test.txt',
  Body: 'Test upload from VPS',
  ContentType: 'text/plain'
});
client.send(command).then(() => {
  console.log('✅ S3 upload test successful');
}).catch(err => {
  console.error('❌ S3 upload test failed:', err.message);
});
"
```

### 3. Test Download Permission
```bash
cd /var/www/Gardenia2025/backend
node -e "
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const command = new GetObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET || 'gardenia2025-assets',
  Key: 'test/connection-test.txt'
});
client.send(command).then(() => {
  console.log('✅ S3 download test successful');
}).catch(err => {
  console.error('❌ S3 download test failed:', err.message);
});
"
```

## 🚨 Common Permission Issues

### Issue 1: Access Denied on Upload
**Error:** `AccessDenied: Access Denied`
**Solution:** 
- Check IAM user has `s3:PutObject` permission
- Verify bucket name in environment variables
- Check if bucket exists and is accessible

### Issue 2: Access Denied on Download
**Error:** `AccessDenied: Access Denied`
**Solution:**
- Check IAM user has `s3:GetObject` permission
- Verify file exists in bucket
- Check bucket policy for public access

### Issue 3: CORS Issues
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solution:**
- Add CORS configuration to S3 bucket
- Include your domain in AllowedOrigins
- Test with browser developer tools

### Issue 4: Bucket Not Found
**Error:** `NoSuchBucket: The specified bucket does not exist`
**Solution:**
- Verify bucket name in `AWS_S3_BUCKET` environment variable
- Check if bucket exists in correct region
- Ensure bucket name matches exactly

## 🔧 Environment Variables Checklist

Make sure these are set in your `/var/www/Gardenia2025/backend/.env`:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gardenia2025-assets
S3_BASE_URL=https://gardenia2025-assets.s3.us-east-1.amazonaws.com
```

## 📊 Monitoring S3 Usage

### 1. Check S3 Usage in AWS Console
- Go to S3 → gardenia2025-assets → Metrics
- Monitor storage usage and request counts

### 2. Set up CloudWatch Alerts
- Create alerts for unusual activity
- Monitor costs and usage patterns

### 3. Log S3 Operations
Check application logs for S3 operations:
```bash
pm2 logs gardenia-backend | grep -i s3
```

## 🎯 Quick Fixes

### If S3 is not working:
1. **Check credentials**: Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
2. **Check region**: Ensure AWS_REGION matches your bucket region
3. **Check bucket name**: Verify AWS_S3_BUCKET is correct
4. **Test permissions**: Run the test scripts above
5. **Check CORS**: Ensure CORS is configured for your domain

### If tickets are not accessible:
1. **Check bucket policy**: Ensure public read access for tickets/*
2. **Check CORS**: Add your domain to allowed origins
3. **Verify URLs**: Check if S3 URLs are correctly generated

---

**✅ Once all permissions are verified, your S3 integration should work perfectly!**


