import { useEffect, useState, useCallback } from 'react';
import { markupService, coreService } from './services/api'; // Añadí coreService para los estados
import MarkupForm from './components/MarkupForm';
import CommentSection from './components/CommentSection';
import EditMarkupModal from './components/EditMarkupModal'; // El nuevo componente
import { Pencil, MessageSquare } from 'lucide-react';

function App() {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState({ estados: [] });

  const fetchMarkups = useCallback(async () => {
    try {
      const res = await markupService.getAll();
      setMarkups(res.data.results || res.data);
    } catch (err) {
      console.error("Error cargando tabla:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargamos los estados para que el Modal de edición tenga las opciones
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await coreService.getEstados();
        setOptions({ estados: res.data.results || res.data });
      } catch (err) {
        console.error("Error cargando estados:", err);
      }
    };
    loadData();
    fetchMarkups();
  }, [fetchMarkups]);

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (markup) => {
    // Oscar, aquí simulamos que tu ID de usuario es 1
    const USUARIO_ACTUAL_ID = 1; 
    
    // IMPORTANTE: Comparamos contra el ID numérico del responsable
    if (markup.responsable !== USUARIO_ACTUAL_ID) {
      alert(`⚠️ Acceso Denegado: Solo el responsable (${markup.responsable_detalle?.nombre}) puede editar este registro.`);
      return;
    }
  
    setEditingMarkup(markup);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">MarkUp Tracker</h1>
          <p className="text-gray-500 text-lg">Sistema de Control de Cambios de Ingeniería</p>
        </header>

        <MarkupForm onMarkupCreated={fetchMarkups} />

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse font-medium">
              Sincronizando con el servidor de Navico...
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">N° Parte / Edición</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rev</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Responsable</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Comentarios</th>
                </tr>
              </thead>
              
              {markups.map((m) => (
                <tbody key={m.id} className="divide-y divide-gray-100 border-b last:border-b-0">
                  <tr 
                    onClick={() => toggleRow(m.id)}
                    className={`cursor-pointer transition-colors ${expandedId === m.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(m);
                          }}
                          className="p-2 bg-white border border-gray-200 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm"
                          title="Editar Registro"
                        >
                          <Pencil size={14} />
                        </button>
                        <span>{m.numero_parte}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono font-medium">{m.nueva_revision}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800">{m.responsable_detalle?.nombre}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{m.responsable_detalle?.area_detalle?.acronimo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-[11px] font-black rounded-full bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                        {m.estado_detalle?.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                        <MessageSquare size={14} />
                        {m.comentarios?.length || 0}
                      </span>
                    </td>
                  </tr>

                  {expandedId === m.id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50/50">
                        <CommentSection 
                          markupId={m.id} 
                          initialComments={m.comentarios || []} 
                          onCommentAdded={fetchMarkups} 
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
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

export default App;