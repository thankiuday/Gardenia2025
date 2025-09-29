# S3 Bucket Configuration Guide

## 🎯 Overview
You need to configure your S3 bucket's CORS (Cross-Origin Resource Sharing) policy to allow your production domain to access the assets.

## 📋 Required S3 Bucket Configuration

### Step 1: Access AWS S3 Console

1. **Go to AWS S3 Console**
   - Visit: https://s3.console.aws.amazon.com/
   - Sign in with your AWS credentials

2. **Find Your Bucket**
   - Look for bucket: `gardenia2025-assets`
   - Click on the bucket name

### Step 2: Navigate to CORS Configuration

1. **Go to Permissions Tab**
   - Click on the "Permissions" tab in your bucket
   - Scroll down to find "Cross-origin resource sharing (CORS)"

2. **Click "Edit"**
   - Click the "Edit" button to modify CORS settings

### Step 3: Update CORS Configuration

#### 3.1 Replace Existing CORS Policy
Delete any existing CORS configuration and replace it with this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://gardenia.gardencity.university",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"],
    "MaxAgeSeconds": 3600
  }
]
```

#### 3.2 Explanation of Each Field

| Field | Value | Explanation |
|-------|-------|-------------|
| **AllowedHeaders** | `["*"]` | Allows all headers in requests |
| **AllowedMethods** | `["GET", "HEAD"]` | Only allows GET and HEAD requests (read-only) |
| **AllowedOrigins** | Your domains | List of domains that can access the bucket |
| **ExposeHeaders** | `["ETag", "x-amz-meta-custom-header"]` | Headers that can be read by the browser |
| **MaxAgeSeconds** | `3600` | How long browsers can cache preflight requests |

### Step 4: Save Configuration

1. **Click "Save Changes"**
   - Click the "Save changes" button
   - Wait for the changes to propagate (usually 1-2 minutes)

2. **Verify Changes**
   - The CORS configuration should now show your updated policy

## 🔍 Testing CORS Configuration

### Test 1: Direct S3 Access
```bash
# Test if S3 bucket allows your domain
curl -H "Origin: https://gardenia.gardencity.university" \
     -I https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Should return CORS headers:
# access-control-allow-origin: https://gardenia.gardencity.university
# access-control-allow-methods: GET, HEAD
```

### Test 2: CORS Preflight Request
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Should return 200 OK with CORS headers
```

### Test 3: From Browser Console
```javascript
// Open browser console and run:
fetch('https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png')
  .then(response => {
    console.log('✅ Status:', response.status);
    console.log('✅ CORS Headers:', response.headers.get('access-control-allow-origin'));
    return response.blob();
  })
  .then(blob => {
    console.log('✅ Image loaded successfully, size:', blob.size, 'bytes');
  })
  .catch(error => {
    console.error('❌ CORS Error:', error);
  });
```

## 🚨 Common CORS Issues and Solutions

### Issue 1: CORS Policy Not Applied
**Symptoms:**
- Browser shows CORS errors
- `access-control-allow-origin` header missing

**Solution:**
- Wait 1-2 minutes for changes to propagate
- Clear browser cache
- Check if CORS policy is saved correctly

### Issue 2: Wrong Domain in CORS Policy
**Symptoms:**
- CORS errors for specific domains
- Works for some domains but not others

**Solution:**
- Verify domain is exactly: `https://gardenia.gardencity.university`
- Check for typos in domain name
- Ensure protocol (https) is correct

### Issue 3: CORS Policy Too Restrictive
**Symptoms:**
- Some requests work, others don't
- Headers not allowed

**Solution:**
- Use `"AllowedHeaders": ["*"]` for all headers
- Ensure `"AllowedMethods": ["GET", "HEAD"]` includes both methods

## 🔧 Advanced CORS Configuration

### For Multiple Environments
If you have multiple environments, update the CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://gardenia.gardencity.university",
      "https://staging.gardencity.university",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"],
    "MaxAgeSeconds": 3600
  }
]
```

### For Development and Production
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://gardenia.gardencity.university",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## 📊 CORS Policy Breakdown

### What Each Field Does:

1. **AllowedHeaders**: `["*"]`
   - Allows any header in the request
   - Essential for complex requests

2. **AllowedMethods**: `["GET", "HEAD"]`
   - Only allows read operations
   - Prevents unauthorized modifications

3. **AllowedOrigins**: Your domains
   - Specifies which domains can access the bucket
   - Must match exactly (including protocol)

4. **ExposeHeaders**: `["ETag", "x-amz-meta-custom-header"]`
   - Headers that browsers can read
   - Useful for caching and metadata

5. **MaxAgeSeconds**: `3600`
   - How long browsers cache preflight requests
   - Reduces number of preflight requests

## ✅ Verification Checklist

- [ ] CORS policy is saved in S3 bucket
- [ ] AllowedOrigins includes your production domain
- [ ] AllowedMethods includes GET and HEAD
- [ ] AllowedHeaders is set to ["*"]
- [ ] Changes have propagated (wait 1-2 minutes)
- [ ] Test requests return CORS headers
- [ ] Browser console shows no CORS errors

## 🧪 Testing Commands

### Test S3 CORS Directly
```bash
# Test if S3 allows your domain
curl -H "Origin: https://gardenia.gardencity.university" \
     -I https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Expected headers:
# access-control-allow-origin: https://gardenia.gardencity.university
# access-control-allow-methods: GET, HEAD
```

### Test CORS Preflight
```bash
# Test CORS preflight request
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  -H "Access-Control-Request-Method: GET" \
  https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Should return 200 OK
```

### Test from Browser
```javascript
// Test in browser console
fetch('https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png')
  .then(response => {
    console.log('CORS Headers:', response.headers.get('access-control-allow-origin'));
    return response.blob();
  })
  .then(blob => console.log('Success:', blob.size, 'bytes'))
  .catch(error => console.error('CORS Error:', error));
```

## 🚀 Next Steps

After configuring S3 CORS:

1. **Set up Backend Proxy** (Nginx or Express.js)
2. **Test S3 Proxy** with your domain
3. **Deploy Frontend** with production environment variables
4. **Verify Everything Works** in browser

## 📞 Troubleshooting

If you encounter issues:

1. **Check CORS Policy**: Verify it's saved correctly in S3
2. **Wait for Propagation**: Changes take 1-2 minutes to apply
3. **Clear Browser Cache**: Remove cached CORS responses
4. **Test Direct S3 Access**: Ensure S3 allows your domain
5. **Check Domain Spelling**: Verify exact domain name and protocol

Your S3 bucket CORS configuration is essential for the proxy to work correctly! 🎯
