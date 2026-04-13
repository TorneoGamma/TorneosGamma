import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTournament, useRegisterTeam, useGenerateBracket } from '../hooks/useTournaments'
import { useAuthStore } from '../store/authStore'
import BracketView from '../components/BracketView'
import ShareButton from '../components/ShareButton'
import Countdown from '../components/Countdown'
import { toast } from '../components/Toast'

const statusConfig = {
  inscripciones: { badge: 'badge-green', dot: 'bg-emerald-400', label: 'Inscripciones abiertas' },
  en_curso:      { badge: 'badge-yellow', dot: 'bg-amber-400',   label: 'En curso' },
  finalizado:    { badge: 'badge-gray',   dot: 'bg-gray-400',    label: 'Finalizado' },
}

const disciplineIcons = {
  'Fútbol': '⚽', 'Videojuegos': '🎮', 'Ajedrez': '♟️',
  'Baloncesto': '🏀', 'Tenis': '🎾', 'Otro': '🏅',
}

export default function TournamentDetailPage() {
  const { id } = useParams()
  const { data: tournament, isLoading } = useTournament(id)
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  const [teamName, setTeamName] = useState('')
  const [showRegForm, setShowRegForm] = useState(false)
  const registerTeam = useRegisterTeam()
  const generateBracket = useGenerateBracket()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-64 mb-3" />
        <div className="h-4 bg-gray-800 rounded w-40 mb-8" />
        <div className="h-48 bg-gray-800 rounded-2xl" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Torneo no encontrado.</p>
        <Link to="/" className="text-indigo-400 text-sm mt-2 inline-block hover:underline">Volver</Link>
      </div>
    )
  }

  const cfg = statusConfig[tournament.status] ?? statusConfig.finalizado
  const icon = disciplineIcons[tournament.discipline] ?? '🏅'
  const teamCount = tournament.teams?.length ?? 0

  const handleRegister = (e) => {
    e.preventDefault()
    registerTeam.mutate(
      { tournamentId: id, name: teamName },
      {
        onSuccess: () => { setTeamName(''); setShowRegForm(false); toast.success('¡Equipo inscrito correctamente!') },
        onError: (e) => toast.error(e.response?.data?.message ?? 'Error al inscribir equipo'),
      }
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/" className="text-gray-600 hover:text-gray-400 text-sm flex items-center gap-1 mb-6 transition-colors w-fit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Torneos
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-white/10 flex items-center justify-center text-3xl shrink-0">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
                <span className={cfg.badge}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                  {cfg.label}
                  {tournament.status === 'en_curso' && ` · Ronda ${tournament.current_round}`}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{tournament.discipline}</p>
              {tournament.description && (
                <p className="text-gray-400 text-sm mt-2 max-w-xl">{tournament.description}</p>
              )}
              {tournament.starts_at && tournament.status === 'inscripciones' && (
                <div className="mt-3"><Countdown date={tournament.starts_at} /></div>
              )}
            </div>
          </div>

          <div className="flex gap-3 text-center">
            <ShareButton title={tournament.name} />
            <div className="card px-4 py-3">
              <p className="text-xl font-bold text-white">{teamCount}</p>
              <p className="text-gray-500 text-xs">/ {tournament.max_teams} equipos</p>
            </div>
            {tournament.rounds?.length > 0 && (
              <div className="card px-4 py-3">
                <p className="text-xl font-bold text-white">{tournament.rounds.length}</p>
                <p className="text-gray-500 text-xs">rondas</p>
              </div>
            )}
          </div>
        </div>

        {tournament.champion && (
          <div className="mt-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <span className="text-xl">🥇</span>
            <div>
              <p className="text-amber-400 font-semibold">{tournament.champion.name}</p>
              <p className="text-amber-600 text-xs">Campeón del torneo</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {user && tournament.status === 'inscripciones' && !isAdmin && (
          <div>
            {!showRegForm ? (
              <button onClick={() => setShowRegForm(true)} className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Inscribir mi equipo
              </button>
            ) : (
              <form onSubmit={handleRegister} className="flex gap-2 items-center flex-wrap">
                <input required value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="input w-52"
                />
                <button type="submit" disabled={registerTeam.isPending} className="btn-primary">
                  {registerTeam.isPending ? '...' : 'Inscribir'}
                </button>
                <button type="button" onClick={() => setShowRegForm(false)} className="btn-ghost">Cancelar</button>
              </form>
            )}
            {registerTeam.error && (
              <p className="text-red-400 text-xs mt-1.5">{registerTeam.error.response?.data?.message}</p>
            )}
          </div>
        )}

        {isAdmin && tournament.status === 'inscripciones' && teamCount >= 2 && (
          <button onClick={() => generateBracket.mutate(id, {
            onSuccess: () => toast.success('¡Bracket generado!'),
            onError: () => toast.error('Error al generar el bracket'),
          })} disabled={generateBracket.isPending} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {generateBracket.isPending ? 'Generando...' : 'Generar Bracket'}
          </button>
        )}
      </div>

      {/* Teams */}
      {tournament.status === 'inscripciones' && teamCount > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            Equipos inscritos
            <span className="text-xs bg-gray-800 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{teamCount}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {tournament.teams.map((team) => (
              <div key={team.id} className="card px-3 py-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                  {team.name[0]}
                </div>
                <span className="text-gray-300 text-xs truncate">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bracket */}
      {tournament.rounds?.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            Bracket del torneo
            {tournament.status === 'en_curso' && (
              <span className="badge-yellow">Ronda {tournament.current_round}</span>
            )}
          </h2>
          <BracketView rounds={tournament.rounds} isAdmin={isAdmin} />
        </div>
      )}
    </div>
  )
}
