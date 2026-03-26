import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al cargar la app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Si hay una cookie httpOnly válida, este endpoint retornará el usuario
      const { data } = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      // No hay sesión activa o token expirado - esto es normal
      // No necesitamos hacer nada, el usuario simplemente no está autenticado
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // El backend establece las cookies httpOnly automáticamente
      const { data } = await authService.login(username, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Eliminar cookies del servidor
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local siempre
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
