import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  
  if (!isOpen) return null;
  
  // Animation variants for form transition
  const formVariants = {
    hidden: { opacity: 0, x: view === 'login' ? -40 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: view === 'login' ? 40 : -40, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-light-gray rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-700"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-green-400 opacity-80"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-normal hover:text-text-highlight transition-colors duration-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
            >
              {view === 'login' ? (
                <>
                  <LoginForm />
                  <div className="mt-6 text-center text-text-normal text-sm">
                    Don't have an account? <button 
                      onClick={() => setView('register')} 
                      className="text-accent hover:text-green-400 font-medium transition-colors duration-200"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <RegisterForm />
                  <div className="mt-6 text-center text-text-normal text-sm">
                    Already have an account? <button 
                      onClick={() => setView('login')} 
                      className="text-accent hover:text-green-400 font-medium transition-colors duration-200"
                    >
                      Log in
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;