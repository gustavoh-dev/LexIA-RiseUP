import React, { useState, useEffect } from 'react';
import { createSafeHTML } from '../utils/sanitize';
import { analisarArtigo } from '../services/ApiService';

const formatLegalText = (text = '') =>
  text
    .replace(/§\s*/g, '\n§ ')
    .replace(/(\d+º)\s*/g, '$1 ')
    .replace(/([IVXLCDM]+\s-\s)/g, '\n$1')
    .replace(/;\s*/g, ';\n')
    .replace(/:\s*/g, ':\n')
    .trim();

const formatNestedText = (fullText) => {
  if (!fullText) return '';
  return formatLegalText(fullText).replace(/\n/g, '<br/>' );
};

const FullArticle = ({ article, onNavigate }) => {
  const [userDoubt, setUserDoubt] = useState('');
  const [showDoubtInput, setShowDoubtInput] = useState(false);
  const [aiResponse, setAiResponse] = useState(article?.aiData?.respostaDuvida || ''); 
  const [loading, setLoading] = useState(false);

  const [currentAiData, setCurrentAiData] = useState(article.aiData);

  useEffect(() => {
    setAiResponse(article?.aiData?.respostaDuvida || '');
    setCurrentAiData(article.aiData);
  }, [article]);

  const handleAskAI = async () => {
    if (!userDoubt.trim()) {
      setAiResponse('Por favor, digite sua duvida antes de enviar.');
      return;
    }
    
    const articleContentToSend = article.texto_completo || '';
    if (!articleContentToSend) {
        setAiResponse('Erro: O conteudo do artigo esta indisponivel para analise.');
        console.error('Artigo incompleto: texto_completo esta vazio ou undefined.');
        return;
    }


    setLoading(true);
    setAiResponse(''); 

    try {
      const data = await analisarArtigo(articleContentToSend, userDoubt);

      setCurrentAiData({
        titulo: data.titulo,
        resumo: data.resumo,
        palavrasChave: data.palavrasChave,
        respostaDuvida: data.respostaDuvida,
      });

      setAiResponse(data.respostaDuvida || "A IA nao retornou uma resposta para esta duvida."); 

    } catch (error) {
      console.error("Erro na comunicacao com a IA:", error);
      
      const errorMessage = error.message || 'Erro desconhecido ao processar sua duvida.';
      setAiResponse(`Desculpe, ${errorMessage}`);
    }

    setLoading(false);
    setUserDoubt(''); 
  };

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
            aria-label="Voltar a pagina inicial"
          >
            Voltar ao Inicio
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

  // Extrai o conteudo adicional (apos o caput)
  let nestedContent = '';
  if (!isRevogado && fullText && fullText.trim().length > 0) {
    if (textoCaput && textoCaput.trim().length > 0) {
      const caputIndex = fullText.indexOf(textoCaput);
      
      if (caputIndex !== -1) {
        nestedContent = fullText.substring(caputIndex + textoCaput.length).trim();
      } else {
        const caputSemNumero = textoCaput.replace(/Art\.\s[0-9]+[A-Z]?\.\s/, '').trim();
        const caputSemNumeroIndex = fullText.indexOf(caputSemNumero);
        
        if (caputSemNumeroIndex !== -1) {
          nestedContent = fullText.substring(caputSemNumeroIndex + caputSemNumero.length).trim();
        } else if (fullText.length > textoCaput.length) {
          nestedContent = fullText.substring(textoCaput.length).trim();
        }
      }
      
      if (nestedContent && nestedContent.startsWith(textoCaput)) {
        nestedContent = nestedContent.substring(textoCaput.length).trim();
      }
    } else {
      nestedContent = fullText;
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
              Este artigo foi REVOGADO e nao esta mais em vigor.
            </div>
          ) : (
            <>
              {textoCaput && (
                <p className="text-lg text-gray-800 mb-4" style={{ whiteSpace: 'pre-line' }}>
                  {formatLegalText(textoCaput)}
                </p>
              )}

              {(() => {
                if (formattedNestedContent && formattedNestedContent.length > 0) {
                  return (
                    <div
                      className="text-lg text-gray-800 pt-4"
                      style={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={createSafeHTML(formattedNestedContent)}
                    />
                  );
                }
                
                if (fullText && fullText.trim().length > 0 && textoCaput && fullText.length > textoCaput.length) {
                  const restante = fullText.substring(textoCaput.length).trim();
                  if (restante.length > 0) {
                    return (
                      <div className="text-lg text-gray-800 pt-4" style={{ whiteSpace: 'pre-line' }}>
                        {formatLegalText(restante)}
                      </div>
                    );
                  }
                }
                
                if (fullText && fullText.trim().length > 0 && fullText !== textoCaput) {
                  return (
                    <div className="text-lg text-gray-800 pt-4" style={{ whiteSpace: 'pre-line' }}>
                      {formatLegalText(fullText)}
                    </div>
                  );
                }
                
                if (fullText && fullText.trim().length > 0 && !textoCaput) {
                  return (
                    <div className="text-lg text-gray-800" style={{ whiteSpace: 'pre-line' }}>
                      {formatLegalText(fullText)}
                    </div>
                  );
                }
                
                return null;
              })()}

              <div className="mt-6 pt-6 border-t border-indigo-100">
                {!showDoubtInput && (
                  <div className="flex justify-center">
                    <button
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
                      onClick={() => {
                        setShowDoubtInput(true);
                        if (!currentAiData) {
                          setAiResponse('');
                        }
                      }}
                      aria-label="Tirar duvida com a Inteligencia Artificial"
                    >
                      Tire sua Duvida com a IA
                    </button>
                  </div>
                )}

                {showDoubtInput && (
                  <div className="mt-4 p-4 border border-blue-600 bg-blue-50 rounded-lg">
                    <label htmlFor="ai-doubt" className="block text-blue-600 font-semibold mb-2">
                      Qual e a sua duvida sobre este artigo?
                    </label>
                    <textarea
                      id="ai-doubt"
                      className="w-full p-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-blue-600"
                      rows="3"
                      value={userDoubt}
                      onChange={(e) => setUserDoubt(e.target.value)}
                      placeholder="Ex: o que este artigo diz sobre moradia?"
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
                            Mandar sua duvida
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            
              {(currentAiData || aiResponse) && (
                <div className="mt-6 pt-6 border-t border-indigo-100">

                  {aiResponse && (
                    <div className={`pt-4 ${currentAiData ? 'border-t border-gray-100 mt-4' : ''}`}>
                      <strong className="text-blue-600 block mb-1">
                        Resposta a sua duvida:
                      </strong>
                      <p className="whitespace-pre-wrap text-gray-700">
                        {aiResponse}
                      </p>
                    </div>
                  )}

                  {Array.isArray(currentAiData?.palavrasChave) && (
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
