import { useState, useCallback, memo } from 'react';
import s3Tracker from '../utils/s3ImageTracker';

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
    console.log('✅ Image loaded successfully:', currentSrc);
    console.log('📊 S3 Image Status: SUCCESS');
    
    // Track successful S3 image load
    if (currentSrc.includes('gardenia2025-assets.s3.us-east-1.amazonaws.com')) {
      s3Tracker.logRequest(currentSrc, 'success');
    }
    
    setIsLoading(false);
  }, [currentSrc]);

  const handleError = useCallback((error) => {
    console.log('❌ Image failed to load:', currentSrc);
    console.log('📊 S3 Image Status: FAILED');
    
    // Check if it's a CORS error by examining the error
    const isS3Url = currentSrc.includes('gardenia2025-assets.s3.us-east-1.amazonaws.com');
    if (isS3Url) {
      console.log('🚫 CORS Policy Error Detected for S3 URL');
      console.log('🔍 S3 URL Analysis:', {
        url: currentSrc,
        domain: 'gardenia2025-assets.s3.us-east-1.amazonaws.com',
        path: currentSrc.split('/').pop(),
        isCORSBlocked: true
      });
      
      // Track S3 CORS error
      s3Tracker.logRequest(currentSrc, 'error', error);
    }
    
    // Try alternative extensions if it's an S3 URL
    if (isS3Url) {
      if (currentSrc.includes('.png') && !currentSrc.includes('fallback')) {
        // Try JPG version
        const jpgUrl = currentSrc.replace('.png', '.jpg');
        console.log('🔄 Trying JPG version (CORS retry):', jpgUrl);
        setCurrentSrc(jpgUrl);
        setHasError(false);
        return;
      } else if (currentSrc.includes('.jpg') && !currentSrc.includes('fallback')) {
        // Try PNG version
        const pngUrl = currentSrc.replace('.jpg', '.png');
        console.log('🔄 Trying PNG version (CORS retry):', pngUrl);
        setCurrentSrc(pngUrl);
        setHasError(false);
        return;
      }
    }
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      console.log('🔄 Trying fallback image:', fallbackSrc);
      console.log('📊 S3 Image Status: FALLBACK_TO_DEFAULT');
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      // Show error state with helpful message
      console.log('💥 No fallback available, showing error state');
      console.log('💡 CORS Error: Configure S3 bucket CORS policy to allow localhost:5173');
      console.log('📊 S3 Image Status: ERROR_NO_FALLBACK');
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

