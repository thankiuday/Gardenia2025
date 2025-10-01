import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import S3_ASSETS from '../config/s3-assets';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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
          {/* Gardenia 2K25 - The Rap Arena Special Event */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              🎤 Special Event - Gardenia 2K25: The Rap Arena
            </h3>
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-xl p-6 border-2 border-purple-200">
              {/* Event Poster */}
              <div className="mb-6">
                {imageLoading && (
                  <div className="w-full h-64 sm:h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg shadow-lg border-2 border-purple-200 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                      <div className="h-4 bg-purple-300 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-3 bg-purple-300 rounded w-24 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                )}
                <img
                  src={S3_ASSETS.posters.rapArena}
                  alt="Gardenia 2K25 - The Rap Arena Poster"
                  className={`w-full h-auto rounded-lg shadow-lg border-2 border-purple-200 transition-opacity duration-300 ${imageLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setImageLoading(false);
                  }}
                />
              </div>
              
              <div className="text-center mb-6">
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Garden City University Presents
                </h4>
                <h5 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  GARDENIA 2K25 – The Rap Arena
                </h5>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  The Signature Showdown of Gardenia
                </p>
                <p className="text-base text-gray-600 mb-4">
                  An elemental clash of words, rhythm, and power.
                </p>
              </div>
              
              {/* Prize Information */}
              <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
                <h6 className="text-lg font-bold text-gray-900 mb-3 text-center">🏆 Prizes Worth ₹50,000</h6>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-800">1st</div>
                    <div className="text-sm font-semibold text-yellow-700">₹25,000</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-800">2nd</div>
                    <div className="text-sm font-semibold text-gray-700">₹15,000</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3">
                    <div className="text-lg font-bold text-orange-800">3rd</div>
                    <div className="text-sm font-semibold text-orange-700">₹10,000</div>
                  </div>
                </div>
              </div>
              
              {/* Special Guest */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4 border border-purple-200">
                <h6 className="text-lg font-bold text-gray-900 mb-2 text-center">🌟 Special Guest</h6>
                <p className="text-center font-semibold text-purple-800 text-lg">GUBBI – The Face of Kannada Rap</p>
              </div>
              
              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-sm font-semibold text-gray-600 mb-1">📅 Date</div>
                  <div className="font-bold text-gray-900">16th October 2025</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-sm font-semibold text-gray-600 mb-1">📍 Venue</div>
                  <div className="font-bold text-gray-900">Garden City University, OMR Campus</div>
                </div>
              </div>
              
              {/* Rules Section */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
                <h6 className="text-lg font-bold text-gray-900 mb-3 text-center">📋 Competition Rules</h6>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-semibold text-red-600 mb-1">⚠️ Important Guidelines:</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• No profanity or diss on opponent's family/relatives</li>
                      <li>• Direct disqualification for inappropriate content</li>
                      <li>• Respect Garden City University decorum</li>
                      <li>• Judge's decision is final</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-semibold text-purple-600 mb-2">🎤 4 Rounds Competition:</p>
                    <div className="space-y-2 text-xs">
                      <div><strong>Round 1:</strong> Showcase (90s max) - Original/Cover</div>
                      <div><strong>Round 2:</strong> Freestyle (60s max) - Random beat</div>
                      <div><strong>Round 3:</strong> Rap Battle (60s each) - 2 rounds</div>
                      <div><strong>Round 4:</strong> Final Battle (45s each) - 2 rounds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-purple-800 mb-2">
                  Gardenia- The Rap Arena – Claim the Crown. Own the Sound.
                </p>
            <Link
              to="/register/68dd4dce04b7580301ca3537"
              onClick={closeModal}
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
            >
              🎵 Register Now! 🎵
            </Link>
              </div>
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