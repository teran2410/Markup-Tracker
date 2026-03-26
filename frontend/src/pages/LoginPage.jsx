import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogIn, AlertCircle, Shield, Users, TrendingUp, CheckCircle2, BarChart3, Clock, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      toast.success('¡Bienvenido!', {
        description: 'Autenticación exitosa',
        duration: 2000,
      });
      navigate('/');
    } else {
      toast.error('Error de autenticación', {
        description: result.error || 'Credenciales incorrectas. Verifica tu usuario y contraseña.',
        duration: 4000,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Left Side - Landing / Project Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white">
        {/* Background image (subtle, for atmosphere) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 py-16 max-w-xl">

          <h1 className="text-4xl font-extrabold mb-3 leading-tight">MarkUp Tracker</h1>
          <p className="text-lg text-blue-200/90 font-medium mb-2">Plataforma de gestión de markups</p>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Centraliza el seguimiento de markups, comentarios y tareas de tus proyectos.
            Colabora con tu equipo, prioriza hallazgos y mantén trazabilidad completa
            en un solo lugar.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Zap className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
              <p className="text-2xl font-bold">3×</p>
              <p className="text-xs text-gray-300">Más rápido</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <BarChart3 className="w-6 h-6 text-green-300 mx-auto mb-1" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-gray-300">Trazabilidad</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-purple-300 mx-auto mb-1" />
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-gray-300">Disponibilidad</p>
            </div>
          </div>

          {/* Feature list */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">Ventajas clave</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
              <span className="text-gray-100 text-sm">Registro detallado de markups con tipos, prioridades y fechas de compromiso</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
              <span className="text-gray-100 text-sm">Colaboración en equipo con comentarios y asignación por áreas</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
              <span className="text-gray-100 text-sm">Métricas en tiempo real y seguimiento de avance por estado</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
              <span className="text-gray-100 text-sm">Autenticación segura con cookies httpOnly y control de accesos</span>
            </li>
          </ul>

          <p className="mt-10 text-xs text-gray-400">© {new Date().getFullYear()} Navico Group — Todos los derechos reservados</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/src/assets/logo-navico-white.png" 
              alt="Navico Group" 
              className="h-12 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-2">MarkUp Tracker</h1>
          </div>

          {/* Form Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8">
            {/* Header with Logo */}
            <div className="mb-8 text-center">
              <img 
                src="/src/assets/logo-navico-white.png" 
                alt="Navico Group" 
                className="h-14 object-contain mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-400 text-sm">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Usuario
                  <span className="text-gray-500 ml-2 text-xs">(requerido)</span>
                </label>
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                    autoFocus
                    autoComplete="username"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-gray-500"
                    placeholder="tu.usuario"
                  />
                  {username && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                  <span className="text-gray-500 ml-2 text-xs">(requerido)</span>
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-gray-500"
                    placeholder="••••••••"
                  />
                  {password && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 text-center">
                <Shield className="w-4 h-4 inline mr-1" />
                Conexión segura con encriptación end-to-end
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Problemas para acceder?{' '}
            <button className="text-blue-400 hover:text-blue-300 underline transition">
              Contacta a soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
