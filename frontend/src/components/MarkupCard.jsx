import React from 'react';
import { MessageSquare, User, Tag, Calendar, ChevronRight } from 'lucide-react';

const MarkupCard = ({ markup, onClick }) => {
  // Colores según el estado (Paleta Slate & Sky)
  const getStatusColors = (nombre) => {
    switch (nombre?.toLowerCase()) {
      case 'abierto': return 'border-sky-500 text-sky-400 bg-sky-500/5';
      case 'en proceso': return 'border-amber-500 text-amber-400 bg-amber-500/5';
      case 'finalizado': return 'border-emerald-500 text-emerald-400 bg-emerald-500/5';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/5';
    }
  };

  const statusStyle = getStatusColors(markup.estado_detalle?.nombre);

  return (
    <div 
      onClick={() => onClick(markup)}
      className={`
        relative group cursor-pointer
        bg-surface-dark border border-border-dark rounded-2xl p-5
        hover:border-slate-600 hover:shadow-2xl hover:shadow-sky-900/20
        transition-all duration-300 transform hover:-translate-y-1
        ${markup.isOptimistic ? 'opacity-60 grayscale' : ''}
      `}
    >
      {/* Indicador de Estado Lateral */}
      <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full border-l-4 ${statusStyle.split(' ')[0]}`} />

      <div className="space-y-4">
        {/* Header de la Card */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Part Number</span>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors tracking-tight font-mono">
              {markup.numero_parte}
            </h3>
          </div>
          <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusStyle}`}>
            {markup.estado_detalle?.nombre}
          </span>
        </div>

        {/* Descripción (Truncada para mantener grid uniforme) */}
        <p className="text-sm text-slate-400 line-clamp-2 italic min-h-[40px]">
          "{markup.descripcion || 'Sin descripción técnica disponible...'}"
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-800/50 w-full" />

        {/* Footer con Meta-data */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-slate-500">
            <User size={14} className="text-slate-600" />
            <span className="text-[11px] font-medium truncate">
              {markup.responsable_detalle?.nombre || 'Sin asignar'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 justify-end">
            <Tag size={14} className="text-slate-600" />
            <span className="text-[11px] font-medium">
              {markup.tipo_detalle?.descripcion || 'General'}
            </span>
          </div>
        </div>

        {/* Acción Flotante Sutil */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
            <MessageSquare size={12} />
            <span>Ver Logs</span>
          </div>
          <ChevronRight size={16} className="text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;