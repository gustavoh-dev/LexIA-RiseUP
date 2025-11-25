import express from 'express';
import * as genai from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';
import { generationConfig, buildAnalysisPrompt } from '../shared/geminiConfig.js';


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

    // Construir o prompt usando função compartilhada
    const prompt = buildAnalysisPrompt(textoArtigo, duvidaUsuario);

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