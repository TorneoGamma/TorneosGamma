import MatchCard from './MatchCard'

export default function BracketView({ rounds, isAdmin }) {
  if (!rounds?.length) {
    return (
      <div className="card p-10 text-center">
        <div className="text-3xl mb-2">🎯</div>
        <p className="text-gray-400 font-medium">El bracket aún no ha sido generado</p>
        <p className="text-gray-600 text-sm mt-1">El administrador debe iniciar el torneo</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {rounds.map((round, ri) => (
          <div key={round.id} className="flex flex-col min-w-[200px]">
            {/* Round header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-2 h-2 rounded-full ${
                round.status === 'completada' ? 'bg-emerald-400' :
                round.status === 'en_curso'   ? 'bg-amber-400 animate-pulse' :
                'bg-gray-600'
              }`} />
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{round.name}</span>
            </div>

            {/* Matches — vertically centered per round */}
            <div className="flex flex-col justify-around flex-1 gap-2">
              {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} isAdmin={isAdmin} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
