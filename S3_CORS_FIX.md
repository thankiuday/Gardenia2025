# S3 CORS Configuration Fix

## The Problem
Your S3 bucket is blocking requests from `localhost:5173` due to CORS policy. The error message shows:
```
Access to fetch at 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/...' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## The Solution
You need to configure CORS on your S3 bucket. Here's how:

### Step 1: Go to AWS S3 Console
1. Open AWS S3 Console
2. Find your bucket: `gardenia2025-assets`
3. Click on the bucket name

### Step 2: Configure CORS
1. Go to the **Permissions** tab
2. Scroll down to **Cross-origin resource sharing (CORS)**
3. Click **Edit**

### Step 3: Add CORS Configuration
Replace the existing CORS configuration with this:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://your-production-domain.com"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

### Step 4: Save Changes
1. Click **Save changes**
2. Wait a few minutes for the changes to propagate

## Alternative: Use CloudFront
If CORS configuration doesn't work, consider using AWS CloudFront as a CDN which handles CORS automatically.

## Test the Fix
After applying the CORS configuration:
1. Clear your browser cache
2. Refresh the page
3. Check the console - CORS errors should be gone

