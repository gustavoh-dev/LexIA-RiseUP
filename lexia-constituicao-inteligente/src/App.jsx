import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

import dadosConstituicaoProcessados from './utils/processaConstituicao';
import { APP_CONFIG } from './config';
import { apiService } from './services/api';

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

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [fuzzyResults, setFuzzyResults] = useState([]); 
  const [selectedArticle, setSelectedArticle] = useState(null); 
  const [fuseInstance, setFuseInstance] = useState(null); 

  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  
  const toast = useToast();
  
  // Scroll to top quando muda de seção
  useScrollToTop(activeSection);

  useEffect(() => {
    const fuse = new Fuse(dadosConstituicaoProcessados, APP_CONFIG.FUSE_OPTIONS);
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

 
  const handleSummarizeArticle = useCallback(async (articleText) => {
    setIsSummarizing(true);
    setSummary('');
    setSummaryError(null);

    try {
      const data = await apiService.summarizeArticle(articleText);
      setSummary(data.resumo);
      toast.success('Resumo gerado com sucesso!');
    } catch (error) {
      console.error("Erro no resumo:", error);
      const errorMessage = error.message || "Não foi possível gerar o resumo. Verifique se o backend está rodando.";
      setSummaryError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSummarizing(false);
    }
  }, [toast]);


  const handleNavigate = useCallback((section) => {
    setSelectedArticle(null);
    setSummary('');
    setSummaryError(null);
    
    if (section === 'home') {
      setSearchQuery("");
    }
    
    setActiveSection(section);
  }, []);
  
  const handleShowFullText = useCallback((article) => {
    setSelectedArticle(article);
    setSummary('');
    setSummaryError(null);
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

                onSummarize={handleSummarizeArticle}
                summary={summary}
                isSummarizing={isSummarizing}
                summaryError={summaryError}
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