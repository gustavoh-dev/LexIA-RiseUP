import React, { useState, useEffect } from 'react';

const MainContent = ({ setSearchQuery, setActiveSection, initialQuery = "" }) => {

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query); 
    }
  };

  return (
    <main className="relative bg-blue-700 text-white min-h-screen flex flex-col items-center justify-center mt-16">
      <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-top opacity-100"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-bold text-white mb-4 text-shadow-custom">Constituição Inteligente</h1>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Busque e entenda a Constituição Federal"
            className="p-2 rounded-lg text-black w-96 focus:outline-none focus:ring-2 focus:ring-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            aria-label="Campo de busca da Constituição"
          />
          <button
           
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-100 ease-out active:scale-97 active:brightness-90"
            onClick={handleSearch}
            aria-label="Buscar na Constituição"
          >
            Buscar
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;