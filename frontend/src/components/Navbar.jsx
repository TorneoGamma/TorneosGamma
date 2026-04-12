import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-medium text-sm'
      : 'text-gray-400 hover:text-white text-sm transition-colors'

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">🏆</div>
          <span className="font-bold text-white tracking-tight">TorneosGamma</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden sm:flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Torneos</NavLink>
          <NavLink to="/reports" className={linkClass}>Reportes</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Auth — desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm">{user.name}</span>
                {user.role === 'admin' && (
                  <span className="text-xs bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded">Admin</span>
                )}
              </div>
              <button onClick={logout} className="btn-ghost text-xs px-3 py-1.5">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs px-3 py-1.5">Iniciar sesión</Link>
              <Link to="/register" className="btn-primary text-xs px-3 py-1.5">Registrarse</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-gray-950 px-4 py-3 flex flex-col gap-3">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Torneos</NavLink>
          <NavLink to="/reports" className={linkClass} onClick={() => setMenuOpen(false)}>Reportes</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
          <div className="border-t border-white/5 pt-3">
            {user ? (
              <button onClick={logout} className="btn-ghost w-full text-center text-xs">Cerrar sesión</button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-ghost flex-1 text-center text-xs" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-xs" onClick={() => setMenuOpen(false)}>Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
