export default function Saved() {
  const savedItems = [
    { title: "Artigo 5º - Direitos e Deveres Individuais e Coletivos" },
    { title: "Artigo 6º - Direitos Sociais" },
  ];

  return (
    <section className="p-10 mt-20 text-center">
      <h2 className="text-3xl font-semibold text-blue-900 mb-6">Itens Salvos</h2>
      {savedItems.length > 0 ? (
        <ul className="space-y-3">
          {savedItems.map((item, index) => (
            <li
              key={index}
              className="bg-gray-100 rounded-lg p-4 text-blue-900 shadow"
            >
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Você ainda não salvou nenhum artigo.</p>
      )}
    </section>
  );
}
