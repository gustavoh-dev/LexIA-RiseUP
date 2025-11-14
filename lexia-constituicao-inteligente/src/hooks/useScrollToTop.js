import { useEffect } from 'react';

/**
 * Hook para fazer scroll para o topo quando uma dependência muda
 * @param {any} dependency - Dependência que quando muda, faz scroll para o topo
 */
export const useScrollToTop = (dependency) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [dependency]);
};

