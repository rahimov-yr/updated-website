import { NavLink, Outlet, useLocation } from 'react-router-dom'
import '../HomePageManager.css'

const sections = [
  { id: 'header', path: '/admin/home/header', label: 'Шапка сайта', icon: 'header' },
  { id: 'loading', path: '/admin/home/loading', label: 'Загрузочный экран', icon: 'loading' },
  { id: 'hero', path: '/admin/home/hero', label: 'Главный баннер', icon: 'hero' },
  { id: 'speakers', path: '/admin/home/speakers', label: 'Спикеры', icon: 'speakers' },
  { id: 'news', path: '/admin/home/news', label: 'Новости', icon: 'news' },
  { id: 'program', path: '/admin/home/program', label: 'Программа', icon: 'calendar' },
  { id: 'partners', path: '/admin/home/partners', label: 'Партнёры', icon: 'partners' },
  { id: 'app', path: '/admin/home/app', label: 'Приложение', icon: 'smartphone' },
  { id: 'footer', path: '/admin/home/footer', label: 'Подвал сайта', icon: 'footer' },
]

const getIcon = (name) => {
  const icons = {
    header: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
      </svg>
    ),
    footer: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="15" x2="21" y2="15"></line>
      </svg>
    ),
    hero: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
    speakers: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    news: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    partners: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    loading: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    smartphone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    ),
  }
  return icons[name] || null
}

export default function HomePageLayout() {
  const location = useLocation()

  return (
    <div className="home-page-manager">
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Главная страница</h1>
          <p>Управление всеми разделами главной страницы</p>
        </div>
      </div>

      <div className="page-manager-layout">
        {/* Section Navigation */}
        <div className="section-nav">
          {sections.map(section => (
            <NavLink
              key={section.id}
              to={section.path}
              className={({ isActive }) => `section-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="section-nav-icon">{getIcon(section.icon)}</span>
              <span className="section-nav-label">{section.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Section Content */}
        <div className="section-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
