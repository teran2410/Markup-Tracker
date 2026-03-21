import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 15000, // Si el server no responde en 5s, cancela
});

export const coreService = {
  getEmpleados: () => api.get('empleados/'),
  getEstados: () => api.get('estados-markup/'),
  getTipos: () => api.get('tipos-markup/'),
};

export const markupService = {
  getAll: () => api.get('markups/'),
  create: (data) => api.post('markups/', data),
  update: (id, data) => api.patch(`markups/${id}/`, data), 
};

export default api;