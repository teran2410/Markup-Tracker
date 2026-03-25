// components/filters/AdvancedFilters.jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, X, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

const AdvancedFilters = ({
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  filterTipo, setFilterTipo,
  options,
  markups, // for export
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-[10px] font-black uppercase tracking-wider">Filtros Avanzados</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Fecha desde</label>
              <input
                type="date"
                className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Fecha hasta</label>
              <input
                type="date"
                className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Tipo de Markup</label>
              <select
                className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                value={filterTipo}
                onChange={e => setFilterTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {options.tipos?.map(t => (
                  <option key={t.id} value={t.id}>{t.descripcion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => exportToExcel(markups)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-safe/10 text-safe hover:bg-safe/20 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet size={14} /> Exportar Excel
            </button>
            <button
              onClick={() => exportToPDF(markups)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-urgent/10 text-urgent hover:bg-urgent/20 text-xs font-semibold transition-colors"
            >
              <FileText size={14} /> Exportar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
