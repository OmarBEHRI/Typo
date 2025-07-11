import React from 'react';

function DailyGoalComponent({ dailyGoal }) {
  // Calculate percentage for progress bar, ensuring it doesn't exceed 100%
  const progressPercentage = Math.min((dailyGoal.current / dailyGoal.total) * 100, 100);
  
  return (
    <div className="mt-2 flex items-center bg-light-gray p-4 rounded-full">
      <span className="text-sm">Daily goal:</span>
      <span className="ml-2 text-text-highlight">{dailyGoal.current}/{dailyGoal.total} minutes</span>
      <div className="ml-4 w-64 h-4 bg-light-gray rounded-full">
        <div
          className="h-full bg-text-success rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyGoalComponent;