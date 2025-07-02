import React from 'react';

function MetricsComponent({ speed, accuracy, lastSpeed, topSpeed }) {
  return (
    <div className="mt-7 text-text-normal flex justify-center">
      
      <div className="flex flex-row gap-16 overflow-x-auto max-w-5xl">        
        <div className="bg-dark-gray p-4 rounded flex-1 min-w-[150px]">          
          <div className="text-sm text-text-normal mb-2">Current Speed</div>
          <div className="text-xl text-text-highlight">{speed} <span className="text-sm">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded flex-1 min-w-[150px]">
          <div className="text-sm text-text-normal mb-2">Last Speed</div>
          <div className="text-xl text-text-highlight">{lastSpeed} <span className="text-sm">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded flex-1 min-w-[150px]">
          <div className="text-sm text-text-normal mb-2">Top Speed</div>
          <div className="text-xl text-text-highlight">{topSpeed} <span className="text-sm">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded flex-1 min-w-[150px]">
          <div className="text-sm text-text-normal mb-2">Accuracy</div>
          <div className="text-xl text-text-highlight">{accuracy}<span className="text-sm">%</span></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsComponent;