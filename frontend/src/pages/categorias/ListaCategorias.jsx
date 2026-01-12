import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoriaService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';

export default function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        carregarCategorias();
    }, []);

    async function carregarCategorias() {
        try {
            setLoading(true);
            const dados = await categoriaService.listar();
            setCategorias(dados);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setErro('Erro ao carregar categorias. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            try {
                await categoriaService.remover(id);
                carregarCategorias(); // Recarrega a lista
            } catch (error) {
                alert('Erro ao excluir categoria.');
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando categorias...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
                <Link
                    to="/categorias/nova"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Nova Categoria
                </Link>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categorias.map((categoria) => (
                            <tr key={categoria.idCategoria} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{categoria.idCategoria}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {categoria.nome}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {categoria.texto || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionButtons>
                                        <EditButton to={`/categorias/${categoria.idCategoria}/editar`} />
                                        <DeleteButton onClick={() => handleDelete(categoria.idCategoria)} />
                                    </ActionButtons>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categorias.length === 0 && !erro && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhuma categoria encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
