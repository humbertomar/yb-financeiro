import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formaPagamentoService } from '../../services/formaPagamentoService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';

export default function ListaFormasPagamento() {
    const navigate = useNavigate();
    const [formas, setFormas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarFormas();
    }, []);

    async function carregarFormas() {
        try {
            setLoading(true);
            const data = await formaPagamentoService.listar();
            setFormas(data);
        } catch (error) {
            console.error('Erro ao carregar formas de pagamento:', error);
            setErro('Erro ao carregar formas de pagamento.');
        } finally {
            setLoading(false);
        }
    }

    async function handleExcluir(id, nome) {
        if (!confirm(`Deseja realmente excluir a forma de pagamento "${nome}"?`)) {
            return;
        }

        try {
            await formaPagamentoService.remover(id);
            alert('Forma de pagamento excluída com sucesso!');
            carregarFormas();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            const mensagem = error.response?.data?.error || 'Erro ao excluir forma de pagamento.';
            alert(mensagem);
        }
    }

    const formasFiltradas = formas.filter(forma =>
        forma.forma_pagamento.toLowerCase().includes(busca.toLowerCase()) ||
        (forma.texto && forma.texto.toLowerCase().includes(busca.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Formas de Pagamento</h1>
                <button
                    onClick={() => navigate('/formaspagamento/nova')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Nova Forma de Pagamento
                </button>
            </div>

            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {erro}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar forma de pagamento..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {formasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Nenhuma forma de pagamento encontrada.
                                    </td>
                                </tr>
                            ) : (
                                formasFiltradas.map((forma) => (
                                    <tr key={forma.idFormapagamento} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            #{forma.idFormapagamento}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {forma.forma_pagamento}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {forma.texto || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${forma.ativo === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {forma.ativo === 1 ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <ActionButtons>
                                                <EditButton to={`/formaspagamento/${forma.idFormapagamento}/editar`} />
                                                <DeleteButton onClick={() => handleExcluir(forma.idFormapagamento, forma.forma_pagamento)} />
                                            </ActionButtons>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Total: {formasFiltradas.length} forma(s) de pagamento
                </div>
            </div>
        </div>
    );
}
