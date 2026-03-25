// components/MarkupTable.jsx
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, MessageSquare, Clock } from 'lucide-react';

const calcDias = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

const urgencyColor = (dias) => {
  if (dias === null) return 'text-muted-foreground';
  if (dias <= 0) return 'text-urgent';
  if (dias <= 3) return 'text-warning';
  return 'text-safe';
};

const urgencyBadge = (dias) => {
  if (dias === null) return { label: 'Sin fecha', cls: 'bg-muted text-muted-foreground' };
  if (dias <= 0) return { label: 'Vencido', cls: 'bg-urgent/15 text-urgent' };
  if (dias <= 3) return { label: 'Urgente', cls: 'bg-warning/15 text-warning' };
  return { label: 'A tiempo', cls: 'bg-safe/15 text-safe' };
};

const columns = [
  { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
  { key: 'numero_parte', label: 'Número de Parte', sortable: true, className: 'w-48' },
  { key: 'nueva_revision', label: 'Rev', sortable: true, className: 'w-16 text-center' },
  { key: 'tipo', label: 'Tipo', sortable: true },
  { key: 'responsable', label: 'Responsable', sortable: true, className: 'w-16' },
  { key: 'estado', label: 'Estado', sortable: true, className: 'w-24' },
  { key: 'fecha_creacion', label: 'Creación', sortable: true, className: 'w-28 text-center' },
  { key: 'fecha_compromiso', label: 'Compromiso', sortable: true, className: 'w-28 text-center' },
  { key: 'dias', label: 'SLA', sortable: true, className: 'w-28 text-center' },
  { key: 'acciones', label: '', sortable: false, className: 'w-28' },
];

const getValue = (m, key) => {
  switch (key) {
    case 'tipo': return m.tipo_markup_detalle?.descripcion || '';
    case 'responsable': return m.responsable_detalle?.nombre || '';
    case 'estado': return m.estado_detalle?.nombre || '';
    case 'dias': return calcDias(m.fecha_compromiso) ?? Infinity;
    case 'fecha_creacion': return m.fecha_creacion || '';
    case 'fecha_compromiso': return m.fecha_compromiso || '';
    default: return m[key] ?? '';
  }
};

const MarkupTable = ({ markups, selectedIds, onToggleSelect, onToggleAll, onEdit, onDelete, onComment }) => {
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (!columns.find(c => c.key === key)?.sortable) return;
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...markups].sort((a, b) => {
    const va = getValue(a, sortKey);
    const vb = getValue(b, sortKey);
    const cmp = typeof va === 'number' && typeof vb === 'number'
      ? va - vb
      : String(va).localeCompare(String(vb), 'es');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const allSelected = markups.length > 0 && selectedIds.length === markups.length;

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ArrowUpDown size={12} className="text-muted-foreground/50 ml-1" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-primary ml-1" />
      : <ArrowDown size={12} className="text-primary ml-1" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="rounded border-border accent-primary"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none ${col.sortable ? 'cursor-pointer hover:text-foreground' : ''} ${col.className || ''}`}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const dias = calcDias(m.fecha_compromiso);
              const badge = urgencyBadge(dias);
              const isSelected = selectedIds.includes(m.id);
              return (
                <tr
                  key={m.id}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(m.id)}
                      className="rounded border-border accent-primary"
                    />
                  </td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">#{m.id}</td>
                  <td className="px-3 py-2.5 font-semibold text-foreground">{m.numero_parte}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">{m.nueva_revision || '—'}</td>
                  <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[180px]">{m.tipo_markup_detalle?.descripcion || '—'}</td>
                  <td className="px-3 py-2.5 text-foreground">{m.responsable_detalle?.nombre || '—'}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-semibold ${m.estado_detalle?.nombre === 'Abierto' ? 'text-primary' : 'text-safe'}`}>
                      {m.estado_detalle?.nombre || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                    {m.fecha_creacion || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                    {m.fecha_compromiso || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${badge.cls}`}>
                      <Clock size={10} />
                      {badge.label}{dias !== null ? ` (${dias}d)` : ''}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onComment(m)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Comentarios">
                        <MessageSquare size={14} />
                      </button>
                      <button onClick={() => onEdit(m)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => onDelete(m)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkupTable;
