export default function MainContent({ setSearchQuery, setActiveSection }) {
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements.search.value;
    setSearchQuery(query);
    setActiveSection("search-results");
  };

  return (
    <main className="flex flex-col items-center justify-center text-center min-h-screen bg-[url('/images/background.jpg')] bg-cover bg-center p-10">
      <div className="bg-white/80 p-10 rounded-2xl shadow-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Constituição Inteligente com LexIA
        </h1>
        <p className="text-gray-700 mb-8">
          Explore, aprenda e compreenda seus direitos de forma simples e
          interativa.
        </p>
        <form
          onSubmit={handleSearch}
          className="flex bg-white shadow rounded-lg overflow-hidden"
        >
          <input
            type="text"
            name="search"
            placeholder="Pesquise um artigo ou palavra-chave..."
            className="flex-grow p-3 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 hover:bg-blue-800 transition"
          >
            Buscar
          </button>
        </form>
      </div>
    </main>
  );
}
