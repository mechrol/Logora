import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                {t('selectLanguage')}
              </div>
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    changeLanguage(language.code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLanguage === language.code
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLanguage === language.code && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector
