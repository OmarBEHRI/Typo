import pb from './pocketbaseClient';

// Create a new achievement
export const createAchievement = async (achievementData) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Add user ID to the achievement data
    const data = {
      ...achievementData,
      user: pb.authStore.record.id
    };
    
    const record = await pb.collection('Achievements').create(data);
    return { success: true, data: record };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error creating achievement:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's achievements
export const getUserAchievements = async () => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    const resultList = await pb.collection('Achievements').getList(1, 100, {
      filter: `user="${userId}"`,
      sort: '-created'
    });
    
    return { success: true, data: resultList.items };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching achievements:', error);
    }
    return { success: false, error: error.message };
  }
};

// Check and award speed milestone achievements
export const checkSpeedMilestone = async (wpm) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Define speed milestones
    const speedMilestones = [20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    // Find the highest milestone achieved
    const milestone = speedMilestones.filter(m => wpm >= m).pop();
    
    if (!milestone) {
      return { success: true, data: { awarded: false } };
    }
    
    // Check if this milestone has already been awarded
    const existingAchievements = await pb.collection('Achievements').getList(1, 1, {
      filter: `user="${userId}" && type="speed_milestone" && description="Reached ${milestone} WPM"`
    });
    
    if (existingAchievements.items.length > 0) {
      return { success: true, data: { awarded: false } };
    }
    
    // Award new achievement
    const achievementData = {
      user: userId,
      type: 'speed_milestone',
      description: `Reached ${milestone} WPM`
    };
    
    const record = await pb.collection('Achievements').create(achievementData);
    return { success: true, data: { awarded: true, achievement: record } };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error checking speed milestone:', error);
    }
    return { success: false, error: error.message };
  }
};

// Check and award accuracy milestone achievements
export const checkAccuracyMilestone = async (accuracy) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.model.id;
    
    // Define accuracy milestones
    const accuracyMilestones = [70, 80, 90, 95, 98, 99, 100];
    
    // Find the highest milestone achieved
    const milestone = accuracyMilestones.filter(m => accuracy >= m).pop();
    
    if (!milestone) {
      return { success: true, data: { awarded: false } };
    }
    
    // Check if this milestone has already been awarded
    const existingAchievements = await pb.collection('Achievements').getList(1, 1, {
      filter: `user="${userId}" && type="accuracy_milestone" && description="Reached ${milestone}% accuracy"`
    });
    
    if (existingAchievements.items.length > 0) {
      return { success: true, data: { awarded: false } };
    }
    
    // Award new achievement
    const achievementData = {
      user: userId,
      type: 'accuracy_milestone',
      description: `Reached ${milestone}% accuracy`
    };
    
    const record = await pb.collection('Achievements').create(achievementData);
    return { success: true, data: { awarded: true, achievement: record } };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error checking accuracy milestone:', error);
    }
    return { success: false, error: error.message };
  }
};

// Check and award streak achievements
export const checkStreakMilestone = async (streak) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.model.id;
    
    // Define streak milestones
    const streakMilestones = [3, 7, 14, 30, 60, 90, 180, 365];
    
    // Find the highest milestone achieved
    const milestone = streakMilestones.filter(m => streak >= m).pop();
    
    if (!milestone) {
      return { success: true, data: { awarded: false } };
    }
    
    // Check if this milestone has already been awarded
    const existingAchievements = await pb.collection('Achievements').getList(1, 1, {
      filter: `user="${userId}" && type="streak" && description="${milestone} day streak"`
    });
    
    if (existingAchievements.items.length > 0) {
      return { success: true, data: { awarded: false } };
    }
    
    // Award new achievement
    const achievementData = {
      user: userId,
      type: 'streak',
      description: `${milestone} day streak`
    };
    
    const record = await pb.collection('Achievements').create(achievementData);
    return { success: true, data: { awarded: true, achievement: record } };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error checking streak milestone:', error);
    }
    return { success: false, error: error.message };
  }
};