import { useState } from 'react'
import { useTournaments } from '../hooks/useTournaments'
import TournamentCard from '../components/TournamentCard'

const DISCIPLINES = ['', 'Fútbol', 'Videojuegos', 'Ajedrez', 'Baloncesto', 'Tenis', 'Otro']
const STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'inscripciones', label: 'Inscripciones' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'finalizado', label: 'Finalizados' },
]

export default function TournamentsPage() {
  const [filters, setFilters] = useState({ discipline: '', status: '' })
  const { data, isLoading } = useTournaments(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Torneos</h1>
      <p className="text-gray-400 mb-6">Explora y únete a torneos de tu disciplina favorita</p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={filters.discipline}
          onChange={(e) => setFilters((f) => ({ ...f, discipline: e.target.value }))}
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas las disciplinas</option>
          {DISCIPLINES.filter(Boolean).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilters((f) => ({ ...f, status: s.value }))}
              className={`text-sm px-3 py-1.5 rounded-lg transition ${
                filters.status === s.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-16">Cargando torneos...</div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-16">No hay torneos disponibles.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((t) => <TournamentCard key={t.id} tournament={t} />)}
        </div>
      )}
    </div>
  )
}
