import React, { useState, useCallback, useRef } from 'react'
import { HomeIcon, ChevronRight, X, Settings } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import SobreNosotros from './Components/SobreNosotros'

interface SubMenuItem {
  id: string
  label: string
  href: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  badge?: number
  show?: boolean
  children?: SubMenuItem[]
}

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    href: '/panel/home',
    show: true,
  },
  {
    id: 'configuración',
    label: 'Configuración',
    icon: Settings,
    show: true,
    badge: 3,
    children: [
      { id: 'usuarios', label: 'Usuarios', href: '/panel/usuarios' },
      { id: 'empresa', label: 'Empresa', href: '/panel/empresa' },
    ],
  },





]

const visibleItems = menuItems.filter(i => i.show !== false)

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, collapsed }) => {
  const location = useLocation()
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hovered, setHovered] = useState(false)

  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const found = menuItems.find(item =>
      item.children?.some(child => location.pathname.startsWith(child.href))
    )
    return found?.id ?? null
  })

  const isExpanded = !collapsed || hovered

  const toggleGroup = useCallback((id: string) => {
    setOpenGroup(prev => (prev === id ? null : id))
  }, [])

  const isGroupActive = useCallback((item: MenuItem) =>
    item.children?.some(child => location.pathname.startsWith(child.href)) ?? false,
    [location.pathname]
  )

  // Delay en el cierre para evitar parpadeos al mover el mouse
  const handleMouseEnter = useCallback(() => {
    if (!collapsed) return
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setHovered(true)
  }, [collapsed])

  const handleMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setHovered(false), 120)
  }, [])

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={[
          'fixed left-0 top-0 z-50 flex h-full flex-col',
          'bg-white border-r border-slate-200/80',
          'lg:static lg:h-screen lg:translate-x-0',
          // Usar will-change solo en el width para GPU hint
          'will-change-[width]',
          // Transición rápida y suave — ease cubic-bezier tipo "snap"
          'transition-[width] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isExpanded ? 'w-75' : 'w-[90px]',
        ].join(' ')}
      >

        {/* ══ LOGO ══ */}
        <div className="flex items-center h-[67px] shrink-0 border-b border-slate-100 px-3 overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden">
              <img
                src="/recursos/cusocode.png"
                alt="CuscoCode"
                className="h-10 w-10 object-contain"
              />
            </div>
            {/* Fade del texto — opacity sola, más barato que width */}
            <div
              className="flex flex-col min-w-0 transition-opacity duration-150"
              style={{ opacity: isExpanded ? 1 : 0, pointerEvents: isExpanded ? 'auto' : 'none' }}
            >
              <p className="text-[14px] font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
                CuscoCode
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5 whitespace-nowrap">
                Panel administrativo
              </p>
            </div>
          </div>

          <button
            className="lg:hidden ml-auto flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={14} />
          </button>
        </div>

        {/* ══ NAV ══ */}
        <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden pt-8 pb-2 px-2 [scrollbar-width:none]">

          {/* Label sección */}
          <div
            className="mb-2 transition-opacity duration-150"
            style={{ opacity: isExpanded ? 1 : 0 }}
          >
            <p className="px-2 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">
              Menú
            </p>
          </div>

          <div className="flex flex-col gap-0.5 w-full">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const hasChildren = !!item.children?.length
              const isOpen = openGroup === item.id && isExpanded
              const groupActive = isGroupActive(item)

              const baseItem = "group flex items-center rounded-lg transition-colors duration-150"
              const layoutItem = isExpanded
                ? "gap-3 px-3 py-2.5"
                : "justify-center w-12 h-12 mx-auto"

              // Clases reutilizables por estado
              const activeClasses = "bg-primary-600 text-white"
              const inactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              const openClasses = "bg-slate-100 text-slate-900"

              const activeIcon = "text-white"
              const inactiveIcon = "text-slate-400 group-hover:text-slate-600"

              const activeText = "text-white font-semibold"
              const inactiveText = "text-slate-600 font-medium group-hover:text-slate-900"

              const activeBadge = "bg-white/20 text-white"
              const inactiveBadge = "bg-primary-500/15 text-primary-600"

              /* ── SIN HIJOS ── */
              if (!hasChildren && item.href) {
                return (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    end
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `${baseItem} ${layoutItem} ${isActive ? activeClasses : inactiveClasses}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="relative shrink-0">
                          <Icon
                            size={20}
                            className={isActive ? activeIcon : inactiveIcon}
                          />
                          {item.badge && !isExpanded && (
                            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-primary-600" />
                          )}
                        </div>

                        {isExpanded && (
                          <>
                            <span className={`flex-1 text-sm whitespace-nowrap ${isActive ? activeText : inactiveText}`}>
                              {item.label}
                            </span>

                            {item.badge && (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? activeBadge : inactiveBadge}`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              }

              /* ── CON HIJOS ── */
              const parentIsActive = groupActive
              const parentIsOpen = isOpen && !groupActive

              return (
                <div key={item.id} className="w-full">
                  <button
                    onClick={() => toggleGroup(item.id)}
                    className={`${baseItem} ${isExpanded
                      ? `w-full gap-3 px-3 py-2.5 ${parentIsActive
                        ? activeClasses
                        : parentIsOpen
                          ? openClasses
                          : inactiveClasses
                      }`
                      : `justify-center w-12 h-12 mx-auto ${parentIsActive ? activeClasses : inactiveClasses
                      }`
                      }`}
                  >
                    <div className="relative shrink-0">
                      <Icon
                        size={20}
                        className={parentIsActive ? activeIcon : parentIsOpen ? "text-slate-800" : inactiveIcon}
                      />
                      {item.badge && !isExpanded && (
                        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-primary-600" />
                      )}
                    </div>

                    {isExpanded && (
                      <>
                        <span
                          className={`flex-1 text-left text-sm whitespace-nowrap ${parentIsActive
                            ? activeText
                            : parentIsOpen
                              ? "text-slate-900 font-semibold"
                              : inactiveText
                            }`}
                        >
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${parentIsActive ? activeBadge : inactiveBadge}`}>
                            {item.badge}
                          </span>
                        )}

                        <ChevronRight
                          size={14}
                          className={`shrink-0 transition-transform duration-200 ${parentIsActive
                            ? "text-white/60"
                            : parentIsOpen
                              ? "text-slate-800"
                              : "text-slate-500"
                            } ${isOpen ? "rotate-90" : ""}`}
                        />
                      </>
                    )}
                  </button>

                  {/* Hijos */}
                  {isExpanded && (
                    <div
                      className="overflow-hidden transition-all duration-200 ease-in-out"
                      style={{
                        maxHeight: isOpen ? `${(item.children?.length ?? 0) * 44}px` : "0px",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="ml-8 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-3">
                        {item.children!.map((child) => (
                          <NavLink
                            key={child.id}
                            to={child.href}
                            end
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `rounded-md px-2.5 py-2 text-sm whitespace-nowrap transition-colors duration-150 ${isActive
                                ? "bg-primary-600 text-white font-semibold"
                                : "font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* ══ SOPORTE ══ */}
        {/*
       <div className="border-t border-slate-100 px-2 py-3 shrink-0">
          <button
            className={`cursor-pointer w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100 transition-colors duration-100 ${!isExpanded ? 'justify-center' : ''}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className='w-6' viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6" /><path d="m4.5 5.25l-1.75 1.5L4.25 8m5.5-2.5l1.5 1.25l-1.75 1.5m-3.25.5l1.5-4.5" /></g></svg>
            </div>
            {isExpanded && (
              <div className="flex flex-col text-left">
                <p className="text-[13.5px] font-semibold text-slate-800 leading-tight whitespace-nowrap">Soporte</p>
                <p className="text-[11.5px] text-slate-500 leading-tight mt-0.5 whitespace-nowrap">Centro de ayuda</p>
              </div>
            )}
          </button>
        </div>
        */}
        <SobreNosotros isExpanded={isExpanded} />

      </aside>
    </>
  )
}

export default Sidebar