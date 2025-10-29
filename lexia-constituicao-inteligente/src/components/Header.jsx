import React from 'react';

// Note a mudança no caminho da imagem para "/images/..."
const Header = ({ onNavigate }) => (
  <header className="bg-blue-900 text-white p-4 flex justify-between items-center fixed w-full top-0 z-10 h-16">
    <div className="flex items-center">
      <img src="/images/logo LexIA.png" alt="Logo LexiA" className="h-20 max-h-full" />
    </div>
    <nav className="flex items-center w-full">
      <div className="flex justify-center flex-1 space-x-4">
        <a href="#" onClick={() => onNavigate('common-searches')} className="hover:underline">
          <i className="fas fa-compass header-icon"></i> Buscas comuns
        </a>
        <a href="#" onClick={() => onNavigate('saved')} className="hover:underline">
          <i className="fas fa-save header-icon"></i> Salvos
        </a>
      </div>
      <div className="space-x-4">
        <a href="#" onClick={() => onNavigate('home')} className="hover:underline">Início</a>
        <a href="#" onClick={() => onNavigate('info')} className="hover:underline">Sobre nós</a>
        <a href="#" onClick={() => onNavigate('contact')} className="hover:underline">Contato</a>
      </div>
    </nav>
  </header>
);

export default Header;