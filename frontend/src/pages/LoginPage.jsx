import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@torneos.com', role: 'admin' },
  { label: 'Usuario', email: 'carlos@torneos.com', role: 'user' },
]

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const login = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login.mutate(form)
  }

  const fillDemo = (email) => setForm({ email, password: 'password' })

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">🏆</div>
          <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
          <p className="text-gray-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Demo accounts */}
        <div className="card p-3 mb-6">
          <p className="text-gray-500 text-xs mb-2 px-1">Cuentas de demostración</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => fillDemo(a.email)}
                className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 border border-white/10 text-gray-300 hover:text-white rounded-lg px-3 py-2 transition-all text-left"
              >
                <span className="block font-medium">{a.label}</span>
                <span className="text-gray-500">{a.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          {login.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {login.error.response?.data?.message ?? 'Credenciales incorrectas'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Correo electrónico</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Contraseña</label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={login.isPending} className="btn-primary w-full justify-center mt-1">
              {login.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
