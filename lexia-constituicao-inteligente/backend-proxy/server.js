import express from 'express';
import * as genai from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 5001; 

app.use(cors()); 
app.use(express.json()); 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("API Key do Gemini não encontrada no .env");
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
        description: "O resumo do artigo, em linguagem simples."
      },
      palavrasChave: {
        type: "ARRAY",
        items: {
          type: "STRING"
        },
        description: "3 a 5 palavras-chave principais do artigo."
      },
    },
    required: ["titulo", "resumo", "palavrasChave"]
  },
};


const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });


app.post('/api/resumir', async (req, res) => {
 
  try {
    const { textoArtigo } = req.body; 

    if (!textoArtigo) {
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }


    const prompt = `
      Você é um assistente especializado em direito constitucional brasileiro.
      Sua tarefa é analisar o seguinte artigo da Constituição e retornar um objeto JSON 
      que siga o schema fornecido.

      O resumo deve ser em linguagem clara e acessível para um leigo.

      Texto do Artigo:
      "${textoArtigo}"
    `;


    const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: generationConfig, 
    });
    
    const response = result.response;
    

    try {
      const jsonText = response.text();
      const parsedData = JSON.parse(jsonText);
      
      res.json(parsedData);

    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', e, response.text());
      throw new Error("A IA retornou um formato de JSON inválido.");
    }

  } catch (e) {
    console.error('Erro na API Gemini:', e);
    if (e.status && e.statusText) {
       return res.status(e.status || 500).json({ erro: `Erro da API Google: ${e.statusText}` });
    }
    res.status(500).json({ erro: e.message || 'Falha ao se comunicar com a IA.' });
  }
});


app.listen(port, () => {
  console.log(`🚀 Backend Proxy (Modo JSON) rodando em http://localhost:${port}`);
});