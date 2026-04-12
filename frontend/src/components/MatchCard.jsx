import { useState } from 'react'
import { useRecordResult } from '../hooks/useTournaments'

export default function MatchCard({ match, isAdmin }) {
  const [showForm, setShowForm] = useState(false)
  const [scores, setScores] = useState({ score_team1: '', score_team2: '' })
  const recordResult = useRecordResult()

  const isBye = match.is_bye
  const isDone = match.status === 'completado'

  const handleSubmit = (e) => {
    e.preventDefault()
    const s1 = parseInt(scores.score_team1)
    const s2 = parseInt(scores.score_team2)
    if (s1 === s2) return alert('No puede haber empate en eliminación directa.')
    const winner_id = s1 > s2 ? match.team1_id : match.team2_id
    recordResult.mutate(
      { matchId: match.id, score_team1: s1, score_team2: s2, winner_id },
      { onSuccess: () => setShowForm(false) }
    )
  }

  const TeamRow = ({ team, score, isWinner }) => (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
      isWinner ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-gray-800/60 border border-transparent'
    }`}>
      <div className="flex items-center gap-2 min-w-0">
        {team ? (
          <>
            <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
              {team.name[0]}
            </div>
            <span className={`text-xs truncate max-w-[100px] ${isWinner ? 'text-white font-semibold' : 'text-gray-400'}`}>
              {team.name}
            </span>
          </>
        ) : (
          <span className="text-gray-600 text-xs italic">TBD</span>
        )}
      </div>
      {score !== null && score !== undefined && isDone && (
        <span className={`text-sm font-bold ml-2 ${isWinner ? 'text-indigo-300' : 'text-gray-500'}`}>{score}</span>
      )}
      {isWinner && <span className="text-indigo-400 text-xs ml-1">✓</span>}
    </div>
  )

  return (
    <div className="card overflow-hidden">
      {isBye ? (
        <div className="px-3 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
              {match.team1?.name[0]}
            </div>
            <span className="text-gray-300 text-xs">{match.team1?.name}</span>
          </div>
          <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-white/5">BYE</span>
        </div>
      ) : (
        <div className="p-2 flex flex-col gap-1">
          <TeamRow team={match.team1} score={match.score_team1} isWinner={isDone && match.winner_id === match.team1_id} />
          <div className="flex items-center gap-1 px-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-gray-700 text-xs">vs</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <TeamRow team={match.team2} score={match.score_team2} isWinner={isDone && match.winner_id === match.team2_id} />
        </div>
      )}

      {isAdmin && !isDone && !isBye && match.team1_id && match.team2_id && (
        <div className="border-t border-white/5 px-2 pb-2 pt-1.5">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 py-1.5 rounded-lg transition-all"
            >
              Registrar resultado
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <input
                  type="number" min="0" required
                  placeholder={match.team1?.name?.slice(0, 5)}
                  value={scores.score_team1}
                  onChange={(e) => setScores((s) => ({ ...s, score_team1: e.target.value }))}
                  className="w-full bg-gray-800 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                />
                <input
                  type="number" min="0" required
                  placeholder={match.team2?.name?.slice(0, 5)}
                  value={scores.score_team2}
                  onChange={(e) => setScores((s) => ({ ...s, score_team2: e.target.value }))}
                  className="w-full bg-gray-800 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-1">
                <button type="submit" disabled={recordResult.isPending}
                  className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs py-1.5 rounded-lg border border-emerald-500/20 transition-all disabled:opacity-50">
                  {recordResult.isPending ? '...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-800 text-gray-400 text-xs py-1.5 rounded-lg border border-white/5 hover:text-white transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
