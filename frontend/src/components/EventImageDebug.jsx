import { useState, useEffect } from 'react';
import S3_ASSETS from '../config/s3-assets';

const EventImageDebug = ({ eventId, eventTitle }) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const testImage = () => {
      const url = S3_ASSETS.events.getEventImage(eventId);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => setImageStatus('loaded');
      img.onerror = () => setImageStatus('error');
      img.src = url;
    };

    testImage();
  }, [eventId]);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold text-lg mb-2">Event Image Debug: {eventTitle}</h3>
      <div className="space-y-2">
        <p><strong>Event ID:</strong> {eventId}</p>
        <p><strong>Image URL:</strong> 
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            {imageUrl}
          </a>
        </p>
        <p><strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            imageStatus === 'loaded' ? 'bg-green-100 text-green-800' :
            imageStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {imageStatus.toUpperCase()}
          </span>
        </p>
        {imageStatus === 'loaded' && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt={eventTitle}
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventImageDebug;
