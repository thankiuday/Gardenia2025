import { useState, useEffect } from 'react';

const CORSProxy = ({ src, alt, className, ...props }) => {
  const [proxyUrl, setProxyUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src && src.includes('gardenia2025-assets.s3.us-east-1.amazonaws.com')) {
      // Create a proxy URL using a CORS proxy service
      const proxyService = 'https://cors-anywhere.herokuapp.com/';
      setProxyUrl(proxyService + src);
    } else {
      setProxyUrl(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    console.log('✅ CORS Proxy Image loaded:', proxyUrl);
  };

  const handleError = () => {
    console.log('❌ CORS Proxy Image failed:', proxyUrl);
    setHasError(true);
    setIsLoading(false);
  };

  if (!proxyUrl) {
    return <div className={`${className} bg-gray-200 animate-pulse`} />;
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      <img
        src={proxyUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default CORSProxy;

