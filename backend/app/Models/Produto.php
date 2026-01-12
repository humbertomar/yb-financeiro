<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';
    protected $primaryKey = 'idProduto';
    public $timestamps = false;
    
    protected $fillable = [
        'nome',
        'idCategoria',
        'texto',
        'imagem',
        'valor1',
        'valor2',
        'valor3',
        'quantidade',
        'validade',
        'ativo'
    ];
    
    protected $casts = [
        'valor1' => 'decimal:2',
        'valor2' => 'decimal:2',
        'valor3' => 'decimal:2',
        'quantidade' => 'integer',
        'ativo' => 'integer',
    ];
    
    // Relacionamento com Categoria
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria', 'idCategoria');
    }

    // Relacionamento com Variações
    public function variacoes()
    {
        return $this->hasMany(ProdutoVariacao::class, 'idProduto', 'idProduto');
    }
    
    // Relacionamento com Vendas
    public function vendas()
    {
        return $this->hasMany(Venda::class, 'idProduto', 'idProduto');
    }
    
    // Scope para produtos ativos
    public function scopeAtivos($query)
    {
        return $query->where('ativo', '!=', 2);
    }
    
    // Alias para o scope acima (se houver confusão de nomes)
    public function scopeAtivas($query) 
    {
        return $this->scopeAtivos($query);
    }
    
    // Accessor para URL da imagem
    public function getImagemUrlAttribute()
    {
        return $this->imagem ? asset('uploads/produtos/' . $this->imagem) : null;
    }
}
