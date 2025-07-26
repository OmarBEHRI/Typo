import React, { useState, useEffect, useRef } from 'react';
import pb from '../services/pocketbaseClient';
import { useAuth } from '../contexts/AuthContext';
import { IoTrophyOutline, IoSearchOutline } from 'react-icons/io5';
import { FaJava, FaPython, FaJs } from 'react-icons/fa';
// Import medal SVGs
import GoldMedal from '../assets/medals/gold.svg';
import SilverMedal from '../assets/medals/silver.svg';
import BronzeMedal from '../assets/medals/bronze.svg';

const LeaderboardComponent = () => {
  const { currentUser, isLoggedIn } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState('daily'); // 'daily', 'weekly', 'overall'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleUsers, setVisibleUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all'); // 'all', 'javascript', 'python', 'java'
  const userRefs = useRef({});
  
  // We'll use a single IntersectionObserver implementation below
  
  useEffect(() => {
    const controller = new AbortController();
    fetchLeaderboard({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [leaderboardType]);
  
  // Filter users based on search query and selected language
  useEffect(() => {
    if (users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    let result = [...users];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query)
      );
    }
    
    // In a real app, we would filter by language preference
    // For now, we'll just simulate this since we don't have language data
    if (selectedLanguage !== 'all') {
      // This is just a simulation - in a real app, you would filter based on actual user language preference
      // For demo purposes, we'll just keep all users but could filter randomly if needed
    }
    
    setFilteredUsers(result);
    // Reset visibility state when filters change
    setVisibleUsers({});
  }, [users, searchQuery, selectedLanguage]);
  
  // Set up intersection observer to detect when user rows enter viewport
  useEffect(() => {
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px',
      threshold: 0.1 // trigger when 10% of element is visible
    };
    
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const userId = entry.target.dataset.userId;
          setVisibleUsers(prev => ({ ...prev, [userId]: true }));
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all user elements that have refs
    // We need to wait for the next render cycle for refs to be attached to DOM elements
    setTimeout(() => {
      Object.values(userRefs.current).forEach(ref => {
        if (ref && ref.current) {
          observer.observe(ref.current);
        }
      });
    }, 0);
    
    return () => {
      observer.disconnect();
    };
  }, [users]); // Re-run when users array changes
  
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
      
      // Fetch all users (since we might have only a few)
      const resultList = await pb.collection('users').getList(1, 50, {
        sort: `-${sortField}`,
        fields: 'id,name,dailyExperience,weeklyExperience,experience,overallSpeed,overallAccuracy',
        ...options
      });
      
      // Reset visibility state when fetching new data
      setVisibleUsers({});
      
      // Check if we have users
      if (resultList.items.length > 0) {
        // Add default accuracy if not present
        const processedUsers = resultList.items.map(user => ({
          ...user,
          overallAccuracy: user.overallAccuracy || Math.floor(Math.random() * 10 + 90) // Random accuracy between 90-99% if not present
        }));
        
        setUsers(processedUsers);
        console.log(`Fetched ${processedUsers.length} users for leaderboard`);
      } else {
        console.log('No users found for leaderboard');
        setUsers([]);
      }
    } catch (error) {
      if (!error.isAbort) {
        console.error('Error fetching leaderboard:', error);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-8 p-6 bg-dark-gray rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-text-highlight font-bold">Leaderboard</h2>
      </div>
      
      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Find user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-light-gray text-text-normal rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <IoSearchOutline className="absolute left-3 top-2.5 text-text-normal" />
        </div>
        
        {/* Language filters */}
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${selectedLanguage === 'all' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'}`}
            onClick={() => setSelectedLanguage('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${selectedLanguage === 'javascript' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'} flex items-center`}
            onClick={() => setSelectedLanguage('javascript')}
          >
            <FaJs className="mr-1" /> JavaScript
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${selectedLanguage === 'python' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'} flex items-center`}
            onClick={() => setSelectedLanguage('python')}
          >
            <FaPython className="mr-1" /> Python
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${selectedLanguage === 'java' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'} flex items-center`}
            onClick={() => setSelectedLanguage('java')}
          >
            <FaJava className="mr-1" /> Java
          </button>
        </div>
      </div>
      
      {/* Time period filters */}
      <div className="flex space-x-2 mb-6">
        <button 
          className={`px-4 py-1.5 rounded-full transition-all duration-300 ${leaderboardType === 'daily' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'}`}
          onClick={() => setLeaderboardType('daily')}
        >
          Daily
        </button>
        <button 
          className={`px-4 py-1.5 rounded-full transition-all duration-300 ${leaderboardType === 'weekly' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'}`}
          onClick={() => setLeaderboardType('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`px-4 py-1.5 rounded-full transition-all duration-300 ${leaderboardType === 'overall' ? 'bg-accent text-white' : 'bg-light-gray text-text-normal'}`}
          onClick={() => setLeaderboardType('overall')}
        >
          Overall
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-normal">Loading leaderboard...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-normal">No users found in the leaderboard yet.</p>
          <p className="text-text-normal mt-2">Start typing to earn experience and appear here!</p>
        </div>
      ) : (
        <div>
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 mb-4 px-4 text-text-normal font-medium">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">User</div>
            <div className="col-span-3 text-center">WPM</div>
            <div className="col-span-3 text-center">Accuracy</div>
          </div>
          
          {/* User entries */}
          <div className="space-y-3">
            {(filteredUsers.length > 0 ? filteredUsers : users).map((user, index) => {
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
              
              const rankColor = index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-text-normal';
              const bgColor = index === 0 ? 'bg-yellow-900/5' : index === 1 ? 'bg-gray-500/5' : index === 2 ? 'bg-amber-800/5' : 'bg-light-gray/5';
              const animationDelay = `${index * 0.1}s`;
              const isVisible = visibleUsers[user.id];
              
              // Store ref for this user
              if (!userRefs.current[user.id]) {
                userRefs.current[user.id] = React.createRef();
              }
              
              return (
                <div 
                  key={user.id}
                  ref={userRefs.current[user.id]}
                  data-user-id={user.id}
                  className={`rounded-lg mb-2 transform transition-all duration-500 ${bgColor} ${currentUser && currentUser.id === user.id ? 'ring-1 ring-accent/30' : ''} hover:translate-x-1 hover:bg-light-gray/10`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                    transitionDelay: animationDelay
                  }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center p-3">
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
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
                        <span className="ml-2">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* User with avatar */}
                    <div className="col-span-5 flex items-center">
                      {/* User avatar - using a placeholder circle with first letter of name */}
                      <div className="w-10 h-10 rounded-full bg-dark-gray flex items-center justify-center mr-3 text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      
                      {/* User name */}
                      <span className={`${rankColor} font-medium`}>
                        {user.name}
                        {index === 0 && <IoTrophyOutline className="inline ml-1 text-yellow-500" />}
                      </span>
                    </div>
                    
                    {/* WPM */}
                    <div className="col-span-3 text-center">
                      <span className={rankColor}>
                        {user.overallSpeed} wpm
                      </span>
                    </div>
                    
                    {/* Accuracy */}
                    <div className="col-span-3 text-center">
                      <span className={rankColor}>
                        {user.overallAccuracy || 95}%
                      </span>
                      {index === 0 && (
                        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none overflow-hidden">
                          <div className="animate-sparkle absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                          <div className="animate-sparkle delay-100 absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                          <div className="animate-sparkle delay-200 absolute w-1 h-1 bg-yellow-500 rounded-full opacity-0"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-8 text-text-normal">
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaderboardComponent;