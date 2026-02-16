import { useState, useEffect, useRef } from 'react'
import { useSettings } from '../hooks/useApi'
import './ScheduleManager.css'

export default function ScheduleManager({ embedded = false }) {
  const [activeDay, setActiveDay] = useState(1)
  const [activeTab, setActiveTab] = useState('ru')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventEditTab, setEventEditTab] = useState('ru')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')
  const [showEventTypesModal, setShowEventTypesModal] = useState(false)
  const [eventTypesTab, setEventTypesTab] = useState('ru')

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragNodeRef = useRef(null)

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  // Page settings for public page
  const [pageSettings, setPageSettings] = useState({
    title_ru: 'Программа конференции',
    title_en: 'Conference Program',
    title_tj: 'Барномаи конфронс',
    subtitle_ru: 'Четыре дня насыщенной программы с пленарными заседаниями, тематическими сессиями и культурными мероприятиями',
    subtitle_en: 'Four days of intensive program with plenary sessions, thematic sessions, and cultural events',
    subtitle_tj: 'Чор рӯзи барномаи пурмазмун бо ҷаласаҳои пленарӣ, сессияҳои мавзӯӣ ва чорабиниҳои фарҳангӣ',
  })

  // Default event types
  const defaultEventTypes = [
    { id: 'registration', label_ru: 'Регистрация', label_en: 'Registration', label_tj: 'Бақайдгирӣ', color: '#10b981' },
    { id: 'ceremony', label_ru: 'Церемония', label_en: 'Ceremony', label_tj: 'Маросим', color: '#8b5cf6' },
    { id: 'plenary', label_ru: 'Пленарное заседание', label_en: 'Plenary Session', label_tj: 'Ҷаласаи пленарӣ', color: '#2d5a87' },
    { id: 'session', label_ru: 'Сессия', label_en: 'Session', label_tj: 'Сессия', color: '#f59e0b' },
    { id: 'break', label_ru: 'Перерыв', label_en: 'Break', label_tj: 'Танаффус', color: '#6b7280' },
  ]

  // Event types (editable)
  const [eventTypes, setEventTypes] = useState(defaultEventTypes)

  // Event type form for adding/editing
  const [eventTypeForm, setEventTypeForm] = useState({
    id: '',
    label_ru: '',
    label_en: '',
    label_tj: '',
    color: '#6b7280'
  })

  // Schedule data structure
  const [scheduleData, setScheduleData] = useState({
    ru: [],
    en: [],
    tj: []
  })

  // Default schedule template for initialization
  const defaultSchedule = {
    ru: [
      {
        day: 1,
        date: '25 мая 2026',
        title: 'День 1: Церемония открытия',
        shortTitle: 'Церемония открытия',
        isOpen: true,
        events: [
          { time: '08:30 – 10:00', title: 'Регистрация участников', description: 'Выдача бейджей и материалов конференции', location: 'Фойе главного зала', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Торжественное открытие', description: 'Приветственные речи глав делегаций', location: 'Главный зал', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
          { time: '12:00 – 13:30', title: 'Пленарное заседание высокого уровня', description: 'Доклады министров и представителей международных организаций', location: 'Главный зал', type: 'plenary' },
        ]
      },
      {
        day: 2,
        date: '26 мая 2026',
        title: 'День 2: Тематические сессии',
        shortTitle: 'Тематические сессии',
        isOpen: false,
        events: [
          { time: '09:00 – 10:30', title: 'Сессия: Управление водными ресурсами', description: 'Лучшие практики интегрированного управления водными ресурсами', location: 'Зал A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
        ]
      },
      {
        day: 3,
        date: '27 мая 2026',
        title: 'День 3: Интерактивные диалоги',
        shortTitle: 'Интерактивные диалоги',
        isOpen: false,
        events: []
      },
      {
        day: 4,
        date: '28 мая 2026',
        title: 'День 4: Церемония закрытия',
        shortTitle: 'Церемония закрытия',
        isOpen: false,
        events: []
      }
    ],
    en: [
      {
        day: 1,
        date: 'May 25, 2026',
        title: 'Day 1: Opening Ceremony',
        shortTitle: 'Opening Ceremony',
        isOpen: true,
        events: [
          { time: '08:30 – 10:00', title: 'Participant Registration', description: 'Badge and conference materials distribution', location: 'Main Hall Lobby', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Grand Opening', description: 'Welcome speeches by heads of delegations', location: 'Main Hall', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Coffee Break', location: 'Foyer', type: 'break' },
          { time: '12:00 – 13:30', title: 'High-Level Plenary Session', description: 'Reports by ministers and representatives of international organizations', location: 'Main Hall', type: 'plenary' },
        ]
      },
      {
        day: 2,
        date: 'May 26, 2026',
        title: 'Day 2: Thematic Sessions',
        shortTitle: 'Thematic Sessions',
        isOpen: false,
        events: [
          { time: '09:00 – 10:30', title: 'Session: Water Resource Management', description: 'Best practices in integrated water resource management', location: 'Hall A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Coffee Break', location: 'Foyer', type: 'break' },
        ]
      },
      {
        day: 3,
        date: 'May 27, 2026',
        title: 'Day 3: Interactive Dialogues',
        shortTitle: 'Interactive Dialogues',
        isOpen: false,
        events: []
      },
      {
        day: 4,
        date: 'May 28, 2026',
        title: 'Day 4: Closing Ceremony',
        shortTitle: 'Closing Ceremony',
        isOpen: false,
        events: []
      }
    ],
    tj: [
      {
        day: 1,
        date: '25 майи 2026',
        title: 'Рӯзи 1: Маросими кушоиш',
        shortTitle: 'Маросими кушоиш',
        isOpen: true,
        events: [
          { time: '08:30 – 10:00', title: 'Бақайдгирии иштироккунандагон', description: 'Додани беҷҳо ва маводҳои конфронс', location: 'Фойеи толори асосӣ', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Кушоиши тантанавӣ', description: 'Суханрониҳои хайрамақдамии сарони ҳайатҳо', location: 'Толори асосӣ', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Танаффуси қаҳва', location: 'Фойе', type: 'break' },
          { time: '12:00 – 13:30', title: 'Ҷаласаи пленарии сатҳи баланд', description: 'Гузоришҳои вазирон ва намояндагони ташкилотҳои байналмилалӣ', location: 'Толори асосӣ', type: 'plenary' },
          { time: '13:30 – 15:00', title: 'Нонхорӣ', location: 'Толори фуршетӣ', type: 'break' },
          { time: '15:00 – 17:00', title: 'Идомаи ҷаласаи пленарӣ', description: 'Муҳокимаҳои мавзӯӣ ва саволу ҷавоб', location: 'Толори асосӣ', type: 'plenary' }
        ]
      },
      {
        day: 2,
        date: '26 майи 2026',
        title: 'Рӯзи 2: Сессияҳои мавзӯӣ',
        shortTitle: 'Сессияҳои мавзӯӣ',
        isOpen: false,
        events: [
          { time: '09:00 – 10:30', title: 'Сессия: Идоракунии захираҳои обӣ', description: 'Беҳтарин таҷрибаҳо дар идоракунии ягонаи захираҳои обӣ', location: 'Толори A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Танаффуси қаҳва', location: 'Фойе', type: 'break' },
          { time: '11:00 – 12:30', title: 'Сессия: Тағйирёбии иқлим ва мутобиқшавӣ', description: 'Стратегияҳои минтақавӣ барои мубориза бо тағйирёбии иқлим', location: 'Толори B', type: 'session' },
          { time: '12:30 – 14:00', title: 'Нонхорӣ', location: 'Толори фуршетӣ', type: 'break' },
          { time: '14:00 – 15:30', title: 'Сессия: Ҳамкории фаромарзӣ', description: 'Таҷрибаи муваффақ дар ҳамкории байниминтақавӣ', location: 'Толори C', type: 'session' },
          { time: '15:30 – 17:00', title: 'Сессия: Навоварӣ ва технологияҳо', description: 'Технологияҳои нав барои рушди устувор', location: 'Толори D', type: 'session' }
        ]
      },
      {
        day: 3,
        date: '27 майи 2026',
        title: 'Рӯзи 3: Гуфтугӯҳои интерактивӣ',
        shortTitle: 'Гуфтугӯҳои интерактивӣ',
        isOpen: false,
        events: [
          { time: '09:00 – 11:00', title: 'Гуфтугӯи ҷонибаи зиёд', description: 'Гуфтугӯи кушод бо ҳамаи иштирокчиён', location: 'Толори асосӣ', type: 'session' },
          { time: '11:00 – 11:30', title: 'Танаффуси қаҳва', location: 'Фойе', type: 'break' },
          { time: '11:30 – 13:00', title: 'Пешниҳодҳои навоварона', description: 'Намоиши лоиҳаҳои навоварона ва ташаббусҳо', location: 'Толори намоишӣ', type: 'session' },
          { time: '13:00 – 14:30', title: 'Нонхорӣ', location: 'Толори фуршетӣ', type: 'break' },
          { time: '14:30 – 17:00', title: 'Чорабиниҳои шарикон', description: 'Воридоти махсус аз ҷониби ташкилотҳои шарик', location: 'Толорҳои гуногун', type: 'session' }
        ]
      },
      {
        day: 4,
        date: '28 майи 2026',
        title: 'Рӯзи 4: Маросими хотима',
        shortTitle: 'Маросими хотима',
        isOpen: false,
        events: [
          { time: '09:00 – 11:00', title: 'Омодасозии ҳуҷҷатҳои якунӣ', description: 'Муҳокима ва таҳияи қатъномаи якунӣ', location: 'Толори асосӣ', type: 'session' },
          { time: '11:00 – 11:30', title: 'Танаффуси қаҳва', location: 'Фойе', type: 'break' },
          { time: '11:30 – 13:00', title: 'Қабули ҳуҷҷатҳо', description: 'Қабули расмии қатъномаи якунӣ ва эъломия', location: 'Толори асосӣ', type: 'plenary' },
          { time: '13:00 – 14:00', title: 'Маросими хотима', description: 'Суханрониҳои якунӣ ва супоси иштироккунандагон', location: 'Толори асосӣ', type: 'ceremony' },
          { time: '14:00 – 16:00', title: 'Нонхорӣи тантанавӣ', description: 'Нонхорӣ бо иштироки ҳамаи намояндагон', location: 'Толори фуршетӣ', type: 'ceremony' }
        ]
      }
    ]
  }

  // Event form state
  const [eventForm, setEventForm] = useState({
    start_time: '',
    end_time: '',
    title_ru: '',
    title_en: '',
    title_tj: '',
    description_ru: '',
    description_en: '',
    description_tj: '',
    location_ru: '',
    location_en: '',
    location_tj: '',
    type: 'session'
  })

  // Helper to format time range
  const formatTimeRange = (start, end) => {
    if (!start && !end) return ''
    if (start && end) return `${start} – ${end}`
    return start || end
  }

  // Helper to parse time range
  const parseTimeRange = (timeStr) => {
    if (!timeStr) return { start: '', end: '' }
    const parts = timeStr.split(/\s*[–-]\s*/)
    return {
      start: parts[0]?.trim() || '',
      end: parts[1]?.trim() || ''
    }
  }

  useEffect(() => {
    loadScheduleData()
  }, [])

  const loadScheduleData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.schedule_data) {
        const parsed = JSON.parse(settingsMap.schedule_data)
        setScheduleData(parsed)
      } else {
        // Initialize with default schedule
        setScheduleData(defaultSchedule)
      }

      if (settingsMap.schedule_page_settings) {
        setPageSettings(JSON.parse(settingsMap.schedule_page_settings))
      }

      if (settingsMap.schedule_event_types) {
        setEventTypes(JSON.parse(settingsMap.schedule_event_types))
      }
    } catch (err) {
      console.error('Failed to load schedule:', err)
      setScheduleData(defaultSchedule)
    } finally {
      setLoading(false)
    }
  }

  const saveSchedule = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi([
        { key: 'schedule_data', value: JSON.stringify(scheduleData) },
        { key: 'schedule_page_settings', value: JSON.stringify(pageSettings) },
        { key: 'schedule_event_types', value: JSON.stringify(eventTypes) }
      ])
      setSaveStatus({ type: 'success', message: 'Расписание сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save schedule:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const getCurrentDayData = () => {
    return scheduleData[activeTab]?.find(d => d.day === activeDay) || { events: [] }
  }

  const updateDayField = (field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(day =>
        day.day === activeDay ? { ...day, [field]: value } : day
      )
    }))
  }

  const addEvent = () => {
    const timeStr = formatTimeRange(eventForm.start_time, eventForm.end_time)

    // Add to all languages
    setScheduleData(prev => {
      const updated = { ...prev }
      ;['ru', 'en', 'tj'].forEach(lang => {
        updated[lang] = updated[lang].map(day => {
          if (day.day === activeDay) {
            return {
              ...day,
              events: [...day.events, {
                time: timeStr,
                title: lang === 'ru' ? eventForm.title_ru : lang === 'en' ? eventForm.title_en : eventForm.title_tj,
                description: lang === 'ru' ? eventForm.description_ru : lang === 'en' ? eventForm.description_en : eventForm.description_tj,
                location: lang === 'ru' ? eventForm.location_ru : lang === 'en' ? eventForm.location_en : eventForm.location_tj,
                type: eventForm.type
              }]
            }
          }
          return day
        })
      })
      return updated
    })

    resetEventForm()
    setEditingEvent(null)
  }

  const updateEvent = (eventIndex) => {
    const timeStr = formatTimeRange(eventForm.start_time, eventForm.end_time)

    setScheduleData(prev => {
      const updated = { ...prev }
      ;['ru', 'en', 'tj'].forEach(lang => {
        updated[lang] = updated[lang].map(day => {
          if (day.day === activeDay) {
            const newEvents = [...day.events]
            newEvents[eventIndex] = {
              time: timeStr,
              title: lang === 'ru' ? eventForm.title_ru : lang === 'en' ? eventForm.title_en : eventForm.title_tj,
              description: lang === 'ru' ? eventForm.description_ru : lang === 'en' ? eventForm.description_en : eventForm.description_tj,
              location: lang === 'ru' ? eventForm.location_ru : lang === 'en' ? eventForm.location_en : eventForm.location_tj,
              type: eventForm.type
            }
            return { ...day, events: newEvents }
          }
          return day
        })
      })
      return updated
    })

    resetEventForm()
    setEditingEvent(null)
  }

  const deleteEvent = (eventIndex) => {
    if (!window.confirm('Удалить это мероприятие?')) return

    setScheduleData(prev => {
      const updated = { ...prev }
      ;['ru', 'en', 'tj'].forEach(lang => {
        updated[lang] = updated[lang].map(day => {
          if (day.day === activeDay) {
            const newEvents = [...day.events]
            newEvents.splice(eventIndex, 1)
            return { ...day, events: newEvents }
          }
          return day
        })
      })
      return updated
    })
  }

  const startEditEvent = (eventIndex) => {
    const eventRu = scheduleData.ru.find(d => d.day === activeDay)?.events[eventIndex]
    const eventEn = scheduleData.en.find(d => d.day === activeDay)?.events[eventIndex]
    const eventTj = scheduleData.tj.find(d => d.day === activeDay)?.events[eventIndex]

    const parsedTime = parseTimeRange(eventRu?.time || '')

    setEventForm({
      start_time: parsedTime.start,
      end_time: parsedTime.end,
      title_ru: eventRu?.title || '',
      title_en: eventEn?.title || '',
      title_tj: eventTj?.title || '',
      description_ru: eventRu?.description || '',
      description_en: eventEn?.description || '',
      description_tj: eventTj?.description || '',
      location_ru: eventRu?.location || '',
      location_en: eventEn?.location || '',
      location_tj: eventTj?.location || '',
      type: eventRu?.type || 'session'
    })
    setEditingEvent(eventIndex)
  }

  const resetEventForm = () => {
    setEventForm({
      start_time: '',
      end_time: '',
      title_ru: '',
      title_en: '',
      title_tj: '',
      description_ru: '',
      description_en: '',
      description_tj: '',
      location_ru: '',
      location_en: '',
      location_tj: '',
      type: 'session'
    })
  }

  const moveEvent = (eventIndex, direction) => {
    const newIndex = eventIndex + direction
    if (newIndex < 0 || newIndex >= getCurrentDayData().events.length) return

    setScheduleData(prev => {
      const updated = { ...prev }
      ;['ru', 'en', 'tj'].forEach(lang => {
        updated[lang] = updated[lang].map(day => {
          if (day.day === activeDay) {
            const newEvents = [...day.events]
            const temp = newEvents[eventIndex]
            newEvents[eventIndex] = newEvents[newIndex]
            newEvents[newIndex] = temp
            return { ...day, events: newEvents }
          }
          return day
        })
      })
      return updated
    })
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    dragNodeRef.current = e.target
    e.target.classList.add('dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    setScheduleData(prev => {
      const updated = { ...prev }
      ;['ru', 'en', 'tj'].forEach(lang => {
        updated[lang] = updated[lang].map(day => {
          if (day.day === activeDay) {
            const newEvents = [...day.events]
            const [draggedItem] = newEvents.splice(draggedIndex, 1)
            newEvents.splice(dropIndex, 0, draggedItem)
            return { ...day, events: newEvents }
          }
          return day
        })
      })
      return updated
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const getEventTypeColor = (type) => {
    return eventTypes.find(t => t.id === type)?.color || '#6b7280'
  }

  const getEventTypeLabel = (type, lang = 'ru') => {
    const eventType = eventTypes.find(t => t.id === type)
    return eventType?.[`label_${lang}`] || eventType?.label_ru || type
  }

  // Transliterate Russian/Tajik to Latin for ID generation
  const transliterate = (text) => {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
      'я': 'ya', 'ғ': 'g', 'ӣ': 'i', 'қ': 'q', 'ӯ': 'u', 'ҳ': 'h', 'ҷ': 'j'
    }
    return text.toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }

  // Generate unique ID from label
  const generateTypeId = (label) => {
    const baseId = transliterate(label)
    if (!baseId) return ''
    // Check if ID already exists
    let id = baseId
    let counter = 1
    while (eventTypes.some(t => t.id === id)) {
      id = `${baseId}_${counter}`
      counter++
    }
    return id
  }

  // Event type management functions
  const resetEventTypeForm = () => {
    setEventTypeForm({
      id: '',
      label_ru: '',
      label_en: '',
      label_tj: '',
      color: '#6b7280'
    })
  }

  const addEventType = () => {
    if (!eventTypeForm.label_ru) return

    // Auto-generate ID from Russian label
    const newId = generateTypeId(eventTypeForm.label_ru)
    if (!newId) return

    setEventTypes(prev => [...prev, { ...eventTypeForm, id: newId }])
    resetEventTypeForm()
  }

  const deleteEventType = (typeId) => {
    if (!window.confirm('Удалить этот тип мероприятия?')) return
    setEventTypes(prev => prev.filter(t => t.id !== typeId))
  }

  if (loading) {
    return (
      <div className="schedule-manager">
        <div className="section-loading">Загрузка расписания...</div>
      </div>
    )
  }

  return (
    <div className={`schedule-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Программа</h1>
          <p>Расписание конференции</p>
        </div>
        <div className="page-manager-actions">
          <button className="page-settings-btn secondary" onClick={() => setShowEventTypesModal(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
            Типы мероприятий
          </button>
          <button className="page-settings-btn" onClick={() => setShowSettingsModal(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            Настройки страницы
          </button>
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

      <div className="schedule-layout">
        {/* Days Navigation */}
        <div className="days-nav">
          {[1, 2, 3, 4].map(day => (
            <button
              key={day}
              className={`day-nav-item ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="day-nav-number">День {day}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="schedule-content">
          {/* Day Settings with Language Tabs Combined */}
          <div className="day-settings-unified">
            <div className="day-settings-header">
              <h3>Настройки дня {activeDay}</h3>
              <div className="lang-tab-buttons-inline">
                <button
                  className={`lang-tab-btn-sm ${activeTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ru')}
                >
                  <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-tab-flag-sm" />
                  RU
                </button>
                <button
                  className={`lang-tab-btn-sm ${activeTab === 'en' ? 'active' : ''}`}
                  onClick={() => setActiveTab('en')}
                >
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-tab-flag-sm" />
                  EN
                </button>
                <button
                  className={`lang-tab-btn-sm ${activeTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tj')}
                >
                  <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-tab-flag-sm" />
                  TJ
                </button>
              </div>
            </div>
            <div className="day-settings-fields">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    {activeTab === 'ru' ? 'Дата' : activeTab === 'en' ? 'Date' : 'Сана'}
                  </label>
                  <input
                    type="text"
                    value={getCurrentDayData().date || ''}
                    onChange={(e) => updateDayField('date', e.target.value)}
                    placeholder={activeTab === 'ru' ? '25 мая 2026' : activeTab === 'en' ? 'May 25, 2026' : '25 майи 2026'}
                  />
                </div>
                <div className="form-group">
                  <label>
                    {activeTab === 'ru' ? 'Краткое название' : activeTab === 'en' ? 'Short title' : 'Номи кӯтоҳ'}
                  </label>
                  <input
                    type="text"
                    value={getCurrentDayData().shortTitle || ''}
                    onChange={(e) => updateDayField('shortTitle', e.target.value)}
                    placeholder={activeTab === 'ru' ? 'Церемония открытия' : activeTab === 'en' ? 'Opening Ceremony' : 'Маросими кушод'}
                  />
                </div>
                <div className="form-group">
                  <label>
                    {activeTab === 'ru' ? 'Полное название' : activeTab === 'en' ? 'Full title' : 'Номи пурра'}
                  </label>
                  <input
                    type="text"
                    value={getCurrentDayData().title || ''}
                    onChange={(e) => updateDayField('title', e.target.value)}
                    placeholder={activeTab === 'ru' ? 'День 1: Церемония открытия' : activeTab === 'en' ? 'Day 1: Opening Ceremony' : 'Рӯзи 1: Маросими кушод'}
                  />
                </div>
                <button className="day-settings-save-btn" onClick={saveSchedule}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Сохранить
                </button>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="events-section">
            <div className="events-header">
              <h3>Мероприятия дня {activeDay}</h3>
              <button
                className="btn-add"
                onClick={() => {
                  resetEventForm()
                  setEditingEvent('new')
                }}
              >
                + Добавить мероприятие
              </button>
            </div>


            {/* Events List */}
            <div className="events-list">
              {getCurrentDayData().events?.length === 0 ? (
                <div className="events-empty">
                  <p>Нет мероприятий для этого дня</p>
                  <button className="btn-add" onClick={() => { resetEventForm(); setEditingEvent('new'); }}>
                    + Добавить первое мероприятие
                  </button>
                </div>
              ) : (
                getCurrentDayData().events?.map((event, index) => (
                  <div
                    key={index}
                    className={`event-item ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="event-item-drag-handle">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <div className="event-item-order">
                      <span>{index + 1}</span>
                    </div>
                    <div className="event-item-time">{event.time}</div>
                    <div className="event-item-content">
                      <div className="event-item-title">{event.title}</div>
                      {event.description && (
                        <div className="event-item-description">{event.description}</div>
                      )}
                      {event.location && (
                        <div className="event-item-location">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div
                      className="event-item-type"
                      style={{ background: getEventTypeColor(event.type) }}
                    >
                      {getEventTypeLabel(event.type, activeTab)}
                    </div>
                    <div className="event-item-actions">
                      <button className="btn-edit" onClick={() => startEditEvent(index)}>
                        Изменить
                      </button>
                      <button className="btn-delete" onClick={() => deleteEvent(index)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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
                <button
                  className={`lang-tab-btn ${settingsTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('ru')}
                >
                  <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-tab-flag" />
                  <span>Русский</span>
                </button>
                <button
                  className={`lang-tab-btn ${settingsTab === 'en' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('en')}
                >
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-tab-flag" />
                  <span>English</span>
                </button>
                <button
                  className={`lang-tab-btn ${settingsTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('tj')}
                >
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
                  rows="3"
                  value={pageSettings[`subtitle_${settingsTab}`]}
                  onChange={(e) => setPageSettings({ ...pageSettings, [`subtitle_${settingsTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => setShowSettingsModal(false)}>
                Отмена
              </button>
              <button className="btn-save" onClick={() => { saveSchedule(); setShowSettingsModal(false); }}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {editingEvent !== null && (
        <div className="settings-modal-overlay" onClick={() => { resetEventForm(); setEditingEvent(null); }}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingEvent === 'new' ? 'Новое мероприятие' : 'Редактирование мероприятия'}</h2>
              <button className="settings-modal-close" onClick={() => { resetEventForm(); setEditingEvent(null); }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="modal-text-tabs">
                <button
                  type="button"
                  className={`modal-text-tab ${eventEditTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setEventEditTab('ru')}
                >
                  Русский
                </button>
                <button
                  type="button"
                  className={`modal-text-tab ${eventEditTab === 'en' ? 'active' : ''}`}
                  onClick={() => setEventEditTab('en')}
                >
                  Английский
                </button>
                <button
                  type="button"
                  className={`modal-text-tab ${eventEditTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setEventEditTab('tj')}
                >
                  Таджикский
                </button>
              </div>

              <div className="form-group">
                <label>
                  Название ({eventEditTab === 'ru' ? 'Русский' : eventEditTab === 'en' ? 'Английский' : 'Таджикский'})
                </label>
                <input
                  type="text"
                  value={eventForm[`title_${eventEditTab}`]}
                  onChange={(e) => setEventForm({ ...eventForm, [`title_${eventEditTab}`]: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  Описание ({eventEditTab === 'ru' ? 'Русский' : eventEditTab === 'en' ? 'Английский' : 'Таджикский'})
                </label>
                <textarea
                  rows="3"
                  value={eventForm[`description_${eventEditTab}`]}
                  onChange={(e) => setEventForm({ ...eventForm, [`description_${eventEditTab}`]: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  Место ({eventEditTab === 'ru' ? 'Русский' : eventEditTab === 'en' ? 'Английский' : 'Таджикский'})
                </label>
                <input
                  type="text"
                  value={eventForm[`location_${eventEditTab}`]}
                  onChange={(e) => setEventForm({ ...eventForm, [`location_${eventEditTab}`]: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  {eventEditTab === 'ru' ? 'Время' : eventEditTab === 'en' ? 'Time' : 'Вақт'}
                </label>
                <div className="time-picker-row">
                  <div className="time-picker-input">
                    <span className="time-picker-label">
                      {eventEditTab === 'ru' ? 'Начало' : eventEditTab === 'en' ? 'Start' : 'Оғоз'}
                    </span>
                    <input
                      type="time"
                      value={eventForm.start_time}
                      onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                    />
                  </div>
                  <span className="time-picker-separator">—</span>
                  <div className="time-picker-input">
                    <span className="time-picker-label">
                      {eventEditTab === 'ru' ? 'Конец' : eventEditTab === 'en' ? 'End' : 'Анҷом'}
                    </span>
                    <input
                      type="time"
                      value={eventForm.end_time}
                      onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  {eventEditTab === 'ru' ? 'Тип мероприятия' : eventEditTab === 'en' ? 'Event Type' : 'Навъи чорабинӣ'}
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                >
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>{type[`label_${eventEditTab}`]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => { resetEventForm(); setEditingEvent(null); }}>
                Отмена
              </button>
              <button
                className="btn-save"
                onClick={() => { editingEvent === 'new' ? addEvent() : updateEvent(editingEvent); }}
              >
                {editingEvent === 'new' ? 'Добавить' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Types Modal */}
      {showEventTypesModal && (
        <div className="settings-modal-overlay" onClick={() => { setShowEventTypesModal(false); resetEventTypeForm(); }}>
          <div className="settings-modal event-types-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>Типы мероприятий</h2>
              <button className="settings-modal-close" onClick={() => { setShowEventTypesModal(false); resetEventTypeForm(); }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="settings-modal-body">
              {/* Language tabs for event types */}
              <div className="modal-text-tabs">
                <button
                  type="button"
                  className={`modal-text-tab ${eventTypesTab === 'ru' ? 'active' : ''}`}
                  onClick={() => setEventTypesTab('ru')}
                >
                  Русский
                </button>
                <button
                  type="button"
                  className={`modal-text-tab ${eventTypesTab === 'en' ? 'active' : ''}`}
                  onClick={() => setEventTypesTab('en')}
                >
                  Английский
                </button>
                <button
                  type="button"
                  className={`modal-text-tab ${eventTypesTab === 'tj' ? 'active' : ''}`}
                  onClick={() => setEventTypesTab('tj')}
                >
                  Таджикский
                </button>
              </div>

              {/* Event Types List - Inline Editable */}
              <div className="event-types-inline-list">
                {eventTypes.map((type, index) => (
                  <div key={type.id} className="event-type-inline-item">
                    <div className="event-type-inline-row">
                      <input
                        type="color"
                        className="event-type-inline-color"
                        value={type.color}
                        onChange={(e) => {
                          const updated = [...eventTypes]
                          updated[index] = { ...type, color: e.target.value }
                          setEventTypes(updated)
                        }}
                      />
                      <input
                        type="text"
                        className="event-type-inline-input"
                        value={type[`label_${eventTypesTab}`]}
                        onChange={(e) => {
                          const updated = [...eventTypes]
                          updated[index] = { ...type, [`label_${eventTypesTab}`]: e.target.value }
                          setEventTypes(updated)
                        }}
                        placeholder={eventTypesTab === 'ru' ? 'Название' : eventTypesTab === 'en' ? 'Name' : 'Ном'}
                      />
                      <button className="btn-delete-small" onClick={() => deleteEventType(type.id)}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Event Type - Inline */}
              <div className="event-type-add-inline">
                <div className="event-type-inline-row">
                  <input
                    type="color"
                    className="event-type-inline-color"
                    value={eventTypeForm.color}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, color: e.target.value })}
                  />
                  <input
                    type="text"
                    className="event-type-inline-input"
                    value={eventTypeForm[`label_${eventTypesTab}`]}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, [`label_${eventTypesTab}`]: e.target.value })}
                    placeholder={eventTypesTab === 'ru' ? 'Новый тип...' : eventTypesTab === 'en' ? 'New type...' : 'Навъи нав...'}
                  />
                  <button
                    className="btn-add-inline"
                    onClick={() => addEventType()}
                    disabled={!eventTypeForm.label_ru}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                </div>
                <p className="event-type-add-hint">
                  {eventTypesTab === 'ru'
                    ? 'Введите название на русском для добавления'
                    : eventTypesTab === 'en'
                    ? 'Enter Russian name to add a new type'
                    : 'Номи русиро ворид кунед'}
                </p>
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={() => { setShowEventTypesModal(false); resetEventTypeForm(); }}>
                Закрыть
              </button>
              <button className="btn-save" onClick={() => { saveSchedule(); setShowEventTypesModal(false); resetEventTypeForm(); }}>
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
