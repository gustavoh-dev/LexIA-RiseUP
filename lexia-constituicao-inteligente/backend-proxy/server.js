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
const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });


app.post('/api/resumir', async (req, res) => {
  try {
    const { textoArtigo } = req.body; 

    if (!textoArtigo) {
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }

    
    const prompt = `
      Você é um assistente especializado em direito constitucional brasileiro.
      Sua tarefa é resumir o seguinte artigo da Constituição em linguagem simples, 
      clara e acessível para um leigo, em no máximo 3 parágrafos.

      Texto do Artigo:
      "${textoArtigo}"

      Resumo:
    `;

    
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    
    res.json({ resumo: response.text() });

  } catch (e) {
    console.error('Erro na API Gemini:', e);
    res.status(500).json({ erro: 'Falha ao se comunicar com a IA.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend Proxy rodando em http://localhost:${port}`);
});