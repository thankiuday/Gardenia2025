import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 1.05,
    filter: 'blur(4px)'
  }
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    // Small delay to ensure the animation starts before scrolling
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;