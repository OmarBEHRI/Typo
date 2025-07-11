import pb from './pocketbaseClient';

// User registration
export const registerUser = async (name, email, password) => {
  try {
    const userData = {
      "email":email,
      "emailVisibility": true,
      "name": name,
      "dailyExperience": 0,
      "weeklyExperience": 0,
      "experience": 0,
      "overallSpeed": 0,
      "password": password,
      "passwordConfirm":password
    };

    const record = await pb.collection('users').create(userData);
    return { success: true, data: record };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const authData = await pb.collection('users').authWithPassword(
      email,
      password
    );
    
    return { success: true, data: authData };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Create a daily goal for today if it doesn't exist
export const createDailyGoalForToday = async () => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Check if a goal for today already exists
    const existingGoals = await pb.collection('DailyGoals').getList(1, 1, {
      filter: `user="${userId}" && date="${today}"`
    });
    
    if (existingGoals.items.length === 0) {
      // Create new goal with default target of 30 minutes
      const data = {
        user: userId,
        date: today,
        targetMinutes: 30,
        completedMinutes: 0,
        achieved: false
      };
      
      const record = await pb.collection('DailyGoals').create(data);
      console.log('Created new daily goal:', record);
      return { success: true, data: record };
    }
    
    return { success: true, data: existingGoals.items[0] };
  } catch (error) {
    console.error('Error creating daily goal:', error);
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
