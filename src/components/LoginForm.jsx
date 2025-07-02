import React, { useState } from 'react';
import { loginUser } from '../services/authService';

function LoginForm() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
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
    
    try {
      const result = await loginUser(formData.usernameOrEmail, formData.password);
      
      if (result.success) {
        setSuccess(true);
        // Redirect or update UI as needed
        window.location.reload(); // Simple reload to update auth state
      } else {
        setError(result.error || 'Login failed');
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
      <h2 className="text-xl text-text-highlight mb-4">Login</h2>
      
      {success ? (
        <div className="text-text-success mb-4">Login successful!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-text-normal mb-2" htmlFor="usernameOrEmail">
              Username or Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;