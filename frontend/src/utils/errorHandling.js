// Error handling utilities for user-friendly messages

export const getErrorMessage = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return {
      title: "No Internet Connection",
      message: "Please check your internet connection and try again.",
      type: "error",
      canRetry: true
    };
  }

  // Axios errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          title: "Invalid Request",
          message: data.message || "Please check your input and try again.",
          type: "warning",
          canRetry: true
        };
      
      case 401:
        return {
          title: "Access Denied",
          message: "Your session has expired. Please refresh the page and try again.",
          type: "error",
          canRetry: true
        };
      
      case 403:
        return {
          title: "Access Forbidden",
          message: "You don't have permission to perform this action.",
          type: "error",
          canRetry: false
        };
      
      case 404:
        return {
          title: "Not Found",
          message: "The requested resource was not found.",
          type: "warning",
          canRetry: true
        };
      
      case 409:
        return {
          title: "Conflict",
          message: data.message || "This action conflicts with existing data.",
          type: "warning",
          canRetry: true
        };
      
      case 422:
        return {
          title: "Validation Error",
          message: data.message || "Please check your input and try again.",
          type: "warning",
          canRetry: true
        };
      
      case 429:
        return {
          title: "Too Many Requests",
          message: "You're making requests too quickly. Please wait a moment and try again.",
          type: "warning",
          canRetry: true
        };
      
      case 500:
        return {
          title: "Server Error",
          message: "Something went wrong on our end. Please try again in a few moments.",
          type: "error",
          canRetry: true
        };
      
      case 502:
      case 503:
      case 504:
        return {
          title: "Service Unavailable",
          message: "Our servers are temporarily unavailable. Please try again later.",
          type: "error",
          canRetry: true
        };
      
      default:
        return {
          title: "Request Failed",
          message: data.message || "An unexpected error occurred. Please try again.",
          type: "error",
          canRetry: true
        };
    }
  }

  // Network errors (no response)
  if (error.request) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        title: "Request Timeout",
        message: "The request took too long to complete. Please check your connection and try again.",
        type: "error",
        canRetry: true
      };
    }

    return {
      title: "Network Error",
      message: "Unable to connect to the server. Please check your internet connection.",
      type: "error",
      canRetry: true
    };
  }

  // Other errors
  if (error.message) {
    return {
      title: "Unexpected Error",
      message: error.message,
      type: "error",
      canRetry: true
    };
  }

  // Default fallback
  return {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    type: "error",
    canRetry: true
  };
};

export const isRetryableError = (error) => {
  if (!navigator.onLine) return true;
  
  if (error.response) {
    const status = error.response.status;
    // Don't retry client errors except for 408, 429, and some 4xx
    if (status >= 400 && status < 500) {
      return [408, 429].includes(status);
    }
    // Retry server errors
    return status >= 500;
  }
  
  // Retry network errors
  return true;
};

export const getRetryDelay = (attemptNumber) => {
  // Exponential backoff with jitter
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter
  return delay + jitter;
};

export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  }
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
};
