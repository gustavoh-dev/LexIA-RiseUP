// Configurações da aplicação
export const APP_CONFIG = {
  // API
  // Para busca inteligente (se houver endpoint de busca)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    SAVED_ITEMS: 'savedLexiaItems',
  },
  
  // Paginação
  ITEMS_PER_PAGE: 3,
  MAX_VISIBLE_PAGES: 5,
  
  // Busca
  FUSE_OPTIONS: {
    keys: [
      'titulo_estrutura',
      'capitulo_estrutura',
      'artigo_numero',
      'texto_caput',
      'texto_completo'
    ],
    includeScore: true,
    threshold: 0.6,
  },
  
  // UI
  MAX_SUMMARY_LENGTH: 250,
};

