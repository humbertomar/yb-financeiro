<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdutoVariacao extends Model
{
    protected $table = 'produto_variacoes';
    
    // Como a tabela produtos usa idProduto, e criamos id padrão aqui, mantemos id.
    // Se você criou PK diferente, avise. Assumindo id padrão do Laravel.
    protected $primaryKey = 'id';
    
    public $timestamps = false;
    
    protected $fillable = [
        'idProduto',
        'nome_variacao',
        'valor1', // Custo
        'valor2', // Atacado
        'valor3', // Varejo
        'quantidade',
        'codigo_sku',
        'ativo'
    ];
    
    // Relacionamento inverso
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'idProduto', 'idProduto');
    }
}
