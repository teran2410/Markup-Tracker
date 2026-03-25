// components/filters/FilterTags.jsx
import { X } from 'lucide-react';

const FilterTags = ({ tags, onRemove }) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Filtros:</span>
      {tags.map(t => (
        <span
          key={t.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
        >
          {t.label}
          <button onClick={() => onRemove(t.key)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
            <X size={12} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default FilterTags;
