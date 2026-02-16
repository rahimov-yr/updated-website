import { useState, useEffect, useRef } from 'react'
import { useSettings, useUpload } from '../hooks/useApi'
import './ExhibitionManager.css'

export default function ExhibitionManager({ embedded = false }) {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('ru')
  const [activeSection, setActiveSection] = useState('hero')
  const [expandedZones, setExpandedZones] = useState({})
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')
  const [showIconPicker, setShowIconPicker] = useState(null)

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  // Available icons for zones
  const availableIcons = [
    { id: 'layers', name: 'Слои', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { id: 'globe', name: 'Глобус', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
    { id: 'building', name: 'Здание', path: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3' },
    { id: 'shield', name: 'Щит', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'droplet', name: 'Капля', path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
    { id: 'sun', name: 'Солнце', path: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' },
    { id: 'leaf', name: 'Лист', path: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' },
    { id: 'users', name: 'Люди', path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'zap', name: 'Молния', path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'award', name: 'Награда', path: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12' },
    { id: 'target', name: 'Цель', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
    { id: 'compass', name: 'Компас', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z' },
  ]
  const { upload, uploading } = useUpload()
  const fileInputRefs = useRef({})

  const [pageSettings, setPageSettings] = useState({
    // Page hero
    title_ru: 'Выставка',
    title_en: 'Exhibition',
    title_tj: 'Намоишгоҳ',
    subtitle_ru: 'Международная выставка технологий и решений в сфере водных ресурсов',
    subtitle_en: 'International exhibition of technologies and solutions in water resources',
    subtitle_tj: 'Намоишгоҳи байналмилалии технологияҳо ва роҳҳои ҳалли захираҳои обӣ',

    // Intro section
    intro_label_ru: 'МЕЖДУНАРОДНАЯ ВЫСТАВКА',
    intro_label_en: 'INTERNATIONAL EXHIBITION',
    intro_label_tj: 'НАМОИШГОҲИ БАЙНАЛМИЛАЛӢ',
    intro_title_ru: 'Инновации для устойчивого будущего',
    intro_title_en: 'Innovations for a Sustainable Future',
    intro_title_tj: 'Навоварӣ барои ояндаи устувор',
    intro_desc_ru: 'В рамках конференции будет организована масштабная выставка, демонстрирующая последние достижения в области управления водными ресурсами и устойчивого развития. Более 100 экспонентов из 50+ стран представят передовые технологии и решения.',
    intro_desc_en: 'The conference will feature a large-scale exhibition showcasing the latest achievements in water resource management and sustainable development. More than 100 exhibitors from 50+ countries will present advanced technologies and solutions.',
    intro_desc_tj: 'Дар доираи конфронс намоишгоҳи бузург ташкил карда мешавад, ки дастовардҳои охирин дар соҳаи идоракунии захираҳои обӣ ва рушди устуворро намоиш медиҳад.',
    intro_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',

    // Stats
    stat1_value: '100+',
    stat1_label_ru: 'Экспонентов',
    stat1_label_en: 'Exhibitors',
    stat1_label_tj: 'Иштирокчиён',
    stat2_value: '50+',
    stat2_label_ru: 'Стран',
    stat2_label_en: 'Countries',
    stat2_label_tj: 'Кишварҳо',
    stat3_value: '3',
    stat3_label_ru: 'Дня',
    stat3_label_en: 'Days',
    stat3_label_tj: 'Рӯз',

    // Zones section title
    zones_title_ru: 'ТЕМАТИЧЕСКИЕ ЗОНЫ',
    zones_title_en: 'THEMATIC ZONES',
    zones_title_tj: 'МИНТАҚАҲОИ МАВЗӮЪӢ',

    // Zones stored as array
    zones: [
      {
        id: 1,
        icon: 'layers',
        title_ru: 'Инновации и технологии',
        title_en: 'Innovation and Technology',
        title_tj: 'Навоварӣ ва технология',
        desc_ru: 'Передовые технологии в сфере водоснабжения, очистки воды, мониторинга качества и умного управления водными ресурсами.',
        desc_en: 'Advanced technologies in water supply, water treatment, quality monitoring and smart water resource management.',
        desc_tj: 'Технологияҳои пешқадам дар соҳаи таъминоти об, тозакунии об, мониторинги сифат ва идоракунии оқилонаи захираҳои обӣ.',
        items_ru: 'Системы умного водоснабжения\nТехнологии очистки воды\nIoT-решения для мониторинга',
        items_en: 'Smart water supply systems\nWater treatment technologies\nIoT solutions for monitoring',
        items_tj: 'Системаҳои обтаъминкунии оқилона\nТехнологияҳои тозакунии об\nҲалли IoT барои мониторинг',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        icon: 'globe',
        title_ru: 'Международные организации',
        title_en: 'International Organizations',
        title_tj: 'Ташкилотҳои байналмилалӣ',
        desc_ru: 'Стенды ведущих международных организаций, представляющих глобальные инициативы в области водных ресурсов.',
        desc_en: 'Stands of leading international organizations representing global initiatives in the field of water resources.',
        desc_tj: 'Стендҳои ташкилотҳои пешбари байналмилалӣ, ки ташаббусҳои ҷаҳониро дар соҳаи захираҳои обӣ муаррифӣ мекунанд.',
        items_ru: 'ООН и агентства системы ООН\nВсемирный банк и МВФ\nЮНЕСКО и ЮНЕП',
        items_en: 'UN and UN system agencies\nWorld Bank and IMF\nUNESCO and UNEP',
        items_tj: 'СММ ва агентиҳои системаи СММ\nБонки ҷаҳонӣ ва ФБВ\nЮНЕСКО ва ЮНЕП',
        image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        icon: 'building',
        title_ru: 'Национальные павильоны',
        title_en: 'National Pavilions',
        title_tj: 'Павилионҳои миллӣ',
        desc_ru: 'Страны-участницы представят свои достижения и опыт в области управления водными ресурсами.',
        desc_en: 'Participating countries will present their achievements and experience in water resource management.',
        desc_tj: 'Кишварҳои иштирокчӣ дастовардҳо ва таҷрибаи худро дар соҳаи идоракунии захираҳои обӣ пешниҳод мекунанд.',
        items_ru: 'Национальные проекты\nРегиональное сотрудничество\nКультурные программы',
        items_en: 'National projects\nRegional cooperation\nCultural programs',
        items_tj: 'Лоиҳаҳои миллӣ\nҲамкории минтақавӣ\nБарномаҳои фарҳангӣ',
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop',
      },
      {
        id: 4,
        icon: 'shield',
        title_ru: 'Экологические инициативы',
        title_en: 'Environmental Initiatives',
        title_tj: 'Ташаббусҳои экологӣ',
        desc_ru: 'Проекты по защите водных ресурсов, восстановлению экосистем и адаптации к изменению климата.',
        desc_en: 'Projects for water resource protection, ecosystem restoration and climate change adaptation.',
        desc_tj: 'Лоиҳаҳо оид ба ҳифзи захираҳои обӣ, барқароркунии экосистемаҳо ва мутобиқшавӣ ба тағйироти иқлим.',
        items_ru: 'Защита водных экосистем\nКлиматическая адаптация\nУстойчивое развитие',
        items_en: 'Protection of aquatic ecosystems\nClimate adaptation\nSustainable development',
        items_tj: 'Ҳифзи экосистемаҳои обӣ\nМутобиқшавии иқлимӣ\nРушди устувор',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      },
    ],
  })

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.exhibition_settings) {
        const saved = JSON.parse(settingsMap.exhibition_settings)
        setPageSettings(prev => ({ ...prev, ...saved }))
      }
    } catch (err) {
      console.error('Failed to load exhibition settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi([
        { key: 'exhibition_settings', value: JSON.stringify(pageSettings) }
      ])
      setSaveStatus({ type: 'success', message: 'Настройки сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save exhibition settings:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleImageUpload = async (field, file) => {
    try {
      const result = await upload(file)
      if (result.success) {
        setPageSettings(prev => ({ ...prev, [field]: result.url }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Ошибка загрузки изображения')
    }
  }

  const triggerFileInput = (field) => {
    fileInputRefs.current[field]?.click()
  }

  if (loading) {
    return (
      <div className="exhibition-manager">
        <div className="section-loading">Загрузка...</div>
      </div>
    )
  }

  const getLangSuffix = () => {
    if (activeTab === 'en') return '_en'
    if (activeTab === 'tj') return '_tj'
    return '_ru'
  }

  const getIconPath = (iconId) => {
    const icon = availableIcons.find(i => i.id === iconId)
    return icon ? icon.path : availableIcons[0].path
  }

  const updateZone = (zoneId, field, value) => {
    setPageSettings(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === zoneId ? { ...z, [field]: value } : z)
    }))
  }

  const addNewZone = () => {
    const newId = Math.max(...pageSettings.zones.map(z => z.id), 0) + 1
    const newZone = {
      id: newId,
      icon: 'layers',
      title_ru: 'Новая зона',
      title_en: 'New Zone',
      title_tj: 'Минтақаи нав',
      desc_ru: '',
      desc_en: '',
      desc_tj: '',
      items_ru: '',
      items_en: '',
      items_tj: '',
      image: '',
    }
    setPageSettings(prev => ({
      ...prev,
      zones: [...prev.zones, newZone]
    }))
    setExpandedZones(prev => ({ ...prev, [newId]: true }))
  }

  const deleteZone = (zoneId) => {
    if (pageSettings.zones.length <= 1) {
      alert('Нельзя удалить последнюю зону')
      return
    }
    if (confirm('Вы уверены, что хотите удалить эту зону?')) {
      setPageSettings(prev => ({
        ...prev,
        zones: prev.zones.filter(z => z.id !== zoneId)
      }))
      setExpandedZones(prev => {
        const newState = { ...prev }
        delete newState[zoneId]
        return newState
      })
    }
  }

  const handleZoneImageUpload = async (zoneId, file) => {
    try {
      const result = await upload(file)
      if (result.success) {
        updateZone(zoneId, 'image', result.url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Ошибка загрузки изображения')
    }
  }

  return (
    <div className={`exhibition-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Выставка</h1>
          <p>Управление контентом страницы выставки</p>
        </div>
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

      {/* Main Layout with Sidebar */}
      <div className="exhibition-main-layout">
        {/* Section Tabs - Sidebar */}
        <div className="exhibition-section-tabs">
          <button
            className={`exhibition-section-tab ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveSection('hero')}
          >
            Hero секция
          </button>
          <button
            className={`exhibition-section-tab ${activeSection === 'zones' ? 'active' : ''}`}
            onClick={() => setActiveSection('zones')}
          >
            Тематические зоны
          </button>
        </div>

        {/* Content Area */}
        <div className="exhibition-content-area">
          {/* Language Tabs & Save Button */}
          <div className="exhibition-toolbar">
            <div className="exhibition-lang-tabs">
              <button
                className={`exhibition-lang-tab ${activeTab === 'ru' ? 'active' : ''}`}
                onClick={() => setActiveTab('ru')}
              >
                <img src="https://flagcdn.com/w20/ru.png" alt="RU" />
                RU
              </button>
              <button
                className={`exhibition-lang-tab ${activeTab === 'en' ? 'active' : ''}`}
                onClick={() => setActiveTab('en')}
              >
                <img src="https://flagcdn.com/w20/gb.png" alt="EN" />
                EN
              </button>
              <button
                className={`exhibition-lang-tab ${activeTab === 'tj' ? 'active' : ''}`}
                onClick={() => setActiveTab('tj')}
              >
                <img src="https://flagcdn.com/w20/tj.png" alt="TJ" />
                TJ
              </button>
            </div>
            <button className="exhibition-save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Сохранить всё
            </button>
          </div>

          {/* Hero Section Content */}
          {activeSection === 'hero' && (
            <>
              {/* Intro Text Section */}
              <div className="exhibition-content-section">
                <div className="exhibition-content-header">
                  <h3>Вступительный текст</h3>
                  <p>Лейбл, заголовок и описание</p>
                </div>
                <div className="exhibition-content-body">
                  <div className="exhibition-form-grid">
                    <div className="form-group">
                      <label>Лейбл ({activeTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={pageSettings[`intro_label${getLangSuffix()}`]}
                        onChange={e => setPageSettings(prev => ({ ...prev, [`intro_label${getLangSuffix()}`]: e.target.value }))}
                        placeholder="МЕЖДУНАРОДНАЯ ВЫСТАВКА"
                      />
                    </div>
                    <div className="form-group">
                      <label>Заголовок ({activeTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={pageSettings[`intro_title${getLangSuffix()}`]}
                        onChange={e => setPageSettings(prev => ({ ...prev, [`intro_title${getLangSuffix()}`]: e.target.value }))}
                        placeholder="Инновации для устойчивого будущего"
                      />
                    </div>
                    <div className="form-group form-group--full">
                      <label>Описание ({activeTab.toUpperCase()})</label>
                      <textarea
                        rows="3"
                        value={pageSettings[`intro_desc${getLangSuffix()}`]}
                        onChange={e => setPageSettings(prev => ({ ...prev, [`intro_desc${getLangSuffix()}`]: e.target.value }))}
                        placeholder="В рамках конференции будет организована масштабная выставка..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="exhibition-content-section">
                <div className="exhibition-content-header">
                  <h3>Статистика</h3>
                  <p>Показатели выставки</p>
                </div>
                <div className="exhibition-content-body">
                  <div className="exhibition-stats-grid">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="exhibition-stat-card">
                        <div className={`exhibition-stat-card-icon exhibition-stat-card-icon--${n === 1 ? 'blue' : n === 2 ? 'green' : 'amber'}`}>
                          {n === 1 && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          )}
                          {n === 2 && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          )}
                          {n === 3 && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Значение</label>
                          <input
                            type="text"
                            className="stat-value-input"
                            value={pageSettings[`stat${n}_value`]}
                            onChange={e => setPageSettings(prev => ({ ...prev, [`stat${n}_value`]: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Подпись ({activeTab.toUpperCase()})</label>
                          <input
                            type="text"
                            value={pageSettings[`stat${n}_label${getLangSuffix()}`]}
                            onChange={e => setPageSettings(prev => ({ ...prev, [`stat${n}_label${getLangSuffix()}`]: e.target.value }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intro Image */}
              <div className="exhibition-content-section">
                <div className="exhibition-content-header">
                  <h3>Изображение</h3>
                  <p>Главное изображение секции</p>
                </div>
                <div className="exhibition-content-body">
                  <div className="exhibition-single-image">
                    <div className="exhibition-image-preview-large">
                      {pageSettings.intro_image ? (
                        <img src={pageSettings.intro_image} alt="Intro" />
                      ) : (
                        <div className="exhibition-image-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="exhibition-image-controls">
                      <input
                        type="text"
                        value={pageSettings.intro_image}
                        onChange={e => setPageSettings(prev => ({ ...prev, intro_image: e.target.value }))}
                        placeholder="URL изображения"
                      />
                      <input
                        type="file"
                        ref={el => fileInputRefs.current['intro_image'] = el}
                        onChange={e => e.target.files[0] && handleImageUpload('intro_image', e.target.files[0])}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <button
                        className="exhibition-upload-btn"
                        onClick={() => triggerFileInput('intro_image')}
                        disabled={uploading}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                        </svg>
                        Загрузить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Zones Section Content */}
          {activeSection === 'zones' && (
        <>
          {/* Zones Section Title */}
          <div className="exhibition-content-section">
            <div className="exhibition-content-header">
              <h3>Заголовок секции</h3>
              <p>Заголовок секции тематических зон</p>
            </div>
            <div className="exhibition-content-body">
              <div className="form-group">
                <label>Заголовок секции ({activeTab.toUpperCase()})</label>
                <input
                  type="text"
                  value={pageSettings[`zones_title${getLangSuffix()}`]}
                  onChange={e => setPageSettings(prev => ({ ...prev, [`zones_title${getLangSuffix()}`]: e.target.value }))}
                  placeholder="ТЕМАТИЧЕСКИЕ ЗОНЫ"
                />
              </div>
            </div>
          </div>

          {/* Individual Zones */}
          <div className="exhibition-zones-list">
          {pageSettings.zones.map((zone, idx) => (
            <div key={zone.id} className={`exhibition-zone-dropdown ${expandedZones[zone.id] ? 'expanded' : ''}`}>
              <button
                className="exhibition-zone-dropdown-header"
                onClick={() => setExpandedZones(prev => ({ ...prev, [zone.id]: !prev[zone.id] }))}
              >
                <div className="exhibition-zone-dropdown-title">
                  <div className="exhibition-zone-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d={getIconPath(zone.icon)}></path>
                    </svg>
                  </div>
                  <span className="exhibition-zone-dropdown-number">{idx + 1}</span>
                  <span>{zone[`title${getLangSuffix()}`] || zone.title_ru}</span>
                </div>
                <div className="exhibition-zone-dropdown-actions">
                  <button
                    className="exhibition-zone-delete-btn"
                    onClick={(e) => { e.stopPropagation(); deleteZone(zone.id); }}
                    title="Удалить зону"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                  <svg
                    className="exhibition-zone-dropdown-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>
              {expandedZones[zone.id] && (
                <div className="exhibition-zone-dropdown-body">
                  <div className="exhibition-zone-editor">
                    <div className="exhibition-zone-fields">
                      {/* Icon Picker */}
                      <div className="form-group">
                        <label>Иконка</label>
                        <div className="exhibition-icon-picker">
                          <button
                            className="exhibition-icon-picker-trigger"
                            onClick={() => setShowIconPicker(showIconPicker === zone.id ? null : zone.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                              <path d={getIconPath(zone.icon)}></path>
                            </svg>
                            <span>{availableIcons.find(i => i.id === zone.icon)?.name || 'Выберите иконку'}</span>
                            <svg className="exhibition-icon-picker-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                          {showIconPicker === zone.id && (
                            <div className="exhibition-icon-picker-dropdown">
                              {availableIcons.map(icon => (
                                <button
                                  key={icon.id}
                                  className={`exhibition-icon-option ${zone.icon === icon.id ? 'active' : ''}`}
                                  onClick={() => { updateZone(zone.id, 'icon', icon.id); setShowIconPicker(null); }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                    <path d={icon.path}></path>
                                  </svg>
                                  <span>{icon.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Название ({activeTab.toUpperCase()})</label>
                        <input
                          type="text"
                          value={zone[`title${getLangSuffix()}`] || ''}
                          onChange={e => updateZone(zone.id, `title${getLangSuffix()}`, e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Описание ({activeTab.toUpperCase()})</label>
                        <textarea
                          rows="2"
                          value={zone[`desc${getLangSuffix()}`] || ''}
                          onChange={e => updateZone(zone.id, `desc${getLangSuffix()}`, e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Пункты списка ({activeTab.toUpperCase()}) - по одному на строку</label>
                        <textarea
                          rows="3"
                          value={zone[`items${getLangSuffix()}`] || ''}
                          onChange={e => updateZone(zone.id, `items${getLangSuffix()}`, e.target.value)}
                          placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3"
                        />
                      </div>
                    </div>
                    <div className="exhibition-zone-image">
                      <div className="exhibition-image-preview">
                        {zone.image ? (
                          <img src={zone.image} alt={zone.title_ru} />
                        ) : (
                          <div className="exhibition-image-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="exhibition-image-input-group">
                        <input
                          type="text"
                          className="exhibition-image-input"
                          value={zone.image || ''}
                          onChange={e => updateZone(zone.id, 'image', e.target.value)}
                          placeholder="URL изображения"
                        />
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[`zone_${zone.id}_image`] = el}
                          onChange={e => e.target.files[0] && handleZoneImageUpload(zone.id, e.target.files[0])}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <button
                          className="exhibition-upload-btn"
                          onClick={() => fileInputRefs.current[`zone_${zone.id}_image`]?.click()}
                          disabled={uploading}
                          title="Загрузить изображение"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>

          {/* Add New Zone Button */}
          <button className="exhibition-add-zone-btn" onClick={addNewZone}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Добавить зону
          </button>
        </>
        )}
        </div>
      </div>

    </div>
  )
}
