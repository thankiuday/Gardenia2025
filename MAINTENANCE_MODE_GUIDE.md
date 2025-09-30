# 🛠️ Maintenance Mode Guide

This guide explains how to use the maintenance mode feature for your Gardenia 2025 website.

## 📋 Overview

The maintenance mode allows you to display a professional maintenance page to users while you perform updates, fixes, or improvements to your website.

## 🚀 How to Enable/Disable Maintenance Mode

### Method 1: Environment Variable (Recommended for Production)

1. **Set environment variable:**
   ```bash
   # In your production environment
   VITE_MAINTENANCE_MODE=true
   ```

2. **Remove or set to false to disable:**
   ```bash
   VITE_MAINTENANCE_MODE=false
   # or remove the variable entirely
   ```

### Method 2: Code Configuration

1. **Open:** `frontend/src/utils/maintenance.js`

2. **Change the configuration:**
   ```javascript
   export const MAINTENANCE_CONFIG = {
     // Set to true to enable maintenance mode
     isMaintenanceMode: true, // Change this to true
     // ... rest of config
   };
   ```

3. **Build and deploy:**
   ```bash
   cd frontend
   npm run build
   ```

### Method 3: Development Toggle (Development Only)

1. **Run in development mode:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Look for the maintenance toggle** in the bottom-right corner of the page

3. **Click the toggle** to enable/disable maintenance mode

## 🎛️ Maintenance Mode Features

### ✅ What's Included

- **Professional Design**: Beautiful, responsive maintenance page
- **Animated Elements**: Smooth animations and rotating maintenance icon
- **Contact Information**: Email and phone number for urgent inquiries
- **Social Media Links**: Instagram, Facebook, and YouTube links
- **Auto-Refresh**: Optional automatic page refresh to check for updates
- **Status Indicators**: Visual indicators showing maintenance progress

### 🔧 Customization Options

Edit `frontend/src/utils/maintenance.js` to customize:

```javascript
settings: {
  // Custom message for maintenance
  customMessage: "Your custom message here",
  
  // Estimated completion time
  estimatedCompletion: "2024-01-15T10:00:00Z",
  
  // Auto-refresh interval in seconds
  autoRefreshInterval: 30,
  
  // Page title
  pageTitle: "Under Maintenance - Gardenia 2025",
  
  // Show/hide contact info and social links
  showContactInfo: true,
  showSocialLinks: true
}
```

## 🚨 Emergency Access

### For Administrators

If you need to bypass maintenance mode:

1. **In Development:**
   - Use the maintenance toggle in the bottom-right corner
   - Click "Bypass Maintenance"

2. **In Production:**
   - Open browser console
   - Run: `localStorage.setItem('bypass_maintenance', 'true')`
   - Refresh the page

3. **Remove bypass:**
   ```javascript
   localStorage.removeItem('bypass_maintenance')
   ```

## 🌐 Deployment Scenarios

### Scenario 1: Planned Maintenance

1. **Before maintenance:**
   ```bash
   # Set environment variable
   export VITE_MAINTENANCE_MODE=true
   
   # Build and deploy
   cd frontend && npm run build
   # Deploy to your hosting platform
   ```

2. **After maintenance:**
   ```bash
   # Remove environment variable or set to false
   export VITE_MAINTENANCE_MODE=false
   
   # Rebuild and deploy
   cd frontend && npm run build
   # Deploy to your hosting platform
   ```

### Scenario 2: Emergency Maintenance

1. **Quick activation via code:**
   - Edit `frontend/src/utils/maintenance.js`
   - Set `isMaintenanceMode: true`
   - Build and deploy immediately

2. **For faster deployment:**
   - Use your hosting platform's environment variable settings
   - Set `VITE_MAINTENANCE_MODE=true`
   - Redeploy without code changes

## 📱 Mobile Responsiveness

The maintenance page is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All screen sizes

## 🎨 Design Features

- **Gradient Background**: Beautiful emerald to teal gradient
- **Glassmorphism Effects**: Modern glass-like elements
- **Smooth Animations**: Framer Motion animations
- **Rotating Maintenance Icon**: Visual indicator of ongoing work
- **Professional Typography**: Clean, readable fonts
- **Brand Consistency**: Uses Garden City University branding

## 🔍 Testing Maintenance Mode

### Test in Development

1. **Start development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Enable maintenance mode** using the toggle

3. **Test different screen sizes** using browser dev tools

4. **Test social media links** and contact information

### Test in Production

1. **Deploy with maintenance mode enabled**
2. **Test from different devices**
3. **Verify all links work correctly**
4. **Check mobile responsiveness**

## 🛡️ Security Considerations

- **Environment Variables**: Use environment variables for production to avoid exposing maintenance settings
- **Admin Access**: Only authorized personnel should have access to maintenance controls
- **Bypass Protection**: The bypass feature should only be used by administrators

## 📞 Support Contacts

The maintenance page displays these contact options:
- **Email**: info@gardencity.university
- **Social Media**: Instagram, Facebook, YouTube

## 🚀 Quick Commands

### Enable Maintenance Mode
```bash
# Method 1: Environment Variable
export VITE_MAINTENANCE_MODE=true && cd frontend && npm run build

# Method 2: Code Change
# Edit maintenance.js → set isMaintenanceMode: true → build
```

### Disable Maintenance Mode
```bash
# Method 1: Environment Variable
export VITE_MAINTENANCE_MODE=false && cd frontend && npm run build

# Method 2: Code Change
# Edit maintenance.js → set isMaintenanceMode: false → build
```

### Emergency Bypass
```javascript
// Run in browser console
localStorage.setItem('bypass_maintenance', 'true');
location.reload();
```

## 📝 Best Practices

1. **Always test** maintenance mode before deploying
2. **Set realistic expectations** in the maintenance message
3. **Provide alternative contact methods** for urgent inquiries
4. **Keep maintenance windows short** when possible
5. **Communicate maintenance schedules** in advance when possible
6. **Monitor social media** for user feedback during maintenance

---

**Need Help?** Contact the development team or refer to the main documentation for additional support.
