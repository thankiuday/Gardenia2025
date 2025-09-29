import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col welcome-modal">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              Welcome to Gardenia 2025
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              October 15th, 16th & 17th 2025
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-white hover:text-emerald-200 transition-colors duration-200 p-2 -m-2 touch-manipulation"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {/* YouTube Video Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Previous Year Highlights
            </h3>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/vVq0Q2Y6WzE"
                title="Gardenia Previous Year Highlights"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Gardenia Elements Theme */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              The Essence of Gardenia 2K25: "Elements"
            </h3>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Gardenia has always been about celebrating the identity of Garden City University, and this
                year's theme, <strong>"Elements,"</strong> reflects exactly who we are. Just as Earth, Water, Fire, Air, and Space
                are the forces that hold the world together, our university is held together by the incredible
                diversity of its departments.
              </p>
              
              <p className="mb-4">
                "Elements" also speaks on sustainability and coexistence, reminding us that creativity,
                professionalism, and sportsmanship can only grow when we value balance, respect diversity, and
                nurture harmony.
              </p>
              
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 sm:p-6">
                <h4 className="font-semibold text-emerald-800 mb-3 text-center">The Five Elements</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold">🌍</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Earth</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">💧</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Water</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 font-bold">🔥</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Fire</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-600 font-bold">💨</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Air</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">🌌</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Space</p>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 text-center font-medium">
                Hence Gardenia Elements is more than just a theme; it is both a celebration of our identity and a
                call to build a sustainable, unified future.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/"
            onClick={closeModal}
            className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-center font-medium touch-manipulation"
          >
            Explore Events
          </Link>
          <button
            onClick={closeModal}
            className="flex-1 sm:flex-none sm:px-8 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium touch-manipulation"
          >
            Continue to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;