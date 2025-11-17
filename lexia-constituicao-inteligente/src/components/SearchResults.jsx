import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchCard from './SearchCard';
import { useSavedItems } from '../hooks/useLocalStorage';
import { APP_CONFIG } from '../config';
import { useToast } from '../hooks/useToast';
import { ResultsSkeleton } from './LoadingSkeleton';

const SearchResults = ({ fuzzyResults = [], initialQuery = "", setSearchQuery, setActiveSection, onShowFullText }) => {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const { isItemSaved, toggleItem } = useSavedItems();
  const toast = useToast();


  const results = useMemo(() => {
    const rawResults = fuzzyResults.filter(r => r.item);
    return rawResults.map(result => ({
      ...result.item,
      score: result.score
    }));
  }, [fuzzyResults]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(false);
  }, [fuzzyResults]);

  const handleSearch = useCallback(() => {
    if (query.trim() && setSearchQuery) {
      setIsSearching(true);
      setSearchQuery(query);
 
      setTimeout(() => setIsSearching(false), 500);
    }
  }, [query, setSearchQuery]);

  const handleToggleSave = useCallback((item) => {
    const isNowSaved = toggleItem(item);
    if (isNowSaved) {
      toast.success('Artigo salvo com sucesso!');
    } else {
      toast.info('Artigo removido dos salvos');
    }
  }, [toggleItem, toast]);

  const handleViewFull = useCallback((item) => {
    if (onShowFullText) {
      onShowFullText(item);
    }
  }, [onShowFullText]);


  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(results.length / APP_CONFIG.ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * APP_CONFIG.ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - APP_CONFIG.ITEMS_PER_PAGE;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    return { totalPages, currentItems };
  }, [results, currentPage]);

  const { totalPages, currentItems } = paginationData;

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePageClick = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);


  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= APP_CONFIG.MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfWindow = Math.floor(APP_CONFIG.MAX_VISIBLE_PAGES / 2);
    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, currentPage + halfWindow);

    if (currentPage - halfWindow < 1) {
      endPage = APP_CONFIG.MAX_VISIBLE_PAGES;
    }

    if (currentPage + halfWindow > totalPages) {
      startPage = totalPages - APP_CONFIG.MAX_VISIBLE_PAGES + 1;
    }

    if (endPage - startPage + 1 < APP_CONFIG.MAX_VISIBLE_PAGES) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + APP_CONFIG.MAX_VISIBLE_PAGES - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - APP_CONFIG.MAX_VISIBLE_PAGES + 1);
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [totalPages, currentPage]);
  
  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-4xl px-6">
        <div className="welcome-header">Bem vindo(a)!</div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Digite sua dúvida"
            className="p-2 rounded-lg text-black w-64 placeholder-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            aria-label="Campo de busca"
          />
          <button 
            className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition-colors" 
            onClick={handleSearch}
            aria-label="Buscar artigos"
          >
            Buscar
          </button>
        </div>
        <div className="search-header">
          <i className="fas fa-search search-header-icon" style={{ fontSize: '40px' }}></i>
          Resultados para: <strong>{initialQuery}</strong>
        </div>

        {isSearching && results.length === 0 ? (
          <ResultsSkeleton count={6} />
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.length > 0 ? (
              currentItems.map((result) => (
                <SearchCard
                  key={result.id}
                  result={result}
                  isSaved={isItemSaved(result.id)}
                  onToggleSave={() => handleToggleSave(result)}
                  onViewFull={handleViewFull}
                />
              ))
            ) : (
              results.length === 0 && (
                <div className="col-span-full">
                  <div className="search-card text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-600">
                      Não encontramos resultados para "<strong>{initialQuery}</strong>".
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Tente usar termos diferentes ou verifique a ortografia.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              aria-label="Página anterior"
              className={`
                p-2 rounded-lg w-10 h-10 flex items-center justify-center
                ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
                }
              `}
            >
              &lt;
            </button>

            {visiblePageNumbers.map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                aria-label={`Ir para página ${pageNumber}`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
                className={`
                  p-2 rounded-lg w-10 h-10 flex items-center justify-center
                  ${currentPage === pageNumber
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                  }
                `}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
              className={`
                p-2 rounded-lg w-10 h-10 flex items-center justify-center
                ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
                }
              `}
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default SearchResults;