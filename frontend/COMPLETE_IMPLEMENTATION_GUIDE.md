# Complete S3 Production Implementation Guide

## 🎯 Overview
This guide walks you through implementing S3 asset access through your production domain `https://gardenia.gardencity.university/`.

## 📋 Implementation Steps

### Step 1: Frontend Configuration ✅ COMPLETED

#### 1.1 Environment-Based S3 URLs
**File**: `src/config/s3-assets.js`
```javascript
const getS3BaseUrl = () => {
  const envS3Url = import.meta.env.VITE_S3_BASE_URL;
  if (envS3Url) {
    return envS3Url; // Production: https://gardenia.gardencity.university/s3
  }
  return 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com'; // Development
};
```

#### 1.2 Production Environment Variables
**File**: `env.gardenia.production`
```bash
VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3
VITE_API_URL=https://gardenia.gardencity.university
```

### Step 2: Backend Configuration ⚠️ REQUIRED

#### 2.1 Choose Your Backend Setup

**Option A: Nginx Proxy (Recommended)**
```nginx
location /s3/ {
    rewrite ^/s3/(.*)$ /$1 break;
    proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
    proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
    
    # CORS headers
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
}
```

**Option B: Express.js Proxy**
```javascript
app.use('/s3', createProxyMiddleware({
    target: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
    changeOrigin: true,
    pathRewrite: { '^/s3': '' }
}));
```

### Step 3: S3 Bucket CORS Configuration ⚠️ REQUIRED

#### 3.1 Update S3 Bucket CORS Policy
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

### Step 4: Testing & Validation

#### 4.1 Test URL Generation
```bash
# Development URLs
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Production URLs  
https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

#### 4.2 Test Backend Proxy
```bash
# Test if proxy works
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Should return 200 OK
```

#### 4.3 Test CORS
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

## 🔧 Configuration Files

### Frontend Files Modified:
- ✅ `src/config/s3-assets.js` - Dynamic S3 URL configuration
- ✅ `env.gardenia.production` - Production environment variables
- ✅ `PRODUCTION_S3_CONFIGURATION.md` - Complete setup guide
- ✅ `BACKEND_S3_PROXY_SETUP.md` - Backend configuration options
- ✅ `URL_COMPARISON.md` - URL structure comparison

### Backend Files You Need to Create/Modify:
- ⚠️ Nginx configuration (if using Nginx)
- ⚠️ Express.js proxy middleware (if using Express)
- ⚠️ S3 bucket CORS policy update

## 🚀 Deployment Process

### 1. Frontend Deployment
```bash
# Set production environment
export VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3
export VITE_API_URL=https://gardenia.gardencity.university

# Build for production
npm run build

# Deploy to your server
```

### 2. Backend Configuration
1. Configure S3 proxy at `/s3/` path
2. Set up CORS headers
3. Test S3 asset access
4. Update S3 bucket CORS policy

### 3. Testing
1. Test all asset URLs load correctly
2. Verify CORS is working
3. Check browser console for errors
4. Test on different devices/browsers

## 📊 URL Mapping Examples

| Asset Type | Development URL | Production URL |
|------------|----------------|----------------|
| **Event Images** | `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png` | `https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png` |
| **Logos** | `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png` | `https://gardenia.gardencity.university/s3/logos/elemental-logo.png` |
| **Documents** | `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure.pdf` | `https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf` |
| **Videos** | `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4` | `https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4` |

## 🔍 Troubleshooting

### Common Issues:

1. **404 Errors on S3 Assets**
   - Check if backend proxy is configured
   - Verify S3 bucket permissions
   - Test direct S3 access

2. **CORS Errors**
   - Update S3 bucket CORS policy
   - Check backend CORS headers
   - Verify domain is in allowed origins

3. **SSL/HTTPS Issues**
   - Ensure SSL certificates are valid
   - Check mixed content warnings
   - Verify HTTPS redirects

4. **Cache Issues**
   - Clear browser cache
   - Check CDN cache settings
   - Verify cache headers

### Debug Commands:
```bash
# Test S3 access
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Check CORS
curl -H "Origin: https://gardenia.gardencity.university" \
     -X OPTIONS \
     https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Test from browser console
fetch('https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e));
```

## ✅ Success Criteria

- [ ] Frontend builds with production environment variables
- [ ] Backend proxy serves S3 assets at `/s3/` path
- [ ] All asset URLs load without errors
- [ ] CORS is working for all origins
- [ ] SSL/HTTPS is properly configured
- [ ] Cache headers are set appropriately
- [ ] S3 bucket CORS policy is updated
- [ ] Testing on multiple browsers/devices

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend proxy configuration
3. Test S3 bucket access directly
4. Check CORS policy settings
5. Review server logs for errors
