import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Nova Venda',
            icon: '🛒',
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            path: '/vendas/nova'
        },
        {
            title: 'Novo Produto',
            icon: '📦',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            path: '/produtos/novo'
        },
        {
            title: 'Novo Cliente',
            icon: '👤',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            path: '/clientes/novo'
        },
        {
            title: 'Relatórios',
            icon: '📊',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            hoverColor: 'hover:from-orange-600 hover:to-orange-700',
            path: '/relatorios/vendas'
        }
    ];

    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className={`${action.color} ${action.hoverColor} text-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center space-y-2 min-h-[100px] sm:min-h-[120px]`}
                    >
                        <span className="text-3xl sm:text-4xl">{action.icon}</span>
                        <span className="font-semibold text-xs sm:text-sm text-center leading-tight">{action.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
