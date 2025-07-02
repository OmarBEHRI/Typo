import React from 'react';
import LeaderboardComponent from '../components/LeaderboardComponent';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <LeaderboardComponent />
      </div>
    </div>
  );
};

export default LeaderboardPage;
