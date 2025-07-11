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
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-16" id="typing-area">
        <div className="mb-6 w-full flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-highlight">
            {selectedLesson ? `Practicing: ${selectedLanguage.name} - ${selectedLesson.title}` : 'Typing Practice'}
          </h2>
          <div className="flex space-x-2">
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
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Back to English Practice
              </button>
            )}
            <button 
              onClick={() => setShowLanguageSelection(!showLanguageSelection)}
              className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-lg transition-colors duration-200"
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
            <div className="mb-12">
              <HiddenInputComponent inputRef={inputRef} handleKeyDown={handleKeyDown} />
              <MetricsComponent
                speed={speed}
                accuracy={accuracy}
                score={score}
                learningRate={learningRate}
                lastSpeed={lastSpeed}
                topSpeed={topSpeed}
                lessonAccuracy={lessonAccuracy}
              />
              {!selectedLesson && (
                <KeyboardComponent
                  selectedKeys={selectedKeys}
                  toggleKey={toggleKey}
                  currentKey={currentKey}
                  selectCurrentKey={selectCurrentKey}
                  toggleAllKeys={toggleAllKeys}
                />
              )}
            </div>
            <div className="flex-grow flex items-center">
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
            <DailyGoalComponent dailyGoal={dailyGoal} />
          </>
        )}
      </div>
    </div>
  );

};

export default PracticePage;
