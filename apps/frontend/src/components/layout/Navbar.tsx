import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@store/store'
import { logout } from '@store/auth/authSlice'
import { useTranslation } from 'react-i18next'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DH</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">
              Dream Homes
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  {t('register')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  {t('dashboard')}
                </Link>
                <Link
                  to="/projects"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  {t('projects')}
                </Link>
                <Link
                  to="/materials"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  {t('materials')}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/32'}
                      alt={user?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user?.firstName}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg transition"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg transition"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-600 dark:text-gray-300">
                  {t('login')}
                </Link>
                <Link to="/register" className="block px-4 py-2 text-gray-600 dark:text-gray-300">
                  {t('register')}
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-gray-600 dark:text-gray-300">
                  {t('dashboard')}
                </Link>
                <Link to="/projects" className="block px-4 py-2 text-gray-600 dark:text-gray-300">
                  {t('projects')}
                </Link>
                <Link to="/materials" className="block px-4 py-2 text-gray-600 dark:text-gray-300">
                  {t('materials')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400"
                >
                  {t('logout')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
