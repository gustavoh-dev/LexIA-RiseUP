export default function Info() {
  return (
    <section className="p-10 mt-20 text-center">
      <h2 className="text-3xl font-semibold text-blue-900 mb-4">
        Sobre o Projeto LexIA
      </h2>
      <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
        O LexIA é um sistema inteligente desenvolvido para facilitar o acesso à
        Constituição Federal. Ele permite buscas rápidas, claras e acessíveis,
        ajudando qualquer cidadão a entender seus direitos e deveres.
      </p>
      <img
        src="/images/planario.jpg"
        alt="Plenário"
        className="mt-6 rounded-lg shadow-lg mx-auto max-w-xl"
      />
    </section>
  );
}