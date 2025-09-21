// Environment Test Utility
// This file demonstrates how the application works in different environments

import { getFullUrl } from '../config/api';
import { getApiBaseUrl } from '../config/environment';

/**
 * Test function to demonstrate environment behavior
 * This can be called from browser console for testing
 */
export const testEnvironment = () => {
  console.log('🔧 Environment Configuration Test');
  console.log('=====================================');
  
  // Show current API base URL
  const API_BASE_URL = getApiBaseUrl();
  console.log(`📍 API Base URL: ${API_BASE_URL}`);
  
  // Test different URL scenarios
  const testCases = [
    {
      name: 'Local file path',
      input: '/uploads/GDN2025-1234.pdf',
      expected: `${API_BASE_URL}/uploads/GDN2025-1234.pdf`
    },
    {
      name: 'S3 URL',
      input: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/tickets/GDN2025-1234.pdf',
      expected: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/tickets/GDN2025-1234.pdf'
    },
    {
      name: 'Empty path',
      input: '',
      expected: API_BASE_URL
    },
    {
      name: 'Null path',
      input: null,
      expected: API_BASE_URL
    }
  ];
  
  console.log('\n🧪 Testing getFullUrl() function:');
  testCases.forEach((testCase, index) => {
    const result = getFullUrl(testCase.input);
    const passed = result === testCase.expected;
    
    console.log(`\n${index + 1}. ${testCase.name}`);
    console.log(`   Input: ${testCase.input}`);
    console.log(`   Expected: ${testCase.expected}`);
    console.log(`   Result: ${result}`);
    console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  // Environment detection
  console.log('\n🌍 Environment Detection:');
  console.log(`   Current URL: ${window.location.href}`);
  console.log(`   Is Local: ${window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'}`);
  console.log(`   Is HTTPS: ${window.location.protocol === 'https:'}`);
  console.log(`   Environment: ${import.meta.env.MODE}`);
  
  console.log('\n✅ Environment test completed!');
};

/**
 * Test API connectivity
 */
export const testAPIConnectivity = async () => {
  console.log('🌐 Testing API Connectivity');
  console.log('============================');
  
  const API_BASE_URL = getApiBaseUrl();
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    
    console.log('✅ API is reachable');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log('❌ API is not reachable');
    console.log(`   Error: ${error.message}`);
    console.log(`   URL: ${API_BASE_URL}/api/health`);
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testEnvironment = testEnvironment;
  window.testAPIConnectivity = testAPIConnectivity;
}
