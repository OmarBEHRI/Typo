import React, { useCallback } from 'react';
import { saveTypingSession } from '../services/typingSessionService';
import { updateKeyPerformance } from '../services/keyPerformanceService';
import { IoRefreshOutline } from 'react-icons/io5';

function TypingAreaComponent({ 
  words, 
  currentWordIndex, 
  currentLetterIndex, 
  typedLetters,
  startTime,
  setDailyGoal,
  selectedKeys,
  wordsData,
  setWords,
  setCurrentWordIndex,
  setCurrentLetterIndex,
  setTypedLetters,
  setStartTime,
  setEndTime,
  setKeystrokes,
  setErrors,
  setSpeed,
  setAccuracy,
  setScore,
  inputRef
}) {

  // Calculate global letter index for the entire text
  const calculateGlobalLetterIndex = useCallback((wordIndex, letterIndex) => {
    let globalIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
      globalIndex += words[i].length + (i < words.length - 1 ? 1 : 0); // Add space only between words
    }
    return globalIndex + letterIndex;
  }, [words]);

  const handleSessionFinish = useCallback(async () => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 60000; // in minutes
    const wpm = Math.round(words.length / duration);
    const accuracy = Math.round(((typedLetters.length - typedLetters.filter(l => !l.correct).length) / typedLetters.length) * 100);
    const score = Math.round(wpm * accuracy / 100);

    const sessionData = {
      duration: Math.round(duration * 60),
      wpm,
      accuracy,
      score,
      keystrokes: typedLetters.length,
      errors: typedLetters.filter(l => !l.correct).length,
      selectedKeys: selectedKeys.join(', ')
    };

    await saveTypingSession(sessionData);

    const keyPerformanceData = {};
    typedLetters.forEach(letter => {
      if (!keyPerformanceData[letter.char]) {
        keyPerformanceData[letter.char] = { correct: 0, incorrect: 0 };
      }
      if (letter.correct) {
        keyPerformanceData[letter.char].correct++;
      } else {
        keyPerformanceData[letter.char].incorrect++;
      }
    });

    for (const key in keyPerformanceData) {
      const { correct, incorrect } = keyPerformanceData[key];
      const keyAccuracy = Math.round((correct / (correct + incorrect)) * 100);
      await updateKeyPerformance({
        key,
        accuracy: keyAccuracy,
        speed: wpm,
        errorCount: incorrect
      });
    }
  }, [startTime, words, typedLetters, selectedKeys]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => {
            setCurrentWordIndex(0);
            setCurrentLetterIndex(0);
            setTypedLetters([]);
            setStartTime(null);
            setEndTime(null);
            setKeystrokes(0);
            setErrors(0);
            setSpeed(0);
            setAccuracy(0);
            setScore(0);
            
            if (startTime) {
              const minutesSpent = Math.round((Date.now() - startTime) / 60000);
              setDailyGoal(prev => ({
                ...prev,
                current: Math.min(prev.current + minutesSpent, prev.total)
              }));
            }
            
            const exactMatchWords = wordsData.words.filter(word => {
              return word.split('').every(letter => selectedKeys.includes(letter));
            });
            exactMatchWords.sort(() => Math.random() - 0.5);
            exactMatchWords.length = 30;
            setWords(exactMatchWords);
            
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 0);
          }}
          className="p-2 rounded-full hover:bg-gray-600 text-text-highlight transition-colors duration-200"
          title="Refresh"
        >
          <IoRefreshOutline className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-8 text-3xl leading-relaxed min-h-[400px]">
        {words.length > 0 && (
          <div className="flex flex-wrap">
            {words.map((word, wordIndex) => (
              <React.Fragment key={wordIndex}>
                <span
                  className={`mr-3 ${wordIndex === currentWordIndex ? 'text-4xl transition-all duration-200' : 'text-text-normal'}`}
                >
                  {word.split('').map((letter, letterIndex) => {
                    // Check if this is the last word and we've completed it
                    if (wordIndex === words.length - 1 && currentWordIndex === wordIndex && currentLetterIndex === words[wordIndex].length) {
                      handleSessionFinish();
                    }
                    
                    // Calculate the global index for this letter
                    const globalIndex = calculateGlobalLetterIndex(wordIndex, letterIndex);
                    // Get the typed letter information if it exists
                    const typedLetter = typedLetters[globalIndex];
                    
                    // Current letter being typed (cursor position)
                    if (wordIndex === currentWordIndex && letterIndex === currentLetterIndex) {
                      return (
                        <span 
                          key={letterIndex} 
                          className="bg-yellow-300 text-black px-1 rounded animate-pulse"
                        >
                          {letter}
                        </span>
                      );
                    }
                    
                    // Already typed letters (with styling based on correctness)
                    if (typedLetter) {
                      // If this letter has previous incorrect attempts, show it as red even if correct now
                      if (typedLetter.correct && typedLetter.previousAttempts && typedLetter.previousAttempts.length > 0) {
                        return (
                          <span
                            key={letterIndex}
                            className="text-red-500"
                          >
                            {letter}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={letterIndex}
                            className={typedLetter.correct ? 'text-green-500' : 'text-red-500'}
                          >
                            {letter}
                          </span>
                        );
                      }
                    }
                    
                    // Letters not yet typed
                    return <span key={letterIndex} className="text-gray-600">{letter}</span>;
                  })}
                </span>
                {wordIndex < words.length - 1 && (
                  <span className="mr-3 text-gray-400">
                    {wordIndex === currentWordIndex && currentLetterIndex === words[currentWordIndex].length ? 
                      <span className="bg-yellow-300 text-black px-1 rounded">·</span> : 
                      // Check if space has been typed
                      typedLetters[calculateGlobalLetterIndex(wordIndex, words[wordIndex].length)] ? 
                        <span className="text-green-500">·</span> : '·'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingAreaComponent;