# 🌐 URLs de Produção - YB Importa Financeiro

## URLs Finais

- **Frontend:** https://financeiro.lojaybimporta.com.br/
- **Backend API:** https://apifinanceiro.lojaybimporta.com.br/

## 📝 Configuração no Easypanel

### Backend (apifinanceiro.lojaybimporta.com.br)

**Environment Variables:**
```env
APP_NAME=YBImporta
APP_ENV=production
APP_KEY=base64:gEy4k1SltSPyFe9fc83rqgJyQG9l/Xjxh6jIUv0JIXI=
APP_DEBUG=false
APP_URL=https://apifinanceiro.lojaybimporta.com.br

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=catalogos_yb-financeiro-db
DB_PORT=3306
DB_DATABASE=ybimpo48_ybimporta
DB_USERNAME=ybimpo48_ybimpor
DB_PASSWORD=yboF][fyNEEi

CORS_ALLOWED_ORIGINS=https://financeiro.lojaybimporta.com.br
SANCTUM_STATEFUL_DOMAINS=financeiro.lojaybimporta.com.br
SESSION_DOMAIN=.lojaybimporta.com.br
```

**Domínio:**
- Adicione o domínio `apifinanceiro.lojaybimporta.com.br` nas configurações do app
- Certifique-se de que o SSL está habilitado

### Frontend (financeiro.lojaybimporta.com.br)

**Environment Variables:**
```env
VITE_APP_NAME="YB Importa - Catálogo"
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://apifinanceiro.lojaybimporta.com.br/api
```

**Domínio:**
- Adicione o domínio `financeiro.lojaybimporta.com.br` nas configurações do app
- Certifique-se de que o SSL está habilitado

## 🔧 DNS Configuration

Configure os seguintes registros DNS:

```
A     apifinanceiro.lojaybimporta.com.br    → IP do Easypanel
A     financeiro.lojaybimporta.com.br       → IP do Easypanel
```

Ou se usar CNAME:

```
CNAME apifinanceiro.lojaybimporta.com.br    → seu-servidor.easypanel.host
CNAME financeiro.lojaybimporta.com.br       → seu-servidor.easypanel.host
```

## ✅ Checklist de Deploy

- [ ] DNS configurado e propagado
- [ ] Domínios adicionados no Easypanel (backend e frontend)
- [ ] SSL habilitado para ambos os domínios
- [ ] Variáveis de ambiente atualizadas no Easypanel
- [ ] Backend redeployado
- [ ] Frontend redeployado
- [ ] Teste de login funcionando
- [ ] CORS funcionando corretamente

## 🧪 Testes

Após o deploy:

1. **Backend:** Acesse https://apifinanceiro.lojaybimporta.com.br/
   - Deve retornar: `{"message":"YB Importa API","status":"online","version":"1.0"}`

2. **Frontend:** Acesse https://financeiro.lojaybimporta.com.br/
   - Deve carregar a página de login

3. **Login:** Teste o login
   - Email: `admin@yb.com`
   - Senha: `admin123`
   - Deve fazer login com sucesso

## 📊 Status

- ✅ CORS configurado
- ✅ Nginx configurado
- ✅ Sanctum configurado
- ✅ MySQL conectado
- ✅ Login funcionando
- ✅ Domínios customizados configurados
