import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { vendaService } from '../../services/vendaService';
import { clienteService } from '../../services/clienteService';
import { formaPagamentoService } from '../../services/formaPagamentoService';

export default function RelatorioVendas() {
    const [filtros, setFiltros] = useState({
        data_inicio: '',
        data_fim: '',
        idCliente: '',
        idFormapagamento: ''
    });

    const [todasVendas, setTodasVendas] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const vendasPorPagina = 10;

    const [clientes, setClientes] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    async function carregarDadosIniciais() {
        try {
            const [clientesData, formasData] = await Promise.all([
                clienteService.listar(1, ''),
                formaPagamentoService.listar()
            ]);

            setClientes(clientesData.data || []);
            setFormasPagamento(formasData || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async function buscarRelatorio() {
        try {
            setLoading(true);
            setErro('');
            setPaginaAtual(1);

            const data = await vendaService.relatorio(filtros);
            setTodasVendas(data.vendas);
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
            setErro('Erro ao gerar relatório.');
        } finally {
            setLoading(false);
        }
    }

    function handleFiltroChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function formatarData(dataHora) {
        if (!dataHora) return '-';
        try {
            const match = dataHora.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                const [, ano, mes, dia] = match;
                return `${dia}/${mes}/${ano}`;
            }
            return '-';
        } catch (error) {
            return '-';
        }
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    }

    function exportarExcel() {
        // Preparar dados para exportação
        const dadosExport = todasVendas.map(venda => {
            const produtos = venda.itens?.map(item => {
                const nomeProduto = item.produto?.nome || 'Produto';
                const nomeVariacao = item.variacao?.nome ? ` - ${item.variacao.nome}` : '';
                return `${nomeProduto}${nomeVariacao} (${item.quantidade}x)`;
            }).join('; ') || '-';

            return {
                'Data': formatarData(venda.data_hora),
                'Cliente': venda.cliente?.nome || '-',
                'Produtos': produtos,
                'Forma de Pagamento': venda.forma_pagamento?.forma_pagamento || venda.formaPagamento?.forma_pagamento || '-',
                'Valor Total': parseFloat(venda.valor_total || 0)
            };
        });

        // Criar planilha
        const ws = XLSX.utils.json_to_sheet(dadosExport);

        // Ajustar largura das colunas
        ws['!cols'] = [
            { wch: 12 }, // Data
            { wch: 30 }, // Cliente
            { wch: 50 }, // Produtos
            { wch: 20 }, // Forma Pagamento
            { wch: 15 }  // Valor Total
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vendas');

        // Gerar nome do arquivo com data/hora
        const dataHora = new Date().toLocaleString('pt-BR').replace(/[/:]/g, '-').replace(', ', '_');
        const nomeArquivo = `relatorio_vendas_${dataHora}.xlsx`;

        // Download
        XLSX.writeFile(wb, nomeArquivo);
    }

    // Paginação
    const indexUltimaVenda = paginaAtual * vendasPorPagina;
    const indexPrimeiraVenda = indexUltimaVenda - vendasPorPagina;
    const vendasPaginaAtual = todasVendas.slice(indexPrimeiraVenda, indexUltimaVenda);
    const totalPaginas = Math.ceil(todasVendas.length / vendasPorPagina);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório de Vendas</h1>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                        <input
                            type="date"
                            name="data_inicio"
                            value={filtros.data_inicio}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                        <input
                            type="date"
                            name="data_fim"
                            value={filtros.data_fim}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <select
                            name="idCliente"
                            value={filtros.idCliente}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos</option>
                            {clientes.map(cliente => (
                                <option key={cliente.idCliente} value={cliente.idCliente}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                        <select
                            name="idFormapagamento"
                            value={filtros.idFormapagamento}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todas</option>
                            {formasPagamento.map(forma => (
                                <option key={forma.idFormapagamento} value={forma.idFormapagamento}>
                                    {forma.forma_pagamento}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={buscarRelatorio}
                        disabled={loading || (!filtros.data_inicio && !filtros.data_fim && !filtros.idCliente && !filtros.idFormapagamento)}
                        className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-6 py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>

                    {todasVendas.length > 0 && (
                        <button
                            onClick={exportarExcel}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Exportar Excel
                        </button>
                    )}
                </div>

                {!filtros.data_inicio && !filtros.data_fim && !filtros.idCliente && !filtros.idFormapagamento && (
                    <p className="text-sm text-gray-500 mt-2">Selecione pelo menos um filtro para buscar</p>
                )}
            </div>

            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {erro}
                </div>
            )}

            {/* Tabela de Vendas */}
            {todasVendas.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="text-sm text-blue-600 font-medium mb-1">Vendas Encontradas</div>
                            <div className="text-2xl font-bold text-blue-700">{todasVendas.length}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="text-sm text-green-600 font-medium mb-1">Valor Total</div>
                            <div className="text-2xl font-bold text-green-700">
                                {formatarValor(todasVendas.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forma Pgto</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendasPaginaAtual.map((venda) => (
                                    <tr key={venda.idVenda} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatarData(venda.data_hora)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {venda.cliente?.nome || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {venda.itens?.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.produto?.nome || 'Produto'}
                                                    {item.variacao?.nome && ` - ${item.variacao.nome}`}
                                                    {` (${item.quantidade}x)`}
                                                </div>
                                            )) || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {venda.forma_pagamento?.forma_pagamento || venda.formaPagamento?.forma_pagamento || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-emerald-600">
                                            {formatarValor(venda.valor_total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    {totalPaginas > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Mostrando {indexPrimeiraVenda + 1} a {Math.min(indexUltimaVenda, todasVendas.length)} de {todasVendas.length} vendas
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                                    disabled={paginaAtual === 1}
                                    className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="px-4 py-2">
                                    Página {paginaAtual} de {totalPaginas}
                                </span>
                                <button
                                    onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                                    disabled={paginaAtual === totalPaginas}
                                    className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loading && todasVendas.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                    <p>Nenhuma venda encontrada. Utilize os filtros acima e clique em "Buscar".</p>
                </div>
            )}
        </div>
    );
}
