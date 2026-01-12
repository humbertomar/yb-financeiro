import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">YB Importa</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Olá, {user?.nome}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                        <p className="text-gray-600">
                            Bem-vindo ao sistema YB Importa! 🎉
                        </p>
                        <p className="text-gray-600 mt-2">
                            Aqui vamos adicionar os módulos: Produtos, Vendas, Clientes, etc.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
