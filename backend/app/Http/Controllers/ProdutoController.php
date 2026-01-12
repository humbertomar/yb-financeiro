<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    /**
     * Listar todos os produtos
     */
    public function index(Request $request)
    {
        try {
            // Carrega produtos com a categoria e variações, paginado
            $query = Produto::with(['categoria', 'variacoes'])->ativas();
            
            // Filtro de busca por nome
            if ($request->has('search') && $request->search) {
                $query->where('nome', 'like', '%' . $request->search . '%');
            }
            
            // Filtro por categoria
            if ($request->has('idCategoria') && $request->idCategoria) {
                $query->where('idCategoria', $request->idCategoria);
            }
            
            // Se parâmetro 'all' for true, retorna todos sem paginação
            if ($request->has('all') && $request->all == 'true') {
                $produtos = $query->orderBy('nome', 'asc')->get();
                return response()->json($produtos);
            }
            
            // Caso contrário, retorna paginado
            $produtos = $query
                ->orderBy('nome', 'asc')
                ->paginate(10);
                
            return response()->json($produtos);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Exibir produto específico
     */
    public function show($id)
    {
        try {
            $produto = Produto::with(['categoria', 'variacoes'])->findOrFail($id);
            return response()->json($produto);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        }
    }

    /**
     * Criar novo produto com variações
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'idCategoria' => 'required|exists:categorias,idCategoria',
            'variacoes' => 'required|array|min:1', // Exige pelo menos 1 variação (Opção B)
            'variacoes.*.nome' => 'required|string',
            'variacoes.*.valor3' => 'required|numeric', // Preço Venda obrigatório
            'variacoes.*.quantidade' => 'required|integer',
        ]);

        try {
            return \DB::transaction(function () use ($request) {
                // 1. Criar Produto Pai (Valores zerados pois ficam nas variações)
                $produto = Produto::create([
                    'nome' => $request->nome,
                    'idCategoria' => $request->idCategoria,
                    'texto' => $request->texto ?? '',
                    'imagem' => '', 
                    'valor1' => 0,
                    'valor2' => 0, 
                    'valor3' => 0,
                    'quantidade' => 0,
                    'validade' => '1970-01-01',
                    'ativo' => $request->ativo ?? 1
                ]);

                // 2. Criar Variações
                foreach ($request->variacoes as $v) {
                    \App\Models\ProdutoVariacao::create([
                        'idProduto' => $produto->idProduto,
                        'nome_variacao' => $v['nome'],
                        'valor1' => $v['valor1'] ?? 0,
                        'valor2' => $v['valor2'] ?? 0,
                        'valor3' => $v['valor3'],
                        'quantidade' => $v['quantidade'],
                        'ativo' => 1
                    ]);
                }

                // Recarrega com variações para retorno
                return response()->json($produto->load('variacoes'), 201);
            });

        } catch (\Exception $e) {
            \Log::error('Erro ao criar produto: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao salvar produto'], 500);
        }
    }

    /**
     * Atualizar produto com variações
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'idCategoria' => 'required|exists:categorias,idCategoria',
            'variacoes' => 'required|array|min:1',
            'variacoes.*.nome' => 'required|string',
            'variacoes.*.valor3' => 'required|numeric',
            'variacoes.*.quantidade' => 'required|integer',
        ]);

        try {
            return \DB::transaction(function () use ($request, $id) {
                $produto = Produto::findOrFail($id);
                
                // Atualiza dados gerais
                $produto->update([
                    'nome' => $request->nome,
                    'idCategoria' => $request->idCategoria,
                    'texto' => $request->texto ?? '',
                    'ativo' => $request->ativo ?? 1
                ]);

                // Remove variações antigas
                \App\Models\ProdutoVariacao::where('idProduto', $id)->delete();

                // Cria novas variações
                foreach ($request->variacoes as $v) {
                    \App\Models\ProdutoVariacao::create([
                        'idProduto' => $produto->idProduto,
                        'nome_variacao' => $v['nome'],
                        'valor1' => $v['valor1'] ?? 0,
                        'valor2' => $v['valor2'] ?? 0,
                        'valor3' => $v['valor3'],
                        'quantidade' => $v['quantidade'],
                        'ativo' => 1
                    ]);
                }

                return response()->json($produto->load('variacoes'));
            });
        } catch (\Exception $e) {
            \Log::error('Erro ao atualizar produto: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar produto'], 500);
        }
    }

    /**
     * Remover produto (Soft Delete)
     */
    public function destroy($id)
    {
        $produto = Produto::findOrFail($id);
        $produto->update(['ativo' => 2]);

        return response()->json(['message' => 'Produto removido com sucesso']);
    }
    
    /**
     * Relatório de Estoque Atual
     */
    public function relatorioEstoque(Request $request)
    {
        try {
            $query = Produto::with(['categoria', 'variacoes'])
                ->where('ativo', 1);
            
            // Filtro por categoria
            if ($request->has('idCategoria') && $request->idCategoria) {
                $query->where('idCategoria', $request->idCategoria);
            }
            
            // Filtro por nome
            if ($request->has('nome') && $request->nome) {
                $query->where('nome', 'like', '%' . $request->nome . '%');
            }
            
            $produtos = $query->orderBy('nome')->get();
            
            // Processar dados
            $itens = [];
            $totalProdutos = 0;
            $totalItens = 0;
            $valorTotal = 0;
            
            foreach ($produtos as $produto) {
                if ($produto->variacoes->count() > 0) {
                    foreach ($produto->variacoes as $variacao) {
                        $valorEstoque = floatval($variacao->quantidade) * floatval($variacao->valor2 ?? 0);
                        
                        $itens[] = [
                            'produto' => $produto->nome,
                            'variacao' => $variacao->nome,
                            'categoria' => $produto->categoria->nome ?? '-',
                            'quantidade' => $variacao->quantidade,
                            'valor_minimo' => floatval($variacao->valor1 ?? 0),
                            'valor_medio' => floatval($variacao->valor2 ?? 0),
                            'valor_maximo' => floatval($variacao->valor3 ?? 0),
                            'valor_estoque' => $valorEstoque
                        ];
                        
                        $totalItens += $variacao->quantidade;
                        $valorTotal += $valorEstoque;
                    }
                } else {
                    $valorEstoque = floatval($produto->quantidade) * floatval($produto->valor2 ?? 0);
                    
                    $itens[] = [
                        'produto' => $produto->nome,
                        'variacao' => '-',
                        'categoria' => $produto->categoria->nome ?? '-',
                        'quantidade' => $produto->quantidade,
                        'valor_minimo' => floatval($produto->valor1 ?? 0),
                        'valor_medio' => floatval($produto->valor2 ?? 0),
                        'valor_maximo' => floatval($produto->valor3 ?? 0),
                        'valor_estoque' => $valorEstoque
                    ];
                    
                    $totalItens += $produto->quantidade;
                    $valorTotal += $valorEstoque;
                }
                
                $totalProdutos++;
            }
            
            return response()->json([
                'itens' => $itens,
                'totalizadores' => [
                    'total_produtos' => $totalProdutos,
                    'total_itens' => $totalItens,
                    'valor_total' => round($valorTotal, 2)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
