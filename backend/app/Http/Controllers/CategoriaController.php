<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Listar todas as categorias
     */
    public function index()
    {
        $categorias = Categoria::ativas()->get();
        return response()->json($categorias);
    }

    /**
     * Criar nova categoria
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'texto' => 'nullable|string',
        ]);

        $categoria = Categoria::create([
            'nome' => $request->nome,
            'texto' => $request->texto ?? '',
            'imagem' => '', // TODO: Implementar upload depois
            'ativo' => 1
        ]);

        return response()->json($categoria, 201);
    }

    /**
     * Atualizar categoria
     */
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'nome' => 'required|string|max:255',
            'texto' => 'nullable|string',
        ]);

        $categoria->update([
            'nome' => $request->nome,
            'texto' => $request->texto ?? $categoria->texto
        ]);

        return response()->json($categoria);
    }

    /**
     * Remover categoria (Soft Delete - mudar ativo para 2)
     */
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        
        // Padrão legado: ativo = 2 significa removido
        $categoria->update(['ativo' => 2]);

        return response()->json(['message' => 'Categoria removida com sucesso']);
    }
}
