# 🚀 Gardenia 2025 - Render Deployment Guide

This guide will walk you through deploying your Gardenia 2025 application on Render.com.

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] A Render.com account (free tier available)
- [ ] A MongoDB Atlas account (free tier available)
- [ ] An AWS account for S3 storage (optional but recommended)
- [ ] Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new account or sign in
3. Create a new project called "Gardenia2025"
4. Create a new cluster (choose the free M0 tier)
5. Wait for the cluster to be created (2-3 minutes)

### Step 2: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with:
   - Username: `gardenia-admin`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"

### Step 3: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Add `0.0.0.0/0` to allow access from anywhere (for Render deployment)

### Step 4: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/gardenia2025`)

## 🎯 Backend Deployment on Render

### Step 1: Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `gardenia2025-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 2: Set Environment Variables
In the Render dashboard, go to "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://gardenia-admin:YOUR_PASSWORD@cluster.mongodb.net/gardenia2025
JWT_SECRET=your-super-secure-jwt-secret-here
FRONTEND_URL=https://gardenia2025-frontend.onrender.com
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gardenia2025-assets
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with the actual password you created for the MongoDB user
- Generate a strong JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- AWS credentials are optional but recommended for PDF storage

### Step 3: Deploy Backend
1. Click "Create Web Service"
2. Wait for the deployment to complete (5-10 minutes)
3. Note the URL (e.g., `https://gardenia2025-backend.onrender.com`)

## 🎨 Frontend Deployment on Render

### Step 1: Create Frontend Service
1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `gardenia2025-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

### Step 2: Set Environment Variables
In the Render dashboard, go to "Environment" tab and add:

```env
VITE_API_URL=https://gardenia2025-backend.onrender.com
GENERATE_SOURCEMAP=false
```

**Important:** Replace `gardenia2025-backend.onrender.com` with your actual backend URL from Step 3 above.

### Step 3: Deploy Frontend
1. Click "Create Static Site"
2. Wait for the deployment to complete (3-5 minutes)
3. Note the URL (e.g., `https://gardenia2025-frontend.onrender.com`)

## 🔄 Update Backend CORS Configuration

After frontend deployment, update your backend environment variables:

1. Go to your backend service in Render
2. Go to "Environment" tab
3. Update `FRONTEND_URL` to match your frontend URL
4. Click "Save Changes"
5. The service will automatically redeploy

## 🧪 Testing Your Deployment

### Backend Health Check
Visit: `https://your-backend-url.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-XX...",
  "environment": "production"
}
```

### Frontend Test
1. Visit your frontend URL
2. Check if the page loads correctly
3. Try registering for an event
4. Test the admin login functionality

## 🔧 Post-Deployment Setup

### 1. Create Admin User
Run this command locally to create an admin user:
```bash
cd backend
node scripts/createAdmin.js
```

Or create one through the admin interface after deployment.

### 2. Seed Events (Optional)
If you want to populate events:
```bash
cd backend
node scripts/seedEvents.js
```

### 3. Set Up S3 (Optional but Recommended)
1. Create an S3 bucket in AWS
2. Configure CORS for the bucket
3. Update your environment variables with AWS credentials

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs in Render dashboard

#### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is running and accessible

#### Database Connection Issues
- Verify MongoDB Atlas network access allows all IPs
- Check database user credentials
- Ensure connection string is correct

#### File Upload Issues
- Check AWS S3 configuration
- Verify bucket permissions
- Check AWS credentials

### Getting Help
- Check Render logs in the dashboard
- Verify all environment variables are set
- Test API endpoints individually
- Check MongoDB Atlas logs

## 📊 Monitoring and Maintenance

### Render Dashboard
- Monitor service health
- Check deployment logs
- Monitor resource usage

### MongoDB Atlas
- Monitor database performance
- Set up alerts for connection issues
- Regular backups (automatic on Atlas)

### Performance Tips
- Enable Render's auto-scaling for paid plans
- Use CDN for static assets
- Optimize database queries
- Monitor API response times

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **JWT Secret**: Use a strong, random secret
3. **Database Access**: Use least-privilege access
4. **CORS**: Only allow necessary origins
5. **Rate Limiting**: Already configured in your backend
6. **HTTPS**: Automatically provided by Render

## 🎉 Congratulations!

Your Gardenia 2025 application is now live on Render! 

**Your URLs:**
- Frontend: `https://gardenia2025-frontend.onrender.com`
- Backend: `https://gardenia2025-backend.onrender.com`

## 📞 Support

For issues or questions:
- **Developer**: NerdsAndGeeks
- **Email**: udaythanki2@gmail.com
- **Render Support**: [Render Documentation](https://render.com/docs)

---

**🎊 Your Gardenia 2025 event management system is ready for the world!**
