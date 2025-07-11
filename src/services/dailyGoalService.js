import pb from './pocketbaseClient';

// Update completed seconds for today's goal
export const updateCompletedSeconds = async (additionalSeconds) => {
  try {
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    // Get today's date and format it for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    // Format date for logging
    const todayFormatted = today.toISOString().split('T')[0];
    
    // Use getFirstListItem with a more flexible date filter
    // This handles the case where the date format in the database might be different
    try {
      const existingGoal = await pb.collection('DailyGoals').getFirstListItem(
        `user="${userId}" && date ~ "${todayFormatted}"`
      );
      
      const newCompletedSeconds = existingGoal.completedSeconds + additionalSeconds;
      
      const updatedData = {
        completedSeconds: newCompletedSeconds,
        achieved: newCompletedSeconds >= existingGoal.targetSeconds
      };
      
      const record = await pb.collection('DailyGoals').update(existingGoal.id, updatedData);
      return { 
        success: true, 
        data: record,
        completedSeconds: newCompletedSeconds 
      };
    } catch (error) {
      // If no record found, create a new one
      if (error.status === 404) {
        const data = {
          user: userId,
          date: todayFormatted,
          targetSeconds: 1800,
          completedSeconds: additionalSeconds,
          achieved: additionalSeconds >= 1800
        };
        
        const record = await pb.collection('DailyGoals').create(data);
        return { 
          success: true, 
          data: record,
          completedSeconds: additionalSeconds 
        };
      }
      
      // Re-throw any other errors
      throw error;
    }
    
    // This code is now handled in the try/catch block above
  } catch (error) {
    if (!error.isAbort) {
      return { success: false, error: error.message };
    }
    return { success: false, error: error.message };
  }
};

// Get current daily goal completed seconds
export const getCurrentDailyGoalSeconds = async () => {
  try {
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayFormatted = today.toISOString().split('T')[0];
    
    try {
      const existingGoal = await pb.collection('DailyGoals').getFirstListItem(
        `user="${userId}" && date ~ "${todayFormatted}"`
      );
      
      return { 
        success: true, 
        completedSeconds: existingGoal.completedSeconds 
      };
    } catch (error) {
      // If no record found, return 0 completed seconds
      if (error.status === 404) {
        return { 
          success: true, 
          completedSeconds: 0 
        };
      }
      
      throw error;
    }
  } catch (error) {
    if (!error.isAbort) {
      return { success: false, error: error.message };
    }
    return { success: false, error: error.message };
  }
};


// Get user's goal streak (consecutive days with achieved goals)
export const getGoalStreak = async (options = {}) => {
  try {
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    const resultList = await pb.collection('DailyGoals').getList(1, 100, {
      ...options,
      filter: `user="${userId}" && achieved=true`,
      sort: '-date'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { streak: 0 } };
    }
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecentDate = new Date(resultList.items[0].date);
    const dayDifference = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    
    if (dayDifference > 1) {
      return { success: true, data: { streak: 0 } };
    }
    
    for (let i = 0; i < resultList.items.length - 1; i++) {
      const currentDate = new Date(resultList.items[i].date);
      const nextDate = new Date(resultList.items[i + 1].date);
      
      const diffDays = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return { success: true, data: { streak } };
  } catch (error) {
    if (!error.isAbort) {
      return { success: false, error: error.message };
    }
    return { success: false, error: error.message };
  }
};