<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use App\Models\Cliente;
use App\Models\ContaPagar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function statistics()
    {
        try {
            $hoje = Carbon::today();
            $inicioMes = Carbon::now()->startOfMonth();
            $inicioAno = Carbon::now()->startOfYear();

            // Estatísticas de Vendas
            $vendasHoje = Venda::whereDate('data_hora', $hoje)
                ->where('ativo', '!=', 2)
                ->sum('valor_total') ?? 0;

            $vendasMes = Venda::whereDate('data_hora', '>=', $inicioMes)
                ->where('ativo', '!=', 2)
                ->sum('valor_total') ?? 0;

            $vendasAno = Venda::whereDate('data_hora', '>=', $inicioAno)
                ->where('ativo', '!=', 2)
                ->sum('valor_total') ?? 0;

            $totalVendas = Venda::where('ativo', '!=', 2)->count();

            // Produtos
            $totalProdutos = Produto::where('ativo', '!=', 2)->count();
            $produtosBaixoEstoque = Produto::where('ativo', '!=', 2)
                ->where('quantidade', '<=', 5)
                ->count();

            // Clientes
            $totalClientes = Cliente::where('ativo', '!=', 2)->count();
            // Como a tabela clientes não tem created_at, não podemos calcular novos clientes
            $clientesNovos = 0;


            // Vendas Recentes (últimas 5)
            $vendasRecentes = Venda::with(['cliente', 'funcionario'])
                ->where('ativo', '!=', 2)
                ->orderBy('data_hora', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($venda) {
                    return [
                        'id' => $venda->idVenda,
                        'cliente' => $venda->cliente->nome ?? 'Cliente não informado',
                        'valor' => $venda->valor_total,
                        'data' => $venda->data_hora->format('d/m/Y H:i'),
                        'funcionario' => $venda->funcionario->nome ?? 'N/A'
                    ];
                });

            // Vendas dos últimos 7 dias (para gráfico)
            $vendasUltimos7Dias = [];
            for ($i = 6; $i >= 0; $i--) {
                $data = Carbon::today()->subDays($i);
                $total = Venda::whereDate('data_hora', $data)
                    ->where('ativo', '!=', 2)
                    ->sum('valor_total') ?? 0;
                
                $vendasUltimos7Dias[] = [
                    'data' => $data->format('d/m'),
                    'total' => (float) $total
                ];
            }

            // Vendas dos últimos 12 meses (para gráfico)
            $vendasUltimos12Meses = [];
            for ($i = 11; $i >= 0; $i--) {
                $mes = Carbon::now()->subMonths($i);
                $total = Venda::whereYear('data_hora', $mes->year)
                    ->whereMonth('data_hora', $mes->month)
                    ->where('ativo', '!=', 2)
                    ->sum('valor_total') ?? 0;
                
                $vendasUltimos12Meses[] = [
                    'mes' => $mes->format('M/y'),
                    'total' => (float) $total
                ];
            }

            // Contas a Pagar - Simplificado para evitar erros
            try {
                $contasVencidas = DB::table('parcelas_contas_pagar')
                    ->where('status', 'pendente')
                    ->whereDate('data_vencimento', '<', Carbon::today())
                    ->count();

                $contasAVencer = DB::table('parcelas_contas_pagar')
                    ->where('status', 'pendente')
                    ->whereDate('data_vencimento', '>=', Carbon::today())
                    ->whereDate('data_vencimento', '<=', Carbon::today()->addDays(7))
                    ->count();
            } catch (\Exception $e) {
                $contasVencidas = 0;
                $contasAVencer = 0;
            }


            // Produtos em baixo estoque
            $produtosEstoque = Produto::where('ativo', '!=', 2)
                ->where('quantidade', '<=', 5)
                ->orderBy('quantidade', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($produto) {
                    return [
                        'id' => $produto->idProduto,
                        'nome' => $produto->nome,
                        'quantidade' => $produto->quantidade,
                        'categoria' => $produto->categoria->nome ?? 'Sem categoria'
                    ];
                });

            return response()->json([
                'vendas' => [
                    'hoje' => (float) $vendasHoje,
                    'mes' => (float) $vendasMes,
                    'ano' => (float) $vendasAno,
                    'total' => $totalVendas
                ],
                'produtos' => [
                    'total' => $totalProdutos,
                    'baixo_estoque' => $produtosBaixoEstoque
                ],
                'clientes' => [
                    'total' => $totalClientes,
                    'novos_mes' => $clientesNovos
                ],
                'vendas_recentes' => $vendasRecentes,
                'graficos' => [
                    'ultimos_7_dias' => $vendasUltimos7Dias,
                    'ultimos_12_meses' => $vendasUltimos12Meses
                ],
                'contas_pagar' => [
                    'vencidas' => $contasVencidas,
                    'a_vencer' => $contasAVencer
                ],
                'produtos_estoque' => $produtosEstoque
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar estatísticas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
