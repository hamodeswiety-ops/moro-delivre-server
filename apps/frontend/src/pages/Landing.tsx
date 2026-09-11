import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
                >
                  {t('getStarted')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  {t('login')}
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            {t('features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-blue-900 p-8 rounded-lg hover:shadow-lg transition">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('feature1')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('feature1Desc')}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-8 rounded-lg hover:shadow-lg transition">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('feature2')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('feature2Desc')}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-8 rounded-lg hover:shadow-lg transition">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('feature3')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {t('readyToStart')}
          </h2>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
          >
            {t('startFree')}
          </Link>
        </div>
      </section>
    </div>
  )
}
