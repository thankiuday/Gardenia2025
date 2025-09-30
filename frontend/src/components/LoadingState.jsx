import React from 'react';

const LoadingState = ({ 
  message = "Loading...", 
  showSpinner = true, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {showSpinner && (
        <div className="relative w-8 h-8 mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingState;
