// App.jsx

import { useEffect, useState, useCallback } from 'react';
import { markupService, coreService } from './services/api';
import Sidebar from './components/Sidebar';
import MarkupFormModal from './components/MarkupFormModal';
import EditMarkupModal from './components/EditMarkupModal';
import CommentDrawer from './components/CommentDrawer';
import MarkupCard from './components/MarkupCard';
import { Search, Plus, Zap, Clock, Filter, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const calcDiasRestantes = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

function App() {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [options, setOptions] = useState({ estados: [], tipos: [], empleados: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterResponsable, setFilterResponsable] = useState('');
  const [commentMarkup, setCommentMarkup] = useState(null);

  const fetchMarkups = useCallback(async (query = '') => {
    if (markups.length === 0) setLoading(true);
    try {
      const res = await markupService.getAll(query);
      const data = res.data.results || res.data;
      setMarkups(data);
    } catch (err) {
      toast.error("Error al sincronizar con el servidor");
    } finally {
      setLoading(false);
    }
  }, [markups.length]);

  const handleMarkupCreated = (newMarkup) => {
    if (newMarkup && newMarkup.numero_parte) {
      setMarkups(prev => [newMarkup, ...prev]);
    } else {
      fetchMarkups(searchQuery);
    }
  };

  const handleDelete = async (markup) => {
    if (!confirm(`¿Eliminar markup #${markup.id} - ${markup.numero_parte}?`)) return;
    try {
      await markupService.delete(markup.id);
      setMarkups(prev => prev.filter(m => m.id !== markup.id));
      toast.success('Markup eliminado correctamente');
    } catch (err) {
      toast.error('Error al eliminar el markup');
    }
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [resEst, resTip, resEmp] = await Promise.all([
          coreService.getEstados(),
          coreService.getTipos(),
          coreService.getEmpleados()
        ]);
        setOptions({ 
          estados: resEst.data.results || resEst.data,
          tipos: resTip.data.results || resTip.data,
          empleados: resEmp.data.results || resEmp.data
        });
      } catch (err) { console.error(err); }
    };
    loadOptions();
    fetchMarkups();
  }, []);

  return (
    <div className="flex h-screen w-full bg-background-dark text-slate-800 font-sans overflow-hidden">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-6 pb-20">
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Registros" value={markups.length} icon={<Zap size={18}/>} color="text-primary" />
            <StatCard label="A Tiempo" value={markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d >= 4; }).length} icon={<Clock size={18}/>} color="text-safe" />
            <StatCard label="Urgentes" value={markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d >= 1 && d <= 3; }).length} icon={<Filter size={18}/>} color="text-warning" />
            <StatCard label="Vencidos" value={markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d <= 0; }).length} icon={<Zap size={18}/>} color="text-urgent" />
          </section>

          {/* Barra de filtros */}
          <div className="flex items-center gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Número de parte..." 
                className="w-full bg-white border border-border-dark rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-800 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="bg-white border border-border-dark rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-1 focus:ring-primary outline-none transition-all min-w-[180px]"
            >
              <option value="">Todos los estados</option>
              {options.estados.map(est => (
                <option key={est.id} value={est.id}>{est.nombre}</option>
              ))}
            </select>
            <select
              value={filterResponsable}
              onChange={(e) => setFilterResponsable(e.target.value)}
              className="bg-white border border-border-dark rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-1 focus:ring-primary outline-none transition-all min-w-[180px]"
            >
              <option value="">Todos los técnicos</option>
              {options.empleados.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
              ))}
            </select>
            <button 
              onClick={() => fetchMarkups(searchQuery)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Search size={16} /> Buscar
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm whitespace-nowrap ml-auto"
            >
              <Plus size={18} /> Nuevo Registro
            </button>
          </div>

          {/* Grid de Markups */}
          {loading && markups.length === 0 ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sincronizando Base de Datos...</p>
            </div>
          ) : markups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {markups
                .filter(m => !filterEstado || String(m.estado) === filterEstado)
                .filter(m => !filterResponsable || String(m.responsable) === filterResponsable)
                .map((m) => (
                <MarkupCard 
                  key={m.id} 
                  markup={m} 
                  onEdit={(item) => {
                    setEditingMarkup(item);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onComment={(item) => setCommentMarkup(item)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 bg-white border border-border-dark rounded-2xl">
              <p className="text-sm italic">No se encontraron registros para "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      <MarkupFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onMarkupCreated={handleMarkupCreated} options={options} />
      
      {isModalOpen && (
        <EditMarkupModal 
          markup={editingMarkup} 
          isOpen={isModalOpen} 
          options={options}
          onClose={() => setIsModalOpen(false)} 
          onUpdate={fetchMarkups} 
        />
      )}

      <CommentDrawer
        markup={commentMarkup}
        isOpen={!!commentMarkup}
        onClose={() => setCommentMarkup(null)}
      />
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white border border-border-dark rounded-2xl p-6 hover:border-slate-300 transition-all shadow-sm group">
    <div className={`p-2.5 w-fit rounded-xl bg-slate-50 border border-border-dark mb-4 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default App;