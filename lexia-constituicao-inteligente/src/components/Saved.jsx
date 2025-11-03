import React, { useState } from 'react';

const SAVED_ITEMS_KEY = 'savedLexiaItems';

const getSavedItemsArray = () => {
  const savedData = localStorage.getItem(SAVED_ITEMS_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

const Saved = () => {

  const [savedItems, setSavedItems] = useState(getSavedItemsArray);

  const toggleSave = (id) => {

    const newSavedArray = savedItems.filter(item => item.id !== id);

    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(newSavedArray));

    setSavedItems(newSavedArray);
  };
  
  const hasSavedItems = savedItems.length > 0;

  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-4xl px-6">
        <div className="search-header">
          <i className="fas fa-save search-header-icon" style={{ fontSize: '40px' }}></i>
          Salvos:
        </div>
        {/* Renderização condicional: Mostra esta mensagem se 'hasSavedItems' for 'false' (lista vazia) */}
        {!hasSavedItems && (
          <p className="text-center text-gray-500" style={{ marginTop: '1rem' }}>
            Você ainda não salvou nenhum item.
          </p>
        )}
        <div className="card-grid">
          {/* Renderização condicional: Renderiza os cards apenas se 'hasSavedItems' for 'true' */}
          {hasSavedItems && savedItems.map((item) => (
            <div className="search-card" key={item.id}>
              <div className="card-header">
                <div className="card-title">{item.title}</div>
                <button className="save-btn saved" onClick={() => toggleSave(item.id)}>
                  <i className="fas fa-bookmark"></i>
                </button>
              </div>
              <div className="legal-base">Base legal: {item.base}</div>
              <div className="summary">Resumo: {item.summary}</div>
              <div className="card-actions">
                <button className="summarize-btn" onClick={() => { /* Funcionalidade futura */ }}>Resumir com IA</button>
                <a href="#" className="view-full">Ver completo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Saved;