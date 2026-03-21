import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { markupService } from '../services/api';
import { toast } from 'sonner';

const MarkupFormModal = ({ isOpen, onClose, onMarkupCreated, options }) => {
  const OSCAR_ID = 1;

  const [formData, setFormData] = useState({
    numero_parte: '',
    nueva_revision: '',
    descripcion: '',
    responsable: OSCAR_ID,
    tipo_markup: '',
    fecha_compromiso: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, responsable: OSCAR_ID }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Cerramos el modal inmediatamente para dar sensación de velocidad
    onClose();

    try {
      const payload = {
        ...formData,
        estado: 1,
        responsable: parseInt(formData.responsable),
        tipo_markup: parseInt(formData.tipo_markup)
      };

      // 2. Ejecutamos la creación
      await markupService.create(payload);
      
      // 3. Notificamos al padre para que refresque la lista (onMarkupCreated)
      onMarkupCreated(); 
      
      toast.success("Markup registrado exitosamente");
      
      // Limpiamos el form para la próxima vez
      setFormData({
        numero_parte: '',
        nueva_revision: '',
        descripcion: '',
        responsable: OSCAR_ID,
        tipo_markup: '',
        fecha_compromiso: ''
      });
    } catch (err) {
      console.error("Error:", err.response?.data);
      toast.error("Error al sincronizar. Revisa los datos.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-surface-dark border border-border-dark w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-dark bg-surface-light/20">
          <div>
            <h3 className="text-xl font-bold text-white uppercase italic">Nuevo Registro Técnico</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Navico Engineering</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-secondary ml-1">P/N Target</label>
              <input type="text" required className="w-full bg-surface-light/30 border border-border-dark rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary" value={formData.numero_parte} onChange={(e) => setFormData({...formData, numero_parte: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-secondary ml-1">Next Revision</label>
              <input type="text" required className="w-full bg-surface-light/30 border border-border-dark rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary" value={formData.nueva_revision} onChange={(e) => setFormData({...formData, nueva_revision: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-secondary ml-1">Tipo de Markup</label>
              <select 
                required
                className="w-full bg-surface-light/30 border border-border-dark rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary"
                value={formData.tipo_markup}
                onChange={(e) => setFormData({...formData, tipo_markup: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {/* CORRECCIÓN: Usando t.descripcion en lugar de t.nombre */}
                {options.tipos?.map(t => (
                  <option key={t.id} value={t.id} className="bg-surface-dark">{t.descripcion}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-secondary ml-1">Fecha Compromiso</label>
              <input type="date" required className="w-full bg-surface-light/30 border border-border-dark rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary" value={formData.fecha_compromiso} onChange={(e) => setFormData({...formData, fecha_compromiso: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-text-secondary ml-1">Responsable</label>
            <div className="w-full bg-surface-light/10 border border-border-dark/50 rounded-xl px-4 py-2.5 text-primary font-bold text-sm">
              Oscar Teran (ID: {OSCAR_ID})
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-text-secondary ml-1">Descripción</label>
            <textarea rows="3" required className="w-full bg-surface-light/30 border border-border-dark rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary resize-none" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-text-secondary font-bold text-sm">Cancelar</button>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-background-dark px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(97,237,220,0.3)] transition-all">
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkupFormModal;