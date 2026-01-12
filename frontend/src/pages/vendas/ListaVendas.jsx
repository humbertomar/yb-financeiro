import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import { ActionButtons, ViewButton, EditButton, DeleteButton } from '../../components/ActionButtons';

export default function ListaVendas() {
    const [vendas, setVendas] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        carregarVendas(1);
    }, []);

    // Debounce para busca
    useEffect(() => {
        const timer = setTimeout(() => {
            carregarVendas(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, dataInicio, dataFim]);

    async function carregarVendas(page = 1) {
        try {
            setLoading(true);
            const dados = await vendaService.listar(page, searchTerm, dataInicio, dataFim);

            setVendas(dados.data || []);
            setPagination({
                current_page: dados.current_page,
                last_page: dados.last_page,
                total: dados.total
            });
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            setErro('Erro ao carregar lista de vendas.');
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelar(id) {
        if (window.confirm('Tem certeza que deseja CANCELAR esta venda? O estoque será revertido.')) {
            try {
                await vendaService.cancelar(id);
                carregarVendas(pagination.current_page);
            } catch (error) {
                alert('Erro ao cancelar venda.');
            }
        }
    }

    function handlePageChange(newPage) {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            carregarVendas(newPage);
        }
    }

    function formatarData(dataHora) {
        return new Date(dataHora).toLocaleString('pt-BR');
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    if (loading && vendas.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando vendas...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Vendas</h2>
                <Link
                    to="/vendas/nova"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Nova Venda
                </Link>
            </div>

            {/* Filtros */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar por ID ou cliente..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Data Início"
                />
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Data Fim"
                />
            </div>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendas.map((venda) => (
                            <tr key={venda.idVenda} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{venda.idVenda}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatarData(venda.data_hora)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {venda.cliente?.nome || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {venda.itens?.length || 0} item(ns)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    {formatarValor(venda.valor_total || 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {venda.forma_pagamento?.nome || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionButtons>
                                        <ViewButton to={`/vendas/${venda.idVenda}`} />
                                        <EditButton to={`/vendas/${venda.idVenda}/editar`} />
                                        <DeleteButton onClick={() => handleCancelar(venda.idVenda)} title="Cancelar" />
                                    </ActionButtons>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {vendas.length === 0 && !erro && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhuma venda encontrada.
                    </div>
                )}

                {/* Paginação */}
                {pagination.total > 0 && (
                    <div className="flex justify-between items-center mt-4 px-2 border-t pt-4">
                        <div className="text-sm text-gray-700">
                            Página <span className="font-medium">{pagination.current_page}</span> de <span className="font-medium">{pagination.last_page}</span> (Total: {pagination.total})
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
