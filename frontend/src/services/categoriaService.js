import api from './api';

export const categoriaService = {
    // Listar todas
    listar: async () => {
        const { data } = await api.get('/categorias');
        return data;
    },

    // Criar nova
    criar: async (dados) => {
        const { data } = await api.post('/categorias', dados);
        return data;
    },

    // Atualizar
    atualizar: async (id, dados) => {
        const { data } = await api.put(`/categorias/${id}`, dados);
        return data;
    },

    // Remover
    remover: async (id) => {
        await api.delete(`/categorias/${id}`);
    }
};
