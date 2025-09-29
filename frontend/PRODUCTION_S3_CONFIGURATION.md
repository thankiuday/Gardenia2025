# Production S3 Configuration Guide

## Overview
This guide explains how to configure S3 bucket access for the production domain `https://gardenia.gardencity.university/`.

## Configuration Files Updated

### 1. S3 Assets Configuration (`src/config/s3-assets.js`)
- ✅ **Dynamic Base URL**: Added environment-based S3 URL configuration
- ✅ **Environment Variable Support**: Uses `VITE_S3_BASE_URL` for production
- ✅ **Fallback to Default**: Falls back to direct S3 URLs if not configured

### 2. Production Environment (`env.gardenia.production`)
- ✅ **S3 Base URL**: Added `VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3`
- ✅ **Production Domain**: Configured for `https://gardenia.gardencity.university`

## Production S3 URL Structure

### Current Configuration:
```
Production Domain: https://gardenia.gardencity.university/
S3 Base URL: https://gardenia.gardencity.university/s3
```

### URL Examples:
- **Event Images**: `https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png`
- **Logos**: `https://gardenia.gardencity.university/s3/logos/elemental-logo.png`
- **Documents**: `https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf`
- **Videos**: `https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4`

## Backend Configuration Required

### 1. S3 Proxy/Redirect Setup
You need to configure your backend server to handle S3 requests:

```nginx
# Nginx Configuration Example
location /s3/ {
    proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
    proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers for S3 access
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
}
```

### 2. Express.js Proxy (Alternative)
If using Express.js, add a proxy route:

```javascript
// In your Express server
app.use('/s3', (req, res) => {
  const s3Url = `https://gardenia2025-assets.s3.us-east-1.amazonaws.com${req.path}`;
  // Proxy the request to S3
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Forward request to S3
  // Implementation depends on your proxy library
});
```

## Environment Variables

### Production Environment Variables:
```bash
# Required for production
VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3
VITE_API_URL=https://gardenia.gardencity.university
NODE_ENV=production
```

### Development Environment Variables:
```bash
# For development (uses direct S3 URLs)
VITE_API_URL=http://localhost:5000
# VITE_S3_BASE_URL not set (uses default S3 URLs)
```

## Testing Configuration

### 1. Test S3 URL Generation:
```bash
# Test in development
npm run dev

# Test in production build
npm run build
npm run preview
```

### 2. Verify URLs:
```javascript
// In browser console
import S3_ASSETS from './src/config/s3-assets.js';

// Test event image URL
console.log(S3_ASSETS.events.getEventImage('Rhythmic Elements (Group Dance)'));
// Should output: https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

// Test logo URL
console.log(S3_ASSETS.logos.elemental);
// Should output: https://gardenia.gardencity.university/s3/logos/elemental-logo.png
```

## CORS Configuration

### S3 Bucket CORS Policy:
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
    "MaxAgeSeconds": 3000
  }
]
```

## Deployment Checklist

### Frontend Deployment:
- [ ] Set `VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3`
- [ ] Set `VITE_API_URL=https://gardenia.gardencity.university`
- [ ] Build with production environment
- [ ] Deploy to production domain

### Backend Configuration:
- [ ] Configure S3 proxy/redirect at `/s3/` path
- [ ] Set up CORS headers for S3 access
- [ ] Test S3 asset access through production domain
- [ ] Verify all asset URLs are accessible

### Testing:
- [ ] Test event images load correctly
- [ ] Test logos display properly
- [ ] Test document downloads work
- [ ] Test video playback works
- [ ] Verify CORS is working for all assets

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure S3 bucket CORS policy includes your domain
2. **404 Errors**: Verify S3 proxy is configured correctly
3. **Mixed Content**: Ensure HTTPS is used for all S3 URLs
4. **Cache Issues**: Check if CDN/proxy is caching old URLs

### Debug Commands:
```bash
# Check environment variables
echo $VITE_S3_BASE_URL

# Test S3 access
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Check CORS headers
curl -H "Origin: https://gardenia.gardencity.university" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

## File Structure

```
frontend/
├── src/config/
│   ├── s3-assets.js          # ✅ Updated with environment support
│   ├── api.js                # API configuration
│   └── environment.js        # Environment utilities
├── env.gardenia.production   # ✅ Updated with S3 configuration
└── PRODUCTION_S3_CONFIGURATION.md # This guide
```
