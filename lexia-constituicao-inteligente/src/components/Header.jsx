import React, { useState } from 'react';

const Header = ({ onNavigate, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (section) => {
    if (onNavigate) onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg fixed top-0 left-0 w-full z-50 h-16 font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center relative">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); handleNav('home'); }}
          className="flex items-center hover:opacity-80 transition-opacity 
                     absolute md:relative left-4 md:left-0 
                     top-1/2 md:top-auto transform -translate-y-1/2 md:translate-y-0
                     md:h-20"
        >
          <img 
            src="/images/logo LexIA.png" 
            alt="Logo LexIA" 
            className="h-20 w-auto object-contain" 
          />
        </a>

        <button
          className="md:hidden text-2xl p-2 text-blue-100 focus:outline-none ml-auto" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>


        <nav className="hidden md:flex flex-1 items-center justify-between md:ml-auto">
          <div className="flex justify-center flex-1 space-x-6">
            <NavItem 
              icon="fas fa-compass" 
              text="Buscas comuns" 
              isActive={activeSection === 'common-searches'}
              onClick={() => handleNav('common-searches')} 
            />
            <NavItem 
              icon="fas fa-save" 
              text="Salvos" 
              isActive={activeSection === 'saved'}
              onClick={() => handleNav('saved')} 
            />
          </div>

          <div className="flex space-x-6 border-l border-blue-700 pl-6">
            <NavItem text="Início" onClick={() => handleNav('home')} />
            <NavItem text="Sobre nós" onClick={() => handleNav('info')} />
            <NavItem text="Contato" onClick={() => handleNav('contact')} />
          </div>
        </nav>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-blue-800 border-t border-blue-700 absolute w-full left-0 top-16 shadow-xl animate-fade-in">
          <div className="flex flex-col p-4 space-y-2">
            <MobileNavItem 
              icon="fas fa-compass" 
              text="Buscas comuns" 
              onClick={() => handleNav('common-searches')} 
            />
            <MobileNavItem 
              icon="fas fa-save" 
              text="Salvos" 
              onClick={() => handleNav('saved')} 
            />
            <hr className="border-blue-600 my-2 opacity-50" />
            <MobileNavItem text="Início" onClick={() => handleNav('home')} />
            <MobileNavItem text="Sobre nós" onClick={() => handleNav('info')} />
            <MobileNavItem text="Contato" onClick={() => handleNav('contact')} />
          </div>
        </nav>
      )}
    </header>
  );
};

const NavItem = ({ icon, text, onClick, isActive }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-2 transition-colors duration-200 font-medium text-base hover:text-blue-200
      ${isActive ? 'text-blue-300 font-bold' : 'text-white'}
    `}
  >
    {icon && <i className={icon}></i>}
    <span>{text}</span>
  </button>
);

const MobileNavItem = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-900 transition text-white"
  >
    {icon && <i className={`${icon} w-6 text-center text-blue-300`}></i>}
    <span className="text-lg">{text}</span>
  </button>
);

export default Header;