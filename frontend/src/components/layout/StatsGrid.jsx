// components/layout/StatsGrid.jsx

import { Zap, Clock, AlertTriangle, XCircle } from 'lucide-react';
import StatCard from '../stats/StatCard';

const StatsGrid = ({ stats, trends, activeFilter, onFilterChange }) => {
  const handleStatClick = (filterType) => {
    onFilterChange(activeFilter === filterType ? null : filterType);
  };

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total Registros" 
        value={stats.total} 
        trend={trends.total}
        icon={<Zap size={18} />} 
        variant="default"
        isActive={activeFilter === 'total'}
        onClick={() => handleStatClick('total')}
      />
      <StatCard 
        label="A Tiempo" 
        value={stats.aTiempo} 
        trend={trends.aTiempo}
        icon={<Clock size={18} />} 
        variant="safe"
        isActive={activeFilter === 'aTiempo'}
        onClick={() => handleStatClick('aTiempo')}
      />
      <StatCard 
        label="Urgentes" 
        value={stats.urgentes} 
        trend={trends.urgentes}
        icon={<AlertTriangle size={18} />} 
        variant="warning"
        isActive={activeFilter === 'urgentes'}
        onClick={() => handleStatClick('urgentes')}
      />
      <StatCard 
        label="Vencidos" 
        value={stats.vencidos} 
        trend={trends.vencidos}
        icon={<XCircle size={18} />} 
        variant="urgent"
        isActive={activeFilter === 'vencidos'}
        onClick={() => handleStatClick('vencidos')}
      />
    </section>
  );
};

export default StatsGrid;