import React from 'react';

const CommonSearches = () => (
  <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
    <div className="w-full max-w-4xl px-6">
      <div className="search-header">
        <i className="fas fa-search search-header-icon" style={{ fontSize: '40px' }}></i>
        Buscas Comuns:
      </div>
      
      <div className="search-card">
        <div className="card-header">
          <div className="card-title">Todos são iguais perante a lei?</div>
        </div>
        <div className="legal-base">Base legal: Caput do Art. 5º da CF/88 → "Todos são iguais perante a lei, sem distinção de qualquer natureza."</div>
        <div className="summary">Resumo: Este artigo consagra o princípio da igualdade ao afirmar que todos são iguais perante a lei, sem qualquer forma de discriminação. Este princípio é fundamental para a democracia e garante que não haja privilégios ou discriminações baseadas em raça, sexo, cor, idade, origem, religião, orientação sexual ou qualquer outra condição.</div>
        <a href="#" className="view-full">Ver completo</a>
      </div>

      <div className="search-card">
        <div className="card-header">
          <div className="card-title">Homens e mulheres têm os mesmos direitos?</div>
        </div>
        <div className="legal-base">Base legal: Art. 5º, inciso I da CF/88 → "Homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição."</div>
        <div className="summary">Resumo: O artigo estabelece o princípio da igualdade entre homens e mulheres em direitos e obrigações. Este dispositivo garante que não pode haver distinção ou discriminação de gênero no exercício de direitos civis, políticos, sociais ou trabalhistas.</div>
        <a href="#" className="view-full">Ver completo</a>
      </div>

      <div className="search-card">
        <div className="card-header">
          <div className="card-title">O que é habeas corpus?</div>
        </div>
        <div className="legal-base">Base legal: Art. 5º, inciso LXVIII da CF/88 → "Conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção."</div>
        <div className="summary">Resumo: O habeas corpus é uma garantia constitucional que protege a liberdade de locomoção, sendo utilizado para proteger uma pessoa contra prisão ou ameaça ilegal. Pode ser solicitado por qualquer pessoa em nome de outrem.</div>
        <a href="#" className="view-full">Ver completo</a>
      </div>
    </div>
  </main>
);

export default CommonSearches;