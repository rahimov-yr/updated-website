import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'https://flagcdn.com/w20/tj.png' },
]

const DEFAULT_PROGRAM_DATA = {
  ru: {
    date_range: '25-28 мая 2026',
    title: 'Программа конференции',
    subtitle: 'Четыре дня насыщенной программы с пленарными заседаниями, тематическими сессиями и культурными мероприятиями',
    stats: {
      days: '4',
      days_label: 'дня',
      sessions: '20+',
      sessions_label: 'сессий',
      speakers: '150+',
      speakers_label: 'спикеров',
    },
    download_btn: 'Скачать PDF',
    days: [
      {
        date: '25 мая 2026',
        label: 'День 1',
        title: 'Церемония открытия',
        events_count: '6 событий',
        events: [
          { time: '08:30 – 10:00', title: 'Регистрация участников', description: 'Выдача бейджей и материалов конференции', location: 'Фойе главного зала' },
          { time: '10:00 – 11:30', title: 'Торжественное открытие', description: 'Приветственные речи глав делегаций', location: 'Главный зал' },
          { time: '11:30 – 12:00', title: 'Кофе-брейк', description: '', location: 'Фойе' },
          { time: '12:00 – 13:30', title: 'Пленарное заседание высокого уровня', description: 'Доклады министров и представителей международных организаций', location: 'Главный зал' },
          { time: '13:30 – 15:00', title: 'Обед', description: '', location: 'Банкетный зал' },
          { time: '15:00 – 18:00', title: 'Пленарное заседание (продолжение)', description: 'Выступления делегаций стран-участниц', location: 'Главный зал' },
        ]
      },
      {
        date: '26 мая 2026',
        label: 'День 2',
        title: 'Тематические сессии',
        events_count: '5 событий',
        events: [
          { time: '09:00 – 10:30', title: 'Тематическая сессия 1', description: 'Водные ресурсы и изменение климата', location: 'Зал A' },
          { time: '10:30 – 11:00', title: 'Кофе-брейк', description: '', location: 'Фойе' },
          { time: '11:00 – 13:00', title: 'Параллельные сессии', description: 'Тематические круглые столы', location: 'Залы A, B, C' },
          { time: '13:00 – 14:30', title: 'Обед', description: '', location: 'Банкетный зал' },
          { time: '14:30 – 18:00', title: 'Технические сессии', description: 'Презентации и дискуссии', location: 'Конференц-залы' },
        ]
      },
      {
        date: '27 мая 2026',
        label: 'День 3',
        title: 'Международное сотрудничество',
        events_count: '5 событий',
        events: [
          { time: '09:00 – 12:00', title: 'Пленарное заседание', description: 'Международное сотрудничество в сфере водных ресурсов', location: 'Главный зал' },
          { time: '12:00 – 12:30', title: 'Кофе-брейк', description: '', location: 'Фойе' },
          { time: '12:30 – 14:00', title: 'Обед', description: '', location: 'Банкетный зал' },
          { time: '14:00 – 17:00', title: 'Рабочие группы', description: 'Разработка рекомендаций', location: 'Конференц-залы' },
          { time: '19:00 – 22:00', title: 'Официальный приём', description: 'Культурная программа', location: 'Национальный музей' },
        ]
      },
      {
        date: '28 мая 2026',
        label: 'День 4',
        title: 'Закрытие конференции',
        events_count: '4 события',
        events: [
          { time: '09:00 – 11:00', title: 'Заключительное пленарное заседание', description: 'Обсуждение итоговых документов', location: 'Главный зал' },
          { time: '11:00 – 11:30', title: 'Кофе-брейк', description: '', location: 'Фойе' },
          { time: '11:30 – 13:00', title: 'Церемония закрытия', description: 'Принятие декларации конференции', location: 'Главный зал' },
          { time: '13:00 – 14:30', title: 'Прощальный обед', description: '', location: 'Банкетный зал' },
        ]
      },
    ]
  },
  en: {
    date_range: 'May 25-28, 2026',
    title: 'Conference Program',
    subtitle: 'Four days of intensive program with plenary sessions, thematic sessions and cultural events',
    stats: {
      days: '4',
      days_label: 'days',
      sessions: '20+',
      sessions_label: 'sessions',
      speakers: '150+',
      speakers_label: 'speakers',
    },
    download_btn: 'Download PDF',
    days: [
      {
        date: 'May 25, 2026',
        label: 'Day 1',
        title: 'Opening Ceremony',
        events_count: '6 events',
        events: [
          { time: '08:30 – 10:00', title: 'Participant Registration', description: 'Badge and conference materials distribution', location: 'Main Hall Foyer' },
          { time: '10:00 – 11:30', title: 'Grand Opening', description: 'Welcome speeches by delegation heads', location: 'Main Hall' },
          { time: '11:30 – 12:00', title: 'Coffee Break', description: '', location: 'Foyer' },
          { time: '12:00 – 13:30', title: 'High-Level Plenary Session', description: 'Reports by ministers and international organization representatives', location: 'Main Hall' },
          { time: '13:30 – 15:00', title: 'Lunch', description: '', location: 'Banquet Hall' },
          { time: '15:00 – 18:00', title: 'Plenary Session (continued)', description: 'Presentations by participating country delegations', location: 'Main Hall' },
        ]
      },
      {
        date: 'May 26, 2026',
        label: 'Day 2',
        title: 'Thematic Sessions',
        events_count: '5 events',
        events: []
      },
      {
        date: 'May 27, 2026',
        label: 'Day 3',
        title: 'International Cooperation',
        events_count: '5 events',
        events: []
      },
      {
        date: 'May 28, 2026',
        label: 'Day 4',
        title: 'Closing Ceremony',
        events_count: '4 events',
        events: []
      },
    ]
  },
  tj: {
    date_range: '25-28 майи 2026',
    title: 'Барномаи конфронс',
    subtitle: 'Чор рӯзи барномаи пурмазмун бо ҷаласаҳои пленарӣ, сессияҳои мавзӯӣ ва чорабиниҳои фарҳангӣ',
    stats: {
      days: '4',
      days_label: 'рӯз',
      sessions: '20+',
      sessions_label: 'сессия',
      speakers: '150+',
      speakers_label: 'маърузачӣ',
    },
    download_btn: 'Боргирии PDF',
    days: [
      {
        date: '25 майи 2026',
        label: 'Рӯзи 1',
        title: 'Маросими кушоиш',
        events_count: '6 чорабинӣ',
        events: []
      },
      {
        date: '26 майи 2026',
        label: 'Рӯзи 2',
        title: 'Сессияҳои мавзӯӣ',
        events_count: '5 чорабинӣ',
        events: []
      },
      {
        date: '27 майи 2026',
        label: 'Рӯзи 3',
        title: 'Ҳамкории байналмилалӣ',
        events_count: '5 чорабинӣ',
        events: []
      },
      {
        date: '28 майи 2026',
        label: 'Рӯзи 4',
        title: 'Хотимаи конфронс',
        events_count: '4 чорабинӣ',
        events: []
      },
    ]
  }
}

export default function ProgramManager() {
  const { token } = useAuth()
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('ru')
  const [activeDay, setActiveDay] = useState(0)
  const [programData, setProgramData] = useState(DEFAULT_PROGRAM_DATA)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({ time: '', title: '', description: '', location: '' })
  const [pdfFiles, setPdfFiles] = useState({ ru: '', en: '', tj: '' })
  const [uploadingPdf, setUploadingPdf] = useState({ ru: false, en: false, tj: false })

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

      if (settings.program_data) {
        try {
          const saved = JSON.parse(settings.program_data)
          setProgramData(prev => ({ ...prev, ...saved }))
        } catch (e) {
          console.error('Failed to parse program data:', e)
        }
      }

      // Load PDF file URLs
      setPdfFiles({
        ru: settings.program_pdf_ru || '',
        en: settings.program_pdf_en || '',
        tj: settings.program_pdf_tj || '',
      })
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: [
            { key: 'program_data', value: JSON.stringify(programData) },
            { key: 'program_pdf_ru', value: pdfFiles.ru },
            { key: 'program_pdf_en', value: pdfFiles.en },
            { key: 'program_pdf_tj', value: pdfFiles.tj },
          ]
        })
      })
      setSaveStatus({ type: 'success', message: 'Программа сохранена!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const updateField = (field, value) => {
    setProgramData(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }))
  }

  const updateStats = (field, value) => {
    setProgramData(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        stats: {
          ...prev[activeLang].stats,
          [field]: value
        }
      }
    }))
  }

  const updateDay = (dayIndex, field, value) => {
    setProgramData(prev => {
      const newDays = [...prev[activeLang].days]
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value }
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          days: newDays
        }
      }
    })
  }

  const updateEvent = (dayIndex, eventIndex, field, value) => {
    setProgramData(prev => {
      const newDays = [...prev[activeLang].days]
      const newEvents = [...newDays[dayIndex].events]
      newEvents[eventIndex] = { ...newEvents[eventIndex], [field]: value }
      newDays[dayIndex] = { ...newDays[dayIndex], events: newEvents }
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          days: newDays
        }
      }
    })
  }

  const addEvent = (dayIndex) => {
    setProgramData(prev => {
      const newDays = [...prev[activeLang].days]
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        events: [...newDays[dayIndex].events, { time: '', title: '', description: '', location: '' }]
      }
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          days: newDays
        }
      }
    })
  }

  const deleteEvent = (dayIndex, eventIndex) => {
    if (!window.confirm('Удалить это событие?')) return
    setProgramData(prev => {
      const newDays = [...prev[activeLang].days]
      const newEvents = newDays[dayIndex].events.filter((_, i) => i !== eventIndex)
      newDays[dayIndex] = { ...newDays[dayIndex], events: newEvents }
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          days: newDays
        }
      }
    })
  }

  const handlePdfUpload = async (langCode, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setSaveStatus({ type: 'error', message: 'Пожалуйста, выберите PDF файл' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    // Validate file size (max 20MB for PDF)
    if (file.size > 20 * 1024 * 1024) {
      setSaveStatus({ type: 'error', message: 'Файл слишком большой (макс. 20MB)' })
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setUploadingPdf(prev => ({ ...prev, [langCode]: true }))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'program')

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
      setPdfFiles(prev => ({ ...prev, [langCode]: data.url }))
      setSaveStatus({ type: 'success', message: `PDF (${langCode.toUpperCase()}) загружен!` })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to upload PDF:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка загрузки: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    } finally {
      setUploadingPdf(prev => ({ ...prev, [langCode]: false }))
      e.target.value = ''
    }
  }

  const removePdf = (langCode) => {
    setPdfFiles(prev => ({ ...prev, [langCode]: '' }))
  }

  const currentLangData = programData[activeLang]
  const currentDay = currentLangData?.days?.[activeDay]

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Программа конференции</h2>
          <p>Управление расписанием и событиями конференции</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>Сохранить изменения</button>
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

      {/* Header Section */}
      <div className="form-section">
        <h3 className="form-section-title">Заголовок секции ({LANGUAGES.find(l => l.code === activeLang)?.label})</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Даты конференции</label>
            <input
              type="text"
              value={currentLangData?.date_range || ''}
              onChange={(e) => updateField('date_range', e.target.value)}
              placeholder="25-28 мая 2026"
            />
          </div>
          <div className="form-group">
            <label>Заголовок</label>
            <input
              type="text"
              value={currentLangData?.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Программа конференции"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Подзаголовок</label>
          <textarea
            value={currentLangData?.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Описание программы конференции"
            rows={2}
          />
        </div>
        <div className="form-group">
          <label>Текст кнопки скачивания</label>
          <input
            type="text"
            value={currentLangData?.download_btn || ''}
            onChange={(e) => updateField('download_btn', e.target.value)}
            placeholder="Скачать PDF"
          />
        </div>
      </div>

      {/* PDF Files Section */}
      <div className="form-section">
        <h3 className="form-section-title">PDF файлы программы</h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
          Загрузите PDF файлы программы для каждого языка. Эти файлы будут доступны для скачивания.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {LANGUAGES.map(lang => (
            <div key={lang.code} className="admin-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img src={lang.flag} alt={lang.label} style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }} />
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{lang.label}</span>
              </div>

              {pdfFiles[lang.code] ? (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="#22c55e" style={{ marginBottom: '8px' }}>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <p style={{ fontSize: '12px', color: '#15803d', marginBottom: '12px', wordBreak: 'break-all' }}>
                    {pdfFiles[lang.code].split('/').pop()}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <a
                      href={pdfFiles[lang.code]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: '#2d5a87',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                      Открыть
                    </a>
                    <button
                      onClick={() => removePdf(lang.code)}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: uploadingPdf[lang.code] ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                    background: '#f8fafc',
                  }}
                  onClick={() => !uploadingPdf[lang.code] && document.getElementById(`pdf-upload-${lang.code}`).click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.borderColor = '#2d5a87'
                    e.currentTarget.style.background = '#eff6ff'
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.background = '#f8fafc'
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.background = '#f8fafc'
                    const file = e.dataTransfer.files[0]
                    if (file) {
                      const input = document.getElementById(`pdf-upload-${lang.code}`)
                      const dataTransfer = new DataTransfer()
                      dataTransfer.items.add(file)
                      input.files = dataTransfer.files
                      handlePdfUpload(lang.code, { target: input })
                    }
                  }}
                >
                  <input
                    id={`pdf-upload-${lang.code}`}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => handlePdfUpload(lang.code, e)}
                    style={{ display: 'none' }}
                  />

                  {uploadingPdf[lang.code] ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <svg className="save-status-spinner" viewBox="0 0 24 24" width="24" height="24" style={{ color: '#2d5a87' }}>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                      </svg>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>Загрузка...</span>
                    </div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="#94a3b8" style={{ marginBottom: '8px' }}>
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z"/>
                      </svg>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                        Нажмите или перетащите PDF
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0' }}>
                        Макс. 20MB
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="form-section">
        <h3 className="form-section-title">Статистика программы</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <input
                type="text"
                value={currentLangData?.stats?.days || ''}
                onChange={(e) => updateStats('days', e.target.value)}
                placeholder="4"
                style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', color: '#2d5a87', border: 'none', background: 'transparent', width: '100%' }}
              />
            </div>
            <input
              type="text"
              value={currentLangData?.stats?.days_label || ''}
              onChange={(e) => updateStats('days_label', e.target.value)}
              placeholder="дня"
              style={{ textAlign: 'center', border: 'none', background: '#f9fafb', borderRadius: '6px', padding: '6px', fontSize: '14px', width: '100%' }}
            />
          </div>
          <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <input
                type="text"
                value={currentLangData?.stats?.sessions || ''}
                onChange={(e) => updateStats('sessions', e.target.value)}
                placeholder="20+"
                style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', color: '#2d5a87', border: 'none', background: 'transparent', width: '100%' }}
              />
            </div>
            <input
              type="text"
              value={currentLangData?.stats?.sessions_label || ''}
              onChange={(e) => updateStats('sessions_label', e.target.value)}
              placeholder="сессий"
              style={{ textAlign: 'center', border: 'none', background: '#f9fafb', borderRadius: '6px', padding: '6px', fontSize: '14px', width: '100%' }}
            />
          </div>
          <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <input
                type="text"
                value={currentLangData?.stats?.speakers || ''}
                onChange={(e) => updateStats('speakers', e.target.value)}
                placeholder="150+"
                style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', color: '#2d5a87', border: 'none', background: 'transparent', width: '100%' }}
              />
            </div>
            <input
              type="text"
              value={currentLangData?.stats?.speakers_label || ''}
              onChange={(e) => updateStats('speakers_label', e.target.value)}
              placeholder="спикеров"
              style={{ textAlign: 'center', border: 'none', background: '#f9fafb', borderRadius: '6px', padding: '6px', fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="form-section">
        <h3 className="form-section-title">Расписание по дням</h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {currentLangData?.days?.map((day, index) => (
            <button
              key={index}
              className={`lang-tab-btn ${activeDay === index ? 'active' : ''}`}
              onClick={() => setActiveDay(index)}
              style={{ minWidth: '140px' }}
            >
              <span style={{ fontWeight: '600' }}>{day.label}</span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>{day.date}</span>
            </button>
          ))}
        </div>

        {currentDay && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Название дня</label>
                    <input
                      type="text"
                      value={currentDay.label || ''}
                      onChange={(e) => updateDay(activeDay, 'label', e.target.value)}
                      placeholder="День 1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Дата</label>
                    <input
                      type="text"
                      value={currentDay.date || ''}
                      onChange={(e) => updateDay(activeDay, 'date', e.target.value)}
                      placeholder="25 мая 2026"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Тема дня</label>
                    <input
                      type="text"
                      value={currentDay.title || ''}
                      onChange={(e) => updateDay(activeDay, 'title', e.target.value)}
                      placeholder="Церемония открытия"
                    />
                  </div>
                  <div className="form-group">
                    <label>Количество событий</label>
                    <input
                      type="text"
                      value={currentDay.events_count || ''}
                      onChange={(e) => updateDay(activeDay, 'events_count', e.target.value)}
                      placeholder="6 событий"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#374151' }}>
                  События ({currentDay.events?.length || 0})
                </h4>
                <button className="btn-add" onClick={() => addEvent(activeDay)}>
                  + Добавить событие
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentDay.events?.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      fontWeight: '600',
                      color: '#2d5a87',
                      fontSize: '14px'
                    }}>
                      <input
                        type="text"
                        value={event.time || ''}
                        onChange={(e) => updateEvent(activeDay, eventIndex, 'time', e.target.value)}
                        placeholder="08:30 – 10:00"
                        style={{
                          width: '100%',
                          fontWeight: '600',
                          color: '#2d5a87',
                          border: 'none',
                          background: 'white',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={event.title || ''}
                        onChange={(e) => updateEvent(activeDay, eventIndex, 'title', e.target.value)}
                        placeholder="Название события"
                        style={{
                          width: '100%',
                          fontWeight: '600',
                          marginBottom: '6px',
                          border: 'none',
                          background: 'white',
                          padding: '6px 8px',
                          borderRadius: '6px'
                        }}
                      />
                      <input
                        type="text"
                        value={event.description || ''}
                        onChange={(e) => updateEvent(activeDay, eventIndex, 'description', e.target.value)}
                        placeholder="Описание события"
                        style={{
                          width: '100%',
                          color: '#6b7280',
                          marginBottom: '6px',
                          border: 'none',
                          background: 'white',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="#9ca3af">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <input
                          type="text"
                          value={event.location || ''}
                          onChange={(e) => updateEvent(activeDay, eventIndex, 'location', e.target.value)}
                          placeholder="Место проведения"
                          style={{
                            flex: 1,
                            color: '#9ca3af',
                            border: 'none',
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(activeDay, eventIndex)}
                      style={{
                        background: '#fee2e2',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Удалить событие"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                ))}

                {(!currentDay.events || currentDay.events.length === 0) && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#9ca3af',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    border: '2px dashed #e5e7eb'
                  }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style={{ marginBottom: '12px', opacity: 0.5 }}>
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                    <p style={{ margin: '0 0 12px 0' }}>Нет событий для этого дня</p>
                    <button className="btn-add" onClick={() => addEvent(activeDay)}>
                      + Добавить первое событие
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
