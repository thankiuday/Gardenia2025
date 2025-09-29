# Backend S3 Proxy - Complete Step-by-Step Guide

## 🎯 Overview
This guide will walk you through setting up an S3 proxy on your backend server to serve S3 assets through your production domain `https://gardenia.gardencity.university/s3/`.

## 📋 Prerequisites
- Backend server running on `https://gardenia.gardencity.university`
- S3 bucket: `gardenia2025-assets`
- SSL certificate configured
- Access to server configuration files

---

## Option 1: Nginx Proxy (Recommended for Most Servers)

### Step 1: Locate Your Nginx Configuration

```bash
# Find nginx configuration files
sudo find /etc -name "nginx.conf" 2>/dev/null
sudo find /etc -name "*.conf" -path "*/nginx/*" 2>/dev/null

# Common locations:
# /etc/nginx/nginx.conf
# /etc/nginx/sites-available/your-site
# /etc/nginx/conf.d/your-site.conf
```

### Step 2: Backup Current Configuration

```bash
# Create backup
sudo cp /etc/nginx/sites-available/your-site /etc/nginx/sites-available/your-site.backup.$(date +%Y%m%d)

# Or if using nginx.conf directly
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d)
```

### Step 3: Add S3 Proxy Configuration

#### 3.1 Basic S3 Proxy
Add this to your server block in nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name gardenia.gardencity.university;
    
    # Your existing SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # S3 Proxy Configuration
    location /s3/ {
        # Remove /s3 prefix and proxy to S3
        rewrite ^/s3/(.*)$ /$1 break;
        
        # Proxy to S3 bucket
        proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
        proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers for S3 access
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        add_header Access-Control-Max-Age 3600 always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Max-Age 3600;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
        
        # Cache headers for better performance
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 1m;
    }
    
    # Your main application (Node.js/Express)
    location / {
        proxy_pass http://localhost:5000;  # Your backend port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3.2 Advanced S3 Proxy with Caching
For better performance, add caching:

```nginx
# Add to your nginx.conf (outside server block)
proxy_cache_path /var/cache/nginx/s3_cache levels=1:2 keys_zone=s3_cache:10m max_size=1g inactive=60m use_temp_path=off;

server {
    # ... your existing configuration ...
    
    location /s3/ {
        # Enable caching
        proxy_cache s3_cache;
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        
        # Remove /s3 prefix
        rewrite ^/s3/(.*)$ /$1 break;
        
        # Proxy to S3
        proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
        proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept" always;
    }
}
```

### Step 4: Test Nginx Configuration

```bash
# Test nginx configuration
sudo nginx -t

# If successful, reload nginx
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx
```

### Step 5: Verify S3 Proxy is Working

```bash
# Test S3 proxy
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Should return 200 OK with proper headers
```

---

## Option 2: Express.js Proxy (If using Node.js backend)

### Step 1: Install Required Packages

```bash
cd /path/to/your/backend
npm install http-proxy-middleware cors
```

### Step 2: Add Proxy Middleware to Your Express App

#### 2.1 Basic Express Proxy
Add this to your main server file (server.js or app.js):

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://gardenia.gardencity.university',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true
}));

// S3 Proxy middleware
app.use('/s3', createProxyMiddleware({
    target: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
    changeOrigin: true,
    pathRewrite: {
        '^/s3': '', // Remove /s3 prefix
    },
    onProxyReq: (proxyReq, req, res) => {
        // Set S3 host header
        proxyReq.setHeader('Host', 'gardenia2025-assets.s3.us-east-1.amazonaws.com');
        console.log('🔄 Proxying S3 request:', req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
        
        // Cache headers
        if (proxyRes.statusCode === 200) {
            proxyRes.headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        console.log('✅ S3 response:', proxyRes.statusCode, req.url);
    },
    logLevel: 'debug'
}));

// Your existing routes
app.get('/api/events', (req, res) => {
    // Your existing API routes
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

#### 2.2 Advanced Express Proxy with Error Handling
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://gardenia.gardencity.university',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true
}));

// S3 Proxy with error handling
app.use('/s3', createProxyMiddleware({
    target: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
    changeOrigin: true,
    pathRewrite: {
        '^/s3': '',
    },
    onError: (err, req, res) => {
        console.error('❌ S3 Proxy Error:', err.message);
        res.status(500).json({
            error: 'S3 proxy error',
            message: err.message
        });
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Host', 'gardenia2025-assets.s3.us-east-1.amazonaws.com');
        console.log('🔄 S3 Request:', req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        // CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
        
        // Cache headers
        if (proxyRes.statusCode === 200) {
            proxyRes.headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        console.log('✅ S3 Response:', proxyRes.statusCode, req.url);
    },
    logLevel: 'debug'
}));

// Handle OPTIONS requests for CORS
app.options('/s3/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.sendStatus(200);
});

// Your existing routes
app.get('/api/events', (req, res) => {
    // Your existing API routes
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 S3 Proxy available at: https://gardenia.gardencity.university/s3/`);
});
```

### Step 3: Test Express Proxy

```bash
# Restart your Node.js server
pm2 restart your-app-name
# or
node server.js

# Test the proxy
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

---

## Option 3: CloudFlare Workers (If using CloudFlare)

### Step 1: Create CloudFlare Worker

1. Go to CloudFlare Dashboard
2. Navigate to Workers & Pages
3. Create a new Worker
4. Add this code:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle S3 proxy requests
  if (url.pathname.startsWith('/s3/')) {
    // Remove /s3 prefix
    const s3Path = url.pathname.replace('/s3', '')
    const s3Url = `https://gardenia2025-assets.s3.us-east-1.amazonaws.com${s3Path}`
    
    console.log('🔄 Proxying to S3:', s3Url)
    
    // Forward to S3
    const s3Request = new Request(s3Url, {
      method: request.method,
      headers: request.headers
    })
    
    try {
      const response = await fetch(s3Request)
      
      // Add CORS headers
      const newResponse = new Response(response.body, response)
      newResponse.headers.set('Access-Control-Allow-Origin', '*')
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
      newResponse.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      
      console.log('✅ S3 Response:', response.status, s3Path)
      return newResponse
    } catch (error) {
      console.error('❌ S3 Error:', error.message)
      return new Response('S3 Proxy Error', { status: 500 })
    }
  }
  
  // Handle other requests normally
  return fetch(request)
}
```

### Step 2: Configure Worker Route

1. In CloudFlare Dashboard, go to Workers & Pages
2. Select your worker
3. Go to Settings > Triggers
4. Add route: `gardenia.gardencity.university/s3/*`

---

## Step 4: Update S3 Bucket CORS Policy

### Step 1: Access AWS S3 Console

1. Go to AWS S3 Console
2. Find your bucket: `gardenia2025-assets`
3. Go to Permissions tab
4. Scroll down to Cross-origin resource sharing (CORS)

### Step 2: Update CORS Configuration

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

### Step 3: Save CORS Configuration

1. Click "Save changes"
2. Wait for changes to propagate (usually 1-2 minutes)

---

## Step 5: Testing Your Configuration

### Step 1: Test S3 Proxy

```bash
# Test if proxy is working
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Expected response:
# HTTP/2 200
# access-control-allow-origin: *
# access-control-allow-methods: GET, HEAD, OPTIONS
# content-type: image/png
```

### Step 2: Test CORS

```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Expected response:
# HTTP/2 204
# access-control-allow-origin: *
# access-control-allow-methods: GET, HEAD, OPTIONS
```

### Step 3: Test from Browser

Open browser console and run:

```javascript
// Test S3 proxy from browser
fetch('https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png')
  .then(response => {
    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', response.headers);
    return response.blob();
  })
  .then(blob => {
    console.log('✅ Image loaded successfully, size:', blob.size, 'bytes');
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

### Step 4: Test All Asset Types

```bash
# Test event images
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
curl -I https://gardenia.gardencity.university/s3/event-images/Bedminton.png

# Test logos
curl -I https://gardenia.gardencity.university/s3/logos/elemental-logo.png

# Test documents
curl -I https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf

# Test videos
curl -I https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4
```

---

## Step 6: Troubleshooting

### Common Issues and Solutions

#### Issue 1: 404 Errors
```bash
# Check if proxy is configured
curl -v https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### Issue 2: CORS Errors
```bash
# Test CORS headers
curl -H "Origin: https://gardenia.gardencity.university" \
     -X OPTIONS \
     https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

#### Issue 3: SSL/HTTPS Issues
```bash
# Check SSL certificate
openssl s_client -connect gardenia.gardencity.university:443 -servername gardenia.gardencity.university

# Test HTTPS redirect
curl -I http://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

#### Issue 4: Cache Issues
```bash
# Clear nginx cache (if using caching)
sudo rm -rf /var/cache/nginx/s3_cache/*

# Reload nginx
sudo systemctl reload nginx
```

### Debug Commands

```bash
# Check nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Test S3 access directly
curl -I https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png

# Test proxy access
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

---

## Step 7: Performance Optimization

### 1. Enable Caching (Nginx)

```nginx
# Add to your nginx.conf
proxy_cache_path /var/cache/nginx/s3_cache levels=1:2 keys_zone=s3_cache:10m max_size=1g inactive=60m use_temp_path=off;

# In your server block
location /s3/ {
    proxy_cache s3_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_valid 404 1m;
    # ... rest of your configuration
}
```

### 2. Enable Compression

```nginx
# Add to your server block
gzip on;
gzip_types image/png image/jpeg image/gif application/pdf video/mp4;
gzip_proxied any;
```

### 3. Set Proper Cache Headers

```nginx
# Add to your S3 proxy location
location /s3/ {
    # ... your existing configuration ...
    
    # Cache headers
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

---

## ✅ Success Checklist

- [ ] S3 proxy is configured at `/s3/` path
- [ ] CORS headers are set correctly
- [ ] S3 bucket CORS policy is updated
- [ ] All asset URLs return 200 OK
- [ ] CORS preflight requests work
- [ ] Browser can load assets without errors
- [ ] SSL/HTTPS is working properly
- [ ] Cache headers are set appropriately
- [ ] Error handling is in place
- [ ] Logging is configured for debugging

## 🚀 Final Testing

Once everything is configured, test your frontend:

1. Build your frontend with production environment variables
2. Deploy to your production domain
3. Open the website and check if all images load correctly
4. Check browser console for any errors
5. Test on different browsers and devices

Your S3 proxy should now be working perfectly! 🎉
