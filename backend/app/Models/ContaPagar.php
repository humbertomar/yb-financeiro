<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContaPagar extends Model
{
    protected $table = 'contas_pagar';
    protected $primaryKey = 'idContaPagar';
    public $timestamps = false;
    
    protected $fillable = [
        'descricao',
        'valor_total',
        'categoria',
        'fornecedor',
        'parcelado',
        'numero_parcelas',
        'data_cadastro',
        'observacoes',
        'ativo'
    ];
    
    protected $casts = [
        'valor_total' => 'decimal:2',
        'parcelado' => 'boolean',
        'ativo' => 'boolean',
        'numero_parcelas' => 'integer'
    ];
    
    public function parcelas()
    {
        return $this->hasMany(ParcelaContaPagar::class, 'idContaPagar', 'idContaPagar');
    }
}
