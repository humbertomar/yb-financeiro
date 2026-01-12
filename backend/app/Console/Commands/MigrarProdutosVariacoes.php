<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Produto;
use App\Models\ProdutoVariacao;

class MigrarProdutosVariacoes extends Command
{
    protected $signature = 'produtos:migrar-variacoes';
    protected $description = 'Migra produtos antigos (sem variações) para a nova estrutura de produto_variacoes';

    public function handle()
    {
        $this->info('🚀 Iniciando migração de produtos para variações...');
        
        // Busca produtos ativos que não têm variações
        $produtos = Produto::whereDoesntHave('variacoes')
            ->where('ativo', '!=', 2)
            ->get();

        if ($produtos->isEmpty()) {
            $this->info('✅ Nenhum produto precisa ser migrado!');
            return 0;
        }

        $this->info("📦 Encontrados {$produtos->count()} produtos para migrar.");
        
        $bar = $this->output->createProgressBar($produtos->count());
        $bar->start();

        $migrados = 0;
        $erros = 0;

        foreach ($produtos as $produto) {
            try {
                // Cria variação "Padrão" com os dados da tabela antiga
                ProdutoVariacao::create([
                    'idProduto' => $produto->idProduto,
                    'nome_variacao' => 'Padrão',
                    'valor1' => $produto->valor1 ?? 0,
                    'valor2' => $produto->valor2 ?? 0,
                    'valor3' => $produto->valor3 ?? 0,
                    'quantidade' => $produto->quantidade ?? 0,
                    'ativo' => 1
                ]);

                $migrados++;
            } catch (\Exception $e) {
                $this->error("\n❌ Erro ao migrar produto ID {$produto->idProduto}: " . $e->getMessage());
                $erros++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Migração concluída!");
        $this->info("   • Produtos migrados: {$migrados}");
        
        if ($erros > 0) {
            $this->warn("   • Erros: {$erros}");
        }

        $this->newLine();
        $this->comment('💡 Dica: Agora você pode zerar os campos valor1, valor2, valor3, quantidade da tabela produtos se quiser.');

        return 0;
    }
}
