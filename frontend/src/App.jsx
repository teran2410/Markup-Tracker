import { useEffect, useState, useCallback } from 'react';
import { markupService, coreService } from './services/api';
import Sidebar from './components/Sidebar';
import MarkupFormModal from './components/MarkupFormModal';
import EditMarkupModal from './components/EditMarkupModal';
import { MessageSquare, Search, Plus, Zap, Clock } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const getEstadoEstilo = (nombre) => {
  const base = "px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ";
  switch (nombre?.toLowerCase()) {
    case 'abierto': return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case 'en proceso': return base + "bg-warning/10 text-warning border-warning/20";
    case 'finalizado': return base + "bg-safe/10 text-safe border-safe/20";
    default: return base + "bg-surface-light text-text-secondary border-border-dark";
  }
};

function App() {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [options, setOptions] = useState({ estados: [], tipos: [] });

  const fetchMarkups = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await markupService.getAll(query);
      setMarkups(res.data.results || res.data);
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [resEst, resTip] = await Promise.all([
          coreService.getEstados(),
          coreService.getTipos() // Asegúrate de tener este método en api.js
        ]);
        setOptions({ 
          estados: resEst.data.results || resEst.data,
          tipos: resTip.data.results || resTip.data 
        });
      } catch (err) { console.error(err); }
    };
    loadOptions();
    fetchMarkups();
  }, [fetchMarkups]);

  return (
    <div className="flex h-screen w-full bg-background-dark text-white font-sans overflow-hidden">
      <Toaster position="top-right" richColors theme="dark" />
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-surface-dark/40">
        <header className="flex items-center justify-between px-8 py-6 border-b border-border-dark bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">MarkUp Tracker</h2>
            <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Navico Engineering</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input type="text" placeholder="Buscar P/N..." className="bg-surface-light/30 border border-border-dark rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none w-64" onChange={(e) => fetchMarkups(e.target.value)} />
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary text-background-dark px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(97,237,220,0.3)]">
              <Plus size={18} /> Nuevo Registro
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-20">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard label="Total Markups" value={markups.length} icon={<Zap size={18}/>} color="text-primary" />
            <StatCard label="Abiertos" value={markups.filter(m => m.estado_detalle?.nombre === 'Abierto').length} icon={<Clock size={18}/>} color="text-blue-400" />
          </section>

          <div className="bg-surface-light/10 border border-border-dark rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-light/40 text-text-secondary text-[10px] font-black uppercase tracking-widest border-b border-border-dark">
                <tr>
                  <th className="px-6 py-4">N° Parte / Rev</th>
                  <th className="px-6 py-4">Responsable</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/30">
                {markups.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => {setEditingMarkup(m); setIsModalOpen(true);}}>
                    <td className="px-6 py-4 font-bold text-sm">{m.numero_parte} <span className="text-primary/50 text-xs ml-2">{m.nueva_revision}</span></td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{m.responsable_detalle?.nombre}</td>
                    <td className="px-6 py-4"><span className={getEstadoEstilo(m.estado_detalle?.nombre)}>{m.estado_detalle?.nombre}</span></td>
                    <td className="px-6 py-4 text-center text-text-secondary"><MessageSquare size={16} className="mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="p-10 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.3em]">Cargando...</div>}
          </div>
        </div>
      </main>

      <MarkupFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onMarkupCreated={fetchMarkups} options={options} />
      
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
  <div className="bg-surface-light/20 border border-border-dark rounded-2xl p-5 hover:border-primary/20 transition-all">
    <div className={`p-2 w-fit rounded-xl bg-surface-dark mb-4 ${color}`}>{icon}</div>
    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
  </div>
);

export default App;