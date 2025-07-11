import pb from './pocketbaseClient';

// Update user experience after a typing session
export const updateUserExperience = async (sessionScore) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get current user data
    const user = await pb.collection('users').getOne(userId);
    
    // Update experience values
    const updatedData = {
      dailyExperience: user.dailyExperience + sessionScore,
      weeklyExperience: user.weeklyExperience + sessionScore,
      experience: user.experience + sessionScore
    };
    
    // Update user record
    const record = await pb.collection('users').update(userId, updatedData);
    
    return { success: true, data: record };
  } catch (error) {
    console.error('Error updating user experience:', error);
    return { success: false, error: error.message };
  }
};

// Reset daily experience for all users
export const resetDailyExperience = async () => {
  try {
    // Get all users
    const resultList = await pb.collection('users').getFullList({
      fields: 'id,dailyExperience'
    });
    
    // Update each user's daily experience to zero
    const updatePromises = resultList.map(user => {
      return pb.collection('users').update(user.id, {
        dailyExperience: 0
      });
    });
    
    await Promise.all(updatePromises);
    
    return { success: true, message: 'Daily experience reset for all users' };
  } catch (error) {
    console.error('Error resetting daily experience:', error);
    return { success: false, error: error.message };
  }
};

// Reset weekly experience for all users
export const resetWeeklyExperience = async () => {
  try {
    // Get all users
    const resultList = await pb.collection('users').getFullList({
      fields: 'id,weeklyExperience'
    });
    
    // Update each user's weekly experience to zero
    const updatePromises = resultList.map(user => {
      return pb.collection('users').update(user.id, {
        weeklyExperience: 0
      });
    });
    
    await Promise.all(updatePromises);
    
    return { success: true, message: 'Weekly experience reset for all users' };
  } catch (error) {
    console.error('Error resetting weekly experience:', error);
    return { success: false, error: error.message };
  }
};