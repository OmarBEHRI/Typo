import React from 'react';

function DailyGoalComponent({ dailyGoal }) {
  // Calculate percentage for progress bar, ensuring it doesn't exceed 100%
  const progressPercentage = Math.min((dailyGoal.current / dailyGoal.total) * 100, 100);
  
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center gap-1 text-sm text-text-normal">
        <span className="font-medium">Daily Goal:</span>
        <span className="text-text-highlight font-bold">{dailyGoal.current}/{dailyGoal.total}</span>
      </div>
      <div className="flex-1 h-2 bg-light-gray/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-text-success rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyGoalComponent;