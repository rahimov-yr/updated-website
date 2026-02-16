import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

const DEFAULT_PARTNER_TYPES = [
  { value: 'organizer', label: { ru: 'Организатор', en: 'Organizer', tj: 'Ташкилотчӣ' } },
  { value: 'partner', label: { ru: 'Партнёр', en: 'Partner', tj: 'Шарик' } },
  { value: 'sponsor', label: { ru: 'Спонсор', en: 'Sponsor', tj: 'Сарпараст' } },
  { value: 'media', label: { ru: 'Медиа партнёр', en: 'Media Partner', tj: 'Шарики медиа' } },
]

// Default partners data
const defaultPartnersData = [
  {
    name: 'United Nations',
    logo: '/assets/images/partners/un.png',
    website: 'https://www.un.org',
    partner_type: 'organizer',
    sort_order: 0
  },
  {
    name: 'Government of Tajikistan',
    logo: '/assets/images/partners/tajikistan.png',
    website: 'https://www.tajikistan.gov.tj',
    partner_type: 'organizer',
    sort_order: 1
  },
  {
    name: 'The World Bank',
    logo: '/assets/images/partners/worldbank.png',
    website: 'https://www.worldbank.org',
    partner_type: 'partner',
    sort_order: 0
  },
  {
    name: 'UNDP',
    logo: '/assets/images/partners/undp.png',
    website: 'https://www.undp.org',
    partner_type: 'partner',
    sort_order: 1
  },
  {
    name: 'UNESCO',
    logo: '/assets/images/partners/unesco.png',
    website: 'https://www.unesco.org',
    partner_type: 'partner',
    sort_order: 2
  },
  {
    name: 'UNICEF',
    logo: '/assets/images/partners/unicef.png',
    website: 'https://www.unicef.org',
    partner_type: 'partner',
    sort_order: 3
  },
  {
    name: 'Asian Development Bank',
    logo: '/assets/images/partners/adb.png',
    website: 'https://www.adb.org',
    partner_type: 'sponsor',
    sort_order: 0
  },
  {
    name: 'European Union',
    logo: '/assets/images/partners/eu.png',
    website: 'https://european-union.europa.eu',
    partner_type: 'sponsor',
    sort_order: 1
  }
]

// Helper to get label for a specific language
const getTypeLabel = (type, lang = 'ru') => {
  if (!type) return ''
  // Support both old format (string) and new format (object)
  if (typeof type.label === 'string') return type.label
  return type.label?.[lang] || type.label?.ru || type.value
}

// Transliterate Cyrillic to Latin for auto-generating value from label
const transliterate = (text) => {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ғ': 'g', 'ӣ': 'i', 'қ': 'q', 'ӯ': 'u', 'ҳ': 'h', 'ҷ': 'j', // Tajik letters
  }
  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_')        // Replace multiple underscores with single
    .replace(/^_|_$/g, '')      // Remove leading/trailing underscores
}

export default function PartnersManager() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [partners, setPartners] = useState([])
  const [editingPartner, setEditingPartner] = useState(null)
  const [logoInputMode, setLogoInputMode] = useState('url') // 'url' or 'upload'
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [partnerTypes, setPartnerTypes] = useState(DEFAULT_PARTNER_TYPES)
  const [showTypesEditor, setShowTypesEditor] = useState(false)
  const [newTypeValue, setNewTypeValue] = useState('')
  const [newTypeLabels, setNewTypeLabels] = useState({ ru: '', en: '', tj: '' })
  const [typesEditorLang, setTypesEditorLang] = useState('ru')
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    logo: '/assets/images/partner-default.png',
    website: '',
    partner_type: 'partner',
    sort_order: 0
  })

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
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

  useEffect(() => {
    loadPartners()
    loadPartnerTypes()
  }, [])

  const loadPartnerTypes = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      if (settings.partner_types) {
        try {
          const types = JSON.parse(settings.partner_types)
          if (Array.isArray(types) && types.length > 0) {
            setPartnerTypes(types)
          }
        } catch (e) {
          console.error('Failed to parse partner types:', e)
        }
      }
    } catch (err) {
      console.error('Failed to load partner types:', err)
    }
  }

  const savePartnerTypes = async (types) => {
    try {
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: [
            { key: 'partner_types', value: JSON.stringify(types) }
          ]
        })
      })
      setPartnerTypes(types)
      setSaveStatus({ type: 'success', message: 'Типы партнёров сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save partner types:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleAddType = () => {
    // At least Russian label is required
    if (!newTypeValue.trim() || !newTypeLabels.ru.trim()) {
      setSaveStatus({ type: 'error', message: 'Заполните значение и название (RU)' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    // Check if value already exists
    if (partnerTypes.some(t => t.value === newTypeValue.trim())) {
      setSaveStatus({ type: 'error', message: 'Тип с таким значением уже существует' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    const newType = {
      value: newTypeValue.trim(),
      label: {
        ru: newTypeLabels.ru.trim(),
        en: newTypeLabels.en.trim() || newTypeLabels.ru.trim(),
        tj: newTypeLabels.tj.trim() || newTypeLabels.ru.trim(),
      }
    }
    const newTypes = [...partnerTypes, newType]
    savePartnerTypes(newTypes)
    setNewTypeValue('')
    setNewTypeLabels({ ru: '', en: '', tj: '' })
  }

  const handleDeleteType = (valueToDelete) => {
    // Check if any partners use this type
    const partnersWithType = partners.filter(p => p.partner_type === valueToDelete)
    if (partnersWithType.length > 0) {
      setSaveStatus({ type: 'error', message: `Невозможно удалить: ${partnersWithType.length} партнёр(ов) используют этот тип` })
      setTimeout(() => setSaveStatus(null), 5000)
      return
    }

    const newTypes = partnerTypes.filter(t => t.value !== valueToDelete)
    if (newTypes.length === 0) {
      setSaveStatus({ type: 'error', message: 'Должен остаться хотя бы один тип' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }
    savePartnerTypes(newTypes)
  }

  const seedDefaultPartners = async () => {
    console.log('Seeding default partners...')
    // First, save the partner types
    try {
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: [
            { key: 'partner_types', value: JSON.stringify(DEFAULT_PARTNER_TYPES) }
          ]
        })
      })
      setPartnerTypes(DEFAULT_PARTNER_TYPES)
    } catch (err) {
      console.error('Failed to seed partner types:', err)
    }

    // Then seed partners
    for (const partner of defaultPartnersData) {
      try {
        await apiRequest('/api/admin/partners', {
          method: 'POST',
          body: JSON.stringify(partner)
        })
      } catch (err) {
        console.error('Failed to seed partner:', partner.name, err)
      }
    }
  }

  const loadPartners = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/api/admin/partners')
      // If no partners exist, seed default data
      if (data.length === 0) {
        await seedDefaultPartners()
        const newData = await apiRequest('/api/admin/partners')
        setPartners(newData)
      } else {
        setPartners(data)
      }
    } catch (err) {
      console.error('Failed to load partners:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePartner = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      if (editingPartner && editingPartner.id) {
        await apiRequest(`/api/admin/partners/${editingPartner.id}`, {
          method: 'PUT',
          body: JSON.stringify(partnerForm)
        })
      } else {
        await apiRequest('/api/admin/partners', {
          method: 'POST',
          body: JSON.stringify(partnerForm)
        })
      }
      setSaveStatus({ type: 'success', message: 'Партнёр сохранён!' })
      setEditingPartner(null)
      resetPartnerForm()
      loadPartners()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save partner:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Удалить этого партнёра?')) return
    try {
      await apiRequest(`/api/admin/partners/${id}`, { method: 'DELETE' })
      setSaveStatus({ type: 'success', message: 'Партнёр удалён!' })
      loadPartners()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to delete partner:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка удаления: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetPartnerForm = () => {
    setPartnerForm({
      name: '',
      logo: '/assets/images/partner-default.png',
      website: '',
      partner_type: 'partner',
      sort_order: partners.length
    })
    setLogoInputMode('url')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setSaveStatus({ type: 'error', message: 'Неподдерживаемый формат файла. Используйте PNG, JPG, GIF, WebP или SVG.' })
      setTimeout(() => setSaveStatus(null), 5000)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({ type: 'error', message: 'Файл слишком большой. Максимальный размер: 5MB' })
      setTimeout(() => setSaveStatus(null), 5000)
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'partners')

    try {
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      setPartnerForm({ ...partnerForm, logo: data.url || data.path })
      setSaveStatus({ type: 'success', message: 'Логотип загружен!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Upload error:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка загрузки: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Group partners by type dynamically
  const groupedPartners = partnerTypes.reduce((acc, type) => {
    acc[type.value] = partners.filter(p => p.partner_type === type.value)
    return acc
  }, {})

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Партнёры</h2>
          <p>Управление списком партнёров и организаторов</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={() => setShowTypesEditor(!showTypesEditor)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            Типы партнёров
          </button>
          <button className="btn-primary" onClick={() => { setEditingPartner({}); resetPartnerForm() }}>
            + Добавить партнёра
          </button>
        </div>
      </div>

      {/* Partner Types Editor Modal */}
      {showTypesEditor && (
        <div className="modal-overlay" onClick={() => setShowTypesEditor(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Настройка типов партнёров</h3>
              <button className="btn-close" onClick={() => setShowTypesEditor(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Existing types list */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Существующие типы ({partnerTypes.length})
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {partnerTypes.map(type => (
                    <div
                      key={type.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{getTypeLabel(type, 'ru')}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                          EN: {getTypeLabel(type, 'en')} | TJ: {getTypeLabel(type, 'tj')}
                        </span>
                        <span style={{ fontSize: '10px', color: '#d1d5db', fontFamily: 'monospace' }}>
                          {type.value}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteType(type.value)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                        title="Удалить тип"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new type form */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '16px', display: 'block' }}>
                  Добавить новый тип
                </label>

                {/* Language tabs */}
                <div className="lang-tab-buttons" style={{ marginBottom: '16px' }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`lang-tab-btn ${typesEditorLang === lang.code ? 'active' : ''}`}
                      onClick={() => setTypesEditorLang(lang.code)}
                    >
                      <img src={lang.flag} alt={lang.label} style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                      {lang.label}
                    </button>
                  ))}
                </div>

                <div className="form-row" style={{ marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>
                      Название ({LANGUAGES.find(l => l.code === typesEditorLang)?.label})
                      {typesEditorLang === 'ru' && <span style={{ color: '#ef4444' }}> *</span>}
                    </label>
                    <input
                      type="text"
                      value={newTypeLabels[typesEditorLang]}
                      onChange={(e) => {
                        const label = e.target.value
                        setNewTypeLabels({ ...newTypeLabels, [typesEditorLang]: label })
                        // Auto-generate value from Russian label only
                        if (typesEditorLang === 'ru') {
                          setNewTypeValue(transliterate(label))
                        }
                      }}
                      placeholder={typesEditorLang === 'ru' ? 'Спонсор' : typesEditorLang === 'en' ? 'Sponsor' : 'Сарпараст'}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Значение (авто)</label>
                    <input
                      type="text"
                      value={newTypeValue}
                      onChange={(e) => setNewTypeValue(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="sponsor"
                      style={{ background: '#f9fafb' }}
                    />
                  </div>
                </div>

                {/* Show all language inputs preview */}
                {(newTypeLabels.ru || newTypeLabels.en || newTypeLabels.tj) && (
                  <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#f0f9ff', borderRadius: '8px', fontSize: '13px', border: '1px solid #bae6fd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#0ea5e9">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                      <span style={{ fontWeight: '600', color: '#0369a1' }}>Превью нового типа</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#0c4a6e' }}>
                      <span><img src={LANGUAGES[0].flag} alt="RU" style={{ width: '14px', height: '10px', marginRight: '4px', verticalAlign: 'middle' }} />{newTypeLabels.ru || '—'}</span>
                      <span><img src={LANGUAGES[1].flag} alt="EN" style={{ width: '14px', height: '10px', marginRight: '4px', verticalAlign: 'middle' }} />{newTypeLabels.en || '—'}</span>
                      <span><img src={LANGUAGES[2].flag} alt="TJ" style={{ width: '14px', height: '10px', marginRight: '4px', verticalAlign: 'middle' }} />{newTypeLabels.tj || '—'}</span>
                    </div>
                  </div>
                )}

                <button
                  className="btn-primary"
                  onClick={handleAddType}
                  style={{ width: '100%' }}
                >
                  + Добавить тип
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTypesEditor(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`} style={{ marginBottom: '20px' }}>
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

      {editingPartner && (
        <div className="modal-overlay" onClick={() => setEditingPartner(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPartner.id ? 'Редактировать партнёра' : 'Новый партнёр'}</h3>
              <button className="btn-close" onClick={() => setEditingPartner(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Название</label>
                  <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} placeholder="Название организации" />
                </div>
                <div className="form-group">
                  <label>Тип партнёра</label>
                  <select value={partnerForm.partner_type} onChange={(e) => setPartnerForm({...partnerForm, partner_type: e.target.value})}>
                    {partnerTypes.map(type => (
                      <option key={type.value} value={type.value}>{getTypeLabel(type, 'ru')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Логотип</label>
                <div className="source-toggle" style={{ marginBottom: '12px' }}>
                  <button
                    type="button"
                    className={`toggle-btn ${logoInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => setLogoInputMode('url')}
                  >
                    URL ссылка
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${logoInputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setLogoInputMode('upload')}
                  >
                    Загрузить файл
                  </button>
                </div>

                {logoInputMode === 'url' ? (
                  <input
                    type="text"
                    value={partnerForm.logo}
                    onChange={(e) => setPartnerForm({...partnerForm, logo: e.target.value})}
                    placeholder="/assets/images/partners/logo.png"
                  />
                ) : (
                  <div className="upload-area">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                      style={{ display: 'none' }}
                      id="partner-logo-upload"
                    />
                    <label
                      htmlFor="partner-logo-upload"
                      className={`upload-label ${uploading ? 'disabled' : ''}`}
                      style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                    >
                      {uploading ? (
                        <>
                          <svg className="save-status-spinner" viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                          </svg>
                          <span>Загрузка...</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                          </svg>
                          <span>Нажмите для загрузки</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>PNG, JPG, GIF, WebP, SVG (макс. 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Веб-сайт</label>
                <input type="text" value={partnerForm.website} onChange={(e) => setPartnerForm({...partnerForm, website: e.target.value})} placeholder="https://example.com" />
              </div>

              <div className="form-group">
                <label>Порядок сортировки</label>
                <input type="number" value={partnerForm.sort_order} onChange={(e) => setPartnerForm({...partnerForm, sort_order: parseInt(e.target.value) || 0})} style={{maxWidth: '100px'}} />
              </div>

              {partnerForm.logo && (
                <div className="logo-preview" style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Превью логотипа:</label>
                  <img src={partnerForm.logo} alt="Logo preview" style={{maxWidth: '150px', maxHeight: '80px', objectFit: 'contain', background: '#f5f5f5', padding: '10px', borderRadius: '8px'}} />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingPartner(null)}>Отмена</button>
              <button className="btn-primary" onClick={handleSavePartner}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Загрузка...</div>
      ) : (
        <>
          {Object.entries(groupedPartners).map(([type, typePartners]) => (
            typePartners.length > 0 && (
              <div key={type} className="admin-card">
                <h3>{getTypeLabel(partnerTypes.find(t => t.value === type), 'ru') || type}</h3>
                <div className="items-grid partners-grid">
                  {typePartners.map(partner => (
                    <div key={partner.id} className="item-card partner-card">
                      <img src={partner.logo} alt={partner.name} className="partner-logo" />
                      <div className="item-info">
                        <strong>{partner.name}</strong>
                        {partner.website && <a href={partner.website} target="_blank" rel="noopener noreferrer" className="partner-link">{partner.website}</a>}
                      </div>
                      <div className="item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditingPartner(partner)
                          setPartnerForm({
                            name: partner.name || '',
                            logo: partner.logo || '',
                            website: partner.website || '',
                            partner_type: partner.partner_type || 'partner',
                            sort_order: partner.sort_order || 0
                          })
                        }}>Изменить</button>
                        <button className="btn-delete" onClick={() => handleDeletePartner(partner.id)}>Удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </>
      )}
    </div>
  )
}
