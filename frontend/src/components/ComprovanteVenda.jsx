export default function ComprovanteVenda({ venda }) {
    if (!venda) return null;

    const formatarData = (dataHora) => {
        return new Date(dataHora).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    return (
        <div className="comprovante print-only hidden print:block max-w-3xl mx-auto bg-white p-8">
            {/* Cabeçalho da Empresa */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">YB IMPORTA</h1>
                <p className="text-sm text-gray-600">Comércio de Produtos Importados</p>
                <p className="text-sm text-gray-600">Telefone: (00) 0000-0000</p>
                <p className="text-sm text-gray-600">Email: contato@ybimporta.com.br</p>
            </div>

            {/* Título do Comprovante */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">COMPROVANTE DE VENDA</h2>
                <div className="flex justify-center gap-8 text-sm text-gray-600">
                    <p><strong>Nº:</strong> {venda.idVenda}</p>
                    <p><strong>Data:</strong> {formatarData(venda.data_hora)}</p>
                </div>
            </div>

            {/* Dados do Cliente */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-bold text-gray-700 mb-2">DADOS DO CLIENTE</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Nome:</strong> {venda.cliente?.nome || '-'}</p>
                    <p><strong>CPF:</strong> {venda.cliente?.cpf || '-'}</p>
                    <p><strong>WhatsApp:</strong> {venda.cliente?.whatsapp || '-'}</p>
                    <p><strong>Email:</strong> {venda.cliente?.email || '-'}</p>
                </div>
            </div>

            {/* Itens da Venda */}
            <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3 border-b border-gray-300 pb-2">ITENS DA VENDA</h3>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-2 border">Qtd</th>
                            <th className="text-left p-2 border">Produto</th>
                            <th className="text-right p-2 border">Valor Unit.</th>
                            <th className="text-right p-2 border">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venda.itens?.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 border text-center">{item.quantidade}</td>
                                <td className="p-2 border">
                                    {item.produto?.nome}
                                    {item.variacao?.nome_variacao && (
                                        <span className="text-gray-500 text-xs ml-1">
                                            ({item.variacao.nome_variacao})
                                        </span>
                                    )}
                                </td>
                                <td className="p-2 border text-right">{formatarValor(item.valor_unitario)}</td>
                                <td className="p-2 border text-right font-medium">{formatarValor(item.valor_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totais */}
            <div className="mb-6 border-t-2 border-gray-300 pt-4">
                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatarValor((venda.valor_total || 0) + (venda.desconto || 0))}</span>
                        </div>
                        {venda.desconto > 0 && (
                            <div className="flex justify-between mb-2 text-sm text-red-600">
                                <span>Desconto:</span>
                                <span className="font-medium">- {formatarValor(venda.desconto)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-2">
                            <span>TOTAL:</span>
                            <span>{formatarValor(venda.valor_total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações de Pagamento */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-bold text-gray-700 mb-2">INFORMAÇÕES DE PAGAMENTO</h3>
                <div className="text-sm">
                    <p><strong>Forma de Pagamento:</strong> {venda.forma_pagamento?.nome || '-'}</p>
                    {venda.funcionario?.nome && (
                        <p><strong>Atendente:</strong> {venda.funcionario.nome}</p>
                    )}
                </div>
            </div>

            {/* Rodapé */}
            <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
                <p className="mb-1">Obrigado pela preferência!</p>
                <p className="text-xs">Este documento não tem valor fiscal</p>
            </div>

            {/* Estilos de Impressão */}
            <style jsx>{`
                @media print {
                    .comprovante {
                        display: block !important;
                    }
                    
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
