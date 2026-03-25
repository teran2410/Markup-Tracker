// components/stats/StatCard.jsx

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';

const StatCard = ({ label, value, trend, icon, variant = 'default', isActive, onClick }) => {
  const variants = {
    default: { 
      iconBg: 'bg-primary/10', 
      iconColor: 'text-primary',
      activeBg: 'ring-2 ring-primary shadow-lg shadow-primary/20',
      hoverBg: 'hover:shadow-lg hover:shadow-primary/10'
    },
    safe: { 
      iconBg: 'bg-safe/10', 
      iconColor: 'text-safe',
      activeBg: 'ring-2 ring-safe shadow-lg shadow-safe/20',
      hoverBg: 'hover:shadow-lg hover:shadow-safe/10'
    },
    warning: { 
      iconBg: 'bg-warning/10', 
      iconColor: 'text-warning',
      activeBg: 'ring-2 ring-warning shadow-lg shadow-warning/20',
      hoverBg: 'hover:shadow-lg hover:shadow-warning/10'
    },
    urgent: { 
      iconBg: 'bg-urgent/10', 
      iconColor: 'text-urgent',
      activeBg: 'ring-2 ring-urgent shadow-lg shadow-urgent/20',
      hoverBg: 'hover:shadow-lg hover:shadow-urgent/10'
    },
  };
  
  const style = variants[variant];
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? 'text-safe' : trend.direction === 'down' ? 'text-urgent' : 'text-muted-foreground';

  return (
    <button
      onClick={onClick}
      className={`group relative bg-card border border-border rounded-xl p-5 transition-all duration-300 text-left w-full
        ${isActive ? style.activeBg : `${style.hoverBg} hover:border-primary/30`}
        ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
    >
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${style.iconBg}`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${style.iconBg} ${style.iconColor}`}>
            {icon}
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 border border-border/50 ${trendColor}`}>
            <TrendIcon size={12} />
            <span className="text-[10px] font-bold">{trend.value}%</span>
          </div>
        </div>
        
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </p>
        
        <p className={`text-3xl font-bold text-foreground tabular-nums transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          {value}
        </p>

        <div className="mt-3 h-8 flex items-end gap-0.5">
          {[...Array(12)].map((_, i) => {
            const height = Math.random() * 100;
            return (
              <div 
                key={i}
                className={`flex-1 rounded-t transition-all duration-300 ${style.iconBg} ${style.iconColor} opacity-30 group-hover:opacity-60`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {isActive && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Filter size={12} className="text-primary-foreground" />
          </div>
        )}
      </div>
    </button>
  );
};

export default StatCard;