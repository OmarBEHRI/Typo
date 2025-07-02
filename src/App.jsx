import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import wordsData from './data/words.json';
import HomePage from './components/HomePage';
import SideNavbar from './components/SideNavbar';
import AuthModal from './components/AuthModal';
import TopRightAuth from './components/TopRightAuth';
import PracticePage from './pages/PracticePage';
import UserPage from './pages/UserPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
function AppContent() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['e', 'n', 'i', 'a', 'r', 'l']);
  const [currentKey, setCurrentKey] = useState('r');
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [keystrokes, setKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(0);
  const [topSpeed, setTopSpeed] = useState(0);
  const [learningRate, setLearningRate] = useState(0);
  const [lessonAccuracy, setLessonAccuracy] = useState({ current: 0, previous: 0 });
  const [dailyGoal, setDailyGoal] = useState(() => {
    const savedGoal = localStorage.getItem('dailyGoal');
    return savedGoal ? JSON.parse(savedGoal) : { current: 0, total: 30 };
  });

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const exactMatchWords = wordsData.words.filter(word =>
      word.split('').every(letter => selectedKeys.includes(letter))
    );
    exactMatchWords.sort(() => Math.random() - 0.5);
    exactMatchWords.length = 30;
    setWords(exactMatchWords);
  }, [selectedKeys]);

  const toggleAllKeys = () => {
    const allKeysSelected = ALPHABET.length === selectedKeys.length;
    if (allKeysSelected) {
      setSelectedKeys(['e', 'n', 'i', 'a', 'r', 'l']);
    } else {
      setSelectedKeys(ALPHABET);
    }
  };

  const toggleKey = (key) => {
    if (selectedKeys.includes(key)) {
      if (selectedKeys.length > 1) {
        setSelectedKeys(selectedKeys.filter(k => k !== key));
      }
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const selectCurrentKey = (key) => {
    setCurrentKey(key);
  };

  // Calculate global letter index for the entire text
  const calculateGlobalLetterIndex = (wordIndex, letterIndex) => {
    let globalIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
      globalIndex += words[i].length + (i < words.length - 1 ? 1 : 0); // Add space for word separation
    }
    return globalIndex + letterIndex;
  };

  const handleKeyDown = (e) => {
    if (!startTime) setStartTime(Date.now());

    const key = e.key.toLowerCase();
    if (['shift', 'control', 'alt'].includes(key)) return;

    setKeystrokes(prev => prev + 1);

    const currentWord = words[currentWordIndex];
    // Calculate the global index for the current position
    const currentGlobalIndex = calculateGlobalLetterIndex(currentWordIndex, currentLetterIndex);

    if (key === ' ') {
      if (currentLetterIndex === currentWord.length) {
        if (currentWordIndex === words.length - 1) {
          setEndTime(Date.now());
          // Reset session
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
          // Generate new words
          const newWords = wordsData.words.filter(word =>
            word.split('').every(letter => selectedKeys.includes(letter))
          );
          newWords.sort(() => Math.random() - 0.5);
          newWords.length = 30;
          setWords(newWords);
        } else {
          // Add space character to typedLetters when moving to next word
          setTypedLetters(prev => [...prev, { char: ' ', correct: true, isSpace: true }]);
          setCurrentWordIndex(prev => prev + 1);
          setCurrentLetterIndex(0);
        }
      }
    } else if (key === 'backspace') {
      if (currentLetterIndex > 0) {
        setCurrentLetterIndex(prev => prev - 1);
        // Remove the last typed letter
        setTypedLetters(prev => {
          // Find the index of the last letter for the current word
          const lastLetterIndex = prev.findIndex((letter, index) => 
            index >= currentGlobalIndex - 1 && index < currentGlobalIndex
          );
          
          if (lastLetterIndex >= 0) {
            return prev.filter((_, index) => index !== lastLetterIndex);
          }
          return prev;
        });
      } else if (currentWordIndex > 0) {
        // If at the beginning of a word, go back to previous word
        const prevWordIndex = currentWordIndex - 1;
        const prevWordLength = words[prevWordIndex].length;
        
        // Remove the space character
        setTypedLetters(prev => {
          const spaceIndex = prev.findIndex((letter, index) => 
            letter.isSpace && index === calculateGlobalLetterIndex(prevWordIndex, prevWordLength)
          );
          
          if (spaceIndex >= 0) {
            return prev.filter((_, index) => index !== spaceIndex);
          }
          return prev;
        });
        
        setCurrentWordIndex(prevWordIndex);
        setCurrentLetterIndex(prevWordLength);
      }
    } else if (ALPHABET.includes(key)) {
      const expectedLetter = currentWord[currentLetterIndex];
      const correct = key === expectedLetter;
      
      // Check if there's already an incorrect attempt at this position
      const existingTypedLetter = typedLetters[currentGlobalIndex];
      
      if (correct) {
        // Insert the correctly typed letter at the appropriate global index
        setTypedLetters(prev => {
          const newTypedLetters = [...prev];
          
          // If there was a previous incorrect attempt, store both the incorrect and correct letters
          if (existingTypedLetter && !existingTypedLetter.correct) {
            // Keep the incorrect attempt but add the correct letter and advance
            newTypedLetters[currentGlobalIndex] = { 
              char: expectedLetter, 
              correct: true,
              previousAttempts: [...(existingTypedLetter.previousAttempts || []), existingTypedLetter.char]
            };
          } else {
            // No previous incorrect attempt, just add the correct letter
            newTypedLetters[currentGlobalIndex] = { char: expectedLetter, correct: true };
          }
          return newTypedLetters;
        });
        setCurrentLetterIndex(prev => prev + 1);
      } else {
        // Insert the incorrectly typed letter at the appropriate global index
        // Mark as incorrect but don't advance to next letter
        setTypedLetters(prev => {
          const newTypedLetters = [...prev];
          
          // If there's already an incorrect attempt, add to previousAttempts array
          if (existingTypedLetter && !existingTypedLetter.correct) {
            newTypedLetters[currentGlobalIndex] = {
              char: key,
              correct: false,
              previousAttempts: [...(existingTypedLetter.previousAttempts || []), existingTypedLetter.char]
            };
          } else {
            newTypedLetters[currentGlobalIndex] = { char: key, correct: false };
          }
          return newTypedLetters;
        });
        setErrors(prev => prev + 1);
        // We don't increment currentLetterIndex here so user must type the correct letter
      }
    }

    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const wpm = Math.round((keystrokes / 5) / elapsedMinutes);
        setSpeed(wpm);
        const acc = Math.round(((keystrokes - errors) / keystrokes) * 100);
        setAccuracy(acc);
        setScore(Math.round(wpm * (acc / 100)));
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyGoal', JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  const practicePageProps = {
    inputRef, handleKeyDown, speed, accuracy, score, learningRate, lastSpeed, topSpeed, lessonAccuracy,
    selectedKeys, toggleKey, currentKey, selectCurrentKey, toggleAllKeys, dailyGoal, words, currentWordIndex,
    currentLetterIndex, typedLetters, startTime, setDailyGoal, setWords, setCurrentWordIndex, setCurrentLetterIndex,
    setTypedLetters, setStartTime, setEndTime, setKeystrokes, setErrors, setSpeed, setAccuracy, setScore
  };

  return (
    <>
      {location.pathname !== '/' && <SideNavbar openLoginModal={openLoginModal} />}
      <TopRightAuth openLoginModal={openLoginModal} />
      <AuthModal isOpen={showLoginModal} onClose={closeLoginModal} />
      <div className={`${location.pathname !== '/' ? 'pl-0' : ''}`}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/practice" /> : <HomePage openLoginModal={openLoginModal} />} />
          <Route path="/practice" element={isLoggedIn ? <PracticePage {...practicePageProps} /> : <Navigate to="/" />} />
          <Route path="/user" element={isLoggedIn ? <UserPage /> : <Navigate to="/" />} />
          <Route path="/leaderboard" element={isLoggedIn ? <LeaderboardPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;