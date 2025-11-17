import React, { useState, useCallback, useMemo } from 'react';
import { analisarArtigo } from '../services/ApiService'; 
import { createSafeHTML } from '../utils/sanitize';
import { APP_CONFIG } from '../config'; 

const SUMMARIZED_AI_LENGTH = 200; 

const SearchCard = ({ result, isSaved, onToggleSave, onViewFull }) => {

  const [aiResult, setAiResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duvida, setDuvida] = useState('');
  
  const [showFullAiSummary, setShowFullAiSummary] = useState(false); 

  const handleAiAnalysis = useCallback(async () => {
    setError(null);
    setAiResult(null); 
    setLoading(true);
    setShowFullAiSummary(false); 

    try {
      const data = await analisarArtigo(result.texto_completo, duvida);
      setAiResult(data);
    } catch (err) {
      setError(err.message || 'Não foi possível gerar a análise agora.');
    } finally {
      setLoading(false);
    }
  }, [result.texto_completo, duvida]);

  const toggleFullAiSummary = useCallback(() => {
    setShowFullAiSummary(prev => !prev);
  }, []);

  const displayAiSummary = useMemo(() => {
    if (!aiResult || !aiResult.resumo) return '';
    if (showFullAiSummary || aiResult.resumo.length <= SUMMARIZED_AI_LENGTH) {
      return aiResult.resumo;
    }
    return aiResult.resumo.substring(0, SUMMARIZED_AI_LENGTH) + '...';
  }, [aiResult, showFullAiSummary]);

  const shouldShowToggleButton = useMemo(() => {
    return aiResult && aiResult.resumo && aiResult.resumo.length > SUMMARIZED_AI_LENGTH;
  }, [aiResult]);



  return (

    <div className="search-card flex flex-col max-h-[75vh]"> 
      
  
      <div className="card-header flex-shrink-0">
        <div
          className="card-title"
          dangerouslySetInnerHTML={createSafeHTML(
            `<strong>${result.artigo_numero}</strong> - ${result.capitulo_estrutura || result.titulo_estrutura}`
          )}
        />
        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => onToggleSave(result)}
          aria-label={isSaved ? 'Remover dos salvos' : 'Salvar artigo'}
        >
          <i className="fas fa-bookmark" aria-hidden="true"></i>
        </button>
      </div>

      <div className="card-content-scroll flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-3">
        <div className="legal-base">
          Base legal: Art.
          <span dangerouslySetInnerHTML={createSafeHTML(
            `<strong>${result.artigo_numero.replace('Art. ', '').trim()}</strong>`
          )} />
        </div>

        <div className="summary">
          {result.texto_caput}
        </div>

        {(loading || error || aiResult) && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md text-sm border border-indigo-100">
            {loading && <p className="text-indigo-600 animate-pulse">✨ Gerando análise com IA...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {aiResult && (
              <div>
                <strong className="text-indigo-700 block mb-2 text-base">
                  Análise por IA: {aiResult.titulo}
                </strong>
                
                <p className="whitespace-pre-wrap text-gray-700 mb-1">
                  {displayAiSummary}
                </p>
                
                {shouldShowToggleButton && (
                  <button 
                    onClick={toggleFullAiSummary}
                    className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none mt-1"
                  >
                    {showFullAiSummary ? 'Ver menos' : 'Ver resumo completo'}
                  </button>
                )}
                
                {aiResult.respostaDuvida && (
                  <div className="mt-3 pt-3 border-t border-indigo-100">
                    <strong className="text-indigo-700 block mb-1">
                      Resposta à sua dúvida:
                    </strong>
                    <p className="whitespace-pre-wrap text-gray-700">
                      {aiResult.respostaDuvida}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {aiResult.palavrasChave.map((palavra, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                    >
                      {palavra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-actions flex-shrink-0 pt-4 mt-2 border-t border-gray-100">
        
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tire uma dúvida sobre este artigo (opcional)"
            value={duvida}
            onChange={(e) => setDuvida(e.target.value)}
            disabled={loading} 
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            aria-label="Dúvida sobre o artigo"
          />
        </div>

        <button
          className="summarize-btn"
          onClick={handleAiAnalysis}
          disabled={loading} 
          aria-label="Gerar resumo e responder dúvida com inteligência artificial"
        >
          {loading ? 'Analisando...' : 'Analisar com IA'}
        </button>

       
        <a
          href="#"
          className="view-full"
          onClick={(e) => {
            e.preventDefault();

            const itemWithAiData = {
              ...result,
              aiData: aiResult 
            };
          
            onViewFull(itemWithAiData);
          }}
          aria-label={`Ver artigo completo: ${result.artigo_numero}`}
        >
          Ver completo
        </a>
      </div>
    </div>
  );
};

export default SearchCard;