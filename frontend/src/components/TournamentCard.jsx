import { Link } from 'react-router-dom'

const statusColors = {
  inscripciones: 'bg-green-600',
  en_curso: 'bg-yellow-500',
  finalizado: 'bg-gray-500',
}

const statusLabels = {
  inscripciones: 'Inscripciones abiertas',
  en_curso: 'En curso',
  finalizado: 'Finalizado',
}

export default function TournamentCard({ tournament }) {
  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="block bg-gray-800 rounded-xl p-5 hover:bg-gray-750 hover:ring-1 hover:ring-indigo-500 transition"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-semibold text-lg leading-tight">{tournament.name}</h3>
        <span className={`text-xs text-white px-2 py-0.5 rounded-full ${statusColors[tournament.status]}`}>
          {statusLabels[tournament.status]}
        </span>
      </div>

      <p className="text-indigo-400 text-sm mb-3">🎮 {tournament.discipline}</p>

      {tournament.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tournament.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>👥 {tournament.teams_count} / {tournament.max_teams} equipos</span>
        {tournament.champion && (
          <span className="text-yellow-400">🥇 {tournament.champion.name}</span>
        )}
      </div>
    </Link>
  )
}
