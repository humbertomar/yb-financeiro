import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { StatsCard, AlertCard } from '../components/Card';
import RecentActivity from '../components/RecentActivity';

export default function Home() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStatistics();
    }, []);

    async function loadStatistics() {
        try {
            setLoading(true);
            const data = await dashboardService.getStatistics();
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
            setError('Não foi possível carregar as estatísticas');
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 mb-4 font-medium">{error}</p>
                    <button
                        onClick={loadStatistics}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] rounded-lg shadow-sm p-4 sm:p-5 text-white">
                <h1 className="text-lg sm:text-xl font-bold mb-1">Dashboard YB Importa</h1>
                <p className="text-xs sm:text-sm text-[#E8E3D8]">Resumo do seu negócio</p>
            </div>

            {/* Cards de Estatísticas Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {loading ? (
                    // Loading Skeleton
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 sm:h-36"></div>
                        ))}
                    </>
                ) : (
                    <>
                        <StatsCard
                            icon="💰"
                            label="Vendas Hoje"
                            value={`R$ ${stats?.vendas?.hoje?.toFixed(2) || '0,00'}`}
                            color="bronze"
                        />
                        <StatsCard
                            icon="📈"
                            label="Vendas do Mês"
                            value={`R$ ${stats?.vendas?.mes?.toFixed(2) || '0,00'}`}
                            color="bronze"
                        />
                        <StatsCard
                            icon="📦"
                            label="Produtos"
                            value={stats?.produtos?.total || 0}
                            color="cream"
                        />
                        <StatsCard
                            icon="👥"
                            label="Clientes"
                            value={stats?.clientes?.total || 0}
                            color="dark"
                        />
                    </>
                )}
            </div>

            {/* Alertas */}
            {!loading && stats && (
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {/* Alerta de Estoque Baixo */}
                    {stats.produtos?.baixo_estoque > 0 && (
                        <AlertCard
                            type="warning"
                            title="Atenção: Estoque Baixo"
                            message={`${stats.produtos.baixo_estoque} produto(s) com estoque baixo`}
                            count={stats.produtos.baixo_estoque}
                        />
                    )}

                    {/* Alerta de Contas a Pagar */}
                    {stats.contas_pagar?.vencidas > 0 && (
                        <AlertCard
                            type="danger"
                            title="Contas Vencidas"
                            message={`${stats.contas_pagar.vencidas} conta(s) vencida(s)`}
                            count={stats.contas_pagar.vencidas}
                        />
                    )}

                    {stats.contas_pagar?.a_vencer > 0 && (
                        <AlertCard
                            type="info"
                            title="Contas a Vencer"
                            message={`${stats.contas_pagar.a_vencer} conta(s) vence(m) nos próximos 7 dias`}
                            count={stats.contas_pagar.a_vencer}
                        />
                    )}
                </div>
            )}

            {/* Gráfico de Vendas dos Últimos 7 Dias */}
            {!loading && stats?.graficos?.ultimos_7_dias && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Vendas dos Últimos 7 Dias</h2>
                    <div className="flex items-end justify-between h-48 sm:h-64 space-x-1 sm:space-x-2">
                        {stats.graficos.ultimos_7_dias.map((dia, index) => {
                            const maxValue = Math.max(...stats.graficos.ultimos_7_dias.map(d => d.total));
                            const height = maxValue > 0 ? (dia.total / maxValue) * 100 : 0;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="relative w-full group">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                                            style={{ height: `${height}%`, minHeight: dia.total > 0 ? '20px' : '2px' }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                    R$ {dia.total.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 font-medium">{dia.data}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Grid com Vendas Recentes e Produtos em Baixo Estoque */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Vendas Recentes */}
                <RecentActivity vendas={stats?.vendas_recentes} loading={loading} />

                {/* Produtos em Baixo Estoque */}
                {!loading && stats?.produtos_estoque && stats.produtos_estoque.length > 0 && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Produtos em Baixo Estoque</h2>

                        {/* Mobile: Card Layout */}
                        <div className="sm:hidden space-y-3">
                            {stats.produtos_estoque.map((produto) => (
                                <div key={produto.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{produto.nome}</p>
                                            <p className="text-xs text-gray-500 mt-1">{produto.categoria}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.quantidade === 0
                                            ? 'bg-red-100 text-red-800'
                                            : produto.quantidade <= 2
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {produto.quantidade} {produto.quantidade === 1 ? 'unidade' : 'unidades'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop: Table Layout */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantidade
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.produtos_estoque.map((produto) => (
                                        <tr key={produto.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {produto.nome}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {produto.categoria}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.quantidade === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : produto.quantidade <= 2
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {produto.quantidade} {produto.quantidade === 1 ? 'unidade' : 'unidades'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
