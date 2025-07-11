import React, { useState, useEffect } from 'react';
import { getUserAverageMetrics, getUserProgress } from '../services/typingSessionService';
import { getProblemKeys, getAllKeyPerformance } from '../services/keyPerformanceService';
import { getGoalStreak } from '../services/dailyGoalService';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsDashboard() {
  const { isLoggedIn } = useAuth();
  const [averageMetrics, setAverageMetrics] = useState({ avgWpm: 0, avgAccuracy: 0, avgScore: 0, totalSessions: 0 });
  const [progressData, setProgressData] = useState([]);
  const [problemKeys, setProblemKeys] = useState([]);
  const [keyPerformanceData, setKeyPerformanceData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [selectedKey, setSelectedKey] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  useEffect(() => {
    if (isLoggedIn && !hasFetched) {
      const controller = new AbortController();
      fetchStatistics({ signal: controller.signal });
      setHasFetched(true);
  
      return () => {
        controller.abort();
      };
    }
  }, [isLoggedIn]);
  
  const fetchStatistics = async (options = {}) => {
    setLoading(true);
    
    try {
      const { signal } = options;

      
      // Fetch progress data
      const progressResult = await getUserProgress(timeRange, { signal });
      if (progressResult.success) {
        setProgressData(progressResult.data);
        console.log('Progress Data:', progressResult.data);
      }
      
      // Fetch problem keys
      const keysResult = await getProblemKeys(5, { signal });
      if (keysResult.success) {
        setProblemKeys(keysResult.data);
        console.log('Problem Keys:', keysResult.data);
      }
      
      // Fetch all key performance data for chart
      const allKeysResult = await getAllKeyPerformance({ signal });
      if (allKeysResult.success) {
        setKeyPerformanceData(allKeysResult.data);
        console.log('Key Performance Data:', allKeysResult.data);
      }
      
      // Fetch streak
      const streakResult = await getGoalStreak({ signal });
      if (streakResult.success) {
        setStreak(streakResult.data.streak);
        console.log('Streak:', streakResult.data.streak);
      }

      // Fetch average metrics
      const metricsResult = await getUserAverageMetrics({ signal }); // Log the result for debugging reaso
      if (metricsResult.success) {
        setAverageMetrics(metricsResult.data);
        console.log('Average Metrics:', metricsResult.data);
      }

    } catch (error) {
      if (!error.isAbort) {
        console.error('Error fetching statistics:', error);
      }
    } finally {
      setLoading(false);
      console.log('Loading finished, current state:', { averageMetrics, progressData, problemKeys, keyPerformanceData, streak });
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
          
          {/* Progress Chart */}
          <div className="bg-dark-gray p-4 rounded">
            <h3 className="text-lg text-text-highlight mb-2">Progress Over Time</h3>
            {progressData.length === 0 ? (
              <p className="text-text-normal">No data available for the selected time period.</p>
            ) : (
              <div className="h-64 mb-4">
                <Line
                  data={{
                    labels: progressData.map(day => new Date(day.date).toLocaleDateString()),
                    datasets: [
                      {
                        label: 'WPM',
                        data: progressData.map(day => day.avgWpm),
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y'
                      },
                      {
                        label: 'Accuracy (%)',
                        data: progressData.map(day => day.avgAccuracy),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y1'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'WPM',
                          color: '#D1D5DB'
                        },
                        ticks: {
                          color: '#D1D5DB'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Accuracy (%)',
                          color: '#D1D5DB'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                          color: '#D1D5DB'
                        },
                        grid: {
                          drawOnChartArea: false,
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#D1D5DB'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          afterTitle: function(context) {
                            const dataIndex = context[0].dataIndex;
                            return `Sessions: ${progressData[dataIndex].sessions}`;
                          }
                        }
                      },
                      legend: {
                        labels: {
                          color: '#D1D5DB'
                        }
                      }
                    }
                  }}
                />
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
          
          {/* Key Performance Chart */}
          <div className="bg-dark-gray p-4 rounded">
            <h3 className="text-lg text-text-highlight mb-2">Key Performance</h3>
            {keyPerformanceData.length === 0 ? (
              <p className="text-text-normal">No key performance data available yet.</p>
            ) : (
              <div>
                <div className="h-64 mb-4">
                  <Bar 
                    data={{
                      labels: keyPerformanceData.map(k => k.key),
                      datasets: [
                        {
                          label: 'Accuracy (%)',
                          data: keyPerformanceData.map(k => k.accuracy),
                          backgroundColor: keyPerformanceData.map(k => 
                            k.accuracy < 70 ? 'rgba(239, 68, 68, 0.7)' : 
                            k.accuracy < 90 ? 'rgba(245, 158, 11, 0.7)' : 
                            'rgba(34, 197, 94, 0.7)'
                          ),
                          borderColor: keyPerformanceData.map(k => 
                            k.accuracy < 70 ? 'rgb(239, 68, 68)' : 
                            k.accuracy < 90 ? 'rgb(245, 158, 11)' : 
                            'rgb(34, 197, 94)'
                          ),
                          borderWidth: 1,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            color: '#D1D5DB'
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          }
                        },
                        x: {
                          ticks: {
                            color: '#D1D5DB'
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            afterLabel: function(context) {
                              const keyData = keyPerformanceData[context.dataIndex];
                              return [`Error count: ${keyData.errorCount}`, 
                                     `Correct count: ${keyData.correctCount || 0}`];
                            }
                          }
                        },
                        legend: {
                          labels: {
                            color: '#D1D5DB'
                          }
                        }
                      },
                      onClick: (event, elements) => {
                        if (elements.length > 0) {
                          const index = elements[0].index;
                          setSelectedKey(keyPerformanceData[index]);
                        }
                      }
                    }}
                  />
                </div>
                
                {selectedKey && (
                  <div className="bg-light-gray p-3 rounded mb-4">
                    <h4 className="text-md text-text-highlight mb-2">Key: {selectedKey.key}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Accuracy: {selectedKey.accuracy}%</div>
                      <div>Speed: {selectedKey.speed} WPM</div>
                      <div>Errors: {selectedKey.errorCount}</div>
                      <div>Correct: {selectedKey.correctCount || 0}</div>
                      <div>Last practiced: {new Date(selectedKey.lastPracticed).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsDashboard;