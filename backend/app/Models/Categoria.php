<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'idCategoria';
    public $timestamps = false;
    
    protected $fillable = [
        'nome',
        'imagem',
        'texto',
        'ativo'
    ];
    
    protected $casts = [
        'ativo' => 'integer',
    ];
    
    // Relacionamento com Produtos
    public function produtos()
    {
        return $this->hasMany(Produto::class, 'idCategoria', 'idCategoria');
    }
    
    // Scope para categorias ativas
    public function scopeAtivas($query)
    {
        return $query->where('ativo', '!=', 2);
    }
}
