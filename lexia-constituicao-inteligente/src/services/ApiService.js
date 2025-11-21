
import { APP_CONFIG } from '../config';

/**
 * Busca artigos de forma inteligente via Backend
 * @param {string} query - O termo ou pergunta do usuário
 * @returns {Promise<object>}
 */
export const buscarArtigosInteligente = async (query) => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/api/buscar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Erro na busca: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    // Em caso de erro, retorna um fallback seguro para não quebrar a tela
    return { tipo: 'erro', termo: query };
  }
};

/**
 * Analisa um artigo específico via Backend
 * @param {string} textoArtigo
 * @param {string} duvidaUsuario
 * @returns {Promise<object>}
 */
export const analisarArtigo = async (textoArtigo, duvidaUsuario = '') => {
  const requestBody = {
    textoArtigo: textoArtigo,
    duvidaUsuario: duvidaUsuario
  };

  try {
    
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/api/resumir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Verificar se a resposta está vazia
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Resposta inválida do servidor: ${text || 'Resposta vazia'}`);
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${text || response.statusText}`);
      }
      throw new Error(errorData.erro || `Falha na requisição: ${response.statusText}`);
    }

    // Verificar se há conteúdo antes de fazer parse
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Resposta vazia do servidor');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Erro ao parsear JSON:', text);
      throw new Error('Resposta inválida do servidor. Tente novamente.');
    }
    
    return data;

  } catch (error) {
    console.error('Erro ao chamar a API de análise:', error);
    
    // Melhorar mensagem de erro para o usuário
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou se o servidor está online.');
    }
    
    throw error;
  }
};