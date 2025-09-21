const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a ticket to S3 (PDF or HTML)
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name (e.g., "GDN2025-1234.pdf" or "GDN2025-1234.html")
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
const uploadTicketToS3 = async (fileBuffer, fileName) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    // Determine content type based on file extension
    const contentType = fileName.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/pdf';

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: {
        'uploaded-by': 'gardenia-backend',
        'upload-date': new Date().toISOString(),
        'file-type': fileName.endsWith('.html') ? 'html' : 'pdf'
      }
    });

    await s3Client.send(uploadCommand);
    
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    console.log(`Ticket uploaded successfully: ${publicUrl}`);
    return publicUrl;
    
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

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(deleteCommand);
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

    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(headCommand);
    return true;
    
  } catch (error) {
    if (error.name === 'NotFound') {
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

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn });
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
