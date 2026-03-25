// hooks/useMarkups.js

import { useState, useCallback, useEffect } from 'react';
import { markupService, coreService } from '../services/api';
import { toast } from 'sonner';

export const useMarkups = () => {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ estados: [], tipos: [], empleados: [] });

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
      } catch (err) { 
        console.error(err); 
      }
    };
    loadOptions();
    fetchMarkups();
  }, []);

  return {
    markups,
    loading,
    options,
    fetchMarkups,
    handleMarkupCreated,
    handleDelete
  };
};