import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { produtoService } from '../../services/produtoService';
import { categoriaService } from '../../services/categoriaService';

export default function FormProduto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        idCategoria: '',
        texto: '',
        ativo: 1
    });

    const [variacoes, setVariacoes] = useState([
        { nome: '', valor1: '', valor2: '', valor3: '', quantidade: '' }
    ]);

    useEffect(() => {
        console.log('🔄 useEffect disparado. ID:', id, 'isEdit:', isEdit);
        carregarCategorias();
        if (isEdit) {
            console.log('📝 Modo edição detectado, carregando produto...');
            loadProduto();
        }
    }, [id]);

    async function carregarCategorias() {
        try {
            const dados = await categoriaService.listar();
            setCategorias(dados);
        } catch (e) {
            console.error('Erro ao carregar categorias');
        }
    }

    async function loadProduto() {
        console.log('🚀 loadProduto iniciado para ID:', id);
        try {
            setLoading(true);
            const produto = await produtoService.obter(id);

            console.log('✅ Produto recebido:', produto);
            console.log('📦 Variações:', produto.variacoes);

            setFormData({
                nome: produto.nome,
                idCategoria: produto.idCategoria,
                texto: produto.texto || '',
                ativo: produto.ativo
            });

            if (produto.variacoes && produto.variacoes.length > 0) {
                console.log('✅ Setando', produto.variacoes.length, 'variações');
                setVariacoes(produto.variacoes.map(v => ({
                    id: v.id,
                    nome: v.nome_variacao,
                    valor1: v.valor1 || '',
                    valor2: v.valor2 || '',
                    valor3: v.valor3 || '',
                    quantidade: v.quantidade || ''
                })));
            } else {
                console.log('⚠️ Produto sem variações, usando linha vazia');
                setVariacoes([{ nome: '', valor1: '', valor2: '', valor3: '', quantidade: '' }]);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produto:', error);
            setErro('Erro ao carregar dados do produto.');
        } finally {
            setLoading(false);
        }
    }

    function addVariacao() {
        setVariacoes([
            ...variacoes,
            { nome: '', valor1: '', valor2: '', valor3: '', quantidade: '' }
        ]);
    }

    function removeVariacao(index) {
        if (variacoes.length > 1) {
            const novas = [...variacoes];
            novas.splice(index, 1);
            setVariacoes(novas);
        }
    }

    function updateVariacao(index, campo, valor) {
        const novas = [...variacoes];
        novas[index][campo] = valor;
        setVariacoes(novas);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        if (variacoes.length === 0 || !variacoes.some(v => v.nome && v.valor3)) {
            setErro('Adicione pelo menos uma variação com nome e preço de venda.');
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            variacoes: variacoes.filter(v => v.nome)
        };

        try {
            if (isEdit) {
                await produtoService.atualizar(id, payload);
            } else {
                await produtoService.criar(payload);
            }
            navigate('/produtos');
        } catch (error) {
            console.error(error);
            setErro('Erro ao salvar produto. Verifique os campos.');
        } finally {
            setLoading(false);
        }
    }

    if (loading && isEdit && !formData.nome) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEdit ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados Gerais */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Dados Gerais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Perfume Armani"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria *
                            </label>
                            <select
                                value={formData.idCategoria}
                                onChange={(e) => setFormData({ ...formData, idCategoria: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecione...</option>
                                {categorias.map(c => (
                                    <option key={c.idCategoria} value={c.idCategoria}>{c.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.ativo}
                                onChange={(e) => setFormData({ ...formData, ativo: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="1">Ativo</option>
                                <option value="0">Inativo</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={formData.texto}
                                onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Descrição do produto"
                            />
                        </div>
                    </div>
                </div>

                {/* Variações */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Variações do Produto *</h3>
                        <button
                            type="button"
                            onClick={addVariacao}
                            className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                        >
                            + Adicionar Variação
                        </button>
                    </div>

                    <div className="space-y-3">
                        {variacoes.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded border grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-12 md:col-span-3">
                                    <label className="block text-xs text-gray-600 mb-1">Variação (Ex: 50ml) *</label>
                                    <input
                                        type="text"
                                        value={item.nome}
                                        onChange={(e) => updateVariacao(index, 'nome', e.target.value)}
                                        required
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                        placeholder="50ml, P, M, G..."
                                    />
                                </div>

                                <div className="col-span-6 md:col-span-2">
                                    <label className="block text-xs text-gray-600 mb-1">Valor Mínimo (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.valor1}
                                        onChange={(e) => updateVariacao(index, 'valor1', e.target.value)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="col-span-6 md:col-span-2">
                                    <label className="block text-xs text-gray-600 mb-1">Valor Médio (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.valor2}
                                        onChange={(e) => updateVariacao(index, 'valor2', e.target.value)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="col-span-6 md:col-span-2">
                                    <label className="block text-xs text-gray-600 mb-1">Valor Máximo (R$) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.valor3}
                                        onChange={(e) => updateVariacao(index, 'valor3', e.target.value)}
                                        required
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="col-span-5 md:col-span-2">
                                    <label className="block text-xs text-gray-600 mb-1">Estoque *</label>
                                    <input
                                        type="number"
                                        value={item.quantidade}
                                        onChange={(e) => updateVariacao(index, 'quantidade', e.target.value)}
                                        required
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="col-span-1 flex items-center justify-center pb-1">
                                    {variacoes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariacao(index)}
                                            className="text-red-500 hover:text-red-700 text-lg"
                                            title="Remover"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/produtos')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Salvando...' : 'Salvar Produto'}
                    </button>
                </div>
            </form>
        </div>
    );
}
