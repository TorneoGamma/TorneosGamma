import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const register = useRegister()

  const handleSubmit = (e) => {
    e.preventDefault()
    register.mutate(form)
  }

  const field = (key, type, placeholder) => (
    <input
      type={type} required placeholder={placeholder}
      value={form[key]}
      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-1">Crear cuenta</h1>
        <p className="text-gray-400 text-sm mb-6">Únete a TorneosGamma</p>

        {register.error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {Object.values(register.error.response?.data?.errors ?? {}).flat().join(' ')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {field('name', 'text', 'Nombre completo')}
          {field('email', 'email', 'Correo electrónico')}
          {field('password', 'password', 'Contraseña (mín. 8 caracteres)')}
          {field('password_confirmation', 'password', 'Confirmar contraseña')}
          <button
            type="submit" disabled={register.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm"
          >
            {register.isPending ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
