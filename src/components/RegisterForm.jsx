import React, { useState } from 'react';
import { registerUser } from '../services/authService';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
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
        formData.username,
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

  return (
    <div className="p-6 bg-light-gray rounded-lg max-w-md mx-auto">
      <h2 className="text-xl text-text-highlight mb-4">Register</h2>
      
      {success ? (
        <div className="text-text-success mb-4">
          Registration successful! You can now login.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-text-normal mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-dark-gray text-text-normal rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-text-normal mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-dark-gray text-text-normal rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-text-normal mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-dark-gray text-text-normal rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-text-normal mb-2" htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full p-2 bg-dark-gray text-text-normal rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;