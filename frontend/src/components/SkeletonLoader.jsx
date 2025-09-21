import React from 'react';

const SkeletonLoader = ({ type = 'default', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="skeleton-shimmer rounded-lg h-48 mb-4"></div>
            <div className="space-y-3">
              <div className="skeleton-shimmer h-4 rounded w-3/4"></div>
              <div className="skeleton-shimmer h-4 rounded w-1/2"></div>
              <div className="skeleton-shimmer h-4 rounded w-2/3"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-2">
              <div className="skeleton-shimmer h-4 rounded w-full"></div>
              <div className="skeleton-shimmer h-4 rounded w-5/6"></div>
              <div className="skeleton-shimmer h-4 rounded w-4/6"></div>
            </div>
          </div>
        );
      
      case 'form':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-6">
              <div>
                <div className="skeleton-shimmer h-4 rounded w-1/4 mb-2"></div>
                <div className="skeleton-shimmer h-12 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="skeleton-shimmer h-4 rounded w-1/3 mb-2"></div>
                <div className="skeleton-shimmer h-12 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="skeleton-shimmer h-4 rounded w-1/5 mb-2"></div>
                <div className="skeleton-shimmer h-12 rounded-lg w-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="skeleton-shimmer h-4 rounded w-1/4"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/4"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/4"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-3">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 skeleton-shimmer rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton-shimmer h-4 rounded w-3/4"></div>
                    <div className="skeleton-shimmer h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'event-card':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-48 skeleton-shimmer"></div>
              <div className="p-6">
                <div className="skeleton-shimmer h-6 rounded w-3/4 mb-3"></div>
                <div className="skeleton-shimmer h-4 rounded w-full mb-2"></div>
                <div className="skeleton-shimmer h-4 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="skeleton-shimmer h-4 rounded w-1/3"></div>
                  <div className="skeleton-shimmer h-8 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'registration-form':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <div className="mb-8">
                <div className="skeleton-shimmer h-8 rounded w-1/2 mb-4"></div>
                <div className="skeleton-shimmer h-4 rounded w-3/4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="skeleton-shimmer h-4 rounded w-1/4 mb-2"></div>
                  <div className="skeleton-shimmer h-12 rounded-lg"></div>
                </div>
                <div>
                  <div className="skeleton-shimmer h-4 rounded w-1/3 mb-2"></div>
                  <div className="skeleton-shimmer h-12 rounded-lg"></div>
                </div>
                <div>
                  <div className="skeleton-shimmer h-4 rounded w-1/4 mb-2"></div>
                  <div className="skeleton-shimmer h-12 rounded-lg"></div>
                </div>
                <div>
                  <div className="skeleton-shimmer h-4 rounded w-1/3 mb-2"></div>
                  <div className="skeleton-shimmer h-12 rounded-lg"></div>
                </div>
              </div>
              
              <div className="skeleton-shimmer h-12 rounded-lg w-32"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="skeleton-shimmer h-4 rounded w-full"></div>
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;
