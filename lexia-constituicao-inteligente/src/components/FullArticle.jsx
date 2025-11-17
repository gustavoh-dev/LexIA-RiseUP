import React, { useMemo } from 'react';
import { createSafeHTML } from '../utils/sanitize';

const formatNestedText = (fullText) => {
  if (!fullText) return '';
  let formattedText = fullText;
  formattedText = formattedText.replace(
    /(Art\.\s[0-9]+[A-Z]?\.)/g,
    '<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s\§\s[0-9]+º\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s\Parágrafo único\.\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s\§\s[0-9]+º\. )/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s\§\s[0-9]+\.\s)/g,
    '<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s[IVXLCDM]+\s-\s)/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>$1</strong>'
  );
  formattedText = formattedText.replace(
    /(\s[a-z]\)\s)/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>$1</em>'
  );
  formattedText = formattedText.replace(
    /(\s[0-9]+)\s-\s/g,
    '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>$1 - </em>'
  );
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
  if (!article) {
    return (
      <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
                       {' '}
        <div className="w-full max-w-4xl px-6 text-center">
                             {' '}
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Erro ao carregar o artigo.
          </h2>
                             {' '}
          <button
            className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition"
            onClick={() => onNavigate('home')}
            aria-label="Voltar à página inicial"
          >
                                  Voltar ao Início                    {' '}
          </button>
                         {' '}
        </div>
                   {' '}
      </main>
    );
  }
  const sectionTitle = article.capitulo_estrutura || article.titulo_estrutura;
  const fullText = article.texto_completo;
  const textoCaput = article.texto_caput;
  const isRevogado =
    textoCaput.includes('(Revogado)') || textoCaput.includes('(Revogada)');

  let nestedContent = '';
  if (!isRevogado && fullText.length > textoCaput.length) {
    const caputEndIndex = fullText.indexOf(textoCaput) + textoCaput.length;
    nestedContent = fullText.substring(caputEndIndex).trim();
  }
  const formattedNestedContent = formatNestedText(nestedContent);
  const formattedCardTitle = `<strong>Art. ${article.artigo_numero}. ${sectionTitle}</strong>`;
  const finalTitle = isRevogado
    ? `<strong>${textoCaput}</strong>`
    : formattedCardTitle;

  return (
    <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
                 {' '}
      <div className="w-full max-w-4xl px-6">
                                       {' '}
        <button
          className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
          onClick={() => onNavigate('search-results')}
          aria-label="Voltar aos resultados da busca"
        >
                           {' '}
          <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>         
                  Voltar aos Resultados              {' '}
        </button>
                                       {' '}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                                                 {' '}
          <h1
            className="text-2xl text-gray-800 font-bold mb-4"
            dangerouslySetInnerHTML={createSafeHTML(finalTitle)}
          />
                                                 {' '}
                            {' '}
          {!isRevogado && (
            <p className="text-lg text-gray-800 mb-4">{textoCaput}</p>
          )}
                                                 {' '}
                        {' '}
          {formattedNestedContent.length > 0 && (
            <div
              className="text-lg text-gray-800 pt-4"
              dangerouslySetInnerHTML={createSafeHTML(formattedNestedContent)}
            />
          )}
                                     
                   {' '}
          {article.aiData && (
            <div className="mt-6 pt-6 border-t border-indigo-100">
                                                             {' '}
              <strong className="text-indigo-700 block mb-2 text-lg">
                                          Análise por IA:{' '}
                {article.aiData.titulo}                       {' '}
              </strong>
                                                             {' '}
              <p className="whitespace-pre-wrap text-gray-700 mb-3">
                                          {article.aiData.resumo}               
                       {' '}
              </p>
                                                         {' '}
              {article.aiData.respostaDuvida && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                                             {' '}
                  <strong className="text-indigo-700 block mb-1">
                                                  Resposta à sua dúvida:        
                                       {' '}
                  </strong>
                                             {' '}
                  <p className="whitespace-pre-wrap text-gray-700">
                                                 {' '}
                    {article.aiData.respostaDuvida}                       {' '}
                  </p>
                                           {' '}
                </div>
              )}
                                     {' '}
              <div className="flex flex-wrap gap-2 mt-4">
                                         {' '}
                {article.aiData.palavrasChave.map((palavra, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                  >
                                              {palavra}                         
                     {' '}
                  </span>
                ))}
                                       {' '}
              </div>
              Note: The following 1 line(s) have been generated as part of a
              previous turn:                      {' '}
            </div>
          )}
                                           {' '}
        </div>
                   {' '}
      </div>
             {' '}
    </main>
  );
};

export default FullArticle;
