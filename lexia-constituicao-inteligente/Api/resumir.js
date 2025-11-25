import { GoogleGenerativeAI } from '@google/generative-ai';
import { generationConfig, buildAnalysisPrompt } from '../shared/geminiConfig.js';

export default async function handler(req, res) {
  try {
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Lidar com requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Permitir apenas método POST
    if (req.method !== 'POST') {
      return res.status(405).json({ erro: 'Método não permitido' });
    }

    // Verificar se a API key está configurada
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY não encontrada nas variáveis de ambiente');
      return res.status(500).json({ 
        erro: 'Configuração do servidor incompleta. Entre em contato com o suporte.' 
      });
    }

    // Verificar se o body foi parseado corretamente
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      console.error('Erro ao parsear body:', req.body);
      return res.status(400).json({ erro: 'Formato de requisição inválido.' });
    }

    const { textoArtigo, duvidaUsuario } = body || {};

    if (!textoArtigo || !textoArtigo.trim()) {
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }

    // Construir o prompt usando função compartilhada
    const prompt = buildAnalysisPrompt(textoArtigo, duvidaUsuario);

    // Inicializar o modelo Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-preview-09-2025'
    });

    // Gerar conteúdo
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: generationConfig,
    });

    const response = result.response;
    const jsonText = response.text();

    try {
      const parsedData = JSON.parse(jsonText);
      
      // Validar se os dados estão completos
      if (!parsedData.titulo || !parsedData.resumo || !parsedData.palavrasChave) {
        console.error('Dados incompletos da IA:', parsedData);
        return res.status(500).json({ 
          erro: "A IA retornou dados incompletos. Tente novamente." 
        });
      }
      
      return res.status(200).json(parsedData);
    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', jsonText, e);
      return res.status(500).json({ 
        erro: "A IA retornou um formato de JSON inválido." 
      });
    }

  } catch (error) {
    console.error('Erro na API Gemini:', error);
    
    let errorMessage = 'Falha ao se comunicar com a IA.';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error.message;
    } else if (error.statusText) {
      errorMessage = error.statusText;
    }
    
    // Garantir que sempre retornamos uma resposta válida
    return res.status(500).json({ erro: errorMessage });
  }
}

