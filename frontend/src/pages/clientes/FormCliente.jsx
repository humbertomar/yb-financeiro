import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../../services/clienteService';
import { maskCPF, maskPhone, maskCEP, removeMask } from '../../utils/masks';

export default function FormCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        whatsapp: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    useEffect(() => {
        if (isEdit) {
            loadCliente();
        }
    }, [id]);

    async function loadCliente() {
        try {
            setLoading(true);
            const cliente = await clienteService.obter(id);
            setFormData({
                nome: cliente.nome,
                cpf: maskCPF(cliente.cpf || ''),
                whatsapp: maskPhone(cliente.whatsapp || ''),
                email: cliente.email || '',
                endereco: cliente.logradouro || '',
                cidade: cliente.cidade || '',
                estado: cliente.estado || '',
                cep: maskCEP(cliente.cep || '')
            });
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            setErro('Erro ao carregar dados do cliente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            // Remove máscaras antes de enviar
            const dataToSend = {
                ...formData,
                cpf: removeMask(formData.cpf),
                whatsapp: removeMask(formData.whatsapp),
                cep: removeMask(formData.cep)
            };

            if (isEdit) {
                await clienteService.atualizar(id, dataToSend);
            } else {
                await clienteService.criar(dataToSend);
            }
            navigate('/clientes');
        } catch (error) {
            console.error(error);
            setErro('Erro ao salvar cliente. Verifique os campos.');
        } finally {
            setLoading(false);
        }
    }

    if (loading && isEdit && !formData.nome) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>

            {erro && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: João da Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CPF
                            </label>
                            <input
                                type="text"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="000.000.000-00"
                                maxLength="14"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp *
                            </label>
                            <input
                                type="text"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: maskPhone(e.target.value) })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="(00) 00000-0000"
                                maxLength="15"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="cliente@email.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço Completo
                            </label>
                            <input
                                type="text"
                                value={formData.endereco}
                                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Rua, Número, Bairro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade
                            </label>
                            <input
                                type="text"
                                value={formData.cidade}
                                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: São Paulo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <input
                                type="text"
                                value={formData.estado}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    if (value.length <= 2) {
                                        setFormData({ ...formData, estado: value });
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="SP"
                                maxLength="2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CEP
                            </label>
                            <input
                                type="text"
                                value={formData.cep}
                                onChange={(e) => setFormData({ ...formData, cep: maskCEP(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="00000-000"
                                maxLength="9"
                            />
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/clientes')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-6 py-2 rounded-lg hover:from-[#6B5536] hover:to-[#8B6F47] transition disabled:bg-gray-400 shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Salvando...' : 'Salvar Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
}
