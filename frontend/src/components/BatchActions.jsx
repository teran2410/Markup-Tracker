// components/BatchActions.jsx
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

const BatchActions = ({ count, onDeleteSelected, onChangeEstado, onClear }) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl animate-in slide-in-from-bottom-2">
      <span className="text-sm font-semibold text-primary">
        {count} seleccionado{count > 1 ? 's' : ''}
      </span>
      <div className="w-px h-5 bg-primary/20" />
      <button
        onClick={() => onChangeEstado('cerrado')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-safe/10 text-safe hover:bg-safe/20 text-xs font-semibold transition-colors"
      >
        <CheckCircle size={14} /> Cerrar
      </button>
      <button
        onClick={onDeleteSelected}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-urgent/10 text-urgent hover:bg-urgent/20 text-xs font-semibold transition-colors"
      >
        <Trash2 size={14} /> Eliminar
      </button>
      <div className="flex-1" />
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
      >
        <XCircle size={14} /> Deseleccionar
      </button>
    </div>
  );
};

export default BatchActions;
