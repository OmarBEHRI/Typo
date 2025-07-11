import React from 'react';
import StatisticsDashboard from '../components/StatisticsDashboard';
import AchievementsComponent from '../components/AchievementsComponent';

const UserPage = () => {
  return (
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <StatisticsDashboard />
        <AchievementsComponent />
      </div>
    </div>
  );
};

export default UserPage;
