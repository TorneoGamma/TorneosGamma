import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

function useMyRegistrations() {
  return useQuery({
    queryKey: ['my-registrations'],
    queryFn: () => api.get('/me/registrations').then(r => r.data),
  })
}

const statusBadge = {
  inscripciones: 'badge-green',
  en_curso:      'badge-yellow',
  finalizado:    'badge-gray',
}
const statusLabel = {
  inscripciones: 'Inscripciones',
  en_curso:      'En curso',
  finalizado:    'Finalizado',
}

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)

  if (!user) return (
    <div className="text-center py-20">
      <p className="text-slate-400">Debes iniciar sesión para ver tu perfil.</p>
      <Link to="/login" className="text-sky-400 text-sm mt-2 inline-block">Iniciar sesión</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={user.role === 'admin' ? 'badge-blue' : 'badge-gray'}>
              {user.role === 'admin' ? '⚡ Administrador' : '👤 Usuario'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Torneos inscritos', value: '—', icon: '🏆' },
          { label: 'Victorias', value: '—', icon: '🥇' },
          { label: 'Partidos jugados', value: '—', icon: '⚔️' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-slate-600 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="card p-6">
        <h2 className="text-white font-semibold mb-4">Información de cuenta</h2>
        <div className="space-y-3">
          {[
            { label: 'Nombre', value: user.name },
            { label: 'Correo', value: user.email },
            { label: 'Rol', value: user.role === 'admin' ? 'Administrador' : 'Usuario' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-slate-500 text-sm">{item.label}</span>
              <span className="text-slate-200 text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
