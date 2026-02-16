import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

// Default speakers data
const defaultSpeakersData = [
  {
    name_ru: 'Эмомали Рахмон',
    name_en: 'Emomali Rahmon',
    name_tj: 'Эмомалӣ Раҳмон',
    title_ru: 'Президент Республики Таджикистан',
    title_en: 'President of the Republic of Tajikistan',
    title_tj: 'Президенти Ҷумҳурии Тоҷикистон',
    image: '/assets/images/speaker-rahmon.jpg',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/tj.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг Таджикистана',
    flag_alt_en: 'Flag of Tajikistan',
    flag_alt_tj: 'Парчами Тоҷикистон',
    sort_order: 0
  },
  {
    name_ru: 'Кохир Расулзода',
    name_en: 'Kohir Rasulzoda',
    name_tj: 'Қоҳир Расулзода',
    title_ru: 'Премьер-Министр Республики Таджикистан',
    title_en: 'Prime Minister of the Republic of Tajikistan',
    title_tj: 'Сарвазири Ҷумҳурии Тоҷикистон',
    image: '/assets/images/speaker-rasulzoda.jpg',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/tj.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг Таджикистана',
    flag_alt_en: 'Flag of Tajikistan',
    flag_alt_tj: 'Парчами Тоҷикистон',
    sort_order: 1
  },
  {
    name_ru: 'Антониу Гутерриш',
    name_en: 'António Guterres',
    name_tj: 'Антониу Гутерриш',
    title_ru: 'Генеральный секретарь ООН',
    title_en: 'UN Secretary-General',
    title_tj: 'Котиби генералии СММ',
    image: '/assets/images/speaker-guterres.jpg',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/un.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг ООН',
    flag_alt_en: 'UN Flag',
    flag_alt_tj: 'Парчами СММ',
    sort_order: 2
  },
  {
    name_ru: 'Ли Цзюньхуа',
    name_en: 'Li Junhua',
    name_tj: 'Ли Ҷунхуа',
    title_ru: 'Заместитель Генерального секретаря ООН',
    title_en: 'United Nations Under-Secretary-General',
    title_tj: 'Муовини Котиби генералии СММ',
    image: '/assets/images/speaker-li.jpg',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/cn.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг Китая',
    flag_alt_en: 'Flag of China',
    flag_alt_tj: 'Парчами Чин',
    sort_order: 3
  }
]

export default function SpeakersManager() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [speakers, setSpeakers] = useState([])
  const [editingSpeaker, setEditingSpeaker] = useState(null)
  const [speakerForm, setSpeakerForm] = useState({
    name_ru: '', name_en: '', name_tj: '',
    title_ru: '', title_en: '', title_tj: '',
    image: '/assets/images/speaker-default.png',
    image_source: 'url',
    image_position: 'center center',
    flag_url: '', flag_source: 'url', flag_alt_ru: '', flag_alt_en: '', flag_alt_tj: '',
    sort_order: 0
  })
  const [uploadingSpeakerImage, setUploadingSpeakerImage] = useState(false)
  const [uploadingFlag, setUploadingFlag] = useState(false)
  const [isDraggingPosition, setIsDraggingPosition] = useState(false)
  const imagePositionRef = useRef(null)

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
    loadSpeakers()
  }, [])

  const seedDefaultSpeakers = async () => {
    console.log('Seeding default speakers...')
    for (const speaker of defaultSpeakersData) {
      try {
        await apiRequest('/api/admin/speakers', {
          method: 'POST',
          body: JSON.stringify(speaker)
        })
      } catch (err) {
        console.error('Failed to seed speaker:', speaker.name_en, err)
      }
    }
  }

  const loadSpeakers = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/api/admin/speakers')
      if (data.length === 0) {
        await seedDefaultSpeakers()
        const newData = await apiRequest('/api/admin/speakers')
        setSpeakers(newData)
      } else {
        setSpeakers(data)
      }
    } catch (err) {
      console.error('Failed to load speakers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSpeaker = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      // Build payload with only the fields the backend expects
      // Merge preview fields from form with detailed fields from editingSpeaker
      const s = editingSpeaker
      const f = speakerForm
      const payload = {
        name_ru: f.name_ru,
        name_en: f.name_en,
        name_tj: f.name_tj,
        title_ru: f.title_ru,
        title_en: f.title_en,
        title_tj: f.title_tj,
        bio_ru: s.bio_ru || null,
        bio_en: s.bio_en || null,
        bio_tj: s.bio_tj || null,
        organization_ru: s.organization_ru || null,
        organization_en: s.organization_en || null,
        organization_tj: s.organization_tj || null,
        country_ru: s.country_ru || null,
        country_en: s.country_en || null,
        country_tj: s.country_tj || null,
        email: s.email || null,
        expertise: s.expertise || null,
        achievements: s.achievements || null,
        publications: s.publications || null,
        session_title_ru: s.session_title_ru || null,
        session_title_en: s.session_title_en || null,
        session_title_tj: s.session_title_tj || null,
        session_time_ru: s.session_time_ru || null,
        session_time_en: s.session_time_en || null,
        session_time_tj: s.session_time_tj || null,
        session_description_ru: s.session_description_ru || null,
        session_description_en: s.session_description_en || null,
        session_description_tj: s.session_description_tj || null,
        image: f.image,
        image_source: f.image_source,
        image_position: f.image_position,
        flag_url: f.flag_url || null,
        flag_alt_ru: f.flag_alt_ru || null,
        flag_alt_en: f.flag_alt_en || null,
        flag_alt_tj: f.flag_alt_tj || null,
        sort_order: f.sort_order,
        clickable: s.clickable != null ? Number(s.clickable) : 1,
      }

      if (editingSpeaker && editingSpeaker.id) {
        await apiRequest(`/api/admin/speakers/${editingSpeaker.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      } else {
        await apiRequest('/api/admin/speakers', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }
      setSaveStatus({ type: 'success', message: 'Спикер успешно сохранён!' })
      setEditingSpeaker(null)
      resetSpeakerForm()
      loadSpeakers()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save speaker:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleDeleteSpeaker = async (id) => {
    if (!window.confirm('Удалить этого спикера?')) return
    try {
      await apiRequest(`/api/admin/speakers/${id}`, { method: 'DELETE' })
      setSaveStatus({ type: 'success', message: 'Спикер удалён!' })
      loadSpeakers()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to delete speaker:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка удаления: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetSpeakerForm = () => {
    setSpeakerForm({
      name_ru: '', name_en: '', name_tj: '',
      title_ru: '', title_en: '', title_tj: '',
      image: '/assets/images/speaker-default.png',
      image_source: 'url',
      image_position: 'center center',
      flag_url: '', flag_source: 'url', flag_alt_ru: '', flag_alt_en: '', flag_alt_tj: '',
      sort_order: speakers.length
    })
  }

  const handleSpeakerImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }
    e.target.value = ''
    setUploadingSpeakerImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Ошибка загрузки')
      const data = await response.json()
      setSpeakerForm(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      console.error('Failed to upload image:', err)
      alert('Не удалось загрузить изображение')
    } finally {
      setUploadingSpeakerImage(false)
    }
  }

  const handleFlagUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }
    e.target.value = ''
    setUploadingFlag(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Ошибка загрузки')
      const data = await response.json()
      setSpeakerForm(prev => ({ ...prev, flag_url: data.url }))
    } catch (err) {
      console.error('Failed to upload flag:', err)
      alert('Не удалось загрузить флаг')
    } finally {
      setUploadingFlag(false)
    }
  }

  const parsePosition = (posString) => {
    const parts = posString.split(' ')
    const map = { left: 0, center: 50, right: 100, top: 0, bottom: 100 }
    const x = map[parts[0]] !== undefined ? map[parts[0]] : parseFloat(parts[0])
    const y = map[parts[1]] !== undefined ? map[parts[1]] : parseFloat(parts[1])
    return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y }
  }

  const handlePositionDrag = useCallback((e) => {
    if (!imagePositionRef.current) return
    const rect = imagePositionRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    let x = ((clientX - rect.left) / rect.width) * 100
    let y = ((clientY - rect.top) / rect.height) * 100
    x = Math.max(0, Math.min(100, x))
    y = Math.max(0, Math.min(100, y))
    setSpeakerForm(prev => ({ ...prev, image_position: `${x.toFixed(0)}% ${y.toFixed(0)}%` }))
  }, [])

  const handlePositionDragStart = useCallback((e) => {
    e.preventDefault()
    setIsDraggingPosition(true)
    handlePositionDrag(e)
  }, [handlePositionDrag])

  const handlePositionDragEnd = useCallback(() => {
    setIsDraggingPosition(false)
  }, [])

  useEffect(() => {
    if (isDraggingPosition) {
      const handleMove = (e) => handlePositionDrag(e)
      const handleEnd = () => handlePositionDragEnd()
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDraggingPosition, handlePositionDrag, handlePositionDragEnd])

  const currentPos = parsePosition(speakerForm.image_position)

  const openEditModal = (speaker) => {
    setEditingSpeaker(speaker)
    setSpeakerForm({
      name_ru: speaker.name_ru || '',
      name_en: speaker.name_en || '',
      name_tj: speaker.name_tj || '',
      title_ru: speaker.title_ru || '',
      title_en: speaker.title_en || '',
      title_tj: speaker.title_tj || '',
      image: speaker.image || '/assets/images/speaker-default.png',
      image_source: speaker.image_source || 'url',
      image_position: speaker.image_position || 'center center',
      flag_url: speaker.flag_url || '',
      flag_source: speaker.flag_source || 'url',
      flag_alt_ru: speaker.flag_alt_ru || '',
      flag_alt_en: speaker.flag_alt_en || '',
      flag_alt_tj: speaker.flag_alt_tj || '',
      sort_order: speaker.sort_order || 0
    })
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Спикеры</h2>
          <p>Управление списком спикеров конференции</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingSpeaker({}); resetSpeakerForm() }}>
          + Добавить спикера
        </button>
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

      {/* Preview-only modal (name, title, image, flag, sort order, clickable) */}
      {editingSpeaker && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingSpeaker(null)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSpeaker.id ? 'Редактировать спикера' : 'Новый спикер'}</h3>
              <button className="btn-close" onClick={() => setEditingSpeaker(null)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-section">
                <h4>Имя спикера</h4>
                <div className="lang-inputs-grid">
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" />
                      Русский
                    </label>
                    <input type="text" value={speakerForm.name_ru} onChange={(e) => setSpeakerForm({...speakerForm, name_ru: e.target.value})} placeholder="Имя Фамилия" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" />
                      English
                    </label>
                    <input type="text" value={speakerForm.name_en} onChange={(e) => setSpeakerForm({...speakerForm, name_en: e.target.value})} placeholder="Full Name" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" />
                      Тоҷикӣ
                    </label>
                    <input type="text" value={speakerForm.name_tj} onChange={(e) => setSpeakerForm({...speakerForm, name_tj: e.target.value})} placeholder="Ном Насаб" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Должность</h4>
                <div className="lang-inputs-grid">
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" />
                      Русский
                    </label>
                    <input type="text" value={speakerForm.title_ru} onChange={(e) => setSpeakerForm({...speakerForm, title_ru: e.target.value})} placeholder="Должность" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" />
                      English
                    </label>
                    <input type="text" value={speakerForm.title_en} onChange={(e) => setSpeakerForm({...speakerForm, title_en: e.target.value})} placeholder="Position" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" />
                      Тоҷикӣ
                    </label>
                    <input type="text" value={speakerForm.title_tj} onChange={(e) => setSpeakerForm({...speakerForm, title_tj: e.target.value})} placeholder="Вазифа" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Фото спикера</h4>
                <div className="image-upload-section">
                  <div className="image-preview-side">
                    <div className="image-position-container" ref={imagePositionRef} onMouseDown={handlePositionDragStart} onTouchStart={handlePositionDragStart}>
                      <img src={speakerForm.image} alt="Preview" style={{ objectPosition: speakerForm.image_position }} />
                      <div className="position-marker" style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}>
                        <div className="position-marker-dot" />
                      </div>
                      <div className="position-crosshair-h" style={{ top: `${currentPos.y}%` }} />
                      <div className="position-crosshair-v" style={{ left: `${currentPos.x}%` }} />
                    </div>
                    <span className="image-hint">Перетащите для позиционирования</span>
                  </div>
                  <div className="image-input-side">
                    <div className="source-toggle">
                      <button
                        type="button"
                        className={`source-toggle-btn ${speakerForm.image_source === 'url' ? 'active' : ''}`}
                        onClick={() => setSpeakerForm({...speakerForm, image_source: 'url'})}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                        URL ссылка
                      </button>
                      <button
                        type="button"
                        className={`source-toggle-btn ${speakerForm.image_source === 'upload' ? 'active' : ''}`}
                        onClick={() => setSpeakerForm({...speakerForm, image_source: 'upload'})}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                        </svg>
                        Загрузить
                      </button>
                    </div>

                    {speakerForm.image_source === 'url' ? (
                      <div className="form-group">
                        <input type="text" value={speakerForm.image} onChange={(e) => setSpeakerForm({...speakerForm, image: e.target.value})} placeholder="https://example.com/image.jpg" />
                      </div>
                    ) : (
                      <div className="upload-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSpeakerImageUpload}
                          disabled={uploadingSpeakerImage}
                          id="speaker-image-upload"
                        />
                        <label htmlFor="speaker-image-upload" className={uploadingSpeakerImage ? 'uploading' : ''}>
                          {uploadingSpeakerImage ? (
                            <>
                              <svg className="spinner" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                              </svg>
                              <span>Загрузка...</span>
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                              </svg>
                              <span>Выберите файл или перетащите сюда</span>
                              <small>PNG, JPG до 5MB</small>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Флаг страны спикера</h4>
                <div className="flag-upload-section">
                  <div className="flag-preview-side">
                    {speakerForm.flag_url ? (
                      <div className="flag-preview-large">
                        <img src={speakerForm.flag_url} alt="Flag preview" />
                      </div>
                    ) : (
                      <div className="flag-preview-placeholder">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="#9ca3af">
                          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flag-input-side">
                    <div className="source-toggle">
                      <button
                        type="button"
                        className={`source-toggle-btn ${speakerForm.flag_source === 'url' ? 'active' : ''}`}
                        onClick={() => setSpeakerForm({...speakerForm, flag_source: 'url'})}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                        URL ссылка
                      </button>
                      <button
                        type="button"
                        className={`source-toggle-btn ${speakerForm.flag_source === 'upload' ? 'active' : ''}`}
                        onClick={() => setSpeakerForm({...speakerForm, flag_source: 'upload'})}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                        </svg>
                        Загрузить
                      </button>
                    </div>

                    {speakerForm.flag_source === 'url' ? (
                      <div className="form-group">
                        <input type="text" value={speakerForm.flag_url} onChange={(e) => setSpeakerForm({...speakerForm, flag_url: e.target.value})} placeholder="https://flagcdn.com/w80/tj.png" />
                      </div>
                    ) : (
                      <div className="upload-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFlagUpload}
                          disabled={uploadingFlag}
                          id="flag-upload"
                        />
                        <label htmlFor="flag-upload" className={uploadingFlag ? 'uploading' : ''}>
                          {uploadingFlag ? (
                            <>
                              <svg className="spinner" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                              </svg>
                              <span>Загрузка...</span>
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                              </svg>
                              <span>Выберите файл флага</span>
                              <small>PNG, JPG, SVG</small>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lang-inputs-grid" style={{marginTop: '16px'}}>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" />
                      Alt текст
                    </label>
                    <input type="text" value={speakerForm.flag_alt_ru} onChange={(e) => setSpeakerForm({...speakerForm, flag_alt_ru: e.target.value})} placeholder="Таджикистан" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" />
                      Alt text
                    </label>
                    <input type="text" value={speakerForm.flag_alt_en} onChange={(e) => setSpeakerForm({...speakerForm, flag_alt_en: e.target.value})} placeholder="Tajikistan" />
                  </div>
                  <div className="form-group">
                    <label>
                      <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" />
                      Alt матн
                    </label>
                    <input type="text" value={speakerForm.flag_alt_tj} onChange={(e) => setSpeakerForm({...speakerForm, flag_alt_tj: e.target.value})} placeholder="Тоҷикистон" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Порядок сортировки</label>
                  <input type="number" value={speakerForm.sort_order} onChange={(e) => setSpeakerForm({...speakerForm, sort_order: parseInt(e.target.value) || 0})} style={{maxWidth: '120px'}} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingSpeaker(null)}>Отмена</button>
              <button className="btn-primary" onClick={handleSaveSpeaker}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Загрузка...</div>
      ) : (
        <div className="speakers-list">
          {speakers.map(speaker => (
            <div key={speaker.id} className="speaker-card-horizontal">
              <div className="speaker-card-image">
                <img src={speaker.image} alt={speaker.name_ru} style={{ objectPosition: speaker.image_position || 'center center' }} />
                {speaker.flag_url && (
                  <div className="speaker-card-flag">
                    <img src={speaker.flag_url} alt={speaker.flag_alt_ru || ''} />
                  </div>
                )}
              </div>
              <div className="speaker-card-content">
                <p className="speaker-card-title">{speaker.title_ru || speaker.title_en}</p>
                <p className="speaker-card-name">{speaker.name_ru || speaker.name_en}</p>
                {!speaker.clickable && (
                  <span style={{fontSize: '11px', color: '#999', marginTop: '2px', display: 'inline-block'}}>Страница отключена</span>
                )}
              </div>
              <div className="speaker-card-actions">
                <button className="btn-icon" title="Карточка (превью)" onClick={() => openEditModal(speaker)}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button className="btn-icon" title="Подробная информация" onClick={() => navigate(`/admin/home/speakers/${speaker.id}`)}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </button>
                <button className="btn-icon btn-icon-danger" title="Удалить" onClick={() => handleDeleteSpeaker(speaker.id)}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
