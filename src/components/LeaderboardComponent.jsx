import React, { useState, useEffect } from 'react';
import pb from '../services/pocketbaseClient';
import { useAuth } from '../contexts/AuthContext';
import { IoTrophyOutline } from 'react-icons/io5';
// Import medal SVGs
import GoldMedal from '../assets/medals/gold.svg';
import SilverMedal from '../assets/medals/silver.svg';
import BronzeMedal from '../assets/medals/bronze.svg';

function LeaderboardComponent() {
  const { currentUser, isLoggedIn } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState('daily'); // 'daily', 'weekly', 'overall'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const controller = new AbortController();
    fetchLeaderboard({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [leaderboardType]);
  
  const fetchLeaderboard = async (options = {}) => {
    setLoading(true);
    
    try {
      // Determine which field to sort by based on leaderboard type
      let sortField = '';
      switch (leaderboardType) {
        case 'daily':
          sortField = 'dailyExperience';
          break;
        case 'weekly':
          sortField = 'weeklyExperience';
          break;
        default:
          sortField = 'experience';
          break;
      }
      
      // Fetch top 10 users by the selected experience field
      const resultList = await pb.collection('users').getList(1, 10, {
        sort: `-${sortField}`,
        fields: 'id,name,dailyExperience,weeklyExperience,experience,overallSpeed',
        ...options
      });
      
      setUsers(resultList.items);
    } catch (error) {
      if (!error.isAbort) {
        console.error('Error fetching leaderboard:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-8 p-6 bg-light-gray rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-text-highlight">Leaderboard</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${leaderboardType === 'daily' ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setLeaderboardType('daily')}
          >
            Daily
          </button>
          <button 
            className={`px-3 py-1 rounded ${leaderboardType === 'weekly' ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setLeaderboardType('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 rounded ${leaderboardType === 'overall' ? 'bg-accent text-white' : 'bg-dark-gray text-text-normal'}`}
            onClick={() => setLeaderboardType('overall')}
          >
            Overall
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-text-normal">
              <th className="pb-2">Rank</th>
              <th className="pb-2">User</th>
              <th className="pb-2">Experience</th>
              <th className="pb-2">Speed</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              // Determine which experience field to display
              let expField = '';
              switch (leaderboardType) {
                case 'daily':
                  expField = 'dailyExperience';
                  break;
                case 'weekly':
                  expField = 'weeklyExperience';
                  break;
                default:
                  expField = 'experience';
                  break;
              }
              
              return (
                <tr key={user.id} className={`${currentUser && currentUser.id === user.id ? 'bg-dark-gray bg-opacity-50' : ''} ${index < 3 ? 'relative transform transition-all duration-300 hover:scale-105' : ''} ${index === 0 ? 'bg-gradient-to-r from-yellow-900/10 to-yellow-600/10' : index === 1 ? 'bg-gradient-to-r from-gray-500/10 to-gray-300/10' : index === 2 ? 'bg-gradient-to-r from-amber-800/10 to-amber-600/10' : ''}`}>
                  <td className="py-2 relative">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <img src={GoldMedal} alt="Gold Medal" className="w-6 h-6 mr-1 animate-pulse" />
                        <span className="font-bold text-yellow-500">1</span>
                      </div>
                    ) : index === 1 ? (
                      <div className="flex items-center">
                        <img src={SilverMedal} alt="Silver Medal" className="w-6 h-6 mr-1" />
                        <span className="font-bold text-gray-400">2</span>
                      </div>
                    ) : index === 2 ? (
                      <div className="flex items-center">
                        <img src={BronzeMedal} alt="Bronze Medal" className="w-6 h-6 mr-1" />
                        <span className="font-bold text-amber-700">3</span>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="py-2">
                    <span className={`${index === 0 ? 'font-bold text-yellow-500' : index === 1 ? 'font-bold text-gray-400' : index === 2 ? 'font-bold text-amber-700' : ''}`}>
                      {user.name}
                      {index === 0 && <IoTrophyOutline className="inline ml-1 text-yellow-500" />}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`${index === 0 ? 'font-bold text-yellow-500' : index === 1 ? 'font-bold text-gray-400' : index === 2 ? 'font-bold text-amber-700' : ''}`}>
                      {user[expField]}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`${index === 0 ? 'font-bold text-yellow-500' : index === 1 ? 'font-bold text-gray-400' : index === 2 ? 'font-bold text-amber-700' : ''}`}>
                      {user.overallSpeed} wpm
                    </span>
                    {index === 0 && (
                      <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none overflow-hidden">
                        <div className="animate-sparkle absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                        <div className="animate-sparkle delay-100 absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                        <div className="animate-sparkle delay-200 absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaderboardComponent;