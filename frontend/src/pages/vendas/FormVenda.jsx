import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import { clienteService } from '../../services/clienteService';
import { produtoService } from '../../services/produtoService';
import { formaPagamentoService } from '../../services/formaPagamentoService';
import { categoriaService } from '../../services/categoriaService';
import ProdutoCombobox from '../../components/ProdutoAutocomplete';
import ClienteAutocomplete from '../../components/ClienteAutocomplete';

export default function FormVenda() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // Dados do formulário
    const [idCliente, setIdCliente] = useState('');
    const [idFormapagamento, setIdFormapagamento] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [desconto, setDesconto] = useState(0);

    // Carrinho
    const [carrinho, setCarrinho] = useState([]);

    // Listas para selects
    const [clientes, setClientes] = useState([]);
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
    }, []);

    async function carregarDadosIniciais() {
        try {
            setLoading(true);

            const [clientesData, produtosData, formasData, categoriasData] = await Promise.all([
                clienteService.listar(1, '', true), // all=true para pegar todos
                produtoService.listar(1, '', '', true), // all=true para pegar todos
                formaPagamentoService.listar(),
                categoriaService.listar()
            ]);

            setClientes(Array.isArray(clientesData) ? clientesData : []);
            setProdutos(produtosData || []);
            setFormasPagamento(formasData || []);
            setCategorias(categoriasData || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Erro ao carregar dados do formulário.');
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

    function handleSelecionarProduto(produto) {
        setProdutoSelecionado(produto);
        setVariacaoSelecionada(null);

        // Se o produto não tem variações, usar o preço do próprio produto
        if (!produto?.variacoes || produto.variacoes.length === 0) {
            setValorUnitario(produto?.valor3 || 0);
        } else {
            setValorUnitario(0);
        }
    }

    function adicionarAoCarrinho() {
        if (!produtoSelecionado) {
            alert('Selecione um produto');
            return;
        }

        // Verificar se o produto tem variações
        const temVariacoes = produtoSelecionado?.variacoes && produtoSelecionado.variacoes.length > 0;

        // Se tem variações, exigir seleção de variação
        if (temVariacoes && !variacaoSelecionada) {
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
            idVariacao: variacaoSelecionada?.id || null,
            nomeVariacao: variacaoSelecionada?.nome || 'Sem variação',
            quantidade: parseInt(quantidade),
            valor_unitario: parseFloat(valorUnitario),
            desconto_item: 0
        };

        setCarrinho([...carrinho, item]);

        // Limpar seleção
        setCategoriaSelecionada('');
        setProdutoSelecionado(null);
        setVariacaoSelecionada(null);
        setQuantidade(1);
        setValorUnitario(0);
    }

    function removerDoCarrinho(id) {
        setCarrinho(carrinho.filter(item => item.id !== id));
    }

    function calcularSubtotal() {
        return carrinho.reduce((total, item) => {
            return total + (item.quantidade * item.valor_unitario - item.desconto_item);
        }, 0);
    }

    function calcularTotal() {
        return calcularSubtotal() - desconto;
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
                idCliente: parseInt(idCliente),
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

            await vendaService.criar(dados);
            navigate('/vendas');
        } catch (error) {
            console.error(error);
            setErro('Erro ao salvar venda. Verifique os campos.');
        } finally {
            setLoading(false);
        }
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    if (loading && clientes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Venda</h2>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados da Venda */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Dados da Venda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                            <ClienteAutocomplete
                                clientes={clientes}
                                onSelect={(cliente) => setIdCliente(cliente?.idCliente || '')}
                            />
                        </div>

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
                                    <option key={f.idFormapagamento} value={f.idFormapagamento}>{f.forma_pagamento}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Adicionar Produtos */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Adicionar Produto ao Carrinho</h3>

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
                                onSelect={handleSelecionarProduto}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Variação</label>
                            <select
                                value={variacaoSelecionada?.id || ''}
                                onChange={handleSelecionarVariacao}
                                disabled={!produtoSelecionado || (produtoSelecionado?.variacoes?.length === 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {!produtoSelecionado
                                        ? 'Selecione...'
                                        : produtoSelecionado?.variacoes?.length === 0
                                            ? 'Sem variações'
                                            : 'Selecione...'}
                                </option>
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
                            {!variacaoSelecionada && produtoSelecionado && produtoSelecionado.variacoes?.length === 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Valor Mín.:</span> {formatarValor(produtoSelecionado.valor1 || 0)}
                                    <span className="mx-3 font-medium">Valor Med.:</span> {formatarValor(produtoSelecionado.valor2 || 0)}
                                    <span className="mx-3 font-medium">Valor Máx.:</span> {formatarValor(produtoSelecionado.valor3 || 0)}
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

                {/* Carrinho */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Carrinho ({carrinho.length} itens)</h3>

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
                                            <td className="px-4 py-3 text-sm text-center">{item.quantidade}</td>
                                            <td className="px-4 py-3 text-sm text-right">{formatarValor(item.valor_unitario)}</td>
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
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Desconto:</span>
                                    <input
                                        type="number"
                                        value={desconto}
                                        onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
                                    />
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>TOTAL:</span>
                                    <span className="text-green-600">{formatarValor(calcularTotal())}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Observações */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Observações sobre a venda..."
                    />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/vendas')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || carrinho.length === 0}
                        className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-6 py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition disabled:bg-gray-400 shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Salvando...' : 'Finalizar Venda'}
                    </button>
                </div>
            </form>
        </div>
    );
}
