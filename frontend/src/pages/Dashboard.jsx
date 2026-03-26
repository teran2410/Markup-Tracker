// Dashboard.jsx

import { useState } from 'react';
import { Search, LayoutGrid, Table2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import Sidebar from '../components/Sidebar';
import Header from '../components/layout/Header';
import StatsGrid from '../components/layout/StatsGrid';
import FilterBar from '../components/filters/FilterBar';
import AdvancedFilters from '../components/filters/AdvancedFilters';
import FilterTags from '../components/filters/FilterTags';
import MarkupFormModal from '../components/MarkupFormModal';
import EditMarkupModal from '../components/EditMarkupModal';
import CommentDrawer from '../components/CommentDrawer';
import MarkupCard from '../components/MarkupCard';
import MarkupTable from '../components/MarkupTable';
import BatchActions from '../components/BatchActions';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonCard';
import DashboardView from '../components/dashboard/DashboardView';

import { useMarkups } from '../hooks/useMarkups';
import { useFilters } from '../hooks/useFilters';
import { markupService } from '../services/api';

const calcDiasRestantes = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

function Dashboard() {
  const {
    markups,
    loading,
    options,
    fetchMarkups,
    handleMarkupCreated,
    handleDelete
  } = useMarkups();

  const {
    searchQuery, setSearchQuery,
    filterEstado, setFilterEstado,
    filterResponsable, setFilterResponsable,
    filterTipo, setFilterTipo,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    activeStatFilter, setActiveStatFilter,
    filteredMarkups,
    clearAll,
  } = useFilters(markups);

  // View state
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [commentMarkup, setCommentMarkup] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Stats
  const stats = {
    total: markups.length,
    aTiempo: markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d >= 4; }).length,
    urgentes: markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d >= 1 && d <= 3; }).length,
    vencidos: markups.filter(m => { const d = calcDiasRestantes(m.fecha_compromiso); return d !== null && d <= 0; }).length,
  };

  const trends = {
    total: { value: 12, direction: 'up' },
    aTiempo: { value: 8, direction: 'up' },
    urgentes: { value: 3, direction: 'down' },
    vencidos: { value: 2, direction: 'up' }
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelectedIds(prev => prev.length === filteredMarkups.length ? [] : filteredMarkups.map(m => m.id));
  };
  const handleDeleteSelected = async () => {
    if (!confirm(`¿Eliminar ${selectedIds.length} markup(s)?`)) return;
    for (const id of selectedIds) {
      try { await markupService.delete(id); } catch { /* skip */ }
    }
    setSelectedIds([]);
    fetchMarkups();
    toast.success(`${selectedIds.length} markup(s) eliminados`);
  };
  const handleChangeEstado = () => {
    toast.info('Función de cambio masivo de estado próximamente');
  };

  // Filter tags
  const getFilterTags = () => {
    const tags = [];
    if (filterEstado) {
      const est = options.estados.find(e => String(e.id) === filterEstado);
      tags.push({ key: 'estado', label: `Estado: ${est?.nombre || filterEstado}` });
    }
    if (filterResponsable) {
      const emp = options.empleados.find(e => String(e.id) === filterResponsable);
      tags.push({ key: 'responsable', label: `Resp: ${emp?.nombre || filterResponsable}` });
    }
    if (filterTipo) {
      const t = options.tipos.find(t => String(t.id) === filterTipo);
      tags.push({ key: 'tipo', label: `Tipo: ${t?.descripcion || filterTipo}` });
    }
    if (dateFrom) tags.push({ key: 'dateFrom', label: `Desde: ${dateFrom}` });
    if (dateTo) tags.push({ key: 'dateTo', label: `Hasta: ${dateTo}` });
    if (activeStatFilter) {
      const labels = { aTiempo: 'A Tiempo', urgentes: 'Urgentes', vencidos: 'Vencidos' };
      tags.push({ key: 'stat', label: labels[activeStatFilter] || activeStatFilter });
    }
    return tags;
  };

  const removeFilterTag = (key) => {
    if (key === 'estado') setFilterEstado('');
    else if (key === 'responsable') setFilterResponsable('');
    else if (key === 'tipo') setFilterTipo('');
    else if (key === 'dateFrom') setDateFrom('');
    else if (key === 'dateTo') setDateTo('');
    else if (key === 'stat') setActiveStatFilter(null);
  };

  // ---- Render views ----
  const renderMainContent = () => {
    if (currentView === 'dashboard') {
      return (
        <>
          <StatsGrid
            stats={stats}
            trends={trends}
            activeFilter={activeStatFilter}
            onFilterChange={setActiveStatFilter}
          />
          <DashboardView markups={markups} options={options} />
        </>
      );
    }

    // markups view
    return (
      <>
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterEstado={filterEstado}
          onEstadoChange={setFilterEstado}
          filterResponsable={filterResponsable}
          onResponsableChange={setFilterResponsable}
          onSearch={() => fetchMarkups(searchQuery)}
          options={options}
        />

        <AdvancedFilters
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          filterTipo={filterTipo} setFilterTipo={setFilterTipo}
          options={options}
          markups={filteredMarkups}
        />

        <FilterTags tags={getFilterTags()} onRemove={removeFilterTag} />

        {selectedIds.length > 0 && (
          <BatchActions
            count={selectedIds.length}
            onDeleteSelected={handleDeleteSelected}
            onChangeEstado={handleChangeEstado}
            onClear={() => setSelectedIds([])}
          />
        )}

        {/* View mode toggle */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
             
          </p>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              title="Vista de tarjetas"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              title="Vista de tabla"
            >
              <Table2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && markups.length === 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <SkeletonTable />
          )
        ) : filteredMarkups.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredMarkups.map((m) => (
                <MarkupCard
                  key={m.id}
                  markup={m}
                  onEdit={(item) => { setEditingMarkup(item); setIsModalOpen(true); }}
                  onDelete={handleDelete}
                  onComment={(item) => setCommentMarkup(item)}
                />
              ))}
            </div>
          ) : (
            <MarkupTable
              markups={filteredMarkups}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleAll={toggleAll}
              onEdit={(item) => { setEditingMarkup(item); setIsModalOpen(true); }}
              onDelete={handleDelete}
              onComment={(item) => setCommentMarkup(item)}
            />
          )
        ) : (
          <div className="py-20 text-center text-muted-foreground bg-card border border-border rounded-xl">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold mb-1">No se encontraron registros</p>
            <p className="text-xs text-muted-foreground mb-4">
              {getFilterTags().length > 0 ? 'Intenta cambiar los filtros activos' : 'Intenta ajustar tu búsqueda'}
            </p>
            {getFilterTags().length > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
                Limpiar todos los filtros
              </button>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
      <Toaster position="top-right" richColors />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-16 lg:pb-0">
        <div className="max-w-[1600px] mx-auto w-full">

          <Header
            stats={stats}
            activeStatFilter={activeStatFilter}
            onClearFilter={() => setActiveStatFilter(null)}
            onNewMarkup={() => setIsCreateModalOpen(true)}
          />

          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {renderMainContent()}
          </div>
        </div>
      </main>

      <MarkupFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMarkupCreated={handleMarkupCreated}
        options={options}
      />

      {isModalOpen && (
        <EditMarkupModal
          markup={editingMarkup}
          isOpen={isModalOpen}
          options={options}
          onClose={() => setIsModalOpen(false)}
          onUpdate={fetchMarkups}
        />
      )}

      <CommentDrawer
        markup={commentMarkup}
        isOpen={!!commentMarkup}
        onClose={() => setCommentMarkup(null)}
      />
    </div>
  );
}

export default Dashboard;
