import api from './api';

export const funcionarioService = {
    // Listar todos
    listar: async () => {
        const { data } = await api.get('/funcionarios');
        return data;
    }
};
