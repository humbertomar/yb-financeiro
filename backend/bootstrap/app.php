<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS está sendo tratado pelo Nginx
        // Desabilitado para evitar headers duplicados
        // $middleware->prepend(\App\Http\Middleware\CorsMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Para APIs, retornar JSON em vez de redirecionar para login
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Não autenticado. Por favor, faça login.'
                ], 401);
            }
        });
    })->create();
