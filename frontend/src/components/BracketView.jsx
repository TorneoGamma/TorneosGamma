import MatchCard from './MatchCard'

export default function BracketView({ rounds, onResult, isAdmin }) {
  if (!rounds?.length) {
    return <p className="text-gray-400 text-center py-8">El bracket aún no ha sido generado.</p>
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {rounds.map((round) => (
          <div key={round.id} className="flex flex-col gap-4 min-w-[220px]">
            <h3 className="text-center text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              {round.name}
            </h3>
            <div className="flex flex-col justify-around flex-1 gap-3">
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onResult={onResult}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
