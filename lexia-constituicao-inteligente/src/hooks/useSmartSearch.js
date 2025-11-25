import { useCallback } from 'react';
import { buscarArtigosInteligente } from '../services/ApiService';

/**
 * Hook customizado para centralizar a lógica de busca inteligente
 * Remove duplicação entre MainContent e SearchResults
 */
export function useSmartSearch(setSearchQuery, onSmartSearch = null) {
  /**
   * Processa uma query de busca, detectando se é um número de artigo
   * ou se precisa fazer busca inteligente via IA
   */
  const processSearch = useCallback(async (query) => {
    if (!query || !query.trim()) {
      return;
    }

    // Regex para detectar busca direta por número de artigo
    const regexArtigo = /^(?:artigo|art|art\.)?\s*(\d+)\s*$/i;
    const match = query.match(regexArtigo);

    // Se for apenas um número de artigo, formata e retorna
    if (match) {
      const numeroArtigo = match[1]; 
      const termoFormatado = `Art. ${numeroArtigo}`;
      if (setSearchQuery) {
        setSearchQuery(termoFormatado);
      }
      return { tipo: 'direta', termo: termoFormatado };
    }

    // Caso contrário, faz busca inteligente
    try {
      const resultado = await buscarArtigosInteligente(query);
      
      if (resultado.tipo === 'direta') {
        if (setSearchQuery) {
          setSearchQuery(resultado.termo);
        }
        return resultado;
      } 
      else if (resultado.tipo === 'tema' && resultado.artigos && resultado.artigos.length > 0) {
        // Se há callback para busca por tema, usa ele
        if (onSmartSearch) {
          onSmartSearch(resultado.artigos);
          return resultado;
        } else {
          // Caso contrário, formata como string de busca
          const stringDeBusca = resultado.artigos.map(a => `Art. ${a}`).join(' ');
          if (setSearchQuery) {
            setSearchQuery(stringDeBusca);
          }
          return { ...resultado, termo: stringDeBusca };
        }
      } 
      else {
        // Fallback: usa a query original
        if (setSearchQuery) {
          setSearchQuery(query);
        }
        return { tipo: 'fallback', termo: query };
      }
    } catch (error) {
      console.error("Erro na busca inteligente:", error);
      // Em caso de erro, usa a query original
      if (setSearchQuery) {
        setSearchQuery(query);
      }
      return { tipo: 'erro', termo: query, erro: error };
    }
  }, [setSearchQuery, onSmartSearch]);

  return { processSearch };
}

