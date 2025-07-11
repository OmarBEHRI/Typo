import pb from './pocketbaseClient';

// Update or create key performance record
export const updateKeyPerformance = async (keyData) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    const { key, accuracy, speed, errorCount, correctCount = 0 } = keyData;
    
    // Check if a record for this key already exists
    const existingRecords = await pb.collection('KeyPerformance').getList(1, 1, {
      filter: `user="${userId}" && key="${key}"`
    });
    
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    if (existingRecords.items.length > 0) {
      // Update existing record
      const existingRecord = existingRecords.items[0];
      
      // Get existing counts or default to 0 if not present
      const existingCorrectCount = existingRecord.correctCount || 0;
      const existingErrorCount = existingRecord.errorCount || 0;
      
      // Add new counts to existing counts
      const totalCorrectCount = existingCorrectCount + correctCount;
      const totalErrorCount = existingErrorCount + errorCount;
      
      // Calculate new accuracy based on total correct and incorrect counts
      const totalAttempts = totalCorrectCount + totalErrorCount;
      const newAccuracy = totalAttempts > 0 ? 
        Math.round((totalCorrectCount / totalAttempts) * 100) : 
        accuracy;
      
      // Calculate new average speed (weighted by attempts)
      const newSpeed = Math.round((existingRecord.speed + speed) / 2);
      
      const updatedData = {
        accuracy: newAccuracy,
        speed: newSpeed,
        lastPracticed: today,
        errorCount: totalErrorCount,
        correctCount: totalCorrectCount
      };
      
      const record = await pb.collection('KeyPerformance').update(existingRecord.id, updatedData);
      return { success: true, data: record };
    } else {
      // Create new record
      const data = {
        user: userId,
        key,
        accuracy,
        speed,
        lastPracticed: today,
        errorCount,
        correctCount
      };
      
      const record = await pb.collection('KeyPerformance').create(data);
      return { success: true, data: record };
    }
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error updating key performance:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get performance data for all keys
export const getAllKeyPerformance = async () => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    const resultList = await pb.collection('KeyPerformance').getList(1, 100, {
      filter: `user="${userId}"`,
      sort: 'key'
    });
    
    return { success: true, data: resultList.items };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching key performance data:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get performance data for specific keys
export const getKeysPerformance = async (keys) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Build filter for multiple keys
    const keyFilters = keys.map(key => `key="${key}"`).join(' || ');
    const filter = `user="${userId}" && (${keyFilters})`;
    
    const resultList = await pb.collection('KeyPerformance').getList(1, keys.length, {
      filter,
      sort: 'key'
    });
    
    return { success: true, data: resultList.items };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching specific keys performance:', error);
    }
    return { success: false, error: error.message };
  }
};

// Get problematic keys (lowest accuracy or highest error count)
export const getProblemKeys = async (limit = 5, options = {}) => {
  try {
    // Make sure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = pb.authStore.record.id;
    
    // Get keys with lowest accuracy
        const resultList = await pb.collection('KeyPerformance').getList(1, limit, {
      ...options,
      filter: `user="${userId}"`,
      sort: 'accuracy' // Sort by accuracy ascending (lowest first)
    });
    
    return { success: true, data: resultList.items };
  } catch (error) {
    if (!error.isAbort) {
      console.error('Error fetching problem keys:', error);
    }
    return { success: false, error: error.message };
  }
};