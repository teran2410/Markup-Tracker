// MarkupCard.jsx

import React from 'react';
import { Clock, Pencil, Trash2, MessageSquare } from 'lucide-react';

const MarkupCard = ({ markup, onEdit, onDelete, onComment }) => {
  // Función para calcular días restantes
  const calcularDiasRestantes = (fechaCompromiso) => {
    if (!fechaCompromiso) return null;
    
    const hoy = new Date();
    const compromiso = new Date(fechaCompromiso);
    const diferencia = Math.ceil((compromiso - hoy) / (1000 * 60 * 60 * 24));
    
    return diferencia;
  };

  // Función para obtener estilo según tiempo restante
  const getUrgenciaStyle = (dias) => {
    if (dias === null) {
      return { label: 'Sin fecha', badge: 'bg-slate-100 text-slate-400 border-slate-200', bar: 'bg-slate-300' };
    }
    if (dias <= 0) {
      return { label: 'Vencido', badge: 'bg-urgent/10 text-urgent border-urgent/30', bar: 'bg-urgent' };
    }
    if (dias <= 3) {
      return { label: 'Urgente', badge: 'bg-warning/10 text-warning border-warning/30', bar: 'bg-warning' };
    }
    return { label: 'A tiempo', badge: 'bg-safe/10 text-safe border-safe/30', bar: 'bg-safe' };
  };

  // Función para generar iniciales del responsable
  const getIniciales = (nombre) => {
    if (!nombre) return '??';
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  };

  const diasRestantes = calcularDiasRestantes(markup.fecha_compromiso);
  const urgenciaStyle = getUrgenciaStyle(diasRestantes);

  return (
    <div
      className="relative group bg-white border border-border-dark rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Botones de acción (visibles en hover) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onComment(markup)}
          className="p-1.5 rounded-lg bg-white border border-border-dark text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
        >
          <MessageSquare size={14} />
        </button>
        <button
          onClick={() => onEdit(markup)}
          className="p-1.5 rounded-lg bg-white border border-border-dark text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(markup)}
          className="p-1.5 rounded-lg bg-white border border-border-dark text-slate-400 hover:text-urgent hover:border-urgent/30 hover:bg-urgent/5 transition-all shadow-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {/* Barra Lateral de Urgencia */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${urgenciaStyle.bar}`} />

      {/* Contenido Principal */}
      <div className="p-5 pl-6">
        {/* Header: Badge de Urgencia + Revisión */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-block px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-[0.15em] ${urgenciaStyle.badge}`}>
            {urgenciaStyle.label}
          </span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
            {markup.nueva_revision ? `Rev ${markup.nueva_revision}` : 'Rev.00'}
          </span>
        </div>

        {/* ID + Part Number */}
        <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight font-mono group-hover:text-primary transition-colors">
          #{markup.id} - {markup.numero_parte}
        </h3>

        {/* Responsable con Avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
            {getIniciales(markup.responsable_detalle?.nombre)}
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Responsable
            </p>
            <span className="text-sm font-semibold text-slate-700">
              {markup.responsable_detalle?.nombre || 'Sin asignar'} - {markup.responsable_detalle?.numero_empleado || 'N/A'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-4" />

        {/* Footer Grid: Tiempo Restante + Estado */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tiempo Restante */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tiempo Restante
            </p>
            <div className="flex items-center gap-1.5">
              <Clock 
                size={14} 
                className={diasRestantes !== null && diasRestantes < 0 ? 'text-urgent' : 'text-slate-500'} 
              />
              <span className={`text-sm font-bold ${
                diasRestantes === null 
                  ? 'text-slate-500' 
                  : diasRestantes < 0 
                    ? 'text-urgent' 
                    : diasRestantes <= 3 
                      ? 'text-warning' 
                      : 'text-safe'
              }`}>
                {diasRestantes === null 
                  ? 'Sin fecha' 
                  : diasRestantes < 0 
                    ? `-${Math.abs(diasRestantes)} Días` 
                    : diasRestantes === 0 
                      ? 'Hoy' 
                      : `${diasRestantes} Días`
                }
              </span>
            </div>
          </div>

          {/* Estado */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Estado
            </p>
            <p className="text-sm font-bold text-slate-700">
              {markup.estado_detalle?.nombre || 'Sin estado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;