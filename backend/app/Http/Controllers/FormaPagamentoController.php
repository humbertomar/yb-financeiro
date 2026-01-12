<?php

namespace App\Http\Controllers;

use App\Models\FormaPagamento;
use Illuminate\Http\Request;

class FormaPagamentoController extends Controller
{
    public function index()
    {
        $formas = FormaPagamento::where('ativo', '!=', 2)->get();
        return response()->json($formas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'forma_pagamento' => 'required|string|max:255',
            'texto' => 'nullable|string',
            'ativo' => 'nullable|integer|in:0,1'
        ]);

        $forma = FormaPagamento::create([
            'forma_pagamento' => $request->forma_pagamento,
            'texto' => $request->texto,
            'ativo' => $request->ativo ?? 1
        ]);

        return response()->json($forma, 201);
    }

    public function show($id)
    {
        $forma = FormaPagamento::findOrFail($id);
        return response()->json($forma);
    }

    public function update(Request $request, $id)
    {
        $forma = FormaPagamento::findOrFail($id);

        $request->validate([
            'forma_pagamento' => 'required|string|max:255',
            'texto' => 'nullable|string',
            'ativo' => 'nullable|integer|in:0,1,2'
        ]);

        $forma->update($request->only(['forma_pagamento', 'texto', 'ativo']));

        return response()->json($forma);
    }

    public function destroy($id)
    {
        $forma = FormaPagamento::findOrFail($id);
        
        // Verifica se está em uso em alguma venda
        if ($forma->vendas()->count() > 0) {
            return response()->json([
                'error' => 'Não é possível excluir esta forma de pagamento pois está sendo utilizada em vendas.'
            ], 422);
        }

        // Soft delete - marca como inativo (2)
        $forma->update(['ativo' => 2]);

        return response()->json(['message' => 'Forma de pagamento desativada com sucesso.']);
    }
}
