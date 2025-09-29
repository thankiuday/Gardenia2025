import { useState } from 'react';

const ImageTest = ({ src, alt }) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setImageStatus('loaded');
    console.log('✅ Image loaded successfully:', src);
  };

  const handleError = (e) => {
    setImageStatus('error');
    setError(e);
    console.error('❌ Image failed to load:', src, e);
  };

  return (
    <div className="border-2 border-gray-300 p-4 m-2">
      <h3 className="font-bold mb-2">Image Test: {alt}</h3>
      <p className="text-sm text-gray-600 mb-2">URL: {src}</p>
      <p className="text-sm mb-2">Status: 
        <span className={`ml-2 px-2 py-1 rounded text-xs ${
          imageStatus === 'loaded' ? 'bg-green-100 text-green-800' :
          imageStatus === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {imageStatus}
        </span>
      </p>
      <div className="w-32 h-32 bg-gray-200 border">
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-2">Error: {error.message}</p>}
    </div>
  );
};

export default ImageTest;

