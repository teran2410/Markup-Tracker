import { Loader2 } from 'lucide-react';

/**
 * Overlay de carga global con mensaje personalizado
 * Uso: <LoadingOverlay message="Cargando datos..." />
 */
const LoadingOverlay = ({ message = 'Cargando...', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-20';

  return (
    <div className={`${containerClass} bg-gray-900/80 backdrop-blur-sm flex items-center justify-center`}>
      <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <p className="text-white font-medium text-lg">{message}</p>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

/**
 * Spinner más pequeño para uso inline
 * Uso: <LoadingSpinner size="sm" />
 */
export const LoadingSpinner = ({ size = 'md', color = 'text-blue-400' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 className={`${sizeClasses[size]} ${color} animate-spin`} />
  );
};

/**
 * Skeleton loader para cards
 * Uso: <SkeletonLoader />
 */
export const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  );
};

export default LoadingOverlay;
