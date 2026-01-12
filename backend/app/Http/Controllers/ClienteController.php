<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Listar clientes com paginação e busca
     */
    public function index(Request $request)
    {
        $query = Cliente::ativos();
        
        // Busca por nome, CPF ou whatsapp
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', '%' . $search . '%')
                  ->orWhere('cpf', 'like', '%' . $search . '%')
                  ->orWhere('whatsapp', 'like', '%' . $search . '%');
            });
        }
        
        // Se all=true, retornar todos sem paginação
        if ($request->has('all') && $request->all == 'true') {
            $clientes = $query->orderBy('nome', 'asc')->get();
            return response()->json($clientes);
        }
        
        $clientes = $query
            ->orderBy('nome', 'asc')
            ->paginate(10);
        return response()->json($clientes);
    }

    /**
     * Exibir cliente específico
     */
    public function show($id)
    {
        $cliente = Cliente::findOrFail($id);
        return response()->json($cliente);
    }

    /**
     * Criar novo cliente
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'cpf' => 'nullable|string|max:14',
            'email' => 'nullable|email|max:255',
        ]);

        $cliente = Cliente::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'cpf' => $request->cpf,
            'logradouro' => $request->endereco,
            'cidade' => $request->cidade,
            'estado' => $request->estado,
            'cep' => $request->cep,
            'altered' => now(),
            'ativo' => 1
        ]);

        return response()->json($cliente, 201);
    }

    /**
     * Atualizar cliente
     */
    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $request->validate([
            'nome' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'cpf' => 'nullable|string|max:14',
            'email' => 'nullable|email|max:255',
        ]);

        $data = $request->all();
        // Mapear endereco para logradouro
        if (isset($data['endereco'])) {
            $data['logradouro'] = $data['endereco'];
            unset($data['endereco']);
        }
        $data['altered'] = now();
        
        $cliente->update($data);

        return response()->json($cliente);
    }

    /**
     * Remover cliente (Soft Delete)
     */
    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['ativo' => 2]);

        return response()->json(['message' => 'Cliente removido com sucesso']);
    }
}
