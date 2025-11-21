import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchCard from './SearchCard';
import { useSavedItems } from '../hooks/useLocalStorage';
import { APP_CONFIG } from '../config';
import { useToast } from '../hooks/useToast';
import { ResultsSkeleton } from './LoadingSkeleton';
import { buscarArtigosInteligente } from '../services/ApiService';

const SearchResults = ({ fuzzyResults = [], initialQuery = "", setSearchQuery, setActiveSection, onShowFullText }) => {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternalSearching, setIsInternalSearching] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const { isItemSaved, toggleItem } = useSavedItems();
  const toast = useToast();

  const results = useMemo(() => {
    const rawResults = fuzzyResults.map(r => r.item || r);
    const q = (initialQuery || "").toLowerCase().trim();
    const matchesNumeros = q.match(/(\d+)/g);

    if (matchesNumeros && matchesNumeros.length > 0) {
        const numerosBuscados = matchesNumeros.map(n => parseInt(n, 10));
        const exatos = rawResults.filter(item => {
            if (!item.artigo_numero) return false;
            const numeroDoItem = parseInt(item.artigo_numero.toString().replace(/\D/g, ''), 10);
            return numerosBuscados.includes(numeroDoItem);
        });
        return exatos;
    }
    return rawResults;
  }, [fuzzyResults, initialQuery]);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);
  useEffect(() => { setCurrentPage(1); setExpandedCardId(null); }, [fuzzyResults]);

  const handleSearch = useCallback(async () => {
    if (query.trim() && setSearchQuery) {
      
      const regexArtigo = /^(?:artigo|art|art\.)?\s*(\d+)\s*$/i;
      const match = query.match(regexArtigo);

      if (match) {
        const numeroArtigo = match[1]; 
        const termoFormatado = `Art. ${numeroArtigo}`;
        setSearchQuery(termoFormatado);
        return; 
      }
      setIsInternalSearching(true);
      try {
        const resultado = await buscarArtigosInteligente(query);
        
        if (resultado.tipo === 'direta') {
             setSearchQuery(resultado.termo);
        }
        else if (resultado.tipo === 'tema' && resultado.artigos.length > 0) {
             const stringDeBusca = resultado.artigos.map(a => `Art. ${a}`).join(' ');
             setSearchQuery(stringDeBusca);
        }
        else {
             setSearchQuery(query);
        }
      } catch (error) {
        console.error("Erro search results:", error);
        setSearchQuery(query);
      } finally {
        setIsInternalSearching(false);
      }
    }
  }, [query, setSearchQuery]);

  const handleToggleSave = useCallback((item) => {
    const isNowSaved = toggleItem(item);
    isNowSaved ? toast.success('Artigo salvo!') : toast.info('Removido dos salvos');
  }, [toggleItem, toast]);

  const handleViewFull = useCallback((item) => {
    if (onShowFullText) onShowFullText(item);
  }, [onShowFullText]);

  const handleExpandCard = useCallback((item) => {
    setExpandedCardId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToList = useCallback((item) => {
    setExpandedCardId(null);
  }, []);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(results.length / APP_CONFIG.ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * APP_CONFIG.ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - APP_CONFIG.ITEMS_PER_PAGE;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    return { totalPages, currentItems };
  }, [results, currentPage]);

  const { totalPages, currentItems } = paginationData;

  const itemsToDisplay = expandedCardId ? results.filter(r => r.id === expandedCardId) : currentItems;

  const handlePreviousPage = useCallback(() => { setCurrentPage(prev => Math.max(prev - 1, 1)); }, []);
  const handleNextPage = useCallback(() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); }, [totalPages]);
  const handlePageClick = useCallback((pageNumber) => { setCurrentPage(pageNumber); }, []);

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= APP_CONFIG.MAX_VISIBLE_PAGES) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const halfWindow = Math.floor(APP_CONFIG.MAX_VISIBLE_PAGES / 2);
    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, currentPage + halfWindow);
    if (currentPage - halfWindow < 1) endPage = APP_CONFIG.MAX_VISIBLE_PAGES;
    if (currentPage + halfWindow > totalPages) startPage = totalPages - APP_CONFIG.MAX_VISIBLE_PAGES + 1;
    if (endPage - startPage + 1 < APP_CONFIG.MAX_VISIBLE_PAGES) {
      if (startPage === 1) endPage = Math.min(totalPages, startPage + APP_CONFIG.MAX_VISIBLE_PAGES - 1);
      else if (endPage === totalPages) startPage = Math.max(1, endPage - APP_CONFIG.MAX_VISIBLE_PAGES + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
   }, [totalPages, currentPage]);

  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-7xl px-6">
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCardId ? 'max-h-0 opacity-0' : 'max-h-[300px] opacity-100'}`}>
            <div className="welcome-header">Bem vindo(a)!</div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <input
                type="text"
                
                placeholder="continue buscando e entendendo a constituição!"
               
                className="p-2 rounded-lg text-black w-96 placeholder-gray-500 border border-gray-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                disabled={isInternalSearching}
              />
              <button 
                className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition-colors min-w-[80px]" 
                onClick={handleSearch}
                disabled={isInternalSearching}
              >
                {isInternalSearching ? <i className="fas fa-spinner fa-spin"></i> : "Buscar"}
              </button>
            </div>
            <div className="search-header">
              <i className="fas fa-search search-header-icon" style={{ fontSize: '40px' }}></i>
              Resultados para: <strong>{initialQuery}</strong>
            </div>
        </div>

        {expandedCardId && (
           <button onClick={handleBackToList} className="mb-4 flex items-center text-blue-700 hover:text-blue-900 font-medium transition-colors animate-fade-in">
             <i className="fas fa-arrow-left mr-2"></i> Voltar para resultados
           </button>
        )}

        {isInternalSearching ? (
           <ResultsSkeleton count={3} />
        ) : (
            results.length === 0 ? (
                 <div className="col-span-full">
                   <div className="search-card text-center py-12">
                     <h3 className="text-xl font-bold mb-2">Nenhum resultado encontrado</h3>
                     <p>Não encontramos os artigos exatos para sua busca.</p>
                   </div>
                </div>
            ) : (
                <div className={`grid gap-6 transition-all duration-500 ease-in-out ${expandedCardId ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {itemsToDisplay.map((result) => (
                        <SearchCard
                        key={result.id}
                        result={result}
                        isSaved={isItemSaved(result.id)}
                        onToggleSave={() => handleToggleSave(result)}
                        onViewFull={handleViewFull}
                        onExpand={handleExpandCard}
                        isFullView={!!expandedCardId}
                        />
                    ))}
                </div>
            )
        )}
        
        {!expandedCardId && results.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
             <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}>&lt;</button>
             {visiblePageNumbers.map(pageNumber => (
               <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${currentPage === pageNumber ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{pageNumber}</button>
             ))}
             <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}>&gt;</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;