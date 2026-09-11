import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import { useTranslation } from 'react-i18next'
import {
  Home,
  FileText,
  Palette,
  DollarSign,
  Settings,
  BarChart3,
  Package,
} from 'lucide-react'

export default function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) return null

  const isActive = (path: string) => location.pathname.startsWith(path)

  const menuItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/projects', icon: FileText, label: t('projects') },
    { path: '/materials', icon: Package, label: t('materials') },
    { path: '/pricing', icon: DollarSign, label: t('pricing') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
  ]

  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          {t('menu')}
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('statistics')}
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-300">{t('activeProjects')}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-300">{t('totalBudget')}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">$2.5M</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
