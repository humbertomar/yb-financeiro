import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { produtoService } from '../../services/produtoService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
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
        carregarProdutos(1);
    }, []);

    // Debounce para busca
    useEffect(() => {
        const timer = setTimeout(() => {
            carregarProdutos(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    async function carregarProdutos(page = 1) {
        try {
            setLoading(true);
            const dados = await produtoService.listar(page, searchTerm);

            // Quando usa paginate(), o Laravel retorna:
            // { current_page: 1, data: [...], last_page: 5, total: 50, ... }
            setProdutos(dados.data || []);
            setPagination({
                current_page: dados.current_page,
                last_page: dados.last_page,
                total: dados.total
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setErro('Erro ao carregar lista de produtos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await produtoService.remover(id);
                carregarProdutos(pagination.current_page);
            } catch (error) {
                alert('Erro ao excluir produto.');
            }
        }
    }

    function handlePageChange(newPage) {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            carregarProdutos(newPage);
        }
    }

    if (loading && produtos.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando produtos...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
                <Link
                    to="/produtos/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Novo Produto
                </Link>
            </div>

            {/* Campo de Busca */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar produto por nome..."
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variações</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {produtos.map((produto) => (
                            <tr key={produto.idProduto} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{produto.idProduto}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {produto.nome}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {produto.categoria?.nome || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {produto.variacoes && produto.variacoes.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {produto.variacoes.map(v => (
                                                <span key={v.id} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border border-gray-300">
                                                    {v.nome_variacao}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Sem variações</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionButtons>
                                        <EditButton to={`/produtos/${produto.idProduto}/editar`} />
                                        <DeleteButton onClick={() => handleDelete(produto.idProduto)} />
                                    </ActionButtons>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {produtos.length === 0 && !erro && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum produto encontrado.
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
