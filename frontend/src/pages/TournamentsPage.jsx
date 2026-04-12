import { useState } from 'react'
import { useTournaments } from '../hooks/useTournaments'
import TournamentCard from '../components/TournamentCard'

const DISCIPLINES = ['Fútbol', 'Videojuegos', 'Ajedrez', 'Baloncesto', 'Tenis', 'Otro']
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
  const tournaments = data?.data ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Torneos</h1>
        <p className="text-slate-500 mt-2 text-sm">Explora y únete a torneos de tu disciplina favorita</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative">
          <select value={filters.discipline}
            onChange={(e) => setFilters(f => ({ ...f, discipline: e.target.value }))}
            className="appearance-none bg-[#131d35] border border-white/8 text-slate-300 text-sm rounded-xl pl-3 pr-8 py-2 outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="">Todas las disciplinas</option>
            {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex gap-1 bg-[#131d35] border border-white/8 rounded-xl p-1">
          {STATUSES.map(s => (
            <button key={s.value}
              onClick={() => setFilters(f => ({ ...f, status: s.value }))}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                filters.status === s.value
                  ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {(filters.discipline || filters.status) && (
          <button onClick={() => setFilters({ discipline: '', status: '' })}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a2540]" />
                <div className="flex-1"><div className="h-3.5 bg-[#1a2540] rounded w-3/4 mb-2" /><div className="h-3 bg-[#1a2540] rounded w-1/2" /></div>
              </div>
              <div className="h-2 bg-[#1a2540] rounded w-full mb-1.5" />
              <div className="h-2 bg-[#1a2540] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 opacity-30">🏟️</div>
          <p className="text-slate-400 font-medium">No hay torneos disponibles</p>
          <p className="text-slate-600 text-sm mt-1">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <>
          <p className="text-slate-600 text-xs mb-4 uppercase tracking-wider">
            {tournaments.length} torneo{tournaments.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tournaments.map(t => <TournamentCard key={t.id} tournament={t} />)}
          </div>
        </>
      )}
    </div>
  )
}
