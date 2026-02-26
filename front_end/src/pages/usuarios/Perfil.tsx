import { useEffect, useState } from 'react';
import { fetchDataById, updateDataManual } from '@/lib/api/consultasApiToken';
import { ToastFlotanteMediano } from '@/utils/classes/Toas';
import { DataSesion } from '@/utils/store/DataSesion';

interface PerfilData {
    nombres: string;
    email: string;
    telefono: string;
    tipo_usuario: string;
    estado: string;
}

type Tab = 'info' | 'actualizar';

const Perfil = () => {
    const user = DataSesion((state) => state.user);
    const [perfil, setPerfil] = useState<PerfilData | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>('info');
    const [passwordActual, setPasswordActual] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        fetchDataById<PerfilData>('/usuarios', user.id)
            .then(setPerfil)
            .catch((err: any) => {
                ToastFlotanteMediano(err.status ?? 500, err.message);
                setErrorCarga(err.message ?? 'Error al cargar el perfil');
            });
    }, []);
    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email && !password) {
            ToastFlotanteMediano('info', 'Ingresa al menos un campo para actualizar');
            return;
        }
        if (!passwordActual) {
            ToastFlotanteMediano('warning', 'Ingresa tu contraseña actual');
            return;
        }

        const body: Record<string, string> = { password_actual: passwordActual };
        if (email) body.email = email;
        if (password) body.password = password;

        setLoading(true);
        try {
            const result = await updateDataManual('/usuarios/perfil', user!.id, body);
            ToastFlotanteMediano(result.status, result.message);
            if (email && perfil) setPerfil({ ...perfil, email });
            setPasswordActual('');
            setEmail('');
            setPassword('');
        } catch (err: any) {
            ToastFlotanteMediano(err.status ?? 500, err.message);
        } finally {
            setLoading(false);
        }
    };

    if (errorCarga) return (
        <div className="flex flex-col items-center justify-center mt-20 gap-3 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.293 4.293a1 1 0 011.414 0L21 13.586V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-5.414L10.293 4.293z" />
            </svg>
            <p className="text-lg font-semibold">{errorCarga}</p>
        </div>
    );

    if (!perfil) return (
        <div className="flex items-center justify-center mt-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-600 shadow-sm">
                        {perfil.nombres.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{perfil.nombres}</p>
                        <p className="text-sm text-gray-500">{perfil.email}</p>
                    </div>
                    <span className={`inline-flex rounded-full py-1 px-4 text-xs font-semibold ${perfil.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {perfil.estado}
                    </span>
                </div>

                {/* tabs */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {(['info', 'actualizar'] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-3 text-sm font-medium transition-all ${tab === t
                                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {t === 'info' ? 'Información' : 'Actualizar acceso'}
                            </button>
                        ))}
                    </div>

                    {/* tab info */}
                    {tab === 'info' && (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { label: 'Nombre completo', value: perfil.nombres },
                                { label: 'Correo electrónico', value: perfil.email },
                                { label: 'Teléfono', value: perfil.telefono || '—' },
                                { label: 'Rol', value: perfil.tipo_usuario },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* tab actualizar */}
                    {tab === 'actualizar' && (
                        <div className="p-6">
                            <p className="text-sm text-gray-400 mb-6">Puedes actualizar tu correo, contraseña o ambos. Debes ingresar tu contraseña actual para confirmar.</p>
                            <form onSubmit={handleGuardar} className="space-y-5">

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Contraseña actual <span className="text-red-400">*</span></label>
                                    <input
                                        type="password"
                                        value={passwordActual}
                                        onChange={(e) => setPasswordActual(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                    />
                                </div>

                                <hr className="border-gray-100" />

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Nuevo correo <span className="text-gray-400 font-normal">(opcional)</span>
                                    </label>
                                    <p className="text-xs text-gray-400">Actual: <strong className="text-gray-600">{perfil.email}</strong></p>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nuevo@correo.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Nueva contraseña <span className="text-gray-400 font-normal">(opcional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer w-full py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Guardando...
                                        </span>
                                    ) : 'Guardar cambios'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Perfil;