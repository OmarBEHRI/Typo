import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '../services/authService';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const result = await registerUser(
        formData.name,
        formData.email,
        formData.password
      );
      
      if (result.success) {
        setSuccess(true);
        // Redirect or update UI as needed
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Input field animation variants
  const inputVariants = {
    focus: { borderColor: '#4ade80', transition: { duration: 0.2 } },
    blur: { borderColor: '#3a3a3a', transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-medium text-text-highlight mb-6 text-center"
      >
        Create Account
      </motion.h2>
      
      {success ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 mb-4 text-center py-2 bg-green-900/20 rounded-lg"
        >
          Registration successful! You can now login.
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 mb-5 text-sm text-center py-2 px-3 bg-red-900/20 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          <div className="mb-4 relative">
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
              animate="blur"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              className="w-full py-2 px-0 bg-transparent text-text-normal border-b border-gray-700 focus:outline-none focus:border-accent transition-all duration-200"
              required
            />
          </div>
          
          <div className="mb-4 relative">
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
              animate="blur"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full py-2 px-0 bg-transparent text-text-normal border-b border-gray-700 focus:outline-none focus:border-accent transition-all duration-200"
              required
            />
          </div>
          
          <div className="mb-4 relative">
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
              animate="blur"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full py-2 px-0 bg-transparent text-text-normal border-b border-gray-700 focus:outline-none focus:border-accent transition-all duration-200"
              required
            />
          </div>
          
          <div className="mb-6 relative">
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
              animate="blur"
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full py-2 px-0 bg-transparent text-text-normal border-b border-gray-700 focus:outline-none focus:border-accent transition-all duration-200"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors duration-300 shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Sign Up'}
          </motion.button>
        </motion.form>
      )}
    </div>
  );
}

export default RegisterForm;