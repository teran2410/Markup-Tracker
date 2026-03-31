import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  timeout: 15000,
  withCredentials: true, // Enviar cookies automáticamente con cada request
});

// ========================================
// INTERCEPTOR: Manejar errores de autenticación
// ========================================
// Con httpOnly cookies, el browser envía automáticamente el access_token
// No necesitamos agregar manualmente el header Authorization
api.interceptors.response.use(
  (response) => response, // Si todo OK, pasar la respuesta
  async (error) => {
    const originalRequest = error.config;
    
    // Si recibimos 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // IMPORTANTE: No intentar refresh si ya estamos en el endpoint de refresh
      // Esto previene loops infinitos
      if (originalRequest.url?.includes('auth/refresh')) {
        // Si falla el refresh, redirigir a login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      
      try {
        // Intentar renovar el token
        // El refresh_token también está en una cookie, se envía automáticamente
        await api.post('auth/refresh/');
        
        // Si el refresh fue exitoso, reintentar la request original
        // El nuevo access_token ya está en la cookie actualizada
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, redirigir a login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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
  delete: (id) => api.delete(`markups/${id}/`),
};

export const commentService = {
  getByMarkup: (markupId) => api.get('comentarios/', { params: { markup: markupId } }),
  create: (data) => api.post('comentarios/', data),
};

// ========================================
// Servicio de autenticación
// ========================================
export const authService = {
  /**
   * Login: Autenticar usuario y recibir cookies httpOnly
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario autenticado
   */
  login: (username, password) => 
    api.post('auth/login/', { username, password }),
  
  /**
   * Obtener datos del usuario actual
   * @returns {Promise} { id, username, email, first_name, last_name }
   */
  getCurrentUser: () => api.get('auth/me/'),
  
  /**
   * Cerrar sesión (eliminar cookies)
   * @returns {Promise}
   */
  logout: () => api.post('auth/logout/'),
  
  /**
   * Refrescar token manualmente (normalmente manejado por interceptor)
   * @returns {Promise}
   */
  refreshToken: () => api.post('auth/refresh/'),
};

export default api;