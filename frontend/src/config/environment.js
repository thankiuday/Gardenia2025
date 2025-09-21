// Environment Configuration
// This file provides environment-specific settings and utilities

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 10000, // 10 seconds
  },
  
  // Environment Detection
  environment: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },
  
  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.PROD,
    enableDebugLogs: import.meta.env.DEV,
    enableS3Tickets: true, // Always enabled for S3 integration
  },
  
  // URLs and Paths
  urls: {
    // These will be automatically determined based on environment
    api: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    frontend: typeof window !== 'undefined' ? window.location.origin : '',
  }
};

// Helper functions
export const isLocalEnvironment = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost');
};

export const isProductionEnvironment = () => {
  return config.environment.isProduction;
};

export const getApiBaseUrl = () => {
  return config.api.baseUrl;
};

export const shouldEnableFeature = (featureName) => {
  return config.features[featureName] || false;
};

// Log environment info in development
if (config.environment.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    mode: config.environment.mode,
    apiUrl: config.api.baseUrl,
    isLocal: isLocalEnvironment(),
    features: config.features
  });
}

export default config;
