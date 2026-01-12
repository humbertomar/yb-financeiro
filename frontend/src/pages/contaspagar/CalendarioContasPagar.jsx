import { useState, useEffect } from 'react';
import { contaPagarService } from '../../services/contaPagarService';
import { Link } from 'react-router-dom';

export default function CalendarioContasPagar() {
    const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
    const [parcelas, setParcelas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [diaSelecionado, setDiaSelecionado] = useState(null);

    useEffect(() => {
        carregarParcelas();
    }, [mesAtual, anoAtual]);

    async function carregarParcelas() {
        try {
            setLoading(true);
            const data = await contaPagarService.calendario(mesAtual, anoAtual);
            setParcelas(data);
        } catch (error) {
            console.error('Erro ao carregar calendário:', error);
        } finally {
            setLoading(false);
        }
    }

    function mesAnterior() {
        if (mesAtual === 1) {
            setMesAtual(12);
            setAnoAtual(anoAtual - 1);
        } else {
            setMesAtual(mesAtual - 1);
        }
    }

    function proximoMes() {
        if (mesAtual === 12) {
            setMesAtual(1);
            setAnoAtual(anoAtual + 1);
        } else {
            setMesAtual(mesAtual + 1);
        }
    }

    function getDiasDoMes() {
        const primeiroDia = new Date(anoAtual, mesAtual - 1, 1);
        const ultimoDia = new Date(anoAtual, mesAtual, 0);
        const diasNoMes = ultimoDia.getDate();
        const diaSemanaInicio = primeiroDia.getDay();

        const dias = [];

        // Dias vazios antes do primeiro dia
        for (let i = 0; i < diaSemanaInicio; i++) {
            dias.push(null);
        }

        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            dias.push(dia);
        }

        return dias;
    }

    function getParcelasDoDia(dia) {
        const dataStr = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        return parcelas.filter(p => p.data_vencimento === dataStr);
    }

    function getCorDia(dia) {
        const parcelasDia = getParcelasDoDia(dia);
        if (parcelasDia.length === 0) return '';

        const temPago = parcelasDia.some(p => p.data_pagamento);
        const temAtrasado = parcelasDia.some(p => !p.data_pagamento && p.data_vencimento < new Date().toISOString().split('T')[0]);
        const temPendente = parcelasDia.some(p => !p.data_pagamento && p.data_vencimento >= new Date().toISOString().split('T')[0]);

        if (temAtrasado) return 'bg-red-100 border-red-300';
        if (temPendente) return 'bg-yellow-100 border-yellow-300';
        if (temPago) return 'bg-green-100 border-green-300';
        return '';
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    }

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Calendário de Vencimentos</h1>
                <Link
                    to="/contas-pagar"
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Voltar para Lista
                </Link>
            </div>

            {/* Navegação do Calendário */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={mesAnterior}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        ← Anterior
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {meses[mesAtual - 1]} {anoAtual}
                    </h2>
                    <button
                        onClick={proximoMes}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Próximo →
                    </button>
                </div>

                {/* Legenda */}
                <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                        <span>Atrasado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span>A Vencer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span>Pago</span>
                    </div>
                </div>

                {/* Calendário */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Carregando...</div>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {/* Cabeçalho dos dias da semana */}
                        {diasSemana.map(dia => (
                            <div key={dia} className="text-center font-semibold text-gray-600 py-2">
                                {dia}
                            </div>
                        ))}

                        {/* Dias do mês */}
                        {getDiasDoMes().map((dia, index) => {
                            if (dia === null) {
                                return <div key={`empty-${index}`} className="aspect-square"></div>;
                            }

                            const parcelasDia = getParcelasDoDia(dia);
                            const corDia = getCorDia(dia);

                            return (
                                <div
                                    key={dia}
                                    onClick={() => setDiaSelecionado(dia)}
                                    className={`aspect-square border-2 rounded-lg p-2 cursor-pointer hover:shadow-lg transition ${corDia}`}
                                >
                                    <div className="font-semibold text-gray-800">{dia}</div>
                                    {parcelasDia.length > 0 && (
                                        <div className="text-xs text-gray-600 mt-1">
                                            {parcelasDia.length} {parcelasDia.length === 1 ? 'parcela' : 'parcelas'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detalhes do Dia Selecionado */}
            {diaSelecionado && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Parcelas de {diaSelecionado}/{mesAtual}/{anoAtual}
                    </h3>

                    {getParcelasDoDia(diaSelecionado).length === 0 ? (
                        <p className="text-gray-500">Nenhuma parcela neste dia</p>
                    ) : (
                        <div className="space-y-3">
                            {getParcelasDoDia(diaSelecionado).map((parcela) => (
                                <div key={parcela.idParcela} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {parcela.conta_pagar?.descricao || 'Conta'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Parcela {parcela.numero_parcela} - {formatarValor(parcela.valor_parcela)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Fornecedor: {parcela.conta_pagar?.fornecedor || '-'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs rounded-full ${parcela.data_pagamento ? 'bg-green-100 text-green-800' :
                                                    parcela.data_vencimento < new Date().toISOString().split('T')[0] ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {parcela.data_pagamento ? 'Pago' :
                                                    parcela.data_vencimento < new Date().toISOString().split('T')[0] ? 'Atrasado' :
                                                        'Pendente'}
                                            </span>
                                            <Link
                                                to={`/contas-pagar/${parcela.idContaPagar}`}
                                                className="block mt-2 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Ver detalhes →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
