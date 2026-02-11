# YB Importa - Frontend

Frontend do sistema de gestão financeira desenvolvido com React 18 + Vite.

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Requisições HTTP
- **TailwindCSS 4** - Estilização
- **date-fns** - Manipulação de datas
- **xlsx** - Exportação para Excel

## 🚀 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Acessar em http://localhost:5173
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

## 📦 Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

### Build da imagem

```bash
docker build -t yb-frontend .
```

### Rodar container

```bash
docker run -p 8080:80 yb-frontend
```

## 🚀 Deploy no Easypanel

Veja o guia completo em [DEPLOY.md](./DEPLOY.md)

**Resumo:**
1. Configure `VITE_API_URL` nas variáveis de ambiente
2. Use o Dockerfile incluído
3. Configure domínio e SSL
4. Deploy!

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas do sistema
├── services/       # Serviços de API
├── hooks/          # Custom hooks
├── utils/          # Utilitários (máscaras, formatação)
└── App.jsx         # Componente principal
```

## 🎨 Componentes Principais

- **ActionButtons** - Botões de ação padronizados
- **StatCard** - Cards de estatísticas
- **ClienteAutocomplete** - Busca de clientes
- **ProdutoAutocomplete** - Busca de produtos
- **ComprovanteVenda** - Comprovante imprimível

## 📱 Responsividade

Design mobile-first com breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## 🔗 Integração com Backend

O frontend se comunica com a API Laravel através do Axios:

```javascript
// src/services/api.js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

## 📄 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código

## 🐛 Troubleshooting

### Erro de conexão com API
Verifique se:
1. Backend está rodando em `http://localhost:8000`
2. `VITE_API_URL` está configurado corretamente
3. CORS está habilitado no backend

### Build falha
1. Delete `node_modules` e `package-lock.json`
2. Execute `npm install` novamente
3. Tente `npm run build` novamente

---

**Desenvolvido para YB Importa** 🚀
