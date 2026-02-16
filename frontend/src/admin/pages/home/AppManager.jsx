import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

const DEFAULT_DATA = {
  ru: {
    app_title: 'Скачайте официальное\nприложение конференции',
    app_description: 'Получите доступ к программе, материалам и уведомлениям конференции прямо на вашем смартфоне. Интерактивная карта, расписание сессий и многое другое.',
    feature1_title: 'Программа и расписание',
    feature1_description: 'Полное расписание всех мероприятий',
    feature2_title: 'Push-уведомления',
    feature2_description: 'Мгновенные оповещения об изменениях',
    feature3_title: 'Интерактивная карта',
    feature3_description: 'Навигация по площадке конференции',
    feature4_title: 'Материалы участников',
    feature4_description: 'Доступ к документам и презентациям',
  },
  en: {
    app_title: 'Download the official\nconference app',
    app_description: 'Get access to the program, materials and conference notifications right on your smartphone. Interactive map, session schedule and much more.',
    feature1_title: 'Program & Schedule',
    feature1_description: 'Complete schedule of all events',
    feature2_title: 'Push Notifications',
    feature2_description: 'Instant alerts about changes',
    feature3_title: 'Interactive Map',
    feature3_description: 'Navigate the conference venue',
    feature4_title: 'Participant Materials',
    feature4_description: 'Access to documents and presentations',
  },
  tj: {
    app_title: 'Барномаи расмии\nконференсияро боргирӣ кунед',
    app_description: 'Ба барнома, маводҳо ва огоҳиномаҳои конференсия мустақиман дар смартфони худ дастрасӣ пайдо кунед. Харитаи интерактивӣ, ҷадвали ҷаласаҳо ва бисёр чизҳои дигар.',
    feature1_title: 'Барнома ва ҷадвал',
    feature1_description: 'Ҷадвали пурраи ҳамаи чорабиниҳо',
    feature2_title: 'Огоҳиномаҳои Push',
    feature2_description: 'Огоҳиҳои фаврӣ дар бораи тағйирот',
    feature3_title: 'Харитаи интерактивӣ',
    feature3_description: 'Роҳбарӣ дар майдони конференсия',
    feature4_title: 'Маводҳои иштирокчиён',
    feature4_description: 'Дастрасӣ ба ҳуҷҷатҳо ва презентатсияҳо',
  },
}

export default function AppManager() {
  const { token } = useAuth()
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('ru')
  const [appData, setAppData] = useState({
    app_store_url: '#',
    google_play_url: '#',
    ...DEFAULT_DATA,
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
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      // Parse JSON for multilingual fields or use defaults
      const parseJsonSetting = (key, lang, defaultValue) => {
        try {
          if (settings[key]) {
            const parsed = JSON.parse(settings[key])
            return parsed[lang] || defaultValue
          }
        } catch (e) {
          // If not JSON, might be old single-value format
          if (lang === 'ru' && settings[key]) return settings[key]
        }
        return defaultValue
      }

      const newData = {
        app_store_url: settings.app_store_url || '#',
        google_play_url: settings.google_play_url || '#',
      }

      LANGUAGES.forEach(({ code }) => {
        newData[code] = {
          app_title: parseJsonSetting('app_title', code, DEFAULT_DATA[code].app_title),
          app_description: parseJsonSetting('app_description', code, DEFAULT_DATA[code].app_description),
          feature1_title: parseJsonSetting('feature1_title', code, DEFAULT_DATA[code].feature1_title),
          feature1_description: parseJsonSetting('feature1_description', code, DEFAULT_DATA[code].feature1_description),
          feature2_title: parseJsonSetting('feature2_title', code, DEFAULT_DATA[code].feature2_title),
          feature2_description: parseJsonSetting('feature2_description', code, DEFAULT_DATA[code].feature2_description),
          feature3_title: parseJsonSetting('feature3_title', code, DEFAULT_DATA[code].feature3_title),
          feature3_description: parseJsonSetting('feature3_description', code, DEFAULT_DATA[code].feature3_description),
          feature4_title: parseJsonSetting('feature4_title', code, DEFAULT_DATA[code].feature4_title),
          feature4_description: parseJsonSetting('feature4_description', code, DEFAULT_DATA[code].feature4_description),
        }
      })

      setAppData(newData)
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      // Build multilingual JSON objects
      const buildMultilangValue = (field) => {
        const obj = {}
        LANGUAGES.forEach(({ code }) => {
          obj[code] = appData[code][field]
        })
        return JSON.stringify(obj)
      }

      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: [
            { key: 'app_store_url', value: appData.app_store_url },
            { key: 'google_play_url', value: appData.google_play_url },
            { key: 'app_title', value: buildMultilangValue('app_title') },
            { key: 'app_description', value: buildMultilangValue('app_description') },
            { key: 'feature1_title', value: buildMultilangValue('feature1_title') },
            { key: 'feature1_description', value: buildMultilangValue('feature1_description') },
            { key: 'feature2_title', value: buildMultilangValue('feature2_title') },
            { key: 'feature2_description', value: buildMultilangValue('feature2_description') },
            { key: 'feature3_title', value: buildMultilangValue('feature3_title') },
            { key: 'feature3_description', value: buildMultilangValue('feature3_description') },
            { key: 'feature4_title', value: buildMultilangValue('feature4_title') },
            { key: 'feature4_description', value: buildMultilangValue('feature4_description') },
          ]
        })
      })
      setSaveStatus({ type: 'success', message: 'Настройки приложения сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const updateLangField = (field, value) => {
    setAppData(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }))
  }

  const currentLangData = appData[activeLang] || DEFAULT_DATA[activeLang]

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Мобильное приложение</h2>
          <p>Настройка текстов и ссылок секции мобильного приложения</p>
        </div>
      </div>

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

      {/* Language Tabs */}
      <div className="lang-tab-buttons" style={{ marginBottom: '24px' }}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            className={`lang-tab-btn ${activeLang === lang.code ? 'active' : ''}`}
            onClick={() => setActiveLang(lang.code)}
          >
            <img src={lang.flag} alt={lang.code.toUpperCase()} className="lang-tab-flag" />
            <span className="lang-tab-label">{lang.label}</span>
          </button>
        ))}
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Основные тексты секции ({LANGUAGES.find(l => l.code === activeLang)?.label})</h3>

        <div className="form-group">
          <label>Заголовок секции</label>
          <textarea
            value={currentLangData.app_title}
            onChange={(e) => updateLangField('app_title', e.target.value)}
            placeholder="Скачайте официальное приложение конференции"
            rows={2}
            style={{ resize: 'vertical', minHeight: '60px' }}
          />
          <span className="form-hint">Используйте перенос строки для разделения текста на несколько строк</span>
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={currentLangData.app_description}
            onChange={(e) => updateLangField('app_description', e.target.value)}
            placeholder="Получите доступ к программе, материалам и уведомлениям..."
            rows={3}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Функции приложения ({LANGUAGES.find(l => l.code === activeLang)?.label})</h3>

        <div className="feature-editor-grid">
          <div className="feature-editor-item">
            <div className="feature-editor-number">1</div>
            <div className="feature-editor-fields">
              <div className="form-group">
                <label>Название функции</label>
                <input
                  type="text"
                  value={currentLangData.feature1_title}
                  onChange={(e) => updateLangField('feature1_title', e.target.value)}
                  placeholder="Программа и расписание"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <input
                  type="text"
                  value={currentLangData.feature1_description}
                  onChange={(e) => updateLangField('feature1_description', e.target.value)}
                  placeholder="Полное расписание всех мероприятий"
                />
              </div>
            </div>
          </div>

          <div className="feature-editor-item">
            <div className="feature-editor-number">2</div>
            <div className="feature-editor-fields">
              <div className="form-group">
                <label>Название функции</label>
                <input
                  type="text"
                  value={currentLangData.feature2_title}
                  onChange={(e) => updateLangField('feature2_title', e.target.value)}
                  placeholder="Push-уведомления"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <input
                  type="text"
                  value={currentLangData.feature2_description}
                  onChange={(e) => updateLangField('feature2_description', e.target.value)}
                  placeholder="Мгновенные оповещения об изменениях"
                />
              </div>
            </div>
          </div>

          <div className="feature-editor-item">
            <div className="feature-editor-number">3</div>
            <div className="feature-editor-fields">
              <div className="form-group">
                <label>Название функции</label>
                <input
                  type="text"
                  value={currentLangData.feature3_title}
                  onChange={(e) => updateLangField('feature3_title', e.target.value)}
                  placeholder="Интерактивная карта"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <input
                  type="text"
                  value={currentLangData.feature3_description}
                  onChange={(e) => updateLangField('feature3_description', e.target.value)}
                  placeholder="Навигация по площадке конференции"
                />
              </div>
            </div>
          </div>

          <div className="feature-editor-item">
            <div className="feature-editor-number">4</div>
            <div className="feature-editor-fields">
              <div className="form-group">
                <label>Название функции</label>
                <input
                  type="text"
                  value={currentLangData.feature4_title}
                  onChange={(e) => updateLangField('feature4_title', e.target.value)}
                  placeholder="Материалы участников"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <input
                  type="text"
                  value={currentLangData.feature4_description}
                  onChange={(e) => updateLangField('feature4_description', e.target.value)}
                  placeholder="Доступ к документам и презентациям"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Ссылки на магазины приложений</h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store URL
            </label>
            <input
              type="text"
              value={appData.app_store_url}
              onChange={(e) => setAppData({...appData, app_store_url: e.target.value})}
              placeholder="https://apps.apple.com/app/..."
            />
          </div>

          <div className="form-group">
            <label>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
              </svg>
              Google Play URL
            </label>
            <input
              type="text"
              value={appData.google_play_url}
              onChange={(e) => setAppData({...appData, google_play_url: e.target.value})}
              placeholder="https://play.google.com/store/apps/details?id=..."
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-save" onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  )
}
