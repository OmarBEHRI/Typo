import React, { useCallback, useEffect, useState, useRef } from 'react';
import { saveTypingSession } from '../services/typingSessionService';
import { updateKeyPerformance } from '../services/keyPerformanceService';
import { getCurrentDailyGoalSeconds } from '../services/dailyGoalService';
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
  inputRef,
  isProgrammingMode,
  programmingContent
}) {
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const sessionFinishHandled = useRef(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLinePosition, setCurrentLinePosition] = useState(0);
  const [localKeystrokes, setLocalKeystrokes] = useState(0);
  const [localErrors, setLocalErrors] = useState(0);
  const typingAreaRef = useRef(null);
  const currentLineRef = useRef(null);

  useEffect(() => {
    // Reset sessionFinishHandled when component mounts
    sessionFinishHandled.current = false;
    
    const fetchDailyGoal = async () => {
      const result = await getCurrentDailyGoalSeconds();
      if (result.success) {
        const initialDailyGoal = {
          current: Math.floor(result.completedSeconds / 60),
          total: Math.floor(30)
        };
        setDailyGoal(initialDailyGoal);
      }
    };
    fetchDailyGoal();
  }, [setDailyGoal]);

  const calculateGlobalLetterIndex = useCallback((wordIndex, letterIndex) => {
    let globalIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
      globalIndex += words[i].length + (i < words.length - 1 ? 1 : 0);
    }
    return globalIndex + letterIndex;
  }, [words]);

const handleSessionFinish = useCallback(async () => {
  if (sessionFinishHandled.current) {
    return;
  }
  sessionFinishHandled.current = true;

  const endTime = Date.now();
  const durationInSeconds = Math.round((endTime - startTime) / 1000);
  const wpm = Math.round((words.length / durationInSeconds) * 60);
  const accuracy = Math.round(((typedLetters.length - typedLetters.filter(l => !l.correct).length) / typedLetters.length) * 100);
  const score = Math.round(wpm * accuracy / 100);

  const sessionData = {
    duration: durationInSeconds,
    wpm,
    accuracy,
    score,
    keystrokes: typedLetters.length,
    errors: typedLetters.filter(l => !l.correct).length,
    selectedKeys: selectedKeys.join(', ')
  };

  await saveTypingSession(sessionData);
  
  const dailyGoalResult = await getCurrentDailyGoalSeconds();
  
  if (dailyGoalResult.success) {
    const newDailyGoal = {
      current: Math.floor(dailyGoalResult.completedSeconds / 60),
      total: Math.floor(30)
    };
    setDailyGoal(newDailyGoal);
  }

  const keyPerformanceData = {};
  
  typedLetters.forEach(letter => {
    if (letter.isSpace) return;
    
    if (!keyPerformanceData[letter.char]) {
      keyPerformanceData[letter.char] = { correct: 0, incorrect: 0 };
    }
    
    if (letter.correct) {
      keyPerformanceData[letter.char].correct++;
    } else {
      keyPerformanceData[letter.char].incorrect++;
    }
    
    if (letter.previousAttempts && letter.previousAttempts.length > 0) {
      letter.previousAttempts.forEach(attempt => {
        if (!keyPerformanceData[attempt]) {
          keyPerformanceData[attempt] = { correct: 0, incorrect: 0 };
        }
        keyPerformanceData[attempt].incorrect++;
      });
    }
  });

  for (const key in keyPerformanceData) {
    const { correct, incorrect } = keyPerformanceData[key];
    const totalAttempts = correct + incorrect;
    const keyAccuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;
    
    await updateKeyPerformance({
      key,
      accuracy: keyAccuracy,
      speed: wpm,
      errorCount: incorrect,
      correctCount: correct
    });
  }
}, [startTime, words, typedLetters, selectedKeys, setDailyGoal]);

  useEffect(() => {
    if (startTime === null) {
      sessionFinishHandled.current = false;
    }
  }, [startTime]);
  
  useEffect(() => {
    if (isSessionComplete) {
      handleSessionFinish();
      setIsSessionComplete(false);
    }
  }, [isSessionComplete, handleSessionFinish]);

  const checkSessionComplete = useCallback(() => {
    if (words.length > 0 && 
        currentWordIndex === words.length - 1 && 
        currentLetterIndex === words[currentWordIndex].length) {
      setIsSessionComplete(true);
    }
  }, [words, currentWordIndex, currentLetterIndex]);

  useEffect(() => {
    checkSessionComplete();
  }, [currentWordIndex, currentLetterIndex, checkSessionComplete]);

  // Auto-scroll to keep the current line in view
  useEffect(() => {
    if (isProgrammingMode && currentLineRef.current) {
      currentLineRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  }, [isProgrammingMode, currentLineIndex, currentLinePosition]);

  // Handle keyboard input for programming mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isProgrammingMode || !programmingContent || !Array.isArray(programmingContent)) return;
      
      // Start timing when first key is pressed
      if (!startTime) setStartTime(Date.now());
      
      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      
      // Track keystrokes for metrics
      setKeystrokes(prev => prev + 1);
      setLocalKeystrokes(prev => prev + 1);
      
      const currentLine = programmingContent[currentLineIndex];
      
      if (e.key === 'Enter') {
        e.preventDefault();
        
        // Check if we're at the end of the current line
        if (currentLinePosition === currentLine.length) {
          // Move to the next line if not at the last line
          if (currentLineIndex < programmingContent.length - 1) {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentLinePosition(0);
          }
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        
        if (currentLinePosition > 0) {
          // Move cursor back one position in current line
          setCurrentLinePosition(prev => prev - 1);
        } else if (currentLineIndex > 0) {
          // Move to end of previous line
          setCurrentLineIndex(prev => prev - 1);
          setCurrentLinePosition(programmingContent[currentLineIndex - 1].length);
        }
      } else if (e.key.length === 1) { // Regular character
        e.preventDefault();
        
        const expectedChar = currentLine[currentLinePosition];
        const isCorrect = e.key === expectedChar;
        
        if (isCorrect) {
          // Move to next character
          setCurrentLinePosition(prev => prev + 1);
          
          // If at end of line and there are more lines, show Enter indicator
          if (currentLinePosition === currentLine.length - 1 && currentLineIndex < programmingContent.length - 1) {
            // The cursor will automatically move to show the Enter indicator
          }
        } else {
          // Track errors for metrics
          setErrors(prev => prev + 1);
          setLocalErrors(prev => prev + 1);
        }
      }
      
      // Update metrics
      if (startTime) {
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        if (elapsedMinutes > 0) {
          const wpm = Math.round((localKeystrokes / 5) / elapsedMinutes);
          setSpeed(wpm);
          const acc = Math.round(((localKeystrokes - localErrors) / localKeystrokes) * 100);
          setAccuracy(acc);
          setScore(Math.round(wpm * (acc / 100)));
        }
      }
      
      // Check if session is complete (reached end of last line)
      if (currentLineIndex === programmingContent.length - 1 && 
          currentLinePosition === programmingContent[currentLineIndex].length) {
        setIsSessionComplete(true);
      }
    };
    
    if (isProgrammingMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isProgrammingMode, programmingContent, currentLineIndex, currentLinePosition, startTime, 
      setKeystrokes, setErrors, setSpeed, setAccuracy, setScore, setStartTime, localKeystrokes, localErrors]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => {
            sessionFinishHandled.current = false;
            setCurrentWordIndex(0);
            setCurrentLetterIndex(0);
            setTypedLetters([]);
            setStartTime(null);
            setEndTime(null);
            setKeystrokes(0);
            setErrors(0);
            setLocalKeystrokes(0);
            setLocalErrors(0);
            setSpeed(0);
            setAccuracy(0);
            setScore(0);
            
            // Reset programming mode state
            if (isProgrammingMode) {
              setCurrentLineIndex(0);
              setCurrentLinePosition(0);
            } else {
              const exactMatchWords = wordsData.words.filter(word => {
                return word.split('').every(letter => selectedKeys.includes(letter));
              });
              exactMatchWords.sort(() => Math.random() - 0.5);
              exactMatchWords.length = 30;
              setWords(exactMatchWords);
            }
            
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
      
      <div 
        ref={typingAreaRef}
        className={`p-8 text-3xl leading-relaxed min-h-[400px] font-medium relative bg-black/10 rounded-xl shadow-lg border border-accent/10 ${
          isProgrammingMode ? 'w-full max-w-6xl overflow-x-auto' : ''
        }`}
      >  
        {/* Fade-out effect overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-dark-gray to-transparent rounded-b-xl"></div>
        
        {words.length > 0 && !isProgrammingMode && (
          <div className="flex flex-wrap">
            {/* Regular word-by-word typing mode */}
            {words.map((word, wordIndex) => (
              <React.Fragment key={wordIndex}>
                <span
                  className={`mr-3 font-bold ${wordIndex === currentWordIndex ? 'text-4xl transition-all duration-200' : 'text-text-normal'}`}
                >
                  {word.split('').map((letter, letterIndex) => {
                    const globalIndex = calculateGlobalLetterIndex(wordIndex, letterIndex);
                    const typedLetter = typedLetters[globalIndex];
                    
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
                    
                    if (typedLetter) {
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
                    
                    return <span key={letterIndex} className="text-gray-600">{letter}</span>;
                  })}
                </span>
                {wordIndex < words.length - 1 && (
                  <span className="mr-3 text-gray-400">
                    {wordIndex === currentWordIndex && currentLetterIndex === words[currentWordIndex].length ? 
                      <span className="bg-yellow-300 text-black px-1 rounded">·</span> : 
                      typedLetters[calculateGlobalLetterIndex(wordIndex, words[wordIndex].length)] ? 
                        <span className="text-green-500">·</span> : '·'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        
        {isProgrammingMode && programmingContent && Array.isArray(programmingContent) && (
          <div className="whitespace-pre-wrap">
            {programmingContent.map((line, lineIndex) => (
              <div 
                key={lineIndex} 
                ref={lineIndex === currentLineIndex ? currentLineRef : null}
                className={`mb-2 font-bold ${lineIndex === currentLineIndex ? 'bg-gray-800/30 rounded' : ''}`}
              >
                {line.split('').map((char, charIndex) => {
                  const isCurrentPosition = lineIndex === currentLineIndex && charIndex === currentLinePosition;
                  const isTyped = lineIndex < currentLineIndex || (lineIndex === currentLineIndex && charIndex < currentLinePosition);
                  
                  if (isCurrentPosition) {
                    return (
                      <span 
                        key={charIndex} 
                        className="bg-yellow-300 text-black px-1 rounded animate-pulse"
                      >
                        {char}
                      </span>
                    );
                  } else if (isTyped) {
                    return (
                      <span 
                        key={charIndex} 
                        className="text-green-500"
                      >
                        {char}
                      </span>
                    );
                  } else {
                    return (
                      <span 
                        key={charIndex} 
                        className="text-gray-600"
                      >
                        {char}
                      </span>
                    );
                  }
                })}
                {lineIndex === currentLineIndex && currentLinePosition === line.length && (
                  <span className="bg-yellow-300 text-black px-1 rounded animate-pulse">⏎</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingAreaComponent;