import { Link } from 'react-router-dom'

const disciplineIcons = {
  'Fútbol': '⚽', 'Videojuegos': '🎮', 'Ajedrez': '♟️',
  'Baloncesto': '🏀', 'Tenis': '🎾', 'Otro': '🏅',
}

const disciplineColor = {
  'Fútbol':     'from-emerald-500/20 to-transparent border-emerald-500/20',
  'Videojuegos':'from-violet-500/20 to-transparent border-violet-500/20',
  'Ajedrez':    'from-slate-500/20 to-transparent border-slate-500/20',
  'Baloncesto': 'from-orange-500/20 to-transparent border-orange-500/20',
  'Tenis':      'from-yellow-500/20 to-transparent border-yellow-500/20',
  'Otro':       'from-sky-500/20 to-transparent border-sky-500/20',
}

const statusBadge = {
  inscripciones: { cls: 'badge-green', dot: 'bg-emerald-400', label: 'Inscripciones' },
  en_curso:      { cls: 'badge-yellow', dot: 'bg-amber-400 animate-pulse', label: 'En curso' },
  finalizado:    { cls: 'badge-gray',   dot: 'bg-slate-400',  label: 'Finalizado' },
}

export default function TournamentCard({ tournament }) {
  const badge  = statusBadge[tournament.status] ?? statusBadge.finalizado
  const icon   = disciplineIcons[tournament.discipline] ?? '🏅'
  const colors = disciplineColor[tournament.discipline] ?? disciplineColor['Otro']
  const filled = tournament.teams_count ?? 0
  const pct    = Math.min(100, Math.round((filled / tournament.max_teams) * 100))

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className={`block bg-[#131d35] border rounded-2xl p-5 flex flex-col gap-3
                  hover:bg-[#1a2540] transition-all duration-200 group
                  bg-gradient-to-br ${colors}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-xl shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-slate-100 font-semibold text-sm leading-tight group-hover:text-white transition-colors line-clamp-1">
              {tournament.name}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">{tournament.discipline}</p>
          </div>
        </div>
        <span className={badge.cls}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} inline-block`} />
          {badge.label}
        </span>
      </div>

      {tournament.description && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{tournament.description}</p>
      )}

      <div>
        <div className="flex justify-between text-xs text-slate-600 mb-1.5">
          <span>{filled} / {tournament.max_teams} equipos</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 bg-[#0f1629] rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {tournament.champion && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
          <span>🥇</span>
          <span className="font-medium">{tournament.champion.name}</span>
        </div>
      )}
    </Link>
  )
}
