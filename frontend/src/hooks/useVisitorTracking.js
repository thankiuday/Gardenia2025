import { useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const useVisitorTracking = (page) => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await axios.post(API_ENDPOINTS.VISITORS, {
          page: page,
          referrer: document.referrer || ''
        });
      } catch (error) {
        // Silently fail - visitor tracking shouldn't break the app
      }
    };

    // Track visitor after a short delay to ensure page is loaded
    const timer = setTimeout(trackVisitor, 1000);

    return () => clearTimeout(timer);
  }, [page]);
};

export default useVisitorTracking;
