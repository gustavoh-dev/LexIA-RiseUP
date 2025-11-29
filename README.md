# LexIA - Constituição Inteligente

Uma plataforma digital voltada para facilitar o acesso e o entendimento da Constituição Federal Brasileira, utilizando inteligência artificial e linguagem simplificada.

## 📋 Sobre o Projeto

O LexIA é uma aplicação web desenvolvida para promover um entendimento jurídico mais acessível, inclusivo e compreensível para qualquer cidadão, independentemente do nível de conhecimento em direito fundamental. A tecnologia serve como elo entre a Constituição e a população.

### Missão

Promover o acesso democrático e inclusivo ao conhecimento jurídico, aproximando os cidadãos da Constituição Federal por meio da tecnologia e da linguagem simplificada. Nosso propósito é traduzir termos técnicos e complexos do direito em uma comunicação clara, objetiva e acessível.

### Valores

- **Acessibilidade**: tornar o conteúdo legal compreensível a todos
- **Transparência**: oferecer informações seguras e confiáveis
- **Inovação**: usar tecnologia para aproximar o cidadão das leis
- **Inclusão**: respeitar as diferenças linguísticas e cognitivas
- **Cidadania**: incentivar o conhecimento dos direitos e deveres de cada pessoa

## ✨ Funcionalidades

- 🔍 **Busca Inteligente**: Busca fuzzy na Constituição Federal usando Fuse.js
- 📄 **Visualização de Artigos**: Visualização completa de artigos constitucionais
- 🤖 **Resumo com IA**: Geração de resumos simplificados usando Google Gemini
- 💬 **Perguntas à IA**: Faça perguntas específicas sobre artigos e receba respostas da IA
- 💾 **Salvar Favoritos**: Sistema de salvamento local para artigos favoritos
- 📜 **Histórico de Buscas**: Acompanhe suas buscas anteriores
- 📱 **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos
- 🎯 **Buscas Comuns**: Acesso rápido a temas frequentes da Constituição
- 🚀 **Deploy no Vercel**: Configurado para deploy com serverless functions

## 🛠️ Tecnologias Utilizadas

### Frontend
- React + Vite
- Tailwind CSS
- Fuse.js
- Axios

### Backend / IA
- Vercel Serverless Functions (recomendado para produção)
- Google Generative AI (Gemini)
- Express (opcional para desenvolvimento local, se preferir rodar um proxy próprio)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm

### Passo a Passo
1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd lexia-constituicao-inteligente
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente**
   Crie um arquivo `.env` na raiz (para desenvolvimento local):
   ```env
   VITE_API_BASE_URL=http://localhost:5173        # ou a URL do app em produção
   VITE_GEMINI_API_KEY=opcional_para_teste_local  # NÃO usar em produção
   GEMINI_API_KEY=sua-chave-do-gemini             # usada nas serverless
   ```
   - Em produção, use apenas `GEMINI_API_KEY` nas serverless functions e ajuste o frontend para chamar a rota `/api/gemini`.

4. **Rodar o projeto em desenvolvimento**
   ```bash
   npm run dev
   ```
   Abra o navegador em `http://localhost:5173`.

## 🚀 Deploy no Vercel
1. Conecte o repositório na Vercel.
2. Em *Settings → Environment Variables*, adicione:
   - `GEMINI_API_KEY` (Production/Preview/Development)
   - `VITE_API_BASE_URL` apontando para a URL do app (ex.: `https://seuapp.vercel.app`).
3. Crie uma serverless `/api/gemini` que chama o Gemini com `process.env.GEMINI_API_KEY` e retorne o JSON para o frontend. (Se já existir, apenas configure as envs.)
4. Deploy.

Para instruções adicionais, veja `VERCEL_SETUP.md`.

## 🚀 Scripts Disponíveis
- `npm run dev` - servidor de desenvolvimento
- `npm run build` - build de produção
- `npm run preview` - preview da build
- `npm run lint` - linter

## 📁 Estrutura do Projeto
```
lexia-constituicao-inteligente/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── shared/
├── vercel.json
├── VERCEL_SETUP.md
└── README.md
```

## 🎯 Como Usar
1. Buscar artigos ou temas na barra de busca.
2. Abrir um card e clicar em "Ver completo" para ler o artigo.
3. Gerar resumo ou tirar dúvidas com a IA (se a chave estiver configurada).
4. Salvar artigos no marcador e consultar em "Salvos".
5. Acompanhar pesquisas em "Histórico".

## 🔧 Configuração da API / IA
- Gere uma chave do Gemini em https://aistudio.google.com/app/apikey.
- Produção: mantenha a chave apenas em `GEMINI_API_KEY` (serverless). Não exponha `VITE_GEMINI_API_KEY`.
- Se os endpoints `/api/buscar` ou `/api/gemini` não estiverem disponíveis, o app funcionará sem IA (apenas desabilite/trate os botões para evitar erro).

## 🤝 Contribuindo
1. Faça fork
2. Crie branch (`git checkout -b feature/...`)
3. Commit (`git commit -m "feat: ..."`)
4. Push e abra PR

## 📝 Licença
Veja `LICENSE`.

## 📧 Contato
Use a seção de contato na aplicação ou abra uma issue.

---
**Desenvolvido com ❤️ para promover o acesso democrático ao conhecimento jurídico**
