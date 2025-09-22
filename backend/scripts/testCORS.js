const axios = require('axios');

// Test CORS configuration
const testCORS = async () => {
  const backendUrl = 'https://gardenia2025-backend.onrender.com';
  const frontendUrl = 'https://gardenia2025-frontend.onrender.com';
  
  console.log('🔍 Testing CORS Configuration...\n');
  
  try {
    // Test 1: Health check endpoint
    console.log('1. Testing health check endpoint...');
    const healthResponse = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Health check successful:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  try {
    // Test 2: Events endpoint
    console.log('\n2. Testing events endpoint...');
    const eventsResponse = await axios.get(`${backendUrl}/api/events`);
    console.log('✅ Events endpoint successful:', eventsResponse.data.success);
    console.log('📊 Events count:', eventsResponse.data.data?.length || 0);
  } catch (error) {
    console.log('❌ Events endpoint failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
    }
  }
  
  try {
    // Test 3: CORS preflight request
    console.log('\n3. Testing CORS preflight request...');
    const preflightResponse = await axios.options(`${backendUrl}/api/events`, {
      headers: {
        'Origin': frontendUrl,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ Preflight request successful');
    console.log('   Status:', preflightResponse.status);
    console.log('   CORS Headers:', {
      'Access-Control-Allow-Origin': preflightResponse.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': preflightResponse.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': preflightResponse.headers['access-control-allow-headers']
    });
  } catch (error) {
    console.log('❌ Preflight request failed:', error.message);
  }
  
  console.log('\n📝 CORS Test completed!');
  console.log('\n🔧 If tests are failing, check:');
  console.log('   1. Backend server is running');
  console.log('   2. CORS configuration in server.js');
  console.log('   3. Environment variables are set correctly');
  console.log('   4. Render deployment logs for CORS errors');
};

// Run the test
testCORS().catch(console.error);
