import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Edit2, Share2, Download, Trash2 } from 'lucide-react'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()

  const project = {
    id,
    name: 'Luxury Villa',
    type: 'villa',
    status: 'designing',
    budget: 750000,
    spent: 450000,
    progress: 60,
    description: 'A modern luxury villa with premium finishes and state-of-the-art amenities.',
    area: 5000,
    floors: 3,
    rooms: 8,
    bathrooms: 5,
    createdAt: '2024-01-15',
    location: 'California, USA',
  }

  const floors = [
    { id: 1, name: 'Ground Floor', area: 2000, rooms: 3 },
    { id: 2, name: 'First Floor', area: 2000, rooms: 3 },
    { id: 3, name: 'Second Floor', area: 1000, rooms: 2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              <Edit2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('status')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {t(project.status)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('area')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.area.toLocaleString()} sq ft
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('progress')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.progress}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('location')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.location}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('projectProgress')}
        </h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {project.progress}% {t('complete')}
        </p>
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('budget')}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('totalBudget')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${project.budget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('spent')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${project.spent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('remaining')}</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${(project.budget - project.spent).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('details')}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('floors')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {project.floors}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('rooms')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {project.rooms}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('bathrooms')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {project.bathrooms}
              </span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('costPerSqFt')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${(project.budget / project.area).toFixed(0)}/sqft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floors */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('floors')}
        </h2>
        <div className="space-y-3">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {floor.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {floor.area.toLocaleString()} sq ft • {floor.rooms} rooms
                  </p>
                </div>
                <button className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-200 dark:hover:bg-primary-800 transition">
                  {t('view')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
