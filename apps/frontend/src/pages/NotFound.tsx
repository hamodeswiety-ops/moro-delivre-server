import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4 animate-bounce">404</h1>
          <h2 className="text-4xl font-bold mb-4">{t('pageNotFound')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('pageNotFoundDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
          >
            <Home className="mr-2 w-5 h-5" />
            {t('backToHome')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            {t('goBack')}
          </button>
        </div>
      </div>
    </div>
  )
}
