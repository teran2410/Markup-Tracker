// src/components/Sidebar.jsx
import { LayoutDashboard, FileText, CheckCircle, BarChart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex h-full min-w-[280px] flex-col justify-between bg-white border-r border-border-dark p-6 hidden lg:flex">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary/20 p-2 rounded-xl">
            <FileText className="text-primary" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-800 text-lg font-bold tracking-tight">Markup Tracker</h1>
            <p className="text-text-secondary text-xs uppercase font-black tracking-widest">Navico Engineering</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<FileText size={20}/>} label="Markups" />
          <NavItem icon={<CheckCircle size={20}/>} label="Auditoría" />
          <NavItem icon={<BarChart size={20}/>} label="Reportes" />
          <NavItem icon={<Settings size={20}/>} label="Configuración" />
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-px w-full bg-border-dark"></div>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold">
            OT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Oscar Teran</span>
            <span className="text-[10px] text-text-secondary uppercase">Technical Developer</span>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all group">
          <LogOut size={18} />
          <p className="text-sm font-medium">Cerrar Sesión</p>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <a className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`} href="#">
    {icon}
    <p className="text-sm font-semibold">{label}</p>
  </a>
);

export default Sidebar;