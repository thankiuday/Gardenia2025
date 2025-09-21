# S3 Ticket Storage Implementation

This document explains the S3 ticket storage system implemented for Gardenia 2025.

## 🎯 **Overview**

The system now stores PDF tickets in AWS S3 instead of the local filesystem, providing:
- **Scalability**: No server storage limitations
- **Reliability**: Cloud-based storage with high availability
- **Performance**: CDN-ready for fast global access
- **Backup**: Automatic redundancy and versioning

## 🏗️ **Architecture**

### **File Flow**
```
Registration Request → PDF Generation → S3 Upload → Database Update → User Response
```

### **Download Flow**
```
Download Request → Database Lookup → S3 URL Redirect → User Downloads from S3
```

## 📁 **File Structure**

```
backend/
├── utils/
│   └── s3Upload.js          # S3 utility functions
├── scripts/
│   └── migrateTicketsToS3.js # Migration script
├── routes/
│   └── registrations.js     # Updated with S3 integration
└── S3_TICKET_STORAGE.md     # This documentation
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gardenia2025-assets
```

### **S3 Bucket Structure**
```
gardenia2025-assets/
└── tickets/
    ├── GDN2025-0001.pdf
    ├── GDN2025-0002.pdf
    └── ...
```

## 🚀 **Key Features**

### **1. Automatic Upload**
- PDFs are automatically uploaded to S3 during registration
- Files are stored with public read access
- Metadata includes upload timestamp and source

### **2. Graceful Fallback**
- If S3 upload fails, registration still succeeds
- System logs errors for debugging
- Users get appropriate error messages

### **3. Backward Compatibility**
- Download endpoint supports both S3 URLs and local files
- Migration script handles existing local tickets
- No breaking changes to existing functionality

### **4. Download Tracking**
- All downloads are tracked regardless of storage location
- Analytics include download type (manual/auto)
- IP address and user agent logging

## 📊 **API Changes**

### **Registration Response**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "registrationId": "GDN2025-1234",
    "event": "Event Title",
    "pdfUrl": "https://gardenia2025-assets.s3.us-east-1.amazonaws.com/tickets/GDN2025-1234.pdf",
    "qrCode": "data:image/png;base64,...",
    "paymentStatus": "PENDING"
  }
}
```

### **Download Endpoint**
- **URL**: `GET /api/register/:id/pdf`
- **Behavior**: Redirects to S3 URL for direct download
- **Tracking**: Downloads are still tracked in database

## 🔄 **Migration Process**

### **For Existing Deployments**
1. **Set up S3 bucket** (see `S3_SETUP_GUIDE.md`)
2. **Configure environment variables**
3. **Deploy updated code**
4. **Run migration script**: `npm run migrate:tickets`
5. **Verify migration** and clean up local files

### **For New Deployments**
- No migration needed
- Tickets will be stored in S3 from the start

## 🛠️ **Utility Functions**

### **uploadTicketToS3(pdfBuffer, fileName)**
- Uploads PDF buffer to S3
- Returns S3 URL
- Handles errors gracefully

### **deleteTicketFromS3(fileName)**
- Deletes ticket from S3
- Returns success/failure status
- Useful for cleanup operations

### **checkTicketExistsInS3(fileName)**
- Checks if ticket exists in S3
- Returns boolean
- Useful for validation

### **getPublicTicketUrl(fileName)**
- Generates public S3 URL
- No API call required
- Fast URL generation

## 📈 **Benefits**

### **Performance**
- **Faster Downloads**: Direct S3 access
- **Reduced Server Load**: No file serving from backend
- **CDN Ready**: Can add CloudFront for global distribution

### **Scalability**
- **Unlimited Storage**: No server disk space constraints
- **High Availability**: S3's 99.999999999% durability
- **Auto-scaling**: Handles traffic spikes automatically

### **Cost Efficiency**
- **Pay-per-use**: Only pay for storage and requests used
- **No Server Storage**: Reduces server requirements
- **Free Tier**: 5GB free for 12 months

### **Reliability**
- **Automatic Backups**: S3 handles redundancy
- **Versioning**: Can enable for file history
- **Cross-region Replication**: Available if needed

## 🔒 **Security**

### **Access Control**
- **Public Read**: Tickets are publicly accessible
- **Private Write**: Only backend can upload/delete
- **IAM Policies**: Can be restricted further if needed

### **Data Protection**
- **Encryption**: S3 supports encryption at rest
- **HTTPS**: All transfers use secure connections
- **Access Logging**: Can enable CloudTrail for audit

## 🚨 **Error Handling**

### **Upload Failures**
- Registration still succeeds
- Error logged for debugging
- User notified of PDF unavailability

### **Download Failures**
- 404 for missing files
- 500 for server errors
- Graceful error messages

### **S3 Service Issues**
- Automatic retries (AWS SDK handles this)
- Fallback to local storage (if configured)
- Error logging and monitoring

## 📋 **Monitoring**

### **Key Metrics**
- Upload success rate
- Download success rate
- S3 storage usage
- Request costs

### **Logging**
- Upload attempts and results
- Download tracking
- Error details and stack traces

## 🔮 **Future Enhancements**

### **Potential Improvements**
1. **CloudFront CDN**: For global performance
2. **Lifecycle Policies**: Auto-delete old tickets
3. **Encryption**: Enable S3 encryption
4. **Signed URLs**: For private ticket access
5. **Compression**: Optimize PDF file sizes

### **Advanced Features**
1. **Ticket Templates**: Customizable PDF layouts
2. **Batch Operations**: Bulk ticket management
3. **Analytics Dashboard**: Download statistics
4. **Auto-cleanup**: Remove unused tickets

## 📞 **Support**

For issues or questions:
1. Check the logs for error details
2. Verify S3 configuration
3. Test with a simple upload
4. Review AWS CloudWatch metrics

---

**Implementation completed successfully!** 🎉

The system now uses S3 for ticket storage while maintaining full backward compatibility and providing enhanced scalability and reliability.
