import React from 'react';

const ErrorMessage = ({ 
  title = "Something went wrong", 
  message, 
  type = "error",
  onRetry = null,
  showRetry = false,
  className = ""
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600"
        };
      case 'info':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-600"
        };
      case 'success':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600"
        };
      default: // error
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600"
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } = getIconAndColors();

  return (
    <div className={`rounded-lg border p-4 ${bgColor} ${borderColor} ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {title}
          </h3>
          {message && (
            <div className={`mt-1 text-sm ${textColor}`}>
              <p>{message}</p>
            </div>
          )}
          {showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`text-sm font-medium ${textColor} hover:underline focus:outline-none focus:underline`}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
