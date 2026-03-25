// MarkupCard.jsx

import React from 'react';
import { Clock, Pencil, Trash2, MessageSquare } from 'lucide-react';

const calcularDiasRestantes = (fechaCompromiso) => {
  if (!fechaCompromiso) return null;
  const hoy = new Date();
  const compromiso = new Date(fechaCompromiso);
  return Math.ceil((compromiso - hoy) / (1000 * 60 * 60 * 24));
};

const getUrgenciaStyle = (dias) => {
  if (dias === null) {
    return {
      label: 'Sin fecha',
      badge: 'bg-muted text-muted-foreground',
      indicator: 'bg-muted-foreground',
    };
  }
  if (dias <= 0) {
    return {
      label: 'Vencido',
      badge: 'bg-urgent/15 text-urgent',
      indicator: 'bg-urgent',
    };
  }
  if (dias <= 3) {
    return {
      label: 'Urgente',
      badge: 'bg-warning/15 text-warning',
      indicator: 'bg-warning',
    };
  }
  return {
    label: 'A tiempo',
    badge: 'bg-safe/15 text-safe',
    indicator: 'bg-safe',
  };
};

const getIniciales = (nombre) => {
  if (!nombre) return '??';
  const palabras = nombre.trim().split(' ');
  if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
};

const MarkupCard = ({ markup, onEdit, onDelete, onComment }) => {
  const diasRestantes = calcularDiasRestantes(markup.fecha_compromiso);
  const urgenciaStyle = getUrgenciaStyle(diasRestantes);

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300">
      {/* Status indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${urgenciaStyle.indicator}`} />

      {/* Action buttons - visible on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onComment(markup)}
          className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <MessageSquare size={14} />
        </button>
        <button
          onClick={() => onEdit(markup)}
          className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(markup)}
          className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-4 pl-5">
        {/* Header: Badge + Revision */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide ${urgenciaStyle.badge}`}>
            {urgenciaStyle.label}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {markup.nueva_revision ? `Rev ${markup.nueva_revision}` : 'Rev 00'}
          </span>
        </div>

        {/* ID + Part Number */}
        <h3 className="text-base font-semibold text-foreground mb-4 font-mono tracking-tight group-hover:text-primary transition-colors">
          #{markup.id} - {markup.numero_parte}
        </h3>

        {/* Responsible */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-[10px] font-bold text-white shrink-0">
            {getIniciales(markup.responsable_detalle?.nombre)}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
              Responsable
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {markup.responsable_detalle?.nombre || 'Sin asignar'}
              {markup.responsable_detalle?.numero_empleado && (
                <span className="text-muted-foreground"> - {markup.responsable_detalle.numero_empleado}</span>
              )}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-4" />

        {/* Footer: Time + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Tiempo Restante
            </p>
            <div className="flex items-center gap-1.5">
              <Clock
                size={14}
                className={
                  diasRestantes !== null && diasRestantes <= 0
                    ? 'text-urgent'
                    : diasRestantes !== null && diasRestantes <= 3
                    ? 'text-warning'
                    : 'text-muted-foreground'
                }
              />
              <span
                className={`text-sm font-semibold ${
                  diasRestantes === null
                    ? 'text-muted-foreground'
                    : diasRestantes <= 0
                    ? 'text-urgent'
                    : diasRestantes <= 3
                    ? 'text-warning'
                    : 'text-safe'
                }`}
              >
                {diasRestantes === null
                  ? 'Sin fecha'
                  : diasRestantes === 0
                  ? 'Hoy'
                  : `${diasRestantes} Días`}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Estado
            </p>
            <p className="text-sm font-semibold text-foreground">
              {markup.estado_detalle?.nombre || 'Sin estado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;