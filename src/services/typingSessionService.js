import pb from './pocketbaseClient';
import { updateUserExperience } from './experienceService';
import { updateCompletedSeconds } from './dailyGoalService';

// Calculate and update user's overall typing speed
export const updateUserOverallSpeed = async (userId) => {
  try {
    // Get all user's typing sessions
    const resultList = await pb.collection('TypingSessions').getFullList({
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    // If no sessions, set overall speed to 0
    if (resultList.length === 0) {
      await pb.collection('users').update(userId, {
        overallSpeed: 0
      });
      return { success: true, data: { overallSpeed: 0 } };
    }
    
    // Calculate average WPM across all sessions
    const totalWpm = resultList.reduce((sum, session) => sum + session.wpm, 0);
    const overallSpeed = Math.round(totalWpm / resultList.length);
    
    // Update user's overall speed
    const record = await pb.collection('users').update(userId, {
      overallSpeed: overallSpeed
    });
    
    return { success: true, data: { overallSpeed } };
  } catch (error) {
    console.error('Error updating overall speed:', error);
    return { success: false, error: error.message };
  }
};

// Save a new typing session
export const saveTypingSession = async (sessionData) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Add user ID to the session data
    console.log("Record of the pb store is: ", pb.authStore.record);
    const data = {
      "duration": sessionData.duration,
      "wpm": sessionData.wpm,
      "accuracy": sessionData.accuracy,
      "score": sessionData.score,
      "keystrokes": sessionData.keystrokes,
      "errors": sessionData.errors,
      "selectedKeys": sessionData.selectedKeys,
      "user": pb.authStore.record.id,
      "date": new Date().toISOString()
    };
    console.log("Data to be saved is: ", data);
    
    // Save the typing session
    const record = await pb.collection('TypingSessions').create(data);
    
    // Update user experience with the session score
    await updateUserExperience(sessionData.score);
    
    // Update user's overall speed
    await updateUserOverallSpeed(pb.authStore.record.id);
    
    // Update daily goal completed seconds
    let completedSecondsResult;
    if (sessionData.duration > 0) {
      completedSecondsResult = await updateCompletedSeconds(sessionData.duration);
    }
    
    return { 
      success: true, 
      data: record,
      completedSeconds: completedSecondsResult?.data?.completedSeconds
    };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error saving typing session:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's typing sessions
export const getUserSessions = async (limit = 10, page = 1) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    const resultList = await pb.collection('TypingSessions').getList(page, limit, {
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    return { success: true, data: resultList };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching typing sessions:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's top speed session
export const getUserTopSpeed = async (options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get the session with the highest WPM
    const resultList = await pb.collection('TypingSessions').getList(1, 1, {
      ...options,
      filter: `user="${userId}"`,
      sort: '-wpm'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { topSpeed: 0 } };
    }
    
    return { 
      success: true, 
      data: { 
        topSpeed: resultList.items[0].wpm
      } 
    };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching top speed:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's last typing session
export const getUserLastSession = async (options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get the most recent session
    const resultList = await pb.collection('TypingSessions').getList(1, 1, {
      ...options,
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { lastSpeed: 0 } };
    }
    
    return { 
      success: true, 
      data: { 
        lastSpeed: resultList.items[0].wpm
      } 
    };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching last session:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's average metrics
export const getUserAverageMetrics = async (options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    console.log('getUserAverageMetrics: userId =', userId);

    // Get all sessions to calculate total count
    const totalCountResult = await pb.collection('TypingSessions').getList(1, 1, {
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    const totalSessions = totalCountResult.totalItems;
    
    // Get the last 50 sessions to calculate averages (more sessions for better average)
    const resultList = await pb.collection('TypingSessions').getList(1, 50, {
      ...options,
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { avgWpm: 0, avgAccuracy: 0, avgScore: 0, totalSessions: 0 } };
    }
    
    // Calculate averages
    const avgWpm = resultList.items.reduce((sum, session) => sum + session.wpm, 0) / resultList.items.length;
    const avgAccuracy = resultList.items.reduce((sum, session) => sum + session.accuracy, 0) / resultList.items.length;
    const avgScore = resultList.items.reduce((sum, session) => sum + session.score, 0) / resultList.items.length;
    
    return { 
      success: true, 
      data: { 
        avgWpm: Math.round(avgWpm), 
        avgAccuracy: Math.round(avgAccuracy), 
        avgScore: Math.round(avgScore),
        totalSessions: totalSessions
      } 
    };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error calculating average metrics:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get user's progress over time
export const getUserProgress = async (days = 7, options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Format dates for the filter
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const resultList = await pb.collection('TypingSessions').getList(1, 100, {
      ...options,
      filter: `user="${userId}" && date >= "${startDateStr}" && date <= "${endDateStr}"`,
      sort: 'date'
    });
    
    // Group sessions by date
    const progressByDate = {};
    
    resultList.items.forEach(session => {
      if (!progressByDate[session.date]) {
        progressByDate[session.date] = {
          sessions: 0,
          totalWpm: 0,
          totalAccuracy: 0
        };
      }
      
      progressByDate[session.date].sessions += 1;
      progressByDate[session.date].totalWpm += session.wpm;
      progressByDate[session.date].totalAccuracy += session.accuracy;
    });
    
    // Calculate daily averages
    const progressData = Object.keys(progressByDate).map(date => {
      const data = progressByDate[date];
      return {
        date,
        avgWpm: Math.round(data.totalWpm / data.sessions),
        avgAccuracy: Math.round(data.totalAccuracy / data.sessions),
        sessions: data.sessions
      };
    });
    
    return { success: true, data: progressData };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching user progress:', error);
    }
    return { success: false, error: error.message };
  }
};