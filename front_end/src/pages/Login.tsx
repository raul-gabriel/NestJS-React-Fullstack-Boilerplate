import { useEffect, useState } from 'react'
import { IniciarSesion, verificarSesion } from '@/utils/classes/sesiones';


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [focused, setFocused] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
  const [remember, setRemember] = useState(false)


  const [mensajeLogin, setMensajeLogin] = useState<string | null>(null);

  useEffect(() => {
    verificarSesion();  
  }, [])









  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setErrors({})
    setLoading(true)
    const { estado, message } = await IniciarSesion(email, password);
    setMensajeLogin(estado ? null : message);
    setLoading(false)
  }


  //==========================funciones extras ================
  const validate = () => {
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Formato inválido'
    if (!password.trim()) next.password = 'La contraseña es obligatoria'
    else if (password.length < 6) next.password = 'Mínimo 6 caracteres'
    return next
  }

  const handleBlur = (field: 'email' | 'password') => {
    setFocused(null)
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(e => ({ ...e, [field]: validate()[field] }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && !email.includes('@')) setEmail(email + '@gmail.com')
  }


  const fe = (f: 'email' | 'password') => touched[f] ? errors[f] : undefined

  const inputCls = (f: 'email' | 'password') => [
    'w-full rounded-xl border-2 py-4 px-4 text-sm font-medium text-gray-900 outline-none transition-all duration-150 bg-white placeholder:text-gray-300',
    fe(f)
      ? 'border-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
      : focused === f
        ? 'border-primary-500 shadow-[0_0_0_4px_rgba(0,188,168,0.12)]'
        : 'border-gray-200 hover:border-primary-500',
  ].join(' ')




  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 p-3 md:p-4 lg:p-8">

      {/* Card */}
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-3xl shadow-2xl shadow-primary-900/15 ring-1 ring-gray-200">

        {/* ── LEFT: Form ── */}
        <div className="flex w-full flex-col bg-white md:p-8 p-5 lg:w-[52%] lg:p-14">

          {/* Logo */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/recursos/cusocode.png"   // ← cambia la ruta según tu proyecto 
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="text-sm md:text-md font-extrabold tracking-tight text-gray-900">
              CuscoCode  </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
              Acceso al sistema
            </h1>
            <p className="mt-2  text-xs md:text-sm font-medium text-gray-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <svg className="size-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-bold  text-texto-500">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onKeyDown={handleKeyDown}
                onChange={e => { setEmail(e.target.value); if (touched.email) setErrors(v => ({ ...v, email: undefined })) }}
                onFocus={() => setFocused('email')}
                onBlur={() => handleBlur('email')}
                placeholder="correo@empresa.com"
                className={inputCls('email')}
              />
              {fe('email') && <p className="mt-1.5 text-xs font-semibold text-red-500">{fe('email')}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-bold  text-texto-500">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) setErrors(v => ({ ...v, password: undefined })) }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="Mínimo 6 caracteres"
                  className={inputCls('password') + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-primary-600"
                >
                  {showPass ? (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {fe('password') && <p className="mt-1.5 text-xs font-semibold text-red-500">{fe('password')}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="size-4 cursor-pointer accent-primary-600"
                />
                <span className="text-sm font-medium text-texto-500">Recordarme</span>
              </label>
              <button type="button" className="text-sm font-bold text-primary-600 underline underline-offset-2 transition-colors hover:text-primary-800">
                ¿Olvidaste tu clave?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer  mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary-500 py-4 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>

          </form>



          {mensajeLogin && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <svg className="size-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-red-600">{mensajeLogin}</p>
            </div>
          )}

        </div>

        {/* ── RIGHT: Dark teal panel ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary-950 p-12 lg:flex lg:w-[48%]">

          {/* Rings */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border-[52px] border-primary-800/40" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full border-[40px] border-primary-800/30" />
          <div className="pointer-events-none absolute right-16 top-1/2 size-2 rounded-full bg-primary-500/60" />
          <div className="pointer-events-none absolute left-10 top-1/3 size-1.5 rounded-full bg-primary-400/40" />

          {/* Content */}
          <div className="relative z-10 space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
              Sistema interno
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white">
              Entorno seguro<br />
              <span className="text-primary-400">de gestión.</span>
            </h2>
            <p className="max-w-[260px] text-sm leading-relaxed text-primary-700">
              Acceso restringido a usuarios autorizados. Plataforma diseñada para la administración y control operativo del sistema.
            </p>

            <div className="h-px bg-primary-800" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'Acceso privado', label: 'Uso exclusivo del personal autorizado' },
                { val: 'Control de sesiones', label: 'Supervisión de actividad' },
                { val: 'Datos protegidos', label: 'Información confidencial' },
                { val: 'Entorno estable', label: 'Sistema optimizado' },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="flex flex-col justify-center rounded-2xl border border-primary-800 bg-primary-900/50 p-4 backdrop-blur-sm"
                >
                  <p className="text-base font-extrabold text-primary-400">{val}</p>
                  <p className="mt-0.5 text-xs font-medium text-primary-700">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-4">
            <p className="text-xs font-medium text-primary-800">
              © {new Date().getFullYear()} CuscoCode
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}