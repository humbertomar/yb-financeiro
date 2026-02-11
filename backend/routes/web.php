<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'YB Importa API',
        'status' => 'online',
        'version' => '1.0'
    ]);
});
