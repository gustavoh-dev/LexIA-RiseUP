import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 20;

export const useSearchHistory = () => {
  const [history, setHistory] = useState([]);


  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de busca:", error);
    }
  }, []);

  const addSearchToHistory = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    
    setHistory(prevHistory => {
    
      const updatedHistory = [
        lowerQuery,
        ...prevHistory.filter(item => item !== lowerQuery)
      ];
      
     
      const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
      } catch (error) {
        console.error("Erro ao salvar histórico de busca:", error);
      }
      
      return limitedHistory;
    });
  }, []);


  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error("Erro ao limpar histórico de busca:", error);
    }
  }, []);

  return { history, addSearchToHistory, clearHistory };
};