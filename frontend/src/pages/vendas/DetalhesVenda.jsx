import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import ComprovanteVenda from '../../components/ComprovanteVenda';
import { ActionButtons, EditButton, PrintButton, WhatsAppButton } from '../../components/ActionButtons';

export default function DetalhesVenda() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venda, setVenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarVenda();
    }, [id]);

    async function carregarVenda() {
        try {
            setLoading(true);
            const dados = await vendaService.obter(id);
            setVenda(dados);
        } catch (error) {
            console.error('Erro ao carregar venda:', error);
            setErro('Erro ao carregar detalhes da venda.');
        } finally {
            setLoading(false);
        }
    }

    function formatarData(dataHora) {
        return new Date(dataHora).toLocaleString('pt-BR');
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    function handlePrint() {
        window.print();
    }

    function handleWhatsApp() {
        const telefone = venda.cliente?.whatsapp?.replace(/\D/g, '');

        if (!telefone) {
            alert('Cliente não possui WhatsApp cadastrado');
            return;
        }

        const mensagem = gerarMensagemComprovante();
        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, '_blank');
    }

    function gerarMensagemComprovante() {
        let msg = `*YB IMPORTA - COMPROVANTE DE VENDA*\n`;
        msg += `========================================\n\n`;
        msg += `*Venda:* #${venda.idVenda}\n`;
        msg += `*Data:* ${formatarData(venda.data_hora)}\n`;
        msg += `*Cliente:* ${venda.cliente?.nome}\n`;
        msg += `\n========================================\n\n`;
        msg += `*ITENS DA COMPRA:*\n\n`;

        let subtotal = 0;
        venda.itens?.forEach((item, index) => {
            const nomeCompleto = item.variacao?.nome_variacao
                ? `${item.produto?.nome} (${item.variacao.nome_variacao})`
                : item.produto?.nome;
            const valorItem = parseFloat(item.valor_total) || 0;
            subtotal += valorItem;
            msg += `${index + 1}. *${nomeCompleto}*\n`;
            msg += `   Qtd: ${item.quantidade} x R$ ${(parseFloat(item.valor_unitario) || 0).toFixed(2)}\n`;
            msg += `   Subtotal: R$ ${valorItem.toFixed(2)}\n\n`;
        });

        msg += `${'='.repeat(40)}\n\n`;
        const desconto = parseFloat(venda.desconto) || 0;
        const valorFinal = parseFloat(venda.valor_total) || 0;

        if (desconto > 0) {
            msg += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
            msg += `Desconto: -R$ ${desconto.toFixed(2)}\n`;
        }
        msg += `*TOTAL: R$ ${valorFinal.toFixed(2)}*\n\n`;

        if (venda.formaPagamento?.forma_pagamento) {
            msg += `*Pagamento:* ${venda.formaPagamento.forma_pagamento}\n\n`;
        }

        msg += `========================================\n\n`;
        msg += `Obrigado pela preferencia!\n`;
        msg += `YB Importa - Produtos de Qualidade`;

        return msg;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    if (erro || !venda) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded">
                {erro || 'Venda não encontrada'}
            </div>
        );
    }

    return (
        <>
            {/* Comprovante para impressão (oculto na tela) */}
            <ComprovanteVenda venda={venda} />

            <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto no-print">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Detalhes da Venda #{venda.idVenda}</h2>
                    <div className="flex items-center gap-2">
                        <ActionButtons>
                            <PrintButton onClick={handlePrint} />
                            <WhatsAppButton onClick={handleWhatsApp} />
                            <EditButton to={`/vendas/${id}/editar`} />
                        </ActionButtons>
                        <button
                            onClick={() => navigate('/vendas')}
                            className="ml-2 text-gray-600 hover:text-gray-900 px-3 py-2"
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>

                {/* Informações Gerais */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Informações da Venda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-600">Data/Hora:</span>
                            <p className="font-medium">{formatarData(venda.data_hora)}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Cliente:</span>
                            <p className="font-medium">{venda.cliente?.nome || '-'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Forma de Pagamento:</span>
                            <p className="font-medium">{venda.forma_pagamento?.nome || '-'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <p className="font-medium">
                                {venda.ativo === 2 ? (
                                    <span className="text-red-600">Cancelada</span>
                                ) : (
                                    <span className="text-green-600">Ativa</span>
                                )}
                            </p>
                        </div>
                    </div>
                    {venda.observacoes && (
                        <div className="mt-4">
                            <span className="text-sm text-gray-600">Observações:</span>
                            <p className="mt-1">{venda.observacoes}</p>
                        </div>
                    )}
                </div>

                {/* Itens da Venda */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                        Itens da Venda {venda.itens && `(${venda.itens.length})`}
                    </h3>

                    {!venda.itens || venda.itens.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum item encontrado nesta venda.
                        </div>
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
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {venda.itens.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {item.produto?.nome || `Produto ID ${item.idProduto}`}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {item.variacao?.nome || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">{item.quantidade}</td>
                                            <td className="px-4 py-3 text-sm text-right">{formatarValor(item.valor_unitario)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium">
                                                {formatarValor(item.valor_total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Histórico de Alterações */}
                {venda.historico && venda.historico.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">
                            📋 Histórico de Alterações ({venda.historico.length})
                        </h3>
                        <div className="space-y-3">
                            {venda.historico.map((item, index) => (
                                <div key={item.id || index} className="bg-white p-3 rounded border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.descricao}</p>
                                            <div className="mt-1 text-xs text-gray-500">
                                                <span>Por: {item.usuario?.nome || 'Sistema'}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatarData(item.data_hora)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Totais */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                                {formatarValor((venda.valor_total || 0) + (venda.desconto || 0))}
                            </span>
                        </div>
                        {venda.desconto > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Desconto:</span>
                                <span className="font-medium text-red-600">- {formatarValor(venda.desconto)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>TOTAL:</span>
                            <span className="text-green-600">{formatarValor(venda.valor_total || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos globais para impressão */}
            <style jsx global>{`
            @media print {
                .no-print {
                    display: none !important;
                }
                
                .print-only {
                    display: block !important;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                @page {
                    margin: 1cm;
                    size: A4;
                }
            }
        `}</style>
        </>
    );
}
