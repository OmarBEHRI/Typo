import React, { useState, useEffect } from 'react';
import pb from '../services/pocketbaseClient';
import { useAuth } from '../contexts/AuthContext';

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
                <tr key={user.id} className={`${currentUser && currentUser.id === user.id ? 'bg-dark-gray bg-opacity-50' : ''}`}>
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{user.username}</td>
                  <td className="py-2">{user[expField]}</td>
                  <td className="py-2">{user.overallSpeed} wpm</td>
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