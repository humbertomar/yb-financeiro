import api from './api';

export const produtoService = {
    // Listar todos com paginação e busca
    listar: async (page = 1, search = '', idCategoria = '', all = false) => {
        const params = new URLSearchParams({ page });
        if (search) params.append('search', search);
        if (idCategoria) params.append('idCategoria', idCategoria);
        if (all) params.append('all', 'true');
        const { data } = await api.get(`/produtos?${params}`);
        return data;
    },

    // Obter um produto específico
    obter: async (id) => {
        const { data } = await api.get(`/produtos/${id}`);
        return data;
    },

    // Criar novo (com variações)
    criar: async (dados) => {
        const { data } = await api.post('/produtos', dados);
        return data;
    },

    // Atualizar
    atualizar: async (id, dados) => {
        const { data } = await api.put(`/produtos/${id}`, dados);
        return data;
    },

    // Remover
    remover: async (id) => {
        await api.delete(`/produtos/${id}`);
    },

    // Relatório de Estoque
    relatorioEstoque: async (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.idCategoria) params.append('idCategoria', filtros.idCategoria);
        if (filtros.nome) params.append('nome', filtros.nome);

        const { data } = await api.get(`/produtos/relatorio-estoque?${params}`);
        return data;
    }
};
