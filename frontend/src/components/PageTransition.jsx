import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState('fade-in');
  const location = useLocation();

  useEffect(() => {
    if (displayChildren !== children) {
      setIsLoading(true);
      
      // Determine animation direction based on route
      const getAnimationClass = (pathname) => {
        const routes = {
          '/': 'fade-in',
          '/events': 'slide-in-right',
          '/brochure': 'slide-in-left',
          '/rules': 'slide-in-right',
          '/contact': 'slide-in-left',
          '/about': 'scale-in',
          '/admin': 'fade-in'
        };
        
        // Check for dynamic routes like /events/:id or /register/:id
        if (pathname.includes('/events/') || pathname.includes('/register/')) {
          return 'scale-in';
        }
        
        return routes[pathname] || 'fade-in';
      };
      
      setAnimationClass(getAnimationClass(location.pathname));
      
      // Show loading state for a brief moment
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren, location.pathname]);

  return (
    <>
      {/* Page Loader Bar */}
      {isLoading && <div className="page-loader"></div>}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="flex flex-col items-center space-y-4">
            <div className="loading-spinner"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Page Content with Animation */}
      <div className={`${animationClass} ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {displayChildren}
      </div>
    </>
  );
};

export default PageTransition;
