import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    return saved === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('admin-expanded-sections')
    return saved ? JSON.parse(saved) : { 'Главная страница': true }
  })

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', isCollapsed)
  }, [isCollapsed])

  // Save expanded sections to localStorage
  useEffect(() => {
    localStorage.setItem('admin-expanded-sections', JSON.stringify(expandedSections))
  }, [expandedSections])

  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('.admin-user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isUserMenuOpen])

  // Listen for sidebar collapse requests from child pages
  useEffect(() => {
    const handleCollapseSidebar = () => {
      setIsCollapsed(true)
    }
    window.addEventListener('admin-collapse-sidebar', handleCollapseSidebar)
    return () => window.removeEventListener('admin-collapse-sidebar', handleCollapseSidebar)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Page-based navigation structure
  const navSections = [
    {
      title: 'Обзор',
      items: [
        { path: '/admin', label: 'Панель управления', icon: 'dashboard', end: true },
      ]
    },
    {
      title: null,
      items: [
        { path: '/admin/home', label: 'Главная страница', icon: 'home' },
        { path: '/admin/pages', label: 'Страницы', icon: 'pages' },
      ]
    },
    {
      title: 'Контент',
      items: [
        { path: '/admin/content/news', label: 'Все новости', icon: 'article' },
      ]
    },
    {
      title: 'Система',
      items: [
        { path: '/admin/banners', label: 'Баннеры страниц', icon: 'image' },
        { path: '/admin/settings', label: 'Настройки сайта', icon: 'settings' },
      ]
    },
  ]

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile header */}
      <header className="admin-mobile-header">
        <button className="admin-mobile-menu-btn" onClick={toggleMobileMenu}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <div className="admin-mobile-logo">
          <img src="/assets/images/logo-compact.png" alt="Logo" />
          <span>Панель администратора</span>
        </div>
      </header>

      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-wrapper">
            <img
              src="/assets/images/logo-compact.png"
              alt="Logo"
              className="admin-logo-img"
            />
          </div>
          {!isCollapsed && (
            <div className="admin-logo-text">
              <span>Панель</span>
              <span>администратора</span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button className="admin-collapse-btn" onClick={toggleSidebar} title={isCollapsed ? 'Развернуть' : 'Свернуть'}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className={isCollapsed ? 'rotated' : ''}>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <nav className="admin-nav">
          {navSections.map((section, idx) => (
            <div key={idx} className="admin-nav-section">
              {section.collapsible ? (
                <>
                  <button
                    className={`admin-nav-section-header ${expandedSections[section.title] ? 'expanded' : ''}`}
                    onClick={() => toggleSection(section.title)}
                    title={isCollapsed ? section.title : undefined}
                  >
                    <span className="admin-nav-icon">{getIcon(section.icon)}</span>
                    {!isCollapsed && (
                      <>
                        <span className="admin-nav-section-label">{section.title}</span>
                        <svg className="admin-nav-chevron" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </>
                    )}
                  </button>
                  {(expandedSections[section.title] || isCollapsed) && (
                    <div className={`admin-nav-subitems ${isCollapsed ? 'collapsed-mode' : ''}`}>
                      {section.items.map((item) => (
                        item.disabled ? (
                          <div
                            key={item.path}
                            className="admin-nav-item admin-nav-subitem disabled"
                            title={isCollapsed ? item.label : undefined}
                          >
                            <span className="admin-nav-icon">{getIcon(item.icon)}</span>
                            {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
                            {!isCollapsed && <span className="admin-nav-soon">Скоро</span>}
                          </div>
                        ) : (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                              `admin-nav-item admin-nav-subitem ${isActive ? 'active' : ''}`
                            }
                            title={isCollapsed ? item.label : undefined}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="admin-nav-icon">{getIcon(item.icon)}</span>
                            {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
                          </NavLink>
                        )
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!isCollapsed && section.title && <div className="admin-nav-section-title">{section.title}</div>}
                  {section.items.map((item) => (
                    item.disabled ? (
                      <div
                        key={item.path}
                        className="admin-nav-item disabled"
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span className="admin-nav-icon">{getIcon(item.icon)}</span>
                        {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
                        {!isCollapsed && <span className="admin-nav-soon">Скоро</span>}
                      </div>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                          `admin-nav-item ${isActive ? 'active' : ''}`
                        }
                        title={isCollapsed ? item.label : undefined}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span className="admin-nav-icon">{getIcon(item.icon)}</span>
                        {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
                      </NavLink>
                    )
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" className="admin-view-site" title={isCollapsed ? 'Открыть сайт' : undefined}>
            {getIcon('external')}
            {!isCollapsed && <span>Открыть сайт</span>}
          </a>
          <div className="admin-user-menu-container">
            <button
              className={`admin-user-trigger ${isUserMenuOpen ? 'active' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title={isCollapsed ? user?.full_name || user?.username : undefined}
            >
              <div className="admin-user-avatar">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="admin-user-info">
                    <span className="admin-user-name">{user?.full_name || user?.username}</span>
                    <span className="admin-user-role">{user?.role}</span>
                  </div>
                  <svg className="admin-user-chevron" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="admin-user-dropdown">
                <div className="admin-dropdown-header">
                  <div className="admin-dropdown-avatar">
                    {user?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="admin-dropdown-user-info">
                    <span className="admin-dropdown-name">{user?.full_name || user?.username}</span>
                    <span className="admin-dropdown-email">{user?.email || user?.username}</span>
                  </div>
                </div>
                <div className="admin-dropdown-divider" />
                <button
                  className="admin-dropdown-item"
                  onClick={() => { setIsUserMenuOpen(false); navigate('/admin/change-password') }}
                >
                  {getIcon('lock')}
                  <span>Сменить пароль</span>
                </button>
                <button className="admin-dropdown-item" onClick={handleLogout}>
                  {getIcon('logout')}
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

function getIcon(name) {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
      </svg>
    ),
    event: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
      </svg>
    ),
    map: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    article: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    person: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    handshake: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12.22 19.85c-.18.18-.5.21-.71 0L5.66 14a2.5 2.5 0 0 1 0-3.54l6.36-6.36c.2-.2.51-.2.71 0l6.36 6.36a2.5 2.5 0 0 1 0 3.54l-6.87 5.85z"/>
      </svg>
    ),
    people: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>
    ),
    external: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
      </svg>
    ),
    pages: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
      </svg>
    ),
    image: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    ),
  }
  return icons[name] || null
}
