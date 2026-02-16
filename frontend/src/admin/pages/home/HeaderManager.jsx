import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

// Default navigation structure with all submenus
const defaultNavigation = [
  {
    id: 'conference',
    path: '/conference',
    label_ru: 'Конференции',
    label_en: 'Conference',
    label_tj: 'Конфронс',
    hasDropdown: true,
    submenus: [
      { id: 'intro', path: '/conference#intro', label_ru: 'Введение', label_en: 'Introduction', label_tj: 'Муқаддима' },
      { id: 'goals', path: '/conference#goals', label_ru: 'Цели', label_en: 'Goals', label_tj: 'Мақсадҳо' },
      { id: 'date-venue', path: '/conference#date-venue', label_ru: 'Дата и место проведения', label_en: 'Date and Venue', label_tj: 'Сана ва макон' },
      { id: 'participation', path: '/conference#participation', label_ru: 'Участие', label_en: 'Participation', label_tj: 'Иштирок' },
    ]
  },
  {
    id: 'program',
    path: '/program',
    label_ru: 'Программа',
    label_en: 'Program',
    label_tj: 'Барнома',
    hasDropdown: true,
    submenus: [
      { id: 'program-structure', path: '/program/structure', label_ru: 'Структура программы', label_en: 'Program Structure', label_tj: 'Сохтори барнома' },
      { id: 'plenary', path: '/program/plenary', label_ru: 'Пленарное заседание', label_en: 'Plenary Session', label_tj: 'Ҷаласаи пленарӣ' },
      { id: 'conference-events', path: '/program/events', label_ru: 'Мероприятия в рамках конференции', label_en: 'Conference Events', label_tj: 'Чорабиниҳои конфронс' },
      { id: 'forums', path: '/program/forums', label_ru: 'Форумы', label_en: 'Forums', label_tj: 'Форумҳо' },
    ]
  },
  {
    id: 'events',
    path: '/events',
    label_ru: 'Мероприятия',
    label_en: 'Events',
    label_tj: 'Чорабиниҳо',
    hasDropdown: true,
    submenus: [
      { id: 'parallel-events', path: '/events#parallel', label_ru: 'Параллельные мероприятия', label_en: 'Parallel Events', label_tj: 'Чорабиниҳои паралелӣ' },
      { id: 'cultural-events', path: '/events#cultural', label_ru: 'Культурные мероприятия', label_en: 'Cultural Events', label_tj: 'Чорабиниҳои фарҳангӣ' },
      { id: 'excursion-hisor', path: '/excursions#hisor', label_ru: 'Хисор', label_en: 'Hisor', label_tj: 'Ҳисор' },
      { id: 'excursion-rogun', path: '/excursions#rogun', label_ru: 'Рогун', label_en: 'Rogun', label_tj: 'Роғун' },
      { id: 'excursion-dushanbe', path: '/excursions#dushanbe', label_ru: 'Душанбе', label_en: 'Dushanbe', label_tj: 'Душанбе' },
    ]
  },
  {
    id: 'exhibition',
    path: '/exhibition',
    label_ru: 'Выставка',
    label_en: 'Exhibition',
    label_tj: 'Намоишгоҳ',
    hasDropdown: false,
    submenus: []
  },
  {
    id: 'logistics',
    path: '/logistics',
    label_ru: 'Логистика',
    label_en: 'Logistics',
    label_tj: 'Логистика',
    hasDropdown: true,
    submenus: [
      { id: 'practical-info', path: '/logistics#practical', label_ru: 'Практическая информация', label_en: 'Practical Information', label_tj: 'Маълумоти амалӣ' },
      { id: 'visa', path: '/logistics#visa', label_ru: 'Виза в Таджикистан', label_en: 'Visa to Tajikistan', label_tj: 'Равoдиди Тоҷикистон' },
      { id: 'press', path: '/logistics#press', label_ru: 'Аккредитация прессы', label_en: 'Press Accreditation', label_tj: 'Аккредитатсияи матбуот' },
      { id: 'flights', path: '/logistics#flights', label_ru: 'Авиарейсы', label_en: 'Flights', label_tj: 'Парвозҳо' },
      { id: 'accommodation', path: '/logistics#accommodation', label_ru: 'Размещение в гостинице', label_en: 'Hotel Accommodation', label_tj: 'Ҷойгиршавӣ дар меҳмонхона' },
      { id: 'weather', path: '/logistics#weather', label_ru: 'Погода', label_en: 'Weather', label_tj: 'Обу ҳаво' },
    ]
  },
  {
    id: 'registration',
    path: '/registration',
    label_ru: 'Регистрация',
    label_en: 'Registration',
    label_tj: 'Бақайдгирӣ',
    hasDropdown: false,
    isButton: true,
    submenus: []
  },
  {
    id: 'contacts',
    path: '/contacts',
    label_ru: 'Контакты',
    label_en: 'Contacts',
    label_tj: 'Тамос',
    hasDropdown: false,
    submenus: []
  },
  {
    id: 'water-decade',
    path: '/water-decade',
    label_ru: 'Водное десятилетие',
    label_en: 'Water Decade',
    label_tj: 'Даҳсолаи об',
    hasDropdown: false,
    isSpecialButton: true,
    submenus: []
  }
]

// Default header data
const defaultHeaderData = {
  logo_url: '/assets/images/logo-compact.png',
  logo_url_ru: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_ru.png',
  logo_url_en: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_eng.png',
  logo_url_tj: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_taj.png',
  title_ru: '4-ая МЕЖДУНАРОДНАЯ КОНФЕРЕНЦИЯ ВЫСОКОГО УРОВНЯ\nПО МЕЖДУНАРОДНОМУ ДЕСЯТИЛЕТИЮ\nДЕЙСТВИЙ «ВОДА ДЛЯ УСТОЙЧИВОГО РАЗВИТИЯ»',
  title_en: '4th HIGH-LEVEL INTERNATIONAL CONFERENCE ON THE\nINTERNATIONAL DECADE FOR ACTION "WATER FOR\nSUSTAINABLE DEVELOPMENT"',
  title_tj: 'КОНФРОНСИ 4-УМИ БАЙНАЛМИЛАЛИИ САТҲИ БАЛАНД\nОИД БА ДАҲСОЛАИ АМАЛ «ОБ БАРОИ\nРУШДИ УСТУВОР»',
  twitter_url: 'https://twitter.com',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
}

// Default site title data (browser tab title)
const defaultSiteTitleData = {
  site_title_ru: 'Душанбинская Водная Конференция 2026 | Вода для устойчивого развития',
  site_title_en: 'Dushanbe Water Conference 2026 | Water for Sustainable Development',
  site_title_tj: 'Конфронси обии Душанбе 2026 | Об барои рушди устувор',
}

export default function HeaderManager() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('ru')
  const [activeTab, setActiveTab] = useState('general')
  const [headerData, setHeaderData] = useState(defaultHeaderData)
  const [siteTitleData, setSiteTitleData] = useState(defaultSiteTitleData)
  const [navigation, setNavigation] = useState(defaultNavigation)
  const [expandedMenus, setExpandedMenus] = useState({})
  const [editingItem, setEditingItem] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const apiRequest = async (url, options = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      // Load header data
      setHeaderData(prev => {
        const updated = { ...prev }
        Object.keys(prev).forEach(key => {
          const settingKey = `header_${key}`
          if (settings[settingKey]) {
            updated[key] = settings[settingKey]
          }
        })
        return updated
      })

      // Load site title data (browser tab title)
      setSiteTitleData(prev => {
        const updated = { ...prev }
        Object.keys(prev).forEach(key => {
          if (settings[key]) {
            updated[key] = settings[key]
          }
        })
        return updated
      })

      // Load navigation if saved
      if (settings.header_navigation) {
        try {
          const savedNav = JSON.parse(settings.header_navigation)
          if (Array.isArray(savedNav) && savedNav.length > 0) {
            setNavigation(savedNav)
          }
        } catch (e) {
          console.error('Failed to parse navigation:', e)
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      const settingsArray = [
        ...Object.entries(headerData).map(([key, value]) => ({
          key: `header_${key}`,
          value: value
        })),
        ...Object.entries(siteTitleData).map(([key, value]) => ({
          key: key,
          value: value
        })),
        { key: 'header_navigation', value: JSON.stringify(navigation) }
      ]

      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsArray })
      })

      setSaveStatus({ type: 'success', message: 'Настройки сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }))
  }

  const handleSiteTitleChange = (field, value) => {
    setSiteTitleData(prev => ({ ...prev, [field]: value }))
  }

  const [uploadingField, setUploadingField] = useState(null)
  const uploading = uploadingField !== null

  const handleLogoUpload = async (e, targetField = 'logo_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveStatus({ type: 'error', message: 'Пожалуйста, выберите изображение' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({ type: 'error', message: 'Файл слишком большой (макс. 5MB)' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setUploadingField(targetField)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'logo')

    try {
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      setHeaderData(prev => ({ ...prev, [targetField]: data.url }))
      setSaveStatus({ type: 'success', message: 'Логотип загружен!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to upload logo:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка загрузки: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    } finally {
      setUploadingField(null)
      // Reset the file input
      e.target.value = ''
    }
  }

  const toggleMenuExpand = (menuId) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }))
  }

  const handleMenuChange = (menuIndex, field, value) => {
    setNavigation(prev => {
      const updated = [...prev]
      updated[menuIndex] = { ...updated[menuIndex], [field]: value }
      return updated
    })
  }

  const handleSubmenuChange = (menuIndex, submenuIndex, field, value) => {
    setNavigation(prev => {
      const updated = [...prev]
      const submenus = [...updated[menuIndex].submenus]
      submenus[submenuIndex] = { ...submenus[submenuIndex], [field]: value }
      updated[menuIndex] = { ...updated[menuIndex], submenus }
      return updated
    })
  }

  const addSubmenu = (menuIndex) => {
    setNavigation(prev => {
      const updated = [...prev]
      const newSubmenu = {
        id: `submenu-${Date.now()}`,
        path: '#',
        label_ru: 'Новый пункт',
        label_en: 'New Item',
        label_tj: 'Банди нав'
      }
      updated[menuIndex] = {
        ...updated[menuIndex],
        submenus: [...updated[menuIndex].submenus, newSubmenu]
      }
      return updated
    })
  }

  const deleteSubmenu = (menuIndex, submenuIndex) => {
    if (!window.confirm('Удалить этот подпункт меню?')) return
    setNavigation(prev => {
      const updated = [...prev]
      const submenus = updated[menuIndex].submenus.filter((_, i) => i !== submenuIndex)
      updated[menuIndex] = { ...updated[menuIndex], submenus }
      return updated
    })
  }

  // Drag and drop for main menu items
  const handleDragStart = (e, index, type = 'menu') => {
    setDraggedItem({ index, type })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index, type = 'menu') => {
    e.preventDefault()
    if (draggedItem && draggedItem.type === type) {
      setDragOverItem({ index, type })
    }
  }

  const handleDragEnd = () => {
    if (draggedItem && dragOverItem && draggedItem.type === dragOverItem.type) {
      if (draggedItem.type === 'menu') {
        const newNav = [...navigation]
        const [removed] = newNav.splice(draggedItem.index, 1)
        newNav.splice(dragOverItem.index, 0, removed)
        setNavigation(newNav)
      }
    }
    setDraggedItem(null)
    setDragOverItem(null)
  }

  // Drag for submenus
  const handleSubmenuDragStart = (e, menuIndex, submenuIndex) => {
    setDraggedItem({ menuIndex, submenuIndex, type: 'submenu' })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleSubmenuDragOver = (e, menuIndex, submenuIndex) => {
    e.preventDefault()
    if (draggedItem && draggedItem.type === 'submenu' && draggedItem.menuIndex === menuIndex) {
      setDragOverItem({ menuIndex, submenuIndex, type: 'submenu' })
    }
  }

  const handleSubmenuDragEnd = () => {
    if (draggedItem && dragOverItem && draggedItem.type === 'submenu' && dragOverItem.type === 'submenu') {
      if (draggedItem.menuIndex === dragOverItem.menuIndex) {
        const newNav = [...navigation]
        const submenus = [...newNav[draggedItem.menuIndex].submenus]
        const [removed] = submenus.splice(draggedItem.submenuIndex, 1)
        submenus.splice(dragOverItem.submenuIndex, 0, removed)
        newNav[draggedItem.menuIndex] = { ...newNav[draggedItem.menuIndex], submenus }
        setNavigation(newNav)
      }
    }
    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (loading) {
    return <div className="loading-state">Загрузка...</div>
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Шапка сайта (Header)</h2>
          <p>Настройка логотипа, заголовка, навигации и социальных сетей</p>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          {saveStatus.type === 'saving' && (
            <svg className="save-status-spinner" viewBox="0 0 24 24" width="18" height="18">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
            </svg>
          )}
          {saveStatus.type === 'success' && (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
          {saveStatus.type === 'error' && (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Общие настройки
        </button>
        <button
          className={`admin-tab ${activeTab === 'siteTitle' ? 'active' : ''}`}
          onClick={() => setActiveTab('siteTitle')}
        >
          Название вкладки
        </button>
        <button
          className={`admin-tab ${activeTab === 'title' ? 'active' : ''}`}
          onClick={() => setActiveTab('title')}
        >
          Заголовок
        </button>
        <button
          className={`admin-tab ${activeTab === 'navigation' ? 'active' : ''}`}
          onClick={() => setActiveTab('navigation')}
        >
          Навигация
        </button>
        <button
          className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Соц. сети
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="admin-card">
          <h3>Логотипы по языкам</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Загрузите логотипы для каждого языка сайта. Логотип будет меняться в зависимости от выбранного языка.
          </p>

          {/* Language-specific logos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {LANGUAGES.map(lang => {
              const fieldName = `logo_url_${lang.code}`
              const inputId = `logo-upload-${lang.code}`
              const isUploading = uploading && uploadingField === fieldName

              return (
                <div key={lang.code} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <img src={lang.flag} alt={lang.label} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '3px' }} />
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Логотип ({lang.label})</h4>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    {/* Preview */}
                    <div style={{
                      width: '120px',
                      height: '80px',
                      background: '#1e3a5f',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {headerData[fieldName] ? (
                        <img
                          src={headerData[fieldName]}
                          alt={`Logo ${lang.code}`}
                          style={{ maxWidth: '100px', maxHeight: '60px', objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Нет лого</span>
                      )}
                    </div>

                    {/* Upload & URL */}
                    <div style={{ flex: 1 }}>
                      {/* Upload button */}
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          marginBottom: '12px',
                          background: '#fff',
                          cursor: isUploading ? 'wait' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => !isUploading && document.getElementById(inputId).click()}
                        onMouseOver={(e) => { if (!isUploading) e.currentTarget.style.borderColor = '#2d5a87' }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1' }}
                      >
                        <input
                          id={inputId}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, fieldName)}
                          style={{ display: 'none' }}
                        />
                        {isUploading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg className="save-status-spinner" viewBox="0 0 24 24" width="18" height="18" style={{ color: '#2d5a87' }}>
                              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                            </svg>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Загрузка...</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Загрузить файл</span>
                          </div>
                        )}
                      </div>

                      {/* URL input */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={headerData[fieldName]}
                          onChange={(e) => handleChange(fieldName, e.target.value)}
                          placeholder={`/assets/images/logo/logo-${lang.code}.png`}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '13px',
                          }}
                        />
                        {headerData[fieldName] && (
                          <button
                            onClick={() => handleChange(fieldName, '')}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #ef4444',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: '#ef4444',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            title="Удалить"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Site Title Tab (Browser Tab Title) */}
      {activeTab === 'siteTitle' && (
        <div className="admin-card">
          <h3>Название вкладки браузера</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Текст, отображаемый во вкладке браузера рядом с иконкой сайта (favicon). Меняется в зависимости от выбранного языка.
          </p>

          <div className="lang-tab-buttons" style={{ marginBottom: '20px' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                className={`lang-tab-btn ${activeLang === lang.code ? 'active' : ''}`}
                onClick={() => setActiveLang(lang.code)}
              >
                <img src={lang.flag} alt={lang.label} style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                {lang.label}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Название сайта ({LANGUAGES.find(l => l.code === activeLang)?.label})</label>
            <input
              type="text"
              value={siteTitleData[`site_title_${activeLang}`]}
              onChange={(e) => handleSiteTitleChange(`site_title_${activeLang}`, e.target.value)}
              placeholder="Dushanbe Water Conference 2026"
            />
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>
              Рекомендуемая длина: до 60 символов
            </p>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Превью во вкладке браузера:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', maxWidth: '300px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#2d5a87">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {siteTitleData[`site_title_${activeLang}`] || 'Название сайта'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Title Tab */}
      {activeTab === 'title' && (
        <div className="admin-card">
          <h3>Заголовок конференции</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Полное название конференции, отображаемое в шапке сайта рядом с логотипом
          </p>

          <div className="lang-tab-buttons" style={{ marginBottom: '20px' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                className={`lang-tab-btn ${activeLang === lang.code ? 'active' : ''}`}
                onClick={() => setActiveLang(lang.code)}
              >
                <img src={lang.flag} alt={lang.label} style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                {lang.label}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Заголовок ({LANGUAGES.find(l => l.code === activeLang)?.label})</label>
            <textarea
              value={headerData[`title_${activeLang}`]}
              onChange={(e) => handleChange(`title_${activeLang}`, e.target.value)}
              placeholder="4-ая МЕЖДУНАРОДНАЯ КОНФЕРЕНЦИЯ..."
              rows="3"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginTop: '24px', padding: '20px', background: '#1e3a5f', borderRadius: '8px', color: 'white' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Превью заголовка:</p>
            <div style={{ fontSize: '11px', lineHeight: '1.5', fontWeight: '600', textTransform: 'uppercase' }}>
              {headerData[`title_${activeLang}`]}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0 }}>Меню навигации</h3>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
                Перетаскивайте пункты для изменения порядка. Нажмите на пункт для редактирования.
              </p>
            </div>
            <div className="lang-tab-buttons">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-tab-btn ${activeLang === lang.code ? 'active' : ''}`}
                  onClick={() => setActiveLang(lang.code)}
                  style={{ padding: '6px 12px' }}
                >
                  <img src={lang.flag} alt={lang.label} style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navigation.map((menu, menuIndex) => (
              <div
                key={menu.id}
                draggable
                onDragStart={(e) => handleDragStart(e, menuIndex)}
                onDragOver={(e) => handleDragOver(e, menuIndex)}
                onDragEnd={handleDragEnd}
                style={{
                  background: dragOverItem?.index === menuIndex && dragOverItem?.type === 'menu' ? '#e0f2fe' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                {/* Main menu item header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: menu.isRegister ? '#2d5a87' : '#fff',
                    color: menu.isRegister ? '#fff' : '#1e293b',
                    cursor: 'grab',
                  }}
                >
                  {/* Drag handle */}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ opacity: 0.4, flexShrink: 0 }}>
                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>

                  {/* Menu label input */}
                  <input
                    type="text"
                    value={menu[`label_${activeLang}`]}
                    onChange={(e) => handleMenuChange(menuIndex, `label_${activeLang}`, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid transparent',
                      borderRadius: '6px',
                      background: menu.isRegister ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                      color: menu.isRegister ? '#fff' : '#1e293b',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />

                  {/* Path input */}
                  <input
                    type="text"
                    value={menu.path}
                    onChange={(e) => handleMenuChange(menuIndex, 'path', e.target.value)}
                    placeholder="URL"
                    style={{
                      width: '140px',
                      padding: '8px 12px',
                      border: '1px solid transparent',
                      borderRadius: '6px',
                      background: menu.isRegister ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                      color: menu.isRegister ? '#fff' : '#64748b',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />

                  {/* Submenu count & expand button */}
                  {menu.hasDropdown && menu.submenus.length > 0 && (
                    <button
                      onClick={() => toggleMenuExpand(menu.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: menu.isRegister ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                        color: menu.isRegister ? '#fff' : '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      <span>{menu.submenus.length} подпунктов</span>
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                        style={{
                          transform: expandedMenus[menu.id] ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Submenus */}
                {menu.hasDropdown && expandedMenus[menu.id] && (
                  <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {menu.submenus.map((submenu, submenuIndex) => (
                        <div
                          key={submenu.id}
                          draggable
                          onDragStart={(e) => handleSubmenuDragStart(e, menuIndex, submenuIndex)}
                          onDragOver={(e) => handleSubmenuDragOver(e, menuIndex, submenuIndex)}
                          onDragEnd={handleSubmenuDragEnd}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            background: dragOverItem?.menuIndex === menuIndex && dragOverItem?.submenuIndex === submenuIndex ? '#dbeafe' : '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            marginLeft: '24px',
                            transition: 'all 0.2s',
                          }}
                        >
                          {/* Drag handle */}
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="#94a3b8" style={{ cursor: 'grab', flexShrink: 0 }}>
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>

                          {/* Submenu label */}
                          <input
                            type="text"
                            value={submenu[`label_${activeLang}`]}
                            onChange={(e) => handleSubmenuChange(menuIndex, submenuIndex, `label_${activeLang}`, e.target.value)}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              border: '1px solid transparent',
                              borderRadius: '4px',
                              background: '#f8fafc',
                              fontSize: '13px',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          />

                          {/* Submenu path */}
                          <input
                            type="text"
                            value={submenu.path}
                            onChange={(e) => handleSubmenuChange(menuIndex, submenuIndex, 'path', e.target.value)}
                            placeholder="URL"
                            style={{
                              width: '140px',
                              padding: '6px 10px',
                              border: '1px solid transparent',
                              borderRadius: '4px',
                              background: '#f8fafc',
                              color: '#64748b',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                            }}
                          />

                          {/* Delete button */}
                          <button
                            onClick={() => deleteSubmenu(menuIndex, submenuIndex)}
                            style={{
                              padding: '6px',
                              border: 'none',
                              borderRadius: '4px',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="Удалить"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Add submenu button */}
                      <button
                        onClick={() => addSubmenu(menuIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px',
                          marginLeft: '24px',
                          border: '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: '#64748b',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#2d5a87'
                          e.currentTarget.style.color = '#2d5a87'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1'
                          e.currentTarget.style.color = '#64748b'
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Добавить подпункт
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="admin-card">
          <h3>Социальные сети</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Ссылки на социальные сети, отображаемые в шапке сайта
          </p>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="#000000" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter / X
            </label>
            <input
              type="text"
              value={headerData.twitter_url}
              onChange={(e) => handleChange('twitter_url', e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <defs>
                  <linearGradient id="insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFDC80"/>
                    <stop offset="50%" stopColor="#F77737"/>
                    <stop offset="100%" stopColor="#C13584"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#insta-grad)"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
              Instagram
            </label>
            <input
              type="text"
              value={headerData.instagram_url}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="#1877F2" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </label>
            <input
              type="text"
              value={headerData.facebook_url}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      )}

      <button className="btn-save" onClick={handleSave}>
        Сохранить настройки шапки
      </button>
    </div>
  )
}
