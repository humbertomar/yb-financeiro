import { useState, useEffect } from 'react';
import { produtoService } from '../../services/produtoService';
import { categoriaService } from '../../services/categoriaService';
import * as XLSX from 'xlsx';

export default function RelatorioEstoque() {
    const [itens, setItens] = useState([]);
    const [itensPaginados, setItensPaginados] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [totalizadores, setTotalizadores] = useState({
        total_produtos: 0,
        total_itens: 0,
        valor_total: 0
    });
    const [categorias, setCategorias] = useState([]);
    const [filtros, setFiltros] = useState({
        idCategoria: '',
        nome: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarCategorias();
        buscarRelatorio();
    }, []);

    useEffect(() => {
        // Atualizar itens paginados quando itens ou página mudar
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        setItensPaginados(itens.slice(inicio, fim));
    }, [itens, paginaAtual]);

    async function carregarCategorias() {
        try {
            const data = await categoriaService.listar();
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async function buscarRelatorio() {
        try {
            setLoading(true);
            setPaginaAtual(1);
            const data = await produtoService.relatorioEstoque(filtros);
            setItens(data.itens || []);
            setTotalizadores(data.totalizadores || {});
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
            alert('Erro ao carregar relatório de estoque');
        } finally {
            setLoading(false);
        }
    }

    function handleFiltroChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    function exportarExcel() {
        const dadosExport = itens.map(item => ({
            'Produto': item.produto,
            'Variação': item.variacao,
            'Categoria': item.categoria,
            'Quantidade': item.quantidade,
            'Valor Mínimo': item.valor_minimo,
            'Valor Médio': item.valor_medio,
            'Valor Máximo': item.valor_maximo,
            'Valor Estoque': item.valor_estoque
        }));

        const ws = XLSX.utils.json_to_sheet(dadosExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Estoque');
        XLSX.writeFile(wb, `estoque_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    }

    const totalPaginas = Math.ceil(itens.length / itensPorPagina);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Relatório de Estoque Atual</h1>
                <button
                    onClick={exportarExcel}
                    disabled={itens.length === 0}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    📥 Exportar Excel
                </button>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Total de Produtos</div>
                    <div className="text-2xl font-bold text-blue-700">{totalizadores.total_produtos}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium mb-1">Total de Itens</div>
                    <div className="text-2xl font-bold text-purple-700">{totalizadores.total_itens}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">Valor Total em Estoque</div>
                    <div className="text-2xl font-bold text-green-700">{formatarValor(totalizadores.valor_total)}</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        name="idCategoria"
                        value={filtros.idCategoria}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todas as categorias</option>
                        {categorias.map(cat => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do produto"
                        value={filtros.nome}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={buscarRelatorio}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Carregando...</div>
                ) : itens.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Nenhum produto encontrado</div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variação</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Mínimo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Médio</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Máximo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Estoque</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {itensPaginados.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.produto}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.variacao}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.categoria}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{item.quantidade}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-900">{formatarValor(item.valor_minimo)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-blue-600">{formatarValor(item.valor_medio)}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-900">{formatarValor(item.valor_maximo)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-green-700">{formatarValor(item.valor_estoque)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginação */}
                        {totalPaginas > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando {((paginaAtual - 1) * itensPorPagina) + 1} a {Math.min(paginaAtual * itensPorPagina, itens.length)} de {itens.length} itens
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                                        disabled={paginaAtual === 1}
                                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-3 py-1">
                                        Página {paginaAtual} de {totalPaginas}
                                    </span>
                                    <button
                                        onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                                        disabled={paginaAtual === totalPaginas}
                                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
