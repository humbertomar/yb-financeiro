import { useNavigate } from 'react-router-dom';
import { ActionCard } from './Card';

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Nova Venda',
            icon: '🛒',
            color: 'bronze',
            path: '/vendas/nova'
        },
        {
            title: 'Novo Produto',
            icon: '📦',
            color: 'bronze-light',
            path: '/produtos/novo'
        },
        {
            title: 'Novo Cliente',
            icon: '👤',
            color: 'bronze-dark',
            path: '/clientes/novo'
        },
        {
            title: 'Relatórios',
            icon: '📊',
            color: 'cream',
            path: '/relatorios/vendas'
        }
    ];

    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {actions.map((action, index) => (
                    <ActionCard
                        key={index}
                        icon={action.icon}
                        label={action.title}
                        color={action.color}
                        onClick={() => navigate(action.path)}
                    />
                ))}
            </div>
        </div>
    );
}
