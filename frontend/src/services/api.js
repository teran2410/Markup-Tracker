import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 15000, 
});

export const coreService = {
  getEmpleados: () => api.get('empleados/'),
  getEstados: () => api.get('estados-markup/'),
  getTipos: () => api.get('tipos-markup/'),
};

export const markupService = {
  getAll: (search = '') => api.get('markups/', { 
    params: search ? { search } : {} 
  }),
  create: (data) => api.post('markups/', data),
  update: (id, data) => api.patch(`markups/${id}/`, data),
};

export default api;