import { useEffect, useState, useCallback } from 'react';
import { markupService, coreService } from './services/api';
import Sidebar from './components/Sidebar';
import MarkupFormModal from './components/MarkupFormModal';
import EditMarkupModal from './components/EditMarkupModal';
import MarkupCard from './components/MarkupCard';
import { Search, Plus, Zap, Clock, Filter } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const getEstadoEstilo = (nombre) => {
  const base = "px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ";
  switch (nombre?.toLowerCase()) {
    case 'abierto': return base + "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case 'en proceso': return base + "bg-warning/10 text-warning border-warning/20";
    case 'finalizado': return base + "bg-safe/10 text-safe border-safe/20";
    case 'urgente': return base + "bg-urgent/10 text-urgent border-urgent/20";
    default: return base + "bg-slate-800 text-slate-400 border-slate-700";
  }
};

function App() {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [options, setOptions] = useState({ estados: [], tipos: [] });
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [resEst, resTip] = await Promise.all([
          coreService.getEstados(),
          coreService.getTipos()
        ]);
        setOptions({ 
          estados: resEst.data.results || resEst.data,
          tipos: resTip.data.results || resTip.data 
        });
      } catch (err) { console.error(err); }
    };
    loadOptions();
    fetchMarkups();
  }, []);

  return (
    <div className="flex h-screen w-full bg-background-dark text-slate-50 font-sans overflow-hidden">
      <Toaster position="top-right" richColors theme="dark" />
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-dark/50">
        <header className="flex items-center justify-between px-8 py-6 border-b border-border-dark bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">MarkUp Tracker</h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Navico Engineering Group</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por P/N..." 
                className="bg-slate-900 border border-border-dark rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none w-72 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchMarkups(e.target.value);
                }}
              />
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="bg-primary hover:bg-primary-hover text-background-dark px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Nuevo Registro
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-20">
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Registros" value={markups.length} icon={<Zap size={18}/>} color="text-primary" />
            <StatCard label="Abiertos" value={markups.filter(m => m.estado_detalle?.nombre === 'Abierto').length} icon={<Clock size={18}/>} color="text-sky-400" />
            <StatCard label="En Proceso" value={markups.filter(m => m.estado_detalle?.nombre === 'En Proceso').length} icon={<Filter size={18}/>} color="text-warning" />
            <StatCard label="Completados" value={markups.filter(m => m.estado_detalle?.nombre === 'Finalizado').length} icon={<Zap size={18}/>} color="text-safe" />
          </section>

          {/* CONTENEDOR DE GRIDS CORREGIDO */}
          {loading && markups.length === 0 ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sincronizando Base de Datos...</p>
            </div>
          ) : markups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {markups.map((m) => (
                <MarkupCard 
                  key={m.id} 
                  markup={m} 
                  onClick={(item) => {
                    setEditingMarkup(item);
                    setIsModalOpen(true);
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 bg-surface-dark border border-border-dark rounded-2xl">
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
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-slate-600 transition-all shadow-lg group">
    <div className={`p-2.5 w-fit rounded-xl bg-slate-950 border border-border-dark mb-4 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

export default App;