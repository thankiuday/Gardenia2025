# Frontend Deployment Guide - Local & Production

This guide explains how the frontend works seamlessly in both local development and production environments.

## 🏠 **Local Development**

### **Environment Setup**
Create a `.env` file in the `frontend/` directory:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000
```

### **How It Works**
- **API Calls**: All API calls go to `http://localhost:5000`
- **Ticket Downloads**: 
  - If tickets are stored locally: `http://localhost:5000/uploads/ticket.pdf`
  - If tickets are stored in S3: Direct S3 URL (e.g., `https://bucket.s3.region.amazonaws.com/tickets/ticket.pdf`)

### **Running Locally**
```bash
cd frontend
npm install
npm run dev
```

## 🚀 **Production Deployment**

### **Environment Setup**
Set environment variables in your hosting platform (Render, Vercel, Netlify, etc.):

```bash
# Production environment variables
VITE_API_URL=https://your-backend-domain.com
```

### **How It Works**
- **API Calls**: All API calls go to your production backend
- **Ticket Downloads**: 
  - If tickets are stored in S3: Direct S3 URL (recommended)
  - If tickets are stored locally: Your backend URL + file path

## 🔄 **Automatic Environment Detection**

The `getFullUrl()` helper function automatically handles both scenarios:

```javascript
export const getFullUrl = (path) => {
  // If path is already a full URL (S3), return as is
  if (path && path.startsWith('http')) {
    return path;
  }
  // Otherwise, prepend the API base URL (local files)
  return `${API_BASE_URL}${path || ''}`;
};
```

### **Examples**

#### **Local Development**
```javascript
// Environment: VITE_API_URL=http://localhost:5000
// PDF URL from backend: "/uploads/GDN2025-1234.pdf"
// Result: "http://localhost:5000/uploads/GDN2025-1234.pdf"
```

#### **Production with S3**
```javascript
// Environment: VITE_API_URL=https://api.gardenia2025.com
// PDF URL from backend: "https://gardenia2025-assets.s3.us-east-1.amazonaws.com/tickets/GDN2025-1234.pdf"
// Result: "https://gardenia2025-assets.s3.us-east-1.amazonaws.com/tickets/GDN2025-1234.pdf" (unchanged)
```

#### **Production with Local Files**
```javascript
// Environment: VITE_API_URL=https://api.gardenia2025.com
// PDF URL from backend: "/uploads/GDN2025-1234.pdf"
// Result: "https://api.gardenia2025.com/uploads/GDN2025-1234.pdf"
```

## 🎯 **Deployment Platforms**

### **Render.com**
1. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

### **Vercel**
1. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`

### **Netlify**
1. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

## 🔧 **Backend Configuration**

### **CORS Setup**
Ensure your backend allows requests from your frontend domain:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

### **Environment Variables**
```bash
# backend/.env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-url
JWT_SECRET=your-production-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gardenia2025-assets
```

## 📊 **Testing Both Environments**

### **Local Testing**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### **Production Testing**
1. Deploy backend to your hosting platform
2. Deploy frontend with correct `VITE_API_URL`
3. Test registration and ticket download
4. Verify S3 integration works

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
- **Problem**: Frontend can't access backend API
- **Solution**: Update CORS configuration in backend to include your frontend domain

### **Environment Variables Not Working**
- **Problem**: `VITE_API_URL` not being read
- **Solution**: Ensure variable starts with `VITE_` and restart dev server

### **Ticket Downloads Failing**
- **Problem**: PDF links not working
- **Solution**: Check if `getFullUrl()` is being used and S3 configuration is correct

### **Build Failures**
- **Problem**: Build process fails
- **Solution**: Ensure all environment variables are set in your hosting platform

## ✅ **Verification Checklist**

### **Local Development**
- [ ] Frontend runs on `http://localhost:5173`
- [ ] Backend runs on `http://localhost:5000`
- [ ] API calls work correctly
- [ ] Ticket downloads work (local or S3)
- [ ] No console errors

### **Production**
- [ ] Frontend deployed successfully
- [ ] Environment variables set correctly
- [ ] Backend accessible from frontend
- [ ] CORS configured properly
- [ ] S3 integration working
- [ ] Ticket downloads working
- [ ] No console errors

## 🎉 **Benefits of This Setup**

1. **🔄 Seamless Transition**: Same code works in both environments
2. **☁️ S3 Ready**: Automatic handling of S3 URLs
3. **🔧 Easy Configuration**: Single environment variable controls API URL
4. **📱 Responsive**: Works on all devices and browsers
5. **🚀 Production Ready**: Optimized builds and proper error handling

---

**Your application is now ready for both local development and production deployment!** 🎉
