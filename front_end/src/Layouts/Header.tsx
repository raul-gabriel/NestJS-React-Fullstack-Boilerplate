import { Menu } from 'lucide-react'
import UserMenu from './Components/UserMenu'
import NotificationMenu from './Components/NotificationMenu'
import SearchBar from './Components/SearchBar'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const notifications = [
  { text: 'Nuevo usuario registrado', time: 'Hace 5 min' },
  { text: 'Reporte generado', time: 'Hace 1 hora' },
  { text: 'Configuración actualizada', time: 'Hace 2 horas' },
]

const Header: React.FC<HeaderProps> = ({
  sidebarOpen, setSidebarOpen,
  collapsed, setCollapsed,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 shrink-0">
      <div className="flex items-center justify-between px-5 py-2 h-auto">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Toggle desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-10 w-10 p-2 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all cursor-pointer"
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed
              ? <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 5H5v14h3zm11 0h-9v14h9zm-4.793 4.172l2.121 2.12a1 1 0 0 1 0 1.415l-2.12 2.121a1 1 0 1 1-1.415-1.414L14.207 12l-1.414-1.414a1 1 0 0 1 1.414-1.414" /></g></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 5H5v14h3zm11 0h-9v14h9zm-4.207 4.172a1 1 0 0 1 1.497 1.32l-.083.094L14.793 12l1.414 1.414a1 1 0 0 1-1.32 1.498l-.094-.084l-2.121-2.12a1 1 0 0 1-.084-1.32l.084-.095z" /></g></svg>
            }
          </button>

          {/* Hamburger mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Menu size={16} />
          </button>

          <div>

            <p className="text-[11.5px] text-slate-400 leading-tight">
              panel Admin V.1.0.0
            </p>


          </div>


        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <NotificationMenu notifications={notifications} />
          <UserMenu />
        </div>

      </div>
    </header>
  )
}

export default Header