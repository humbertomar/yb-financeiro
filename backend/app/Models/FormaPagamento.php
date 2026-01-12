<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPagamento extends Model
{
    protected $table = 'formas_pagamentos';
    protected $primaryKey = 'idFormapagamento';
    public $timestamps = false;
    
    protected $fillable = [
        'forma_pagamento',
        'texto',
        'ativo'
    ];
    
    protected $casts = [
        'ativo' => 'integer',
    ];
    
    // Relacionamento com Vendas
    public function vendas()
    {
        return $this->hasMany(Venda::class, 'idFormapagamento', 'idFormapagamento');
    }
    
    // Scope para formas ativas
    public function scopeAtivas($query)
    {
        return $query->where('ativo', '!=', 2);
    }
}
