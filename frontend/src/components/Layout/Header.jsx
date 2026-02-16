import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import LocalizedLink from '../LocalizedLink'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import { stripLanguagePrefix } from '../../utils/languageRouting'
import { TwitterIcon, InstagramIcon, FacebookIcon, ChevronDownIcon } from '../Icons'

// Mobile Navigation Item Component
function MobileNavItem({ item, onClose, isOpen, onToggle }) {
  const handleClick = () => {
    if (item.hasDropdown) {
      onToggle()
    } else {
      onClose()
    }
  }

  return (
    <li className={`header-mobile__nav-item ${isOpen ? 'header-mobile__nav-item--open' : ''}`}>
      {item.hasDropdown ? (
        <>
          <button className="header-mobile__nav-link" onClick={handleClick}>
            {item.label}
            <ChevronDownIcon />
          </button>
          <div className="header-mobile__nav-dropdown">
            {item.dropdown.map((subItem, index) => (
              <LocalizedLink
                key={index}
                to={subItem.path}
                className="header-mobile__nav-dropdown-link"
                onClick={onClose}
              >
                {subItem.label}
              </LocalizedLink>
            ))}
          </div>
        </>
      ) : (
        <LocalizedLink to={item.path} className="header-mobile__nav-link" onClick={onClose}>
          {item.label}
        </LocalizedLink>
      )}
    </li>
  )
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null)
  const navbarRef = useRef(null)
  const langDropdownRef = useRef(null)
  const mobileLangDropdownRef = useRef(null)
  const location = useLocation()
  const { language, setLanguage, t, languages } = useLanguage()
  const { getHeaderSettings, loading } = useSettings()

  // Get header settings from database
  const headerSettings = getHeaderSettings()

  // Get current language data
  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  // Logo URLs - using new conference logos directly
  const logoUrls = {
    ru: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_ru.png',
    en: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_eng.png',
    tj: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_taj.png',
  }
  const currentLogoUrl = logoUrls[language] || logoUrls.en

  // Compact logos for sticky navbar and mobile header
  const compactLogoUrls = {
    ru: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_el_ru.png',
    en: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_el_eng.png',
    tj: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_el_taj.png',
  }
  const compactLogoUrl = compactLogoUrls[language] || compactLogoUrls.en

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const inStickyLang = langDropdownRef.current && langDropdownRef.current.contains(event.target)
      const inMobileLang = mobileLangDropdownRef.current && mobileLangDropdownRef.current.contains(event.target)
      if (!inStickyLang && !inMobileLang) {
        setIsLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      document.body.dataset.scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.classList.add('mobile-menu-open')
    } else {
      // Reset all dropdown states when menu closes
      setOpenDropdownIndex(null)
      // Restore scroll position
      document.body.style.overflow = ''
      document.body.classList.remove('mobile-menu-open')
      delete document.body.dataset.scrollY
    }

    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('mobile-menu-open')
      delete document.body.dataset.scrollY
    }
  }, [isMobileMenuOpen])

  // Track when navbar becomes sticky
  useEffect(() => {
    const navbar = navbarRef.current
    if (!navbar) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavSticky(!entry.isIntersecting)
      },
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px'
      }
    )

    observer.observe(navbar)
    return () => observer.disconnect()
  }, [])

  // Default navigation data (fallback if not set in database) - UPDATED 2026-02-01
  const defaultNavigationData = [
    {
      id: 'conference',
      label_ru: 'Конференции',
      label_en: 'Conference',
      label_tj: 'Конфронс',
      path: '/conference',
      hasDropdown: true,
      submenus: [
        { id: 'intro', path: '/conference/introduction', label_ru: 'Введение', label_en: 'Introduction', label_tj: 'Муқаддима' },
        { id: 'goals', path: '/conference/goals', label_ru: 'Цели', label_en: 'Goals', label_tj: 'Мақсадҳо' },
        { id: 'date-venue', path: '/conference/date-venue', label_ru: 'Дата и место проведения', label_en: 'Date and Venue', label_tj: 'Сана ва макон' },
        { id: 'participation', path: '/conference/participation', label_ru: 'Участие', label_en: 'Participation', label_tj: 'Иштирок' },
      ],
    },
    {
      id: 'program',
      label_ru: 'Программа',
      label_en: 'Program',
      label_tj: 'Барнома',
      path: '/program',
      hasDropdown: true,
      submenus: [
        { id: 'structure', path: '/program/structure', label_ru: 'Структура программы', label_en: 'Program Structure', label_tj: 'Сохтори барнома' },
        { id: 'plenary', path: '/program/plenary', label_ru: 'Пленарное заседание', label_en: 'Plenary Session', label_tj: 'Ҷаласаи пленарӣ' },
        { id: 'events', path: '/program/events', label_ru: 'Мероприятия в рамках конференции', label_en: 'Conference Events', label_tj: 'Чорабиниҳои конфронс' },
        { id: 'forums', path: '/program/forums', label_ru: 'Форумы', label_en: 'Forums', label_tj: 'Форумҳо' },
      ],
    },
    {
      id: 'events',
      label_ru: 'Мероприятия',
      label_en: 'Events',
      label_tj: 'Чорабиниҳо',
      path: '/events',
      hasDropdown: true,
      submenus: [
        { id: 'parallel-events', path: '/events/parallel', label_ru: 'Параллельные мероприятия', label_en: 'Parallel Events', label_tj: 'Чорабиниҳои паралелӣ' },
        { id: 'cultural-events', path: '/events/cultural', label_ru: 'Культурные мероприятия', label_en: 'Cultural Events', label_tj: 'Чорабиниҳои фарҳангӣ' },
      ],
    },
    {
      id: 'exhibition',
      label_ru: 'Выставка',
      label_en: 'Exhibition',
      label_tj: 'Намоишгоҳ',
      path: '/exhibition',
      hasDropdown: false,
      submenus: [],
    },
    {
      id: 'excursions',
      label_ru: 'Экскурсии',
      label_en: 'Excursions',
      label_tj: 'Экскурсияҳо',
      path: '/excursions',
      hasDropdown: false,
      submenus: [],
    },
    {
      id: 'logistics',
      label_ru: 'Логистика',
      label_en: 'Logistics',
      label_tj: 'Логистика',
      path: '/logistics',
      hasDropdown: true,
      submenus: [
        { id: 'practical-info', path: '/logistics/practical', label_ru: 'Практическая информация', label_en: 'Practical Information', label_tj: 'Маълумоти амалӣ' },
        { id: 'visa', path: '/logistics/visa', label_ru: 'Виза в Таджикистан', label_en: 'Visa to Tajikistan', label_tj: 'Равoдиди Тоҷикистон' },
        { id: 'press', path: '/logistics/press', label_ru: 'Аккредитация прессы', label_en: 'Press Accreditation', label_tj: 'Аккредитатсияи матбуот' },
        { id: 'flights', path: '/logistics/flights', label_ru: 'Авиарейсы', label_en: 'Flights', label_tj: 'Парвозҳо' },
        { id: 'accommodation', path: '/logistics/accommodation', label_ru: 'Размещение в гостинице', label_en: 'Hotel Accommodation', label_tj: 'Ҷойгиршавӣ дар меҳмонхона' },
      ],
    },
    {
      id: 'registration',
      label_ru: 'Регистрация',
      label_en: 'Registration',
      label_tj: 'Бақайдгирӣ',
      path: '/registration',
      hasDropdown: false,
      isButton: true,
      submenus: [],
    },
    {
      id: 'contacts',
      label_ru: 'Контакты',
      label_en: 'Contacts',
      label_tj: 'Тамос',
      path: '/contacts',
      hasDropdown: false,
      submenus: [],
    },
    {
      id: 'water-decade',
      label_ru: 'Водное десятилетие',
      label_en: 'Water Decade',
      label_tj: 'Даҳсолаи об',
      path: '/water-decade',
      hasDropdown: false,
      isSpecialButton: true,
      submenus: [],
    },
  ]

  // Use navigation from database if available, otherwise use default
  // Ensure 'excursions' item is always present (may be missing in older saved configs)
  let rawNavigation = headerSettings.navigation || defaultNavigationData
  if (Array.isArray(rawNavigation) && !rawNavigation.find(item => item.id === 'excursions')) {
    const excursionsItem = defaultNavigationData.find(item => item.id === 'excursions')
    const exhibitionIndex = rawNavigation.findIndex(item => item.id === 'exhibition')
    if (excursionsItem) {
      rawNavigation = [...rawNavigation]
      rawNavigation.splice(exhibitionIndex + 1, 0, excursionsItem)
    }
  }

  // Transform navigation data for display
  const navigationData = rawNavigation.map(item => ({
    label: item[`label_${language}`] || item.label_ru || item.label,
    path: item.path,
    hasDropdown: item.hasDropdown && item.submenus && item.submenus.length > 0,
    isRegister: item.isButton || item.id === 'registration',
    isWaterDecade: item.isSpecialButton || item.id === 'water-decade',
    dropdown: item.submenus ? item.submenus.map(sub => ({
      label: sub[`label_${language}`] || sub.label_ru || sub.label,
      path: sub.path,
    })) : [],
  }))

  // Get title based on language
  const getTitleLines = () => {
    const title = language === 'en' ? headerSettings.titleEn :
                  language === 'tj' ? headerSettings.titleTj :
                  headerSettings.titleRu

    // If title has newlines, use it
    if (title && title.trim() && title.includes('\n')) {
      return title.split('\n').filter(line => line.trim())
    }

    // Fallback to translation keys (ensures consistent multi-line display)
    return [
      t('header.titleLine1'),
      t('header.titleLine2'),
      t('header.titleLine3'),
      t('header.titleLine4'),
    ].filter(line => line && !line.startsWith('header.'))
  }

  const titleLines = getTitleLines()

  // Handle navigation link clicks - scroll to section or top of page
  const cleanPathname = stripLanguagePrefix(location.pathname)

  const handleNavClick = (e, path) => {
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#')
      const targetPath = pathname || '/'

      // If we're already on the target page, just scroll
      if (cleanPathname === targetPath) {
        e.preventDefault()
        const element = document.getElementById(hash)
        if (element) {
          const headerOffset = 120
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }
      // Otherwise, let the Link navigate and ScrollToHash in App.jsx will handle scrolling
    } else if (path === '/' && cleanPathname === '/') {
      // If clicking home link while on home page, scroll to top
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const isActivePath = (path) => {
    if (path === '/') return cleanPathname === '/'
    return cleanPathname.startsWith(path)
  }

  // Social links from settings
  const socialLinks = {
    twitter: headerSettings.socialTwitter,
    instagram: headerSettings.socialInstagram,
    facebook: headerSettings.socialFacebook,
  }

  // Render navigation content (reusable for both normal and sticky versions)
  const renderNavigation = () => (
    <>
      <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
        <ul className="nav__list">
          {navigationData.map((item, index) => (
            <li
              key={index}
              className={`nav__item ${item.hasDropdown ? 'nav__item--dropdown' : ''} ${item.isRegister ? 'nav__item--register' : ''} ${item.isWaterDecade ? 'nav__item--water-decade' : ''}`}
              onMouseEnter={() => item.hasDropdown && setOpenDesktopDropdown(index)}
              onMouseLeave={() => item.hasDropdown && setOpenDesktopDropdown(null)}
            >
              {item.hasDropdown ? (
                <button
                  className={`nav__link ${isActivePath(item.path) ? 'nav__link--active' : ''}`}
                  type="button"
                  onClick={() => setOpenDesktopDropdown(openDesktopDropdown === index ? null : index)}
                >
                  {item.label}
                  <ChevronDownIcon />
                </button>
              ) : (
                <LocalizedLink
                  to={item.path}
                  className={`nav__link ${isActivePath(item.path) ? 'nav__link--active' : ''}`}
                >
                  {item.label}
                </LocalizedLink>
              )}
              {item.hasDropdown && (
                <ul className={`nav__dropdown ${openDesktopDropdown === index ? 'nav__dropdown--open' : ''}`}>
                  {item.dropdown.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <LocalizedLink
                        to={subItem.path}
                        className={`nav__dropdown-link ${isActivePath(subItem.path) ? 'nav__dropdown-link--active' : ''}`}
                        onClick={(e) => {
                          handleNavClick(e, subItem.path)
                          setOpenDesktopDropdown(null)
                        }}
                      >
                        {subItem.label}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <button
        className={`nav__toggle ${isMobileMenuOpen ? 'nav__toggle--open' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Menu"
      >
        <span className="nav__toggle-bar"></span>
        <span className="nav__toggle-bar"></span>
        <span className="nav__toggle-bar"></span>
      </button>
    </>
  )

  return (
    <>
      {/* Mobile Header - Logo | Lang Dropdown | Menu */}
      <div className="header-mobile">
        <div className="header-mobile__container">
          <LocalizedLink to="/" className="header-mobile__logo">
            <img src={compactLogoUrl} alt="Conference Logo" />
          </LocalizedLink>

          <div className="header-mobile__lang" ref={mobileLangDropdownRef}>
            <button
              className="header-mobile__lang-toggle"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              <img src={currentLang.flag} alt={currentLang.label} />
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDownIcon />
            </button>
            {isLangDropdownOpen && (
              <div className="header-mobile__lang-dropdown">
                {languages.filter(lang => lang.code !== language).map((lang) => (
                  <button
                    key={lang.code}
                    className="header-mobile__lang-option"
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsLangDropdownOpen(false)
                    }}
                  >
                    <img src={lang.flag} alt={lang.label} />
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`header-mobile__menu-toggle ${isMobileMenuOpen ? 'header-mobile__menu-toggle--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - outside header-mobile to avoid backdrop-filter stacking context issues */}
      <nav className={`header-mobile__nav ${isMobileMenuOpen ? 'header-mobile__nav--open' : ''}`}>
        <ul className="header-mobile__nav-list">
          {navigationData.map((item, index) => (
            <MobileNavItem
              key={index}
              item={item}
              onClose={() => setIsMobileMenuOpen(false)}
              isOpen={openDropdownIndex === index}
              onToggle={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
            />
          ))}
        </ul>
      </nav>

      {/* Top Header with pattern - scrolls away (Desktop only) */}
      <div className="header-wrapper">
        <div className="header-wrapper__pattern"></div>
        <header className="header">
          <div className="header__top">
            <div className="container">
              <div className="header__top-content">
                <LocalizedLink to="/" className="header__logo">
                  <img
                    src={currentLogoUrl}
                    alt="Conference Logo"
                    className="header__logo-img"
                  />
                </LocalizedLink>

                <div className="header__actions">
                  <div className="header__lang-buttons">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`header__lang-btn ${language === lang.code ? 'header__lang-btn--active' : ''}`}
                        onClick={() => setLanguage(lang.code)}
                      >
                        <img src={lang.flag} alt={lang.label} className="header__lang-btn-flag" />
                        <span>{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  <div className="header__socials">
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} className="header__social-link header__social-link--twitter" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                        <TwitterIcon />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} className="header__social-link header__social-link--instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon />
                      </a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} className="header__social-link header__social-link--facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon />
                      </a>
                    )}
                    {/* Show placeholder icons if no social links are set */}
                    {!socialLinks.twitter && !socialLinks.instagram && !socialLinks.facebook && (
                      <>
                        <a href="#" className="header__social-link header__social-link--twitter" aria-label="Twitter">
                          <TwitterIcon />
                        </a>
                        <a href="#" className="header__social-link header__social-link--instagram" aria-label="Instagram">
                          <InstagramIcon />
                        </a>
                        <a href="#" className="header__social-link header__social-link--facebook" aria-label="Facebook">
                          <FacebookIcon />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Navigation row - sticky at top (outside wrapper for proper sticky behavior) */}
      <nav ref={navbarRef} className={`navbar-sticky ${isNavSticky ? 'navbar-sticky--stuck' : ''}`}>
        <div className="container">
          <div className="navbar-sticky__content">
            {/* Mini logo - only visible when sticky */}
            <LocalizedLink to="/" className="navbar-sticky__logo">
              <img
                src={compactLogoUrl}
                alt="Conference Logo"
                className="navbar-sticky__logo-img"
              />
            </LocalizedLink>

            {renderNavigation()}

            {/* Language dropdown - only visible when sticky */}
            <div className="navbar-sticky__lang" ref={langDropdownRef}>
              <button
                className="navbar-sticky__lang-toggle"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                <img src={currentLang.flag} alt={currentLang.label} className="navbar-sticky__lang-flag" />
                <span>{currentLang.code.toUpperCase()}</span>
                <ChevronDownIcon />
              </button>
              {isLangDropdownOpen && (
                <div className="navbar-sticky__lang-dropdown">
                  {languages.filter(lang => lang.code !== language).map((lang) => (
                    <button
                      key={lang.code}
                      className="navbar-sticky__lang-option"
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLangDropdownOpen(false)
                      }}
                    >
                      <img src={lang.flag} alt={lang.label} className="navbar-sticky__lang-flag" />
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
