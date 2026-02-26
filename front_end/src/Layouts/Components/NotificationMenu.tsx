import { Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Notification {
    text: string
    time: string
}

interface NotificationMenuProps {
    notifications: Notification[]
}

export default function NotificationMenu({ notifications }: NotificationMenuProps) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>

            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className={`
          relative flex items-center justify-center h-11 w-11 rounded-lg border bg-white
          transition-all duration-150 outline-none cursor-pointer
          ${open
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
        `}
            >
                <Bell className="h-6 w-6 text-gray-500" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-semibold text-white flex items-center justify-center leading-none">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown — fixed en mobile, absolute en desktop */}
            {open && (
                <>
                    {/* Mobile: fixed centrado */}
                    <div
                        className="
              fixed left-1/2 -translate-x-1/2 top-16
              w-[calc(100vw-32px)]
              sm:hidden
              bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden
            "
                        style={{ animation: 'menuIn .15s ease forwards' }}
                    >
                        <NotificationContent notifications={notifications} />
                    </div>

                    {/* Desktop: dropdown normal */}
                    <div
                        className="
              hidden sm:block
              absolute right-0 mt-2 w-80
              bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden
            "
                        style={{ animation: 'menuIn .15s ease forwards' }}
                    >
                        <NotificationContent notifications={notifications} />
                    </div>
                </>
            )}

            <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 639px) {
          .mobile-menu { animation: menuInMobile .15s ease forwards; }
          @keyframes menuInMobile {
            from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        }
      `}</style>
        </div>
    )
}

function NotificationContent({ notifications }: { notifications: { text: string; time: string }[] }) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Notificaciones</span>
                {notifications.length > 0 && (
                    <span className="text-[11px] font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-md px-2 py-0.5">
                        {notifications.length} nuevas
                    </span>
                )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-8">Sin notificaciones</p>
                ) : (
                    <div className="p-1">
                        {notifications.map((n, i) => (
                            <button
                                key={i}
                                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                            >
                                <div className="mt-0.5 h-7 w-7 rounded-md bg-primary-500/10 border border-primary-500 flex items-center justify-center shrink-0">
                                    <Bell className="h-3.5 w-3.5 text-primary-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-medium text-gray-800 leading-snug">{n.text}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-2.5">
                <button className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    Ver todas las notificaciones →
                </button>
            </div>
        </>
    )
}