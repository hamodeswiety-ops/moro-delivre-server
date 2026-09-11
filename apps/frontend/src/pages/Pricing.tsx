import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

interface PricingPlan {
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

export default function PricingPage() {
  const { t } = useTranslation()
  const [area, setArea] = useState(1000)
  const [propertyType, setPropertyType] = useState('villa')
  const [complexity, setComplexity] = useState('medium')

  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 2500,
      description: 'Perfect for small projects',
      features: [
        'Up to 1000 sq ft',
        'Basic design',
        '2D layouts',
        'Material suggestions',
        'Basic pricing',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      price: 5000,
      description: 'Most popular for home builders',
      features: [
        'Up to 3000 sq ft',
        'Advanced design',
        '3D visualization',
        'Material catalog',
        'Detailed pricing',
        'Cost optimization',
        'Priority support',
        'Custom layouts',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 10000,
      description: 'For premium projects',
      features: [
        'Unlimited area',
        'Premium design',
        'Full 3D simulation',
        'All materials',
        'Finance planning',
        'Payment plans',
        '24/7 support',
        'Dedicated manager',
        'Custom features',
      ],
    },
  ]

  const basePrice = propertyType === 'villa' ? 3000 : propertyType === 'mansion' ? 5000 : 2500
  const complexityMultiplier = complexity === 'simple' ? 1 : complexity === 'medium' ? 1.2 : 1.35
  const baseCalculation = (area / 1000) * basePrice * complexityMultiplier
  const labor = baseCalculation * 0.35
  const contingency = baseCalculation * 0.1
  const tax = (baseCalculation + labor) * 0.15
  const totalCost = baseCalculation + labor + contingency + tax

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pricing')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('chooseYourPlan')}
        </p>
      </div>

      {/* Calculator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('costCalculator')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {t('property')}
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-600"
            >
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="mansion">Mansion</option>
              <option value="duplex">Duplex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {t('area')} (sq ft)
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {t('complexity')}
            </label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-600"
            >
              <option value="simple">{t('simple')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="complex">{t('complex')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('materials')}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${(baseCalculation / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('labor')}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${(labor / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('contingency')}</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${(contingency / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('tax')}</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${(tax / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg text-white">
            <p className="text-sm opacity-90">{t('total')}</p>
            <p className="text-2xl font-bold">
              ${(totalCost / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {t('selectPlan')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg border-2 overflow-hidden transition ${
                plan.popular
                  ? 'border-primary-600 ring-2 ring-primary-600 transform lg:scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              } ${plan.popular ? 'bg-white dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 text-sm font-semibold">
                  {t('popular')}
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/project</span>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t('choosePlan')}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{t(feature)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
