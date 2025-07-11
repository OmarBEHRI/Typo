import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LanguageSelectionComponent = ({ onSelectLanguage, onSelectLesson }) => {
  const [languages, setLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        // This will be replaced with actual API calls if needed in the future
        const languageModules = import.meta.glob('../data/programming_languages/*.json');
        const languageData = [];
        
        for (const path in languageModules) {
          const module = await languageModules[path]();
          languageData.push({
            id: path.split('/').pop().replace('.json', ''),
            name: module.default ? module.default.name : module.name,
            description: module.default ? module.default.description : module.description
          });
        }
        
        setLanguages(languageData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading language data:', err);
        setError('Failed to load programming languages');
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageSelect = async (languageId) => {
    try {
      setLoading(true);
      // Load the selected language data
      const module = await import(`../data/programming_languages/${languageId}.json`);
      const languageData = module.default || module;
      
      setSelectedLanguage(languageData);
      onSelectLanguage(languageData);
      setLoading(false);
    } catch (err) {
      console.error(`Error loading language ${languageId}:`, err);
      setError(`Failed to load ${languageId} language data`);
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    onSelectLesson(lesson);
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-text-highlight mb-6">Programming Language Practice</h2>
      
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search languages..."
          className="w-full p-3 bg-light-gray text-text-normal border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-normal">Loading languages...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div>
          {!selectedLanguage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLanguages.map((language) => (
                <motion.div
                  key={language.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-light-gray p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleLanguageSelect(language.id)}
                >
                  <h3 className="text-xl font-semibold text-text-highlight mb-2">{language.name}</h3>
                  <p className="text-text-normal text-sm">{language.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedLanguage(null)}
                  className="mr-4 text-accent hover:text-accent-dark transition-colors duration-200"
                >
                  ← Back to languages
                </button>
                <h3 className="text-xl font-semibold text-text-highlight">{selectedLanguage.name} Lessons</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLanguage.lessons.map((lesson, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-light-gray p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <h4 className="text-lg font-medium text-text-highlight mb-2">{lesson.title}</h4>
                    <p className="text-text-normal text-sm">{lesson.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelectionComponent;