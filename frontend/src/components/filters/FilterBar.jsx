// components/filters/FilterBar.jsx

import { Search } from 'lucide-react';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  filterEstado, 
  onEstadoChange, 
  filterResponsable, 
  onResponsableChange, 
  onSearch,
  options 
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Buscar por número de parte, descripción..."
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-card border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-muted-foreground transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filterEstado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="h-10 px-3 rounded-lg bg-card border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none min-w-[160px]"
        >
          <option value="">Todos los estados</option>
          {options.estados.map(est => (
            <option key={est.id} value={est.id}>{est.nombre}</option>
          ))}
        </select>

        <select
          value={filterResponsable}
          onChange={(e) => onResponsableChange(e.target.value)}
          className="h-10 px-3 rounded-lg bg-card border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none min-w-[160px]"
        >
          <option value="">Todos los técnicos</option>
          {options.empleados.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>

        <button
          onClick={onSearch}
          className="h-10 px-4 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Search size={16} /> Buscar
        </button>
      </div>
    </div>
  );
};

export default FilterBar;