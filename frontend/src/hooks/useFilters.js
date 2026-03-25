// hooks/useFilters.js

import { useState, useMemo } from 'react';

const calcDiasRestantes = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

export const useFilters = (markups) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterResponsable, setFilterResponsable] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeStatFilter, setActiveStatFilter] = useState(null);

  const filteredMarkups = useMemo(() => {
    let filtered = markups;

    // Filtro por stat card
    if (activeStatFilter === 'aTiempo') {
      filtered = filtered.filter(m => {
        const d = calcDiasRestantes(m.fecha_compromiso);
        return d !== null && d >= 4;
      });
    } else if (activeStatFilter === 'urgentes') {
      filtered = filtered.filter(m => {
        const d = calcDiasRestantes(m.fecha_compromiso);
        return d !== null && d >= 1 && d <= 3;
      });
    } else if (activeStatFilter === 'vencidos') {
      filtered = filtered.filter(m => {
        const d = calcDiasRestantes(m.fecha_compromiso);
        return d !== null && d <= 0;
      });
    }

    // Filtros normales
    if (filterEstado) filtered = filtered.filter(m => String(m.estado) === filterEstado);
    if (filterResponsable) filtered = filtered.filter(m => String(m.responsable) === filterResponsable);
    if (filterTipo) filtered = filtered.filter(m => String(m.tipo_markup) === filterTipo);

    // Filtro por rango de fechas
    if (dateFrom) filtered = filtered.filter(m => m.fecha_compromiso && m.fecha_compromiso >= dateFrom);
    if (dateTo) filtered = filtered.filter(m => m.fecha_compromiso && m.fecha_compromiso <= dateTo);

    // Búsqueda textual local
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        (m.numero_parte || '').toLowerCase().includes(q) ||
        (m.descripcion || '').toLowerCase().includes(q) ||
        (m.responsable_detalle?.nombre || '').toLowerCase().includes(q) ||
        String(m.id).includes(q)
      );
    }

    return filtered;
  }, [markups, searchQuery, filterEstado, filterResponsable, filterTipo, dateFrom, dateTo, activeStatFilter]);

  const clearAll = () => {
    setSearchQuery('');
    setFilterEstado('');
    setFilterResponsable('');
    setFilterTipo('');
    setDateFrom('');
    setDateTo('');
    setActiveStatFilter(null);
  };

  return {
    searchQuery, setSearchQuery,
    filterEstado, setFilterEstado,
    filterResponsable, setFilterResponsable,
    filterTipo, setFilterTipo,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    activeStatFilter, setActiveStatFilter,
    filteredMarkups,
    clearAll,
  };
};