import api from './api';

export const formaPagamentoService = {
    // Listar todas
    listar: async () => {
        const { data } = await api.get('/formaspagamento');
        return data;
    },

    obter: async (id) => {
        const { data } = await api.get(`/formaspagamento/${id}`);
        return data;
    },

    criar: async (dados) => {
        const { data } = await api.post('/formaspagamento', dados);
        return data;
    },

    atualizar: async (id, dados) => {
        const { data } = await api.put(`/formaspagamento/${id}`, dados);
        return data;
    },

    remover: async (id) => {
        const { data } = await api.delete(`/formaspagamento/${id}`);
        return data;
    }
};
