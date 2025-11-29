import React, { useState } from 'react';
import { analisarArtigo } from '../services/ApiService.js'; 
import { useToast } from '../hooks/useToast';

/**
 * 
 *
 * @param {string} textoArtigo 
 */
export function AiAnalysis({ textoArtigo }) {
  const [duvida, setDuvida] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duvida.trim()) {
      toast.error('Por favor, digite sua duvida.');
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const dadosDaIA = await analisarArtigo(textoArtigo, duvida);
      setResultado(dadosDaIA);
      toast.success('Analise da IA concluida!');
    } catch (err) {
      setErro(err.message);
      toast.error(err.message || 'Falha ao analisar com a IA.');
    } finally {
      setLoading(false);
    }
  };


  const inputStyles = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  };

  const buttonStyles = {
    padding: '8px 12px',
    backgroundColor: '#0d6efd',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
      <h4 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
        Perguntar a IA sobre este artigo
      </h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite sua duvida aqui..."
          value={duvida}
          onChange={(e) => setDuvida(e.target.value)}
          style={inputStyles}
          aria-label="Duvida sobre o artigo"
        />
        <button type="submit" disabled={loading} style={buttonStyles}>
          {loading ? 'Analisando...' : 'Analisar'}
        </button>
      </form>

      {erro && (
        <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontSize: '14px' }}>
          <strong>Erro:</strong> {erro}
        </div>
      )}

      {resultado && (
        <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '14px' }}>
          <p style={{ margin: 0 }}>
            <strong>Resposta da IA:</strong> {resultado.respostaDuvida}
          </p>
      
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
            <p><strong>Resumo IA:</strong> {resultado.resumo}</p>
            <p>
              <strong>Palavras-chave IA:</strong>{' '}
              {Array.isArray(resultado.palavrasChave) ? resultado.palavrasChave.join(', ') : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

