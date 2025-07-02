import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Navbar({ openLoginModal }) {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-dark-gray py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-40 shadow-md"
    >
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-text-highlight">Practice Typing</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
                        <Link to="/practice" className="text-text-normal hover:text-text-highlight transition-colors duration-300">Practice</Link>
            <Link to="/user" className="text-text-normal hover:text-text-highlight transition-colors duration-300">User</Link>
            <Link to="/leaderboard" className="text-text-normal hover:text-text-highlight transition-colors duration-300">Leaderboard</Link>
            <span className="text-text-normal">Welcome, {currentUser?.username || 'User'}</span>
            <button 
              onClick={() => {
                logoutUser();
                navigate('/');
              }}
              className="px-4 py-2 bg-dark-gray text-text-normal hover:text-text-highlight border border-text-normal rounded transition-colors duration-300"
            >
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
      </div>
    </motion.nav>
  );
}

export default Navbar;