import React from 'react';
import HiddenInputComponent from '../components/HiddenInputComponent';
import MetricsComponent from '../components/MetricsComponent';
import KeyboardComponent from '../components/KeyboardComponent';
import DailyGoalComponent from '../components/DailyGoalComponent';
import TypingAreaComponent from '../components/TypingAreaComponent';
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
  return (
    <div className="min-h-screen bg-dark-gray font-roboto flex flex-col">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-16" id="typing-area">
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
          <KeyboardComponent
            selectedKeys={selectedKeys}
            toggleKey={toggleKey}
            currentKey={currentKey}
            selectCurrentKey={selectCurrentKey}
            toggleAllKeys={toggleAllKeys}
          />
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
          />
        </div>
        <DailyGoalComponent dailyGoal={dailyGoal} />
      </div>
    </div>
  );

};

export default PracticePage;
