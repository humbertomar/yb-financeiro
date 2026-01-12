<?php

namespace App\Http\Controllers;

use App\Models\ContaPagar;
use App\Models\ParcelaContaPagar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContaPagarController extends Controller
{
    public function index(Request $request)
    {
        $query = ContaPagar::with('parcelas')
            ->where('ativo', 1);
        
        // Filtros
        if ($request->has('categoria') && $request->categoria) {
            $query->where('categoria', $request->categoria);
        }
        
        if ($request->has('fornecedor') && $request->fornecedor) {
            $query->where('fornecedor', 'like', '%' . $request->fornecedor . '%');
        }
        
        if ($request->has('data_inicio') && $request->data_inicio) {
            $query->where('data_cadastro', '>=', $request->data_inicio);
        }
        
        if ($request->has('data_fim') && $request->data_fim) {
            $query->where('data_cadastro', '<=', $request->data_fim);
        }
        
        $contas = $query->orderBy('data_cadastro', 'desc')->get();
        
        return response()->json($contas);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor_total' => 'required|numeric|min:0',
            'categoria' => 'nullable|string|max:100',
            'fornecedor' => 'nullable|string|max:255',
            'parcelado' => 'boolean',
            'numero_parcelas' => 'required_if:parcelado,true|integer|min:1|max:60',
            'periodicidade_dias' => 'nullable|integer|min:1|max:365',
            'data_primeiro_vencimento' => 'required|date',
            'observacoes' => 'nullable|string'
        ]);
        
        DB::beginTransaction();
        try {
            // Criar conta
            $conta = ContaPagar::create([
                'descricao' => $validated['descricao'],
                'valor_total' => $validated['valor_total'],
                'categoria' => $validated['categoria'] ?? null,
                'fornecedor' => $validated['fornecedor'] ?? null,
                'parcelado' => $validated['parcelado'] ?? false,
                'numero_parcelas' => $validated['numero_parcelas'] ?? 1,
                'data_cadastro' => now(),
                'observacoes' => $validated['observacoes'] ?? null,
                'ativo' => 1
            ]);
            
            // Gerar parcelas
            $numeroParcelas = $validated['parcelado'] ? $validated['numero_parcelas'] : 1;
            $valorParcela = $validated['valor_total'] / $numeroParcelas;
            $dataVencimento = Carbon::parse($validated['data_primeiro_vencimento']);
            
            // Periodicidade em dias (padrão: 30 dias se não informado)
            $periodicidadeDias = $validated['periodicidade_dias'] ?? 30;
            
            for ($i = 1; $i <= $numeroParcelas; $i++) {
                // Calcular data de vencimento baseado na periodicidade
                $dataParcelaVencimento = $dataVencimento->copy()->addDays(($i - 1) * $periodicidadeDias);
                
                ParcelaContaPagar::create([
                    'idContaPagar' => $conta->idContaPagar,
                    'numero_parcela' => $i,
                    'valor_parcela' => round($valorParcela, 2),
                    'data_vencimento' => $dataParcelaVencimento->format('Y-m-d'),
                    'status' => 'pendente'
                ]);
            }
            
            DB::commit();
            
            return response()->json($conta->load('parcelas'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function show($id)
    {
        $conta = ContaPagar::with('parcelas')->findOrFail($id);
        return response()->json($conta);
    }
    
    public function update(Request $request, $id)
    {
        $conta = ContaPagar::findOrFail($id);
        
        $validated = $request->validate([
            'descricao' => 'string|max:255',
            'categoria' => 'nullable|string|max:100',
            'fornecedor' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string'
        ]);
        
        $conta->update($validated);
        
        return response()->json($conta->load('parcelas'));
    }
    
    public function destroy($id)
    {
        $conta = ContaPagar::with('parcelas')->findOrFail($id);
        
        // Verificar se tem parcelas pagas
        $temParcelasPagas = $conta->parcelas()->whereNotNull('data_pagamento')->exists();
        
        if ($temParcelasPagas) {
            return response()->json([
                'error' => 'Não é possível excluir conta com parcelas pagas. Apenas inative.'
            ], 422);
        }
        
        // Excluir conta e parcelas (cascade)
        $conta->delete();
        
        return response()->json(['message' => 'Conta excluída com sucesso']);
    }
    
    public function pagarParcela(Request $request, $idParcela)
    {
        $validated = $request->validate([
            'data_pagamento' => 'required|date',
            'valor_pago' => 'required|numeric|min:0',
            'observacoes' => 'nullable|string'
        ]);
        
        $parcela = ParcelaContaPagar::findOrFail($idParcela);
        
        $parcela->update([
            'data_pagamento' => $validated['data_pagamento'],
            'valor_pago' => $validated['valor_pago'],
            'status' => 'pago',
            'observacoes' => $validated['observacoes'] ?? $parcela->observacoes
        ]);
        
        return response()->json($parcela);
    }
    
    public function calendario($mes, $ano)
    {
        $dataInicio = Carbon::create($ano, $mes, 1)->startOfMonth();
        $dataFim = Carbon::create($ano, $mes, 1)->endOfMonth();
        
        $parcelas = ParcelaContaPagar::with('contaPagar')
            ->whereBetween('data_vencimento', [$dataInicio, $dataFim])
            ->orderBy('data_vencimento')
            ->get();
        
        return response()->json($parcelas);
    }
}
