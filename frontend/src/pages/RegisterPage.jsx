import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const register = useRegister()
  const errors = register.error?.response?.data?.errors ?? {}

  const handleSubmit = (e) => {
    e.preventDefault()
    register.mutate(form)
  }

  const fields = [
    { key: 'name',                  type: 'text',     label: 'Nombre completo',      placeholder: 'Tu nombre' },
    { key: 'email',                 type: 'email',    label: 'Correo electrónico',   placeholder: 'tu@email.com' },
    { key: 'password',              type: 'password', label: 'Contraseña',           placeholder: '••••••••' },
    { key: 'password_confirmation', type: 'password', label: 'Confirmar contraseña', placeholder: '••••••••' },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-sky-500/30">
            🏆
          </div>
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-slate-500 text-sm mt-1">Únete a TorneosGamma</p>
        </div>

        <div className="bg-[#131d35] border border-white/7 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ key, type, label, placeholder }) => (
              <div key={key}>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">{label}</label>
                <input type={type} required value={form[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className={`input ${errors[key] ? 'border-red-500/50' : ''}`}
                  placeholder={placeholder}
                />
                {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key][0]}</p>}
              </div>
            ))}
            <button type="submit" disabled={register.isPending} className="btn-primary w-full mt-1">
              {register.isPending
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creando cuenta...</>
                : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-slate-600 text-sm text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
