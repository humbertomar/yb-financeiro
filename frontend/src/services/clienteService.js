import api from './api';

export const clienteService = {
    // Listar com paginação e busca
    listar: async (page = 1, search = '', all = false) => {
        const params = new URLSearchParams({ page });
        if (search) params.append('search', search);
        if (all) params.append('all', 'true');
        const { data } = await api.get(`/clientes?${params}`);
        return data;
    },

    // Obter cliente específico
    obter: async (id) => {
        const { data } = await api.get(`/clientes/${id}`);
        return data;
    },

    // Criar novo
    criar: async (dados) => {
        const { data } = await api.post('/clientes', dados);
        return data;
    },

    // Atualizar
    atualizar: async (id, dados) => {
        const { data } = await api.put(`/clientes/${id}`, dados);
        return data;
    },

    // Remover
    remover: async (id) => {
        await api.delete(`/clientes/${id}`);
    }
};
