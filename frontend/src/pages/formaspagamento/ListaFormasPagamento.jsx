import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formaPagamentoService } from '../../services/formaPagamentoService';
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';
import ResponsiveTable from '../../components/ResponsiveTable';

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

    const columns = [
        {
            key: 'idFormapagamento',
            label: 'ID',
            render: (forma) => `#${forma.idFormapagamento}`,
            className: 'text-gray-900 font-medium'
        },
        {
            key: 'forma_pagamento',
            label: 'Nome',
            render: (forma) => forma.forma_pagamento,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'texto',
            label: 'Descrição',
            render: (forma) => forma.texto || '-',
            className: 'text-gray-500'
        },
        {
            key: 'ativo',
            label: 'Status',
            render: (forma) => (
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${forma.ativo === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {forma.ativo === 1 ? 'Ativo' : 'Inativo'}
                </span>
            )
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Formas de Pagamento</h2>
                <button
                    onClick={() => navigate('/formaspagamento/nova')}
                    className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-700 transition text-center font-medium"
                >
                    + Nova Forma de Pagamento
                </button>
            </div>

            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {erro}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar forma de pagamento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
            </div>

            <ResponsiveTable
                columns={columns}
                data={formasFiltradas}
                keyExtractor={(forma) => forma.idFormapagamento}
                actions={(forma) => (
                    <ActionButtons>
                        <EditButton to={`/formaspagamento/${forma.idFormapagamento}/editar`} />
                        <DeleteButton onClick={() => handleExcluir(forma.idFormapagamento, forma.forma_pagamento)} />
                    </ActionButtons>
                )}
                emptyMessage="Nenhuma forma de pagamento encontrada."
            />

            <div className="mt-4 text-sm text-gray-600 text-center sm:text-left">
                Total: {formasFiltradas.length} forma(s) de pagamento
            </div>
        </div>
    );
}
