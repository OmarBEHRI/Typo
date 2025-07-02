import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-light-gray rounded-lg shadow-xl max-w-md w-full relative overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-text-normal hover:text-text-highlight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-6">
            {view === 'login' ? (
              <>
                <LoginForm />
                <div className="mt-4 text-center text-text-normal">
                  Don't have an account? <button 
                    onClick={() => setView('register')} 
                    className="text-accent hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </>
            ) : (
              <>
                <RegisterForm />
                <div className="mt-4 text-center text-text-normal">
                  Already have an account? <button 
                    onClick={() => setView('login')} 
                    className="text-accent hover:underline"
                  >
                    Log in
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AuthModal;