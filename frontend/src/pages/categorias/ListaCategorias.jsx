import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoriaService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';
import ResponsiveTable from '../../components/ResponsiveTable';

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
                carregarCategorias();
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

    const columns = [
        {
            key: 'idCategoria',
            label: 'ID',
            render: (categoria) => `#${categoria.idCategoria}`,
            className: 'text-gray-500 font-medium'
        },
        {
            key: 'nome',
            label: 'Nome',
            render: (categoria) => categoria.nome,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'texto',
            label: 'Descrição',
            render: (categoria) => categoria.texto || '-',
            className: 'text-gray-500'
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Categorias</h2>
                <Link
                    to="/categorias/nova"
                    className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-4 py-3 sm:py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition text-center font-medium shadow-md hover:shadow-lg"
                >
                    + Nova Categoria
                </Link>
            </div>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <ResponsiveTable
                columns={columns}
                data={categorias}
                keyExtractor={(categoria) => categoria.idCategoria}
                actions={(categoria) => (
                    <ActionButtons>
                        <EditButton to={`/categorias/${categoria.idCategoria}/editar`} />
                        <DeleteButton onClick={() => handleDelete(categoria.idCategoria)} />
                    </ActionButtons>
                )}
                emptyMessage="Nenhuma categoria encontrada."
            />
        </div>
    );
}
