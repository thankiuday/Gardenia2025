# AWS S3 Setup Guide for Gardenia 2025 Assets

## 🚀 **Step-by-Step S3 Setup**

### **Step 1: Create AWS Account**
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the registration process
4. **Note**: You'll need a credit card, but the free tier includes 5GB storage for 12 months

### **Step 2: Create S3 Bucket**
1. **Login to AWS Console**
2. **Navigate to S3 Service**
   - Search "S3" in the services search bar
   - Click on "S3" service

3. **Create Bucket**
   - Click "Create bucket"
   - **Bucket name**: `gardenia2025-assets` (must be globally unique)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: **UNCHECK** "Block all public access"
   - **Bucket Versioning**: Disabled
   - **Default encryption**: None
   - Click "Create bucket"

### **Step 3: Configure Bucket for Public Access**
1. **Go to your bucket** → Click on bucket name
2. **Go to Permissions tab**
3. **Edit Bucket Policy** → Add this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::gardenia2025-assets/*"
        }
    ]
}
```

**Important**: Replace `gardenia2025-assets` with your actual bucket name!

### **Step 4: Upload Your Assets**

#### **Create Folder Structure:**
```
gardenia2025-assets/
├── videos/
│   └── gardenia-hero-video.mp4
├── logos/
│   ├── elemental-logo.png
│   └── garden_city_college_of_sc_and_mgt_studies_logo.jpeg
├── documents/
│   └── gardenia-2025-brochure.pdf
└── tickets/
    └── (PDF tickets will be automatically uploaded here)
```

#### **Upload Process:**
1. **Create folders** in S3 bucket
2. **Upload files** to respective folders
3. **Set permissions** for each file:
   - Select file → Actions → Make public

### **Step 5: Get Your S3 URLs**

Your files will be accessible at:
```
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure.pdf
```

### **Step 6: Configure Backend Environment**

Add these environment variables to your backend `.env` file:

```bash
# AWS S3 Configuration for Ticket Storage
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gardenia2025-assets
```

### **Step 7: Update Configuration File**

Update `frontend/src/config/s3-assets.js` with your actual URLs:

```javascript
const S3_ASSETS = {
  baseUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
  
  video: {
    hero: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4'
  },
  logos: {
    elemental: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png',
    university: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg'
  },
  documents: {
    brochure: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure.pdf'
  }
};
```

## 💰 **AWS S3 Pricing (Free Tier)**

### **Free Tier Includes (12 months):**
- **5 GB** of standard storage
- **20,000 GET requests**
- **2,000 PUT requests**
- **15 GB** of data transfer out

### **Estimated Costs for Your Files:**
- **Video (20MB)**: ~$0.0005 per 1,000 views
- **Images (1MB total)**: ~$0.0002 per 1,000 views
- **PDF (22MB)**: ~$0.0005 per 1,000 downloads

**Total estimated cost**: Less than $1/month for typical usage

## 🔧 **Alternative: CloudFront CDN (Optional)**

For better performance, you can add CloudFront:

1. **Create CloudFront Distribution**
2. **Origin**: Your S3 bucket
3. **Default Root Object**: Leave blank
4. **Price Class**: Use All Edge Locations (or US/Europe for lower cost)
5. **Update URLs** to use CloudFront domain

## 🚨 **Security Best Practices**

1. **Use IAM policies** instead of bucket policies for production
2. **Enable CloudTrail** for access logging
3. **Set up billing alerts** to monitor costs
4. **Use lifecycle policies** to manage old files

## 📝 **Quick Checklist**

- [ ] AWS account created
- [ ] S3 bucket created with public access
- [ ] Bucket policy configured
- [ ] Files uploaded to correct folders
- [ ] Files made public
- [ ] Backend environment variables configured
- [ ] Configuration file updated with correct URLs
- [ ] Test URLs in browser
- [ ] Deploy updated code to Render
- [ ] Run migration script for existing tickets (if any)

## 🔄 **Migrating Existing Tickets to S3**

If you have existing tickets stored locally, you can migrate them to S3:

### **Step 1: Run Migration Script**
```bash
cd backend
npm run migrate:tickets
```

### **Step 2: Verify Migration**
- Check your S3 bucket's `tickets/` folder
- Verify that PDF URLs in your database now point to S3
- Test downloading tickets through your application

### **Step 3: Clean Up (Optional)**
After successful migration, you can remove the local `uploads/` directory:
```bash
rm -rf backend/uploads
```

## 🆘 **Troubleshooting**

### **Files not loading?**
- Check bucket policy is correct
- Verify files are public
- Check URLs are correct
- Test URLs directly in browser

### **Access denied errors?**
- Ensure bucket policy allows public read
- Check individual file permissions
- Verify bucket name in policy matches actual bucket

### **High costs?**
- Check CloudWatch metrics
- Set up billing alerts
- Consider using CloudFront for caching

---

**Your S3 setup is complete!** 🎉
