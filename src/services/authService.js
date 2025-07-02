import pb from './pocketbaseClient';

// User registration
export const registerUser = async (username, email, password) => {
  try {
    const userData = {
      username,
      email,
      password
    };

    const record = await pb.collection('users').create(userData);
    return { success: true, data: record };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// User login
export const loginUser = async (usernameOrEmail, password) => {
  try {
    const authData = await pb.collection('users').authWithPassword(
      usernameOrEmail,
      password
    );
    return { success: true, data: authData };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// User logout
export const logoutUser = () => {
  pb.authStore.clear();
};

// Get current authenticated user
export const getCurrentUser = () => {
  return pb.authStore.record;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  try {
    const record = await pb.collection('users').update(userId, data);
    return { success: true, data: record };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: error.message };
  }
};