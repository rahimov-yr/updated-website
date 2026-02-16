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
    title_line1: 'Душанбе, Таджикистан',
    title_line2: '4-ая МЕЖДУНАРОДНАЯ КОНФЕРЕНЦИЯ ВЫСОКОГО УРОВНЯ',
    title_line3: 'ПО МЕЖДУНАРОДНОМУ ДЕСЯТИЛЕТИЮ ДЕЙСТВИЙ',
    title_line4: '«ВОДА ДЛЯ УСТОЙЧИВОГО РАЗВИТИЯ»',
    title_line5: '10-12 июня 2026',
  },
  en: {
    title_line1: 'Dushanbe, Tajikistan',
    title_line2: '4th HIGH-LEVEL INTERNATIONAL CONFERENCE ON THE',
    title_line3: 'INTERNATIONAL DECADE FOR ACTION',
    title_line4: '"WATER FOR SUSTAINABLE DEVELOPMENT"',
    title_line5: 'June 10-12, 2026',
  },
  tj: {
    title_line1: 'Душанбе, Тоҷикистон',
    title_line2: 'КОНФРОНСИ 4-уми БАЙНАЛМИЛАЛИИ САТҲИ',
    title_line3: 'БАЛАНД ОИД БА ДАҲСОЛАИ АМАЛ',
    title_line4: '«ОБ БАРОИ РУШДИ УСТУВОР»',
    title_line5: '10-12 июни 2026',
  },
}

export default function LoadingManager() {
  const { token } = useAuth()
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('ru')
  const [loadingData, setLoadingData] = useState({
    logo_url: '/assets/images/logo-mini.png',
    duration: '2',
    bg_color_start: '#0c4a6e',
    bg_color_mid: '#075985',
    bg_color_end: '#0369a1',
    date_color: '#7dd3fc',
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

      const newData = {
        logo_url: settings.loading_logo_url || '/assets/images/logo-mini.png',
        duration: settings.loading_duration || '2',
        bg_color_start: settings.loading_bg_color_start || '#0c4a6e',
        bg_color_mid: settings.loading_bg_color_mid || '#075985',
        bg_color_end: settings.loading_bg_color_end || '#0369a1',
        date_color: settings.loading_date_color || '#7dd3fc',
      }

      LANGUAGES.forEach(({ code }) => {
        newData[code] = {
          title_line1: settings[`loading_title_line1_${code}`] || DEFAULT_DATA[code].title_line1,
          title_line2: settings[`loading_title_line2_${code}`] || DEFAULT_DATA[code].title_line2,
          title_line3: settings[`loading_title_line3_${code}`] || DEFAULT_DATA[code].title_line3,
          title_line4: settings[`loading_title_line4_${code}`] || DEFAULT_DATA[code].title_line4,
          title_line5: settings[`loading_title_line5_${code}`] || DEFAULT_DATA[code].title_line5,
        }
      })

      setLoadingData(newData)
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      const settingsToSave = [
        { key: 'loading_logo_url', value: loadingData.logo_url },
        { key: 'loading_duration', value: loadingData.duration },
        { key: 'loading_bg_color_start', value: loadingData.bg_color_start },
        { key: 'loading_bg_color_mid', value: loadingData.bg_color_mid },
        { key: 'loading_bg_color_end', value: loadingData.bg_color_end },
        { key: 'loading_date_color', value: loadingData.date_color },
      ]

      LANGUAGES.forEach(({ code }) => {
        settingsToSave.push(
          { key: `loading_title_line1_${code}`, value: loadingData[code].title_line1 },
          { key: `loading_title_line2_${code}`, value: loadingData[code].title_line2 },
          { key: `loading_title_line3_${code}`, value: loadingData[code].title_line3 },
          { key: `loading_title_line4_${code}`, value: loadingData[code].title_line4 },
          { key: `loading_title_line5_${code}`, value: loadingData[code].title_line5 },
        )
      })

      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsToSave })
      })
      setSaveStatus({ type: 'success', message: 'Настройки загрузочного экрана сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const updateLangField = (field, value) => {
    setLoadingData(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }))
  }

  const currentLangData = loadingData[activeLang] || DEFAULT_DATA[activeLang]

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Загрузочный экран</h2>
          <p>Настройка логотипа, текстов и оформления загрузочного экрана</p>
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

      {/* Logo & General Settings */}
      <div className="form-section">
        <h3 className="form-section-title">Основные настройки</h3>

        <div className="form-row">
          <div className="form-group">
            <label>URL логотипа</label>
            <input
              type="text"
              value={loadingData.logo_url}
              onChange={(e) => setLoadingData({ ...loadingData, logo_url: e.target.value })}
              placeholder="/assets/images/logo-mini.png"
            />
            <span className="form-hint">Путь к изображению логотипа (рекомендуемый размер: 120×120px)</span>
          </div>

          <div className="form-group">
            <label>Длительность отображения (сек)</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={loadingData.duration}
              onChange={(e) => setLoadingData({ ...loadingData, duration: e.target.value })}
              placeholder="2"
            />
            <span className="form-hint">Время показа загрузочного экрана в секундах (1–10)</span>
          </div>
        </div>

        {loadingData.logo_url && (
          <div style={{
            marginTop: '12px',
            padding: '16px',
            background: `linear-gradient(135deg, ${loadingData.bg_color_start}, ${loadingData.bg_color_mid}, ${loadingData.bg_color_end})`,
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img
              src={loadingData.logo_url}
              alt="Preview"
              style={{ width: '60px', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Предпросмотр логотипа</span>
          </div>
        )}
      </div>

      {/* Color Settings */}
      <div className="form-section">
        <h3 className="form-section-title">Цвета оформления</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Градиент фона — начало</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={loadingData.bg_color_start}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_start: e.target.value })}
                style={{ width: '50px', height: '36px', padding: '2px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={loadingData.bg_color_start}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_start: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Градиент фона — середина</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={loadingData.bg_color_mid}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_mid: e.target.value })}
                style={{ width: '50px', height: '36px', padding: '2px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={loadingData.bg_color_mid}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_mid: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Градиент фона — конец</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={loadingData.bg_color_end}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_end: e.target.value })}
                style={{ width: '50px', height: '36px', padding: '2px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={loadingData.bg_color_end}
                onChange={(e) => setLoadingData({ ...loadingData, bg_color_end: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Цвет даты</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={loadingData.date_color}
                onChange={(e) => setLoadingData({ ...loadingData, date_color: e.target.value })}
                style={{ width: '50px', height: '36px', padding: '2px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={loadingData.date_color}
                onChange={(e) => setLoadingData({ ...loadingData, date_color: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
            <span className="form-hint">Цвет строки с датой (нижняя строка)</span>
          </div>
        </div>

        {/* Gradient preview */}
        <div style={{
          marginTop: '12px',
          height: '48px',
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${loadingData.bg_color_start} 0%, ${loadingData.bg_color_mid} 50%, ${loadingData.bg_color_end} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: loadingData.date_color, fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em' }}>
            Предпросмотр градиента и цвета даты
          </span>
        </div>
      </div>

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

      {/* Text Content */}
      <div className="form-section">
        <h3 className="form-section-title">Тексты загрузочного экрана ({LANGUAGES.find(l => l.code === activeLang)?.label})</h3>

        <div className="form-group">
          <label>Строка 1 — Место проведения (отображается над заголовком)</label>
          <input
            type="text"
            value={currentLangData.title_line1}
            onChange={(e) => updateLangField('title_line1', e.target.value)}
            placeholder={DEFAULT_DATA[activeLang].title_line1}
          />
        </div>

        <div className="form-group">
          <label>Строка 2 — Заголовок (линия 1)</label>
          <input
            type="text"
            value={currentLangData.title_line2}
            onChange={(e) => updateLangField('title_line2', e.target.value)}
            placeholder={DEFAULT_DATA[activeLang].title_line2}
          />
        </div>

        <div className="form-group">
          <label>Строка 3 — Заголовок (линия 2)</label>
          <input
            type="text"
            value={currentLangData.title_line3}
            onChange={(e) => updateLangField('title_line3', e.target.value)}
            placeholder={DEFAULT_DATA[activeLang].title_line3}
          />
        </div>

        <div className="form-group">
          <label>Строка 4 — Заголовок (линия 3)</label>
          <input
            type="text"
            value={currentLangData.title_line4}
            onChange={(e) => updateLangField('title_line4', e.target.value)}
            placeholder={DEFAULT_DATA[activeLang].title_line4}
          />
        </div>

        <div className="form-group">
          <label>Строка 5 — Дата (отображается под заголовком)</label>
          <input
            type="text"
            value={currentLangData.title_line5}
            onChange={(e) => updateLangField('title_line5', e.target.value)}
            placeholder={DEFAULT_DATA[activeLang].title_line5}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-save" onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  )
}
