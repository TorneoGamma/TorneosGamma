import { useReports } from '../hooks/useTournaments'

export default function ReportsPage() {
  const { data, isLoading } = useReports()

  if (isLoading) return <div className="text-center text-gray-400 py-20">Cargando reportes...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Reportes del sistema</h1>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total torneos', value: data?.total_torneos },
          { label: 'Torneos activos', value: data?.torneos_activos },
          { label: 'Torneos finalizados', value: data?.torneos_finalizados },
          { label: 'Total equipos', value: data?.total_equipos },
          { label: 'Partidos jugados', value: data?.partidos_jugados },
          { label: 'Total partidos', value: data?.total_partidos },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-400">{stat.value ?? 0}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Por disciplina */}
      {data?.por_disciplina?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Torneos por disciplina</h2>
          <div className="space-y-2">
            {data.por_disciplina.map((d) => {
              const pct = Math.round((d.total / data.total_torneos) * 100)
              return (
                <div key={d.discipline}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{d.discipline}</span>
                    <span className="text-gray-400">{d.total} torneos</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
