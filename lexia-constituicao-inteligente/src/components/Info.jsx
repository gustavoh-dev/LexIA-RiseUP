import React from 'react';

const Info = () => (
  <main className="relative bg-white text-black min-h-screen flex flex-col items-center pt-16 pb-8">
    <div className="w-full">
      <div className="w-full mb-6">
        <img src="/images/planario.jpg" alt="Imagem Sobre Nós" className="full-width-image" />
      </div>
      <div className="px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6 text-center">Sobre nós</h1>
        <h2 className="text-xl font-bold text-black mb-4">Sobre o LexIA:</h2>
        <div className="info-card">
          <div className="legal-base">
            O LexIA é uma plataforma digital voltada para facilitar o acesso e o entendimento da Constituição Federal Brasileira, utilizando inteligência artificial e linguagem simplificada. Desenvolvido por uma equipe de especialistas em tecnologia, com o objetivo de promover um entendimento jurídico mais acessível, inclusivo e compreensível para qualquer cidadão, independentemente do nível de conhecimento que ele tenha em direito fundamental — e a tecnologia pode ser o elo entre a Constituição e a população.
          </div>
        </div>
        <h2 className="text-xl font-bold text-black mb-4 mt-6">Missão:</h2>
        <div className="info-card">
          <div className="legal-base">
            Promover o acesso democrático e inclusivo ao conhecimento jurídico, aproximando os cidadãos da Constituição Federal por meio da tecnologia e da linguagem simplificada. Nosso propósito é traduzir termos técnicos e complexos do direito em uma comunicação clara, objetiva e acessível, permitindo que qualquer pessoa, independentemente de seu nível de escolaridade ou familiaridade com o universo jurídico, possa compreender seus direitos e deveres de maneira prática e fortalecendo a democracia e a cidadania plena, para que o cidadão tenha uma relação com a Constituição, tornando-o um instrumento de aprendizado, conscientização e empoderamento social.
          </div>
        </div>
        <h2 className="text-xl font-bold text-black mb-4 mt-6">Valores:</h2>
        <div className="info-card">
          <div className="legal-base">
            - Acessibilidade: tornar o conteúdo legal compreensível a todos.<br />
            - Transparência: oferecer informações seguras e confiáveis.<br />
            - Inovação: usar tecnologia para aproximar o cidadão das leis.<br />
            - Inclusão: respeitar as diferenças linguísticas e cognitivas.<br />
            - Cidadania: incentivar o conhecimento dos direitos e deveres de cada pessoa.
          </div>
        </div>
        <h2 className="text-xl font-bold text-black mb-4 mt-6">Quem somos:</h2>
        <div className="info-card">
          <div className="legal-base">
            O LexIA foi criado por um grupo de estudantes e pesquisadores inovadores por tecnologia social da informação. Nosso objetivo é unir direito, linguagem e inteligência artificial para facilitar o entendimento da Constituição Federal e fortalecer a relação entre o cidadão e o Estado.
          </div>
        </div>
        <h2 className="text-xl font-bold text-black mb-4 mt-6">Informações Institucionais:</h2>
        <div className="info-card">
          <div className="legal-base">
            Nome da empresa/projeto: LexIA - Constituição Inteligente<br />
            CNPJ: 45.678.123/0001-56 (fictício)<br />
            Sede: Recife, Pernambuco - Brasil<br />
            Ano de fundação: 2025<br />
            Responsável técnico: Equipe de Desenvolvimento LexIA
          </div>
        </div>
        <div className="text-base text-center mx-auto max-w-md mt-6">
          <h2 className="text-xl font-bold mb-2">Nos apoie!</h2>
          <p className="mb-2">
            Quer nos ajudar a tornar o acesso às leis ainda mais simples?<br />
            Envie suas sugestões e ideias para <a href="mailto:contato.lexia@gmail.com" className="underline">contato.lexia@gmail.com</a>.<br />
            Cada opinião conta para fortalecer a cidadania digital.
          </p>
        </div>
      </div>
    </div>
  </main>
);

export default Info;