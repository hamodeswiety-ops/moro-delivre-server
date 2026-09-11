import { useTranslation } from 'react-i18next'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">Dream Homes</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.products')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">{t('designStudio')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('materials')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('analytics')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">{t('about')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('careers')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Dream Homes. {t('footer.rights')}
          </p>
          <div className="flex space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">{t('privacy')}</a>
            <a href="#" className="hover:text-white transition">{t('terms')}</a>
            <a href="#" className="hover:text-white transition">{t('cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
