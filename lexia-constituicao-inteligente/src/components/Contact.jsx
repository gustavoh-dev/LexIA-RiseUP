import React from 'react';

const Contact = () => (
  <main className="relative bg-white text-black min-h-screen flex flex-col items-center pt-16 pb-8">
    <div className="w-full max-w-4xl px-6">
      <div className="search-header">
        <i className="fas fa-envelope search-header-icon" style={{ fontSize: '40px' }}></i>
        Fale Conosco
      </div>
      <div className="flex flex-nowrap gap-6 justify-center">
        <div className="search-card w-1/3 min-w-[300px]">
          <div className="card-title">Mensagem</div>
          <div className="contact-form">
            <input type="text" placeholder="Nome" />
            <input type="email" placeholder="E-mail" />
            <textarea placeholder="Sua mensagem" rows="4"></textarea>
            <button className="bg-blue-700">Enviar</button>
          </div>
          <p className="text-center mt-2">Sua mensagem será enviada para: <a href="mailto:suporte.lexia@gmail.com" className="underline">suporte.lexia@gmail.com</a></p>
        </div>
        <div className="search-card w-1/3 min-w-[300px]">
          <div className="card-title">Endereço</div>
          <p className="legal-base">Endereço: Avenida das Ondas Claras, nº 742 - Bairro Jardim do Sol, Cidade: Recife - PE, Brasil<br />CEP: 50987-325</p>
        </div>
        <div className="search-card w-1/3 min-w-[300px]">
          <div className="card-title">Dados Institucionais</div>
          <p className="legal-base">Nome da empresa/projeto: LexIA - Constituição Inteligente<br />CNPJ: 45.678.123/0001-56 (fictício)<br />Sede: Recife, Pernambuco - Brasil<br />Ano de fundação: 2025<br />Responsável técnico: Equipe de Desenvolvimento LexIA</p>
        </div>
      </div>
      <div className="search-card mt-6">
        <div className="card-title">Contatos</div>
        <p className="legal-base text-center">E-mail geral: <a href="mailto:contato.lexia@gmail.com" className="underline">contato.lexia@gmail.com</a><br />Suporte técnico: <a href="mailto:suporte.lexia@gmail.com" className="underline">suporte.lexia@gmail.com</a></p>
      </div>
    </div>
  </main>
);

export default Contact;