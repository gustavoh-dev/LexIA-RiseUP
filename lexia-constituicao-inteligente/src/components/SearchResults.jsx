import React, { useState, useEffect } from 'react';
import SearchCard from './SearchCard'; 

const SAVED_ITEMS_KEY = 'savedLexiaItems';

const getSavedItemsArray = () => {
  const savedData = localStorage.getItem(SAVED_ITEMS_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

const SearchResults = ({ fuzzyResults = [], initialQuery = "", setSearchQuery, setActiveSection, onShowFullText }) => {
  
  const [query, setQuery] = useState(initialQuery);

  const rawResults = fuzzyResults.filter(r => r.item);
  
  const results = rawResults.map(result => ({
      ...result.item, 
      score: result.score 
  }));

  const getInitialSavedStates = () => {
    const savedItems = getSavedItemsArray();
    const savedStatesObject = {};
    savedItems.forEach(item => {
      savedStatesObject[item.id] = true;
    });
    return savedStatesObject;
  };

  const [savedStates, setSavedStates] = useState(getInitialSavedStates);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query); 
    }
  };

  const toggleSave = (id) => {
    const cardToToggle = results.find(result => result.id === id);
    if (!cardToToggle) return; 

    const currentSaved = getSavedItemsArray();
    const isAlreadySaved = currentSaved.some(item => item.id === id);

    let newSavedArray;
    if (isAlreadySaved) {
      newSavedArray = currentSaved.filter(item => item.id !== id);
    } else {
      newSavedArray = [...currentSaved, cardToToggle];
    }

    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(newSavedArray));

    setSavedStates(prev => ({
      ...prev,
      [id]: !isAlreadySaved
    }));
  };
    
  const handleViewFull = (item) => {
    if (onShowFullText) {
      onShowFullText(item);
    }
  };

  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-4xl px-6">
        <div className="welcome-header">Bem vindo(a)!</div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Digite sua dúvida"
            className="p-2 rounded-lg text-black w-64 placeholder-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-blue-700 text-white p-2 rounded-lg" onClick={handleSearch}>Buscar</button>
        </div>
        <div className="search-header">
          <i className="fas fa-search search-header-icon" style={{ fontSize: '40px' }}></i>
          Resultados para: <strong>"{initialQuery}"</strong>
        </div>
        <div className="card-grid">
          {results.length > 0 ? (
            results.map((result) => (
            
              <SearchCard 
                  key={result.id}
                  result={result}
                  isSaved={savedStates[result.id]}
                  onToggleSave={toggleSave}
                  onViewFull={handleViewFull}
              />
            ))
          ) : (
            <div className="search-card">
              <div className="summary">Nenhum resultado encontrado para "{initialQuery}".</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchResults;