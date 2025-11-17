import React from 'react';
import { useSavedItems } from '../hooks/useLocalStorage';
import { createSafeHTML } from '../utils/sanitize';
import { APP_CONFIG } from '../config';
import { useToast } from '../hooks/useToast';

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  const trimmedString = text.substring(0, maxLength);
  return trimmedString.substring(0, trimmedString.lastIndexOf(' ')) + '...';
};

/**
 * 
 * @param {function} onShowFullText 
 */
const Saved = ({ onShowFullText }) => {
  const { savedItems, removeItem } = useSavedItems();
  const toast = useToast();
  
  const hasSavedItems = savedItems.length > 0;

  const handleRemove = (id) => {
    removeItem(id);
    toast.info('Artigo removido dos salvos');
  };

  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-4xl px-6">
        <div className="search-header">
          <i className="fas fa-save search-header-icon" style={{ fontSize: '40px' }}></i>
          Salvos:
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {!hasSavedItems && (
            <div className="col-span-full">
              <div className="search-card text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nenhum item salvo ainda
                </h3>
                <p className="text-gray-600">
                  Você ainda não salvou nenhum artigo.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Use o ícone de marcador nos artigos para salvá-los aqui.
                </p>
              </div>
            </div>
          )}
          {hasSavedItems && savedItems.map((item) => (
            <div className="search-card" key={item.id}>
              <div className="card-header">
                 <div
                className="card-title"
                dangerouslySetInnerHTML={createSafeHTML(
                  `<strong>${item.artigo_numero || item.base}</strong> - ${item.capitulo_estrutura || item.titulo}`
                )}
              />
              <button
                className="save-btn saved"
                onClick={() => handleRemove(item.id)}
                aria-label="Remover dos salvos"
              >
                <i className="fas fa-bookmark" aria-hidden="true"></i>
              </button>
              </div>
              <div className="legal-base">
                Base legal: Art.
                <span dangerouslySetInnerHTML={createSafeHTML(
                  `<strong>${(item.artigo_numero || item.base).replace('Art. ', '').trim()}</strong>`
                )} />
              </div>
              <div className="summary">
                {truncateText(item.texto_caput || item.summary || '', APP_CONFIG.MAX_SUMMARY_LENGTH)}
              </div>
              <div className="card-actions">
                <a
                  href="#"
                  className="view-full"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowFullText(item);
                  }}
                  aria-label={`Ver artigo completo: ${item.artigo_numero || item.base}`}
                >
                  Ver completo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Saved;