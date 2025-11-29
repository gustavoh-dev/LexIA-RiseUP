import axios from 'axios';
import { APP_CONFIG } from '../config';
import { generationConfig, buildAnalysisPrompt } from '../../shared/geminiConfig.js';

/**
 * Busca artigos de forma inteligente
 * @param {string} query 
 * @returns {Promise<object>}
 */
export const buscarArtigosInteligente = async (query) => {
  if (!APP_CONFIG.API_BASE_URL) {
    console.warn('API_BASE_URL não configurada; busca inteligente indisponível.');
    return { tipo: 'erro', termo: query, mensagem: 'API de busca não configurada' };
  }

  try {
    const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/api/buscar`, {
      query
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;

  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    
    return { tipo: 'erro', termo: query };
  }
};

/**
 * Analisa um artigo usando a API Gemini diretamente
 * @param {string} textoArtigo - Texto completo do artigo
 * @param {string} duvidaUsuario - Dúvida opcional do usuário
 * @returns {Promise<object>} Objeto com titulo, resumo, palavrasChave e respostaDuvida
 */
export const analisarArtigo = async (textoArtigo, duvidaUsuario = '') => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('API Key do Gemini não configurada. Configure a variável VITE_GEMINI_API_KEY.');
  }

  if (!textoArtigo || !textoArtigo.trim()) {
    throw new Error('Nenhum texto de artigo foi fornecido.');
  }

  try {
    // Construir o prompt usando função compartilhada
    const prompt = buildAnalysisPrompt(textoArtigo, duvidaUsuario);

    // Chamar a API REST do Gemini diretamente usando axios
    // Usando a mesma versão do modelo que estava no código original: gemini-2.5-flash-preview-09-2025
    // Tentando usar o nome exato do modelo; se não funcionar, pode ser necessário usar gemini-2.0-flash-exp
    const modelName = 'gemini-2.5-flash-preview-09-2025';
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: generationConfig,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extrair o texto da resposta
    const jsonText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      throw new Error('A IA não retornou uma resposta válida.');
    }

    // Parsear o JSON retornado
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', jsonText, e);
      throw new Error('A IA retornou um formato de JSON inválido.');
    }

    return parsedData;

  } catch (error) {
    console.error('Erro ao chamar a API Gemini:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Erro da API do Gemini
        const errorMessage = error.response.data?.error?.message || error.response.statusText;
        throw new Error(`Erro na API Gemini: ${errorMessage}`);
      } else if (error.request) {
        // Requisição foi feita mas não houve resposta
        throw new Error('Não foi possível conectar à API Gemini. Verifique sua conexão com a internet.');
      }
    }
    
    throw error;
  }
};
