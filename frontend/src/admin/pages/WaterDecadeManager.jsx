import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../hooks/useApi'
import './WaterDecadeManager.css'

export default function WaterDecadeManager({ embedded = false }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')
  const [conferencesExpanded, setConferencesExpanded] = useState(false)

  // Modal states
  const [showConfModal, setShowConfModal] = useState(false)
  const [editingConfId, setEditingConfId] = useState(null)
  const [modalLangTab, setModalLangTab] = useState('ru')

  // Brief info modal state
  const [showBriefModal, setShowBriefModal] = useState(false)
  const [briefLangTab, setBriefLangTab] = useState('ru')

  // Form states
  const [confForm, setConfForm] = useState({
    year: '',
    url: '',
    isCurrent: false,
    title_ru: '',
    title_en: '',
    title_tj: '',
    description_ru: '',
    description_en: '',
    description_tj: '',
    date_ru: '',
    date_en: '',
    date_tj: '',
    location_ru: '',
    location_en: '',
    location_tj: '',
    participants_ru: '',
    participants_en: '',
    participants_tj: '',
    keyOutcomes_ru: '',
    keyOutcomes_en: '',
    keyOutcomes_tj: '',
  })

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  const [conferences, setConferences] = useState([])
  const [pageSettings, setPageSettings] = useState({
    title_ru: 'Десятилетие воды',
    title_en: 'Water Decade',
    title_tj: 'Даҳсолаи об',
    subtitle_ru: 'Международное десятилетие действий «Вода для устойчивого развития» 2018-2028',
    subtitle_en: 'International Decade for Action "Water for Sustainable Development" 2018-2028',
    subtitle_tj: 'Даҳсолаи байналмилалии амалиёт «Об барои рушди устувор» 2018-2028',
    yearStart: '2018',
    yearEnd: '2028',
  })

  // Brief info content (for the main water decade page "О десятилетии" section)
  const [briefInfo, setBriefInfo] = useState({
    aboutTitle_ru: 'О десятилетии',
    aboutTitle_en: 'About the Decade',
    aboutTitle_tj: 'Дар бораи даҳсола',
    aboutText_ru: 'В декабре 2016 года Генеральная Ассамблея ООН провозгласила период 2018-2028 годов Международным десятилетием действий «Вода для устойчивого развития».\n\nРеспублика Таджикистан выступила инициатором данного Десятилетия, продолжая свою активную роль в продвижении глобальной водной повестки дня.',
    aboutText_en: 'In December 2016, the UN General Assembly proclaimed the period 2018-2028 as the International Decade for Action "Water for Sustainable Development".\n\nThe Republic of Tajikistan initiated this Decade, continuing its active role in promoting the global water agenda.',
    aboutText_tj: 'Дар моҳи декабри соли 2016 Маҷмааи Умумии СММ давраи солҳои 2018-2028-ро Даҳсолаи байналмилалии амалиёт «Об барои рушди устувор» эълон кард.\n\nҶумҳурии Тоҷикистон ташаббускори ин Даҳсола буд ва нақши фаъолонаи худро дар пешбурди барномаи ҷаҳонии обӣ идома медиҳад.',
  })

  const defaultConferences = [
    {
      id: 1, year: '2018',
      title_ru: 'Международная конференция высокого уровня',
      title_en: 'High-Level International Conference',
      title_tj: 'Конференсияи байналмилалии сатҳи баланд',
      description_ru: 'Первая конференция Десятилетия действий «Вода для устойчивого развития»',
      description_en: 'First conference of the Water Action Decade',
      description_tj: 'Аввалин конференсияи Даҳсолаи амалиёти «Об барои рушди устувор»',
      url: 'https://waterconference2018.org',
      isCurrent: false,
    },
    {
      id: 2, year: '2022',
      title_ru: 'Вторая конференция ООН по водным ресурсам',
      title_en: 'Second UN Water Conference',
      title_tj: 'Конференсияи дуюми СММ оид ба захираҳои обӣ',
      description_ru: 'Конференция по среднесрочному обзору Десятилетия',
      description_en: 'Mid-term review conference of the Water Decade',
      description_tj: 'Конференсияи баррасии миёнамуҳлати Даҳсола',
      url: 'https://waterconference2022.org',
      isCurrent: false,
    },
    {
      id: 3, year: '2024',
      title_ru: 'Третья международная конференция',
      title_en: 'Third International Conference',
      title_tj: 'Конференсияи сеюми байналмилалӣ',
      description_ru: 'Продолжение диалога по водным ресурсам',
      description_en: 'Continuation of dialogue on water resources',
      description_tj: 'Идомаи муколама оид ба захираҳои обӣ',
      url: 'https://waterconference2024.org',
      isCurrent: false,
    },
    {
      id: 4, year: '2026',
      title_ru: 'Душанбинский водный процесс 2026',
      title_en: 'Dushanbe Water Process 2026',
      title_tj: 'Раванди обии Душанбе 2026',
      description_ru: 'Текущая конференция — итоговое мероприятие Десятилетия',
      description_en: 'Current conference — culminating event of the Decade',
      description_tj: 'Конференсияи ҷорӣ — чорабинии ниҳоии Даҳсола',
      url: '',
      isCurrent: true,
    },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      setConferences(settingsMap.water_decade_conferences ? JSON.parse(settingsMap.water_decade_conferences) : defaultConferences)
      if (settingsMap.water_decade_page_settings) {
        setPageSettings(JSON.parse(settingsMap.water_decade_page_settings))
      }
      if (settingsMap.water_decade_brief_info) {
        setBriefInfo(prev => ({ ...prev, ...JSON.parse(settingsMap.water_decade_brief_info) }))
      }
    } catch (err) {
      console.error('Failed to load water decade data:', err)
      setConferences(defaultConferences)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi({
        water_decade_conferences: JSON.stringify(conferences),
        water_decade_page_settings: JSON.stringify(pageSettings),
        water_decade_brief_info: JSON.stringify(briefInfo),
      })
      setSaveStatus({ type: 'success', message: 'Сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  // Conference Modal Functions
  const openAddConfModal = () => {
    setConfForm({
      year: '',
      url: '',
      isCurrent: false,
      title_ru: '',
      title_en: '',
      title_tj: '',
      description_ru: '',
      description_en: '',
      description_tj: '',
      date_ru: '',
      date_en: '',
      date_tj: '',
      location_ru: '',
      location_en: '',
      location_tj: '',
      participants_ru: '',
      participants_en: '',
      participants_tj: '',
      keyOutcomes_ru: '',
      keyOutcomes_en: '',
      keyOutcomes_tj: '',
    })
    setEditingConfId(null)
    setModalLangTab('ru')
    setShowConfModal(true)
  }

  const openEditConfModal = (conf) => {
    setConfForm({
      year: conf.year || '',
      url: conf.url || '',
      isCurrent: conf.isCurrent || false,
      title_ru: conf.title_ru || '',
      title_en: conf.title_en || '',
      title_tj: conf.title_tj || '',
      description_ru: conf.description_ru || '',
      description_en: conf.description_en || '',
      description_tj: conf.description_tj || '',
      date_ru: conf.date_ru || '',
      date_en: conf.date_en || '',
      date_tj: conf.date_tj || '',
      location_ru: conf.location_ru || '',
      location_en: conf.location_en || '',
      location_tj: conf.location_tj || '',
      participants_ru: conf.participants_ru || '',
      participants_en: conf.participants_en || '',
      participants_tj: conf.participants_tj || '',
      keyOutcomes_ru: conf.keyOutcomes_ru || '',
      keyOutcomes_en: conf.keyOutcomes_en || '',
      keyOutcomes_tj: conf.keyOutcomes_tj || '',
    })
    setEditingConfId(conf.id)
    setModalLangTab('ru')
    setShowConfModal(true)
  }

  const closeConfModal = () => {
    setShowConfModal(false)
    setEditingConfId(null)
  }

  const saveConfModal = () => {
    if (editingConfId) {
      setConferences(prev => prev.map(c =>
        c.id === editingConfId ? { ...c, ...confForm } : c
      ))
    } else {
      const newConf = {
        id: Date.now(),
        ...confForm,
      }
      setConferences(prev => [...prev, newConf])
    }
    closeConfModal()
  }

  const deleteConference = (id) => {
    if (!window.confirm('Удалить эту конференцию?')) return
    setConferences(prev => prev.filter(c => c.id !== id))
  }

  if (loading) {
    return <div className="section-loading">Загрузка...</div>
  }

  return (
    <div className={`water-decade-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Десятилетие воды</h1>
          <p>Водное десятилетие ООН</p>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>×</button>
        </div>
      )}

      {/* Two Page Edit Sections Side by Side */}
      <div className="page-sections-row">
        {/* Brief Info Section */}
        <div className="admin-card page-section-card">
          <div className="card-header" style={{ borderBottom: 'none' }}>
            <h3>Коротко о десятилетии</h3>
            <button className="btn-add" onClick={() => setShowBriefModal(true)}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: '6px' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Редактировать
            </button>
          </div>
        </div>

        {/* Details Page Section */}
        <div className="admin-card page-section-card">
          <div className="card-header" style={{ borderBottom: 'none' }}>
            <h3>Подробнее о десятилетии</h3>
            <button className="btn-add" onClick={() => navigate('/admin/water-decade-editor')}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: '6px' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Редактировать страницу
            </button>
          </div>
        </div>
      </div>

      {/* Conferences Section - Collapsible */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div
          className="card-header card-header--collapsible"
          onClick={() => setConferencesExpanded(!conferencesExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
              style={{
                transform: conferencesExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
            <h3 style={{ margin: 0 }}>Конференции ({conferences.length})</h3>
          </div>
          {conferencesExpanded && (
            <button className="btn-add" onClick={(e) => { e.stopPropagation(); openAddConfModal(); }}>
              + Добавить конференцию
            </button>
          )}
        </div>

        {conferencesExpanded && (
          <div className="conferences-list">
          {conferences.map(conf => (
            <div key={conf.id} className={`conference-card ${conf.isCurrent ? 'conference-card--current' : ''}`}>
              <div className="conference-card-header">
                <div className="conference-year-badge">
                  <span className="year">{conf.year || '—'}</span>
                  {conf.isCurrent && <span className="current-badge">Текущая</span>}
                </div>
                <div className="conference-actions">
                  <button className="btn-icon" onClick={() => openEditConfModal(conf)} title="Редактировать">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button className="btn-icon" onClick={() => navigate(`/admin/water-decade-editor/${conf.id}`)} title="Редактировать страницу">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                    </svg>
                  </button>
                  <button className="btn-icon btn-icon--danger" onClick={() => deleteConference(conf.id)} title="Удалить">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="conference-card-body">
                <h4 className="conference-title">{conf.title_ru}</h4>
                <p className="conference-description">{conf.description_ru}</p>
                {conf.url && (
                  <a href={conf.url} target="_blank" rel="noopener noreferrer" className="conference-link">
                    {conf.url}
                  </a>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-save" onClick={handleSave}>
          Сохранить все изменения
        </button>
      </div>

      {/* Conference Modal */}
      {showConfModal && (
        <div className="settings-modal-overlay" onClick={closeConfModal}>
          <div className="settings-modal settings-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingConfId ? 'Редактировать конференцию' : 'Добавить конференцию'}</h2>
              <button className="settings-modal-close" onClick={closeConfModal}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Год</label>
                  <input
                    type="text"
                    value={confForm.year}
                    onChange={(e) => setConfForm({ ...confForm, year: e.target.value })}
                    placeholder="2026"
                  />
                </div>
                <div className="form-group">
                  <label>URL сайта</label>
                  <input
                    type="text"
                    value={confForm.url}
                    onChange={(e) => setConfForm({ ...confForm, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={confForm.isCurrent}
                    onChange={(e) => setConfForm({ ...confForm, isCurrent: e.target.checked })}
                  />
                  Текущая конференция
                </label>
              </div>

              <div className="lang-tabs-simple">
                <button
                  className={`lang-tab-simple ${modalLangTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setModalLangTab('ru')}
                >
                  Русский
                </button>
                <button
                  className={`lang-tab-simple ${modalLangTab === 'en' ? 'active' : ''}`}
                  onClick={() => setModalLangTab('en')}
                >
                  Английский
                </button>
                <button
                  className={`lang-tab-simple ${modalLangTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setModalLangTab('tj')}
                >
                  Таджикский
                </button>
              </div>

              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={confForm[`title_${modalLangTab}`]}
                  onChange={(e) => setConfForm({ ...confForm, [`title_${modalLangTab}`]: e.target.value })}
                  placeholder="Введите название конференции"
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  rows="3"
                  value={confForm[`description_${modalLangTab}`]}
                  onChange={(e) => setConfForm({ ...confForm, [`description_${modalLangTab}`]: e.target.value })}
                  placeholder="Введите описание конференции"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Дата</label>
                  <input
                    type="text"
                    value={confForm[`date_${modalLangTab}`]}
                    onChange={(e) => setConfForm({ ...confForm, [`date_${modalLangTab}`]: e.target.value })}
                    placeholder="20-22 июня 2018"
                  />
                </div>
                <div className="form-group">
                  <label>Место проведения</label>
                  <input
                    type="text"
                    value={confForm[`location_${modalLangTab}`]}
                    onChange={(e) => setConfForm({ ...confForm, [`location_${modalLangTab}`]: e.target.value })}
                    placeholder="Душанбе, Таджикистан"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Участники</label>
                <input
                  type="text"
                  value={confForm[`participants_${modalLangTab}`]}
                  onChange={(e) => setConfForm({ ...confForm, [`participants_${modalLangTab}`]: e.target.value })}
                  placeholder="Более 2 000 участников из 120 стран"
                />
              </div>

              <div className="form-group">
                <label>Ключевые итоги</label>
                <textarea
                  rows="4"
                  value={confForm[`keyOutcomes_${modalLangTab}`]}
                  onChange={(e) => setConfForm({ ...confForm, [`keyOutcomes_${modalLangTab}`]: e.target.value })}
                  placeholder="Введите ключевые итоги конференции"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={closeConfModal}>Отмена</button>
              <button className="btn-save" onClick={saveConfModal}>
                {editingConfId ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brief Info Modal */}
      {showBriefModal && (
        <div className="settings-modal-overlay" onClick={() => setShowBriefModal(false)}>
          <div className="settings-modal settings-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>Коротко о десятилетии</h2>
              <button className="settings-modal-close" onClick={() => setShowBriefModal(false)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="lang-tabs-simple">
                <button
                  className={`lang-tab-simple ${briefLangTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setBriefLangTab('ru')}
                >
                  Русский
                </button>
                <button
                  className={`lang-tab-simple ${briefLangTab === 'en' ? 'active' : ''}`}
                  onClick={() => setBriefLangTab('en')}
                >
                  Английский
                </button>
                <button
                  className={`lang-tab-simple ${briefLangTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setBriefLangTab('tj')}
                >
                  Таджикский
                </button>
              </div>

              <div className="form-group">
                <label>Заголовок раздела «О десятилетии»</label>
                <input
                  type="text"
                  value={briefInfo[`aboutTitle_${briefLangTab}`] || ''}
                  onChange={(e) => setBriefInfo({ ...briefInfo, [`aboutTitle_${briefLangTab}`]: e.target.value })}
                  placeholder="О десятилетии"
                />
              </div>

              <div className="form-group">
                <label>Текст раздела</label>
                <textarea
                  rows="8"
                  value={briefInfo[`aboutText_${briefLangTab}`] || ''}
                  onChange={(e) => setBriefInfo({ ...briefInfo, [`aboutText_${briefLangTab}`]: e.target.value })}
                  placeholder="Введите текст..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => setShowBriefModal(false)}>Отмена</button>
              <button className="btn-save" onClick={() => { handleSave(); setShowBriefModal(false); }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
