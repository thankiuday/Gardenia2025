# Practical Example: Setting Up S3 Proxy

## 🎯 Real-World Example

Let's say you have:
- **Domain**: `https://gardenia.gardencity.university`
- **Backend**: Node.js/Express running on port 5000
- **Web Server**: Nginx
- **S3 Bucket**: `gardenia2025-assets`

## Step 1: Nginx Configuration

### 1.1 Edit Your Nginx Config
```bash
# Open your nginx configuration
sudo nano /etc/nginx/sites-available/gardenia
```

### 1.2 Add S3 Proxy Block
```nginx
server {
    listen 443 ssl http2;
    server_name gardenia.gardencity.university;
    
    # Your SSL configuration
    ssl_certificate /etc/ssl/certs/gardenia.crt;
    ssl_certificate_key /etc/ssl/private/gardenia.key;
    
    # S3 Proxy - This is what you need to add
    location /s3/ {
        # Remove /s3 prefix and proxy to S3
        rewrite ^/s3/(.*)$ /$1 break;
        
        # Proxy to S3 bucket
        proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
        proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }
    
    # Your main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 1.3 Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# If successful, reload
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

## Step 2: Test Your Configuration

### 2.1 Test S3 Proxy
```bash
# Test if proxy works
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Expected output:
# HTTP/2 200
# access-control-allow-origin: *
# content-type: image/png
```

### 2.2 Test CORS
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Expected output:
# HTTP/2 204
# access-control-allow-origin: *
```

### 2.3 Test from Browser
Open browser console and run:
```javascript
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

## Step 3: Update S3 Bucket CORS

### 3.1 Access AWS S3 Console
1. Go to AWS S3 Console
2. Find bucket: `gardenia2025-assets`
3. Go to Permissions tab
4. Scroll to Cross-origin resource sharing (CORS)

### 3.2 Update CORS Configuration
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

### 3.3 Save Changes
Click "Save changes" and wait for propagation (1-2 minutes)

## Step 4: Test Your Frontend

### 4.1 Build with Production Environment
```bash
# Set environment variables
export VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3
export VITE_API_URL=https://gardenia.gardencity.university

# Build for production
npm run build

# Deploy to your server
```

### 4.2 Test All Asset Types
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

## Step 5: Verify Everything Works

### 5.1 Check Browser Console
Open your website and check browser console for any errors:
- No CORS errors
- All images load correctly
- No 404 errors

### 5.2 Test Different Browsers
- Chrome
- Firefox
- Safari
- Edge

### 5.3 Test Different Devices
- Desktop
- Mobile
- Tablet

## 🚨 Troubleshooting

### Issue 1: 404 Errors
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if proxy is configured
curl -v https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

### Issue 2: CORS Errors
```bash
# Test CORS headers
curl -H "Origin: https://gardenia.gardencity.university" \
     -X OPTIONS \
     https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

### Issue 3: SSL Issues
```bash
# Check SSL certificate
openssl s_client -connect gardenia.gardencity.university:443

# Test HTTPS redirect
curl -I http://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

## ✅ Success Indicators

- [ ] All asset URLs return 200 OK
- [ ] CORS preflight requests work
- [ ] Browser can load assets without errors
- [ ] No console errors
- [ ] Images display correctly
- [ ] Documents download properly
- [ ] Videos play correctly

## 🎉 You're Done!

Once all tests pass, your S3 proxy is working perfectly! Your frontend will now serve all S3 assets through your production domain `https://gardenia.gardencity.university/s3/`.

## 📞 Need Help?

If you encounter issues:
1. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
2. Test S3 access directly: `curl -I https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png`
3. Test proxy access: `curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png`
4. Check browser console for errors
5. Verify S3 bucket CORS policy
