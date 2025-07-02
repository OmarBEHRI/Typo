import React, { useState, useEffect } from 'react';
import { getUserAchievements } from '../services/achievementService';
import { useAuth } from '../contexts/AuthContext';

function AchievementsComponent() {
  const { isLoggedIn } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchAchievements();
    }
  }, [isLoggedIn]);
  
  const fetchAchievements = async () => {
    setLoading(true);
    
    try {
      const result = await getUserAchievements();
      
      if (result.success) {
        setAchievements(result.data);
      }
    } catch (error) {
      if (!error.isAbort) {
        console.error('Error fetching achievements:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Group achievements by type
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const { type } = achievement;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(achievement);
    return groups;
  }, {});
  
  if (!isLoggedIn) {
    return (
      <div className="mt-8 p-6 bg-light-gray rounded-lg">
        <p className="text-text-normal">Please log in to view your achievements.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 p-6 bg-light-gray rounded-lg">
      <h2 className="text-xl text-text-highlight mb-4">Your Achievements</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="text-text-normal">
          <p>You haven't earned any achievements yet. Keep practicing!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
            <div key={type} className="border-t border-dark-gray pt-4">
              <h3 className="text-lg text-text-highlight mb-2">
                {type === 'speed_milestone' ? 'Speed Milestones' : 
                 type === 'accuracy_milestone' ? 'Accuracy Milestones' : 
                 type === 'streak' ? 'Practice Streaks' : 
                 'Other Achievements'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typeAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className="bg-dark-gray p-3 rounded flex items-center"
                  >
                    <div className="mr-3">
                      {type === 'speed_milestone' ? '🚀' : 
                       type === 'accuracy_milestone' ? '🎯' : 
                       type === 'streak' ? '🔥' : '🏆'}
                    </div>
                    <div>
                      <div className="text-text-highlight">{achievement.description}</div>
                      <div className="text-sm text-text-normal">
                        {new Date(achievement.created).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AchievementsComponent;