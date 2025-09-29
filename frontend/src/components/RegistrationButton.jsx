import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationButton = ({ onSubmit, disabled = false, className = "" }) => {
  const [stage, setStage] = useState('idle'); // idle, gathering, validating, registering, success, error
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages = {
    idle: {
      text: 'Register Now',
      icon: '→',
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'from-primary-600 to-primary-700'
    },
    gathering: {
      text: 'Gathering Data...',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    validating: {
      text: 'Validating Data...',
      icon: '✅',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'from-yellow-600 to-yellow-700'
    },
    registering: {
      text: 'Registering...',
      icon: '🚀',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    success: {
      text: 'Registration Complete!',
      icon: '🎉',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    error: {
      text: 'Registration Failed',
      icon: '❌',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
    }
  };

  const handleClick = async () => {
    if (disabled || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Stage 1: Gathering Data
      setStage('gathering');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Stage 2: Validating Data
      setStage('validating');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 3: Registering
      setStage('registering');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Call the actual submit function
      await onSubmit();
      
      // Success stage
      setStage('success');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset after success
      setStage('idle');
      
    } catch (error) {
      // Error stage
      setStage('error');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reset after error
      setStage('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStage = stages[stage];
  const isProcessing = ['gathering', 'validating', 'registering'].includes(stage);

  return (
    <motion.button
      type="submit"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
      className={`relative overflow-hidden bg-gradient-to-r ${currentStage.color} hover:${currentStage.hoverColor} text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none ${className}`}
      whileHover={!isProcessing ? { scale: 1.02 } : {}}
      whileTap={!isProcessing ? { scale: 0.98 } : {}}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isProcessing ? '100%' : '-100%' }}
        transition={{
          duration: 2,
          repeat: isProcessing ? Infinity : 0,
          ease: 'linear'
        }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-3">
        {/* Icon with animation */}
        <motion.span
          key={currentStage.icon}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-xl"
        >
          {currentStage.icon}
        </motion.span>
        
        {/* Text with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStage.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-semibold"
          >
            {currentStage.text}
          </motion.span>
        </AnimatePresence>
        
        {/* Loading spinner for processing stages */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-2"
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </motion.div>
        )}
      </div>
      
      {/* Progress bar for processing stages */}
      {isProcessing && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.4, ease: 'linear' }}
        />
      )}
    </motion.button>
  );
};

export default RegistrationButton;
