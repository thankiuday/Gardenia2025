import { useState, useCallback } from 'react';
import { getErrorMessage, isRetryableError, getRetryDelay } from '../utils/errorHandling';

export const useErrorHandling = () => {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((err, context = '') => {
    const errorInfo = getErrorMessage(err);
    setError({
      ...errorInfo,
      originalError: err,
      context
    });
    setRetryCount(prev => prev + 1);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const retry = useCallback(async (retryFunction, maxRetries = 3) => {
    if (retryCount >= maxRetries) {
      setError(prev => ({
        ...prev,
        title: "Maximum Retries Reached",
        message: "We've tried multiple times but couldn't complete your request. Please try again later or contact support.",
        canRetry: false
      }));
      return false;
    }

    clearError();
    
    try {
      await retryFunction();
      return true;
    } catch (err) {
      handleError(err);
      
      // If retryable, schedule next retry
      if (isRetryableError(err) && retryCount < maxRetries - 1) {
        const delay = getRetryDelay(retryCount);
        setTimeout(() => {
          retry(retryFunction, maxRetries);
        }, delay);
      }
      
      return false;
    }
  }, [retryCount, handleError, clearError]);

  return {
    error,
    retryCount,
    handleError,
    clearError,
    retry,
    hasError: !!error
  };
};
