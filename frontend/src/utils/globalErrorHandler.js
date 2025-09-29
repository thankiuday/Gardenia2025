// Global Error Handler for S3 CORS Issues
class GlobalErrorHandler {
  constructor() {
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // Override console.error to catch CORS errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Check for CORS errors
      if (message.includes('CORS policy') || message.includes('Access-Control-Allow-Origin')) {
        console.group('🚫 CORS Error Detected');
        console.error('Cross-Origin Request Blocked');
        console.log('URL:', this.extractUrlFromError(message));
        console.log('Origin:', window.location.origin);
        console.log('Solution: Configure S3 bucket CORS policy');
        console.groupEnd();
      }
      
      // Call original error function
      originalError.apply(console, args);
    };

    // Listen for unhandled errors
    window.addEventListener('error', (event) => {
      if (event.message.includes('CORS') || event.message.includes('Access-Control-Allow-Origin')) {
        console.group('🚫 Global CORS Error');
        console.error('CORS Error:', event.message);
        console.log('Filename:', event.filename);
        console.log('Line:', event.lineno);
        console.log('Column:', event.colno);
        console.groupEnd();
      }
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('CORS') || event.reason.message.includes('Access-Control-Allow-Origin'))) {
        console.group('🚫 Promise CORS Error');
        console.error('CORS Promise Rejection:', event.reason);
        console.groupEnd();
      }
    });
  }

  extractUrlFromError(message) {
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : 'URL not found';
  }

  logCORSConfiguration() {
    console.group('🔧 S3 CORS Configuration Required');
    console.log('Add this CORS configuration to your S3 bucket:');
    console.log(`
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://your-production-domain.com"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
    `);
    console.groupEnd();
  }
}

// Initialize global error handler
const globalErrorHandler = new GlobalErrorHandler();

// Make it available globally
if (typeof window !== 'undefined') {
  window.globalErrorHandler = globalErrorHandler;
}

export default globalErrorHandler;

