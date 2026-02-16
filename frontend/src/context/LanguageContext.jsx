import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { translations } from '../i18n/translations'
import { getLanguageFromPath, stripLanguagePrefix, localizedPath } from '../utils/languageRouting'
import { useSettings } from './SettingsContext'

const LanguageContext = createContext()

export const languages = [
  { code: 'en', label: 'English', flag: 'https://flagicons.lipis.dev/flags/4x3/gb.svg' },
  { code: 'ru', label: 'Русский', flag: 'https://flagicons.lipis.dev/flags/4x3/ru.svg' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagicons.lipis.dev/flags/4x3/tj.svg' },
]

export function LanguageProvider({ children }) {
  const location = useLocation()
  const { getSiteTitleSettings } = useSettings()

  const [language, setLanguageState] = useState(() => {
    const urlLang = getLanguageFromPath(window.location.pathname)
    if (urlLang) {
      localStorage.setItem('language', urlLang)
      return urlLang
    }
    const saved = localStorage.getItem('language')
    return saved && languages.some(l => l.code === saved) ? saved : 'en'
  })

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }

    return value || key
  }, [language])

  // Sync language from URL on route changes
  useEffect(() => {
    const urlLang = getLanguageFromPath(location.pathname)
    if (urlLang && urlLang !== language) {
      setLanguageState(urlLang)
      localStorage.setItem('language', urlLang)
    }
  }, [location.pathname])

  // Update document title when language changes
  useEffect(() => {
    const siteTitleSettings = getSiteTitleSettings()
    // Get title from settings (admin panel) or fall back to translations
    let siteTitle = ''
    if (language === 'en' && siteTitleSettings.titleEn) {
      siteTitle = siteTitleSettings.titleEn
    } else if (language === 'ru' && siteTitleSettings.titleRu) {
      siteTitle = siteTitleSettings.titleRu
    } else if (language === 'tj' && siteTitleSettings.titleTj) {
      siteTitle = siteTitleSettings.titleTj
    } else {
      // Fallback to translations
      siteTitle = translations[language]?.siteTitle
    }

    if (siteTitle) {
      document.title = siteTitle
    }
  }, [language, getSiteTitleSettings])

  // Language switcher: changes language and updates URL without full navigation
  const changeLanguage = useCallback((lang) => {
    if (!languages.some(l => l.code === lang)) return

    setLanguageState(lang)
    localStorage.setItem('language', lang)

    // Don't update URL if on admin routes
    if (location.pathname.startsWith('/admin')) return

    const cleanPath = stripLanguagePrefix(location.pathname)
    const newPath = localizedPath(cleanPath, lang)
    const fullPath = newPath + location.search + location.hash

    // Use history.replaceState to update URL without triggering React Router navigation
    // This prevents component remounting and page scroll reset
    window.history.replaceState(null, '', fullPath)
  }, [location])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
