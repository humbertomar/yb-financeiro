---
description: Como colocar o projeto para rodar (desenvolvimento local)
---

# 🚀 Como Colocar o Projeto para Rodar

Este guia mostra como configurar e executar o projeto **YB Importa - Sistema de Gestão Financeira** em ambiente de desenvolvimento local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **PHP 8.2 ou superior**
   - Verifique: `php -v`
   
2. **Composer** (gerenciador de dependências PHP)
   - Verifique: `composer -v`
   - Download: https://getcomposer.org/

3. **Node.js 18+ e npm**
   - Verifique: `node -v` e `npm -v`
   - Download: https://nodejs.org/

4. **MySQL 8.0**
   - Pode usar XAMPP, WAMP, ou MySQL standalone
   - Database: `ybimpo48_ybimporta`

5. **Git** (opcional, para controle de versão)

---

## 🗄️ Passo 1: Configurar o Banco de Dados

### 1.1 Iniciar o MySQL
- Se usar XAMPP: Inicie o Apache e MySQL pelo painel de controle
- Se usar MySQL standalone: Certifique-se que o serviço está rodando

### 1.2 Criar/Verificar o Banco de Dados
```sql
CREATE DATABASE IF NOT EXISTS ybimpo48_ybimporta;
```

### 1.3 Importar dados (se houver backup)
Se você tem um arquivo SQL de backup na pasta `banco_dados/`:
```bash
mysql -u root -p ybimpo48_ybimporta < banco_dados/backup.sql
```

---

## ⚙️ Passo 2: Configurar o Backend (Laravel)

### 2.1 Navegar para a pasta do backend
```bash
cd c:\Users\betim\Documents\projetos\yb-importa-financeiro\backend
```

### 2.2 Instalar dependências do Composer
```bash
composer install
```

### 2.3 Criar arquivo de configuração .env
```bash
# Copiar o arquivo de exemplo
copy .env.example .env
```

### 2.4 Editar o arquivo .env
Abra o arquivo `.env` e configure:

```env
APP_NAME=YBImporta
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ybimpo48_ybimporta
DB_USERNAME=root
DB_PASSWORD=

# Deixe vazio se não tiver senha no MySQL
# Ou coloque sua senha se configurou uma
```

### 2.5 Gerar chave da aplicação
```bash
php artisan key:generate
```

### 2.6 Executar migrations (se necessário)
```bash
php artisan migrate
```

> **Nota:** Se o banco já tiver as tabelas criadas, você pode pular este passo.

### 2.7 Limpar cache (opcional, mas recomendado)
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 🎨 Passo 3: Configurar o Frontend (React)

### 3.1 Navegar para a pasta do frontend
```bash
cd c:\Users\betim\Documents\projetos\yb-importa-financeiro\frontend
```

### 3.2 Instalar dependências do npm
```bash
npm install
```

### 3.3 Verificar configuração da API
Abra o arquivo `src/services/api.js` e verifique se a URL base está correta:
```javascript
baseURL: 'http://localhost:8000/api'
```

---

## 🚀 Passo 4: Executar o Projeto

Você precisará de **2 terminais** abertos simultaneamente.

### Terminal 1: Backend (Laravel)
```bash
cd c:\Users\betim\Documents\projetos\yb-importa-financeiro\backend
php artisan serve
```

✅ Backend rodando em: **http://localhost:8000**

### Terminal 2: Frontend (React)
```bash
cd c:\Users\betim\Documents\projetos\yb-importa-financeiro\frontend
npm run dev
```

✅ Frontend rodando em: **http://localhost:5173**

---

## 🌐 Passo 5: Acessar o Sistema

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Faça login com suas credenciais

> **Primeira vez?** Se não tiver usuário cadastrado, você pode criar um diretamente no banco de dados ou através de um seeder.

---

## 🔧 Comandos Úteis

### Backend (Laravel)
```bash
# Ver rotas disponíveis
php artisan route:list

# Criar um novo controller
php artisan make:controller NomeController

# Criar um novo model
php artisan make:model NomeModel

# Executar seeders
php artisan db:seed

# Limpar todos os caches
php artisan optimize:clear
```

### Frontend (React)
```bash
# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Verificar erros de lint
npm run lint
```

---

## 🐛 Solução de Problemas Comuns

### ❌ Erro: "SQLSTATE[HY000] [1045] Access denied"
**Solução:** Verifique as credenciais do banco no arquivo `.env`

### ❌ Erro: "No application encryption key has been specified"
**Solução:** Execute `php artisan key:generate`

### ❌ Erro: "Class 'X' not found"
**Solução:** Execute `composer dump-autoload`

### ❌ Frontend não conecta com Backend
**Solução:** 
1. Verifique se o backend está rodando em `http://localhost:8000`
2. Verifique a configuração em `src/services/api.js`
3. Verifique o CORS no backend (`config/cors.php`)

### ❌ Erro de CORS
**Solução:** No backend, verifique o arquivo `config/cors.php` e certifique-se que `http://localhost:5173` está permitido.

### ❌ Porta 8000 ou 5173 já está em uso
**Solução:** 
- Backend: `php artisan serve --port=8001`
- Frontend: Edite `vite.config.js` e altere a porta

---

## 📦 Estrutura de URLs

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | Interface do usuário |
| Backend API | http://localhost:8000/api | API REST |
| Sistema Legado | http://localhost/yb-importa-financeiro/ | Sistema antigo (PHP) |

---

## ✅ Checklist de Verificação

Antes de começar a desenvolver, certifique-se que:

- [ ] MySQL está rodando
- [ ] Banco de dados `ybimpo48_ybimporta` existe
- [ ] Arquivo `.env` do backend está configurado
- [ ] `composer install` executado com sucesso
- [ ] `php artisan key:generate` executado
- [ ] `npm install` do frontend executado com sucesso
- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Consegue acessar o sistema pelo navegador

---

## 📚 Próximos Passos

Após o sistema estar rodando:

1. Explore o arquivo `SISTEMA.md` para entender a arquitetura
2. Veja a documentação das APIs em `backend/routes/api.php`
3. Explore os componentes React em `frontend/src/components/`
4. Consulte o dashboard em http://localhost:5173

---

**Dúvidas?** Consulte a documentação completa em `SISTEMA.md` ou `README.md`
