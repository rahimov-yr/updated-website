import { useState, useEffect, useRef } from 'react'
import { useSettings, useUpload } from '../hooks/useApi'
import './ExcursionsManager.css'

export default function ExcursionsManager({ embedded = false }) {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [editingExcursion, setEditingExcursion] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('ru')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')

  const { list: loadSettings, update: saveSettingsApi } = useSettings()
  const { upload, uploading } = useUpload()
  const fileInputRef = useRef(null)

  // Excursions data
  const [excursions, setExcursions] = useState([])

  // Page settings
  const [pageSettings, setPageSettings] = useState({
    title_ru: 'Культурная программа',
    title_en: 'Cultural Program',
    title_tj: 'Барномаи фарҳангӣ',
    subtitle_ru: 'Откройте для себя красоту Таджикистана',
    subtitle_en: 'Discover the beauty of Tajikistan',
    subtitle_tj: 'Зебоии Тоҷикистонро кашф кунед',
    sectionTitle_ru: 'Все экскурсии',
    sectionTitle_en: 'All Excursions',
    sectionTitle_tj: 'Ҳамаи экскурсияҳо',
    sectionSubtitle_ru: 'Выберите интересующую вас экскурсию',
    sectionSubtitle_en: 'Choose an excursion that interests you',
    sectionSubtitle_tj: 'Экскурсияи барои шумо ҷолибро интихоб кунед',
  })

  // Default excursions
  const defaultExcursions = [
    {
      id: 1,
      image: 'https://khovar.tj/rus/wp-content/uploads/2024/06/Dushanbe-Ismoili-Somoni-3.jpg',
      duration_ru: '4 часа',
      duration_en: '4 hours',
      duration_tj: '4 соат',
      category_ru: 'Городская экскурсия',
      category_en: 'City Tour',
      category_tj: 'Сайри шаҳрӣ',
      title_ru: 'Обзорная экскурсия по Душанбе',
      title_en: 'Dushanbe City Tour',
      title_tj: 'Сайри шаҳри Душанбе',
      description_ru: 'Познакомьтесь с достопримечательностями столицы Таджикистана',
      description_en: 'Explore the landmarks of Tajikistan\'s capital',
      description_tj: 'Бо ҷойҳои дидании пойтахти Тоҷикистон шинос шавед',
      highlights_ru: ['Национальный музей', 'Площадь Дусти', 'Чорбаг'],
      highlights_en: ['National Museum', 'Dosti Square', 'Chorbag'],
      highlights_tj: ['Осорхонаи миллӣ', 'Майдони Дӯстӣ', 'Чорбоғ'],
    },
    {
      id: 2,
      image: 'https://www.tajagroun.tj/images/posts/2020/norak.jpg',
      duration_ru: '6 часов',
      duration_en: '6 hours',
      duration_tj: '6 соат',
      category_ru: 'Техническая экскурсия',
      category_en: 'Technical Tour',
      category_tj: 'Сайри техникӣ',
      title_ru: 'Нурекская ГЭС',
      title_en: 'Nurek Dam',
      title_tj: 'НБО-и Нурек',
      description_ru: 'Посетите одну из самых высоких плотин в мире',
      description_en: 'Visit one of the world\'s tallest dams',
      description_tj: 'Яке аз баландтарин сарбандҳои ҷаҳонро тамошо кунед',
      highlights_ru: ['Плотина высотой 300м', 'Машинный зал', 'Панорамные виды'],
      highlights_en: ['300m tall dam', 'Machine hall', 'Panoramic views'],
      highlights_tj: ['Сарбанди 300 м баландӣ', 'Толори мошинхона', 'Манзараҳои панорамӣ'],
    },
    {
      id: 3,
      image: 'https://cdnn1.img.sputnik.tj/img/102623/35/1026233535_0:0:3070:2048_600x0_80_0_1_e6b53e15cb4a96bf7c8398b4ac18a2d6.jpg',
      duration_ru: '8 часов',
      duration_en: '8 hours',
      duration_tj: '8 соат',
      category_ru: 'Природа',
      category_en: 'Nature',
      category_tj: 'Табиат',
      title_ru: 'Семь озёр Маргузор',
      title_en: 'Seven Lakes of Marguzor',
      title_tj: 'Ҳафт кӯли Маргузор',
      description_ru: 'Насладитесь красотой горных озёр Фанских гор',
      description_en: 'Enjoy the beauty of mountain lakes in the Fann Mountains',
      description_tj: 'Аз зебоии кӯлҳои кӯҳии кӯҳҳои Фон лаззат баред',
      highlights_ru: ['Кристально чистая вода', 'Горные пейзажи', 'Фотографии'],
      highlights_en: ['Crystal clear water', 'Mountain landscapes', 'Photography'],
      highlights_tj: ['Оби софи кристаллӣ', 'Манзараҳои кӯҳӣ', 'Аксбардорӣ'],
    },
    {
      id: 4,
      image: 'https://cdnn1.img.sputnik.tj/img/102926/72/1029267271_0:158:3001:1846_1920x0_80_0_0_10837272481c406dd9046eb48b8e4b34.jpg',
      duration_ru: '5 часов',
      duration_en: '5 hours',
      duration_tj: '5 соат',
      category_ru: 'История',
      category_en: 'History',
      category_tj: 'Таърих',
      title_ru: 'Крепость Гиссар',
      title_en: 'Hisor Fortress',
      title_tj: 'Қалъаи Ҳисор',
      description_ru: 'Посетите древнюю крепость с более чем 2500-летней историей',
      description_en: 'Visit an ancient fortress with over 2500 years of history',
      description_tj: 'Қалъаи қадимаро бо таърихи зиёда аз 2500-сола тамошо кунед',
      highlights_ru: ['Древние ворота', 'Медресе', 'Археологический музей'],
      highlights_en: ['Ancient gates', 'Madrasah', 'Archaeological museum'],
      highlights_tj: ['Дарвозаҳои қадима', 'Мадраса', 'Осорхонаи археологӣ'],
    },
  ]

  // Form state
  const [excursionForm, setExcursionForm] = useState({
    image: '',
    duration_ru: '',
    duration_en: '',
    duration_tj: '',
    category_ru: '',
    category_en: '',
    category_tj: '',
    title_ru: '',
    title_en: '',
    title_tj: '',
    description_ru: '',
    description_en: '',
    description_tj: '',
    highlights_ru: [],
    highlights_en: [],
    highlights_tj: [],
  })

  const [highlightInputs, setHighlightInputs] = useState({
    ru: '',
    en: '',
    tj: ''
  })

  useEffect(() => {
    loadExcursionsData()
  }, [])

  const loadExcursionsData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.excursions_data) {
        setExcursions(JSON.parse(settingsMap.excursions_data))
      } else {
        setExcursions(defaultExcursions)
      }

      if (settingsMap.excursions_page_settings) {
        setPageSettings(JSON.parse(settingsMap.excursions_page_settings))
      }
    } catch (err) {
      console.error('Failed to load excursions:', err)
      setExcursions(defaultExcursions)
    } finally {
      setLoading(false)
    }
  }

  const saveExcursions = async (excursionsData = excursions, settingsData = pageSettings) => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi([
        { key: 'excursions_data', value: JSON.stringify(excursionsData) },
        { key: 'excursions_page_settings', value: JSON.stringify(settingsData) }
      ])
      setSaveStatus({ type: 'success', message: 'Экскурсии сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save excursions:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetForm = () => {
    setExcursionForm({
      image: '',
      duration_ru: '',
      duration_en: '',
      duration_tj: '',
      category_ru: '',
      category_en: '',
      category_tj: '',
      title_ru: '',
      title_en: '',
      title_tj: '',
      description_ru: '',
      description_en: '',
      description_tj: '',
      highlights_ru: [],
      highlights_en: [],
      highlights_tj: [],
    })
    setHighlightInputs({ ru: '', en: '', tj: '' })
  }

  const openAddModal = () => {
    resetForm()
    setEditingExcursion(null)
    setShowModal(true)
  }

  const openEditModal = (excursion) => {
    setExcursionForm({
      ...excursion,
      highlights_ru: excursion.highlights_ru || [],
      highlights_en: excursion.highlights_en || [],
      highlights_tj: excursion.highlights_tj || [],
    })
    setEditingExcursion(excursion.id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingExcursion(null)
    resetForm()
  }

  const addExcursion = async () => {
    const newExcursion = {
      id: Date.now(),
      ...excursionForm
    }
    const newExcursions = [...excursions, newExcursion]
    setExcursions(newExcursions)
    closeModal()
    await saveExcursions(newExcursions)
  }

  const updateExcursion = async () => {
    const newExcursions = excursions.map(e =>
      e.id === editingExcursion ? { ...e, ...excursionForm } : e
    )
    setExcursions(newExcursions)
    closeModal()
    await saveExcursions(newExcursions)
  }

  const deleteExcursion = async (id) => {
    if (!window.confirm('Удалить эту экскурсию?')) return
    const newExcursions = excursions.filter(e => e.id !== id)
    setExcursions(newExcursions)
    await saveExcursions(newExcursions)
  }

  const addHighlight = (lang) => {
    const input = highlightInputs[lang].trim()
    if (!input) return

    const key = `highlights_${lang}`
    setExcursionForm({
      ...excursionForm,
      [key]: [...(excursionForm[key] || []), input]
    })
    setHighlightInputs({ ...highlightInputs, [lang]: '' })
  }

  const removeHighlight = (lang, index) => {
    const key = `highlights_${lang}`
    const updated = [...excursionForm[key]]
    updated.splice(index, 1)
    setExcursionForm({ ...excursionForm, [key]: updated })
  }

  const moveExcursion = async (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= excursions.length) return

    const newExcursions = [...excursions]
    const temp = newExcursions[index]
    newExcursions[index] = newExcursions[newIndex]
    newExcursions[newIndex] = temp
    setExcursions(newExcursions)
    await saveExcursions(newExcursions)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await upload(file)
      if (result.success) {
        setExcursionForm({ ...excursionForm, image: result.url })
      }
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Ошибка загрузки изображения: ' + err.message)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div className="excursions-manager">
        <div className="section-loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className={`excursions-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Экскурсии</h1>
          <p>Управление культурной программой</p>
        </div>
        <button className="page-settings-btn" onClick={() => setShowSettingsModal(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Настройки страницы
        </button>
      </div>

      {/* Save Status */}
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
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      )}

      <div className="excursions-layout">
        {/* Excursions List */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Список экскурсий</h3>
            <button className="btn-add" onClick={openAddModal}>
              + Добавить экскурсию
            </button>
          </div>

          {/* Excursions List */}
          <div className="excursions-list">
            {excursions.length === 0 ? (
              <div className="empty-state">
                <p>Нет экскурсий</p>
                <button className="btn-add" onClick={openAddModal}>
                  + Добавить первую экскурсию
                </button>
              </div>
            ) : (
              excursions.map((excursion, index) => (
                <div key={excursion.id} className="excursion-card-admin">
                  <div className="excursion-card-image-wrapper">
                    <div className="excursion-card-image">
                      <img src={excursion.image} alt={excursion.title_ru} />
                    </div>
                    <div className="excursion-card-order">
                      <button
                        className="btn-move"
                        onClick={() => moveExcursion(index, -1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <span>{index + 1}</span>
                      <button
                        className="btn-move"
                        onClick={() => moveExcursion(index, 1)}
                        disabled={index === excursions.length - 1}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <div className="excursion-card-body">
                    <div className="excursion-card-content">
                      <h4>{excursion.title_ru}</h4>
                      <p className="excursion-card-description">{excursion.description_ru}</p>
                      <span className="excursion-card-duration">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {excursion.duration_ru}
                      </span>
                    </div>
                    <div className="excursion-card-actions">
                      <button className="btn-edit" onClick={() => openEditModal(excursion)}>
                        Изменить
                      </button>
                      <button className="btn-delete" onClick={() => deleteExcursion(excursion.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="settings-modal-overlay" onClick={closeModal}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingExcursion === null ? 'Новая экскурсия' : 'Редактирование экскурсии'}</h2>
              <button className="settings-modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              {/* Language Tabs */}
              <div className="modal-text-tabs">
                <button
                  className={`modal-text-tab ${activeTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ru')}
                >
                  Русский
                </button>
                <button
                  className={`modal-text-tab ${activeTab === 'en' ? 'active' : ''}`}
                  onClick={() => setActiveTab('en')}
                >
                  Английский
                </button>
                <button
                  className={`modal-text-tab ${activeTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tj')}
                >
                  Таджикский
                </button>
              </div>

              {/* Language-specific fields */}
              <div className="form-group">
                <label>
                  {activeTab === 'ru' ? 'Название' : activeTab === 'en' ? 'Title' : 'Номгӯй'}
                  {activeTab !== 'ru' && ` (${activeTab === 'en' ? 'Английский' : 'Таджикский'})`}
                </label>
                <input
                  type="text"
                  value={excursionForm[`title_${activeTab}`]}
                  onChange={(e) => setExcursionForm({ ...excursionForm, [`title_${activeTab}`]: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  {activeTab === 'ru' ? 'Описание' : activeTab === 'en' ? 'Description' : 'Тавсиф'}
                  {activeTab !== 'ru' && ` (${activeTab === 'en' ? 'Английский' : 'Таджикский'})`}
                </label>
                <textarea
                  value={excursionForm[`description_${activeTab}`]}
                  onChange={(e) => setExcursionForm({ ...excursionForm, [`description_${activeTab}`]: e.target.value })}
                  rows="4"
                  placeholder={
                    activeTab === 'ru' ? 'Познакомьтесь с достопримечательностями...\n✅ Пункт 1\n✅ Пункт 2' :
                    activeTab === 'en' ? 'Explore the landmarks...\n✅ Item 1\n✅ Item 2' :
                    'Бо ҷойҳои дидании...\n✅ Пункт 1\n✅ Пункт 2'
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  {activeTab === 'ru' ? 'Длительность' : activeTab === 'en' ? 'Duration' : 'Давомнокӣ'}
                  {activeTab !== 'ru' && ` (${activeTab === 'en' ? 'Английский' : 'Таджикский'})`}
                </label>
                <input
                  type="text"
                  value={excursionForm[`duration_${activeTab}`]}
                  onChange={(e) => setExcursionForm({ ...excursionForm, [`duration_${activeTab}`]: e.target.value })}
                  placeholder={activeTab === 'ru' ? '4 часа' : activeTab === 'en' ? '4 hours' : '4 соат'}
                />
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label>Изображение</label>
                <div className="image-source-toggle">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn-upload-modern"
                    onClick={triggerFileInput}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <svg className="upload-spinner" viewBox="0 0 24 24" width="18" height="18">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                        </svg>
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                        </svg>
                        Загрузить изображение
                      </>
                    )}
                  </button>
                  <span className="image-upload-or">или</span>
                  <button
                    type="button"
                    className="btn-url-modern"
                    onClick={() => {
                      const url = prompt('Введите URL изображения:')
                      if (url) setExcursionForm({ ...excursionForm, image: url })
                    }}
                  >
                    Вставьте URL изображения
                  </button>
                </div>
                {excursionForm.image && (
                  <div className="image-preview-modern">
                    <img src={excursionForm.image} alt="Preview" />
                    <button
                      type="button"
                      className="image-preview-remove-modern"
                      onClick={() => setExcursionForm({ ...excursionForm, image: '' })}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button
                className="btn-save"
                onClick={() => editingExcursion === null ? addExcursion() : updateExcursion()}
              >
                {editingExcursion === null ? 'Добавить' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {showSettingsModal && (
        <div className="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>Настройки страницы</h2>
              <button className="settings-modal-close" onClick={() => setShowSettingsModal(false)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="lang-tab-buttons">
                <button className={`lang-tab-btn ${settingsTab === 'ru' ? 'active' : ''}`} onClick={() => setSettingsTab('ru')}>
                  <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-tab-flag" />
                  <span>Русский</span>
                </button>
                <button className={`lang-tab-btn ${settingsTab === 'en' ? 'active' : ''}`} onClick={() => setSettingsTab('en')}>
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-tab-flag" />
                  <span>English</span>
                </button>
                <button className={`lang-tab-btn ${settingsTab === 'tj' ? 'active' : ''}`} onClick={() => setSettingsTab('tj')}>
                  <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-tab-flag" />
                  <span>Тоҷикӣ</span>
                </button>
              </div>
              <div className="form-group">
                <label>Заголовок страницы</label>
                <input
                  type="text"
                  value={pageSettings[`title_${settingsTab}`]}
                  onChange={(e) => setPageSettings({ ...pageSettings, [`title_${settingsTab}`]: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Подзаголовок</label>
                <textarea
                  rows="2"
                  value={pageSettings[`subtitle_${settingsTab}`]}
                  onChange={(e) => setPageSettings({ ...pageSettings, [`subtitle_${settingsTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => setShowSettingsModal(false)}>Отмена</button>
              <button className="btn-save" onClick={() => { saveExcursions(); setShowSettingsModal(false); }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
