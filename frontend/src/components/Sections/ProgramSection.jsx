import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import { getScheduleData } from '../../data/schedule'

export default function ProgramSection() {
  const { t, language } = useLanguage()
  const { getProgramSettings } = useSettings()

  // Get program settings from database
  const programSettings = getProgramSettings()

  // Use schedule data from settings if available, otherwise use local data
  const getScheduleFromSettings = () => {
    if (programSettings.programData) {
      const data = programSettings.programData[language] || programSettings.programData.ru
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    }
    return getScheduleData(language)
  }
  const scheduleData = getScheduleFromSettings()

  const [activeDay, setActiveDay] = useState(1)
  const [slideDirection, setSlideDirection] = useState('right')

  // Swipe handling
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const activeDayRef = useRef(activeDay)

  // Keep ref in sync with state
  activeDayRef.current = activeDay

  const handleDayChange = useCallback((dayNum) => {
    if (dayNum !== activeDayRef.current && dayNum >= 1 && dayNum <= scheduleData.length) {
      setSlideDirection(dayNum > activeDayRef.current ? 'right' : 'left')
      setActiveDay(dayNum)
    }
  }, [scheduleData.length])

  // Touch event handlers for swipe
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    const startX = touchStartX.current
    const endX = touchEndX.current

    if (startX === 0 && endX === 0) return

    const swipeDistance = startX - endX
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && activeDayRef.current < scheduleData.length) {
        // Swiped left - go to next day
        handleDayChange(activeDayRef.current + 1)
      } else if (swipeDistance < 0 && activeDayRef.current > 1) {
        // Swiped right - go to previous day
        handleDayChange(activeDayRef.current - 1)
      }
    }

    // Reset values
    touchStartX.current = 0
    touchEndX.current = 0
  }, [scheduleData.length, handleDayChange])

  const currentDay = scheduleData.find(d => d.day === activeDay)

  // Determine event type for styling based on event type property
  const getEventType = (event) => {
    return event.type || 'default'
  }

  // Get PDF link based on current language
  const getPdfLink = () => {
    const pdfLinks = {
      ru: programSettings.pdfRu,
      en: programSettings.pdfEn,
      tj: programSettings.pdfTj,
    }
    // Return PDF for current language, fallback to Russian, or null if none set
    return pdfLinks[language] || pdfLinks.ru || null
  }

  const pdfLink = getPdfLink()

  return (
    <section className="program-section section" id="program" style={{ position: 'relative' }}>
      <div className="container">
        <div className="program__header reveal">
          <div className="program__header-content">
            <span className="program__badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {t('programSection.dateBadge')}
            </span>
            <h2 className="program__section-title">{t('programSection.title')}</h2>
            <p className="program__subtitle">
              {t('programSection.subtitle')}
            </p>
          </div>
          <div className="program__header-actions">
            <div className="program__stats">
              <div className="program__stat">
                <span className="program__stat-number">{scheduleData.length}</span>
                <span className="program__stat-label">{t('programSection.days')}</span>
              </div>
              <div className="program__stat">
                <span className="program__stat-number">20+</span>
                <span className="program__stat-label">{t('programSection.sessions')}</span>
              </div>
              <div className="program__stat">
                <span className="program__stat-number">150+</span>
                <span className="program__stat-label">{t('programSection.speakers')}</span>
              </div>
            </div>
            {pdfLink && (
              <a
                href={pdfLink}
                download
                className="program__download-pdf"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>{t('programSection.downloadPdf')}</span>
              </a>
            )}
          </div>
        </div>

        <div className="program__days-nav reveal">
          {scheduleData.map((day) => (
            <button
              key={day.day}
              onClick={() => handleDayChange(day.day)}
              className={`program__day-tab ${activeDay === day.day ? 'program__day-tab--active' : ''}`}
            >
              <span className="program__day-tab-num">{t('programSection.day')} {day.day}</span>
              <span className="program__day-tab-date">{day.date}</span>
            </button>
          ))}
        </div>

        {currentDay && (
          <div
            className="program__content reveal"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`program__day-panel program__day-panel--${slideDirection}`} key={activeDay}>
              <div className="program__day-header">
                <div className="program__day-info">
                  <span className="program__day-badge-large">{t('programSection.day')} {currentDay.day}</span>
                  <div className="program__day-details">
                    <span className="program__day-date">{currentDay.date}</span>
                    <h3 className="program__day-title">{currentDay.shortTitle}</h3>
                  </div>
                </div>
                <span className="program__events-count">{currentDay.events.length} {t('programSection.events')}</span>
              </div>

              <div className="schedule">
                {currentDay.events.map((event, index) => (
                  <div key={index} className={`schedule__item schedule__item--${getEventType(event)}`}>
                    <div className="schedule__time-block">
                      <span className="schedule__time">{event.time}</span>
                      <span className="schedule__timeline-dot"></span>
                    </div>
                    <div className="schedule__event">
                      <div className="schedule__event-header">
                        <h4 className="schedule__event-title">{event.title}</h4>
                      </div>
                      {event.description && (
                        <p className="schedule__event-desc">{event.description}</p>
                      )}
                      <div className="schedule__event-meta">
                        <span className="schedule__location">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Swipe hint for mobile */}
            <div className="program__swipe-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>{t('programSection.swipeHint')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            <div className="program__nav-arrows">
              <button
                className="program__nav-arrow program__nav-arrow--prev"
                onClick={() => handleDayChange(Math.max(1, activeDay - 1))}
                disabled={activeDay === 1}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                className="program__nav-arrow program__nav-arrow--next"
                onClick={() => handleDayChange(Math.min(scheduleData.length, activeDay + 1))}
                disabled={activeDay === scheduleData.length}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
