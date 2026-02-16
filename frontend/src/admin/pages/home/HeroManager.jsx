import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function HeroManager() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)

  // Default data for hero section
  const defaultHeroData = {
    video_url: '/assets/video/hero-background.mp4',
    youtube_url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
    video_source: 'url',
    title_ru: '4-ая Международная конференция высокого уровня по Международному десятилетию действий «Вода для устойчивого развития»',
    title_en: '4th High-Level International Conference on the International Decade for Action "Water for Sustainable Development"',
    title_tj: 'Конфронси 4-уми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор»',
    dates_ru: '25-28 мая 2026',
    dates_en: 'May 25-28, 2026',
    dates_tj: '25-28 майи 2026',
    location_ru: 'Кохи Сомон, Душанбе',
    location_en: 'Kohi Somon, Dushanbe',
    location_tj: 'Коҳи Сомон, Душанбе',
    quote_ru: '«Вода — это основа жизни и устойчивого развития. Мы должны объединить усилия всего мирового сообщества для решения глобальных водных проблем.»',
    quote_en: '"Water is the foundation of life and sustainable development. We must unite the efforts of the entire global community to solve global water problems."',
    quote_tj: '«Об асоси ҳаёт ва рушди устувор аст. Мо бояд кӯшишҳои тамоми ҷомеаи ҷаҳониро барои ҳалли мушкилоти ҷаҳонии об муттаҳид созем.»',
    quote_author_ru: 'Эмомали Рахмон',
    quote_author_en: 'Emomali Rahmon',
    quote_author_tj: 'Эмомалӣ Раҳмон',
    registration_btn_ru: 'Регистрация',
    registration_btn_en: 'Registration',
    registration_btn_tj: 'Бақайдгирӣ',
    video_btn_ru: 'Видео презентация',
    video_btn_en: 'Video Presentation',
    video_btn_tj: 'Видео презентатсия',
    show_registration_btn: 'true',
    show_video_btn: 'true',
  }

  const [heroData, setHeroData] = useState(defaultHeroData)

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
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      // Use saved settings if they exist, otherwise keep default values
      setHeroData(prev => ({
        ...prev,
        video_url: settings.hero_video_url || prev.video_url,
        youtube_url: settings.hero_youtube_url || prev.youtube_url,
        video_source: settings.hero_video_source || prev.video_source,
        title_ru: settings.hero_title_ru || prev.title_ru,
        title_en: settings.hero_title_en || prev.title_en,
        title_tj: settings.hero_title_tj || prev.title_tj,
        dates_ru: settings.hero_dates_ru || prev.dates_ru,
        dates_en: settings.hero_dates_en || prev.dates_en,
        dates_tj: settings.hero_dates_tj || prev.dates_tj,
        location_ru: settings.hero_location_ru || prev.location_ru,
        location_en: settings.hero_location_en || prev.location_en,
        location_tj: settings.hero_location_tj || prev.location_tj,
        quote_ru: settings.hero_quote_ru || prev.quote_ru,
        quote_en: settings.hero_quote_en || prev.quote_en,
        quote_tj: settings.hero_quote_tj || prev.quote_tj,
        quote_author_ru: settings.hero_quote_author_ru || prev.quote_author_ru,
        quote_author_en: settings.hero_quote_author_en || prev.quote_author_en,
        quote_author_tj: settings.hero_quote_author_tj || prev.quote_author_tj,
        registration_btn_ru: settings.hero_registration_btn_ru || prev.registration_btn_ru,
        registration_btn_en: settings.hero_registration_btn_en || prev.registration_btn_en,
        registration_btn_tj: settings.hero_registration_btn_tj || prev.registration_btn_tj,
        video_btn_ru: settings.hero_video_btn_ru || prev.video_btn_ru,
        video_btn_en: settings.hero_video_btn_en || prev.video_btn_en,
        video_btn_tj: settings.hero_video_btn_tj || prev.video_btn_tj,
        show_registration_btn: settings.hero_show_registration_btn !== undefined ? settings.hero_show_registration_btn : prev.show_registration_btn,
        show_video_btn: settings.hero_show_video_btn !== undefined ? settings.hero_show_video_btn : prev.show_video_btn,
      }))
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: Object.entries(heroData).map(([key, value]) => ({
            key: `hero_${key}`,
            value: value
          }))
        })
      })
      setSaveStatus({ type: 'success', message: 'Баннер успешно сохранён!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save hero:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  if (loading) {
    return <div className="section-loading">Загрузка...</div>
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <h2>Главный баннер</h2>
        <p>Настройка главного баннера на главной странице</p>
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
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Conference Title */}
      <div className="form-section">
        <h3 className="form-section-title">Название конференции</h3>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
          <textarea
            value={heroData.title_ru}
            onChange={e => setHeroData({ ...heroData, title_ru: e.target.value })}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
          <textarea
            value={heroData.title_en}
            onChange={e => setHeroData({ ...heroData, title_en: e.target.value })}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
          <textarea
            value={heroData.title_tj}
            onChange={e => setHeroData({ ...heroData, title_tj: e.target.value })}
            rows="2"
          />
        </div>
      </div>

      {/* Date and Location */}
      <div className="form-section">
        <h3 className="form-section-title">Дата и место проведения</h3>
        <div className="form-row">
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Даты (Русский)</label>
            <input
              type="text"
              value={heroData.dates_ru}
              onChange={e => setHeroData({ ...heroData, dates_ru: e.target.value })}
              placeholder="25-28 мая 2026"
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Даты (Английский)</label>
            <input
              type="text"
              value={heroData.dates_en}
              onChange={e => setHeroData({ ...heroData, dates_en: e.target.value })}
              placeholder="May 25-28, 2026"
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Даты (Таджикский)</label>
            <input
              type="text"
              value={heroData.dates_tj}
              onChange={e => setHeroData({ ...heroData, dates_tj: e.target.value })}
              placeholder="25-28 майи 2026"
            />
          </div>
        </div>
        <h4 className="form-subsection-title">Место проведения</h4>
        <div className="form-row">
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
            <input
              type="text"
              value={heroData.location_ru}
              onChange={e => setHeroData({ ...heroData, location_ru: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
            <input
              type="text"
              value={heroData.location_en}
              onChange={e => setHeroData({ ...heroData, location_en: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
            <input
              type="text"
              value={heroData.location_tj}
              onChange={e => setHeroData({ ...heroData, location_tj: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="form-section">
        <h3 className="form-section-title">Цитата</h3>
        <h4 className="form-subsection-title">Текст цитаты</h4>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
          <textarea
            value={heroData.quote_ru}
            onChange={e => setHeroData({ ...heroData, quote_ru: e.target.value })}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
          <textarea
            value={heroData.quote_en}
            onChange={e => setHeroData({ ...heroData, quote_en: e.target.value })}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
          <textarea
            value={heroData.quote_tj}
            onChange={e => setHeroData({ ...heroData, quote_tj: e.target.value })}
            rows="2"
          />
        </div>
        <h4 className="form-subsection-title">Автор цитаты</h4>
        <div className="form-row">
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
            <input
              type="text"
              value={heroData.quote_author_ru}
              onChange={e => setHeroData({ ...heroData, quote_author_ru: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
            <input
              type="text"
              value={heroData.quote_author_en}
              onChange={e => setHeroData({ ...heroData, quote_author_en: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
            <input
              type="text"
              value={heroData.quote_author_tj}
              onChange={e => setHeroData({ ...heroData, quote_author_tj: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="form-section">
        <h3 className="form-section-title">Кнопки</h3>

        <h4 className="form-subsection-title">Кнопка регистрации</h4>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={heroData.show_registration_btn === 'true'}
              onChange={e => setHeroData({ ...heroData, show_registration_btn: e.target.checked ? 'true' : 'false' })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Показывать кнопку регистрации</span>
          </label>
        </div>
        {heroData.show_registration_btn === 'true' && (
          <div className="form-row">
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
              <input
                type="text"
                value={heroData.registration_btn_ru}
                onChange={e => setHeroData({ ...heroData, registration_btn_ru: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
              <input
                type="text"
                value={heroData.registration_btn_en}
                onChange={e => setHeroData({ ...heroData, registration_btn_en: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
              <input
                type="text"
                value={heroData.registration_btn_tj}
                onChange={e => setHeroData({ ...heroData, registration_btn_tj: e.target.value })}
              />
            </div>
          </div>
        )}

        <h4 className="form-subsection-title">Кнопка видео</h4>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={heroData.show_video_btn === 'true'}
              onChange={e => setHeroData({ ...heroData, show_video_btn: e.target.checked ? 'true' : 'false' })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Показывать кнопку видео</span>
          </label>
        </div>
        {heroData.show_video_btn === 'true' && (
          <div className="form-row">
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
              <input
                type="text"
                value={heroData.video_btn_ru}
                onChange={e => setHeroData({ ...heroData, video_btn_ru: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
              <input
                type="text"
                value={heroData.video_btn_en}
                onChange={e => setHeroData({ ...heroData, video_btn_en: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
              <input
                type="text"
                value={heroData.video_btn_tj}
                onChange={e => setHeroData({ ...heroData, video_btn_tj: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Background Video */}
      <div className="form-section">
        <h3 className="form-section-title">Фоновое видео</h3>
        <div className="video-source-toggle">
          <label className="toggle-label">Источник видео:</label>
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${heroData.video_source === 'url' ? 'active' : ''}`}
              onClick={() => setHeroData({ ...heroData, video_source: 'url' })}
            >
              URL файла
            </button>
            <button
              type="button"
              className={`toggle-btn ${heroData.video_source === 'youtube' ? 'active' : ''}`}
              onClick={() => setHeroData({ ...heroData, video_source: 'youtube' })}
            >
              YouTube
            </button>
          </div>
        </div>

        {heroData.video_source === 'url' ? (
          <div className="form-group">
            <label>URL видео файла</label>
            <input
              type="text"
              value={heroData.video_url}
              onChange={e => setHeroData({ ...heroData, video_url: e.target.value })}
              placeholder="/assets/video/hero-background.mp4"
            />
            <span className="form-hint">Путь к файлу фонового видео</span>
          </div>
        ) : (
          <div className="form-group">
            <label>YouTube URL</label>
            <input
              type="text"
              value={heroData.youtube_url}
              onChange={e => setHeroData({ ...heroData, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <span className="form-hint">Ссылка на видео YouTube</span>
          </div>
        )}
      </div>

      <button className="btn-save" onClick={handleSaveHero}>
        Сохранить настройки баннера
      </button>
    </div>
  )
}
