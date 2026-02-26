import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Mail, Phone, Monitor, Globe, Lightbulb, Rocket, Zap, Smartphone } from "lucide-react";

export default function SobreNosotros({ isExpanded }: { isExpanded: boolean }) {
  const [open, setOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const desarrollador = "Raul Hacho Cutipa";
  const email         = "cuscocode@gmail.com";
  const telefono      = "+51940500006";
  const empresa       = "CuscoCode";
  const whatsappUrl   = `https://wa.me/${telefono.replace(/\D/g, "")}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const modal = open && createPortal(
    <>
      <style>{`
        @keyframes sn-in   { from{opacity:0} to{opacity:1} }
        @keyframes sn-up   { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes sn-glow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes sn-chip { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sn-wa   { 0%{box-shadow:0 0 0 0 rgba(0,188,168,.5)} 70%{box-shadow:0 0 0 10px rgba(0,188,168,0)} 100%{box-shadow:0 0 0 0 rgba(0,188,168,0)} }

        .sn-bd    { animation: sn-in .18s ease; }
        .sn-card  { animation: sn-up .26s cubic-bezier(.16,1,.3,1); }
        .sn-glow  { animation: sn-glow 3s ease-in-out infinite; }
        .sn-c1    { animation: sn-chip .25s ease both .05s; opacity:0 }
        .sn-c2    { animation: sn-chip .25s ease both .12s; opacity:0 }
        .sn-c3    { animation: sn-chip .25s ease both .19s; opacity:0 }
        .sn-wa-btn{ animation: sn-wa 2s ease-out infinite; }
      `}</style>

      <div
        ref={backdropRef}
        className="sn-bd fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)" }}
        onClick={(e) => e.target === backdropRef.current && setOpen(false)}
      >
        <div className="sn-card relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)" }}>

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="relative overflow-hidden px-7 pt-8 pb-8"
            style={{ background: "linear-gradient(160deg, var(--color-primary-950) 0%, var(--color-primary-900) 50%, #0a4a45 100%)" }}>

            {/* Patrón de puntos */}
            <div className="absolute inset-0 opacity-[.07]"
              style={{ backgroundImage:"radial-gradient(circle, var(--color-primary-300) 1px, transparent 1px)", backgroundSize:"22px 22px" }} />

            {/* Círculo glow detrás del logo */}
            <div className="sn-glow absolute -top-10 -right-10 h-48 w-48 rounded-full"
              style={{ background:"radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)", opacity:.25 }} />

            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
            >
              <X size={15} />
            </button>

            {/* Logo + empresa */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-white/20 shadow-xl">
                <img src='/recursos/cusocode.png' alt="CuscoCode" className="h-14 w-14 object-contain drop-shadow" />
              </div>
              <p className="text-primary-300 text-xs font-semibold uppercase tracking-[.18em] mb-1">{empresa}</p>
              <h2 className="text-white font-bold text-lg leading-snug">{desarrollador}</h2>
              <p className="text-primary-300/70 text-sm mt-1">Desarrollador Full-Stack</p>
            </div>

            {/* Chips de plataforma */}
            <div className="relative mt-5 flex justify-center gap-2">
              {[
                { icon: <Smartphone size={12} />, label: "Móvil" },
                { icon: <Globe       size={12} />, label: "Web" },
                { icon: <Monitor     size={12} />, label: "Escritorio" },
              ].map(({ icon, label }, i) => (
                <span key={label}
                  className={`sn-c${i + 1} flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-primary-200 ring-1 ring-white/15`}>
                  {icon}{label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Mensaje inspirador ─────────────────────────────── */}
          <div className="px-7 pt-6 pb-1">
            <div className="flex items-start gap-3 rounded-2xl bg-primary-50 border border-primary-100 p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white shadow-sm">
                <Lightbulb size={16} />
              </div>
              <div>
                <p className="font-bold text-primary-900 text-sm">¿Tienes una idea para una app o software?</p>
                <p className="text-primary-800/70 text-[13px] mt-1 leading-relaxed">
                  No necesitas saber de tecnología. Solo necesitas la idea — yo me encargo del resto.
                  Desde apps móviles hasta sistemas completos, lo construyo con pasión y ganas.
                </p>
              </div>
            </div>
          </div>

          {/* ── Features rápidas ───────────────────────────────── */}
          <div className="px-7 pt-4 pb-2 grid grid-cols-2 gap-2">
            {[
              { icon: <Rocket size={14}/>, text: "Ideas convertidas en productos reales" },
              { icon: <Zap    size={14}/>, text: "Rápido, moderno y a tu medida" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="mt-0.5 text-primary-500 shrink-0">{icon}</span>
                <p className="text-[12px] text-slate-600 leading-tight">{text}</p>
              </div>
            ))}
          </div>

          {/* ── Contacto ───────────────────────────────────────── */}
          <div className="px-7 pt-3 pb-3 space-y-2">
            <a href={`mailto:${email}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all group">
              <Mail size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors shrink-0" />
              {email}
            </a>
            <a href={`tel:${telefono}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all group">
              <Phone size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors shrink-0" />
              {telefono}
            </a>

            <a href='https://www.cuscocode.com' target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all group">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 text-slate-400 group-hover:text-primary-500 transition-colors shrink-0" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.365 2.83a9.25 9.25 0 0 1 4.744 2.089c.338.284.336.794.024 1.106l-1.616 1.616c-.312.312-.816.306-1.171.044a5.365 5.365 0 1 0 1.615 6.705h-3.91a.8.8 0 0 1-.8-.8V11.3a.8.8 0 0 1 .8-.8h7.493c.316 0 .61.186.681.495c.313 1.362-.125 3.246-.158 3.384l-.004.016c-.528 1.963-1.661 3.706-3.274 4.944a9.25 9.25 0 1 1-4.424-16.51"/></svg>
              www.cuscocode.com
            </a>
          </div>

          {/* ── CTA WhatsApp ────────────────────────────────────── */}
          <div className="px-7 pb-6 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sn-wa-btn flex w-full items-center justify-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
              style={{ background: "var(--color-primary-600)" }}
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 448 512"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222c0-59.3-25.2-115-67.1-157m-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4l-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2c0-101.7 82.8-184.5 184.6-184.5c49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6m101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18c-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4c-32.6-16.3-54-29.1-75.5-66c-5.7-9.8 5.7-9.1 16.3-30.3c1.8-3.7.9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5c-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8c35.2 15.2 49 16.5 66.6 13.9c10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6"/></svg>
              Hablemos — Contáctame por WhatsApp
            </a>
            <p className="text-center text-[11px] text-slate-400 mt-3">{empresa} · {new Date().getFullYear()}</p>
          </div>

        </div>
      </div>
    </>,
    document.body
  );

  return (
    <>
      {/* ── Botón sidebar ── */}
      <div className="border-t border-slate-100 px-2 py-3 shrink-0">
        <button
          onClick={() => setOpen(true)}
          className={`cursor-pointer w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100 transition-colors duration-100 ${!isExpanded ? "justify-center" : ""}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6" viewBox="0 0 14 14">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6" />
                <path d="m4.5 5.25l-1.75 1.5L4.25 8m5.5-2.5l1.5 1.25l-1.75 1.5m-3.25.5l1.5-4.5" />
              </g>
            </svg>
          </div>
          {isExpanded && (
            <div className="flex flex-col text-left">
              <p className="text-[13.5px] font-semibold text-slate-800 leading-tight whitespace-nowrap">Soporte</p>
              <p className="text-[11.5px] text-slate-500 leading-tight mt-0.5 whitespace-nowrap">Centro de ayuda</p>
            </div>
          )}
        </button>
      </div>

      {modal}
    </>
  );
}