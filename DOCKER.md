# 🐳 Docker Setup - YB Importa

Configuração Docker para deploy do sistema completo (Backend + Frontend).

## 📦 Estrutura

```
yb-importa-financeiro/
├── backend/
│   ├── Dockerfile          # Laravel + PHP-FPM
│   ├── .dockerignore
│   └── .env.production
│
└── frontend/
    ├── Dockerfile          # React + Nginx
    ├── nginx.conf
    ├── .dockerignore
    └── .env.production
```

## 🚀 Deploy no Easypanel (Netcup)

### Backend (Laravel API)

1. **Criar App no Easypanel**
   - Type: From Source (GitHub/GitLab)
   - Build Method: Dockerfile
   - Dockerfile Path: `backend/Dockerfile`
   - Context: `backend`

2. **Variáveis de Ambiente**
   ```env
   APP_NAME=YBImporta
   APP_ENV=production
   APP_KEY=base64:... (gerar com php artisan key:generate)
   APP_DEBUG=false
   APP_URL=https://api.seudominio.com
   
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=ybimpo48_ybimporta
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   
   SANCTUM_STATEFUL_DOMAINS=app.seudominio.com
   SESSION_DOMAIN=.seudominio.com
   ```

3. **Configurar Porta**: 9000 (PHP-FPM)

4. **Domínio**: `api.seudominio.com`

### Frontend (React)

1. **Criar App no Easypanel**
   - Type: From Source (GitHub/GitLab)
   - Build Method: Dockerfile
   - Dockerfile Path: `frontend/Dockerfile`
   - Context: `frontend`

2. **Variáveis de Ambiente**
   ```env
   VITE_API_URL=https://api.seudominio.com/api
   ```

3. **Configurar Porta**: 80 (Nginx)

4. **Domínio**: `app.seudominio.com`

## 🔧 Configuração do Banco de Dados

No Easypanel, crie um serviço MySQL:

1. **Create Service** → MySQL
2. Configure:
   - Database: `ybimpo48_ybimporta`
   - Username: `seu_usuario`
   - Password: `sua_senha`
3. Importe seu banco de dados

## 🔗 CORS e Sanctum

Certifique-se de configurar corretamente no backend:

**config/cors.php:**
```php
'allowed_origins' => [
    'https://app.seudominio.com',
],
```

**config/sanctum.php:**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
```

## 🧪 Testar Localmente com Docker

### Backend
```bash
cd backend
docker build -t yb-backend .
docker run -p 9000:9000 yb-backend
```

### Frontend
```bash
cd frontend
docker build -t yb-frontend .
docker run -p 8080:80 yb-frontend
```

## 📊 Arquitetura de Deploy

```
┌─────────────────────────────────────────┐
│         Easypanel (Netcup)              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │  │
│  │  React+Nginx │◄───┤ Laravel+PHP  │  │
│  │   Port 80    │    │   Port 9000  │  │
│  └──────────────┘    └──────┬───────┘  │
│         │                    │          │
│         │                    │          │
│  app.seudominio.com   api.seudominio.com│
│         │                    │          │
│         │                    ▼          │
│         │            ┌──────────────┐  │
│         │            │    MySQL     │  │
│         │            │   Port 3306  │  │
│         │            └──────────────┘  │
└─────────────────────────────────────────┘
```

## ✅ Checklist de Deploy

### Backend
- [ ] Dockerfile criado
- [ ] .dockerignore criado
- [ ] .env.production configurado
- [ ] APP_KEY gerado
- [ ] Banco de dados criado
- [ ] Migrations executadas
- [ ] CORS configurado
- [ ] Sanctum configurado
- [ ] Domínio configurado
- [ ] SSL ativado

### Frontend
- [ ] Dockerfile criado
- [ ] nginx.conf criado
- [ ] .dockerignore criado
- [ ] VITE_API_URL configurado
- [ ] Build testado localmente
- [ ] Domínio configurado
- [ ] SSL ativado

## 🐛 Troubleshooting

### Backend não conecta ao MySQL
- Verifique se o host é `mysql` (nome do serviço no Easypanel)
- Verifique credenciais no .env

### Frontend não conecta ao Backend
- Verifique VITE_API_URL
- Verifique CORS no backend
- Verifique se ambos os serviços estão rodando

### Erro 500 no Backend
- Verifique logs no Easypanel
- Verifique se APP_KEY está definido
- Verifique permissões de storage

## 📚 Documentação Adicional

- **Backend:** Ver `backend/CONFIGURACAO.md`
- **Frontend:** Ver `frontend/DEPLOY.md`
- **Sistema:** Ver `SISTEMA.md`

---

**Pronto para produção!** 🚀
