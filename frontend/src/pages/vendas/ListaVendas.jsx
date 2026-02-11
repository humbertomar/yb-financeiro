import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import { ActionButtons, ViewButton, EditButton, DeleteButton } from '../../components/ActionButtons';
import ResponsiveTable from '../../components/ResponsiveTable';

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

    const columns = [
        {
            key: 'idVenda',
            label: 'ID',
            render: (venda) => `#${venda.idVenda}`,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'data_hora',
            label: 'Data/Hora',
            render: (venda) => formatarData(venda.data_hora),
            className: 'text-gray-500'
        },
        {
            key: 'cliente',
            label: 'Cliente',
            render: (venda) => venda.cliente?.nome || '-',
            className: 'text-gray-900'
        },
        {
            key: 'itens',
            label: 'Itens',
            render: (venda) => `${venda.itens?.length || 0} item(ns)`,
            className: 'text-gray-500'
        },
        {
            key: 'valor_total',
            label: 'Valor Total',
            render: (venda) => formatarValor(venda.valor_total || 0),
            className: 'font-medium text-green-600'
        },
        {
            key: 'forma_pagamento',
            label: 'Pagamento',
            render: (venda) => venda.forma_pagamento?.nome || '-',
            className: 'text-gray-500'
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Vendas</h2>
                <Link
                    to="/vendas/nova"
                    className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-4 py-3 sm:py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition text-center font-medium shadow-md hover:shadow-lg"
                >
                    + Nova Venda
                </Link>
            </div>

            {/* Filtros */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar por ID ou cliente..."
                    className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Data Início"
                />
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Data Fim"
                />
            </div>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <ResponsiveTable
                columns={columns}
                data={vendas}
                keyExtractor={(venda) => venda.idVenda}
                actions={(venda) => (
                    <ActionButtons>
                        <ViewButton to={`/vendas/${venda.idVenda}`} />
                        <EditButton to={`/vendas/${venda.idVenda}/editar`} />
                        <DeleteButton onClick={() => handleCancelar(venda.idVenda)} title="Cancelar" />
                    </ActionButtons>
                )}
                emptyMessage="Nenhuma venda encontrada."
            />

            {/* Paginação */}
            {pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-700 text-center sm:text-left">
                        Página <span className="font-medium">{pagination.current_page}</span> de <span className="font-medium">{pagination.last_page}</span> (Total: {pagination.total})
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium min-w-[100px]"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium min-w-[100px]"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
