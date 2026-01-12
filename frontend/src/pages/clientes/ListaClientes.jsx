import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/clienteService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';

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

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
                <Link
                    to="/clientes/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.map((cliente) => (
                            <tr key={cliente.idCliente} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {cliente.nome}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cliente.cpf || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cliente.whatsapp || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cliente.cidade || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionButtons>
                                        <EditButton to={`/clientes/${cliente.idCliente}/editar`} />
                                        <DeleteButton onClick={() => handleDelete(cliente.idCliente)} />
                                    </ActionButtons>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {clientes.length === 0 && !erro && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum cliente encontrado.
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
