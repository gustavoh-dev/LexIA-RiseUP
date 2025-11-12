import React, { useState } from 'react';

const MAX_SUMMARY_LENGTH = 250;

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    const trimmedString = text.substring(0, maxLength);
    return trimmedString.substring(0, trimmedString.lastIndexOf(' ')) + '...';
};

const SearchCard = ({ result, isSaved, onToggleSave, onViewFull }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (summary) return; // Se já tem resumo, não faz nada

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/resumir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoArtigo: result.texto_completo }),
      });

      if (!response.ok) throw new Error('Erro ao gerar resumo');
      const data = await response.json();
      setSummary(data.resumo);
    } catch (err) {
      setError('Não foi possível gerar o resumo agora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-card">
      <div className="card-header">
        <div 
          className="card-title"
          dangerouslySetInnerHTML={{ __html: `<strong>${result.artigo_numero}</strong> - ${result.capitulo_estrutura || result.titulo_estrutura}` }}
        />
        <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={() => onToggleSave(result.id)}>
          <i className="fas fa-bookmark"></i>
        </button>
      </div>
      
      <div className="legal-base">
          Base legal: Art. 
          <span dangerouslySetInnerHTML={{ __html: `<strong>${result.artigo_numero.replace('Art. ', '').trim()}</strong>` }} />
      </div> 

      <div className="summary">
        {truncateText(result.texto_caput, MAX_SUMMARY_LENGTH)}
      </div>

      {/* ÁREA DO RESUMO IA DENTRO DO CARD */}
      {(summary || loading || error) && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-md text-sm border border-indigo-100">
          {loading && <p className="text-indigo-600 animate-pulse">✨ Gerando resumo com IA...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {summary && (
            <div>
              <strong className="text-indigo-700 block mb-1">Resumo IA:</strong>
              <p className="whitespace-pre-wrap text-gray-700">{summary}</p>
            </div>
          )}
        </div>
      )}

      <div className="card-actions">
        <button 
            className="summarize-btn" 
            onClick={handleSummarize}
            disabled={loading}
        >
            {loading ? 'Gerando...' : (summary ? 'Resumo Gerado!' : 'Resumir com IA')}
        </button>
        <a href="#" className="view-full" onClick={(e) => { e.preventDefault(); onViewFull(result); }}>Ver completo</a>
      </div>
    </div>
  );
};

export default SearchCard;