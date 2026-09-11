import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Star } from 'lucide-react'

interface Material {
  id: number
  name: string
  category: string
  price: number
  rating: number
  ecoFriendly: boolean
  durability: number
  image?: string
}

export default function MaterialsPage() {
  const { t } = useTranslation()
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Premium Marble', category: 'flooring', price: 150, rating: 4.8, ecoFriendly: false, durability: 95 },
    { id: 2, name: 'Bamboo Flooring', category: 'flooring', price: 80, rating: 4.5, ecoFriendly: true, durability: 85 },
    { id: 3, name: 'Sustainable Wood', category: 'doors', price: 120, rating: 4.7, ecoFriendly: true, durability: 90 },
    { id: 4, name: 'Ceramic Tiles', category: 'walls', price: 60, rating: 4.3, ecoFriendly: false, durability: 88 },
    { id: 5, name: 'Energy-Efficient Glass', category: 'windows', price: 200, rating: 4.9, ecoFriendly: true, durability: 92 },
    { id: 6, name: 'Eco Paint', category: 'finishes', price: 40, rating: 4.4, ecoFriendly: true, durability: 80 },
  ])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [ecoOnly, setEcoOnly] = useState(false)
  const [filteredMaterials, setFilteredMaterials] = useState(materials)

  const categories = ['flooring', 'walls', 'doors', 'windows', 'finishes', 'roofing', 'exterior']

  useEffect(() => {
    let filtered = materials
    if (search) {
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((m) => m.category === categoryFilter)
    }
    if (ecoOnly) {
      filtered = filtered.filter((m) => m.ecoFriendly)
    }
    setFilteredMaterials(filtered)
  }, [search, categoryFilter, ecoOnly, materials])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('materials')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('exploreMaterials')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchMaterials') || 'Search materials...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative flex items-center">
            <Filter className="absolute left-3 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="eco-friendly"
            checked={ecoOnly}
            onChange={(e) => setEcoOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="eco-friendly" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('ecoFriendlyOnly')}
          </label>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-40 bg-gradient-to-br from-green-400 to-blue-500"></div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {material.name}
                    </h3>
                    <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
                      {t(material.category)}
                    </span>
                  </div>
                  {material.ecoFriendly && (
                    <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs font-semibold text-green-700 dark:text-green-300">
                      {t('ecoFriendly')}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${material.price}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300">
                        {material.rating}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>{t('durability')}</span>
                      <span>{material.durability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${material.durability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">
                  {t('addToProject')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            {t('noMaterialsFound')}
          </p>
        </div>
      )}
    </div>
  )
}
