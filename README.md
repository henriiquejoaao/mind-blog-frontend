# Mind Blog - Frontend

Frontend do projeto **Mind Blog**, uma plataforma de artigos de tecnologia desenvolvida como parte de um case técnico.

A aplicação permite explorar artigos, visualizar detalhes, criar conta, fazer login, gerenciar artigos, comentar, curtir e acompanhar estatísticas no dashboard.

## 🔗 Repositórios

- Frontend: `Chttps://github.com/henriiquejoaao/mind-blog-frontend`
- Backend: `https://github.com/henriiquejoaao/mind-blog-backend`

## 🚀 Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- React Markdown
- Remark GFM
- CSS
- SVG Icons

## 📌 Funcionalidades

### Funcionalidades públicas

- Página inicial com artigos em destaque
- Artigos em destaque ordenados por maior quantidade de curtidas
- Listagem de todos os artigos
- Filtro por categoria
- Alternância entre layout em grid e lista
- Visualização detalhada de artigos
- Conteúdo do artigo renderizado em Markdown
- Contagem real de visualizações
- Contagem real de curtidas
- Contagem real de comentários
- Botão de compartilhar que copia o link do artigo

### Autenticação

- Cadastro de usuário
- Login
- Logout
- Rotas privadas protegidas
- Header adaptado conforme usuário logado ou deslogado

### Área autenticada

- Dashboard do usuário
- Estatísticas reais dos artigos do usuário:
  - Total de artigos
  - Visualizações
  - Curtidas
  - Comentários
- Atividade recente baseada em comentários reais nos artigos do usuário
- Criação de artigo com:
  - Título
  - Resumo
  - Categoria
  - Tags
  - Imagem de capa
  - Conteúdo em Markdown
- Edição de artigo
- Remoção da imagem do artigo
- Exclusão de artigo
- Configurações de perfil
- Upload e remoção de foto de perfil
- Atualização visual do avatar no header, detalhes do post e comentários

## 🎁 Melhorias extras implementadas

Além do escopo principal, foram adicionadas melhorias de experiência e funcionalidades extras:

- Layout responsivo
- Alternância de visualização em grid/lista na página de artigos
- Renderização de conteúdo em Markdown
- Feedback visual ao criar artigo
- Feedback ao copiar link do artigo
- Avatar personalizado do usuário
- Fallback com inicial do usuário quando não há foto
- Dashboard com estatísticas reais
- Atividade recente baseada em comentários reais
- Proteção de rotas privadas
- Filtros por categoria
- Uso de ícones SVG personalizados
- Página de configurações de perfil
- Remoção de imagem em posts
- Organização de artigos por curtidas na Home

## 📁 Estrutura principal

```txt
src
├── assets
├── components
│   ├── Footer
│   ├── Header
│   └── PostCard
├── pages
│   ├── Dashboard
│   ├── EditPost
│   ├── Home
│   ├── Login
│   ├── NewPost
│   ├── PostDetails
│   ├── Posts
│   ├── Register
│   └── Settings
├── routes
│   ├── AppRoutes
│   ├── PrivateRoute
│   └── ScrollToTop
└── services
    └── api
```

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/henriiquejoaao/mind-blog-frontend
```

### 2. Acesse a pasta do projeto

```bash
cd frontend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure a URL da API

Verifique o arquivo:

```txt
src/services/api.ts
```

A URL deve apontar para o backend:

```ts
baseURL: "http://localhost:3333"
```

### 5. Rode o projeto

```bash
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

## 🧪 Build de produção

```bash
npm run build
```

## 🔐 Observação sobre autenticação

O token JWT retornado pelo backend é salvo no `localStorage` e utilizado nas rotas protegidas da aplicação.

## 📝 Observações finais

Este repositório contém apenas o frontend.

Para funcionamento completo, é necessário rodar também o backend e configurar o banco de dados conforme instruções do repositório backend.