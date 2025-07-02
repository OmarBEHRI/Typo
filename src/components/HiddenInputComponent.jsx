import React from 'react';

function HiddenInputComponent({ inputRef, handleKeyDown }) {
  return (
    <input
      ref={inputRef}
      type="text"
      className="opacity-0 absolute"
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default HiddenInputComponent;