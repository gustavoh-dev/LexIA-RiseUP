export default function CommonSearches() {
  const searches = [
    "Direitos Fundamentais",
    "Educação",
    "Trabalho",
    "Meio Ambiente",
    "Família",
    "Saúde",
  ];

  return (
    <section className="p-10 mt-20 text-center">
      <h2 className="text-3xl font-semibold text-blue-900 mb-6">
        Buscas Comuns
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {searches.map((item, index) => (
          <button
            key={index}
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 py-3 rounded-lg shadow"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
