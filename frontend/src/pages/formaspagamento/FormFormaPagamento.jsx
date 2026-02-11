import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formaPagamentoService } from '../../services/formaPagamentoService';

export default function FormFormaPagamento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdicao = !!id;

    const [formData, setFormData] = useState({
        forma_pagamento: '',
        texto: '',
        ativo: 1
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (isEdicao) {
            carregarForma();
        }
    }, [id]);

    async function carregarForma() {
        try {
            setLoading(true);
            const data = await formaPagamentoService.obter(id);
            setFormData({
                forma_pagamento: data.forma_pagamento,
                texto: data.texto || '',
                ativo: data.ativo
            });
        } catch (error) {
            console.error('Erro ao carregar forma de pagamento:', error);
            setErro('Erro ao carregar forma de pagamento.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        if (!formData.forma_pagamento.trim()) {
            setErro('O nome da forma de pagamento é obrigatório.');
            return;
        }

        try {
            setLoading(true);
            if (isEdicao) {
                await formaPagamentoService.atualizar(id, formData);
                alert('Forma de pagamento atualizada com sucesso!');
            } else {
                await formaPagamentoService.criar(formData);
                alert('Forma de pagamento criada com sucesso!');
            }
            navigate('/formaspagamento');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setErro(error.response?.data?.message || 'Erro ao salvar forma de pagamento.');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    if (loading && isEdicao) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/formaspagamento')}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        ← Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isEdicao ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
                    </h1>
                </div>

                {erro && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Forma de Pagamento *
                        </label>
                        <input
                            type="text"
                            name="forma_pagamento"
                            value={formData.forma_pagamento}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Dinheiro, PIX, Cartão de Crédito"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição / Observações
                        </label>
                        <textarea
                            name="texto"
                            value={formData.texto}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Informações adicionais sobre esta forma de pagamento"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="ativo"
                            value={formData.ativo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={1}>Ativo</option>
                            <option value={0}>Inativo</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-6 py-3 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition disabled:bg-gray-400 shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Criar')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/formaspagamento')}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
