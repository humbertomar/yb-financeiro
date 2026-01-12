<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    // Nome da tabela (não segue padrão 'users')
    protected $table = 'usuarios';
    
    // Chave primária customizada
    protected $primaryKey = 'uid';
    
    // Desabilitar timestamps automáticos (created_at, updated_at)
    public $timestamps = false;
    
    // Campos fillable
    protected $fillable = [
        'name',
        'email',
        'password',
        'tipo_acesso',
        'ativo'
    ];
    
    // Ocultar senha em JSON
    protected $hidden = [
        'password',
    ];
    
    // Accessor para compatibilidade com Sanctum
    public function getAuthPassword()
    {
        return $this->password;
    }
    
    // Scope para usuários ativos (soft delete legado)
    public function scopeAtivos($query)
    {
        return $query->where('ativo', 1);
    }
}
