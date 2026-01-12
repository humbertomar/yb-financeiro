# Configuração do Laravel para Banco Legado

## 1. Editar o arquivo `.env`

Abra o arquivo `backend/.env` e configure o banco de dados:

```env
# Altere estas linhas:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ybimpo48_ybimporta
DB_USERNAME=root
DB_PASSWORD=

# Opcional: Configurar para português
APP_LOCALE=pt_BR
APP_FALLBACK_LOCALE=pt_BR
APP_FAKER_LOCALE=pt_BR
```

## 2. Ajustar configuração do MySQL (importante para banco legado)

Edite o arquivo `backend/config/database.php`:

Procure a seção `'mysql'` e adicione/altere:

```php
'mysql' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => false,  // ← IMPORTANTE: false para banco legado
    'engine' => null,
],
```

## 3. Testar conexão

No terminal, rode:

```bash
php artisan migrate:status
```

Se aparecer a lista de migrations, a conexão está funcionando! ✅

## 4. Iniciar servidor

```bash
php artisan serve
```

Acesse: http://localhost:8000

Deve aparecer a página de boas-vindas do Laravel!
