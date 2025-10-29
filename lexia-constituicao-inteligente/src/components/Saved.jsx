import React, { useState } from 'react';

const Saved = () => {
  const [savedStates, setSavedStates] = useState([false, false, false]);

  const toggleSave = (index) => {
    const novosSavedStates = [...savedStates];
    novosSavedStates[index] = !novosSavedStates[index];
    setSavedStates(novosSavedStates);
    // Lógica de salvamento/desalvamento aqui
  };

  // ATENÇÃO: Corrigi um pequeno erro de sintaxe no seu 'className'.
  // O correto é usar crases (``) para misturar classes com variáveis (template literals).
  return (
    <main className="relative bg-white min-h-screen flex flex-col items-center pt-16 pb-8">
      <div className="w-full max-w-4xl px-6">
        <div className="search-header">
          <i className="fas fa-save search-header-icon" style={{ fontSize: '40px' }}></i>
          Salvos:
        </div>
        <div className="card-grid">
          <div className="search-card">
            <div className="card-header">
              <div className="card-title">Todos são iguais perante a lei?</div>
              <button className={`save-btn ${savedStates[0] ? 'saved' : ''}`} onClick={() => toggleSave(0)}>
                <i className="fas fa-bookmark"></i>
              </button>
            </div>
            <div className="legal-base">Base legal: Caput do Art. 5º da CF/88 → "Todos são iguais perante a lei, sem distinção de qualquer natureza."</div>
            <div className="summary">Resumo: Este artigo consagra o princípio da igualdade ao afirmar que todos são iguais perante a lei, sem qualquer forma de discriminação. Este princípio é fundamental para a democracia e garante que não haja privilégios ou discriminações baseadas em raça, sexo, cor, idade, origem, religião, orientação sexual ou qualquer outra condição.</div>
            <div className="card-actions">
              <button className="summarize-btn" onClick={() => { /* Funcionalidade futura */ }}>Resumir com IA</button>
              <a href="#" className="view-full">Ver completo</a>
            </div>
          </div>
          <div className="search-card">
            <div className="card-header">
              <div className="card-title">Homens e mulheres têm os mesmos direitos?</div>
              <button className={`save-btn ${savedStates[1] ? 'saved' : ''}`} onClick={() => toggleSave(1)}>
                <i className="fas fa-bookmark"></i>
              </button>
            </div>
            <div className="legal-base">Base legal: Art. 5º, inciso I da CF/88 → "Homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição."</div>
            <div className="summary">Resumo: O artigo estabelece o princípio da igualdade entre homens e mulheres em direitos e obrigações. Este dispositivo garante que não pode haver distinção ou discriminação de gênero no exercício de direitos civis, políticos, sociais ou trabalhistas.</div>
            <div className="card-actions">
              <button className="summarize-btn" onClick={() => { /* Funcionalidade futura */ }}>Resumir com IA</button>
              <a href="#" className="view-full">Ver completo</a>
            </div>
          </div>
          <div className="search-card">
            <div className="card-header">
              <div className="card-title">O que é liberdade de expressão?</div>
              <button className={`save-btn ${savedStates[2] ? 'saved' : ''}`} onClick={() => toggleSave(2)}>
                <i className="fas fa-bookmark"></i>
              </button>
            </div>
            <div className="legal-base">Base legal: Art. 5º, inciso IV da CF/88 → "É livre a manifestação do pensamento, sendo vedado o anonimato."</div>
            <div className="summary">Resumo: Este artigo garante a liberdade de expressão como um direito fundamental, permitindo que todos expressem suas opiniões, mas proíbe o anonimato para responsabilização. É essencial para a democracia, com limites para evitar abusos.</div>
            <div className="card-actions">
              <button className="summarize-btn" onClick={() => { /* Funcionalidade futura */ }}>Resumir com IA</button>
              <a href="#" className="view-full">Ver completo</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Saved;