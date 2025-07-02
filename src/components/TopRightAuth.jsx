import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function TopRightAuth({ openLoginModal }) {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 right-4 z-40"
    >
      {isLoggedIn ? (
        <div className="flex items-center">
          <button 
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            className="px-4 py-2 bg-dark-gray text-text-normal hover:text-text-highlight border border-text-normal rounded transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
              <path d="M4 8a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z" />
            </svg>
            Log Out
          </button>
        </div>
      ) : (
        <button 
          onClick={openLoginModal}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded transition-colors duration-300"
        >
          Login
        </button>
      )}
    </motion.div>
  );
}

export default TopRightAuth;