import React, { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { createSafeHTML } from '../utils/sanitize';
import { APP_CONFIG } from '../config';

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    const trimmedString = text.substring(0, maxLength);
    return trimmedString.substring(0, trimmedString.lastIndexOf(' ')) + '...';
};

const SearchCard = ({ result, isSaved, onToggleSave, onViewFull }) => {

  const [summary, setSummary] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = useCallback(async () => {
    if (summary) return;

    setLoading(true);
    setError(null);
    try {
      const data = await apiService.summarizeArticle(result.texto_completo);
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Não foi possível gerar o resumo agora.');
    } finally {
      setLoading(false);
    }
  }, [result.texto_completo, summary]);

  return (
    <div className="search-card">
      <div className="card-header">
        <div
          className="card-title"
          dangerouslySetInnerHTML={createSafeHTML(
            `<strong>${result.artigo_numero}</strong> - ${result.capitulo_estrutura || result.titulo_estrutura}`
          )}
        />
        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => onToggleSave()}
          aria-label={isSaved ? 'Remover dos salvos' : 'Salvar artigo'}
        >
          <i className="fas fa-bookmark" aria-hidden="true"></i>
        </button>
      </div>

      <div className="legal-base">
        Base legal: Art.
        <span dangerouslySetInnerHTML={createSafeHTML(
          `<strong>${result.artigo_numero.replace('Art. ', '').trim()}</strong>`
        )} />
      </div>

      <div className="summary">
        {truncateText(result.texto_caput, APP_CONFIG.MAX_SUMMARY_LENGTH)}
      </div>

      {(loading || error || summary) && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-md text-sm border border-indigo-100">
          {loading && <p className="text-indigo-600 animate-pulse">✨ Gerando resumo com IA...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {summary && (
            <div>

              <strong className="text-indigo-700 block mb-2 text-base">
                {summary.titulo}
              </strong>
              

              <p className="whitespace-pre-wrap text-gray-700 mb-3">
                {summary.resumo}
              </p>
              

              <div className="flex flex-wrap gap-2">
                {summary.palavrasChave.map((palavra, index) => (
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


      <div className="card-actions">
        <button
          className="summarize-btn"
          onClick={handleSummarize}
          disabled={loading || !!summary}
          aria-label="Gerar resumo com inteligência artificial"
        >
          {loading ? 'Gerando...' : (summary ? 'Resumo Gerado!' : 'Resumir com IA')}
        </button>
        <a
          href="#"
          className="view-full"
          onClick={(e) => {
            e.preventDefault();
            onViewFull(result);
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