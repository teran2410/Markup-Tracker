// components/layout/Header.jsx

import { BarChart3, Bell, Download, Plus } from 'lucide-react';
import { Filter, XCircle } from 'lucide-react';

const Header = ({ stats, activeStatFilter, onClearFilter, onNewMarkup }) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-background via-background to-primary/5 border-b border-border backdrop-blur-sm">
      <div className="px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                MarkUp Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Control de Cambios de Ingeniería
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-lg bg-card border border-border hover:bg-secondary transition-colors group">
              <Bell size={18} className="text-muted-foreground group-hover:text-foreground" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-urgent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {stats.urgentes + stats.vencidos}
              </span>
            </button>

            <button className="p-2.5 rounded-lg bg-card border border-border hover:bg-secondary transition-colors group">
              <Download size={18} className="text-muted-foreground group-hover:text-foreground" />
            </button>

            <button
              onClick={onNewMarkup}
              className="h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              <Plus size={18} /> Nuevo Markup
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Última actualización: Ahora</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total de registros:</span>
            <span className="font-bold text-foreground tabular-nums">{stats.total}</span>
          </div>
          {activeStatFilter && (
            <>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Filter size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Filtro activo: {activeStatFilter === 'aTiempo' ? 'A Tiempo' : activeStatFilter === 'urgentes' ? 'Urgentes' : 'Vencidos'}
                </span>
                <button onClick={onClearFilter} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                  <XCircle size={12} className="text-primary" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;