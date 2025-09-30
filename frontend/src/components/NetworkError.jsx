import React, { useState, useEffect } from 'react';

const NetworkError = ({ onRetry, className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show retry button after 3 seconds if still offline
    const timer = setTimeout(() => {
      if (!isOnline) {
        setShowRetry(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, [isOnline]);

  if (isOnline) {
    return null; // Don't show if online
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              No Internet Connection
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Please check your internet connection and try again.
            </p>
          </div>
          {showRetry && onRetry && (
            <div className="ml-3">
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
