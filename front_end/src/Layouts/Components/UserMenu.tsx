import { cerrarSesion } from '@/utils/classes/sesiones';
import { DataSesion } from '@/utils/store/DataSesion';
import { User, LogOut, ChevronDown, Shield } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function UserMenu() {
  const [open, setOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement | null>(null)


  const datos = DataSesion((state) => state.user);



  const handleCerrarSesion = () => {
    cerrarSesion();
  };


  //otros =====================================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')


  return (
    <div className="relative" ref={menuRef}>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2.5 bg-white border rounded-xl px-3 py-2 cursor-pointer outline-none
          transition-all duration-150
          ${open
            ? 'border-primary-500 ring-3 ring-primary-500/20'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }
        `}
      >
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-semibold tracking-wide">
            {getInitials(datos?.name || 'Usuario')}
          </span>
        </div>

        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-[13px] font-semibold text-texto-500">
            {datos?.name.split(' ')[0]}
          </span>
          <span className="text-[11px] text-gray-500">{datos?.roles}</span>
        </div>

        <ChevronDown
          className={`w-[15px] h-[15px] text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="z-999 absolute right-0 mt-2 w-68 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-black/8  overflow-hidden"
          style={{ animation: 'menuIn .16s ease forwards' }}
        >
          <style>{`
            @keyframes menuIn {
              from { opacity: 0; transform: translateY(-5px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold tracking-wide">
                {getInitials(datos?.name || 'Usuario')}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">{datos?.name}</p>

              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-primary-700 bg-primary-50 border border-primary-400 rounded-md px-2 py-0.5">
                <Shield className="w-[15px] h-[15px]" />
                {datos?.roles}
              </span>
            </div>
          </div>

          {/* Mi Perfil */}
          <div className="p-1.5">
            <Link
              to="/panel/perfil"
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors duration-100 group"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="text-[13px] font-medium text-gray-700">
                Mi Perfil
              </span>
            </Link>
          </div>

          <div className="h-px bg-gray-100 mx-1.5" />

          {/* Cerrar sesión */}
          <div className="p-1.5">
            <button onClick={handleCerrarSesion} className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-red-50 transition-colors duration-100 group">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="text-[13px] font-medium text-red-600">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      )}
    </div>
  )
}