# 🔧 Correção de CORS em Produção

## ✅ Alterações Realizadas

### 1. **config/cors.php**
- ✅ Adicionado `'supports_credentials' => true` (necessário para Sanctum)
- ✅ Adicionado rotas `'login'` e `'logout'` aos paths do CORS
- ✅ Configurado `allowed_origins` para usar variável de ambiente

### 2. **.env.production**
- ✅ Adicionado `CORS_ALLOWED_ORIGINS` com URL do frontend
- ✅ Atualizado `APP_URL` com URL real do backend
- ✅ Atualizado `SANCTUM_STATEFUL_DOMAINS` com domínio do frontend
- ✅ Atualizado `SESSION_DOMAIN` para `.mhiogf.easypanel.host`

## 🚀 Como Aplicar no Easypanel

### Passo 1: Atualizar Variáveis de Ambiente no Backend

No painel do Easypanel, vá até o app do **backend** e adicione/atualize estas variáveis:

```env
APP_URL=https://catalogos-yb-financeiro-backend.mhiogf.easypanel.host

CORS_ALLOWED_ORIGINS=https://catalogos-yb-financeiro-frontend.mhiogf.easypanel.host

SANCTUM_STATEFUL_DOMAINS=catalogos-yb-financeiro-frontend.mhiogf.easypanel.host

SESSION_DOMAIN=.mhiogf.easypanel.host
```

### Passo 2: Fazer Redeploy

1. Commit as alterações no Git:
```bash
git add backend/config/cors.php
git commit -m "fix: CORS configuration for production"
git push
```

2. No Easypanel, clique em **"Redeploy"** no app do backend

### Passo 3: Limpar Cache (se necessário)

Se o erro persistir, execute no backend:
```bash
php artisan config:clear
php artisan cache:clear
```

## 🔍 O Que Foi Corrigido

### Problema Original
```
Access-Control-Allow-Origin header is present on the requested resource
```

### Causa
- `supports_credentials` estava `false` (Sanctum precisa de `true`)
- Rota `/login` não estava nos paths do CORS
- Domínios do Sanctum não estavam configurados corretamente

### Solução
- ✅ Habilitado `supports_credentials: true`
- ✅ Adicionado rotas de autenticação ao CORS
- ✅ Configurado domínios corretos no Sanctum
- ✅ Configurado SESSION_DOMAIN compartilhado

## 📋 Checklist de Verificação

Após aplicar as mudanças:

- [ ] Variáveis de ambiente atualizadas no Easypanel
- [ ] Backend redeployado
- [ ] Cache limpo (se necessário)
- [ ] Teste de login funcionando
- [ ] Console do navegador sem erros de CORS
- [ ] Cookies sendo enviados corretamente

## 🧪 Como Testar

1. Abra o DevTools do navegador (F12)
2. Vá na aba **Network**
3. Tente fazer login
4. Verifique a requisição para `/login`:
   - ✅ Status: 200 OK
   - ✅ Headers de resposta devem incluir:
     - `Access-Control-Allow-Origin: https://catalogos-yb-financeiro-frontend.mhiogf.easypanel.host`
     - `Access-Control-Allow-Credentials: true`

## 🐛 Se o Erro Persistir

### Opção 1: Verificar Middleware
Certifique-se que o middleware CORS está ativo em `bootstrap/app.php`

### Opção 2: Verificar Nginx/Proxy
Alguns proxies podem interferir com headers CORS. Verifique configurações do Easypanel.

### Opção 3: Modo Debug Temporário
Temporariamente, para debug, você pode usar:
```env
CORS_ALLOWED_ORIGINS=*
```
⚠️ **Não use em produção final!** Apenas para testar.

---

**Após aplicar essas mudanças, o login deve funcionar normalmente!** ✅
