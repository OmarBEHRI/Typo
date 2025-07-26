import React from 'react';

function MetricsComponent({ speed, accuracy, lastSpeed, topSpeed }) {
  return (
    <div className="mt-2 text-text-normal flex justify-center w-full">
      <div className="flex flex-row gap-3 w-full overflow-x-auto">
        <div className="bg-dark-gray p-4 rounded-lg shadow-md flex-1 min-w-[120px] border border-accent/10 transition-all hover:border-accent/30">
          <div className="text-xs text-text-normal mb-1 uppercase tracking-wider">Current Speed</div>
          <div className="text-2xl font-bold text-text-highlight">{speed} <span className="text-xs font-normal">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded-lg shadow-md flex-1 min-w-[120px] border border-accent/10 transition-all hover:border-accent/30">
          <div className="text-xs text-text-normal mb-1 uppercase tracking-wider">Last Speed</div>
          <div className="text-2xl font-bold text-text-highlight">{lastSpeed} <span className="text-xs font-normal">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded-lg shadow-md flex-1 min-w-[120px] border border-accent/10 transition-all hover:border-accent/30">
          <div className="text-xs text-text-normal mb-1 uppercase tracking-wider">Top Speed</div>
          <div className="text-2xl font-bold text-text-highlight">{topSpeed} <span className="text-xs font-normal">WPM</span></div>
        </div>
        
        <div className="bg-dark-gray p-4 rounded-lg shadow-md flex-1 min-w-[120px] border border-accent/10 transition-all hover:border-accent/30">
          <div className="text-xs text-text-normal mb-1 uppercase tracking-wider">Accuracy</div>
          <div className="text-2xl font-bold text-text-highlight">{accuracy}<span className="text-xs font-normal">%</span></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsComponent;