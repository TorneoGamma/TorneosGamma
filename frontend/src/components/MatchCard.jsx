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

  const teamRow = (team, score, isWinner) => (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded ${isWinner ? 'bg-indigo-700' : 'bg-gray-700'}`}>
      <span className={`text-sm truncate max-w-[130px] ${isWinner ? 'text-white font-semibold' : 'text-gray-300'}`}>
        {team?.name ?? <span className="text-gray-500 italic">TBD</span>}
      </span>
      {score !== null && score !== undefined && (
        <span className="text-sm font-bold text-white ml-2">{score}</span>
      )}
    </div>
  )

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex flex-col gap-0.5 p-1">
        {teamRow(match.team1, match.score_team1, match.winner_id === match.team1_id && isDone)}
        <div className="border-t border-gray-700" />
        {teamRow(match.team2, match.score_team2, match.winner_id === match.team2_id && isDone)}
      </div>

      {isBye && (
        <div className="text-center text-xs text-gray-500 pb-1">BYE</div>
      )}

      {isAdmin && !isDone && !isBye && match.team1_id && match.team2_id && (
        <div className="px-2 pb-2">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded"
            >
              Registrar resultado
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1">
                <input
                  type="number" min="0" required
                  placeholder={match.team1?.name?.slice(0, 6)}
                  value={scores.score_team1}
                  onChange={(e) => setScores((s) => ({ ...s, score_team1: e.target.value }))}
                  className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1"
                />
                <input
                  type="number" min="0" required
                  placeholder={match.team2?.name?.slice(0, 6)}
                  value={scores.score_team2}
                  onChange={(e) => setScores((s) => ({ ...s, score_team2: e.target.value }))}
                  className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-1">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-600 text-white text-xs py-1 rounded">
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
