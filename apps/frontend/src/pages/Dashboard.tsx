import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '@store/store'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, DollarSign, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useSelector((state: RootState) => state.auth)
  const [stats, setStats] = useState({
    totalProjects: 5,
    activeProjects: 3,
    completedProjects: 1,
    totalBudget: 2500000,
    spentBudget: 1750000,
    avgProjectValue: 500000,
  })

  const projectStats = [
    { name: 'Jan', projects: 2, value: 150000 },
    { name: 'Feb', projects: 1, value: 200000 },
    { name: 'Mar', projects: 3, value: 350000 },
    { name: 'Apr', projects: 2, value: 280000 },
    { name: 'May', projects: 5, value: 500000 },
    { name: 'Jun', projects: 3, value: 320000 },
  ]

  const projectDistribution = [
    { name: 'Villa', value: 2, color: '#3b82f6' },
    { name: 'Apartment', value: 1, color: '#8b5cf6' },
    { name: 'Mansion', value: 1, color: '#ec4899' },
    { name: 'Townhouse', value: 1, color: '#f59e0b' },
  ]

  const recentProjects = [
    { id: 1, name: 'Luxury Villa', status: 'designing', progress: 60, value: 750000 },
    { id: 2, name: 'Modern Apartment', status: 'estimating', progress: 40, value: 350000 },
    { id: 3, name: 'Family House', status: 'draft', progress: 20, value: 480000 },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      designing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      estimating: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      reviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      building: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    }
    return colors[status] || colors.draft
  }

  useEffect(() => {
    // In a real app, fetch stats from API
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('welcome')}, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          {t('dashboardGreeting')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {t('totalProjects')}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalProjects}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {t('activeProjects')}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeProjects}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {t('totalBudget')}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${(stats.totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {t('avgProjectValue')}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${(stats.avgProjectValue / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('projectsTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} name={t('projects')} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} name={t('value')} yAxisId="right" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('projectDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('recentProjects')}
          </h3>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-semibold">
            {t('viewAll')}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  {t('name')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  {t('status')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  {t('progress')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  {t('value')}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    <Link to={`/projects/${project.id}`} className="hover:text-primary-600">
                      {project.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {t(project.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{project.progress}%</span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                    ${(project.value / 1000).toFixed(0)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
