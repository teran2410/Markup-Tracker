// src/components/Sidebar.jsx
import { LayoutDashboard, FileText, CheckCircle, BarChart3, Settings, LogOut, ChevronRight, Table2, Plus } from 'lucide-react';

const NavItem = ({ icon, label, active = false, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`transition-colors ${active ? 'text-primary' : ''}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
        {badge}
      </span>
    )}
    {active && <ChevronRight size={16} className="text-primary" />}
  </button>
);

const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-full w-64 flex-col justify-between bg-sidebar border-r border-sidebar-border p-4">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center px-3 py-2">
            <img src="/src/assets/logo-navico-white.png" alt="Navico Group" className="h-15 object-contain" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
            <NavItem icon={<FileText size={18} />} label="Markups" active={currentView === 'markups'} onClick={() => onViewChange('markups')} />
            <NavItem icon={<CheckCircle size={18} />} label="Auditoría" />
            <NavItem icon={<Settings size={18} />} label="Configuración" />
          </nav>
        </div>

        {/* User section */}
        <div className="flex flex-col gap-2">
          <div className="h-px w-full bg-border" />

          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-xs font-bold text-white">
              OT
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">Oscar Teran</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Technical Developer
              </span>
            </div>
          </div>

          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-sm safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <MobileNavBtn icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
          <MobileNavBtn icon={<FileText size={20} />} label="Markups" active={currentView === 'markups'} onClick={() => onViewChange('markups')} />
          <MobileNavBtn icon={<Settings size={20} />} label="Config" />
        </div>
      </nav>
    </>
  );
};

const MobileNavBtn = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors min-w-[60px] ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`}
  >
    {icon}
    <span className="text-[9px] font-semibold">{label}</span>
  </button>
);

export default Sidebar;