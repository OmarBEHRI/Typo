import pb from './pocketbaseClient';

// Create or update daily goal
export const saveDailyGoal = async (goalData) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      console.error('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Check if a goal for today already exists
    const existingGoals = await pb.collection('DailyGoals').getList(1, 1, {
      filter: `user="${userId}" && date="${today}"`
    });
    
    if (existingGoals.items.length > 0) {
      // Update existing goal
      const existingGoal = existingGoals.items[0];
      const updatedData = {
        ...goalData,
        achieved: goalData.completedMinutes >= goalData.targetMinutes
      };
      
      const record = await pb.collection('DailyGoals').update(existingGoal.id, updatedData);
      console.log('Updated daily goal:', record);
      return { success: true, data: record };
    } else {
      // Create new goal
      const data = {
        ...goalData,
        user: userId,
        date: today,
        achieved: goalData.completedMinutes >= goalData.targetMinutes
      };
      
      const record = await pb.collection('DailyGoals').create(data);
      console.log('Created new daily goal:', record);
      return { success: true, data: record };
    }
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error saving daily goal:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's daily goal for today
export const getTodayGoal = async () => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const resultList = await pb.collection('DailyGoals').getList(1, 1, {
      filter: `user="${userId}" && date="${today}"`
    });
    
    if (resultList.items.length === 0) {
      // No goal set for today, return default values
      return { 
        success: true, 
        data: { 
          targetMinutes: 30, 
          completedMinutes: 0, 
          achieved: false 
        } 
      };
    }
    
    return { success: true, data: resultList.items[0] };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching daily goal:', error);
    }
    return { success: false, error: error.message };
  }
};

// Update completed minutes for today's goal
export const updateCompletedMinutes = async (additionalMinutes) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Get today's goal
    const resultList = await pb.collection('DailyGoals').getList(1, 1, {
      filter: `user="${userId}" && date="${today}"`
    });
    
    if (resultList.items.length === 0) {
      // Create a new goal with default target
      const data = {
        user: userId,
        date: today,
        targetMinutes: 30,
        completedMinutes: additionalMinutes,
        achieved: additionalMinutes >= 30
      };
      
      const record = await pb.collection('DailyGoals').create(data);
      return { success: true, data: record };
    } else {
      // Update existing goal
      const existingGoal = resultList.items[0];
      const newCompletedMinutes = existingGoal.completedMinutes + additionalMinutes;
      
      const updatedData = {
        completedMinutes: newCompletedMinutes,
        achieved: newCompletedMinutes >= existingGoal.targetMinutes
      };
      
      const record = await pb.collection('DailyGoals').update(existingGoal.id, updatedData);
      return { success: true, data: record };
    }
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error updating completed minutes:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's goal streak (consecutive days with achieved goals)
export const getGoalStreak = async (options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get all achieved goals, sorted by date descending
        const resultList = await pb.collection('DailyGoals').getList(1, 100, {
      ...options,
      filter: `user="${userId}" && achieved=true`,
      sort: '-date'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { streak: 0 } };
    }
    
    // Calculate streak
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if the most recent achieved goal is from today or yesterday
    const mostRecentDate = new Date(resultList.items[0].date);
    const dayDifference = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    
    if (dayDifference > 1) {
      // Streak broken - most recent achievement is not from today or yesterday
      return { success: true, data: { streak: 0 } };
    }
    
    // Check consecutive days
    for (let i = 0; i < resultList.items.length - 1; i++) {
      const currentDate = new Date(resultList.items[i].date);
      const nextDate = new Date(resultList.items[i + 1].date);
      
      // Calculate difference in days
      const diffDays = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        streak++;
      } else {
        // Streak broken
        break;
      }
    }
    
    return { success: true, data: { streak } };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error calculating goal streak:', error);
    }
    return { success: false, error: error.message };
  }
};