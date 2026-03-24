import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { commentService } from '../services/api';
import { toast } from 'sonner';

const CommentDrawer = ({ markup, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && markup) {
      fetchComments();
    }
  }, [isOpen, markup?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await commentService.getByMarkup(markup.id);
      setComments(res.data.results || res.data);
    } catch {
      toast.error('Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await commentService.create({
        contenido: newComment,
        markup: markup.id,
        empleado: 1, // TODO: usuario logueado
      });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch {
      toast.error('Error al enviar comentario');
    } finally {
      setSending(false);
    }
  };

  const getIniciales = (nombre) => {
    if (!nombre) return '??';
    const words = nombre.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Comentarios</h3>
            <p className="text-xs text-slate-400 font-mono">#{markup.id} - {markup.numero_parte}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {getIniciales(c.empleado_detalle?.nombre)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      {c.empleado_detalle?.nombre || 'Usuario'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(c.fecha_creacion)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed bg-slate-50 rounded-xl rounded-tl-none px-3 py-2 border border-slate-100">
                    {c.contenido}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-sm">No hay comentarios aún</p>
              <p className="text-xs mt-1">Sé el primero en comentar</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <button
              type="submit"
              disabled={sending || !newComment.trim()}
              className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentDrawer;
