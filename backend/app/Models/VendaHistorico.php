<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendaHistorico extends Model
{
    protected $table = 'vendas_historico';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'idVenda',
        'idUsuario',
        'data_hora',
        'campo_alterado',
        'valor_anterior',
        'valor_novo',
        'descricao'
    ];
    
    protected $casts = [
        'data_hora' => 'datetime',
    ];
    
    // Relacionamento com Venda
    public function venda()
    {
        return $this->belongsTo(Venda::class, 'idVenda', 'idVenda');
    }
    
    // Relacionamento com Usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'idUsuario');
    }
}
