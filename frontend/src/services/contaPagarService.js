import api from './api';

export const contaPagarService = {
    listar: async (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.fornecedor) params.append('fornecedor', filtros.fornecedor);
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);

        const { data } = await api.get(`/contas-pagar?${params}`);
        return data;
    },

    obter: async (id) => {
        const { data } = await api.get(`/contas-pagar/${id}`);
        return data;
    },

    criar: async (dados) => {
        const { data } = await api.post('/contas-pagar', dados);
        return data;
    },

    atualizar: async (id, dados) => {
        const { data } = await api.put(`/contas-pagar/${id}`, dados);
        return data;
    },

    excluir: async (id) => {
        await api.delete(`/contas-pagar/${id}`);
    },

    pagarParcela: async (idParcela, dadosPagamento) => {
        const { data } = await api.post(`/parcelas/${idParcela}/pagar`, dadosPagamento);
        return data;
    },

    calendario: async (mes, ano) => {
        const { data } = await api.get(`/contas-pagar/calendario/${mes}/${ano}`);
        return data;
    }
};
