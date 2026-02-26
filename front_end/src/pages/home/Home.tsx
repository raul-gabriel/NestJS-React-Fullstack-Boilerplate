import Tarjetas from "@/components/globales/Tarjetas";
import {
  ShoppingBag,
  CalendarDays,
  CalendarRange,
  Users,
  Package,
  TrendingDown,
  FileDown,
  Download,
  FileText,
  LayoutDashboard,
} from "lucide-react";


// ─── Home ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="pt-6">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">
          Panel de Control
        </p>
        <h1 className="text-2xl font-bold text-slate-800">Bienvenido</h1>
        <p className="text-sm text-slate-400 mt-0.5">Aquí tienes el resumen de tu negocio</p>
      </div>

      {/* ── Fila 1: Ventas ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-5">

        {/* Ventas Totales */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <IconBadge color="bg-teal-50">
              <ShoppingBag size={20} className="text-teal-600" />
            </IconBadge>
            <span className="text-xs font-semibold bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">Total</span>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Ventas</h4>
          <StatRow label="Ganancia Total" value="S/. 10.00" />
          <StatRow label="Ventas Válidas" value="10" />
          <StatRow label="Ventas Anuladas" value="2" positive={false} />
        </Tarjetas>

        {/* Ventas de Hoy */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <IconBadge color="bg-sky-50">
              <LayoutDashboard size={20} className="text-sky-600" />
            </IconBadge>
            <span className="text-xs font-semibold bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">Hoy</span>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Ventas de Hoy</h4>
          <StatRow label="Ganancia Total" value="S/. 10.00" />
          <StatRow label="Cant. Ventas" value="10" />
        </Tarjetas>

        {/* Ventas Semana */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <IconBadge color="bg-violet-50">
              <CalendarDays size={20} className="text-violet-600" />
            </IconBadge>
            <span className="text-xs font-semibold bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">Semana</span>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Ventas — Semana Actual</h4>
          <StatRow label="Ganancia Total" value="S/. 10.00" />
          <StatRow label="Cant. Ventas" value="10" />
        </Tarjetas>

        {/* Ventas Mes */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <IconBadge color="bg-amber-50">
              <CalendarRange size={20} className="text-amber-600" />
            </IconBadge>
            <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Mes</span>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Ventas — Mes Actual</h4>
          <StatRow label="Ganancia Total" value="S/. 10.00" />
          <StatRow label="Cant. Ventas" value="10" />
        </Tarjetas>
      </div>

      {/* ── Fila 2: Clientes / Productos / Stock Bajo ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-5">

        {/* Clientes */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200 relative">
          <button
            title="Descargar PDF"
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <FileText size={18} className="text-rose-500" />
          </button>
          <div className="flex items-start mb-4">
            <IconBadge color="bg-teal-50">
              <Users size={20} className="text-teal-600" />
            </IconBadge>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Clientes</h4>
          <StatRow label="Total registrados" value="10" />
        </Tarjetas>

        {/* Productos */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start mb-4">
            <IconBadge color="bg-teal-50">
              <Package size={20} className="text-teal-600" />
            </IconBadge>
          </div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Productos</h4>
          <StatRow label="Total en catálogo" value="10" />
        </Tarjetas>

        {/* Stock Bajo */}
        <Tarjetas className="hover:shadow-md transition-shadow duration-200 relative border-rose-100 bg-rose-50/30">
          <button
            title="Descargar PDF"
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <FileText size={18} className="text-rose-500" />
          </button>
          <div className="flex items-start mb-4">
            <IconBadge color="bg-rose-50">
              <TrendingDown size={20} className="text-rose-500" />
            </IconBadge>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-bold text-slate-700">Stock Bajo</h4>
            <span className="text-xs font-semibold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">Alerta</span>
          </div>
          <StatRow label="Productos con stock bajo" value="10" positive={false} />
        </Tarjetas>
      </div>

      {/* ── Reportes ── */}
      <Tarjetas className="hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-700">Descargar Reportes</h4>
            <p className="text-xs text-slate-400 mt-0.5">Exporta tus datos en formato PDF o Excel</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 active:scale-95 transition-all shadow-sm shadow-teal-200">
              <Download size={15} />
              Reporte de Ventas
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all">
              <FileDown size={15} />
              Reporte de Stock
            </button>
          </div>
        </div>
      </Tarjetas>

    </div>
  );
}


// ─── Sub-componentes ───────────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: string;
  positive?: boolean;
}

const StatRow = ({ label, value, positive = true }: StatRowProps) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className={`text-sm font-semibold tabular-nums ${positive ? "text-teal-600" : "text-rose-500"}`}>
      {value}
    </span>
  </div>
);

interface IconBadgeProps {
  children: React.ReactNode;
  color?: string;
}

const IconBadge = ({ children, color = "bg-teal-50" }: IconBadgeProps) => (
  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
    {children}
  </div>
);
