import React from 'react';

// Note a mudança no caminho da imagem
const Footer = () => (
  <footer className="bg-white text-black p-4 flex items-center">
    <img src="/images/logo.png" alt="Logo" className="w-14 h-auto mr-4" />
    <p className="flex-1 text-center">© 2025 Constituição Inteligente. Todos os direitos reservados.</p>
  </footer>
);

export default Footer;