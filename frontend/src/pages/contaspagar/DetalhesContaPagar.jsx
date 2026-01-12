import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contaPagarService } from '../../services/contaPagarService';

export default function DetalhesContaPagar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conta, setConta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalPagar, setModalPagar] = useState(null);
    const [dadosPagamento, setDadosPagamento] = useState({
        data_pagamento: new Date().toISOString().split('T')[0],
        valor_pago: '',
        observacoes: ''
    });

    useEffect(() => {
        carregarConta();
    }, [id]);

    async function carregarConta() {
        try {
            setLoading(true);
            const data = await contaPagarService.obter(id);
            setConta(data);
        } catch (error) {
            console.error('Erro ao carregar conta:', error);
            alert('Erro ao carregar detalhes da conta');
            navigate('/contas-pagar');
        } finally {
            setLoading(false);
        }
    }

    function abrirModalPagar(parcela) {
        setModalPagar(parcela);
        setDadosPagamento({
            data_pagamento: new Date().toISOString().split('T')[0],
            valor_pago: parcela.valor_parcela,
            observacoes: ''
        });
    }

    async function confirmarPagamento() {
        try {
            await contaPagarService.pagarParcela(modalPagar.idParcela, dadosPagamento);
            alert('Pagamento registrado com sucesso!');
            setModalPagar(null);
            carregarConta();
        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            alert('Erro ao registrar pagamento');
        }
    }

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

    function getStatusColor(parcela) {
        if (parcela.data_pagamento) return 'bg-green-100 text-green-800';
        if (parcela.data_vencimento < new Date().toISOString().split('T')[0]) return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    }

    function getStatusText(parcela) {
        if (parcela.data_pagamento) return 'Pago';
        if (parcela.data_vencimento < new Date().toISOString().split('T')[0]) return 'Atrasado';
        return 'Pendente';
    }

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Carregando...</div>;
    }

    if (!conta) {
        return <div className="container mx-auto px-4 py-8">Conta não encontrada</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Detalhes da Conta</h1>
                <Link
                    to="/contas-pagar"
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Voltar
                </Link>
            </div>

            {/* Informações da Conta */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{conta.descricao}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Fornecedor:</span>
                        <p className="font-medium">{conta.fornecedor || '-'}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Categoria:</span>
                        <p className="font-medium">{conta.categoria || '-'}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Valor Total:</span>
                        <p className="font-medium text-lg text-blue-600">{formatarValor(conta.valor_total)}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Parcelado:</span>
                        <p className="font-medium">{conta.parcelado ? `Sim (${conta.numero_parcelas}x)` : 'Não'}</p>
                    </div>
                    {conta.observacoes && (
                        <div className="md:col-span-2">
                            <span className="text-sm text-gray-600">Observações:</span>
                            <p className="font-medium">{conta.observacoes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Parcelas */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Parcelas</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcela</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Pagamento</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Pago</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {conta.parcelas?.map((parcela) => (
                                <tr key={parcela.idParcela} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{parcela.numero_parcela}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatarData(parcela.data_vencimento)}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatarValor(parcela.valor_parcela)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatarData(parcela.data_pagamento)}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatarValor(parcela.valor_pago)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(parcela)}`}>
                                            {getStatusText(parcela)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {!parcela.data_pagamento && (
                                            <button
                                                onClick={() => abrirModalPagar(parcela)}
                                                className="text-green-600 hover:text-green-800 font-medium"
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Pagamento */}
            {modalPagar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Registrar Pagamento - Parcela {modalPagar.numero_parcela}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data do Pagamento
                                </label>
                                <input
                                    type="date"
                                    value={dadosPagamento.data_pagamento}
                                    onChange={(e) => setDadosPagamento(prev => ({ ...prev, data_pagamento: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor Pago
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={dadosPagamento.valor_pago}
                                    onChange={(e) => setDadosPagamento(prev => ({ ...prev, valor_pago: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Observações
                                </label>
                                <textarea
                                    value={dadosPagamento.observacoes}
                                    onChange={(e) => setDadosPagamento(prev => ({ ...prev, observacoes: e.target.value }))}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={confirmarPagamento}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Confirmar Pagamento
                            </button>
                            <button
                                onClick={() => setModalPagar(null)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
