import express from 'express';
import * as genai from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

// Configuração inicial
dotenv.config();
const app = express();
const port = 5001; // Porta do backend

// Middlewares
app.use(cors()); // Permite que o React (ex: porta 5173) acesse aqui
app.use(express.json()); // Permite ler o JSON enviado pelo React

// Configura a API do Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("API Key do Gemini não encontrada no .env");
}
const genAi = new genai.GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });

// --- A ÚNICA ROTA QUE PRECISAMOS ---
app.post('/api/resumir', async (req, res) => {
  try {
    const { textoArtigo } = req.body; // Pega o texto que o React mandou

    if (!textoArtigo) {
      return res.status(400).json({ erro: 'Nenhum texto foi fornecido.' });
    }

    // 2. Monta o prompt
    const prompt = `
      Você é um assistente especializado em direito constitucional brasileiro.
      Sua tarefa é resumir o seguinte artigo da Constituição em linguagem simples, 
      clara e acessível para um leigo, em no máximo 3 parágrafos.

      Texto do Artigo:
      "${textoArtigo}"

      Resumo:
    `;

    // 3. Chama a API do Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // 4. Retorna o resumo para o React
    res.json({ resumo: response.text() });

  } catch (e) {
    console.error('Erro na API Gemini:', e);
    res.status(500).json({ erro: 'Falha ao se comunicar com a IA.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend Proxy rodando em http://localhost:${port}`);
});