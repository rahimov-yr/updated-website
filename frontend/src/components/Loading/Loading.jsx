import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import './Loading.css'

export default function Loading({ onLoadingComplete }) {
  const { t, language } = useLanguage()
  const { getLoadingSettings } = useSettings()
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  const loadingSettings = getLoadingSettings()

  // Get language suffix for settings
  const langKey = language === 'ru' ? 'Ru' : language === 'en' ? 'En' : 'Tj'

  // Use admin settings if available, otherwise fall back to i18n translations
  const line1 = loadingSettings[`titleLine1${langKey}`] || t('header.titleLine5')
  const line2 = loadingSettings[`titleLine2${langKey}`] || t('header.titleLine1')
  const line3 = loadingSettings[`titleLine3${langKey}`] || t('header.titleLine2')
  const line4 = loadingSettings[`titleLine4${langKey}`] || t('header.titleLine3')
  const line5 = loadingSettings[`titleLine5${langKey}`] || t('header.titleLine4')
  const logoUrl = loadingSettings.logoUrl || '/assets/images/logo-mini.png'
  const duration = parseFloat(loadingSettings.duration) || 2
  const fadeTime = 0.5

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
    }, duration * 1000)

    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      if (onLoadingComplete) {
        onLoadingComplete()
      }
    }, (duration + fadeTime) * 1000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onLoadingComplete, duration])

  if (!isVisible) return null

  const bgStyle = {
    background: `linear-gradient(135deg, ${loadingSettings.bgColorStart} 0%, ${loadingSettings.bgColorMid} 50%, ${loadingSettings.bgColorEnd} 100%)`,
  }

  return (
    <div className={`loading ${isFading ? 'loading--fading' : ''}`} style={bgStyle}>
      <div className="loading__content">
        <div className="loading__logo-wrapper">
          <img
            src={logoUrl}
            alt="Water Conference 2026"
            className="loading__logo"
          />
          <div className="loading__logo-glow"></div>
        </div>

        <div className="loading__text">
          <span className="loading__years">{line1}</span>
          <h1 className="loading__title">
            <span>{line2}</span>
            <span>{line3}</span>
            <span>{line4}</span>
          </h1>
          <span className="loading__date" style={{ color: loadingSettings.dateColor }}>{line5}</span>
        </div>

        <div className="loading__spinner">
          <div className="loading__spinner-ring"></div>
          <div className="loading__spinner-ring"></div>
          <div className="loading__spinner-ring"></div>
        </div>

      </div>

      <div className="loading__water-effect">
        <div className="loading__wave loading__wave--1"></div>
        <div className="loading__wave loading__wave--2"></div>
        <div className="loading__wave loading__wave--3"></div>
      </div>
    </div>
  )
}
