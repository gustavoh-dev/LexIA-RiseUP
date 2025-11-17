import express from 'express';
import * as genai from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();


const app = express();
const port = process.env.PORT || 5001; 


app.use(cors()); 
app.use(express.json()); 


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("API Key do Gemini não encontrada no arquivo .env");
}


const genAi = new genai.GoogleGenerativeAI(GEMINI_API_KEY);


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


const model = genAi.getGenerativeModel({ 
  model: 'gemini-2.5-flash-preview-09-2025' 
});

app.post('/api/resumir', async (req, res) => {
  console.log("Recebida requisição em /api/resumir");
  
  try {
    const { textoArtigo, duvidaUsuario } = req.body; 

    if (!textoArtigo) {
      console.log("Erro: Nenhum texto de artigo fornecido.");
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }

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

    console.log("Enviando prompt para o Gemini...");
    const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: generationConfig, 
    });
    
    const response = result.response;
    const jsonText = response.text();
    console.log("Resposta JSON recebida do Gemini.");

    try {
      
      const parsedData = JSON.parse(jsonText);
      res.json(parsedData); 
    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', jsonText, e);
      throw new Error("A IA retornou um formato de JSON inválido.");
    }

  } catch (e) {
    console.error('Erro na API Gemini:', e);
   
    let errorMessage = e.message || 'Falha ao se comunicar com a IA.';
    if (e.response && e.response.data && e.response.data.error) {
        errorMessage = e.response.data.error.message;
    } else if (e.statusText) {
        errorMessage = e.statusText;
    }
    
    res.status(500).json({ erro: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend Proxy (Modo JSON) rodando em http://localhost:${port}`);
});