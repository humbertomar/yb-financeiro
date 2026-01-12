<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Rota de teste
Route::post('/test', function(Request $request) {
    \Log::info('TEST - Body recebido: ' . json_encode($request->all()));
    return response()->json(['message' => 'OK', 'received' => $request->all()]);
});

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (Usuario logado)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('dashboard/statistics', [App\Http\Controllers\DashboardController::class, 'statistics']);
    
    // Categorias
    Route::apiResource('categorias', App\Http\Controllers\CategoriaController::class);
    // Produtos
    Route::get('produtos/relatorio-estoque', [App\Http\Controllers\ProdutoController::class, 'relatorioEstoque']);
    Route::apiResource('produtos', App\Http\Controllers\ProdutoController::class);
    // Clientes
    Route::apiResource('clientes', App\Http\Controllers\ClienteController::class);
    // Vendas
    Route::get('vendas/relatorio', [App\Http\Controllers\VendaController::class, 'relatorio']);
    Route::apiResource('vendas', App\Http\Controllers\VendaController::class);
    // Formas de Pagamento
    Route::apiResource('formaspagamento', App\Http\Controllers\FormaPagamentoController::class);
    
    // Contas a Pagar
    Route::get('contas-pagar/calendario/{mes}/{ano}', [App\Http\Controllers\ContaPagarController::class, 'calendario']);
    Route::post('parcelas/{id}/pagar', [App\Http\Controllers\ContaPagarController::class, 'pagarParcela']);
    Route::apiResource('contas-pagar', App\Http\Controllers\ContaPagarController::class);
    
    // Aqui vamos adicionar as outras rotas (produtos, vendas, etc)
});
