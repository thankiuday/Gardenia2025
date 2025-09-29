import { useState } from 'react';

const DirectImageTest = () => {
  const [testResults, setTestResults] = useState([]);

  const testImages = [
    {
      name: 'Herb-a-thon Medicinal Plant Quiz',
      expectedUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/herb-a-thon-medicinal-plant-quiz.png',
      generatedUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/herb-a-thon-medicinal-plant-quiz.png'
    }
  ];

  const testImage = async (image) => {
    try {
      const response = await fetch(image.generatedUrl, { method: 'HEAD' });
      setTestResults(prev => [...prev, {
        ...image,
        status: response.ok ? 'SUCCESS' : 'FAILED',
        statusCode: response.status,
        statusText: response.statusText
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        ...image,
        status: 'ERROR',
        error: error.message
      }]);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800 mb-4">Direct S3 Image Test</h3>
      
      <div className="space-y-4">
        {testImages.map((image, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <h4 className="font-semibold">{image.name}</h4>
            <p className="text-sm text-gray-600 mb-2">URL: {image.generatedUrl}</p>
            
            <button 
              onClick={() => testImage(image)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Test Image
            </button>
            
            {testResults.find(r => r.name === image.name) && (
              <div className="mt-2">
                {testResults.find(r => r.name === image.name).status === 'SUCCESS' ? (
                  <span className="text-green-600 text-sm">✅ Image accessible</span>
                ) : (
                  <span className="text-red-600 text-sm">
                    ❌ {testResults.find(r => r.name === image.name).status} - 
                    {testResults.find(r => r.name === image.name).error || 
                     testResults.find(r => r.name === image.name).statusText}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectImageTest;

