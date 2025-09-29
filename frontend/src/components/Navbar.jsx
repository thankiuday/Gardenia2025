import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ElementalLogo from './ElementalLogo';
import ImageLoader from './ImageLoader';
import S3_ASSETS from '../config/s3-assets';

// Enhanced Skeleton Loader Component
const SkeletonLoader = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded-lg ${className}`}>
    {/* Base skeleton */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100 rounded-lg"></div>
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-lg"></div>
    
    {/* Moving shimmer */}
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-lg"
      style={{
        animation: 'logoShimmer 2s ease-in-out infinite',
        width: '30%',
        height: '100%'
      }}
    ></div>
    
    {/* Logo-like elements */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-emerald-200/60 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const location = useLocation();

  // Simulate logo loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
                  {isLogoLoading ? (
                    <SkeletonLoader className="w-40 sm:w-48 md:w-56 lg:w-64 h-12 sm:h-14 md:h-16 rounded-lg navbar-logo" />
                  ) : (
                    <ElementalLogo className="w-40 sm:w-48 md:w-56 lg:w-64 h-12 sm:h-14 md:h-16 animate-pulse navbar-logo" style={{
                      animation: 'gentleGlow 2s ease-in-out infinite'
                    }} />
                  )}
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
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

            {/* Right: University Logo + Social Links (Desktop & Tablet) */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {/* University Logo */}
              <div className="flex items-center">
                <ImageLoader 
                  src={S3_ASSETS.logos.university}
                  alt="Garden City University Logo" 
                  className="w-10 h-10 lg:w-12 lg:h-12 logo-image"
                />
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center justify-center space-x-3">
                <a 
                  href="https://www.instagram.com/gardencityuniversity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 text-[#E4405F] hover:text-white transition-all duration-200 hover:bg-gradient-to-br hover:from-[#E4405F] hover:to-[#C13584] rounded-lg hover:scale-110 shadow-sm"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://www.facebook.com/gardencityuniversity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 text-[#1877F2] hover:text-white transition-all duration-200 hover:bg-[#1877F2] rounded-lg hover:scale-110 shadow-sm"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://www.youtube.com/@gardencityuniversity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 text-[#FF0000] hover:text-white transition-all duration-200 hover:bg-[#FF0000] rounded-lg hover:scale-110 shadow-sm"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://www.linkedin.com/company/gardencityuniversity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 text-[#0A66C2] hover:text-white transition-all duration-200 hover:bg-[#0A66C2] rounded-lg hover:scale-110 shadow-sm"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            <div className="lg:hidden">
              <div className="px-3 pt-3 pb-4 space-y-2 bg-gray-50 rounded-lg mt-2 border border-gray-200 shadow-lg">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 min-h-[48px] flex items-center ${
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
                
                {/* Mobile University Logo + Social Links */}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <div className="px-4 py-3">
                    <div className="flex items-center mb-4">
                      <img 
                        src={S3_ASSETS.logos.university}
                        alt="Garden City University Logo" 
                        className="w-10 h-10 logo-image mr-3 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-600 font-medium">Garden City University</span>
                    </div>
                    
                    {/* Mobile Social Links */}
                    <div className="flex items-center justify-center space-x-2">
                      <a 
                        href="https://www.instagram.com/gardencityuniversity" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 text-gray-600 hover:text-[#E4405F] transition-all duration-200 hover:bg-gradient-to-br hover:from-[#E4405F] hover:to-[#C13584] hover:text-white rounded-lg hover:scale-105"
                        aria-label="Follow us on Instagram"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      
                      <a 
                        href="https://www.facebook.com/gardencityuniversity" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 text-gray-600 hover:text-[#1877F2] transition-all duration-200 hover:bg-[#1877F2] hover:text-white rounded-lg hover:scale-105"
                        aria-label="Follow us on Facebook"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      
                      <a 
                        href="https://www.youtube.com/@gardencityuniversity" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 text-gray-600 hover:text-[#FF0000] transition-all duration-200 hover:bg-[#FF0000] hover:text-white rounded-lg hover:scale-105"
                        aria-label="Subscribe to our YouTube channel"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                      
                      <a 
                        href="https://www.linkedin.com/company/gardencityuniversity" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 text-gray-600 hover:text-[#0A66C2] transition-all duration-200 hover:bg-[#0A66C2] hover:text-white rounded-lg hover:scale-105"
                        aria-label="Connect with us on LinkedIn"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
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
