import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

import dadosConstituicaoProcessados from './utils/processaConstituicao';
import { APP_CONFIG } from './config';

import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import CommonSearches from './components/CommonSearches';
import Saved from './components/Saved';
import Info from './components/Info';
import Contact from './components/Contact';
import SearchResults from './components/SearchResults';
import FullArticle from './components/FullArticle';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { useScrollToTop } from './hooks/useScrollToTop';
// 1. Importações Novas
import { useSearchHistory } from './hooks/useSearchHistory';
import History from './components/History';
import { FullScreenSpinner } from './components/Spinner';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [fuzzyResults, setFuzzyResults] = useState([]); 
  const [selectedArticle, setSelectedArticle] = useState(null); 
  const [fuseInstance, setFuseInstance] = useState(null); 

 
  const [isLoadingApp, setIsLoadingApp] = useState(true); 

  
  const { addSearchToHistory } = useSearchHistory();
  
  const toast = useToast();
  
  useScrollToTop(activeSection);

  useEffect(() => {
    const fuse = new Fuse(dadosConstituicaoProcessados, APP_CONFIG.FUSE_OPTIONS);
    setFuseInstance(fuse);
  
    setIsLoadingApp(false); 

 

  }, []);

  const executeSearch = useCallback((query) => {
    if (query.trim() && fuseInstance) {
     
      addSearchToHistory(query.trim());
      const results = fuseInstance.search(query.trim());
      setFuzzyResults(results);
      setActiveSection('search-results');
    }
  }, [fuseInstance, addSearchToHistory]); 

  useEffect(() => {
    if (searchQuery.trim()) {
        executeSearch(searchQuery);
    }
  }, [searchQuery, executeSearch]); 

  
  const handleNavigate = useCallback((section) => {
    setSelectedArticle(null);

    if (section === 'home') {
      setSearchQuery("");
    }
    
    setActiveSection(section);
  }, []);
  
  const handleShowFullText = useCallback((article) => {
  
    setSelectedArticle(article);

    setActiveSection('full-article');
  }, []);
  
  const handleNewSearch = useCallback((newQuery) => {
    setSearchQuery(newQuery);
  }, []);
  
  const handlePrepareSearch = useCallback((newQuery) => {
    setSearchQuery(newQuery);
    setActiveSection('home');
  }, []);

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
      case 'history':
        return (
          <History
            onNavigate={handleNavigate}
            setSearchQuery={handleNewSearch} 
          />
        );
      case 'search-results':
        return (
          <SearchResults 
            fuzzyResults={fuzzyResults}
            initialQuery={searchQuery}
            setSearchQuery={handleNewSearch}
            setActiveSection={setActiveSection}
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
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        {isLoadingApp && <FullScreenSpinner message="Preparando busca..." />}
        <Header onNavigate={handleNavigate} />
        <div className="flex-grow">
          {renderContent()}
        </div>
        <Footer />
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    </ErrorBoundary>
  );
};

export default App;