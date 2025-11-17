import React from 'react';
import { useSearchHistory } from '../hooks/useSearchHistory';

const History = ({ onNavigate, setSearchQuery }) => {
  const { history, clearHistory } = useSearchHistory();

  const handleHistoryClick = (query) => {
    if (setSearchQuery) {
      setSearchQuery(query);
    }
    if (onNavigate) {
      onNavigate('search-results'); 
    }
  };

  const handleClearHistory = () => {
    clearHistory();
  };

 
  const handleExportHistory = () => {
    if (history.length === 0) {
      
      alert("O histórico está vazio. Não há nada para exportar.");
      return;
    }

    
    const jsonString = JSON.stringify(history, null, 2);

  
    const blob = new Blob([jsonString], { type: 'application/json' });

   
    const url = URL.createObjectURL(blob);

  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_buscas.json'; 
    document.body.appendChild(a); 

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-6">
        <button
          className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
          onClick={() => onNavigate('home')}
          aria-label="Voltar ao início"
        >
          <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
          Voltar ao Início
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-2xl text-gray-800 font-bold mb-4">
            Histórico de Busca
          </h1>
          
          {history.length > 0 ? (
            <>
              <ul className="space-y-2">
                {history.map((query, index) => (
                  <li key={index} className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() => handleHistoryClick(query)}
                      className="text-lg text-blue-600 hover:text-blue-800 text-left w-full"
                    >
                      {query}
                    </button>
                  </li>
                ))}
              </ul>
  
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={handleClearHistory}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                >
                  Limpar Histórico
                </button>

                <button
                  onClick={handleExportHistory}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Exportar Histórico (JSON)
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600">Seu histórico de busca está vazio.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default History;