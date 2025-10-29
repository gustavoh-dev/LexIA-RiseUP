import React, { useState } from 'react';

// 1. Importar todos os nossos componentes
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import CommonSearches from './components/CommonSearches';
import Saved from './components/Saved';
import Info from './components/Info';
import Contact from './components/Contact';
import SearchResults from './components/SearchResults';

// 2. Colar a lógica principal do App
const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={handleNavigate} />
      <div className="flex-grow">
        {activeSection === 'common-searches' ? <CommonSearches /> :
          activeSection === 'saved' ? <Saved /> :
          activeSection === 'info' ? <Info /> :
          activeSection === 'contact' ? <Contact /> :
          activeSection === 'search-results' ? <SearchResults setSearchQuery={setSearchQuery} setActiveSection={setActiveSection} /> :
            <MainContent setSearchQuery={setSearchQuery} setActiveSection={setActiveSection} />}
      </div>
      <Footer />
    </div>
  );
};

export default App;