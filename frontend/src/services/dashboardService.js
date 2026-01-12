import api from './api';

const dashboardService = {
    async getStatistics() {
        try {
            const response = await api.get('/dashboard/statistics');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    }
};

export default dashboardService;
