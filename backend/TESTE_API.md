# Teste da API de Autenticação

## 1. Testar Login

Use um cliente HTTP (Postman, Insomnia, ou curl):

### Via curl (PowerShell):

```powershell
curl -X POST http://localhost:8000/api/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@yb.com\",\"senha\":\"admin123\"}'
```

### Resposta esperada:

```json
{
  "user": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@yb.com",
    "tipo_acesso": "admin"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**IMPORTANTE:** Copie o token retornado!

## 2. Testar Rota Protegida (/me)

Use o token recebido:

```powershell
curl http://localhost:8000/api/me `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 3. Testar Logout

```powershell
curl -X POST http://localhost:8000/api/logout `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Próximo Passo

Depois de testar a autenticação, vamos criar o frontend React! 🚀
