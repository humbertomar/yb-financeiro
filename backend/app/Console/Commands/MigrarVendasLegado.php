<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Venda;
use App\Models\ItemVenda;
use Illuminate\Support\Facades\DB;

class MigrarVendasLegado extends Command
{
    protected $signature = 'migrar:vendas-legado';
    protected $description = 'Migra vendas antigas (sem itens) para a nova estrutura com itens_venda';

    public function handle()
    {
        $this->info('Iniciando migração de vendas legado...');

        // Buscar vendas que não têm itens
        $vendasSemItens = Venda::whereDoesntHave('itens')
            ->where('ativo', '!=', 2)
            ->whereNotNull('idProduto')
            ->get();

        $this->info("Encontradas {$vendasSemItens->count()} vendas sem itens.");

        $migradas = 0;
        $erros = 0;

        foreach ($vendasSemItens as $venda) {
            try {
                DB::transaction(function () use ($venda) {
                    // Criar item de venda com os dados legados
                    ItemVenda::create([
                        'idVenda' => $venda->idVenda,
                        'idProduto' => $venda->idProduto,
                        'idVariacao' => null, // Vendas antigas não têm variação
                        'quantidade' => $venda->quantidade ?? 1,
                        'valor_unitario' => $venda->valor ?? 0,
                        'valor_total' => ($venda->quantidade ?? 1) * ($venda->valor ?? 0),
                        'desconto_item' => 0,
                    ]);

                    // Atualizar valor_total da venda se estiver zerado
                    if (!$venda->valor_total || $venda->valor_total == 0) {
                        $venda->update([
                            'valor_total' => ($venda->quantidade ?? 1) * ($venda->valor ?? 0)
                        ]);
                    }
                });

                $migradas++;
                
                if ($migradas % 100 == 0) {
                    $this->info("Migradas {$migradas} vendas...");
                }

            } catch (\Exception $e) {
                $erros++;
                $this->error("Erro ao migrar venda {$venda->idVenda}: " . $e->getMessage());
            }
        }

        $this->info("Migração concluída!");
        $this->info("Vendas migradas: {$migradas}");
        $this->info("Erros: {$erros}");

        return 0;
    }
}
