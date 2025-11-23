import React from 'react';

const CommonSearches = ({ onNavigate, setSearchQuery }) => {
  const commonSearches = [
    {
      icon: 'fa-balance-scale',
      title: 'Todos são iguais perante a lei?',
      search: 'Art. 5',
      article: 'Art. 5º',
      summary: 'Este artigo consagra o princípio da igualdade ao afirmar que todos são iguais perante a lei, sem qualquer forma de discriminação.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: 'fa-venus-mars',
      title: 'Homens e mulheres têm os mesmos direitos?',
      search: 'Art. 5',
      article: 'Art. 5º, I',
      summary: 'O artigo estabelece o princípio da igualdade entre homens e mulheres em direitos e obrigações.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: 'fa-gavel',
      title: 'O que é habeas corpus?',
      search: 'Art. 5',
      article: 'Art. 5º, LXVIII',
      summary: 'O habeas corpus é uma garantia constitucional que protege a liberdade de locomoção.',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: 'fa-home',
      title: 'Direito à moradia',
      search: 'Art. 6',
      article: 'Art. 6º',
      summary: 'A moradia é um direito social fundamental garantido pela Constituição.',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      icon: 'fa-heart',
      title: 'Direito à saúde',
      search: 'Art. 196',
      article: 'Art. 196',
      summary: 'A saúde é direito de todos e dever do Estado, garantido mediante políticas sociais e econômicas.',
      color: 'bg-red-50 border-red-200'
    },
    {
      icon: 'fa-graduation-cap',
      title: 'Direito à educação',
      search: 'Art. 205',
      article: 'Art. 205',
      summary: 'A educação é direito de todos e dever do Estado e da família, promovida e incentivada com a colaboração da sociedade.',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Direitos e garantias fundamentais',
      search: 'Art. 5',
      article: 'Art. 5º',
      summary: 'Os direitos e garantias fundamentais são cláusulas pétreas e não podem ser abolidos.',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      icon: 'fa-briefcase',
      title: 'Direitos trabalhistas',
      search: 'Art. 7',
      article: 'Art. 7º',
      summary: 'São direitos dos trabalhadores urbanos e rurais, além de outros que visem à melhoria de sua condição social.',
      color: 'bg-teal-50 border-teal-200'
    },
    {
      icon: 'fa-flag',
      title: 'Nacionalidade brasileira',
      search: 'Art. 12',
      article: 'Art. 12',
      summary: 'São brasileiros natos e naturalizados, com direitos e deveres estabelecidos pela Constituição.',
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      icon: 'fa-vote-yea',
      title: 'Direito de votar',
      search: 'Art. 14',
      article: 'Art. 14',
      summary: 'A soberania popular será exercida pelo sufrágio universal e pelo voto direto e secreto.',
      color: 'bg-pink-50 border-pink-200'
    }
  ];

  const handleSearch = (searchTerm) => {
    if (setSearchQuery) {
      setSearchQuery(searchTerm);
    }
    if (onNavigate) {
      onNavigate('search-results');
    }
  };

  return (
    <main className="relative bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col items-center pt-16 pb-12">
      <div className="w-full max-w-6xl px-4 md:px-6">
        <div className="text-center mb-8 mt-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <i className="fas fa-search text-blue-600" style={{ fontSize: '36px' }}></i>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Buscas Comuns</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore os temas mais procurados da Constituição Federal. Clique em qualquer card para fazer a busca.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {commonSearches.map((search, index) => (
            <div
              key={index}
              onClick={() => handleSearch(search.search)}
              className={`${search.color} border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white rounded-full p-3 shadow-md">
                  <i className={`fas ${search.icon} text-2xl text-blue-600`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{search.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {search.article}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{search.summary}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                <span className="text-blue-600 font-semibold text-sm flex items-center gap-2">
                  <i className="fas fa-search"></i>
                  Buscar agora
                </span>
                <i className="fas fa-arrow-right text-blue-600"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <i className="fas fa-lightbulb text-3xl text-blue-600 mb-3"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Não encontrou o que procura?</h3>
          <p className="text-gray-600 mb-4">
            Use a busca principal para encontrar qualquer artigo da Constituição Federal.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Ir para Busca Principal
          </button>
        </div>
      </div>
    </main>
  );
};

export default CommonSearches;