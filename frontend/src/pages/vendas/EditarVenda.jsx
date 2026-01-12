import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import { produtoService } from '../../services/produtoService';
import { formaPagamentoService } from '../../services/formaPagamentoService';
import { categoriaService } from '../../services/categoriaService';
import ProdutoCombobox from '../../components/ProdutoAutocomplete';

export default function EditarVenda() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venda, setVenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    // Dados editáveis
    const [idFormapagamento, setIdFormapagamento] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [desconto, setDesconto] = useState(0);
    const [carrinho, setCarrinho] = useState([]);

    // Listas para selects
    const [produtos, setProdutos] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Filtro de categoria
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

    // Produto sendo adicionado
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [valorUnitario, setValorUnitario] = useState(0);

    useEffect(() => {
        carregarDadosIniciais();
    }, [id]);

    async function carregarDadosIniciais() {
        try {
            setLoading(true);
            const [vendaData, produtosData, formasData, categoriasData] = await Promise.all([
                vendaService.obter(id),
                produtoService.listar(1, '', '', true), // all=true para pegar todos
                formaPagamentoService.listar(),
                categoriaService.listar()
            ]);

            setVenda(vendaData);
            setIdFormapagamento(vendaData.idFormapagamento || '');
            setObservacoes(vendaData.observacoes || '');
            setDesconto(vendaData.desconto || 0);

            // Carregar itens existentes no carrinho
            const itensCarrinho = vendaData.itens?.map((item, index) => ({
                id: Date.now() + index,
                idProduto: item.idProduto,
                nomeProduto: item.produto?.nome || 'Produto',
                idVariacao: item.idVariacao,
                nomeVariacao: item.variacao?.nome || '-',
                quantidade: item.quantidade,
                valor_unitario: parseFloat(item.valor_unitario),
                desconto_item: parseFloat(item.desconto_item || 0)
            })) || [];

            setCarrinho(itensCarrinho);
            setProdutos(produtosData || []); // Agora retorna array direto, não paginado
            setFormasPagamento(formasData || []);
            setCategorias(categoriasData || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Erro ao carregar dados da venda.');
        } finally {
            setLoading(false);
        }
    }

    function handleSelecionarVariacao(e) {
        const idVariacao = e.target.value;
        const variacao = produtoSelecionado?.variacoes?.find(v => v.id == idVariacao);
        setVariacaoSelecionada(variacao);
        setValorUnitario(variacao?.valor3 || 0);
    }

    function adicionarAoCarrinho() {
        if (!produtoSelecionado) {
            alert('Selecione um produto');
            return;
        }
        if (!variacaoSelecionada) {
            alert('Selecione uma variação');
            return;
        }
        if (quantidade <= 0) {
            alert('Quantidade deve ser maior que zero');
            return;
        }
        if (valorUnitario <= 0) {
            alert('Valor unitário deve ser maior que zero');
            return;
        }

        const item = {
            id: Date.now(),
            idProduto: produtoSelecionado.idProduto,
            nomeProduto: produtoSelecionado.nome,
            idVariacao: variacaoSelecionada.id,
            nomeVariacao: variacaoSelecionada.nome,
            quantidade: parseInt(quantidade),
            valor_unitario: parseFloat(valorUnitario),
            desconto_item: 0
        };

        setCarrinho([...carrinho, item]);

        // Limpar seleção
        setProdutoSelecionado(null);
        setVariacaoSelecionada(null);
        setQuantidade(1);
        setValorUnitario(0);
    }

    function removerDoCarrinho(id) {
        setCarrinho(carrinho.filter(item => item.id !== id));
    }

    function alterarQuantidade(id, novaQuantidade) {
        setCarrinho(carrinho.map(item =>
            item.id === id ? { ...item, quantidade: parseInt(novaQuantidade) || 1 } : item
        ));
    }

    function alterarValorUnitario(id, novoValor) {
        setCarrinho(carrinho.map(item =>
            item.id === id ? { ...item, valor_unitario: parseFloat(novoValor) || 0 } : item
        ));
    }

    function calcularSubtotal() {
        return carrinho.reduce((total, item) => {
            return total + (item.quantidade * item.valor_unitario - item.desconto_item);
        }, 0);
    }

    function calcularTotal() {
        return calcularSubtotal() - parseFloat(desconto || 0);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        if (carrinho.length === 0) {
            setErro('Adicione pelo menos um produto ao carrinho.');
            return;
        }

        setLoading(true);

        try {
            const dados = {
                idFormapagamento: parseInt(idFormapagamento),
                desconto: parseFloat(desconto),
                observacoes,
                itens: carrinho.map(item => ({
                    idProduto: item.idProduto,
                    idVariacao: item.idVariacao,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    desconto_item: item.desconto_item
                }))
            };

            await vendaService.atualizar(id, dados);
            navigate(`/vendas/${id}`);
        } catch (error) {
            console.error(error);
            setErro('Erro ao atualizar venda. Verifique os campos.');
        } finally {
            setLoading(false);
        }
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    if (loading && !venda) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    if (erro && !venda) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded">
                {erro}
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Editar Venda #{venda?.idVenda}</h2>
                <button
                    onClick={() => navigate(`/vendas/${id}`)}
                    className="text-gray-600 hover:text-gray-900"
                >
                    ← Voltar
                </button>
            </div>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Somente Leitura */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">🔒 Dados Bloqueados (Somente Leitura)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Cliente:</span>
                            <p className="font-medium">{venda?.cliente?.nome}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Data/Hora:</span>
                            <p className="font-medium">{new Date(venda?.data_hora).toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

                {/* Campos Editáveis */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">✏️ Campos Editáveis</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento *</label>
                            <select
                                value={idFormapagamento}
                                onChange={(e) => setIdFormapagamento(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecione...</option>
                                {formasPagamento.map(f => (
                                    <option key={f.idFormapagamento} value={f.idFormapagamento}>{f.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
                            <input
                                type="number"
                                value={desconto}
                                onChange={(e) => setDesconto(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Observações sobre a venda..."
                        />
                    </div>
                </div>

                {/* Adicionar Produtos */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">➕ Adicionar Produto ao Carrinho</h3>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Filtro de Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                                value={categoriaSelecionada}
                                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Todas</option>
                                {categorias.map(c => (
                                    <option key={c.idCategoria} value={c.idCategoria}>{c.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Combobox de Produto */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                            <ProdutoCombobox
                                produtos={produtos}
                                categoriaSelecionada={categoriaSelecionada}
                                onSelect={(produto) => {
                                    setProdutoSelecionado(produto);
                                    setVariacaoSelecionada(null);
                                    setValorUnitario(0);
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Variação</label>
                            <select
                                value={variacaoSelecionada?.id || ''}
                                onChange={handleSelecionarVariacao}
                                disabled={!produtoSelecionado}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Selecione...</option>
                                {produtoSelecionado?.variacoes?.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.nome} (Estoque: {v.quantidade})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
                            <input
                                type="number"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário</label>
                            <input
                                type="number"
                                value={valorUnitario}
                                onChange={(e) => setValorUnitario(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                            {variacaoSelecionada && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Valor Mín.:</span> {formatarValor(variacaoSelecionada.valor1 || 0)}
                                    <span className="mx-3 font-medium">Valor Med.:</span> {formatarValor(variacaoSelecionada.valor2 || 0)}
                                    <span className="mx-3 font-medium">Valor Máx.:</span> {formatarValor(variacaoSelecionada.valor3 || 0)}
                                </div>
                            )}
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={adicionarAoCarrinho}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                + Adicionar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carrinho Editável */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">🛒 Carrinho ({carrinho.length} itens)</h3>

                    {carrinho.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Carrinho vazio. Adicione produtos acima.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variação</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {carrinho.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.nomeProduto}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{item.nomeVariacao}</td>
                                            <td className="px-4 py-3 text-sm text-center">
                                                <input
                                                    type="number"
                                                    value={item.quantidade}
                                                    onChange={(e) => alterarQuantidade(item.id, e.target.value)}
                                                    min="1"
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <input
                                                    type="number"
                                                    value={item.valor_unitario}
                                                    onChange={(e) => alterarValorUnitario(item.id, e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-medium">
                                                {formatarValor(item.quantidade * item.valor_unitario)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removerDoCarrinho(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Remover
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totais */}
                            <div className="mt-4 border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatarValor(calcularSubtotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Desconto:</span>
                                    <span className="font-medium text-red-600">- {formatarValor(desconto)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>TOTAL:</span>
                                    <span className="text-green-600">{formatarValor(calcularTotal())}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate(`/vendas/${id}`)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || carrinho.length === 0}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
