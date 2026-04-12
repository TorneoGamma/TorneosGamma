import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTournament, useRegisterTeam, useGenerateBracket } from '../hooks/useTournaments'
import { useAuthStore } from '../store/authStore'
import BracketView from '../components/BracketView'

const statusLabels = {
  inscripciones: '🟢 Inscripciones abiertas',
  en_curso: '🟡 En curso — Ronda',
  finalizado: '🏁 Finalizado',
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

  if (isLoading) return <div className="text-center text-gray-400 py-20">Cargando...</div>
  if (!tournament) return <div className="text-center text-red-400 py-20">Torneo no encontrado.</div>

  const handleRegister = (e) => {
    e.preventDefault()
    registerTeam.mutate(
      { tournamentId: id, name: teamName },
      { onSuccess: () => { setTeamName(''); setShowRegForm(false) } }
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
            <p className="text-indigo-400 mt-1">🎮 {tournament.discipline}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-300">
              {statusLabels[tournament.status]}
              {tournament.status === 'en_curso' && ` ${tournament.current_round}`}
            </span>
            <p className="text-gray-500 text-xs mt-1">
              {tournament.teams_count ?? tournament.teams?.length ?? 0} / {tournament.max_teams} equipos
            </p>
          </div>
        </div>

        {tournament.description && (
          <p className="text-gray-400 mt-3 text-sm">{tournament.description}</p>
        )}

        {tournament.champion && (
          <div className="mt-4 bg-yellow-900/30 border border-yellow-700 rounded-xl px-4 py-3 inline-block">
            <span className="text-yellow-400 font-semibold">🥇 Campeón: {tournament.champion.name}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Inscripción de equipo */}
        {user && tournament.status === 'inscripciones' && !isAdmin && (
          <div>
            {!showRegForm ? (
              <button
                onClick={() => setShowRegForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
              >
                + Inscribir mi equipo
              </button>
            ) : (
              <form onSubmit={handleRegister} className="flex gap-2">
                <input
                  required value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" disabled={registerTeam.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg disabled:opacity-50">
                  {registerTeam.isPending ? '...' : 'Inscribir'}
                </button>
                <button type="button" onClick={() => setShowRegForm(false)}
                  className="bg-gray-700 text-white text-sm px-3 py-2 rounded-lg">
                  Cancelar
                </button>
              </form>
            )}
            {registerTeam.error && (
              <p className="text-red-400 text-xs mt-1">
                {registerTeam.error.response?.data?.message}
              </p>
            )}
          </div>
        )}

        {/* Admin: generar bracket */}
        {isAdmin && tournament.status === 'inscripciones' && (tournament.teams?.length ?? 0) >= 2 && (
          <button
            onClick={() => generateBracket.mutate(id)}
            disabled={generateBracket.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
          >
            {generateBracket.isPending ? 'Generando...' : '⚡ Generar Bracket'}
          </button>
        )}
      </div>

      {/* Equipos inscritos */}
      {tournament.status === 'inscripciones' && tournament.teams?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Equipos inscritos ({tournament.teams.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {tournament.teams.map((team) => (
              <div key={team.id} className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                {team.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bracket */}
      {tournament.rounds?.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4">Bracket del torneo</h2>
          <BracketView rounds={tournament.rounds} isAdmin={isAdmin} />
        </div>
      )}
    </div>
  )
}
