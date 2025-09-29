# Backend S3 Proxy Configuration Guide

## Overview
Your backend server needs to act as a proxy for S3 assets. When a request comes to `https://gardenia.gardencity.university/s3/...`, it should forward it to your S3 bucket.

## Option 1: Nginx Configuration (Recommended)

### 1.1 Basic Nginx Proxy
```nginx
server {
    listen 443 ssl;
    server_name gardenia.gardencity.university;
    
    # SSL configuration
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
        
        # Cache headers
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 1m;
    }
    
    # Your main application
    location / {
        proxy_pass http://localhost:5000;  # Your Node.js app
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 1.2 Advanced Nginx with Caching
```nginx
# Add to your nginx.conf
proxy_cache_path /var/cache/nginx/s3_cache levels=1:2 keys_zone=s3_cache:10m max_size=1g inactive=60m use_temp_path=off;

server {
    # ... other configuration ...
    
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

## Option 2: Express.js Proxy (Alternative)

### 2.1 Install Required Packages
```bash
npm install http-proxy-middleware cors
```

### 2.2 Express.js Proxy Implementation
```javascript
// In your Express server (server.js or app.js)
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// CORS configuration
app.use(cors({
    origin: ['https://gardenia.gardencity.university', 'http://localhost:3000'],
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
    },
    logLevel: 'debug'
}));
```

## Option 3: CloudFlare Proxy (If using CloudFlare)

### 3.1 CloudFlare Workers
```javascript
// CloudFlare Worker script
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/s3/')) {
    // Remove /s3 prefix
    const s3Path = url.pathname.replace('/s3', '')
    const s3Url = `https://gardenia2025-assets.s3.us-east-1.amazonaws.com${s3Path}`
    
    // Forward to S3
    const s3Request = new Request(s3Url, {
      method: request.method,
      headers: request.headers
    })
    
    const response = await fetch(s3Request)
    
    // Add CORS headers
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    newResponse.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    
    return newResponse
  }
  
  return fetch(request)
}
```

## Testing Your Configuration

### 1. Test S3 Proxy
```bash
# Test if proxy is working
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Should return 200 OK with proper headers
```

### 2. Test CORS
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

### 3. Test from Browser
```javascript
// Test in browser console
fetch('https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    return response.blob();
  })
  .then(blob => console.log('Image loaded successfully'))
  .catch(error => console.error('Error:', error));
```

## Troubleshooting

### Common Issues:

1. **404 Errors**: Check if S3 proxy is configured correctly
2. **CORS Errors**: Ensure CORS headers are set properly
3. **SSL Issues**: Make sure SSL certificates are valid
4. **Cache Issues**: Clear browser cache and CDN cache

### Debug Commands:
```bash
# Check nginx configuration
nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```
