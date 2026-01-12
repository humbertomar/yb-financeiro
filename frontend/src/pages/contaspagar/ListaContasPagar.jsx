import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contaPagarService } from '../../services/contaPagarService';
import { ActionButtons, ViewButton, EditButton, DeleteButton } from '../../components/ActionButtons';

export default function ListaContasPagar() {
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        categoria: '',
        fornecedor: '',
        data_inicio: '',
        data_fim: ''
    });

    useEffect(() => {
        carregarContas();
    }, []);

    async function carregarContas() {
        try {
            setLoading(true);
            const data = await contaPagarService.listar(filtros);
            setContas(data);
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            alert('Erro ao carregar contas a pagar');
        } finally {
            setLoading(false);
        }
    }

    async function excluirConta(id) {
        if (!confirm('Deseja realmente excluir esta conta?')) return;

        try {
            await contaPagarService.excluir(id);
            alert('Conta excluída com sucesso!');
            carregarContas();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert(error.response?.data?.error || 'Erro ao excluir conta');
        }
    }

    function handleFiltroChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    // Calcular totalizadores
    const totalGeral = contas.reduce((sum, c) => sum + parseFloat(c.valor_total || 0), 0);
    const totalPago = contas.reduce((sum, c) => {
        const pago = c.parcelas?.filter(p => p.data_pagamento).reduce((s, p) => s + parseFloat(p.valor_pago || 0), 0) || 0;
        return sum + pago;
    }, 0);
    const totalPendente = totalGeral - totalPago;

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    }

    function formatarData(data) {
        if (!data) return '-';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Contas a Pagar</h1>
                <Link
                    to="/contas-pagar/nova"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Nova Conta
                </Link>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Total Geral</div>
                    <div className="text-2xl font-bold text-blue-700">{formatarValor(totalGeral)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">Total Pago</div>
                    <div className="text-2xl font-bold text-green-700">{formatarValor(totalPago)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-orange-600 font-medium mb-1">Total Pendente</div>
                    <div className="text-2xl font-bold text-orange-700">{formatarValor(totalPendente)}</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="categoria"
                        placeholder="Categoria"
                        value={filtros.categoria}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="fornecedor"
                        placeholder="Fornecedor"
                        value={filtros.fornecedor}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="date"
                        name="data_inicio"
                        value={filtros.data_inicio}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="date"
                        name="data_fim"
                        value={filtros.data_fim}
                        onChange={handleFiltroChange}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={carregarContas}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Buscar
                </button>
            </div>

            {/* Lista de Contas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Carregando...</div>
                ) : contas.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Nenhuma conta encontrada</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Parcelas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Parcela</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Parcela</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contas.map((conta) => {
                                const parcelasPagas = conta.parcelas?.filter(p => p.data_pagamento).length || 0;
                                const totalParcelas = conta.parcelas?.length || 0;

                                // Encontrar próxima parcela não paga
                                const proximaParcela = conta.parcelas?.find(p => !p.data_pagamento);
                                const valorParcela = conta.parcelas?.[0]?.valor_parcela || 0;

                                return (
                                    <tr key={conta.idContaPagar} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{conta.descricao}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{conta.fornecedor || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{conta.categoria || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-900">
                                            {parcelasPagas}/{totalParcelas}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {proximaParcela ? (
                                                <div>
                                                    <div className="font-medium">{formatarData(proximaParcela.data_vencimento)}</div>
                                                    <div className="text-xs text-gray-500">Parcela {proximaParcela.numero_parcela}</div>
                                                </div>
                                            ) : (
                                                <span className="text-green-600">Todas pagas</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                            {formatarValor(valorParcela)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                            {formatarValor(conta.valor_total)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <ActionButtons>
                                                <ViewButton to={`/contas-pagar/${conta.idContaPagar}`} />
                                                <EditButton to={`/contas-pagar/${conta.idContaPagar}/editar`} />
                                                <DeleteButton onClick={() => excluirConta(conta.idContaPagar)} />
                                            </ActionButtons>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
