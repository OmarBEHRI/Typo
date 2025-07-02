import React, { createContext, useState, useContext, useEffect } from 'react';
import pb from '../services/pocketbaseClient';
import { getCurrentUser, isAuthenticated } from '../services/authService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    // Initial check for authentication
    const checkAuth = () => {
      const isUserAuthenticated = isAuthenticated();
      setIsLoggedIn(isUserAuthenticated);
      
      if (isUserAuthenticated) {
        setCurrentUser(getCurrentUser());
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Subscribe to auth store changes
    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });
    
    return () => {
      // Cleanup subscription
      unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    currentUser,
    isLoggedIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}