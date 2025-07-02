import React, { useState, useEffect } from 'react';
import { getUserAverageMetrics, getUserProgress } from '../services/typingSessionService';
import { getProblemKeys } from '../services/keyPerformanceService';
import { getGoalStreak } from '../services/dailyGoalService';
import { useAuth } from '../contexts/AuthContext';

function StatisticsDashboard() {
  const { isLoggedIn } = useAuth();
  const [averageMetrics, setAverageMetrics] = useState({ avgWpm: 0, avgAccuracy: 0, avgScore: 0, totalSessions: 0 });
  const [progressData, setProgressData] = useState([]);
  const [problemKeys, setProblemKeys] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  
  useEffect(() => {
    if (isLoggedIn) {
      const controller = new AbortController();
      fetchStatistics({ signal: controller.signal });

      return () => {
        controller.abort();
      };
    }
  }, [isLoggedIn, timeRange]);
  
  const fetchStatistics = async (options = {}) => {
    setLoading(true);
    
    try {
      const { signal } = options;

      // Fetch average metrics
      const metricsResult = await getUserAverageMetrics({ signal });
      if (metricsResult.success) {
        setAverageMetrics(metricsResult.data);
      }
      
      // Fetch progress data
      const progressResult = await getUserProgress(timeRange, { signal });
      if (progressResult.success) {
        setProgressData(progressResult.data);
      }
      
      // Fetch problem keys
      const keysResult = await getProblemKeys(5, { signal });
      if (keysResult.success) {
        setProblemKeys(keysResult.data);
      }
      
      // Fetch streak
      const streakResult = await getGoalStreak({ signal });
      if (streakResult.success) {
        setStreak(streakResult.data.streak);
      }

    } catch (error) {
      if (!error.isAbort) {
        console.error('Error fetching statistics:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="mt-8 p-6 bg-light-gray rounded-lg">
        <p className="text-text-normal">Please log in to view your statistics.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 p-6 bg-light-gray rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-text-highlight">Your Statistics</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${timeRange === 7 ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setTimeRange(7)}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded ${timeRange === 30 ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setTimeRange(30)}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded ${timeRange === 90 ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setTimeRange(90)}
          >
            3 Months
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading statistics...</div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-dark-gray p-4 rounded">
              <div className="text-sm text-text-normal">Average Speed</div>
              <div className="text-2xl text-text-highlight">{averageMetrics.avgWpm} <span className="text-sm">WPM</span></div>
            </div>
            <div className="bg-dark-gray p-4 rounded">
              <div className="text-sm text-text-normal">Average Accuracy</div>
              <div className="text-2xl text-text-highlight">{averageMetrics.avgAccuracy}<span className="text-sm">%</span></div>
            </div>
            <div className="bg-dark-gray p-4 rounded">
              <div className="text-sm text-text-normal">Total Sessions</div>
              <div className="text-2xl text-text-highlight">{averageMetrics.totalSessions}</div>
            </div>
            <div className="bg-dark-gray p-4 rounded">
              <div className="text-sm text-text-normal">Current Streak</div>
              <div className="text-2xl text-text-highlight">{streak} <span className="text-sm">days</span></div>
            </div>
          </div>
          
          {/* Progress Chart (simplified text-based version) */}
          <div className="bg-dark-gray p-4 rounded">
            <h3 className="text-lg text-text-highlight mb-2">Progress Over Time</h3>
            {progressData.length === 0 ? (
              <p className="text-text-normal">No data available for the selected time period.</p>
            ) : (
              <div className="space-y-2">
                {progressData.map(day => (
                  <div key={day.date} className="flex justify-between items-center">
                    <span className="text-text-normal">{new Date(day.date).toLocaleDateString()}</span>
                    <span className="text-text-highlight">{day.avgWpm} WPM</span>
                    <span className="text-text-highlight">{day.avgAccuracy}%</span>
                    <span className="text-text-normal">{day.sessions} sessions</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Problem Keys */}
          <div className="bg-dark-gray p-4 rounded">
            <h3 className="text-lg text-text-highlight mb-2">Keys to Practice</h3>
            {problemKeys.length === 0 ? (
              <p className="text-text-normal">No problem keys identified yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {problemKeys.map(keyData => (
                  <div key={keyData.id} className="bg-light-gray p-3 rounded text-center">
                    <div className="text-2xl text-text-highlight mb-1">{keyData.key}</div>
                    <div className="text-sm text-text-normal">{keyData.accuracy}% accuracy</div>
                    <div className="text-sm text-text-normal">{keyData.errorCount} errors</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsDashboard;