import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const login = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login.mutate(form)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-1">Iniciar sesión</h1>
        <p className="text-gray-400 text-sm mb-6">Bienvenido de vuelta</p>

        {login.error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {login.error.response?.data?.message ?? 'Credenciales incorrectas'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email" required placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password" required placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit" disabled={login.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm"
          >
            {login.isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
