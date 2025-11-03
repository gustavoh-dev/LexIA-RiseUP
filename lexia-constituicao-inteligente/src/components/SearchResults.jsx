import React, { useState } from 'react';

const SAVED_ITEMS_KEY = 'savedLexiaItems';

const getSavedItemsArray = () => {
  const savedData = localStorage.getItem(SAVED_ITEMS_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

const SearchResults = ({ setSearchQuery, setActiveSection }) => {
  const [query, setQuery] = useState("");

  const [results] = useState([
    { id: 1, title: "Direitos e Deveres Individuais e Coletivos", base: "Art. 5º - Direitos e Deveres Individuais e Coletivos", summary: "Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade..." },
    { id: 2, title: "Princípios Fundamentais", base: "Art. 1º - Princípios Fundamentais", summary: "A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos: I - a soberania; II - a cidadania..." },
    { id: 3, title: "Objetivos Fundamentais", base: "Art. 3º - Objetivos Fundamentais", summary: "Constituem objetivos fundamentais da República Federativa do Brasil: I - construir uma sociedade livre, justa e solidária; II - garantir o desenvolvimento nacional; III - erradicar a pobreza..." },
  ]);

  const getInitialSavedStates = () => {

    const savedItems = getSavedItemsArray();
    
    const savedStatesObject = {};
    savedItems.forEach(item => {
      savedStatesObject[item.id] = true;
    });
    return savedStatesObject;
  };

  const [savedStates, setSavedStates] = useState(getInitialSavedStates);

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

  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.base.toLowerCase().includes(query.toLowerCase()) ||
    result.summary.toLowerCase().includes(query.toLowerCase())
  );

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
          Resultados: "{query || 'Nenhum termo pesquisado'}"
        </div>
        <div className="card-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div key={result.id} className="search-card">
                <div className="card-header">
                  <div className="card-title">{result.title}</div>
                  <button className={`save-btn ${savedStates[result.id] ? 'saved' : ''}`} onClick={() => toggleSave(result.id)}>
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
                <div className="legal-base">Base legal: {result.base}</div>
                <div className="summary">Resumo: {result.summary}</div>
                <div className="card-actions">
                  <button className="summarize-btn">Resumir com IA</button>
                  <a href="#" className="view-full">Ver completo</a>
                </div>
              </div>
            ))
          ) : (
            <div className="search-card">
              <div className="summary">Nenhum resultado encontrado para "{query}".</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchResults;