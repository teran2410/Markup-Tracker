import { useState, useEffect } from 'react';
import { markupService } from '../services/api';
import { Toaster, toast } from 'sonner';

function EditMarkupModal({ markup, isOpen, onClose, onUpdate, options }) {
  const [formData, setFormData] = useState(markup);

  useEffect(() => {
    setFormData(markup); // Sincronizar cuando cambie el markup seleccionado
  }, [markup]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1. Guardamos la respuesta del servidor (el objeto actualizado)
    const response = await markupService.update(markup.id, formData);
    
    // 2. Le pasamos ese objeto específico a la función onUpdate
    // Django nos devuelve el registro completo con sus detalles
    onUpdate(response.data); 
    
    onClose();
  } catch (err) {
    toast.error("Error al actualizar en el servidor");
    console.error(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold">Editar Markup: #{markup.id} - {markup.numero_parte}</h3>
          <button onClick={onClose} className="hover:text-gray-300">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Estado del Proceso</label>
            <select 
              className="w-full border p-2 rounded mt-1"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
            >
              {options.estados.map(est => <option key={est.id} value={est.id}>{est.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Descripción / Justificación</label>
            <textarea 
              className="w-full border p-2 rounded mt-1 h-32"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMarkupModal;