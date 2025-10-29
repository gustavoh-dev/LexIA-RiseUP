import React, { useState } from 'react';

// Note a mudança no caminho da imagem de fundo
const MainContent = ({ setSearchQuery, setActiveSection }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      setActiveSection('search-results');
    }
  };

  return (
    <main className="relative bg-blue-700 text-white min-h-screen flex flex-col items-center justify-center mt-16">
      <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-top opacity-100"></div>
      <div className="relative z-10 text-center">    
        <h1 className="text-7xl font-bold text-white mb-4 text-shadow-custom">Constituição Inteligente</h1>
        <p className="text-3xl slogan-contornado mb-6 text-shadow-custom">Busque e entenda a Constituição Federal</p>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Coloque aqui sua dúvida"
            className="p-2 rounded-lg text-black w-64 placeholder-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-black text-white p-2 rounded-lg" onClick={handleSearch}>Buscar</button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;