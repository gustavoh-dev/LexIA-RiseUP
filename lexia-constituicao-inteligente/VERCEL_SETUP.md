# 🚀 Guia de Configuração no Vercel

Este guia explica como configurar o projeto LexIA no Vercel de forma segura, protegendo a API Key do Gemini.

## 📋 Pré-requisitos

1. Conta no Vercel (gratuita)
2. API Key do Google Gemini (obtenha em: https://aistudio.google.com/app/apikey)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que o arquivo `.env` está no `.gitignore` (já está configurado).

### 2. Fazer Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório Git
4. O Vercel detectará automaticamente as configurações do `vercel.json`

### 3. Configurar Variáveis de Ambiente

**IMPORTANTE:** Esta é a parte mais crítica para proteger sua API Key!

1. No painel do projeto no Vercel, vá em **Settings** → **Environment Variables**
2. Adicione a seguinte variável:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Cole sua API Key do Gemini
   - **Environments:** Selecione todas (Production, Preview, Development)
3. Clique em **Save**

### 4. Configurar Build Settings (se necessário)

O Vercel deve detectar automaticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 5. Fazer Deploy

1. Clique em **Deploy**
2. Aguarde o build completar
3. Seu projeto estará disponível em uma URL do tipo: `seu-projeto.vercel.app`

## 🔒 Segurança

✅ **O que está protegido:**
- A API Key do Gemini está armazenada apenas como variável de ambiente no Vercel
- Nunca será exposta no código ou no repositório Git
- Apenas o servidor (serverless function) tem acesso à chave

❌ **O que NÃO fazer:**
- Nunca commite arquivos `.env` no Git
- Nunca coloque a API Key diretamente no código
- Nunca compartilhe a API Key publicamente

## 🧪 Testando Localmente

Para testar localmente antes de fazer deploy:

1. Crie um arquivo `.env` na raiz do projeto:
```env
GEMINI_API_KEY=sua_chave_aqui
VITE_API_BASE_URL=http://localhost:5001
```

2. Para rodar o backend local (opcional):
```bash
cd backend-proxy
npm install
npm start
```

3. Para rodar o frontend:
```bash
npm install
npm run dev
```

## 📝 Estrutura de Arquivos

```
lexia-constituicao-inteligente/
├── api/
│   └── resumir.js          # Serverless function do Vercel
├── src/
│   └── config.js           # Configuração (usa URL relativa no Vercel)
├── vercel.json             # Configuração do Vercel
├── .gitignore              # Protege arquivos .env
└── package.json            # Dependências (inclui @google/generative-ai)
```

## 🐛 Troubleshooting

### Erro: "GEMINI_API_KEY não encontrada"
- Verifique se a variável de ambiente foi configurada no Vercel
- Certifique-se de que selecionou todos os ambientes (Production, Preview, Development)
- Faça um novo deploy após adicionar a variável

### Erro: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
Este erro geralmente ocorre quando:
1. **A variável de ambiente GEMINI_API_KEY não está configurada no Vercel**
   - Vá em **Settings** → **Environment Variables**
   - Adicione `GEMINI_API_KEY` com sua chave
   - Faça um novo deploy após adicionar

2. **A função serverless não está retornando JSON válido**
   - Verifique os logs no Vercel: **Deployments** → Seu deploy → **Functions** → **api/resumir**
   - Procure por erros relacionados à API Key ou ao Gemini

3. **A API Key está incorreta ou sem créditos**
   - Verifique se a chave está correta em: https://aistudio.google.com/app/apikey
   - Verifique se há créditos disponíveis na conta do Gemini

### Erro: "Falha ao se comunicar com a IA" ou "Resposta vazia do servidor"
- A função serverless pode não estar sendo executada corretamente
- Verifique se o arquivo `api/resumir.js` está na raiz do projeto (não dentro de `src/`)
- Verifique os logs de runtime no Vercel
- Certifique-se de que a variável `GEMINI_API_KEY` está configurada

### API não está funcionando
- Verifique se o arquivo `api/resumir.js` está na raiz do projeto
- Verifique se a dependência `@google/generative-ai` está no `package.json`
- Veja os logs de build no Vercel
- Certifique-se de que o `vercel.json` está configurado corretamente

## 📚 Recursos Adicionais

- [Documentação do Vercel](https://vercel.com/docs)
- [Serverless Functions no Vercel](https://vercel.com/docs/functions)
- [Environment Variables no Vercel](https://vercel.com/docs/environment-variables)
- [Google Gemini API](https://ai.google.dev/docs)

