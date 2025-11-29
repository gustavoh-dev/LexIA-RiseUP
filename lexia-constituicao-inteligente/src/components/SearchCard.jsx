import React, { useState, useCallback, useMemo } from 'react';
import { analisarArtigo } from '../services/ApiService';
import { createSafeHTML } from '../utils/sanitize';

const SUMMARIZED_AI_LENGTH = 200;
const formatLegalText = (text = '') =>
  text
    .replace(/§\s*/g, '\n§ ')
    .replace(/(\d+º)\s*/g, '$1 ')
    .replace(/([IVXLCDM]+\s-\s)/g, '\n$1')
    .replace(/;\s*/g, ';\n')
    .replace(/:\s*/g, ':\n')
    .trim();

const SearchCard = ({ result, isSaved, onToggleSave, onViewFull, onExpand, isFullView }) => {
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duvida, setDuvida] = useState('');
  const [showFullAiSummary, setShowFullAiSummary] = useState(false);

  const previewText = useMemo(() => {
    const base = formatLegalText((result.texto_caput || result.texto_completo || '').trim());
    return base || 'Sem texto disponivel.';
  }, [result.texto_caput, result.texto_completo]);

  const handleAiAnalysis = useCallback(async () => {
    if (!isFullView && onExpand) {
      onExpand(result);
    }

    setError(null);
    setAiResult(null);
    setLoading(true);
    setShowFullAiSummary(false);

    try {
      const data = await analisarArtigo(result.texto_completo, duvida);
      setAiResult(data);
    } catch (err) {
      setError(err.message || 'Nao foi possivel gerar a analise agora.');
    } finally {
      setLoading(false);
    }
  }, [result.texto_completo, duvida, isFullView, onExpand, result]);

  const toggleFullAiSummary = useCallback(() => {
    setShowFullAiSummary((prev) => !prev);
  }, []);

  const displayAiSummary = useMemo(() => {
    if (!aiResult || !aiResult.resumo) return '';
    if (showFullAiSummary || aiResult.resumo.length <= SUMMARIZED_AI_LENGTH) {
      return aiResult.resumo;
    }
    return aiResult.resumo.substring(0, SUMMARIZED_AI_LENGTH) + '...';
  }, [aiResult, showFullAiSummary]);

  const shouldShowToggleButton = useMemo(() => {
    return (
      aiResult &&
      aiResult.resumo &&
      aiResult.resumo.length > SUMMARIZED_AI_LENGTH
    );
  }, [aiResult]);

  const isContentExpanded = loading || aiResult;

  const renderNestedContent = () => {
    if (!result.texto_completo) return null;

    let nestedContent = '';
    const caputOnly = (result.texto_caput || '').replace(/Art\.\s[0-9]+[A-Z]?\.\s/, '').trim();

    const caputIndex = result.texto_completo.indexOf(result.texto_caput || '');
    if (caputIndex !== -1 && result.texto_caput) {
      nestedContent = result.texto_completo.substring(caputIndex + (result.texto_caput || '').length).trim();
    } else if (caputOnly) {
      const caputOnlyIndex = result.texto_completo.indexOf(caputOnly);
      if (caputOnlyIndex !== -1) {
        nestedContent = result.texto_completo.substring(caputOnlyIndex + caputOnly.length).trim();
      }
    }

    if (!nestedContent && result.texto_completo.length > (result.texto_caput || '').length) {
      nestedContent = result.texto_completo.substring((result.texto_caput || '').length).trim();
    }

    if (nestedContent && result.texto_caput && nestedContent.startsWith(result.texto_caput)) {
      nestedContent = nestedContent.substring(result.texto_caput.length).trim();
    }

    if (nestedContent) {
      return (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
            {formatLegalText(nestedContent)}
          </div>
        </div>
      );
    }

    if (result.texto_completo && result.texto_completo !== result.texto_caput) {
      return (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
            {formatLegalText(result.texto_completo)}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        minHeight: isFullView ? '80vh' : '550px',
        width: isFullView ? '100%' : 'auto'
      }}
      className={`search-card flex flex-col shadow-lg rounded-lg border border-gray-200 transition-all duration-700 ease-in-out bg-white ${isFullView ? 'expanded max-h-none' : 'max-h-[85vh]'}`}
    >

      <div className="card-header flex-shrink-0 flex justify-between items-center p-5">
        <div
          className="card-title flex-grow pr-2 text-2xl font-bold text-gray-900"
          dangerouslySetInnerHTML={createSafeHTML(
            `<strong>${result.artigo_numero}</strong> - ${
              result.capitulo_estrutura || result.titulo_estrutura
            }`
          )}
        />

        <div className="flex gap-3">
          {!isFullView && (
            <button
              className="text-gray-400 hover:text-blue-600 transition p-1"
              onClick={() => onExpand(result)}
              title="Expandir para tela cheia"
            >
              <i className="fas fa-expand-arrows-alt text-xl"></i>
            </button>
          )}

          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onToggleSave(result)}
            aria-label={isSaved ? 'Remover dos salvos' : 'Salvar artigo'}
          >
            <i className="fas fa-bookmark text-xl" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="card-content-scroll flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-5 py-2">

        <div className="legal-base mb-4 text-gray-500 text-lg font-medium">
          Base legal: Art.
          <span
            dangerouslySetInnerHTML={createSafeHTML(
              `<strong>${result.artigo_numero
                .replace('Art. ', '')
                .trim()}</strong>`
            )}
          />
        </div>

        <div className={`summary text-xl leading-relaxed text-gray-800 ${isFullView ? 'expanded-summary' : ''}`}>
          {isFullView && result.texto_completo ? (
            <>
              <p className="mb-4">{result.texto_caput}</p>
              {renderNestedContent()}
            </>
          ) : (
            <div
              className="text-base md:text-lg leading-relaxed text-gray-800"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                whiteSpace: 'pre-line',
              }}
            >
              {previewText}
            </div>
          )}
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isContentExpanded ? 'opacity-100 max-h-[1000px] mt-6' : 'opacity-0 max-h-0'}`}>
          {(loading || error || aiResult) && (
            <div className="p-4 bg-blue-50 rounded-lg text-base border border-blue-100 shadow-inner">
              {loading && (
                <p className="text-blue-600 animate-pulse flex items-center gap-2 text-lg font-semibold">
                  Gerando seu resumo com IA...
                </p>
              )}
              {error && <p className="text-red-500 text-lg">{error}</p>}

              {aiResult && (
                <div className="animate-fade-in">
                  <strong className="text-blue-800 block mb-3 text-xl">
                    Analise por IA: {aiResult.titulo}
                  </strong>

                  <p className="whitespace-pre-wrap text-gray-800 mb-2 text-lg leading-relaxed">
                    {displayAiSummary}
                  </p>

                  {shouldShowToggleButton && (
                    <button
                      onClick={toggleFullAiSummary}
                      className="text-blue-700 hover:text-blue-900 text-base focus:outline-none mt-2 font-bold"
                    >
                      {showFullAiSummary ? 'Ver menos' : 'Ver resumo completo'}
                    </button>
                  )}

                  {Array.isArray(aiResult.palavrasChave) && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {aiResult.palavrasChave.map((palavra, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                        >
                          {palavra}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card-actions flex-shrink-0 p-4 mt-2 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="hidden md:block flex-1"></div>

        <div className="flex-none w-full md:w-auto flex justify-center">
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center shadow-md font-medium text-base whitespace-nowrap"
            onClick={handleAiAnalysis}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Processando
              </>
            ) : (
              <>
                Resumir com IA
              </>
            )}
          </button>
        </div>

        <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-blue-600 font-medium whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              const itemWithAiData = {
                ...result,
                aiData: aiResult,
                texto_completo: result.texto_completo || result.texto_caput || '',
                texto_caput: result.texto_caput || '',
                artigo_numero: result.artigo_numero || '',
                capitulo_estrutura: result.capitulo_estrutura || result.titulo_estrutura || '',
                titulo_estrutura: result.titulo_estrutura || ''
              };
              onViewFull(itemWithAiData);
            }}
          >
            Tire suas duvidas
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
