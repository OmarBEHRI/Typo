import React from 'react';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

function KeyboardComponent({ selectedKeys, toggleKey, toggleAllKeys }) {
  const allKeysSelected = selectedKeys.length === 26;
  return (
    <div>
      {/* Keys */}
      <div className="mt-14">
        <div className="flex space-x-2 ml-2">
          <button 
            onClick={toggleAllKeys}
            className="w-24 h-8 px-2 py-1 rounded cursor-pointer bg-accent text-white whitespace-nowrap flex items-center justify-center"
          >
            {allKeysSelected ? 'Default' : 'Select All'}
          </button>
          {ALPHABET.map(key => (
            <span
              key={key}
              className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer ${
                selectedKeys.includes(key) ? 'bg-light-gray text-text-highlight' : 'text-text-normal'
              }`}
              onClick={() => toggleKey(key)}
            >
              {key.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardComponent;