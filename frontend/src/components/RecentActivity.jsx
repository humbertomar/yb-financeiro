import { useNavigate } from 'react-router-dom';

export default function RecentActivity({ vendas, loading }) {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Vendas Recentes</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Vendas Recentes</h2>
                <button
                    onClick={() => navigate('/vendas')}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap"
                >
                    Ver todas →
                </button>
            </div>

            {vendas && vendas.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                    {vendas.map((venda) => (
                        <div
                            key={venda.id}
                            onClick={() => navigate(`/vendas/${venda.id}`)}
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {venda.cliente.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                                        {venda.cliente}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">{venda.data}</p>
                                </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                                <p className="font-bold text-green-600 text-sm sm:text-base whitespace-nowrap">
                                    R$ {parseFloat(venda.valor).toFixed(2)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">{venda.funcionario}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">📭</p>
                    <p className="text-sm sm:text-base">Nenhuma venda recente</p>
                </div>
            )}
        </div>
    );
}
