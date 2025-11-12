import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

// Usando o placeholder que criamos acima
import dadosConstituicaoProcessados from './utils/processaConstituicao'; 

// Usando os componentes placeholder
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

  // --- NOVOS ESTADOS PARA O RESUMO DA IA ---
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  // ----------------------------------------

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

  // --- NOVA FUNÇÃO PARA CHAMAR O BACKEND DE RESUMO ---
  // ATENÇÃO: Esta função vai falhar aqui na visualização porque
  // não temos o backend real rodando na porta 5001.
  // Mas no SEU computador vai funcionar!
  const handleSummarizeArticle = async (articleText) => {
    setIsSummarizing(true);
    setSummary('');
    setSummaryError(null);

    try {
      // SIMULAÇÃO PARA TESTE VISUAL (Remova isso no seu código real)
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // setSummary("Este é um resumo SIMULADO para você ver como fica na tela. No seu app real, aqui aparecerá o texto gerado pelo Gemini vindo do seu backend.");
      // setIsSummarizing(false);
      // return;
      // ------------------------------------------------------------

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
      // Mensagem de erro mais amigável para o teste visual aqui
      setSummaryError("Não foi possível conectar ao servidor local (localhost:5001). Certifique-se de que seu backend está rodando.");
    } finally {
      setIsSummarizing(false);
    }
  };
  // ---------------------------------------------------

  const handleNavigate = (section) => {
    setSelectedArticle(null); 
    
    // Limpa os estados do resumo ao navegar
    setSummary('');
    setSummaryError(null);
    
    if (section === 'home') {
        setSearchQuery(""); 
    }
    
    setActiveSection(section);
  };
  
  const handleShowFullText = (article) => {
      setSelectedArticle(article);
      // Garante que começa limpo ao abrir um novo artigo
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
                // Passando as novas props para o FullArticle
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