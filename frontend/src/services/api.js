import axios from 'axios';

// Creamos la instancia apuntando a Django
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Definimos los servicios para la app de Markups
export const markupService = {
  // GET a /api/markups/
  getAll: () => api.get('markups/'),
  
  // POST a /api/markups/
  create: (data) => api.post('markups/', data),
};

export default api;