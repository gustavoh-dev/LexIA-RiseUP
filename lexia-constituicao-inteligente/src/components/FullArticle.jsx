import React, { useState, useEffect } from 'react';
import { createSafeHTML } from '../utils/sanitize';

const formatNestedText = (fullText) => {
  if (!fullText) return '';
  let formattedText = fullText;

  // 1. Artigo/Caput: Negrito (Art. X.)
  formattedText = formattedText.replace(
    /(Art\.\s[0-9]+[A-Z]?\.)/g,
    '<strong>$1</strong>'
  );

  // 2. Parágrafos numerados: <br><br> & 4 espaços & Negrito ( § 1º )
  formattedText = formattedText.replace(
    /(\s§\s[0-9]+º\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s§\s[0-9]+º\. )/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s§\s[0-9]+\.\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );

  // 3. Parágrafo único: <br><br> & 4 espaços & Negrito
  formattedText = formattedText.replace(
    /(Parágrafo único\.\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );

  // 4. Incisos (Numerais Romanos): <br> & 6 espaços & Negrito
  formattedText = formattedText.replace(
    /([IVXLCDM]+\s-\s)/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );

  // 5. Alíneas (Letra + ) ): <br> & 8 espaços & Itálico
  formattedText = formattedText.replace(
    /(\s[a-z]\)\s)/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>$1</em>'
  );

  // 6. Subalíneas (Números): <br> & 10 espaços & Itálico
  formattedText = formattedText.replace(
    /(\s[0-9]+)\s-\s/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>$1 - </em>'
  );

  // Limpeza final
  formattedText = formattedText.replace(/\s+/g, ' ');
  formattedText = formattedText.replace(
    /(\<br\/\>\s*)+\<br\/\>/g,
    '<br/><br/>'
  );
  formattedText = formattedText.replace(/^\<br\/\>/g, '');
  formattedText = formattedText.replace(/^\<br\/\>\<br\/\>/g, '');
  
  return formattedText.trim();
};

const FullArticle = ({ article, onNavigate }) => {
  // Estados para a funcionalidade de IA
  const [userDoubt, setUserDoubt] = useState('');
  const [showDoubtInput, setShowDoubtInput] = useState(false);
  const [aiResponse, setAiResponse] = useState(article?.aiData?.respostaDuvida || ''); 
  const [loading, setLoading] = useState(false);

  // Estado para armazenar o objeto de análise da IA
  const [currentAiData, setCurrentAiData] = useState(article.aiData);

  // Sincroniza os estados se o artigo mudar
  useEffect(() => {
    setAiResponse(article?.aiData?.respostaDuvida || '');
    setCurrentAiData(article.aiData);
  }, [article]);

  // --- Função para lidar com o envio da dúvida à IA (via Backend) ---
  const handleAskAI = async () => {
    if (!userDoubt.trim()) {
      setAiResponse('Por favor, digite sua dúvida antes de enviar.');
      return;
    }
    
    // Verifica se o texto do artigo existe antes de enviar.
    const articleContentToSend = article.texto_completo || '';
    if (!articleContentToSend) {
        setAiResponse('Erro: O conteúdo do artigo está indisponível para análise.');
        console.error('Artigo incompleto: texto_completo está vazio ou undefined.');
        return;
    }


    setLoading(true);
    // Limpa a resposta anterior
    setAiResponse(''); 

    try {
      const response = await fetch('http://localhost:5001/api/resumir', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 💡 CORREÇÃO APLICADA AQUI: USANDO texto_completo
          textoArtigo: articleContentToSend, 
          duvidaUsuario: userDoubt,
        }),
      });

      // Se a resposta HTTP falhar (4xx, 5xx)
      if (!response.ok) {
        // Tenta ler o erro do backend se ele existir
        const errorData = await response.json().catch(() => ({ erro: 'Erro desconhecido do servidor.' }));
        throw new Error(errorData.erro || `Falha HTTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Atualiza os dados da IA (se o resumo for retornado)
      setCurrentAiData({
        titulo: data.titulo,
        resumo: data.resumo,
        palavrasChave: data.palavrasChave,
        respostaDuvida: data.respostaDuvida,
      });

      // Define a resposta para exibição
      setAiResponse(data.respostaDuvida || "A IA não retornou uma resposta para esta dúvida."); 

    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      
      let errorMessage = error.message.includes('Failed to fetch') 
        ? 'Erro de Rede: O servidor Node.js (Backend) não está rodando na porta 5001.'
        : `Erro ao processar sua dúvida: ${error.message}`;

      setAiResponse(`Desculpe, ${errorMessage}`);
    }

    setLoading(false);
    setUserDoubt(''); 
  };
  // -------------------------------------------------------------------


  if (!article) {
    return (
      <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
        <div className="w-full max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Erro ao carregar o artigo.
          </h2>
          <button
            className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition"
            onClick={() => onNavigate('home')}
            aria-label="Voltar à página inicial"
          >
            Voltar ao Início
          </button>
        </div>
      </main>
    );
  }

  const sectionTitle = article.capitulo_estrutura || article.titulo_estrutura;
  const fullText = article.texto_completo || '';
  const textoCaput = article.texto_caput || '';
  const isRevogado =
    textoCaput.includes('(Revogado)') || textoCaput.includes('(Revogada)');

  let nestedContent = '';
  if (!isRevogado && fullText.length > textoCaput.length) {
    // Lógica robusta para encontrar o final do caput no fullText
    const caputOnly = textoCaput.replace(/Art\.\s[0-9]+[A-Z]?\.\s/, '').trim();
    
    let caputEndIndex = -1;
    const caputStartIndex = fullText.indexOf(caputOnly);

    if (caputStartIndex !== -1) {
        caputEndIndex = caputStartIndex + caputOnly.length;
    } else {
        const originalCaputEndIndex = fullText.indexOf(textoCaput) + textoCaput.length;
        if (originalCaputEndIndex > 0) {
           caputEndIndex = originalCaputEndIndex;
        }
    }

    if (caputEndIndex > 0) {
       nestedContent = fullText.substring(caputEndIndex).trim();
    }
  }

  const formattedNestedContent = formatNestedText(nestedContent);
  const formattedCardTitle = `<strong>Art. ${article.artigo_numero}. ${sectionTitle}</strong>`;
  const finalTitle = isRevogado
    ? `<strong>${textoCaput}</strong>`
    : formattedCardTitle;

  return (
    <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-6">
        <button
          className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
          onClick={() => onNavigate('search-results')}
          aria-label="Voltar aos resultados da busca"
        >
          <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
          Voltar aos Resultados
        </button>

        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h1
            className={`text-2xl text-gray-800 font-bold mb-4 ${isRevogado ? 'text-center' : ''}`}
            dangerouslySetInnerHTML={createSafeHTML(finalTitle)}
          />

          {isRevogado ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-center font-semibold text-xl my-6">
              Este artigo foi **REVOGADO** e não está mais em vigor.
            </div>
          ) : (
            <>
              {/* Conteúdo do Caput */}
              <p className="text-lg text-gray-800 mb-4">{textoCaput}</p>

              {/* Conteúdo Aninhado Formatado */}
              {formattedNestedContent.length > 0 && (
                <div
                  className="text-lg text-gray-800 pt-4"
                  dangerouslySetInnerHTML={createSafeHTML(formattedNestedContent)}
                />
              )}

              {/* Seção de Dúvidas/IA */}
              <div className="mt-6 pt-6 border-t border-indigo-100">
                {!showDoubtInput && (
                  <button
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
                    onClick={() => {
                       setShowDoubtInput(true);
                       // Se não houver análise prévia, limpa a resposta para a caixa ficar limpa
                       if (!currentAiData) {
                          setAiResponse('');
                       }
                    }}
                    aria-label="Tirar dúvida com a Inteligência Artificial"
                  >
                   
                    Tire uma Dúvida com a IA
                  </button>
                )}

                {showDoubtInput && (
                  <div className="mt-4 p-4 border border-blue-600 bg-blue-50 rounded-lg">
                    <label htmlFor="ai-doubt" className="block text-blue-600 font-semibold mb-2">
                      Qual é a sua dúvida sobre este artigo?
                    </label>
                    <textarea
                      id="ai-doubt"
                      className="w-full p-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-blue-600"
                      rows="3"
                      value={userDoubt}
                      onChange={(e) => setUserDoubt(e.target.value)}
                      placeholder="Ex: o que art.(a) tem a dizer sobre moradia?"
                      disabled={loading}
                    ></textarea>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
                        onClick={() => {
                          setShowDoubtInput(false);
                          setUserDoubt('');
                        }}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        className={`bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md`}
                        onClick={handleAskAI}
                        disabled={!userDoubt.trim() || loading}
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
                            Enviando...
                          </>
                        ) : (
                          <>
                            mandar sua duvida
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            
              {/* Bloco de Análise IA e Resposta da Dúvida */}
              {(currentAiData || aiResponse) && (
                <div className="mt-6 pt-6 border-t border-indigo-100">
                 
                 

                  {/* Resposta à Dúvida do Usuário */}
                  {aiResponse && (
                    <div className={`pt-4 ${currentAiData ? 'border-t border-gray-100 mt-4' : ''}`}>
                      <strong className="text-blue-600 block mb-1">
                        Resposta à sua dúvida:
                      </strong>
                      <p className="whitespace-pre-wrap text-gray-700">
                        {aiResponse}
                      </p>
                    </div>
                  )}

                  {/* Palavras Chave */}
                  {currentAiData && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentAiData.palavrasChave.map((palavra, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-blue-600 rounded-full text-xs font-medium"
                        >
                          {palavra};
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default FullArticle;