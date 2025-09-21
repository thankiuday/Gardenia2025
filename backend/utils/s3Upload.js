const AWS = require('aws-sdk');
const config = require('../config');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

/**
 * Upload a PDF ticket to S3
 * @param {Buffer} pdfBuffer - The PDF file buffer
 * @param {string} fileName - The file name (e.g., "GDN2025-1234.pdf")
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
const uploadTicketToS3 = async (pdfBuffer, fileName) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      // Remove ACL as newer buckets don't support it
      // ACL: 'public-read', 
      Metadata: {
        'uploaded-by': 'gardenia-backend',
        'upload-date': new Date().toISOString()
      }
    };

    const result = await s3.upload(uploadParams).promise();
    
    console.log(`Ticket uploaded successfully: ${result.Location}`);
    return result.Location;
    
  } catch (error) {
    console.error('Error uploading ticket to S3:', error);
    throw new Error('Failed to upload ticket to S3');
  }
};

/**
 * Delete a ticket from S3
 * @param {string} fileName - The file name to delete
 * @returns {Promise<boolean>} - True if successful
 */
const deleteTicketFromS3 = async (fileName) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const deleteParams = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(deleteParams).promise();
    console.log(`Ticket deleted successfully: ${key}`);
    return true;
    
  } catch (error) {
    console.error('Error deleting ticket from S3:', error);
    return false;
  }
};

/**
 * Check if a ticket exists in S3
 * @param {string} fileName - The file name to check
 * @returns {Promise<boolean>} - True if file exists
 */
const checkTicketExistsInS3 = async (fileName) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const headParams = {
      Bucket: bucketName,
      Key: key
    };

    await s3.headObject(headParams).promise();
    return true;
    
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    console.error('Error checking ticket in S3:', error);
    return false;
  }
};

/**
 * Get a signed URL for downloading a ticket (if needed for private access)
 * @param {string} fileName - The file name
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - The signed URL
 */
const getSignedDownloadUrl = async (fileName, expiresIn = 3600) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
    
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
};

/**
 * Get the public URL for a ticket
 * @param {string} fileName - The file name
 * @returns {string} - The public S3 URL
 */
const getPublicTicketUrl = (fileName) => {
  const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
  const region = process.env.AWS_REGION || 'us-east-1';
  
  return `https://${bucketName}.s3.${region}.amazonaws.com/tickets/${fileName}`;
};

module.exports = {
  uploadTicketToS3,
  deleteTicketFromS3,
  checkTicketExistsInS3,
  getSignedDownloadUrl,
  getPublicTicketUrl
};
