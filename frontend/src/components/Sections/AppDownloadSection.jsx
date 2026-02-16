import { AppleIcon, GooglePlayIcon } from '../Icons'
import { useLanguage } from '../../context/LanguageContext'

export default function AppDownloadSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      titleKey: 'appSection.feature1Title',
      descKey: 'appSection.feature1Desc',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      titleKey: 'appSection.feature2Title',
      descKey: 'appSection.feature2Desc',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      titleKey: 'appSection.feature3Title',
      descKey: 'appSection.feature3Desc',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      titleKey: 'appSection.feature4Title',
      descKey: 'appSection.feature4Desc',
    },
  ]

  return (
    <section className="app-section section" id="app" style={{ position: 'relative', zIndex: 0 }}>
      <div className="app-section__bg">
        <div className="app-section__bg-gradient"></div>
        <div className="app-section__bg-pattern"></div>
        <div className="app-section__bg-glow app-section__bg-glow--1"></div>
        <div className="app-section__bg-glow app-section__bg-glow--2"></div>
      </div>

      <div className="container">
        <div className="app-section__content reveal">
          <div className="app-section__info">
            <span className="app-section__badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
              {t('appSection.badge')}
            </span>

            <h2 className="app-section__title">
              {t('appSection.titlePart1')}
              <span className="app-section__title-highlight">{t('appSection.titlePart2')}</span>
            </h2>

            <p className="app-section__desc">
              {t('appSection.description')}
            </p>

            <div className="app-section__features">
              {features.map((feature, index) => (
                <div key={index} className="app-section__feature">
                  <div className="app-section__feature-icon">
                    {feature.icon}
                  </div>
                  <div className="app-section__feature-content">
                    <span className="app-section__feature-title">{t(feature.titleKey)}</span>
                    <span className="app-section__feature-desc">{t(feature.descKey)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="app-section__buttons">
              <a href="#" className="app-section__btn app-section__btn--apple">
                <AppleIcon />
                <div className="app-section__btn-text">
                  <span>{t('appSection.downloadOn')}</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="app-section__btn app-section__btn--google">
                <GooglePlayIcon />
                <div className="app-section__btn-text">
                  <span>{t('appSection.availableOn')}</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>

          <div className="app-section__mockup">
            <div className="app-section__phone-wrapper">
              <div className="app-section__phone-glow"></div>
              <div className="app-section__phone">
                <div className="app-section__phone-frame">
                  <div className="app-section__phone-speaker"></div>
                  <div className="app-section__phone-camera"></div>
                </div>
                <div className="app-section__phone-screen">
                  <div className="app-section__screen-statusbar">
                    <span>9:41</span>
                    <div className="app-section__screen-statusbar-icons">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" opacity="0"/>
                        <rect x="1" y="7" width="3" height="10" rx="1"/>
                        <rect x="5" y="5" width="3" height="12" rx="1"/>
                        <rect x="9" y="3" width="3" height="14" rx="1"/>
                        <rect x="13" y="6" width="3" height="11" rx="1"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="14">
                        <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
                        <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor"/>
                        <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>

                  <div className="app-section__screen-header">
                    <div className="app-section__screen-logo">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <defs>
                          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9"/>
                            <stop offset="100%" stopColor="#3b82f6"/>
                          </linearGradient>
                        </defs>
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="url(#waterGradient)"/>
                      </svg>
                      <span>{t('appSection.appName')}</span>
                    </div>
                    <span className="app-section__screen-date">{t('appSection.dateShort')}</span>
                  </div>

                  <div className="app-section__screen-content">
                    <div className="app-section__screen-card app-section__screen-card--featured">
                      <div className="app-section__screen-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div className="app-section__screen-card-info">
                        <span className="app-section__screen-card-label">{t('appSection.nextEvent')}</span>
                        <span className="app-section__screen-card-title">{t('appSection.plenarySession')}</span>
                        <span className="app-section__screen-card-time">{t('appSection.sessionTime')}</span>
                      </div>
                    </div>

                    <div className="app-section__screen-grid">
                      <div className="app-section__screen-item">
                        <div className="app-section__screen-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <span>{t('appSection.schedule')}</span>
                      </div>
                      <div className="app-section__screen-item">
                        <div className="app-section__screen-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <span>{t('appSection.map')}</span>
                      </div>
                      <div className="app-section__screen-item">
                        <div className="app-section__screen-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <span>{t('appSection.speakersMenu')}</span>
                      </div>
                      <div className="app-section__screen-item">
                        <div className="app-section__screen-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                          </svg>
                        </div>
                        <span>{t('appSection.materials')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="app-section__screen-nav">
                    <div className="app-section__screen-nav-item app-section__screen-nav-item--active">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div className="app-section__screen-nav-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className="app-section__screen-nav-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="app-section__screen-nav-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>

                  <div className="app-section__screen-homebar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
