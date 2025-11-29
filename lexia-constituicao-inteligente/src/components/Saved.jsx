import React from 'react';
import { useSavedItems } from '../hooks/useLocalStorage';
import { createSafeHTML } from '../utils/sanitize';
import { APP_CONFIG } from '../config';
import { useToast } from '../hooks/useToast';

const formatLegalText = (text = '') =>
  text
    .replace(/§\s*/g, '\n§ ')
    .replace(/(\d+º)\s*/g, '$1 ')
    .replace(/([IVXLCDM]+\s-\s)/g, '\n$1')
    .replace(/;\s*/g, ';\n')
    .replace(/:\s*/g, ':\n')
    .trim();

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
                <div className="text-6xl mb-4">💾</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nenhum item salvo ainda
                </h3>
                <p className="text-gray-600">
                  Voce ainda nao salvou nenhum artigo.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Use o icone de marcador nos artigos para salva-los aqui.
                </p>
              </div>
            </div>
          )}

          {hasSavedItems && savedItems.map((item) => {
            const previewText = formatLegalText((item.texto_caput || item.summary || item.texto_completo || '').trim());

            return (
              <div className="search-card flex flex-col shadow-lg rounded-lg border border-gray-200" key={item.id}>
                <div className="card-header flex justify-between items-start p-4">
                  <div
                    className="card-title text-xl font-bold text-gray-900 pr-3"
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

                <div className="card-content px-4 pb-4 flex flex-col gap-3">
                  <div className="legal-base text-gray-500 font-medium">
                    Base legal: Art. <span
                      dangerouslySetInnerHTML={createSafeHTML(
                        `<strong>${(item.artigo_numero || item.base || '').replace('Art. ', '').trim()}</strong>`
                      )}
                    />
                  </div>

                  <div
                    className="text-base leading-relaxed text-gray-800"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {previewText || 'Sem texto disponivel.'}
                  </div>
                </div>

                <div className="card-actions mt-auto p-4 border-t border-gray-100 flex flex-col items-center gap-2 text-center">
                  <a
                    href="#"
                    className="text-sm text-blue-700 hover:text-blue-900 font-medium"
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
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Saved;
