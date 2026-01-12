# YB Importa - Modernização

Sistema de gestão financeira modernizado com Laravel 11 e React 18.

## Estrutura do Projeto

```
yb-importa-financeiro/
├── backend/          # Laravel 11 (API)
├── frontend/         # React 18 + Vite (Interface)
└── system/           # Sistema antigo (referência)
```

## Como Começar

### 1. Backend (Laravel)

```bash
cd backend
# Siga as instruções do README.md dentro da pasta
```

### 2. Frontend (React)

```bash
cd frontend
# Siga as instruções do README.md dentro da pasta
```

## Banco de Dados

Ambos os sistemas (antigo e novo) usam o **mesmo banco MySQL**:
- Database: `ybimpo48_ybimporta`
- Host: `localhost`
- User: `root`
- Password: (vazio)

## URLs de Acesso

### Sistema Antigo
- URL: `http://localhost/yb-importa-financeiro/`
- Servidor: Apache (XAMPP)

### Sistema Novo
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Servidores: Embutidos (Laravel + Vite)

## Status do Desenvolvimento

Veja o arquivo `task.md` nos artifacts para acompanhar o progresso.
