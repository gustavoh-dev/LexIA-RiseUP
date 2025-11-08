import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

import dadosConstituicaoProcessados from './utils/processaConstituicao'; 

import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import CommonSearches from './components/CommonSearches';
import Saved from './components/Saved';
import Info from './components/Info';
import Contact from './components/Contact';
import SearchResults from './components/SearchResults';
import FullArticle from './components/FullArticle'; 

const fuseOptions = {
  keys: [
    'titulo_estrutura',  
    'capitulo_estrutura',
    'artigo_numero',     
    'texto_caput',       
    'texto_completo'
  ],
  includeScore: true,
  threshold: 0.3, // Mantém a tolerância que ajustamos
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [fuzzyResults, setFuzzyResults] = useState([]); 
  const [selectedArticle, setSelectedArticle] = useState(null); 
  const [fuseInstance, setFuseInstance] = useState(null); 

  useEffect(() => {
      const fuse = new Fuse(dadosConstituicaoProcessados, fuseOptions);
      setFuseInstance(fuse);
  }, []);

  const executeSearch = useCallback((query) => {
    if (query.trim() && fuseInstance) {
      const results = fuseInstance.search(query.trim());
      setFuzzyResults(results);
      setActiveSection('search-results');
    }
  }, [fuseInstance]); 

  useEffect(() => {
    if (searchQuery.trim()) {
        executeSearch(searchQuery);
    }
  }, [searchQuery, executeSearch]); 

  const handleNavigate = (section) => {
    setSelectedArticle(null); 
    
    if (section === 'home') {
        setSearchQuery(""); 
    }
    
    setActiveSection(section);
  };
  
  const handleShowFullText = (article) => {
      setSelectedArticle(article);
      setActiveSection('full-article'); 
  };

  const handleNewSearch = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const handlePrepareSearch = (newQuery) => {
    setSearchQuery(newQuery);
    setActiveSection('home');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'common-searches':
        return (
            <CommonSearches 
                onNavigate={handleNavigate} 
                setSearchQuery={handlePrepareSearch} 
            />
        );
      case 'saved':
        return (
            <Saved 
                onShowFullText={handleShowFullText}
            />
        );
      case 'info':
        return <Info />;
      case 'contact':
        return <Contact />;
      case 'search-results':
        return (
          <SearchResults 
            setSearchQuery={handleNewSearch} 
            setActiveSection={setActiveSection} 
            fuzzyResults={fuzzyResults}
            initialQuery={searchQuery}
            onShowFullText={handleShowFullText} 
          />
        );
      case 'full-article':
        return (
            <FullArticle 
                article={selectedArticle} 
                onNavigate={handleNavigate}
            />
        );
      case 'home':
      default:
        return (
          <MainContent 
            setSearchQuery={handleNewSearch} 
            setActiveSection={setActiveSection}
            initialQuery={searchQuery} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={handleNavigate} />
      <div className="flex-grow">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default App;