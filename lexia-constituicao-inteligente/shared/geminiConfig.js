/**
 * Configuração compartilhada do schema do Gemini para análise de artigos
 * Este arquivo centraliza a definição do schema JSON usado em todas as chamadas à API Gemini
 * Compatível com Node.js (backend) e ES modules (frontend)
 */

export const generationConfig = {
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

/**
 * Constrói o prompt para análise de artigo
 * @param {string} textoArtigo - Texto do artigo a ser analisado
 * @param {string} duvidaUsuario - Dúvida opcional do usuário sobre o artigo
 * @returns {string} Prompt formatado para o Gemini
 */
export function buildAnalysisPrompt(textoArtigo, duvidaUsuario = '') {
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

  return prompt;
}

