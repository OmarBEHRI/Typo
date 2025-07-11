import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import BackgroundGlitch from './BackgroundGlitch';

function HomePage({ openLoginModal }) {
  const { isLoggedIn, currentUser } = useAuth();
  
  return (
    <div className="min-h-screen font-roboto flex flex-col items-center p-4 relative">
      <BackgroundGlitch 
        glitchColors={['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a']} 
        glitchSpeed={50} 
        outerVignette={true} 
        smooth={true} 
      />
      
      {/* Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-text-highlight mb-6 tracking-tight">Practice Typing</h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-2xl md:text-3xl text-text-normal px-4"
          >
            Improve your typing skills with our interactive exercises
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            {!isLoggedIn ? (
              <button 
                onClick={openLoginModal}
                className="bg-accent hover:bg-accent-dark text-white py-4 px-10 rounded-lg text-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </button>
            ) : (
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('typing-area')?.offsetTop || 0, behavior: 'smooth' })}
                className="bg-accent hover:bg-accent-dark text-white py-4 px-10 rounded-lg text-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Practicing
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-16" id="features-section">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-text-highlight mb-12 text-center"
        >
          What We Offer
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-6xl mx-auto bg-light-gray p-8 rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-dark-gray p-6 rounded-lg text-center"
            >
              <div className="text-5xl mb-4">⌨️</div>
              <h3 className="text-xl text-text-highlight mb-2">Practice Keys</h3>
              <p className="text-text-normal">Focus on specific keys to improve your accuracy and speed</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-dark-gray p-6 rounded-lg text-center"
            >
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl text-text-highlight mb-2">Track Progress</h3>
              <p className="text-text-normal">Monitor your speed and accuracy improvements over time</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-dark-gray p-6 rounded-lg text-center"
            >
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl text-text-highlight mb-2">Earn Achievements</h3>
              <p className="text-text-normal">Complete challenges and unlock rewards as you improve</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Programming Languages Section */}
      <section className="w-full py-16 bg-dark-gray rounded-lg my-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-4"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-text-highlight mb-8 text-center"
          >
            Practice Programming Languages
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-text-normal text-center mb-12 max-w-3xl mx-auto"
          >
            Enhance your coding efficiency by practicing typing in your favorite programming language
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Ruby', 'Go', 'PHP'].map((lang, index) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                className="bg-light-gray p-4 rounded-lg cursor-pointer"
              >
                <p className="text-text-highlight font-medium">{lang}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-10"
          >
            <button className="bg-accent hover:bg-accent-dark text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors duration-300">
              Coming Soon
            </button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Info Sections */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-16"
      >
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-gray p-8 rounded-lg shadow-md"
        >
          <h3 className="text-2xl text-text-highlight mb-6">Why Practice Typing?</h3>
          <ul className="space-y-4 text-text-normal text-lg">
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span> 
              <span>Increase your typing speed and productivity</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span> 
              <span>Reduce errors in your daily typing tasks</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span> 
              <span>Build muscle memory for common key combinations</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span> 
              <span>Track your progress with detailed statistics</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-light-gray p-8 rounded-lg shadow-md"
        >
          <h3 className="text-2xl text-text-highlight mb-6">How It Works</h3>
          <ol className="space-y-4 text-text-normal text-lg">
            <li className="flex items-start">
              <span className="text-accent font-bold mr-2">1.</span>
              <span>Select the keys or programming language you want to practice</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent font-bold mr-2">2.</span>
              <span>Type the generated text as quickly and accurately as possible</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent font-bold mr-2">3.</span>
              <span>Review your performance metrics and identify areas for improvement</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent font-bold mr-2">4.</span>
              <span>Practice regularly to see continuous improvement in your skills</span>
            </li>
          </ol>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;