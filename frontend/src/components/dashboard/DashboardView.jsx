// components/dashboard/DashboardView.jsx
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

const calcDias = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

const COLORS = {
  safe: '#22c55e',
  warning: '#f59e0b',
  urgent: '#ef4444',
  primary: '#3b82f6',
  muted: '#64748b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const DashboardView = ({ markups, options }) => {
  // --- Timeline: markups por mes de fecha_compromiso ---
  const timelineMap = {};
  markups.forEach(m => {
    if (!m.fecha_compromiso) return;
    const month = m.fecha_compromiso.slice(0, 7); // YYYY-MM
    timelineMap[month] = (timelineMap[month] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      name: new Date(month + '-01').toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
      total: count,
    }));

  // --- Distribución por tipo ---
  const tipoMap = {};
  markups.forEach(m => {
    const tipo = m.tipo_markup_detalle?.descripcion || 'Sin tipo';
    tipoMap[tipo] = (tipoMap[tipo] || 0) + 1;
  });
  const tipoData = Object.entries(tipoMap).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  // --- Performance por responsable ---
  const respMap = {};
  markups.forEach(m => {
    const name = m.responsable_detalle?.nombre || 'Sin asignar';
    if (!respMap[name]) respMap[name] = { name, total: 0, aTiempo: 0, vencidos: 0 };
    respMap[name].total++;
    const d = calcDias(m.fecha_compromiso);
    if (d !== null && d >= 1) respMap[name].aTiempo++;
    if (d !== null && d <= 0) respMap[name].vencidos++;
  });
  const respData = Object.values(respMap);

  // --- Status distribution ---
  const statusMap = {};
  markups.forEach(m => {
    const est = m.estado_detalle?.nombre || 'Sin estado';
    statusMap[est] = (statusMap[est] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-foreground">Analytics Dashboard</h2>
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-2 py-1 bg-secondary rounded-full">
          {markups.length} registros
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-4">
            Timeline de Markups
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.muted }} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke={COLORS.primary} fill="url(#colorTotal)" strokeWidth={2} name="Markups" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Tipo */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-4">
            Distribución por Tipo
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tipoData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--card))">
                  {tipoData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance por Responsable */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-4">
            Performance por Responsable
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={respData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.muted }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: COLORS.muted }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="aTiempo" fill={COLORS.safe} name="A Tiempo" radius={[0, 4, 4, 0]} />
                <Bar dataKey="vencidos" fill={COLORS.urgent} name="Vencidos" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estado actual */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-4">
            Estado Actual
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.muted }} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Cantidad" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.name === 'Abierto' ? COLORS.primary : COLORS.safe} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
