<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemVenda extends Model
{
    protected $table = 'itens_venda';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'idVenda',
        'idProduto',
        'idVariacao',
        'quantidade',
        'valor_unitario',
        'valor_total',
        'desconto_item'
    ];
    
    protected $casts = [
        'quantidade' => 'integer',
        'valor_unitario' => 'decimal:2',
        'valor_total' => 'decimal:2',
        'desconto_item' => 'decimal:2',
    ];
    
    // Relacionamento com Venda
    public function venda()
    {
        return $this->belongsTo(Venda::class, 'idVenda', 'idVenda');
    }
    
    // Relacionamento com Produto
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'idProduto', 'idProduto');
    }
    
    // Relacionamento com Variação (opcional)
    public function variacao()
    {
        return $this->belongsTo(ProdutoVariacao::class, 'idVariacao', 'id');
    }
}
