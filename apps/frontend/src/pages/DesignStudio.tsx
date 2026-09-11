import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Palette, Grid3x3, Layers, Eye, Download, Save } from 'lucide-react'

export default function DesignStudioPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('style')

  const styles = [
    { id: 1, name: 'Modern', color: 'from-gray-600 to-gray-900' },
    { id: 2, name: 'Classic', color: 'from-amber-700 to-yellow-900' },
    { id: 3, name: 'Minimalist', color: 'from-gray-300 to-gray-500' },
    { id: 4, name: 'Rustic', color: 'from-orange-600 to-red-800' },
    { id: 5, name: 'Contemporary', color: 'from-blue-500 to-purple-600' },
    { id: 6, name: 'Industrial', color: 'from-gray-700 to-black' },
  ]

  const colors = [
    '#FFFFFF', '#000000', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#06B6D4', '#EF4444', '#F97316',
  ]

  const materials = [
    { name: 'Marble', color: '#F5F5F5' },
    { name: 'Wood Oak', color: '#8B6F47' },
    { name: 'Concrete', color: '#A9A9A9' },
    { name: 'Brick Red', color: '#C23B22' },
    { name: 'Tile Blue', color: '#4A90E2' },
    { name: 'Glass Clear', color: '#E0F4FF' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('designStudio')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('customizeYourDesign')}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition inline-flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              {t('preview')}
            </button>
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {t('saveDesign')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-center text-white">
              <Grid3x3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{t('3dPreview')}</p>
              <p className="text-sm opacity-75">{t('comingSoon')}</p>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('designDetails')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('style')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">Modern</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('primaryColor')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">#3B82F6</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('accentColor')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-600"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">#8B5CF6</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center ${
                activeTab === 'style'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Palette className="w-4 h-4 mr-2" />
              {t('style')}
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center ${
                activeTab === 'colors'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Layers className="w-4 h-4 mr-2" />
              {t('colors')}
            </button>
          </div>

          {/* Styles */}
          {activeTab === 'style' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t('selectArchitecturalStyle')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                  <div
                    key={style.id}
                    className="group cursor-pointer"
                  >
                    <div className={`bg-gradient-to-br ${style.color} h-20 rounded-lg mb-2 group-hover:shadow-lg transition`}></div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                      {style.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Primary Color */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('primaryColor')}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="aspect-square rounded-lg cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-gray-400"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('materials')}
                </h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div
                      key={material.name}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                    >
                      <div
                        className="w-8 h-8 rounded mr-3 border border-gray-300"
                        style={{ backgroundColor: material.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {material.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Export */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('export')}
            </h3>
            <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition inline-flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              {t('downloadDesign')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
