import api from './api';

export const vendaService = {
    // Listar com paginação, busca e filtros
    listar: async (page = 1, search = '', dataInicio = '', dataFim = '') => {
        const params = new URLSearchParams({ page });
        if (search) params.append('search', search);
        if (dataInicio) params.append('data_inicio', dataInicio);
        if (dataFim) params.append('data_fim', dataFim);
        const { data } = await api.get(`/vendas?${params}`);
        return data;
    },

    // Obter venda específica
    obter: async (id) => {
        const { data } = await api.get(`/vendas/${id}`);
        return data;
    },

    // Criar nova venda
    criar: async (dados) => {
        const { data } = await api.post('/vendas', dados);
        return data;
    },

    // Atualizar (observações/status)
    atualizar: async (id, dados) => {
        const { data } = await api.put(`/vendas/${id}`, dados);
        return data;
    },

    // Cancelar venda
    cancelar: async (id) => {
        await api.delete(`/vendas/${id}`);
    },

    // Relatório de vendas
    relatorio: async (filtros) => {
        const params = new URLSearchParams();
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.idCliente) params.append('idCliente', filtros.idCliente);
        if (filtros.idFormapagamento) params.append('idFormapagamento', filtros.idFormapagamento);

        const { data } = await api.get(`/vendas/relatorio?${params}`);
        return data;
    }
};
