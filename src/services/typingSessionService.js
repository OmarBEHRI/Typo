import pb from './pocketbaseClient';

// Save a new typing session
export const saveTypingSession = async (sessionData) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Add user ID to the session data
    const data = {
      ...sessionData,
      user: pb.authStore.record.id,
      date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    };
    
    const record = await pb.collection('TypingSessions').create(data);
    return { success: true, data: record };
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

// Get user's average metrics
export const getUserAverageMetrics = async (options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get the last 10 sessions to calculate averages
        const resultList = await pb.collection('TypingSessions').getList(1, 10, {
      ...options,
      filter: `user="${userId}"`,
      sort: '-date,-created'
    });
    
    if (resultList.items.length === 0) {
      return { success: true, data: { avgWpm: 0, avgAccuracy: 0, avgScore: 0 } };
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
        totalSessions: resultList.totalItems
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