import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Trash2 } from 'lucide-react'

interface Project {
  id: number
  name: string
  type: string
  status: string
  budget: number
  spent: number
  progress: number
  createdAt: string
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Luxury Villa',
      type: 'villa',
      status: 'designing',
      budget: 750000,
      spent: 450000,
      progress: 60,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Modern Apartment',
      type: 'apartment',
      status: 'estimating',
      budget: 350000,
      spent: 140000,
      progress: 40,
      createdAt: '2024-02-20',
    },
    {
      id: 3,
      name: 'Family House',
      type: 'townhouse',
      status: 'draft',
      budget: 480000,
      spent: 0,
      progress: 20,
      createdAt: '2024-03-10',
    },
    {
      id: 4,
      name: 'Beachfront Mansion',
      type: 'mansion',
      status: 'approved',
      budget: 1200000,
      spent: 360000,
      progress: 30,
      createdAt: '2024-03-25',
    },
  ])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    let filtered = projects
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (filter !== 'all') {
      filtered = filtered.filter((p) => p.status === filter)
    }
    setFilteredProjects(filtered)
  }, [search, filter, projects])

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      villa: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      apartment: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
      townhouse: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      mansion: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      duplex: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    }
    return colors[type] || colors.apartment
  }

  const handleDeleteProject = (id: number) => {
    if (window.confirm(t('confirmDelete') || 'Are you sure?')) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('projects')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manageYourProjects')}
          </p>
        </div>
        <Link
          to="/projects/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('newProject')}
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchProjects') || 'Search projects...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative flex items-center">
            <Filter className="absolute left-3 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="draft">{t('draft')}</option>
              <option value="designing">{t('designing')}</option>
              <option value="estimating">{t('estimating')}</option>
              <option value="reviewing">{t('reviewing')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="building">{t('building')}</option>
              <option value="completed">{t('completed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500"></div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600"
                    >
                      {project.name}
                    </Link>
                    <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded ${getTypeColor(project.type)}`}>
                      {t(project.type)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {t(project.status)}
                    </span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{t('budget')}: ${(project.budget / 1000).toFixed(0)}K</span>
                    <span>{t('spent')}: ${(project.spent / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex-1 text-center py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-200 dark:hover:bg-primary-800 transition"
                    >
                      {t('view')}
                    </Link>
                    <Link
                      to={`/projects/${project.id}/design`}
                      className="flex-1 text-center py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {t('design')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('noProjectsFound')}
          </p>
          <Link
            to="/projects/new"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            {t('createFirstProject')}
          </Link>
        </div>
      )}
    </div>
  )
}
