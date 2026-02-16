import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const BANNER_PAGES = [
  { category: 'Основные страницы', pages: [
    { slug: 'conference', label: 'Конференция / Conference', defaults: { title_ru: 'Конференция', title_en: 'Conference', title_tj: 'Конфронс', subtitle_ru: 'Информация о конференции', subtitle_en: 'Conference information', subtitle_tj: 'Маълумот дар бораи конфронс' }},
    { slug: 'program', label: 'Программа / Program', defaults: { title_ru: 'Программа', title_en: 'Program', title_tj: 'Барнома', subtitle_ru: 'Расписание пленарных заседаний, тематических сессий и специальных мероприятий конференции', subtitle_en: 'Schedule of plenary sessions, thematic sessions and special conference events', subtitle_tj: 'Ҷадвали ҷаласаҳои пленарӣ, сессияҳои мавзӯӣ ва чорабиниҳои махсуси конфронс' }},
    { slug: 'events', label: 'Мероприятия / Events', defaults: { title_ru: 'Мероприятия', title_en: 'Events', title_tj: 'Чорабиниҳо', subtitle_ru: 'Мероприятия в рамках конференции', subtitle_en: 'Conference events', subtitle_tj: 'Чорабиниҳои конфронс' }},
    { slug: 'excursions', label: 'Экскурсии / Excursions', defaults: { title_ru: 'Экскурсии', title_en: 'Excursions', title_tj: 'Экскурсияҳо', subtitle_ru: 'Культурная программа для участников', subtitle_en: 'Cultural program for participants', subtitle_tj: 'Барномаи фарҳангӣ барои иштирокчиён' }},
    { slug: 'exhibition', label: 'Выставка / Exhibition', defaults: { title_ru: 'Выставка', title_en: 'Exhibition', title_tj: 'Намоишгоҳ', subtitle_ru: 'Международная выставка водных технологий', subtitle_en: 'International water technology exhibition', subtitle_tj: 'Намоишгоҳи байналмилалии технологияҳои обӣ' }},
    { slug: 'logistics', label: 'Логистика / Logistics', defaults: { title_ru: 'Логистика', title_en: 'Logistics', title_tj: 'Логистика', subtitle_ru: 'Практическая информация для участников', subtitle_en: 'Practical information for participants', subtitle_tj: 'Маълумоти амалӣ барои иштирокчиён' }},
    { slug: 'registration', label: 'Регистрация / Registration', defaults: { title_ru: 'Регистрация', title_en: 'Registration', title_tj: 'Бақайдгирӣ', subtitle_ru: 'Зарегистрируйтесь для участия в конференции', subtitle_en: 'Register to participate in the conference', subtitle_tj: 'Барои иштирок дар конфронс бақайдгирӣ шавед' }},
    { slug: 'contacts', label: 'Контакты / Contacts', defaults: { title_ru: 'Контакты', title_en: 'Contacts', title_tj: 'Тамос', subtitle_ru: 'Свяжитесь с нами', subtitle_en: 'Get in touch with us', subtitle_tj: 'Бо мо тамос гиред' }},
    { slug: 'news', label: 'Новости / News', defaults: { title_ru: 'Новости', title_en: 'News', title_tj: 'Хабарҳо', subtitle_ru: 'Последние новости конференции', subtitle_en: 'Latest conference news', subtitle_tj: 'Охирин хабарҳои конфронс' }},
  ]},
  { category: 'Конференция (подстраницы)', pages: [
    { slug: 'conference-introduction', label: 'Введение / Introduction', defaults: { title_ru: 'Введение', title_en: 'Introduction', title_tj: 'Муқаддима', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'conference-goals', label: 'Цели / Goals', defaults: { title_ru: 'Цели', title_en: 'Goals', title_tj: 'Мақсадҳо', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'conference-date-venue', label: 'Дата и место / Date & Venue', defaults: { title_ru: 'Дата и место проведения', title_en: 'Date and Venue', title_tj: 'Сана ва макон', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'conference-participation', label: 'Участие / Participation', defaults: { title_ru: 'Участие', title_en: 'Participation', title_tj: 'Иштирок', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
  ]},
  { category: 'Программа (подстраницы)', pages: [
    { slug: 'program-structure', label: 'Структура / Structure', defaults: { title_ru: 'Структура программы', title_en: 'Program Structure', title_tj: 'Сохтори барнома', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'program-plenary', label: 'Пленарное заседание / Plenary', defaults: { title_ru: 'Пленарное заседание', title_en: 'Plenary Session', title_tj: 'Ҷаласаи пленарӣ', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'program-events', label: 'Мероприятия программы / Events', defaults: { title_ru: 'Мероприятия в рамках конференции', title_en: 'Conference Events', title_tj: 'Чорабиниҳои конфронс', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'program-forums', label: 'Форумы / Forums', defaults: { title_ru: 'Форумы', title_en: 'Forums', title_tj: 'Форумҳо', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
  ]},
  { category: 'Мероприятия (подстраницы)', pages: [
    { slug: 'events-parallel', label: 'Параллельные / Parallel', defaults: { title_ru: 'Параллельные мероприятия', title_en: 'Parallel Events', title_tj: 'Чорабиниҳои паралелӣ', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'events-cultural', label: 'Культурные / Cultural', defaults: { title_ru: 'Культурные мероприятия', title_en: 'Cultural Events', title_tj: 'Чорабиниҳои фарҳангӣ', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
  ]},
  { category: 'Экскурсии (подстраницы)', pages: [
    { slug: 'excursions-dushanbe', label: 'Душанбе / Dushanbe', defaults: { title_ru: 'Душанбе', title_en: 'Dushanbe', title_tj: 'Душанбе', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'excursions-khisor', label: 'Хисор / Hisor', defaults: { title_ru: 'Хисор', title_en: 'Hisor', title_tj: 'Ҳисор', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'excursions-rogun', label: 'Рогун / Rogun', defaults: { title_ru: 'Рогун', title_en: 'Rogun', title_tj: 'Роғун', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
  ]},
  { category: 'Логистика (подстраницы)', pages: [
    { slug: 'logistics-practical', label: 'Практическая информация', defaults: { title_ru: 'Практическая информация', title_en: 'Practical Information', title_tj: 'Маълумоти амалӣ', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'logistics-visa', label: 'Виза / Visa', defaults: { title_ru: 'Виза в Таджикистан', title_en: 'Visa to Tajikistan', title_tj: 'Раводиди Тоҷикистон', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'logistics-press', label: 'Пресса / Press', defaults: { title_ru: 'Аккредитация прессы', title_en: 'Press Accreditation', title_tj: 'Аккредитатсияи матбуот', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'logistics-flights', label: 'Авиарейсы / Flights', defaults: { title_ru: 'Авиарейсы', title_en: 'Flights', title_tj: 'Парвозҳо', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'logistics-accommodation', label: 'Размещение / Accommodation', defaults: { title_ru: 'Размещение в гостинице', title_en: 'Hotel Accommodation', title_tj: 'Ҷойгиршавӣ дар меҳмонхона', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
    { slug: 'logistics-weather', label: 'Погода / Weather', defaults: { title_ru: 'Погода', title_en: 'Weather', title_tj: 'Обу ҳаво', subtitle_ru: '', subtitle_en: '', subtitle_tj: '' }},
  ]},
]

function getAllPageSlugs() {
  const slugs = []
  BANNER_PAGES.forEach(cat => cat.pages.forEach(p => slugs.push(p)))
  return slugs
}

export default function BannerManager() {
  const { token } = useAuth()
  const [banners, setBanners] = useState({})
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [openCategories, setOpenCategories] = useState({})
  const [uploadingFor, setUploadingFor] = useState(null)

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

      const loaded = {}
      getAllPageSlugs().forEach(page => {
        const key = `page_banner_${page.slug}`
        const saved = settings[key] ? JSON.parse(settings[key]) : null
        loaded[page.slug] = {
          showBanner: saved?.showBanner !== false,
          title_ru: saved?.title_ru || page.defaults.title_ru,
          title_en: saved?.title_en || page.defaults.title_en,
          title_tj: saved?.title_tj || page.defaults.title_tj,
          subtitle_ru: saved?.subtitle_ru || page.defaults.subtitle_ru,
          subtitle_en: saved?.subtitle_en || page.defaults.subtitle_en,
          subtitle_tj: saved?.subtitle_tj || page.defaults.subtitle_tj,
          backgroundImage: saved?.backgroundImage || '/assets/images/background_wave.jpg',
        }
      })
      setBanners(loaded)
    } catch (err) {
      console.error('Failed to load banner settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      const settingsArray = Object.entries(banners).map(([slug, data]) => ({
        key: `page_banner_${slug}`,
        value: JSON.stringify(data),
      }))

      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsArray }),
      })

      setSaveStatus({ type: 'success', message: 'Сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Ошибка: ' + err.message })
    }
  }

  const updateBanner = (slug, field, value) => {
    setBanners(prev => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }))
  }

  const handleImageUpload = async (e, slug) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFor(slug)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        updateBanner(slug, 'backgroundImage', data.url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingFor(null)
    }
  }

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        Загрузка настроек баннеров...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Баннеры страниц</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>Управление заголовками, подзаголовками и фоновыми изображениями</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus?.type === 'saving'}
          style={{
            padding: '10px 24px',
            background: saveStatus?.type === 'success' ? '#10b981' : saveStatus?.type === 'error' ? '#ef4444' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {saveStatus?.message || 'Сохранить все'}
        </button>
      </div>

      {BANNER_PAGES.map(category => (
        <div key={category.category} style={{ marginBottom: 12 }}>
          <button
            onClick={() => toggleCategory(category.category)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: openCategories[category.category] ? '8px 8px 0 0' : 8,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              color: '#1e3a5f',
            }}
          >
            <span>{category.category} ({category.pages.length})</span>
            <span style={{ transform: openCategories[category.category] ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}>▼</span>
          </button>

          {openCategories[category.category] && (
            <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
              {category.pages.map(page => {
                const b = banners[page.slug]
                if (!b) return null
                return (
                  <div key={page.slug} style={{ padding: 20, borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: 0 }}>{page.label}</h4>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={b.showBanner}
                          onChange={e => updateBanner(page.slug, 'showBanner', e.target.checked)}
                          style={{ width: 16, height: 16 }}
                        />
                        Показать баннер
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>Заголовок (RU)</label>
                        <input style={inputStyle} value={b.title_ru} onChange={e => updateBanner(page.slug, 'title_ru', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Заголовок (EN)</label>
                        <input style={inputStyle} value={b.title_en} onChange={e => updateBanner(page.slug, 'title_en', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Заголовок (TJ)</label>
                        <input style={inputStyle} value={b.title_tj} onChange={e => updateBanner(page.slug, 'title_tj', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>Подзаголовок (RU)</label>
                        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={b.subtitle_ru} onChange={e => updateBanner(page.slug, 'subtitle_ru', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Подзаголовок (EN)</label>
                        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={b.subtitle_en} onChange={e => updateBanner(page.slug, 'subtitle_en', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Подзаголовок (TJ)</label>
                        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={b.subtitle_tj} onChange={e => updateBanner(page.slug, 'subtitle_tj', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Фоновое изображение</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            style={{ ...inputStyle, flex: 1 }}
                            value={b.backgroundImage}
                            onChange={e => updateBanner(page.slug, 'backgroundImage', e.target.value)}
                            placeholder="/assets/images/background_wave.jpg"
                          />
                          <label style={{
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            fontSize: 13,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}>
                            {uploadingFor === page.slug ? '...' : 'Загрузить'}
                            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, page.slug)} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                      {b.backgroundImage && (
                        <div style={{ width: 80, height: 45, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          <img src={b.backgroundImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#64748b',
  marginBottom: 4,
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: 13,
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
}
