// Check if AWS SDK is available and configured
let S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand, getSignedUrl;
let s3Client = null;

try {
  const awsS3 = require('@aws-sdk/client-s3');
  const awsS3Presigner = require('@aws-sdk/s3-request-presigner');
  
  S3Client = awsS3.S3Client;
  PutObjectCommand = awsS3.PutObjectCommand;
  DeleteObjectCommand = awsS3.DeleteObjectCommand;
  HeadObjectCommand = awsS3.HeadObjectCommand;
  GetObjectCommand = awsS3.GetObjectCommand;
  getSignedUrl = awsS3Presigner.getSignedUrl;

  // Check if AWS credentials are configured
  const hasAwsConfig = process.env.AWS_ACCESS_KEY_ID && 
                      process.env.AWS_SECRET_ACCESS_KEY && 
                      process.env.AWS_ACCESS_KEY_ID !== 'your-aws-access-key-id';

  if (hasAwsConfig) {
    // Configure AWS SDK v3
    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    // AWS S3 client configured successfully
  } else {
    // AWS S3 not configured - will use local storage fallback
  }
} catch (error) {
  // AWS SDK not available - will use local storage fallback
}

/**
 * Upload a PDF ticket to S3
 * @param {Buffer} pdfBuffer - The PDF file buffer
 * @param {string} fileName - The file name (e.g., "GDN2025-1234.pdf")
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
const uploadTicketToS3 = async (pdfBuffer, fileName) => {
  if (!s3Client) {
    throw new Error('S3 client not configured. Please configure AWS credentials or use local storage.');
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        'uploaded-by': 'gardenia-backend',
        'upload-date': new Date().toISOString()
      }
    });

    await s3Client.send(uploadCommand);
    
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
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
  if (!s3Client) {
    return false;
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET || 'gardenia2025-assets';
    const key = `tickets/${fileName}`;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(deleteCommand);
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
  if (!s3Client) {
    return false;
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET || 'gardenia2025-assets';
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
  if (!s3Client) {
    throw new Error('S3 client not configured. Cannot generate signed URL.');
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET || 'gardenia2025-assets';
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
  const bucketName = process.env.AWS_S3_BUCKET || 'gardenia2025-assets';
  const region = process.env.AWS_REGION || 'us-east-1';
  
  return `https://${bucketName}.s3.${region}.amazonaws.com/tickets/${fileName}`;
};

/**
 * Check if S3 is configured and available
 * @returns {boolean} - True if S3 is available
 */
const isS3Available = () => {
  return s3Client !== null;
};

module.exports = {
  uploadTicketToS3,
  deleteTicketFromS3,
  checkTicketExistsInS3,
  getSignedDownloadUrl,
  getPublicTicketUrl,
  isS3Available
};
