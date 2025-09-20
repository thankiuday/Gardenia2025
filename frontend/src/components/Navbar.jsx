import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ElementalLogo from './ElementalLogo';
import S3_ASSETS from '../config/s3-assets';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/brochure', label: 'Brochure' },
    { path: '/rules', label: 'Rules & Regulations' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' }
  ];

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <nav className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            {/* Left: Gardenia Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center" aria-label="Gardenia 2025 Home">
                <div className="relative">
                  <ElementalLogo className="w-32 sm:w-40 md:w-45 h-12 sm:h-14 md:h-16 animate-pulse" style={{
                    animation: 'gentleGlow 2s ease-in-out infinite'
                  }} />
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="nav-desktop items-center space-x-2 lg:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50 shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: University Logo (Desktop) */}
            <div className="nav-desktop items-center">
              <img 
                src={S3_ASSETS.logos.university}
                alt="Garden City University Logo" 
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
              />
            </div>

            {/* Mobile menu button */}
            <div className="nav-mobile">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2 rounded-md"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="nav-mobile">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 border border-gray-200">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive(link.path)
                        ? 'text-primary-600 bg-primary-100 shadow-sm'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile University Logo */}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <div className="flex items-center px-3 py-2">
                    <img 
                      src={S3_ASSETS.logos.university}
                      alt="Garden City University Logo" 
                      className="w-8 h-8 object-contain mr-3"
                    />
                    <span className="text-sm text-gray-600">Garden City University</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
