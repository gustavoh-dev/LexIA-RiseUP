import React, { useState, useEffect } from 'react';

const SAVED_ITEMS_KEY = 'savedLexiaItems';
const MAX_SUMMARY_LENGTH = 250; 

const getSavedItemsArray = () => {
  const savedData = localStorage.getItem(SAVED_ITEMS_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
        return text;
    }
    const trimmedString = text.substring(0, maxLength);
    return trimmedString.substring(0, trimmedString.lastIndexOf(' ')) + '...';
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
          Resultados para: **"{initialQuery}"**         </div>
        <div className="card-grid">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className="search-card">
                <div className="card-header">
                  <div 
                        className="card-title"
                        dangerouslySetInnerHTML={{ __html: `<strong>${result.artigo_numero}</strong> - ${result.capitulo_estrutura || result.titulo_estrutura}` }}
                    />
                  <button className={`save-btn ${savedStates[result.id] ? 'saved' : ''}`} onClick={() => toggleSave(result.id)}>
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
                <div className="legal-base">
                    Base legal: Art. 
                    <span dangerouslySetInnerHTML={{ __html: `<strong>${result.artigo_numero.replace('Art. ', '').trim()}</strong>` }} />
                </div> 
                {/* O Resumo usará agora apenas o texto_caput, que é o campo mais confiável para o resumo */}
                <div className="summary">Resumo: {truncateText(result.texto_caput, MAX_SUMMARY_LENGTH)}</div>
                <div className="card-actions">
                  <button className="summarize-btn">Resumir com IA</button>
                  <a href="#" className="view-full" onClick={(e) => { e.preventDefault(); handleViewFull(result); }}>Ver completo</a>
                </div>
              </div>
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