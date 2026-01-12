<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'vendas';
    protected $primaryKey = 'idVenda';
    public $timestamps = false;
    
    protected $fillable = [
        'quantidade', // Legado - manter para compatibilidade
        'valor', // Legado - manter para compatibilidade
        'valor_total', // NOVO - total da venda
        'desconto', // NOVO - desconto total
        'data_hora',
        'idCliente',
        'idFormapagamento',
        'idProduto', // Legado - manter para compatibilidade
        'idFuncionario',
        'comissao',
        'texto',
        'observacoes', // NOVO
        'ativo'
    ];
    
    protected $casts = [
        'valor' => 'decimal:2',
        'valor_total' => 'decimal:2',
        'desconto' => 'decimal:2',
        'comissao' => 'decimal:2',
        'quantidade' => 'integer',
        'data_hora' => 'datetime',
        'ativo' => 'integer',
    ];
    
    // Relacionamentos
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'idProduto', 'idProduto');
    }
    
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'idCliente', 'idCliente');
    }
    
    public function formaPagamento()
    {
        return $this->belongsTo(FormaPagamento::class, 'idFormapagamento', 'idFormapagamento');
    }
    
    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class, 'idFuncionario', 'idFuncionario');
    }
    
    // Relacionamento com Itens da Venda (NOVO)
    public function itens()
    {
        return $this->hasMany(ItemVenda::class, 'idVenda', 'idVenda');
    }
    
    // Relacionamento com Histórico de Alterações
    public function historico()
    {
        return $this->hasMany(VendaHistorico::class, 'idVenda', 'idVenda')->orderBy('data_hora', 'desc');
    }
    
    // Scope para vendas ativas
    public function scopeAtivas($query)
    {
        return $query->where('ativo', '!=', 2);
    }
    
    // Accessor para valor total
    public function getValorTotalAttribute()
    {
        return $this->quantidade * $this->valor;
    }
}
