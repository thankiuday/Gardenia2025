#!/bin/bash

# Upload Event Images to S3 Bucket
# This script uploads all event images to the event-images folder in S3

echo "📸 Uploading Event Images to S3 Bucket..."

# Set variables
BUCKET_NAME="gardenia2025-assets"
FOLDER_NAME="event-images"
LOCAL_IMAGES_DIR="./event-images"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if local images directory exists
if [ ! -d "$LOCAL_IMAGES_DIR" ]; then
    echo "❌ Local images directory '$LOCAL_IMAGES_DIR' not found."
    echo "   Please create the directory and add your event images."
    exit 1
fi

# Check if bucket exists
if ! aws s3 ls "s3://$BUCKET_NAME" 2>/dev/null; then
    echo "❌ S3 bucket '$BUCKET_NAME' not found or not accessible."
    echo "   Please check your AWS credentials and bucket name."
    exit 1
fi

echo "✅ S3 bucket '$BUCKET_NAME' is accessible."

# Upload all images to S3
echo "🚀 Uploading images to s3://$BUCKET_NAME/$FOLDER_NAME/"

# Upload with proper content type and cache headers
aws s3 sync "$LOCAL_IMAGES_DIR" "s3://$BUCKET_NAME/$FOLDER_NAME/" \
    --content-type "image/jpeg" \
    --cache-control "max-age=31536000" \
    --metadata-directive REPLACE \
    --exclude "*.DS_Store" \
    --exclude "*.tmp"

if [ $? -eq 0 ]; then
    echo "✅ Event images uploaded successfully!"
    echo ""
    echo "📋 Uploaded images:"
    aws s3 ls "s3://$BUCKET_NAME/$FOLDER_NAME/" --recursive
    
    echo ""
    echo "🔗 Your event images are now available at:"
    echo "   https://$BUCKET_NAME.s3.us-east-1.amazonaws.com/$FOLDER_NAME/"
    echo ""
    echo "📝 Example URLs:"
    echo "   https://$BUCKET_NAME.s3.us-east-1.amazonaws.com/$FOLDER_NAME/basketball.jpg"
    echo "   https://$BUCKET_NAME.s3.us-east-1.amazonaws.com/$FOLDER_NAME/waves-of-the-mind.jpg"
    echo "   https://$BUCKET_NAME.s3.us-east-1.amazonaws.com/$FOLDER_NAME/default-event.jpg"
else
    echo "❌ Failed to upload images. Please check your AWS credentials and try again."
    exit 1
fi
