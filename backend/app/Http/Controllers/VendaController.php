<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\ItemVenda;
use App\Models\ProdutoVariacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendaController extends Controller
{
    /**
     * Listar vendas com paginação e busca
     */
    public function index(Request $request)
    {
        $query = Venda::with(['cliente', 'formaPagamento', 'funcionario', 'itens.produto', 'itens.variacao'])
            ->ativas()
            ->orderBy('data_hora', 'desc');
        
        // Busca por nome do cliente ou ID da venda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('idVenda', $search)
                  ->orWhereHas('cliente', function($q2) use ($search) {
                      $q2->where('nome', 'like', '%' . $search . '%');
                  });
            });
        }
        
        // Filtro por período
        if ($request->has('data_inicio') && $request->data_inicio) {
            $query->whereDate('data_hora', '>=', $request->data_inicio);
        }
        if ($request->has('data_fim') && $request->data_fim) {
            $query->whereDate('data_hora', '<=', $request->data_fim);
        }
        
        $vendas = $query->paginate(10);
        return response()->json($vendas);
    }

    /**
     * Exibir venda específica
     */
    public function show($id)
    {
        $venda = Venda::with([
            'cliente', 
            'formaPagamento', 
            'funcionario', 
            'itens.produto', 
            'itens.variacao',
            'historico.usuario'
        ])->findOrFail($id);
        
        return response()->json($venda);
    }

    /**
     * Criar nova venda com itens (carrinho)
     */
    public function store(Request $request)
    {
        $request->validate([
            'idCliente' => 'required|exists:clientes,idCliente',
            'idFormapagamento' => 'required|exists:formas_pagamentos,idFormapagamento',
            'idFuncionario' => 'nullable|exists:funcionarios,idFuncionario',
            'itens' => 'required|array|min:1',
            'itens.*.idProduto' => 'required|exists:produtos,idProduto',
            'itens.*.idVariacao' => 'nullable|exists:produto_variacoes,id',
            'itens.*.quantidade' => 'required|integer|min:1',
            'itens.*.valor_unitario' => 'required|numeric|min:0',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Calcular totais
                $valorTotal = 0;
                foreach ($request->itens as $item) {
                    $valorTotal += $item['quantidade'] * $item['valor_unitario'];
                }
                
                $desconto = $request->desconto ?? 0;
                $valorFinal = $valorTotal - $desconto;

                // 2. Criar Venda (cabeçalho)
                $venda = Venda::create([
                    'data_hora' => now(),
                    'idCliente' => $request->idCliente,
                    'idFormapagamento' => $request->idFormapagamento,
                    'idFuncionario' => $request->idFuncionario ?? null,
                    'valor_total' => $valorFinal,
                    'desconto' => $desconto,
                    'comissao' => $request->comissao ?? 0,
                    'observacoes' => $request->observacoes,
                    'ativo' => 1,
                    // Campos legados (usar primeiro item do carrinho)
                    'quantidade' => $request->itens[0]['quantidade'],
                    'valor' => $request->itens[0]['valor_unitario'],
                    'idProduto' => $request->itens[0]['idProduto'],
                ]);

                // 3. Criar Itens da Venda
                foreach ($request->itens as $item) {
                    $valorTotalItem = $item['quantidade'] * $item['valor_unitario'];
                    $descontoItem = $item['desconto_item'] ?? 0;
                    
                    ItemVenda::create([
                        'idVenda' => $venda->idVenda,
                        'idProduto' => $item['idProduto'],
                        'idVariacao' => $item['idVariacao'] ?? null,
                        'quantidade' => $item['quantidade'],
                        'valor_unitario' => $item['valor_unitario'],
                        'valor_total' => $valorTotalItem - $descontoItem,
                        'desconto_item' => $descontoItem,
                    ]);

                    // 4. Atualizar estoque da variação
                    if (isset($item['idVariacao']) && $item['idVariacao']) {
                        $variacao = ProdutoVariacao::find($item['idVariacao']);
                        if ($variacao) {
                            $variacao->decrement('quantidade', $item['quantidade']);
                        }
                    }
                }

                // Recarregar com relacionamentos
                return response()->json($venda->load(['cliente', 'formaPagamento', 'funcionario', 'itens']), 201);
            });

        } catch (\Exception $e) {
            \Log::error('Erro ao criar venda: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao salvar venda', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Atualizar venda completa (itens, forma pagamento, desconto, observações)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'idFormapagamento' => 'nullable|exists:formas_pagamentos,idFormapagamento',
            'itens' => 'nullable|array',
            'itens.*.id' => 'nullable|exists:itens_venda,id',
            'itens.*.idProduto' => 'required_with:itens|exists:produtos,idProduto',
            'itens.*.idVariacao' => 'nullable|exists:produto_variacoes,id',
            'itens.*.quantidade' => 'required_with:itens|integer|min:1',
            'itens.*.valor_unitario' => 'required_with:itens|numeric|min:0',
        ]);

        $venda = Venda::with('itens')->findOrFail($id);
        $usuario = $request->user();
        
        try {
            return DB::transaction(function () use ($request, $venda, $usuario) {
                $alteracoes = [];

                // 1. ATUALIZAR FORMA DE PAGAMENTO
                if ($request->has('idFormapagamento') && $request->idFormapagamento != $venda->idFormapagamento) {
                    $formaPgtoAntiga = $venda->formaPagamento->nome ?? 'N/A';
                    $formaPgtoNova = \App\Models\FormaPagamento::find($request->idFormapagamento)->nome ?? 'N/A';
                    
                    $alteracoes[] = [
                        'campo_alterado' => 'idFormapagamento',
                        'valor_anterior' => $venda->idFormapagamento,
                        'valor_novo' => $request->idFormapagamento,
                        'descricao' => "Forma de pagamento alterada de {$formaPgtoAntiga} para {$formaPgtoNova}"
                    ];
                }

                // 2. ATUALIZAR ITENS (se fornecidos)
                if ($request->has('itens')) {
                    // Reverter estoque dos itens antigos
                    foreach ($venda->itens as $itemAntigo) {
                        if ($itemAntigo->idVariacao) {
                            $variacao = ProdutoVariacao::find($itemAntigo->idVariacao);
                            if ($variacao) {
                                $variacao->increment('quantidade', $itemAntigo->quantidade);
                            }
                        }
                    }

                    // Deletar itens antigos
                    ItemVenda::where('idVenda', $venda->idVenda)->delete();

                    // Criar novos itens e decrementar estoque
                    $valorTotalItens = 0;
                    foreach ($request->itens as $item) {
                        $valorTotalItem = $item['quantidade'] * $item['valor_unitario'];
                        $descontoItem = $item['desconto_item'] ?? 0;
                        
                        ItemVenda::create([
                            'idVenda' => $venda->idVenda,
                            'idProduto' => $item['idProduto'],
                            'idVariacao' => $item['idVariacao'] ?? null,
                            'quantidade' => $item['quantidade'],
                            'valor_unitario' => $item['valor_unitario'],
                            'valor_total' => $valorTotalItem - $descontoItem,
                            'desconto_item' => $descontoItem,
                        ]);

                        $valorTotalItens += ($valorTotalItem - $descontoItem);

                        // Decrementar estoque da nova variação
                        if (isset($item['idVariacao']) && $item['idVariacao']) {
                            $variacao = ProdutoVariacao::find($item['idVariacao']);
                            if ($variacao) {
                                $variacao->decrement('quantidade', $item['quantidade']);
                            }
                        }
                    }

                    $alteracoes[] = [
                        'campo_alterado' => 'itens',
                        'valor_anterior' => count($venda->itens),
                        'valor_novo' => count($request->itens),
                        'descricao' => 'Itens da venda foram alterados'
                    ];

                    // Recalcular valor_total
                    $desconto = $request->desconto ?? $venda->desconto;
                    $request->merge(['valor_total' => $valorTotalItens - $desconto]);
                }

                // 3. ATUALIZAR DESCONTO
                if ($request->has('desconto') && $request->desconto != $venda->desconto) {
                    $alteracoes[] = [
                        'campo_alterado' => 'desconto',
                        'valor_anterior' => $venda->desconto,
                        'valor_novo' => $request->desconto,
                        'descricao' => 'Desconto alterado de R$ ' . number_format($venda->desconto, 2, ',', '.') . 
                                       ' para R$ ' . number_format($request->desconto, 2, ',', '.')
                    ];
                    
                    // Recalcular valor_total se não foi recalculado pelos itens
                    if (!$request->has('itens')) {
                        $subtotal = $venda->itens->sum('valor_total');
                        $request->merge(['valor_total' => $subtotal - $request->desconto]);
                    }
                }

                // 4. ATUALIZAR OBSERVAÇÕES
                if ($request->has('observacoes') && $request->observacoes != $venda->observacoes) {
                    $alteracoes[] = [
                        'campo_alterado' => 'observacoes',
                        'valor_anterior' => $venda->observacoes,
                        'valor_novo' => $request->observacoes,
                        'descricao' => 'Observações alteradas'
                    ];
                }

                // 5. ATUALIZAR STATUS
                if ($request->has('ativo') && $request->ativo != $venda->ativo) {
                    $statusAnterior = $venda->ativo == 2 ? 'Cancelada' : 'Ativa';
                    $statusNovo = $request->ativo == 2 ? 'Cancelada' : 'Ativa';
                    
                    $alteracoes[] = [
                        'campo_alterado' => 'ativo',
                        'valor_anterior' => $venda->ativo,
                        'valor_novo' => $request->ativo,
                        'descricao' => "Status alterado de {$statusAnterior} para {$statusNovo}"
                    ];
                }

                // Atualizar venda
                $venda->update($request->only(['idFormapagamento', 'observacoes', 'desconto', 'valor_total', 'ativo']));

                // Registrar histórico
                foreach ($alteracoes as $alteracao) {
                    \App\Models\VendaHistorico::create([
                        'idVenda' => $venda->idVenda,
                        'idUsuario' => $usuario->idUsuario,
                        'data_hora' => now(),
                        'campo_alterado' => $alteracao['campo_alterado'],
                        'valor_anterior' => $alteracao['valor_anterior'],
                        'valor_novo' => $alteracao['valor_novo'],
                        'descricao' => $alteracao['descricao']
                    ]);
                }

                return response()->json($venda->load(['cliente', 'formaPagamento', 'funcionario', 'itens.produto', 'itens.variacao', 'historico.usuario']));
            });

        } catch (\Exception $e) {
            \Log::error('Erro ao atualizar venda: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar venda', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancelar venda (Soft Delete)
     */
    public function destroy($id)
    {
        $venda = Venda::findOrFail($id);
        
        // Reverter estoque
        foreach ($venda->itens as $item) {
            if ($item->idVariacao) {
                $variacao = ProdutoVariacao::find($item->idVariacao);
                if ($variacao) {
                    $variacao->increment('quantidade', $item->quantidade);
                }
            }
        }
        
        $venda->update(['ativo' => 2]);

        return response()->json(['message' => 'Venda cancelada com sucesso']);
    }


    public function relatorio(Request $request)
    {
        try {
            \Log::info('Relatório - Iniciando', $request->all());
            
            $query = Venda::with(['cliente', 'formaPagamento', 'itens.produto', 'itens.variacao']);
            
            // Filtro por período
            if ($request->has('data_inicio') && $request->data_inicio) {
                $query->whereDate('data_hora', '>=', $request->data_inicio);
            }
            
            if ($request->has('data_fim') && $request->data_fim) {
                $query->whereDate('data_hora', '<=', $request->data_fim);
            }
            
            // Filtro por cliente
            if ($request->has('idCliente') && $request->idCliente) {
                $query->where('idCliente', $request->idCliente);
            }
            
            // Filtro por forma de pagamento
            if ($request->has('idFormapagamento') && $request->idFormapagamento) {
                $query->where('idFormapagamento', $request->idFormapagamento);
            }
            
            // Buscar vendas ativas
            $vendas = $query->where('ativo', 1)
                           ->orderBy('data_hora', 'desc')
                           ->get();
            
            \Log::info('Relatório - Vendas encontradas', ['count' => $vendas->count()]);
            
            // Calcular totalizadores
            $valorBruto = 0;
            $totalDescontos = 0;
            $valorLiquido = 0;
            
            foreach ($vendas as $venda) {
                $valorLiquido += floatval($venda->valor_total);
                $totalDescontos += floatval($venda->desconto);
                $valorBruto += (floatval($venda->valor_total) + floatval($venda->desconto));
            }
            
            $totalizadores = [
                'total_vendas' => $vendas->count(),
                'valor_bruto' => round($valorBruto, 2),
                'total_descontos' => round($totalDescontos, 2),
                'valor_liquido' => round($valorLiquido, 2),
                'ticket_medio' => $vendas->count() > 0 ? round($valorLiquido / $vendas->count(), 2) : 0
            ];
            
            \Log::info('Relatório - Totalizadores', $totalizadores);
            
            return response()->json([
                'vendas' => $vendas,
                'totalizadores' => $totalizadores
            ]);
        } catch (\Exception $e) {
            \Log::error('Relatório - Erro', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
