import PocketBase from 'pocketbase';

// Initialize the PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

// Export the client instance for use throughout the app
export default pb;

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Get current user data
export const getCurrentUser = () => {
  return pb.authStore.record;
};

// Clear authentication data (logout)
export const clearAuthStore = () => {
  pb.authStore.clear();
};