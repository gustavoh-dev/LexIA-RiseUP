// Header.js
export default function Header({ onNavigate }) {
  return (
    <header className="bg-blue-900 text-white p-4 flex justify-between items-center fixed w-full top-0 z-10 h-16">
      <div className="flex items-center">
        <img src="./images/logo LexIA.png" alt="Logo LexIA" className="h-20 max-h-full" />
      </div>
      <nav className="flex items-center w-full">
        <div className="flex justify-center flex-1 space-x-4">
          <a href="#" onClick={() => onNavigate('home')} className="hover:underline">Início</a>
          <a href="#" onClick={() => onNavigate('info')} className="hover:underline">Sobre nós</a>
          <a href="#" onClick={() => onNavigate('contact')} className="hover:underline">Contato</a>
        </div>
      </nav>
    </header>
  );
}
