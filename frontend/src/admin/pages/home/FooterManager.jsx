import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

// Default footer links for Quick Links column
const defaultQuickLinks = [
  { id: 'about', path: '/', label_ru: 'О конференции', label_en: 'About', label_tj: 'Дар бораи конфронс' },
  { id: 'program', path: '/program', label_ru: 'Программа', label_en: 'Program', label_tj: 'Барнома' },
  { id: 'speakers', path: '/#speakers', label_ru: 'Спикеры', label_en: 'Speakers', label_tj: 'Маърузачиён' },
  { id: 'news', path: '/news', label_ru: 'Новости', label_en: 'News', label_tj: 'Навидҳо' },
  { id: 'contacts', path: '/contacts', label_ru: 'Контакты', label_en: 'Contacts', label_tj: 'Тамос' },
]

// Default footer links for Participants column
const defaultParticipantLinks = [
  { id: 'registration', path: '/registration', label_ru: 'Регистрация', label_en: 'Registration', label_tj: 'Бақайдгирӣ' },
  { id: 'logistics', path: '/logistics', label_ru: 'Логистика', label_en: 'Logistics', label_tj: 'Логистика' },
  { id: 'excursions', path: '/excursions', label_ru: 'Экскурсии', label_en: 'Excursions', label_tj: 'Экскурсияҳо' },
  { id: 'exhibition', path: '/exhibition', label_ru: 'Выставка', label_en: 'Exhibition', label_tj: 'Намоишгоҳ' },
  { id: 'media', path: '/contacts#media', label_ru: 'Аккредитация СМИ', label_en: 'Media Accreditation', label_tj: 'Аккредитатсияи ВАО' },
]

// Default footer data
const defaultFooterData = {
  // Logo (general fallback)
  logo_url: '/assets/images/logo-compact.png',
  // Language-specific logos
  logo_url_ru: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_ru.png',
  logo_url_en: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_eng.png',
  logo_url_tj: '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_taj.png',

  // Description
  description_ru: 'Международная конференция высокого уровня по Десятилетию действий «Вода для устойчивого развития»',
  description_en: 'High-Level International Conference on the Decade for Action "Water for Sustainable Development"',
  description_tj: 'Конфронси байналмилалии сатҳи баланд оид ба Даҳсолаи амал «Об барои рушди устувор»',

  // Quick Links title
  quick_links_title_ru: 'Навигация',
  quick_links_title_en: 'Quick Links',
  quick_links_title_tj: 'Навигатсия',

  // For Participants title
  participants_title_ru: 'Участникам',
  participants_title_en: 'For Participants',
  participants_title_tj: 'Барои иштирокчиён',

  // Contacts section title
  contacts_title_ru: 'Контакты',
  contacts_title_en: 'Contacts',
  contacts_title_tj: 'Тамос',

  // Contact info
  address_ru: 'Душанбе, Таджикистан',
  address_en: 'Dushanbe, Tajikistan',
  address_tj: 'Душанбе, Тоҷикистон',

  phone: '+992 (37) 227-68-43',
  email: 'secretariat@dushanbewaterprocess.org',

  // Copyright
  copyright_ru: '© 2026 Водная конференция Душанбе. Все права защищены.',
  copyright_en: '© 2026 Dushanbe Water Conference. All rights reserved.',
  copyright_tj: '© 2026 Конфронси обии Душанбе. Ҳамаи ҳуқуқҳо ҳифз шудаанд.',

  // Organizer
  organizer_ru: 'Правительство Республики Таджикистан',
  organizer_en: 'Government of the Republic of Tajikistan',
  organizer_tj: 'Ҳукумати Ҷумҳурии Тоҷикистон',

  // Social links
  facebook_url: 'https://facebook.com',
  instagram_url: 'https://instagram.com',
  twitter_url: 'https://twitter.com',
}

export default function FooterManager() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('ru')
  const [activeTab, setActiveTab] = useState('general')
  const [footerData, setFooterData] = useState(defaultFooterData)
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks)
  const [participantLinks, setParticipantLinks] = useState(defaultParticipantLinks)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [uploadingField, setUploadingField] = useState(null)
  const uploading = uploadingField !== null

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

      // Load footer data
      setFooterData(prev => {
        const updated = { ...prev }
        Object.keys(prev).forEach(key => {
          const settingKey = `footer_${key}`
          if (settings[settingKey]) {
            updated[key] = settings[settingKey]
          }
        })
        return updated
      })

      // Load quick links
      if (settings.footer_quick_links) {
        try {
          const saved = JSON.parse(settings.footer_quick_links)
          if (Array.isArray(saved) && saved.length > 0) {
            setQuickLinks(saved)
          }
        } catch (e) {
          console.error('Failed to parse quick links:', e)
        }
      }

      // Load participant links
      if (settings.footer_participant_links) {
        try {
          const saved = JSON.parse(settings.footer_participant_links)
          if (Array.isArray(saved) && saved.length > 0) {
            setParticipantLinks(saved)
          }
        } catch (e) {
          console.error('Failed to parse participant links:', e)
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
        ...Object.entries(footerData).map(([key, value]) => ({
          key: `footer_${key}`,
          value: value
        })),
        { key: 'footer_quick_links', value: JSON.stringify(quickLinks) },
        { key: 'footer_participant_links', value: JSON.stringify(participantLinks) },
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
    setFooterData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (e, targetField = 'logo_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSaveStatus({ type: 'error', message: 'Пожалуйста, выберите изображение' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

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
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`)

      const data = await response.json()
      setFooterData(prev => ({ ...prev, [targetField]: data.url }))
      setSaveStatus({ type: 'success', message: 'Логотип загружен!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to upload logo:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка загрузки: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    } finally {
      setUploadingField(null)
      e.target.value = ''
    }
  }

  // Quick Links handlers
  const handleQuickLinkChange = (index, field, value) => {
    setQuickLinks(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addQuickLink = () => {
    setQuickLinks(prev => [...prev, {
      id: `link-${Date.now()}`,
      path: '#',
      label_ru: 'Новая ссылка',
      label_en: 'New Link',
      label_tj: 'Пайванди нав'
    }])
  }

  const deleteQuickLink = (index) => {
    if (!window.confirm('Удалить эту ссылку?')) return
    setQuickLinks(prev => prev.filter((_, i) => i !== index))
  }

  // Participant Links handlers
  const handleParticipantLinkChange = (index, field, value) => {
    setParticipantLinks(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addParticipantLink = () => {
    setParticipantLinks(prev => [...prev, {
      id: `link-${Date.now()}`,
      path: '#',
      label_ru: 'Новая ссылка',
      label_en: 'New Link',
      label_tj: 'Пайванди нав'
    }])
  }

  const deleteParticipantLink = (index) => {
    if (!window.confirm('Удалить эту ссылку?')) return
    setParticipantLinks(prev => prev.filter((_, i) => i !== index))
  }

  // Drag handlers for Quick Links
  const handleQuickDragStart = (e, index) => {
    setDraggedItem({ index, type: 'quick' })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleQuickDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem?.type === 'quick') {
      setDragOverItem({ index, type: 'quick' })
    }
  }

  const handleQuickDragEnd = () => {
    if (draggedItem?.type === 'quick' && dragOverItem?.type === 'quick') {
      const newLinks = [...quickLinks]
      const [removed] = newLinks.splice(draggedItem.index, 1)
      newLinks.splice(dragOverItem.index, 0, removed)
      setQuickLinks(newLinks)
    }
    setDraggedItem(null)
    setDragOverItem(null)
  }

  // Drag handlers for Participant Links
  const handleParticipantDragStart = (e, index) => {
    setDraggedItem({ index, type: 'participant' })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleParticipantDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem?.type === 'participant') {
      setDragOverItem({ index, type: 'participant' })
    }
  }

  const handleParticipantDragEnd = () => {
    if (draggedItem?.type === 'participant' && dragOverItem?.type === 'participant') {
      const newLinks = [...participantLinks]
      const [removed] = newLinks.splice(draggedItem.index, 1)
      newLinks.splice(dragOverItem.index, 0, removed)
      setParticipantLinks(newLinks)
    }
    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (loading) {
    return <div className="loading-state">Загрузка...</div>
  }

  // Render a draggable link list
  const renderLinkList = (links, type, handlers) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {links.map((link, index) => (
        <div
          key={link.id}
          draggable
          onDragStart={(e) => handlers.dragStart(e, index)}
          onDragOver={(e) => handlers.dragOver(e, index)}
          onDragEnd={handlers.dragEnd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            background: dragOverItem?.index === index && dragOverItem?.type === type ? '#e0f2fe' : '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            transition: 'all 0.2s',
            cursor: 'grab',
          }}
        >
          {/* Drag handle */}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#94a3b8" style={{ flexShrink: 0 }}>
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>

          {/* Label input */}
          <input
            type="text"
            value={link[`label_${activeLang}`]}
            onChange={(e) => handlers.change(index, `label_${activeLang}`, e.target.value)}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: '1px solid transparent',
              borderRadius: '6px',
              background: '#f8fafc',
              fontSize: '13px',
              fontWeight: '500',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
            onBlur={(e) => e.target.style.borderColor = 'transparent'}
          />

          {/* Path input */}
          <input
            type="text"
            value={link.path}
            onChange={(e) => handlers.change(index, 'path', e.target.value)}
            placeholder="URL"
            style={{
              width: '140px',
              padding: '8px 10px',
              border: '1px solid transparent',
              borderRadius: '6px',
              background: '#f8fafc',
              color: '#64748b',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />

          {/* Delete button */}
          <button
            onClick={() => handlers.delete(index)}
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

      {/* Add link button */}
      <button
        onClick={handlers.add}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '12px',
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
        Добавить ссылку
      </button>
    </div>
  )

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Подвал сайта (Footer)</h2>
          <p>Настройка контактов, ссылок и информации о конференции</p>
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
          className={`admin-tab ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          Меню ссылок
        </button>
        <button
          className={`admin-tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Контакты
        </button>
        <button
          className={`admin-tab ${activeTab === 'bottom' ? 'active' : ''}`}
          onClick={() => setActiveTab('bottom')}
        >
          Нижняя часть
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            {LANGUAGES.map(lang => {
              const fieldName = `logo_url_${lang.code}`
              const inputId = `footer-logo-upload-${lang.code}`
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
                      {footerData[fieldName] ? (
                        <img
                          src={footerData[fieldName]}
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
                          value={footerData[fieldName]}
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
                        {footerData[fieldName] && (
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

          <h4 style={{ marginTop: '24px', marginBottom: '16px' }}>Описание конференции</h4>

          {/* Language tabs */}
          <div className="lang-tab-buttons" style={{ marginBottom: '16px' }}>
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
            <label>Описание ({LANGUAGES.find(l => l.code === activeLang)?.label})</label>
            <textarea
              value={footerData[`description_${activeLang}`]}
              onChange={(e) => handleChange(`description_${activeLang}`, e.target.value)}
              rows="3"
              placeholder="Описание конференции..."
            />
          </div>

          {/* Social links in footer */}
          <h4 style={{ marginTop: '24px', marginBottom: '16px' }}>Социальные сети</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Facebook</label>
              <input
                type="text"
                value={footerData.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="text"
                value={footerData.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Twitter / X</label>
              <input
                type="text"
                value={footerData.twitter_url}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Links Menu Tab */}
      {activeTab === 'links' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0 }}>Меню ссылок</h3>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
                Перетаскивайте ссылки для изменения порядка. Нажмите для редактирования.
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

          {/* Quick Links Column */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '4px',
                height: '24px',
                background: '#2d5a87',
                borderRadius: '2px'
              }} />
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={footerData[`quick_links_title_${activeLang}`]}
                  onChange={(e) => handleChange(`quick_links_title_${activeLang}`, e.target.value)}
                  placeholder="Навигация"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    border: 'none',
                    background: 'transparent',
                    padding: '4px 0',
                    width: '100%',
                  }}
                />
              </div>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {quickLinks.length} ссылок
              </span>
            </div>

            {renderLinkList(quickLinks, 'quick', {
              dragStart: handleQuickDragStart,
              dragOver: handleQuickDragOver,
              dragEnd: handleQuickDragEnd,
              change: handleQuickLinkChange,
              delete: deleteQuickLink,
              add: addQuickLink,
            })}
          </div>

          {/* Participant Links Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '4px',
                height: '24px',
                background: '#059669',
                borderRadius: '2px'
              }} />
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={footerData[`participants_title_${activeLang}`]}
                  onChange={(e) => handleChange(`participants_title_${activeLang}`, e.target.value)}
                  placeholder="Участникам"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    border: 'none',
                    background: 'transparent',
                    padding: '4px 0',
                    width: '100%',
                  }}
                />
              </div>
              <span style={{
                background: '#d1fae5',
                color: '#047857',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {participantLinks.length} ссылок
              </span>
            </div>

            {renderLinkList(participantLinks, 'participant', {
              dragStart: handleParticipantDragStart,
              dragOver: handleParticipantDragOver,
              dragEnd: handleParticipantDragEnd,
              change: handleParticipantLinkChange,
              delete: deleteParticipantLink,
              add: addParticipantLink,
            })}
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="admin-card">
          <h3>Контактная информация</h3>

          {/* Language tabs for address */}
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
            <label>Заголовок секции контактов</label>
            <input
              type="text"
              value={footerData[`contacts_title_${activeLang}`]}
              onChange={(e) => handleChange(`contacts_title_${activeLang}`, e.target.value)}
              placeholder="Контакты"
            />
          </div>

          <div className="form-group">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Адрес ({LANGUAGES.find(l => l.code === activeLang)?.label})
            </label>
            <input
              type="text"
              value={footerData[`address_${activeLang}`]}
              onChange={(e) => handleChange(`address_${activeLang}`, e.target.value)}
              placeholder="Душанбе, Таджикистан"
            />
          </div>

          <div className="form-group">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Телефон
            </label>
            <input
              type="text"
              value={footerData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+992 (37) 227-68-43"
            />
          </div>

          <div className="form-group">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </label>
            <input
              type="email"
              value={footerData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="secretariat@dushanbewaterprocess.org"
            />
          </div>

          {/* Preview */}
          <div style={{ marginTop: '24px', padding: '20px', background: '#1e293b', borderRadius: '8px', color: 'white' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Превью контактов:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {footerData[`address_${activeLang}`]}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {footerData.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span style={{ color: '#60a5fa' }}>{footerData.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section Tab */}
      {activeTab === 'bottom' && (
        <div className="admin-card">
          <h3>Нижняя часть подвала</h3>

          {/* Language tabs */}
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
            <label>Копирайт</label>
            <input
              type="text"
              value={footerData[`copyright_${activeLang}`]}
              onChange={(e) => handleChange(`copyright_${activeLang}`, e.target.value)}
              placeholder="© 2026 Водная конференция Душанбе. Все права защищены."
            />
          </div>

          <div className="form-group">
            <label>Организатор</label>
            <input
              type="text"
              value={footerData[`organizer_${activeLang}`]}
              onChange={(e) => handleChange(`organizer_${activeLang}`, e.target.value)}
              placeholder="Правительство Республики Таджикистан"
            />
          </div>

          {/* Preview */}
          <div style={{ marginTop: '24px', padding: '20px', background: '#0f172a', borderRadius: '8px', color: 'white' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Превью нижней части:</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              <span>{footerData[`copyright_${activeLang}`]}</span>
              <span>{footerData[`organizer_${activeLang}`]}</span>
            </div>
          </div>
        </div>
      )}

      <button className="btn-save" onClick={handleSave}>
        Сохранить настройки подвала
      </button>
    </div>
  )
}
