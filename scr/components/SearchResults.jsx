export default function SearchResults({ setSearchQuery, setActiveSection }) {
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements.search.value;
    setSearchQuery(query);
    setActiveSection("results");
  };

  return (
    <section className="flex flex-col items-center justify-center text-center p-10 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Pesquise na Constituição
      </h1>
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md flex bg-white shadow-md rounded-lg overflow-hidden"
      >
        <input
          type="text"
          name="search"
          placeholder="Digite um artigo, termo ou palavra-chave..."
          className="flex-grow p-3 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-900 text-white px-6 hover:bg-blue-800 transition"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}
