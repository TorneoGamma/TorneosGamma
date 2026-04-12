import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTournaments, useCreateTournament, useDeleteTournament } from '../hooks/useTournaments'

const DISCIPLINES = ['Fútbol', 'Videojuegos', 'Ajedrez', 'Baloncesto', 'Tenis', 'Otro']
const emptyForm = { name: '', discipline: 'Fútbol', description: '', max_teams: 8, starts_at: '' }

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

export default function AdminPage() {
  const { data, isLoading } = useTournaments()
  const createTournament = useCreateTournament()
  const deleteTournament = useDeleteTournament()
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    createTournament.mutate(form, {
      onSuccess: () => { setForm(emptyForm); setShowForm(false) },
    })
  }

  const handleDelete = (id, name) => {
    if (confirm(`¿Eliminar el torneo "${name}"? Esta acción no se puede deshacer.`)) {
      deleteTournament.mutate(id)
    }
  }

  const tournaments = data?.data ?? []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona torneos y resultados</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={showForm ? 'btn-ghost' : 'btn-primary flex items-center gap-2'}
        >
          {showForm ? 'Cancelar' : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo torneo
            </>
          )}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-white font-semibold mb-5">Crear nuevo torneo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Nombre del torneo *</label>
              <input required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Copa Gamma 2026"
                className="input"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Disciplina *</label>
              <select value={form.discipline}
                onChange={(e) => setForm((f) => ({ ...f, discipline: e.target.value }))}
                className="input"
              >
                {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Máximo de equipos *</label>
              <select value={form.max_teams}
                onChange={(e) => setForm((f) => ({ ...f, max_teams: parseInt(e.target.value) }))}
                className="input"
              >
                {[2, 4, 8, 16, 32, 64].map((n) => (
                  <option key={n} value={n}>{n} equipos</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Descripción</label>
              <textarea value={form.description} rows={2}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descripción opcional del torneo..."
                className="input resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Fecha de inicio</label>
              <input type="datetime-local" value={form.starts_at}
                onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
                className="input"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-white/5">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" disabled={createTournament.isPending} className="btn-primary">
                {createTournament.isPending ? 'Creando...' : 'Crear torneo'}
              </button>
            </div>

            {createTournament.error && (
              <p className="sm:col-span-2 text-red-400 text-xs">
                {JSON.stringify(createTournament.error.response?.data?.errors)}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: tournaments.length, color: 'text-white' },
          { label: 'Activos', value: tournaments.filter(t => t.status === 'en_curso').length, color: 'text-amber-400' },
          { label: 'Finalizados', value: tournaments.filter(t => t.status === 'finalizado').length, color: 'text-gray-400' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tournament list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800" />
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-gray-500">No hay torneos creados aún.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tournaments.map((t) => (
            <div key={t.id} className="card px-5 py-4 flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-800 border border-white/10 flex items-center justify-center text-base shrink-0">
                  {({ 'Fútbol': '⚽', 'Videojuegos': '🎮', 'Ajedrez': '♟️', 'Baloncesto': '🏀' })[t.discipline] ?? '🏅'}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{t.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={statusBadge[t.status]}>{statusLabel[t.status]}</span>
                    <span className="text-gray-600 text-xs">{t.teams_count}/{t.max_teams} equipos</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/tournaments/${t.id}`} className="btn-ghost text-xs px-3 py-1.5">Ver</Link>
                <button onClick={() => handleDelete(t.id, t.name)} className="btn-danger text-xs px-3 py-1.5">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
