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
  threshold: 0.3, 
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [fuzzyResults, setFuzzyResults] = useState([]); 
  const [selectedArticle, setSelectedArticle] = useState(null); 
  const [fuseInstance, setFuseInstance] = useState(null); 


  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

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

 
  const handleSummarizeArticle = async (articleText) => {
    setIsSummarizing(true);
    setSummary('');
    setSummaryError(null);

    try {
  

      const response = await fetch('http://localhost:5001/api/resumir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoArtigo: articleText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao gerar resumo.');
      }

      setSummary(data.resumo);

    } catch (error) {
      console.error("Erro no resumo:", error);
 
      setSummaryError("Não foi possível conectar ao servidor local (localhost:5001). Certifique-se de que seu backend está rodando.");
    } finally {
      setIsSummarizing(false);
    }
  };


  const handleNavigate = (section) => {
    setSelectedArticle(null); 
    
  
    setSummary('');
    setSummaryError(null);
    
    if (section === 'home') {
        setSearchQuery(""); 
    }
    
    setActiveSection(section);
  };
  
  const handleShowFullText = (article) => {
      setSelectedArticle(article);

      setSummary('');
      setSummaryError(null);
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
            fuzzyResults={fuzzyResults}
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
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header onNavigate={handleNavigate} />
      <div className="flex-grow">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default App;