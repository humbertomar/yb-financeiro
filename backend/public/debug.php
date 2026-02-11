<?php

// Script de debug - mostra configurações do Laravel
echo "=== DEBUG LARAVEL ===\n\n";

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "APP_ENV: " . env('APP_ENV') . "\n";
echo "APP_DEBUG: " . env('APP_DEBUG') . "\n";
echo "APP_KEY: " . (env('APP_KEY') ? 'DEFINIDO' : 'NÃO DEFINIDO') . "\n";
echo "DB_CONNECTION: " . env('DB_CONNECTION') . "\n";
echo "DB_HOST: " . env('DB_HOST') . "\n";
echo "DB_DATABASE: " . env('DB_DATABASE') . "\n";

echo "\n=== TESTE DE CONEXÃO COM BANCO ===\n";
try {
    DB::connection()->getPdo();
    echo "✅ Conexão com banco OK!\n";
} catch (\Exception $e) {
    echo "❌ Erro ao conectar: " . $e->getMessage() . "\n";
}

echo "\n=== ROTAS REGISTRADAS ===\n";
$routes = Route::getRoutes();
echo "Total de rotas: " . count($routes) . "\n";
