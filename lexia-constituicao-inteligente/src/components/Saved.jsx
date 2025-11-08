import React, { useState } from 'react';

const SAVED_ITEMS_KEY = 'savedLexiaItems';

const getSavedItemsArray = () => {
  const savedData = localStorage.getItem(SAVED_ITEMS_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

/**
 * Componente para exibir itens salvos.
 * @param {function} onShowFullText
 */
const Saved = ({ onShowFullText }) => {

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
        
        {!hasSavedItems && (
          <p className="text-center text-gray-500" style={{ marginTop: '1rem' }}>
            Você ainda não salvou nenhum item.
          </p>
        )}
        <div className="card-grid">
          
          {hasSavedItems && savedItems.map((item) => (
            <div className="search-card" key={item.id}>
              <div className="card-header">
                 <div 
                    className="card-title"
                    dangerouslySetInnerHTML={{ __html: `<strong>${item.artigo_numero || item.base}</strong> - ${item.capitulo_estrutura || item.titulo}` }}
                />
                <button className="save-btn saved" onClick={() => toggleSave(item.id)}>
                  <i className="fas fa-bookmark"></i>
                </button>
              </div>
              <div className="legal-base">
                    Base legal: Art. 
                    <span dangerouslySetInnerHTML={{ __html: `<strong>${(item.artigo_numero || item.base).replace('Art. ', '').trim()}</strong>` }} />
                </div>
              <div className="summary">Resumo: {item.texto_caput || item.summary}</div>
              <div className="card-actions">
                <button className="summarize-btn" onClick={() => { /* Funcionalidade futura */ }}>Resumir com IA</button>
                {/* 🚨 NOVO CÓDIGO: Conecta o clique à função onShowFullText */}
                <a 
                    href="#" 
                    className="view-full"
                    onClick={(e) => { e.preventDefault(); onShowFullText(item); }}
                >
                    Ver completo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Saved;