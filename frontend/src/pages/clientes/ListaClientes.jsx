import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/clienteService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';
import ResponsiveTable from '../../components/ResponsiveTable';

export default function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        carregarClientes(1);
    }, []);

    // Debounce para busca
    useEffect(() => {
        const timer = setTimeout(() => {
            carregarClientes(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    async function carregarClientes(page = 1) {
        try {
            setLoading(true);
            const dados = await clienteService.listar(page, searchTerm);

            setClientes(dados.data || []);
            setPagination({
                current_page: dados.current_page,
                last_page: dados.last_page,
                total: dados.total
            });
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setErro('Erro ao carregar lista de clientes.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await clienteService.remover(id);
                carregarClientes(pagination.current_page);
            } catch (error) {
                alert('Erro ao excluir cliente.');
            }
        }
    }

    function handlePageChange(newPage) {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            carregarClientes(newPage);
        }
    }

    if (loading && clientes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando clientes...</div>
            </div>
        );
    }

    const columns = [
        {
            key: 'nome',
            label: 'Nome',
            render: (cliente) => cliente.nome,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'cpf',
            label: 'CPF',
            render: (cliente) => cliente.cpf || '-',
            className: 'text-gray-500'
        },
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            render: (cliente) => cliente.whatsapp || '-',
            className: 'text-gray-500'
        },
        {
            key: 'cidade',
            label: 'Cidade',
            render: (cliente) => cliente.cidade || '-',
            className: 'text-gray-500'
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Clientes</h2>
                <Link
                    to="/clientes/novo"
                    className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-700 transition text-center font-medium"
                >
                    + Novo Cliente
                </Link>
            </div>

            {/* Campo de Busca */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar por nome, CPF ou telefone..."
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
            </div>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <ResponsiveTable
                columns={columns}
                data={clientes}
                keyExtractor={(cliente) => cliente.idCliente}
                actions={(cliente) => (
                    <ActionButtons>
                        <EditButton to={`/clientes/${cliente.idCliente}/editar`} />
                        <DeleteButton onClick={() => handleDelete(cliente.idCliente)} />
                    </ActionButtons>
                )}
                emptyMessage="Nenhum cliente encontrado."
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
