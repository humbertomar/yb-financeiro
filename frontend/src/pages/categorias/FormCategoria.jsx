import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriaService } from '../../services/categoriaService';

export default function FormCategoria() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        nome: '',
        texto: ''
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (isEdit) {
            loadCategoria();
        }
    }, [id]);

    async function loadCategoria() {
        try {
            setLoading(true);
            // Reusando o listar por enquanto pois não criamos o endpoint show individual ainda.
            // O ideal seria: const dados = await categoriaService.obter(id);
            // Vamos ajustar depois. Por enquanto, pegamos da lista.
            const todas = await categoriaService.listar();
            const categoria = todas.find(c => c.idCategoria == id);

            if (categoria) {
                setFormData({
                    nome: categoria.nome,
                    texto: categoria.texto || ''
                });
            } else {
                setErro('Categoria não encontrada.');
            }
        } catch (error) {
            setErro('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            if (isEdit) {
                await categoriaService.atualizar(id, formData);
            } else {
                await categoriaService.criar(formData);
            }
            navigate('/categorias');
        } catch (error) {
            setErro('Erro ao salvar categoria. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Categoria
                    </label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição (Texto)
                    </label>
                    <textarea
                        value={formData.texto}
                        onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/categorias')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-6 py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition disabled:bg-gray-400 shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
