import { APP_CONFIG } from '../config';

/**
 * Serviço centralizado para chamadas de API
 */
class ApiService {
  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL;
  }

  /**
   * Faz uma requisição HTTP
   * @param {string} endpoint - Endpoint da API
   * @param {object} options - Opções da requisição
   * @returns {Promise} - Resposta da API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Se for erro de rede (não conseguiu conectar)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      throw error;
    }
  }

  /**
   * Gera resumo de um artigo usando IA
   * @param {string} textoArtigo - Texto do artigo para resumir
   * @returns {Promise<object>} - Objeto com título, resumo e palavras-chave
   */
  async summarizeArticle(textoArtigo) {
    if (!textoArtigo || !textoArtigo.trim()) {
      throw new Error('Texto do artigo não fornecido');
    }

    return this.request(APP_CONFIG.API_ENDPOINTS.SUMMARIZE, {
      method: 'POST',
      body: JSON.stringify({ textoArtigo }),
    });
  }
}

// Exporta uma instância singleton
export const apiService = new ApiService();

