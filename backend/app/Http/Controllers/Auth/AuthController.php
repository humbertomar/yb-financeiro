<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login do usuário
     */
    public function login(Request $request)
    {
        // DEBUG EXTREMO: Retorna o payload recebido e para execution
        // Veja isso na aba Network -> Response do navegador
        // dd($request->all());

        \Log::info('=== TENTATIVA DE LOGIN ===');
        \Log::info('Email recebido: ' . $request->email);
        \Log::info('Senha recebida: ' . ($request->senha ? 'SIM' : 'NÃO'));

        $request->validate([
            'email' => 'required|email',
            'senha' => 'required',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        \Log::info('Usuário encontrado: ' . ($usuario ? 'SIM (ID: ' . $usuario->uid . ')' : 'NÃO'));

        // Verificar se usuário existe
        if (!$usuario) {
            \Log::warning('Usuário não encontrado');
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        \Log::info('Hash no banco: ' . substr($usuario->password, 0, 10) . '...');

        // Converter hash $2a$ (bcrypt antigo) para $2y$ (Laravel)
        $senhaHash = $usuario->password;
        if (str_starts_with($senhaHash, '$2a$')) {
            $senhaHash = '$2y$' . substr($senhaHash, 4);
            \Log::info('Hash convertido de $2a$ para $2y$');
        }

        // Verificar senha
        $senhaValida = Hash::check($request->senha, $senhaHash) || 
                       $request->senha === $usuario->password;

        \Log::info('Senha válida: ' . ($senhaValida ? 'SIM' : 'NÃO'));

        if (!$senhaValida) {
            \Log::warning('Senha inválida');
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        \Log::info('Status ativo: ' . $usuario->ativo);

        // Verificar se usuário está ativo
        if ($usuario->ativo != 1) {
            \Log::warning('Usuário inativo');
            throw ValidationException::withMessages([
                'email' => ['Usuário inativo.'],
            ]);
        }

        // Criar token de autenticação
        $token = $usuario->createToken('auth-token')->plainTextToken;

        \Log::info('Login bem-sucedido! Token gerado.');

        return response()->json([
            'user' => [
                'id' => $usuario->uid,
                'nome' => $usuario->name,
                'email' => $usuario->email,
                'tipo_acesso' => $usuario->tipo_acesso,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Logout do usuário
     */
    public function logout(Request $request)
    {
        // Deletar o token atual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    /**
     * Retornar dados do usuário autenticado
     */
    public function me(Request $request)
    {
        $usuario = $request->user();

        return response()->json([
            'user' => [
                'id' => $usuario->uid,
                'nome' => $usuario->name,
                'email' => $usuario->email,
                'tipo_acesso' => $usuario->tipo_acesso,
            ]
        ]);
    }
}
