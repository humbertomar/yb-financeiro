<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParcelaContaPagar extends Model
{
    protected $table = 'parcelas_contas_pagar';
    protected $primaryKey = 'idParcela';
    public $timestamps = false;
    
    protected $fillable = [
        'idContaPagar',
        'numero_parcela',
        'valor_parcela',
        'data_vencimento',
        'data_pagamento',
        'valor_pago',
        'status',
        'observacoes'
    ];
    
    protected $casts = [
        'valor_parcela' => 'decimal:2',
        'valor_pago' => 'decimal:2',
        'numero_parcela' => 'integer'
    ];
    
    public function contaPagar()
    {
        return $this->belongsTo(ContaPagar::class, 'idContaPagar', 'idContaPagar');
    }
    
    // Atualizar status automaticamente baseado na data
    public function getStatusAttribute($value)
    {
        if ($this->data_pagamento) {
            return 'pago';
        }
        
        if ($this->data_vencimento < now()->format('Y-m-d')) {
            return 'atrasado';
        }
        
        return 'pendente';
    }
}
