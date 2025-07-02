import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function HomePage({ openLoginModal }) {
  const { isLoggedIn, currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-text-highlight mb-4">Practice Typing</h1>
        <p className="text-xl text-text-normal">Improve your typing skills with our interactive exercises</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl bg-light-gray p-8 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-dark-gray p-6 rounded-lg text-center"
          >
            <div className="text-4xl mb-4">⌨️</div>
            <h3 className="text-xl text-text-highlight mb-2">Practice Keys</h3>
            <p className="text-text-normal">Focus on specific keys to improve your accuracy</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-dark-gray p-6 rounded-lg text-center"
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl text-text-highlight mb-2">Track Progress</h3>
            <p className="text-text-normal">Monitor your speed and accuracy improvements</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-dark-gray p-6 rounded-lg text-center"
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl text-text-highlight mb-2">Earn Achievements</h3>
            <p className="text-text-normal">Complete challenges and unlock rewards</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          {!isLoggedIn ? (
            <button 
              onClick={openLoginModal}
              className="bg-accent hover:bg-accent-dark text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors duration-300"
            >
              Get Started
            </button>
          ) : (
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('typing-area').offsetTop, behavior: 'smooth' })}
              className="bg-accent hover:bg-accent-dark text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors duration-300"
            >
              Start Practicing
            </button>
          )}
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
      >
        <div className="bg-light-gray p-6 rounded-lg">
          <h3 className="text-xl text-text-highlight mb-4">Why Practice Typing?</h3>
          <ul className="space-y-2 text-text-normal">
            <li>• Increase your typing speed and productivity</li>
            <li>• Reduce errors in your daily typing tasks</li>
            <li>• Build muscle memory for common key combinations</li>
            <li>• Track your progress with detailed statistics</li>
          </ul>
        </div>
        
        <div className="bg-light-gray p-6 rounded-lg">
          <h3 className="text-xl text-text-highlight mb-4">How It Works</h3>
          <ol className="space-y-2 text-text-normal">
            <li>1. Select the keys you want to practice</li>
            <li>2. Type the generated words as quickly and accurately as possible</li>
            <li>3. Review your performance metrics</li>
            <li>4. Practice regularly to see improvement</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;