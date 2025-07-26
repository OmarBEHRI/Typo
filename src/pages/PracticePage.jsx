import React, { useState } from 'react';
import HiddenInputComponent from '../components/HiddenInputComponent';
import MetricsComponent from '../components/MetricsComponent';
import KeyboardComponent from '../components/KeyboardComponent';
import DailyGoalComponent from '../components/DailyGoalComponent';
import TypingAreaComponent from '../components/TypingAreaComponent';
import LanguageSelectionComponent from '../components/LanguageSelectionComponent';
import wordsData from '../data/words.json';

const PracticePage = ({
  inputRef,
  handleKeyDown,
  speed,
  accuracy,
  score,
  learningRate,
  lastSpeed,
  topSpeed,
  lessonAccuracy,
  selectedKeys,
  toggleKey,
  currentKey,
  selectCurrentKey,
  toggleAllKeys,
  dailyGoal,
  words,
  currentWordIndex,
  currentLetterIndex,
  typedLetters,
  startTime,
  setDailyGoal,
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
}) => {
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };
  
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLanguageSelection(false);
    
    // Convert the lesson content to an array of words for the typing component
    let programmingWords = [];
    
    // Handle both string and array formats for lesson content
    if (Array.isArray(lesson.content)) {
      // Join the array of strings with newlines and then split into words
      programmingWords = lesson.content.join('\n').split(/\s+/);
    } else if (typeof lesson.content === 'string') {
      // Handle legacy format (string)
      programmingWords = lesson.content.split(/\s+/);
    } else {
      console.error('Unsupported lesson content format:', lesson.content);
      programmingWords = ['Error:', 'Unsupported', 'lesson', 'content', 'format'];
    }
    
    setWords(programmingWords);
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setTypedLetters([]);
    setStartTime(null);
  };
  
  return (
    <div className="h-screen bg-dark-gray font-roboto flex flex-col overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center h-full py-8 pt-12" id="typing-area">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-8 mt-2">
          <div>
            <h1 className="text-4xl font-bold text-text-highlight mb-3">
              {selectedLesson ? `Practicing: ${selectedLanguage.name} - ${selectedLesson.title}` : 'Typing Practice'}
            </h1>
            <DailyGoalComponent dailyGoal={dailyGoal} />
          </div>
          <div className="flex space-x-3 mt-2 md:mt-0">
            {selectedLesson && (
              <button 
                onClick={() => {
                  setSelectedLesson(null);
                  setSelectedLanguage(null);
                  
                  // Reset to English practice mode
                  const exactMatchWords = wordsData.words.filter(word => {
                    return word.split('').every(letter => selectedKeys.includes(letter));
                  });
                  exactMatchWords.sort(() => Math.random() - 0.5);
                  exactMatchWords.length = 30;
                  setWords(exactMatchWords);
                  
                  // Reset typing state
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
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg transition-colors duration-200"
              >
                Back to English Practice
              </button>
            )}
            <button 
              onClick={() => setShowLanguageSelection(!showLanguageSelection)}
              className="bg-accent hover:bg-accent-dark text-white py-2 px-5 rounded-lg transition-colors duration-200"
            >
              {showLanguageSelection ? 'Back to Practice' : 'Programming Languages'}
            </button>
          </div>
        </div>
        
        {showLanguageSelection ? (
          <LanguageSelectionComponent 
            onSelectLanguage={handleSelectLanguage} 
            onSelectLesson={handleSelectLesson} 
          />
        ) : (
          <>
            {/* Hidden input for capturing keystrokes */}
            <HiddenInputComponent inputRef={inputRef} handleKeyDown={handleKeyDown} />
            
            {/* Stats section with subtle styling */}
             <div className="w-full mb-3 bg-light-gray/5 p-2 rounded-lg">
               <MetricsComponent
                 speed={speed}
                 accuracy={accuracy}
                 score={score}
                 learningRate={learningRate}
                 lastSpeed={lastSpeed}
                 topSpeed={topSpeed}
                 lessonAccuracy={lessonAccuracy}
               />
             </div>
            
            {/* Main content area with flex to ensure vertical centering */}
            <div className="flex-1 w-full flex flex-col justify-center overflow-hidden">
              {!selectedLesson && (
                <div className="w-full mb-4">
                  <KeyboardComponent
                    selectedKeys={selectedKeys}
                    toggleKey={toggleKey}
                    currentKey={currentKey}
                    selectCurrentKey={selectCurrentKey}
                    toggleAllKeys={toggleAllKeys}
                  />
                </div>
              )}
              
              {/* Typing area with better vertical centering */}
              <div className="w-full flex-1 flex items-center justify-center">
              <TypingAreaComponent
                  words={words}
                  currentWordIndex={currentWordIndex}
                  currentLetterIndex={currentLetterIndex}
                  typedLetters={typedLetters}
                  startTime={startTime}
                  setDailyGoal={setDailyGoal}
                  selectedKeys={selectedKeys}
                  wordsData={wordsData}
                  setWords={setWords}
                  setCurrentWordIndex={setCurrentWordIndex}
                  setCurrentLetterIndex={setCurrentLetterIndex}
                  setTypedLetters={setTypedLetters}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                  setKeystrokes={setKeystrokes}
                  setErrors={setErrors}
                  setSpeed={setSpeed}
                  setAccuracy={setAccuracy}
                  setScore={setScore}
                  inputRef={inputRef}
                  isProgrammingMode={!!selectedLesson}
                  programmingContent={selectedLesson?.content}
                />
              </div>
              
              {/* Add some bottom spacing */}
              <div className="h-6"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );

};

export default PracticePage;
