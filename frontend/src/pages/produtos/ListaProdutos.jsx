import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { produtoService } from '../../services/produtoService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';
import ResponsiveTable from '../../components/ResponsiveTable';

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

    const columns = [
        {
            key: 'idProduto',
            label: 'ID',
            render: (produto) => `#${produto.idProduto}`,
            className: 'text-gray-500 font-medium'
        },
        {
            key: 'nome',
            label: 'Nome',
            render: (produto) => produto.nome,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'categoria',
            label: 'Categoria',
            render: (produto) => produto.categoria?.nome || '-',
            className: 'text-gray-500'
        },
        {
            key: 'variacoes',
            label: 'Variações',
            render: (produto) => (
                produto.variacoes && produto.variacoes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {produto.variacoes.map(v => (
                            <span key={v.id} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border border-gray-300">
                                {v.nome_variacao}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400 italic">Sem variações</span>
                )
            )
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Produtos</h2>
                <Link
                    to="/produtos/novo"
                    className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-700 transition text-center font-medium"
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
                data={produtos}
                keyExtractor={(produto) => produto.idProduto}
                actions={(produto) => (
                    <ActionButtons>
                        <EditButton to={`/produtos/${produto.idProduto}/editar`} />
                        <DeleteButton onClick={() => handleDelete(produto.idProduto)} />
                    </ActionButtons>
                )}
                emptyMessage="Nenhum produto encontrado."
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
