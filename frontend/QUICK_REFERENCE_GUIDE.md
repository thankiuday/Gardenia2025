# S3 Proxy Quick Reference Guide

## 🚀 Quick Setup (Choose Your Backend)

### Option A: Nginx (Most Common)
```bash
# 1. Edit nginx config
sudo nano /etc/nginx/sites-available/your-site

# 2. Add this to your server block:
location /s3/ {
    rewrite ^/s3/(.*)$ /$1 break;
    proxy_pass https://gardenia2025-assets.s3.us-east-1.amazonaws.com/;
    proxy_set_header Host gardenia2025-assets.s3.us-east-1.amazonaws.com;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
}

# 3. Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Option B: Express.js (Node.js Backend)
```bash
# 1. Install packages
npm install http-proxy-middleware cors

# 2. Add to your server.js:
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/s3', createProxyMiddleware({
    target: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
    changeOrigin: true,
    pathRewrite: { '^/s3': '' }
}));

# 3. Restart server
pm2 restart your-app
```

## 🔧 Environment Variables

### Production (.env or environment)
```bash
VITE_S3_BASE_URL=https://gardenia.gardencity.university/s3
VITE_API_URL=https://gardenia.gardencity.university
```

### Development (no changes needed)
```bash
# Uses default S3 URLs automatically
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing Commands

### Test S3 Proxy
```bash
# Test if proxy works
curl -I https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Should return 200 OK
```

### Test CORS
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://gardenia.gardencity.university" \
  https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png

# Should return 204 No Content
```

### Test from Browser
```javascript
// Open browser console and run:
fetch('https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e));
```

## 🔍 Troubleshooting

### 404 Errors
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if proxy is configured
curl -v https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

### CORS Errors
```bash
# Test CORS headers
curl -H "Origin: https://gardenia.gardencity.university" \
     -X OPTIONS \
     https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

### SSL Issues
```bash
# Check SSL certificate
openssl s_client -connect gardenia.gardencity.university:443

# Test HTTPS redirect
curl -I http://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
```

## 📊 URL Examples

| Asset Type | Production URL |
|------------|---------------|
| **Event Images** | `https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png` |
| **Logos** | `https://gardenia.gardencity.university/s3/logos/elemental-logo.png` |
| **Documents** | `https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf` |
| **Videos** | `https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4` |

## ✅ Success Checklist

- [ ] S3 proxy configured at `/s3/` path
- [ ] CORS headers set correctly
- [ ] S3 bucket CORS policy updated
- [ ] All asset URLs return 200 OK
- [ ] Browser can load assets without errors
- [ ] SSL/HTTPS working properly

## 🚨 Common Issues

1. **404 Errors**: Check if proxy is configured correctly
2. **CORS Errors**: Ensure CORS headers are set properly
3. **SSL Issues**: Make sure SSL certificates are valid
4. **Cache Issues**: Clear browser cache and CDN cache

## 📞 Need Help?

1. Check browser console for errors
2. Verify backend proxy configuration
3. Test S3 bucket access directly
4. Check CORS policy settings
5. Review server logs for errors
