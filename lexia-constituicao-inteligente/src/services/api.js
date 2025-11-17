import { APP_CONFIG } from '../config';


class ApiService {
  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL;
  }

  /**
   * 
   * @param {string} endpoint 
   * @param {object} options 
   * @returns {Promise} 
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

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      throw error;
    }
  }

  /**
   * 
   * @param {string} textoArtigo 
   * @returns {Promise<object>} 
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


export const apiService = new ApiService();

