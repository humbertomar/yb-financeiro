import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contaPagarService } from '../../services/contaPagarService';

export default function FormContaPagar() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        descricao: '',
        valor_total: '',
        categoria: '',
        fornecedor: '',
        parcelado: false,
        numero_parcelas: 1,
        periodicidade_dias: 30,
        data_primeiro_vencimento: '',
        observacoes: ''
    });

    const [loading, setLoading] = useState(false);
    const [previewParcelas, setPreviewParcelas] = useState([]);

    useEffect(() => {
        if (isEdit && id) {
            carregarConta();
        }
    }, [id, isEdit]);

    async function carregarConta() {
        try {
            setLoading(true);
            const data = await contaPagarService.obter(id);
            setFormData({
                descricao: data.descricao || '',
                valor_total: data.valor_total || '',
                categoria: data.categoria || '',
                fornecedor: data.fornecedor || '',
                parcelado: data.parcelado || false,
                numero_parcelas: data.numero_parcelas || 1,
                periodicidade_dias: 30,
                data_primeiro_vencimento: data.parcelas?.[0]?.data_vencimento || '',
                observacoes: data.observacoes || ''
            });
        } catch (error) {
            console.error('Erro ao carregar conta:', error);
            alert('Erro ao carregar dados da conta');
            navigate('/contas-pagar');
        } finally {
            setLoading(false);
        }
    }


    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Atualizar preview de parcelas
        if (name === 'valor_total' || name === 'numero_parcelas' || name === 'data_primeiro_vencimento' || name === 'parcelado' || name === 'periodicidade_dias') {
            atualizarPreview({ ...formData, [name]: newValue });
        }
    }

    function atualizarPreview(data) {
        if (!data.valor_total || !data.data_primeiro_vencimento) {
            setPreviewParcelas([]);
            return;
        }

        const numParcelas = data.parcelado ? parseInt(data.numero_parcelas) || 1 : 1;
        const valorParcela = parseFloat(data.valor_total) / numParcelas;
        const dataBase = new Date(data.data_primeiro_vencimento + 'T00:00:00');
        const periodicidadeDias = parseInt(data.periodicidade_dias) || 30;

        const parcelas = [];
        for (let i = 0; i < numParcelas; i++) {
            const dataVencimento = new Date(dataBase);
            dataVencimento.setDate(dataVencimento.getDate() + (i * periodicidadeDias));

            parcelas.push({
                numero: i + 1,
                valor: valorParcela,
                vencimento: dataVencimento.toLocaleDateString('pt-BR')
            });
        }

        setPreviewParcelas(parcelas);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.descricao || !formData.valor_total || !formData.data_primeiro_vencimento) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await contaPagarService.atualizar(id, formData);
                alert('Conta atualizada com sucesso!');
            } else {
                await contaPagarService.criar(formData);
                alert('Conta criada com sucesso!');
            }

            navigate('/contas-pagar');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar conta');
        } finally {
            setLoading(false);
        }
    }

    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEdit ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Descrição */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                        </label>
                        <input
                            type="text"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Valor Total */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor Total *
                        </label>
                        <input
                            type="number"
                            name="valor_total"
                            value={formData.valor_total}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                        </label>
                        <input
                            type="text"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Fornecedor */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fornecedor/Beneficiário
                        </label>
                        <input
                            type="text"
                            name="fornecedor"
                            value={formData.fornecedor}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Parcelado */}
                    <div className="md:col-span-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="parcelado"
                                checked={formData.parcelado}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Parcelar esta conta</span>
                        </label>
                    </div>

                    {/* Campos condicionais de parcelamento */}
                    {formData.parcelado && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Parcelas *
                                </label>
                                <input
                                    type="number"
                                    name="numero_parcelas"
                                    value={formData.numero_parcelas}
                                    onChange={handleChange}
                                    min="1"
                                    max="60"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Periodicidade (dias) *
                                </label>
                                <input
                                    type="number"
                                    name="periodicidade_dias"
                                    value={formData.periodicidade_dias}
                                    onChange={handleChange}
                                    min="1"
                                    max="365"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: 10, 20, 30..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Intervalo em dias entre cada parcela
                                </p>
                            </div>
                        </>
                    )}


                    {/* Data Primeiro Vencimento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data do {formData.parcelado ? 'Primeiro ' : ''}Vencimento *
                        </label>
                        <input
                            type="date"
                            name="data_primeiro_vencimento"
                            value={formData.data_primeiro_vencimento}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Observações */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observações
                        </label>
                        <textarea
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Preview de Parcelas */}
                {previewParcelas.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Preview das Parcelas
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {previewParcelas.map((parcela) => (
                                <div key={parcela.numero} className="text-xs bg-white p-2 rounded border">
                                    <div className="font-medium">Parcela {parcela.numero}</div>
                                    <div className="text-gray-600">{formatarValor(parcela.valor)}</div>
                                    <div className="text-gray-500">{parcela.vencimento}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botões */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/contas-pagar')}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
