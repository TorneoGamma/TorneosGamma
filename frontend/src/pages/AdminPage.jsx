import { useState } from 'react'
import { useTournaments, useCreateTournament, useDeleteTournament } from '../hooks/useTournaments'
import { Link } from 'react-router-dom'

const DISCIPLINES = ['Fútbol', 'Videojuegos', 'Ajedrez', 'Baloncesto', 'Tenis', 'Otro']

const emptyForm = { name: '', discipline: 'Fútbol', description: '', max_teams: 8, starts_at: '' }

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
    if (confirm(`¿Eliminar el torneo "${name}"?`)) deleteTournament.mutate(id)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancelar' : '+ Nuevo torneo'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-xs mb-1 block">Nombre del torneo</label>
            <input required value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Disciplina</label>
            <select value={form.discipline}
              onChange={(e) => setForm((f) => ({ ...f, discipline: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Máximo de equipos</label>
            <select value={form.max_teams}
              onChange={(e) => setForm((f) => ({ ...f, max_teams: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[2, 4, 8, 16, 32, 64].map((n) => <option key={n} value={n}>{n} equipos</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400 text-xs mb-1 block">Descripción (opcional)</label>
            <textarea value={form.description} rows={2}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Fecha de inicio (opcional)</label>
            <input type="datetime-local" value={form.starts_at}
              onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={createTournament.isPending}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm px-6 py-2 rounded-lg">
              {createTournament.isPending ? 'Creando...' : 'Crear torneo'}
            </button>
          </div>

          {createTournament.error && (
            <p className="sm:col-span-2 text-red-400 text-xs">
              {JSON.stringify(createTournament.error.response?.data?.errors)}
            </p>
          )}
        </form>
      )}

      {/* Lista de torneos */}
      {isLoading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {data?.data?.map((t) => (
            <div key={t.id} className="bg-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.discipline} · {t.teams_count}/{t.max_teams} equipos · {t.status}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/tournaments/${t.id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg">
                  Ver
                </Link>
                <button onClick={() => handleDelete(t.id, t.name)}
                  className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded-lg">
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
