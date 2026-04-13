import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-white/5 select-none mb-2">404</div>
        <div className="text-5xl mb-4">🏟️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Esta página no existe o fue eliminada. Vuelve al inicio para explorar los torneos.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
