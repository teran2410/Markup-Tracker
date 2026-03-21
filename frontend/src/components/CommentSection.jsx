import { useState } from 'react';
import api from '../services/api';

function CommentSection({ markupId, initialComments, onCommentAdded }) {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setEnviando(true);
    try {
      await api.post('comentarios/', {
        contenido: nuevoComentario,
        markup: markupId,
        empleado: 1 // TODO: Cambiar por el ID del usuario logueado después
      });
      setNuevoComentario('');
      onCommentAdded(); // Refrescamos la lista principal
    } catch (err) {
      alert("Error al comentar: " + JSON.stringify(err.response?.data));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-2 border-l-4 border-blue-500">
      <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Historial de Comentarios</h4>
      
      <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
        {initialComments.length > 0 ? (
          initialComments.map((c) => (
            <div key={c.id} className="bg-white p-2 rounded shadow-sm border border-gray-100">
              <p className="text-sm text-gray-800">{c.contenido}</p>
              <span className="text-[10px] text-gray-400 font-mono">
                {new Date(c.fecha_creacion).toLocaleDateString()} - {c.empleado_detalle?.nombre}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">No hay comentarios aún.</p>
        )}
      </div>

      <form onSubmit={handlePostComment} className="flex gap-2">
        <input 
          className="flex-1 border rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Escribe una actualización..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <button 
          disabled={enviando}
          className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-blue-700 disabled:bg-gray-300"
        >
          {enviando ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;