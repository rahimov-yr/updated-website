import LocalizedLink from '../LocalizedLink'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'

export default function Footer() {
  const { t, language } = useLanguage()
  const { getFooterSettings } = useSettings()

  // Get footer settings from database
  const footerSettings = getFooterSettings()

  // Language suffix for accessing language-specific settings
  const langKey = language === 'ru' ? 'Ru' : language === 'en' ? 'En' : 'Tj'

  // Logo URL from admin settings, with fallback
  const logoUrlMap = {
    ru: footerSettings.logoUrlRu,
    en: footerSettings.logoUrlEn,
    tj: footerSettings.logoUrlTj,
  }
  const currentLogoUrl = logoUrlMap[language] || logoUrlMap.en

  // Default quick links (fallback if not set in database)
  const defaultQuickLinks = [
    { id: 'about', path: '/', label_ru: 'О конференции', label_en: 'About', label_tj: 'Дар бораи конфронс' },
    { id: 'program', path: '/program', label_ru: 'Программа', label_en: 'Program', label_tj: 'Барнома' },
    { id: 'events', path: '/events', label_ru: 'Мероприятия', label_en: 'Events', label_tj: 'Чорабиниҳо' },
    { id: 'logistics', path: '/logistics', label_ru: 'Логистика', label_en: 'Logistics', label_tj: 'Логистика' },
  ]

  // Default participant links (fallback if not set in database)
  const defaultParticipantLinks = [
    { id: 'registration', path: '/registration', label_ru: 'Регистрация', label_en: 'Registration', label_tj: 'Бақайдгирӣ' },
    { id: 'media', path: '#', label_ru: 'Медиа-аккредитация', label_en: 'Media Accreditation', label_tj: 'Аккредитатсияи расона' },
    { id: 'excursions', path: '/excursions', label_ru: 'Экскурсии', label_en: 'Excursions', label_tj: 'Экскурсияҳо' },
    { id: 'exhibition', path: '/exhibition', label_ru: 'Выставка', label_en: 'Exhibition', label_tj: 'Намоишгоҳ' },
  ]

  // Use links from database if available, otherwise use defaults
  const quickLinks = footerSettings.quickLinks || defaultQuickLinks
  const participantLinks = footerSettings.participantLinks || defaultParticipantLinks

  // Get column titles from admin settings
  const quickLinksTitle = footerSettings.quickLinksTitle[language] || t('footer.quickLinks')
  const participantLinksTitle = footerSettings.participantLinksTitle[language] || t('footer.forParticipants')
  const contactsTitle = footerSettings.contactsTitle[language] || t('footer.contactsTitle')

  // Get label based on language
  const getLabel = (link) => {
    return link[`label_${language}`] || link.label_ru || link.label || ''
  }

  // Contact info from admin settings
  const address = footerSettings[`address${langKey}`] || 'Dushanbe, Tajikistan'
  const phone = footerSettings.phone || '+992 (37) 227-68-43'
  const email = footerSettings.email || 'secretariat@dushanbewaterprocess.org'

  // Copyright & organizer from admin settings
  const copyright = footerSettings[`copyright${langKey}`] || t('footer.copyright')
  const organizer = footerSettings[`organizer${langKey}`] || t('footer.organizer')

  // Social links
  const socialLinks = {
    facebook: footerSettings.socialFacebook,
    instagram: footerSettings.socialInstagram,
    twitter: footerSettings.socialTwitter,
  }

  return (
    <footer className="footer" id="contacts">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo-wrapper">
              <img
                src={currentLogoUrl}
                alt="Water Conference 2026"
                className="footer__logo-img"
              />
            </div>
            <div className="footer__socials">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} className="footer__social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {/* Show placeholder icons if no social links are set */}
              {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.twitter && (
                <>
                  <a href="#" className="footer__social-link" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  <a href="#" className="footer__social-link" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="footer__social-link" aria-label="Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__links-column">
              <h4 className="footer__links-title">{quickLinksTitle}</h4>
              <ul className="footer__links-list">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    {link.path.startsWith('http') ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer">{getLabel(link)}</a>
                    ) : link.path === '#' ? (
                      <a href="#">{getLabel(link)}</a>
                    ) : (
                      <LocalizedLink to={link.path}>{getLabel(link)}</LocalizedLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h4 className="footer__links-title">{participantLinksTitle}</h4>
              <ul className="footer__links-list">
                {participantLinks.map((link) => (
                  <li key={link.id}>
                    {link.path.startsWith('http') ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer">{getLabel(link)}</a>
                    ) : link.path === '#' ? (
                      <a href="#">{getLabel(link)}</a>
                    ) : (
                      <LocalizedLink to={link.path}>{getLabel(link)}</LocalizedLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h4 className="footer__links-title">{contactsTitle}</h4>
              <ul className="footer__links-list footer__links-list--contacts">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{address}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{phone}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p className="footer__copyright">
              {copyright}
            </p>
          </div>
          <div className="footer__bottom-right">
            <span className="footer__organizer-text">{organizer}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
