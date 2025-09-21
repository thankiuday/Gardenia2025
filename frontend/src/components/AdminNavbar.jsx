import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ElementalLogo from './ElementalLogo';
import S3_ASSETS from '../config/s3-assets';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const adminNavLinks = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      description: 'Overview & Analytics'
    },
    { 
      path: '/admin/registrations', 
      label: 'Registrations', 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      description: 'Manage Event Registrations'
    },
    { 
      path: '/admin/contacts', 
      label: 'Contacts', 
      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      description: 'Contact Form Submissions'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    // Trigger a custom event to notify both App and Admin components
    window.dispatchEvent(new Event('adminLogout'));
    // The Admin component will handle the redirect to login page
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>
      
      <nav className="bg-gradient-to-r from-white to-emerald-50 shadow-lg sticky top-0 z-50 border-b-2 border-emerald-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Left: Gardenia Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/admin" className="flex items-center group" aria-label="Gardenia 2025 Admin">
                <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                  <ElementalLogo className="w-28 sm:w-32 md:w-36 lg:w-40 h-10 sm:h-12 md:h-14 lg:h-16 text-emerald-600" />
                </div>
                <span className="hidden sm:block ml-3 text-xs sm:text-sm font-semibold text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-200 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
                  Admin Panel
                </span>
              </Link>
            </div>

            {/* Center: Admin Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative px-4 xl:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2.5 ${
                    isActive(link.path)
                      ? 'text-white bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-200 transform scale-105'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-white hover:shadow-md hover:shadow-emerald-100'
                  }`}
                  title={link.description}
                >
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isActive(link.path) ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  <span className="font-semibold">{link.label}</span>
                  
                  {/* Active indicator */}
                  {isActive(link.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 px-4 xl:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 shadow-sm hover:shadow-lg ml-2"
                title="Logout from Admin Panel"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-semibold">Logout</span>
              </button>
            </div>

            {/* Right: University Logo */}
            <div className="hidden lg:flex items-center">
              <img 
                src={S3_ASSETS.logos.university}
                alt="Garden City University Logo" 
                className="w-10 h-10 xl:w-12 xl:h-12 object-contain rounded-lg shadow-sm border border-gray-200"
              />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-xl mt-2 border border-emerald-200 shadow-lg">
                {adminNavLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3 ${
                      isActive(link.path)
                        ? 'text-white bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-md'
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInFromTop 0.3s ease-out forwards'
                    }}
                  >
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isActive(link.path) ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    <div>
                      <div className="font-semibold">{link.label}</div>
                      <div className={`text-xs ${isActive(link.path) ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 group"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <div>
                    <div className="font-semibold">Logout</div>
                    <div className="text-xs text-gray-500 group-hover:text-red-100">Exit Admin Panel</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;
