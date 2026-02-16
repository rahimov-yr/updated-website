import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

export default function HomeNewsManager() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState([])
  const [activeLang, setActiveLang] = useState('ru')
  const [saveStatus, setSaveStatus] = useState(null)
  const [sectionTitle, setSectionTitle] = useState({
    ru: 'Новости',
    en: 'News',
    tj: 'Хабарҳо',
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
    loadNews()
    loadSettings()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/api/admin/news')
      // Show first 6 news items for home page preview
      setNews(data.items ? data.items.slice(0, 6) : data.slice(0, 6))
    } catch (err) {
      console.error('Failed to load news:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      setSectionTitle({
        ru: settings.news_section_title_ru || 'Новости',
        en: settings.news_section_title_en || 'News',
        tj: settings.news_section_title_tj || 'Хабарҳо',
      })
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSaveTitle = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      const settingsArray = [
        { key: 'news_section_title_ru', value: sectionTitle.ru },
        { key: 'news_section_title_en', value: sectionTitle.en },
        { key: 'news_section_title_tj', value: sectionTitle.tj },
      ]

      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsArray })
      })

      setSaveStatus({ type: 'success', message: 'Заголовок сохранён!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Новости на главной</h2>
          <p>Превью последних новостей, отображаемых на главной странице</p>
        </div>
        <Link to="/admin/content/news" className="btn-primary">
          Управление новостями →
        </Link>
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

      {/* Section Title Settings */}
      <div className="form-section" style={{ marginBottom: '24px' }}>
        <h3 className="form-section-title">Заголовок секции</h3>
        <p className="card-description" style={{ marginBottom: '16px' }}>
          Заголовок, отображаемый перед блоком новостей на главной странице
        </p>

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
          <label>Заголовок ({LANGUAGES.find(l => l.code === activeLang)?.label})</label>
          <input
            type="text"
            value={sectionTitle[activeLang]}
            onChange={(e) => setSectionTitle(prev => ({ ...prev, [activeLang]: e.target.value }))}
            placeholder={activeLang === 'ru' ? 'Новости' : activeLang === 'en' ? 'News' : 'Хабарҳо'}
          />
        </div>

        <button className="btn-primary" onClick={handleSaveTitle} style={{ marginTop: '12px' }}>
          Сохранить заголовок
        </button>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Последние 6 новостей</h3>
        <p className="card-description">
          На главной странице автоматически отображаются 6 последних опубликованных новостей.
          Для редактирования перейдите в раздел <Link to="/admin/content/news">Все новости</Link>.
        </p>

        {loading ? (
          <div className="loading-state">Загрузка...</div>
        ) : (
          <div className="news-preview-grid">
            {news.map((item, index) => (
              <div key={item.id || index} className="news-preview-card">
                {item.image && (
                  <div className="news-preview-image">
                    <img src={item.image} alt={item.title_ru} />
                  </div>
                )}
                <div className="news-preview-content">
                  <span className="news-preview-category">{item.category}</span>
                  <h4>{item.title_ru}</h4>
                  <p>{item.excerpt_ru?.substring(0, 100)}...</p>
                  <span className="news-preview-date">{item.published_at}</span>
                </div>
              </div>
            ))}

            {news.length === 0 && (
              <div className="empty-state">
                <p>Нет новостей для отображения</p>
                <Link to="/admin/content/news" className="btn-secondary">Добавить новость</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
