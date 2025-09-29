// Test Event Images Accessibility
// Run this in your browser console to test if images are loading

const testImages = [
  'basketball',
  'waves-of-the-mind', 
  'canvas-painting',
  'default-event'
];

const baseUrl = 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images';

console.log('🔍 Testing Event Images...');

testImages.forEach(eventId => {
  const imageUrl = `${baseUrl}/${eventId}.jpg`;
  console.log(`Testing: ${eventId}.jpg`);
  
  const img = new Image();
  img.onload = () => {
    console.log(`✅ ${eventId}.jpg - LOADED SUCCESSFULLY`);
  };
  img.onerror = () => {
    console.log(`❌ ${eventId}.jpg - FAILED TO LOAD`);
  };
  img.src = imageUrl;
});

console.log('📋 Test URLs:');
testImages.forEach(eventId => {
  console.log(`https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/${eventId}.jpg`);
});
