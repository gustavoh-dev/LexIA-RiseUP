import React, { useState, useEffect } from 'react';
import { buscarArtigosInteligente } from '../services/ApiService';

const MainContent = ({ setSearchQuery, setActiveSection, initialQuery = "", onSmartSearch }) => {

  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const triggerExitAnimation = (callback) => {
    setIsExiting(true);
    setTimeout(() => {
      callback();
    }, 500);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    const regexArtigo = /^(?:artigo|art|art\.)?\s*(\d+)\s*$/i;
    const match = query.match(regexArtigo);

    if (match) {
      const numeroArtigo = match[1]; 
      const termoFormatado = `Art. ${numeroArtigo}`;
      triggerExitAnimation(() => setSearchQuery(termoFormatado));
      return; 
    }

    setIsSearching(true);

    try {
      const resultado = await buscarArtigosInteligente(query);

      if (resultado.tipo === 'direta') {
        triggerExitAnimation(() => setSearchQuery(resultado.termo));
      } 
      else if (resultado.tipo === 'tema' && resultado.artigos.length > 0) {
        if (onSmartSearch) {
              triggerExitAnimation(() => onSmartSearch(resultado.artigos));
        } else {
              const stringDeBusca = resultado.artigos.map(a => `Art. ${a}`).join(' ');
              triggerExitAnimation(() => setSearchQuery(stringDeBusca));
        }
      } 
      else {
        triggerExitAnimation(() => setSearchQuery(query));
      }

    } catch (error) {
      console.error("Erro na busca:", error);
      triggerExitAnimation(() => setSearchQuery(query));
    } finally {
      if (!isExiting) setIsSearching(false);
    }
  };

  return (
    <main className="relative bg-blue-700 text-white min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-top opacity-100"></div>
      
      <div 
        className={`relative z-10 text-center transition-all duration-700 ease-in-out transform w-full max-w-4xl
          ${isExiting 
            ? 'opacity-0 -translate-y-10 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
          }`}
      >
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 md:mb-8 text-shadow-custom">
            Constituição Inteligente
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 w-full">
          <input
            type="text"
            placeholder="Busque e entenda a Constituição Federal"
            className="p-3 md:p-2 rounded-lg text-black w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-white transition-shadow duration-300 text-lg md:text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            aria-label="Campo de busca da Constituição"
            disabled={isSearching || isExiting}
          />
          
          <button
            className="bg-blue-700 text-white p-3 md:p-2 rounded-lg hover:bg-gray-800 transition duration-100 ease-out active:scale-97 active:brightness-90 w-full md:w-auto min-w-[100px] font-medium"
            onClick={handleSearch}
            aria-label="Buscar na Constituição"
            disabled={isSearching || isExiting}
          >
            {isSearching ? (
                <span><i className="fas fa-spinner fa-spin mr-2"></i> IA...</span>
            ) : (
                "Buscar"
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;