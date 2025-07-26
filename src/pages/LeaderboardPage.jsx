import React from 'react';
import LeaderboardComponent from '../components/LeaderboardComponent';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col items-center pt-16">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-text-highlight mb-4">Typing Champions</h1>
        <p className="text-text-normal mb-8">See how you rank against other typists</p>
        <LeaderboardComponent />
      </div>
    </div>
  );
};

export default LeaderboardPage;
