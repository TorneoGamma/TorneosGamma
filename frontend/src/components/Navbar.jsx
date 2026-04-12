import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-xl font-bold text-indigo-400 tracking-wide">
        🏆 TorneosGamma
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-400' : 'hover:text-indigo-300'}>
          Torneos
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'text-indigo-400' : 'hover:text-indigo-300'}>
          Reportes
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-indigo-400' : 'hover:text-indigo-300'}>
            Admin
          </NavLink>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-400">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-xs">
              Iniciar sesión
            </Link>
            <Link to="/register" className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
