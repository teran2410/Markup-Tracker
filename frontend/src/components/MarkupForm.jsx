import { useState, useEffect } from 'react';
import { coreService, markupService } from '../services/api';

function MarkupForm({ onMarkupCreated }) {
  const initialState = {
    numero_parte: '',
    descripcion: '',
    nueva_revision: '',
    responsable: '',
    estado: '',
    tipo_markup: '',
    fecha_compromiso: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [options, setOptions] = useState({ empleados: [], estados: [], tipos: [] });

  useEffect(() => {
  const loadOptions = async () => {
    try {
      const [emp, est, tip] = await Promise.all([
        coreService.getEmpleados(),
        coreService.getEstados(),
        coreService.getTipos()
      ]);

      setOptions({
        // Usamos .results porque la API está paginada
        empleados: emp.data.results || emp.data,
        estados: est.data.results || est.data,
        tipos: tip.data.results || tip.data
      });
    } catch (err) {
      console.error("Error cargando catálogos:", err);
    }
  };
  loadOptions();
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Creamos una copia de los datos y convertimos los IDs a números
  const dataToSend = {
    ...formData,
    responsable: parseInt(formData.responsable),
    estado: parseInt(formData.estado),
    tipo_markup: parseInt(formData.tipo_markup),
  };

  try {
    await markupService.create(dataToSend); // Enviamos la copia limpia
    setFormData(initialState);
    alert("¡Markup guardado exitosamente!");
    onMarkupCreated();
  } catch (err) {
    const errorMsg = err.response?.data 
      ? JSON.stringify(err.response.data) 
      : "Error de conexión";
    alert("Error al guardar: " + errorMsg);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
      <h2 className="col-span-full text-xl font-bold text-gray-700 mb-2">Nuevo Registro de Markup</h2>
      
      <input name="numero_parte" value={formData.numero_parte} onChange={handleChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="N° de Parte" required />
      
      <input name="nueva_revision" value={formData.nueva_revision} onChange={handleChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nueva Rev (Ej: A)" required />

      <select name="responsable" value={formData.responsable} onChange={handleChange}
        className="border p-2 rounded" required>
        <option value="">Responsable...</option>
        {options.empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
      </select>

      <select name="estado" value={formData.estado} onChange={handleChange}
        className="border p-2 rounded" required>
        <option value="">Estado Inicial...</option>
        {options.estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
      </select>

      <select name="tipo_markup" value={formData.tipo_markup} onChange={handleChange} 
        className="border p-2 rounded" required>
        <option value="">Seleccione Tipo...</option>
        {options.tipos.map(t => (<option key={t.id} value={t.id}>{t.descripcion}</option>))}
      </select>

      <input name="fecha_compromiso" type="date" value={formData.fecha_compromiso} onChange={handleChange}
        className="border p-2 rounded" required />

      <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}
        className="border p-2 rounded col-span-full h-24" placeholder="Justificación técnica del cambio..." required />

      <button type="submit" className="col-span-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
        Guardar Markup en Base de Datos
      </button>
    </form>
  );
}

export default MarkupForm;