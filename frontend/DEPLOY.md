# 🐳 Deploy do Frontend no Easypanel (Netcup)

Este guia mostra como fazer o deploy do frontend React no Easypanel.

## 📋 Arquivos Criados

- ✅ **Dockerfile** - Build multi-stage (Node.js + Nginx)
- ✅ **nginx.conf** - Configuração do servidor web
- ✅ **.dockerignore** - Arquivos excluídos do build
- ✅ **.env.production** - Variáveis de ambiente de produção

## 🚀 Passo a Passo no Easypanel

### 1. Criar Novo App no Easypanel

1. Acesse seu painel Easypanel
2. Clique em **"Create App"**
3. Escolha **"From Source"** (GitHub/GitLab)
4. Conecte seu repositório

### 2. Configurar o Build

**Build Settings:**
- **Build Method:** Dockerfile
- **Dockerfile Path:** `frontend/Dockerfile`
- **Context Path:** `frontend`

### 3. Configurar Variáveis de Ambiente

No Easypanel, adicione as seguintes variáveis de ambiente:

```env
VITE_API_URL=https://api.seudominio.com/api
```

> **Importante:** Substitua `https://api.seudominio.com` pela URL real do seu backend Laravel.

### 4. Configurar Porta

- **Port:** 80 (porta exposta pelo Nginx)

### 5. Configurar Domínio

1. Vá em **"Domains"**
2. Adicione seu domínio (ex: `app.seudominio.com`)
3. Ative SSL/HTTPS automático

### 6. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Acesse seu domínio

## 🔧 Configuração do Backend (CORS)

Para o frontend funcionar corretamente, configure o CORS no backend Laravel:

**backend/config/cors.php:**
```php
'allowed_origins' => [
    'https://app.seudominio.com',
    'http://localhost:5173', // desenvolvimento
],
```

**backend/.env:**
```env
SANCTUM_STATEFUL_DOMAINS=app.seudominio.com
SESSION_DOMAIN=.seudominio.com
```

## 📦 Build Local (Teste)

Para testar o build Docker localmente:

```bash
# Navegar para a pasta do frontend
cd frontend

# Build da imagem
docker build -t yb-frontend .

# Rodar o container
docker run -p 8080:80 yb-frontend

# Acessar em http://localhost:8080
```

## 🔍 Verificar Logs

No Easypanel:
1. Vá em **"Logs"**
2. Verifique se há erros no build ou runtime
3. Logs do Nginx aparecem aqui

## ⚙️ Otimizações Incluídas

### Dockerfile
- ✅ Multi-stage build (reduz tamanho da imagem)
- ✅ Build otimizado com `npm ci`
- ✅ Imagem final baseada em Alpine (leve)

### Nginx
- ✅ Compressão Gzip ativada
- ✅ Cache de assets estáticos (1 ano)
- ✅ Roteamento SPA (todas rotas → index.html)
- ✅ Headers de segurança
- ✅ Versão do Nginx oculta

## 🐛 Solução de Problemas

### ❌ Erro: "Failed to fetch" ou "Network Error"
**Causa:** Frontend não consegue conectar com backend  
**Solução:** 
1. Verifique se `VITE_API_URL` está correto
2. Verifique CORS no backend
3. Certifique-se que o backend está acessível

### ❌ Erro: "404 Not Found" em rotas
**Causa:** Nginx não está redirecionando para index.html  
**Solução:** Verifique se `nginx.conf` está sendo copiado corretamente

### ❌ Build falha com "npm ERR!"
**Causa:** Dependências faltando ou incompatíveis  
**Solução:** 
1. Verifique `package.json` e `package-lock.json`
2. Rode `npm install` localmente primeiro
3. Commit o `package-lock.json` atualizado

### ❌ Página em branco após deploy
**Causa:** Variável de ambiente não configurada  
**Solução:** 
1. Verifique se `VITE_API_URL` está definida no Easypanel
2. Rebuild a aplicação após adicionar variáveis

## 📊 Estrutura do Build

```
Build Stage (Node 20)
├── Instala dependências (npm ci)
├── Copia código fonte
└── Build para produção (npm run build)
    └── Gera pasta /dist

Production Stage (Nginx Alpine)
├── Copia nginx.conf
├── Copia arquivos de /dist
└── Serve na porta 80
```

## 🔐 Segurança

Headers de segurança incluídos no `nginx.conf`:
- `X-Frame-Options: SAMEORIGIN` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Proteção XSS

## 📈 Performance

- **Gzip:** Compressão automática de assets
- **Cache:** Assets estáticos com cache de 1 ano
- **Imagem:** ~25MB (Alpine + Nginx + build)

## ✅ Checklist de Deploy

- [ ] Dockerfile criado em `frontend/`
- [ ] nginx.conf criado em `frontend/`
- [ ] .dockerignore criado em `frontend/`
- [ ] .env.production configurado com URL da API
- [ ] Código commitado no Git
- [ ] App criado no Easypanel
- [ ] Build configurado (Dockerfile)
- [ ] Variável VITE_API_URL definida
- [ ] Domínio configurado
- [ ] SSL/HTTPS ativado
- [ ] CORS configurado no backend
- [ ] Deploy realizado com sucesso
- [ ] Testado em produção

---

**Pronto!** Seu frontend React estará rodando em produção com Nginx otimizado. 🚀
