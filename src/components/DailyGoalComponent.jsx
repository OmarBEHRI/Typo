import React from 'react';

function DailyGoalComponent({ dailyGoal }) {
  return (
    <div className="mt-2 flex items-center">
      <span className="text-sm">Daily goal:</span>
      <span className="ml-2 text-text-highlight">{dailyGoal.current}/{dailyGoal.total} minutes</span>
      <div className="ml-4 w-64 h-2 bg-light-gray rounded-full">
        <div
          className="h-full bg-text-success rounded-full"
          style={{ width: `${(dailyGoal.current / dailyGoal.total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyGoalComponent;