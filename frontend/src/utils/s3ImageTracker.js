// S3 Image Request Tracker
class S3ImageTracker {
  constructor() {
    this.requests = new Map();
    this.corsErrors = [];
    this.successfulLoads = [];
    this.failedLoads = [];
  }

  logRequest(url, status, error = null) {
    const requestId = this.generateRequestId(url);
    const timestamp = new Date().toISOString();
    
    const requestData = {
      id: requestId,
      url,
      status,
      timestamp,
      error: error ? error.message : null,
      isCORS: error && error.message.includes('CORS'),
      isS3: url.includes('gardenia2025-assets.s3.us-east-1.amazonaws.com')
    };

    this.requests.set(requestId, requestData);

    if (status === 'success') {
      this.successfulLoads.push(requestData);
      console.log(`✅ S3 Image Success: ${url}`);
    } else if (status === 'error') {
      this.failedLoads.push(requestData);
      if (requestData.isCORS) {
        this.corsErrors.push(requestData);
        console.log(`🚫 S3 CORS Error: ${url}`);
      } else {
        console.log(`❌ S3 Image Error: ${url}`);
      }
    }

    // Log summary every 10 requests
    if (this.requests.size % 10 === 0) {
      this.logSummary();
    }
  }

  generateRequestId(url) {
    return url.split('/').pop().split('?')[0] + '_' + Date.now();
  }

  logSummary() {
    console.group('📊 S3 Image Loading Summary');
    console.log(`Total Requests: ${this.requests.size}`);
    console.log(`Successful: ${this.successfulLoads.length}`);
    console.log(`Failed: ${this.failedLoads.length}`);
    console.log(`CORS Errors: ${this.corsErrors.length}`);
    
    if (this.corsErrors.length > 0) {
      console.group('🚫 CORS Blocked Images:');
      this.corsErrors.forEach(error => {
        console.log(`- ${error.url.split('/').pop()}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  getCORSBlockedImages() {
    return this.corsErrors.map(error => ({
      filename: error.url.split('/').pop(),
      fullUrl: error.url,
      timestamp: error.timestamp
    }));
  }

  getFailedImages() {
    return this.failedLoads.map(failure => ({
      filename: failure.url.split('/').pop(),
      fullUrl: failure.url,
      error: failure.error,
      isCORS: failure.isCORS,
      timestamp: failure.timestamp
    }));
  }

  clear() {
    this.requests.clear();
    this.corsErrors = [];
    this.successfulLoads = [];
    this.failedLoads = [];
  }
}

// Create global instance
const s3Tracker = new S3ImageTracker();

// Export for use in components
export default s3Tracker;

// Also make it available globally for debugging
if (typeof window !== 'undefined') {
  window.s3Tracker = s3Tracker;
}

