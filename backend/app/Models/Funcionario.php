<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    protected $table = 'funcionarios';
    protected $primaryKey = 'idFuncionario';
    public $timestamps = false;
    
    protected $fillable = [
        'nome',
        'email',
        'setor',
        'cargo',
        'foto',
        'data_admissao',
        'data_demissao',
        'comissao',
        'status',
        'created'
    ];
    
    protected $casts = [
        'comissao' => 'decimal:2',
        'data_admissao' => 'date',
        'data_demissao' => 'date',
        'status' => 'integer',
    ];
    
    // Relacionamento com Vendas
    public function vendas()
    {
        return $this->hasMany(Venda::class, 'idFuncionario', 'idFuncionario');
    }
    
    // Scope para funcionários ativos
    public function scopeAtivos($query)
    {
        return $query->where('status', '!=', 2);
    }
}
