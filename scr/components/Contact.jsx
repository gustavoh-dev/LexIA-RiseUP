export default function Contact() {
  return (
    <section className="p-10 mt-20 text-center">
      <h2 className="text-3xl font-semibold text-blue-900 mb-4">Contato</h2>
      <p className="text-gray-700 mb-6">
        Tem alguma dúvida, sugestão ou feedback? Entre em contato conosco:
      </p>
      <form className="max-w-lg mx-auto flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Seu nome"
          className="border rounded-lg p-3 outline-none"
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          className="border rounded-lg p-3 outline-none"
        />
        <textarea
          rows="4"
          placeholder="Sua mensagem..."
          className="border rounded-lg p-3 outline-none"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}