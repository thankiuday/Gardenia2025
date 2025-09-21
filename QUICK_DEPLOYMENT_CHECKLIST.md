# ⚡ Quick Deployment Checklist - Gardenia 2025

## 🚀 Pre-Deployment (5 minutes)

### ✅ Database Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created (M0 free tier)
- [ ] Database user created (`gardenia-admin`)
- [ ] Network access configured (`0.0.0.0/0`)
- [ ] Connection string copied

### ✅ AWS Setup (Optional)
- [ ] AWS account ready
- [ ] S3 bucket created
- [ ] AWS credentials generated
- [ ] Bucket CORS configured

### ✅ Code Preparation
- [ ] Code pushed to Git repository
- [ ] All files committed
- [ ] No sensitive data in code

## 🎯 Backend Deployment (10 minutes)

### ✅ Render Backend Service
- [ ] New Web Service created
- [ ] Git repository connected
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=strong-random-secret`
  - [ ] `FRONTEND_URL=https://gardenia2025-frontend.onrender.com`
  - [ ] AWS credentials (if using S3)
- [ ] Service deployed successfully
- [ ] Health check passed: `/api/health`

## 🎨 Frontend Deployment (5 minutes)

### ✅ Render Frontend Service
- [ ] New Static Site created
- [ ] Git repository connected
- [ ] Build command: `cd frontend && npm install && npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Environment variables set:
  - [ ] `VITE_API_URL=https://your-backend-url.onrender.com`
  - [ ] `GENERATE_SOURCEMAP=false`
- [ ] Site deployed successfully
- [ ] Frontend loads correctly

## 🔄 Post-Deployment (5 minutes)

### ✅ Configuration Updates
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed after CORS update
- [ ] Frontend-backend connection tested

### ✅ Admin Setup
- [ ] Admin user created
- [ ] Admin login tested
- [ ] Admin dashboard accessible

### ✅ Functionality Tests
- [ ] Event registration works
- [ ] QR code generation works
- [ ] PDF download works
- [ ] Contact form works
- [ ] Admin features work

## 🧪 Final Verification

### ✅ Backend Tests
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Events endpoint
curl https://your-backend-url.onrender.com/api/events
```

### ✅ Frontend Tests
- [ ] Homepage loads
- [ ] Events page loads
- [ ] Registration form works
- [ ] Admin login works
- [ ] All navigation works

### ✅ Integration Tests
- [ ] Registration creates database entry
- [ ] QR codes generate correctly
- [ ] PDFs download successfully
- [ ] Admin can view registrations

## 🎉 Deployment Complete!

**Your URLs:**
- Frontend: `https://gardenia2025-frontend.onrender.com`
- Backend: `https://gardenia2025-backend.onrender.com`

## 🚨 If Something Goes Wrong

### Backend Issues
1. Check Render logs
2. Verify environment variables
3. Test MongoDB connection
4. Check CORS configuration

### Frontend Issues
1. Check build logs
2. Verify API URL
3. Check browser console
4. Test API endpoints directly

### Database Issues
1. Check MongoDB Atlas logs
2. Verify network access
3. Test connection string
4. Check user permissions

## 📞 Quick Support

**Need help?**
- Check the full deployment guide: `RENDER_DEPLOYMENT_GUIDE.md`
- Contact: udaythanki2@gmail.com
- Render docs: https://render.com/docs

---

**⏱️ Total deployment time: ~25 minutes**
**🎊 Your Gardenia 2025 app is live!**
