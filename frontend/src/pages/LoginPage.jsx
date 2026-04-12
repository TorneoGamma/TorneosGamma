import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

const DEMO = [
  { label: 'Administrador', email: 'admin@torneos.com', tag: 'Admin' },
  { label: 'Carlos Mendoza', email: 'carlos@torneos.com', tag: 'Usuario' },
]

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const login = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login.mutate(form)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-sky-500/30">
            🏆
          </div>
          <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
          <p className="text-slate-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Demo accounts */}
        <div className="bg-[#131d35] border border-white/7 rounded-2xl p-3 mb-5">
          <p className="text-slate-600 text-xs mb-2 px-1 font-medium uppercase tracking-wider">Acceso rápido</p>
          <div className="flex gap-2">
            {DEMO.map((a) => (
              <button key={a.email} type="button"
                onClick={() => setForm({ email: a.email, password: 'password' })}
                className="flex-1 text-left bg-[#0f1629] hover:bg-[#1a2540] border border-white/8 hover:border-sky-500/30 rounded-xl px-3 py-2.5 transition-all group"
              >
                <span className="block text-xs font-semibold text-slate-200 group-hover:text-white">{a.label}</span>
                <span className="block text-xs text-slate-600 mt-0.5">{a.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#131d35] border border-white/7 rounded-2xl p-6">
          {login.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              {login.error.response?.data?.message ?? 'Credenciales incorrectas'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">Correo electrónico</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="input" placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">Contraseña</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="input" placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={login.isPending} className="btn-primary w-full mt-1">
              {login.isPending
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Ingresando...</>
                : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-slate-600 text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
