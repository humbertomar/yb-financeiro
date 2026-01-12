# Teste dos Models

Para testar se os Models estão funcionando corretamente, use o Tinker do Laravel:

```bash
php artisan tinker
```

## Testes Básicos:

### 1. Listar Usuários
```php
App\Models\Usuario::all();
```

### 2. Listar Produtos com Categoria
```php
App\Models\Produto::with('categoria')->ativos()->get();
```

### 3. Listar Vendas com Relacionamentos
```php
App\Models\Venda::with(['produto', 'cliente', 'formaPagamento'])->ativas()->take(5)->get();
```

### 4. Buscar um Produto Específico
```php
$produto = App\Models\Produto::find(1);
echo $produto->nome;
echo $produto->categoria->nome;
```

### 5. Contar Registros
```php
echo "Produtos: " . App\Models\Produto::ativos()->count();
echo "Vendas: " . App\Models\Venda::ativas()->count();
echo "Clientes: " . App\Models\Cliente::ativos()->count();
```

## Se tudo funcionar:

Você verá os dados do banco sendo retornados! ✅

Próximo passo: Instalar Sanctum e criar API de autenticação.
