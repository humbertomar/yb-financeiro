<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';
    protected $primaryKey = 'idCliente';
    public $timestamps = false;
    
    protected $fillable = [
        'nome',
        'email',
        'contato1',
        'contato2',
        'whatsapp',
        'cpf',
        'numero_rg',
        'orgao_emissor',
        'estado_emissor',
        'data_emissao',
        'logradouro',
        'complemento',
        'numero_logradouro',
        'bairro',
        'cidade',
        'estado',
        'cep',
        'frete',
        'altered',
        'ativo'
    ];
    
    protected $casts = [
        'ativo' => 'integer',
    ];
    
    // Relacionamento com Vendas
    public function vendas()
    {
        return $this->hasMany(Venda::class, 'idCliente', 'idCliente');
    }
    
    // Scope para clientes ativos
    public function scopeAtivos($query)
    {
        return $query->where('ativo', '!=', 2);
    }
}
