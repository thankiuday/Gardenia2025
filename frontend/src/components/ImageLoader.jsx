import { useState, useCallback, memo } from 'react';

const ImageLoader = memo(({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  onError = null,
  lazy = true,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error) => {
    // Check if it's an S3 URL and try alternative extensions
    const isS3Url = currentSrc.includes('gardenia2025-assets.s3.us-east-1.amazonaws.com');
    
    if (isS3Url) {
      if (currentSrc.includes('.png') && !currentSrc.includes('fallback')) {
        // Try JPG version
        const jpgUrl = currentSrc.replace('.png', '.jpg');
        setCurrentSrc(jpgUrl);
        setHasError(false);
        return;
      } else if (currentSrc.includes('.jpg') && !currentSrc.includes('fallback')) {
        // Try PNG version
        const pngUrl = currentSrc.replace('.jpg', '.png');
        setCurrentSrc(pngUrl);
        setHasError(false);
        return;
      }
    }
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      // Show error state
      setIsLoading(false);
      setHasError(true);
      if (onError) {
        onError();
      }
    }
  }, [fallbackSrc, currentSrc, onError]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton - Simplified for better performance */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

export default ImageLoader;

