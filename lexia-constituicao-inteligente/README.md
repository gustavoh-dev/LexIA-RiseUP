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
- 🤖 **Resumo com IA**: Geração de resumos simplificados usando Google Generative AI
- 💾 **Salvar Favoritos**: Sistema de salvamento local para artigos favoritos
- 📱 **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos
- 🎯 **Buscas Comuns**: Acesso rápido a temas frequentes

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.1.7** - Build tool e dev server
- **Fuse.js 7.1.0** - Biblioteca de busca fuzzy
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.19.2** - Framework web
- **Google Generative AI** - API para geração de resumos
- **CORS** - Middleware para requisições cross-origin

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositório>
   cd lexia-constituicao-inteligente
   ```

2. **Instale as dependências do frontend**
   ```bash
   npm install
   ```

3. **Instale as dependências do backend**
   ```bash
   cd backend-proxy
   npm install
   cd ..
   ```

4. **Configure as variáveis de ambiente do backend**
   
   Crie um arquivo `.env` na pasta `backend-proxy`:
   ```env
   GOOGLE_AI_API_KEY=sua-chave-api-aqui
   PORT=5001
   ```

5. **Inicie o servidor backend**
   ```bash
   cd backend-proxy
   node server.js
   ```

6. **Em outro terminal, inicie o servidor de desenvolvimento do frontend**
   ```bash
   npm run dev
   ```

7. **Acesse a aplicação**
   
   Abra seu navegador em `http://localhost:5173` (ou a porta indicada pelo Vite)

## 🚀 Scripts Disponíveis

### Frontend

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter ESLint

### Backend

- `node server.js` - Inicia o servidor backend na porta 5001

## 📁 Estrutura do Projeto

```
lexia-constituicao-inteligente/
├── backend-proxy/          # Servidor backend para API de resumos
│   ├── server.js           # Servidor Express
│   └── package.json
├── public/                 # Arquivos estáticos
│   └── images/            # Imagens da aplicação
├── src/
│   ├── components/        # Componentes React
│   │   ├── CommonSearches.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── FullArticle.jsx
│   │   ├── Header.jsx
│   │   ├── Info.jsx
│   │   ├── MainContent.jsx
│   │   ├── Saved.jsx
│   │   ├── SearchCard.jsx
│   │   └── SearchResults.jsx
│   ├── data/              # Dados da Constituição
│   ├── utils/             # Utilitários
│   │   ├── formatUtils.js
│   │   └── processaConstituicao.js
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Como Usar

1. **Buscar Artigos**: Digite sua dúvida na barra de busca e pressione Enter ou clique em "Buscar"
2. **Visualizar Resultados**: Os resultados aparecerão em cards com informações dos artigos
3. **Ver Artigo Completo**: Clique em um card para ver o artigo completo
4. **Gerar Resumo**: Na visualização completa, use o botão de resumo para obter uma explicação simplificada
5. **Salvar Favoritos**: Clique no ícone de salvar para adicionar artigos aos favoritos
6. **Acessar Favoritos**: Use o menu para acessar seus artigos salvos

## 🔧 Configuração da API

Para usar a funcionalidade de resumo com IA, você precisa:

1. Obter uma chave de API do Google Generative AI
2. Criar o arquivo `.env` na pasta `backend-proxy`
3. Adicionar sua chave: `GOOGLE_AI_API_KEY=sua-chave-aqui`

**Nota**: A funcionalidade de resumo é opcional. A aplicação funciona normalmente sem ela, apenas sem a geração de resumos.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob licença. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

O LexIA foi criado por um grupo de estudantes e pesquisadores inovadores por tecnologia social da informação. Nosso objetivo é unir direito, linguagem e inteligência artificial para facilitar o entendimento da Constituição Federal e fortalecer a relação entre o cidadão e o Estado.

## 📧 Contato

Para mais informações, entre em contato através da seção de contato na aplicação.

## 🙏 Agradecimentos

- Equipe de desenvolvimento
- Comunidade open source
- Todos os contribuidores

---

**Desenvolvido com ❤️ para promover o acesso democrático ao conhecimento jurídico**

