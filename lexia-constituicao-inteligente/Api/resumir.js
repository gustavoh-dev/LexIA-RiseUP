import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuração do modelo Gemini
const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "OBJECT",
    properties: {
      titulo: {
        type: "STRING",
        description: "Um título curto e cativante para o resumo do artigo."
      },
      resumo: {
        type: "STRING",
        description: "O resumo do artigo, em linguagem simples e acessível."
      },
      palavrasChave: {
        type: "ARRAY",
        items: {
          type: "STRING"
        },
        description: "3 a 5 palavras-chave principais do artigo."
      },
      respostaDuvida: {
        type: "STRING",
        description: "A resposta à dúvida específica do usuário, baseada no artigo. Se nenhuma dúvida foi fornecida, este campo deve ser uma string vazia."
      }
    },
    required: ["titulo", "resumo", "palavrasChave", "respostaDuvida"]
  },
};

export default async function handler(req, res) {
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

  try {
    const { textoArtigo, duvidaUsuario } = req.body;

    if (!textoArtigo) {
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }

    // Construir o prompt
    let prompt = `
      Você é um assistente especializado em direito constitucional brasileiro.
      Sua tarefa é analisar o seguinte artigo da Constituição e retornar um objeto JSON 
      que siga o schema fornecido.

      O resumo deve ser em linguagem clara e acessível para um leigo.

      Texto do Artigo:
      "${textoArtigo}"
    `;

    if (duvidaUsuario && duvidaUsuario.trim() !== '') {
      prompt += `

      Além do resumo, o usuário tem uma dúvida específica sobre este artigo:
      "${duvidaUsuario}"

      Por favor, responda a essa dúvida no campo 'respostaDuvida' do JSON, 
      baseando-se estritamente no texto do artigo.
      `;
    } else {
      prompt += `

      Nenhuma dúvida específica foi fornecida. O campo 'respostaDuvida' deve 
      ser uma string vazia.
      `;
    }

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
      return res.status(200).json(parsedData);
    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', jsonText, e);
      return res.status(500).json({ 
        erro: "A IA retornou um formato de JSON inválido." 
      });
    }

  } catch (error) {
    console.error('Erro na API Gemini:', error);
    
    let errorMessage = error.message || 'Falha ao se comunicar com a IA.';
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error.message;
    } else if (error.statusText) {
      errorMessage = error.statusText;
    }
    
    return res.status(500).json({ erro: errorMessage });
  }
}

