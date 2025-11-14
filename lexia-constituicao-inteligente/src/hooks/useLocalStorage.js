import { useState } from 'react';
import { APP_CONFIG } from '../config';

/**
 * Hook customizado para gerenciar dados no localStorage
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, function]} - [valor, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função para ter a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook para gerenciar itens salvos especificamente
 */
export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useLocalStorage(APP_CONFIG.STORAGE_KEYS.SAVED_ITEMS, []);

  const addItem = (item) => {
    if (!savedItems.find(saved => saved.id === item.id)) {
      setSavedItems([...savedItems, item]);
    }
  };

  const removeItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const toggleItem = (item) => {
    const isSaved = savedItems.some(saved => saved.id === item.id);
    if (isSaved) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
    return !isSaved;
  };

  const isItemSaved = (id) => {
    return savedItems.some(item => item.id === id);
  };

  return {
    savedItems,
    addItem,
    removeItem,
    toggleItem,
    isItemSaved,
  };
};

