# 🔧 Event Images Troubleshooting Guide

## ✅ **Images Uploaded - Let's Verify Everything Works!**

Since you've uploaded all event images to the `event-images` folder, here's how to verify and troubleshoot:

## 🔍 **Step 1: Test Image URLs Directly**

Test these URLs in your browser to verify images are accessible:

### **Test URLs:**
```
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/basketball.jpg
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/waves-of-the-mind.jpg
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/canvas-painting.jpg
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/default-event.jpg
```

### **Expected Results:**
- ✅ **200 OK**: Image loads successfully
- ❌ **404 Not Found**: Image not found
- ❌ **403 Forbidden**: Access denied
- ❌ **CORS Error**: Cross-origin issue

## 🔧 **Step 2: Check S3 Bucket Configuration**

### **Verify S3 Bucket Settings:**
1. **Bucket Name**: `gardenia2025-assets`
2. **Folder Structure**: `event-images/`
3. **File Names**: Exact match with event IDs
4. **Permissions**: Public read access

### **S3 Bucket Policy (if needed):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gardenia2025-assets/event-images/*"
    }
  ]
}
```

## 🐛 **Step 3: Common Issues & Solutions**

### **Issue 1: Images Not Loading (404 Error)**
**Cause**: File names don't match event IDs
**Solution**: 
- Check event IDs in `frontend/src/data/events.js`
- Ensure image names match exactly (case-sensitive)
- Example: `waves-of-the-mind.jpg` not `Waves-Of-The-Mind.jpg`

### **Issue 2: CORS Error**
**Cause**: S3 bucket CORS not configured
**Solution**: Add CORS configuration to S3 bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### **Issue 3: 403 Forbidden**
**Cause**: S3 bucket permissions
**Solution**: 
- Make bucket public for read access
- Or configure proper IAM permissions

### **Issue 4: Images Load But Show Default**
**Cause**: Event ID mismatch
**Solution**: 
- Check `event.id` in the data
- Verify image file names match exactly

## 🔍 **Step 4: Debug in Browser**

### **Open Browser Console:**
1. Go to your events page
2. Open Developer Tools (F12)
3. Check Console for errors
4. Check Network tab for failed requests

### **Test Image Loading:**
```javascript
// Run this in browser console
const testImage = (eventId) => {
  const url = `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/${eventId}.jpg`;
  const img = new Image();
  img.onload = () => console.log(`✅ ${eventId} loaded`);
  img.onerror = () => console.log(`❌ ${eventId} failed`);
  img.src = url;
};

// Test specific events
testImage('basketball');
testImage('waves-of-the-mind');
testImage('canvas-painting');
```

## 📋 **Step 5: Verify All Event Images**

### **Complete Event Image Checklist:**
- [ ] `basketball.jpg` - Basketball
- [ ] `badminton.jpg` - Badminton
- [ ] `box-cricket.jpg` - Box Cricket
- [ ] `carrom.jpg` - Carrom
- [ ] `chess.jpg` - Chess
- [ ] `futsal.jpg` - Futsal
- [ ] `kabaddi.jpg` - Kabaddi
- [ ] `table-tennis.jpg` - Table Tennis
- [ ] `battle-of-the-bands.jpg` - Battle of the Bands
- [ ] `elements-in-elegance.jpg` - Elements in Elegance
- [ ] `group-singing.jpg` - Group Singing
- [ ] `quiz-trivia.jpg` - Quiz Trivia
- [ ] `street-dance-showdown.jpg` - Street Dance Showdown
- [ ] `canvas-painting.jpg` - Canvas Painting
- [ ] `face-painting.jpg` - Face Painting
- [ ] `rhythmic-elements.jpg` - Rhythmic Elements
- [ ] `soloverse.jpg` - SoloVerse
- [ ] `soulful-singing-solo.jpg` - Soulful Singing
- [ ] `brain-bytes.jpg` - Brain Bytes
- [ ] `cell-survivor.jpg` - Cell Survivor
- [ ] `chasing-shadows.jpg` - Chasing Shadows
- [ ] `decoding-life-bioquest.jpg` - Decoding Life
- [ ] `elemental-path-to-power.jpg` - Elemental Path
- [ ] `frames-of-the-elements.jpg` - Frames of Elements
- [ ] `gene-o-mania.jpg` - Gene-O-Mania
- [ ] `herb-a-thon.jpg` - Herb-a-thon
- [ ] `ignite-the-market.jpg` - Ignite Market
- [ ] `ink-spire-25.jpg` - Ink-Spire
- [ ] `paper-draping.jpg` - Paper Draping
- [ ] `prompt-a-thon.jpg` - Prompt-a-thon
- [ ] `snackvertise.jpg` - SnackVertise
- [ ] `startup-sparks.jpg` - Startup Sparks
- [ ] `sweet-earthly-heritage.jpg` - Sweet Heritage
- [ ] `visionx-tourism.jpg` - VisionX Tourism
- [ ] `waves-of-the-mind.jpg` - Waves of Mind
- [ ] `whispers-of-air.jpg` - Whispers of Air
- [ ] `default-event.jpg` - Default Fallback

## 🚀 **Step 6: Quick Fixes**

### **If Images Still Not Loading:**

1. **Check File Names**: Ensure exact match with event IDs
2. **Check S3 Permissions**: Make sure bucket is public
3. **Check CORS**: Configure S3 CORS policy
4. **Check Network**: Look for 404/403 errors in browser
5. **Test Direct URLs**: Open image URLs directly in browser

### **Emergency Fallback:**
If images still don't load, the application will show the default fallback image (`default-event.jpg`).

## 📞 **Need Help?**

If you're still having issues:
1. Check browser console for specific error messages
2. Test image URLs directly in browser
3. Verify S3 bucket permissions
4. Check file names match event IDs exactly

Your event images should now be visible! 🎉
