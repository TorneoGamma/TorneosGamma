import { useState } from 'react'
import { useReports, useTournamentReport, useTournaments } from '../hooks/useTournaments'

function StatCard({ label, value, icon, color = 'text-indigo-400' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
          <p className="text-gray-500 text-sm mt-1">{label}</p>
        </div>
        <span className="text-2xl opacity-60">{icon}</span>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const { data, isLoading } = useReports()
  const { data: tournamentsData } = useTournaments()
  const [selectedId, setSelectedId] = useState('')
  const { data: tReport, isLoading: tLoading } = useTournamentReport(selectedId)

  const tournaments = tournamentsData?.data ?? []

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-48 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card h-24" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
        <p className="text-gray-500 text-sm mt-1">Estadísticas agregadas del sistema</p>
      </div>

      {/* General stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total torneos"       value={data?.total_torneos}       icon="🏆" color="text-indigo-400" />
        <StatCard label="Torneos activos"     value={data?.torneos_activos}     icon="⚡" color="text-amber-400" />
        <StatCard label="Torneos finalizados" value={data?.torneos_finalizados} icon="🏁" color="text-gray-400" />
        <StatCard label="Total equipos"       value={data?.total_equipos}       icon="👥" color="text-emerald-400" />
        <StatCard label="Partidos jugados"    value={data?.partidos_jugados}    icon="⚔️" color="text-blue-400" />
        <StatCard label="Total partidos"      value={data?.total_partidos}      icon="📋" color="text-purple-400" />
      </div>

      {/* By discipline */}
      {data?.por_disciplina?.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-white font-semibold mb-5">Torneos por disciplina</h2>
          <div className="space-y-4">
            {data.por_disciplina.map((d) => {
              const pct = data.total_torneos > 0 ? Math.round((d.total / data.total_torneos) * 100) : 0
              return (
                <div key={d.discipline}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{d.discipline}</span>
                    <span className="text-gray-500">{d.total} torneo{d.total !== 1 ? 's' : ''} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Per-tournament report */}
      <div className="card p-6">
        <h2 className="text-white font-semibold mb-4">Reporte por torneo</h2>
        <div className="relative mb-6">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="input appearance-none pr-8"
          >
            <option value="">Selecciona un torneo...</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {tLoading && <p className="text-gray-500 text-sm">Cargando...</p>}

        {tReport && !tLoading && (
          <div>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Equipos', value: tReport.total_equipos },
                { label: 'Rondas', value: tReport.total_rondas },
                { label: 'Partidos', value: tReport.partidos_jugados },
                { label: 'Campeón', value: tReport.champion?.name ?? '—' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-white font-bold text-lg truncate">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Team stats table */}
            {tReport.team_stats?.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Estadísticas por equipo</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-gray-500 text-xs font-medium pb-2 pr-4">#</th>
                        <th className="text-left text-gray-500 text-xs font-medium pb-2 pr-4">Equipo</th>
                        <th className="text-center text-gray-500 text-xs font-medium pb-2 px-4">Victorias</th>
                        <th className="text-center text-gray-500 text-xs font-medium pb-2 px-4">Goles a favor</th>
                        <th className="text-center text-gray-500 text-xs font-medium pb-2 px-4">Goles en contra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tReport.team_stats.map((team, i) => (
                        <tr key={team.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="py-2.5 pr-4 text-gray-600 text-xs">{i + 1}</td>
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                                {team.name[0]}
                              </div>
                              <span className="text-gray-200 font-medium">{team.name}</span>
                              {tReport.champion?.id === team.id && (
                                <span className="text-xs text-amber-400">🥇</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="text-emerald-400 font-semibold">{team.wins}</span>
                          </td>
                          <td className="py-2.5 px-4 text-center text-gray-300">{team.scored}</td>
                          <td className="py-2.5 px-4 text-center text-gray-500">{team.conceded}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedId && !tLoading && (
          <div className="text-center py-8 text-gray-600">
            <p>Selecciona un torneo para ver sus estadísticas detalladas</p>
          </div>
        )}
      </div>
    </div>
  )
}
