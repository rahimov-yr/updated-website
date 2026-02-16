import { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import {
  Save, Layout, FileText, Image as ImageIcon, Grid3x3,
  Clock, List, Lightbulb, Megaphone, GripVertical,
  ChevronDown, ChevronUp, Copy, Trash2, Plus, Upload,
  Calendar, MapPin, Users, Info, Settings, X
} from 'lucide-react'
import { useSettings } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import './EventsManager.css'

const API_URL = import.meta.env.VITE_API_URL || ''

// Separate Text Editor Component
function TextEditor({ block, langTab, updateBlock }) {
  const editorRef = useRef(null)
  const editorId = `content-${block.id}-${langTab}`

  useEffect(() => {
    if (editorRef.current) {
      const currentContent = block[`content_${langTab}`] || ''
      if (editorRef.current.innerHTML !== currentContent) {
        editorRef.current.innerHTML = currentContent
      }
    }
  }, [block.id, langTab])

  const applyFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, value)
    }
  }

  const handleContentEdit = (e) => {
    const html = e.currentTarget.innerHTML
    updateBlock(block.id, { [`content_${langTab}`]: html })
  }

  const handleKeyDown = (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
    // Handle Enter key - insert a div for new line (default browser behavior creates divs)
    if (e.key === 'Enter' && !e.shiftKey) {
      // Let the browser handle Enter naturally, it will create a new div
      // We just need to make sure line-height is set properly in CSS
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    // Get plain text from clipboard to strip all formatting
    let text = e.clipboardData.getData('text/plain')
    // Remove excessive whitespace and normalize line breaks
    text = text
      .replace(/\r\n/g, '\n')           // Normalize Windows line breaks
      .replace(/\n{3,}/g, '\n\n')       // Reduce 3+ line breaks to 2
      .replace(/[ \t]+/g, ' ')          // Collapse multiple spaces/tabs to single space
      .trim()
    // Insert as plain text - this removes all font styles from pasted content
    document.execCommand('insertText', false, text)
  }

  const handleClick = (e) => {
    // Check if clicked element is a link
    const clickedLink = e.target.closest('a')
    if (clickedLink) {
      e.preventDefault()
      editLink(clickedLink)
    }
  }

  const editLink = (linkElement) => {
    const currentUrl = linkElement.getAttribute('href') || ''
    const currentTarget = linkElement.getAttribute('target')
    const currentText = linkElement.textContent

    const newUrl = prompt('Редактировать URL ссылки:', currentUrl)
    if (newUrl === null) return // User cancelled

    const openInNewTab = window.confirm(
      `Открыть ссылку в новой вкладке?\n\nТекущее значение: ${currentTarget === '_blank' ? 'Да' : 'Нет'}`
    )

    // Update the link
    linkElement.setAttribute('href', newUrl)
    if (openInNewTab) {
      linkElement.setAttribute('target', '_blank')
      linkElement.setAttribute('rel', 'noopener noreferrer')
    } else {
      linkElement.removeAttribute('target')
      linkElement.removeAttribute('rel')
    }

    // Trigger content update
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      updateBlock(block.id, { [`content_${langTab}`]: html })
    }
  }

  const insertLink = () => {
    const url = prompt('Введите URL ссылки:')
    if (!url) return

    const openInNewTab = window.confirm('Открыть ссылку в новой вкладке?')

    const selection = window.getSelection()
    const selectedText = selection.toString()

    if (selectedText) {
      // Wrap selected text
      const linkHtml = openInNewTab
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`
        : `<a href="${url}">${selectedText}</a>`
      document.execCommand('insertHTML', false, linkHtml)
    } else {
      // Insert link with URL as text
      const linkHtml = openInNewTab
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        : `<a href="${url}">${url}</a>`
      document.execCommand('insertHTML', false, linkHtml)
    }
  }

  return (
    <>
      {/* Formatting Toolbar */}
      <div className="html-toolbar">
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'p')}
          title="Параграф"
          className="toolbar-btn"
        >
          <FileText size={16} /> P
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          title="Жирный (Ctrl+B)"
          className="toolbar-btn"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          title="Курсив (Ctrl+I)"
          className="toolbar-btn"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          title="Подчеркнутый (Ctrl+U)"
          className="toolbar-btn"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('strikeThrough')}
          title="Зачеркнутый"
          className="toolbar-btn"
        >
          <s>S</s>
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h2')}
          title="Заголовок H2"
          className="toolbar-btn"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h3')}
          title="Заголовок H3"
          className="toolbar-btn"
        >
          H3
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button
          type="button"
          onClick={() => applyFormat('justifyLeft')}
          title="По левому краю"
          className="toolbar-btn"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyCenter')}
          title="По центру"
          className="toolbar-btn"
        >
          ≣
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyRight')}
          title="По правому краю"
          className="toolbar-btn"
        >
          ≡
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          title="Маркированный список"
          className="toolbar-btn"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          title="Нумерованный список"
          className="toolbar-btn"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => applyFormat('indent')}
          title="Увеличить отступ"
          className="toolbar-btn"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => applyFormat('outdent')}
          title="Уменьшить отступ"
          className="toolbar-btn"
        >
          ←
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button
          type="button"
          onClick={() => insertLink()}
          title="Ссылка"
          className="toolbar-btn"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertHTML', '<br>')}
          title="Перенос строки"
          className="toolbar-btn"
        >
          BR
        </button>
        <button
          type="button"
          onClick={() => applyFormat('removeFormat')}
          title="Удалить форматирование"
          className="toolbar-btn"
        >
          Clear
        </button>
      </div>

      {/* WYSIWYG Editor */}
      <div
        id={editorId}
        ref={editorRef}
        className="wysiwyg-editor"
        contentEditable={true}
        onInput={handleContentEdit}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
        style={{
          minHeight: '300px',
          padding: '1rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#fff',
          lineHeight: '1.5',
          fontSize: '1rem',
          resize: 'both',
          overflow: 'auto'
        }}
      />
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
        Используйте кнопки форматирования выше. Tab для отступа, Ctrl+B/I/U для форматирования. Нажмите на ссылку для редактирования
      </div>
    </>
  )
}

// Available pages grouped by section
const PAGE_GROUPS = [
  {
    id: 'water_decade',
    label: 'Водное десятилетие',
    pages: [
      { id: 'water_decade_details', name: 'Подробнее о десятилетии' },
    ]
  },
  {
    id: 'events',
    label: 'Мероприятия',
    pages: [
      { id: 'parallel_events', name: 'Параллельные мероприятия' },
      { id: 'cultural_events', name: 'Культурные мероприятия' },
      { id: 'events_khisor', name: 'Хисор' },
      { id: 'events_rogun', name: 'Рогун' },
      { id: 'events_dushanbe', name: 'Душанбе' },
    ]
  },
  {
    id: 'conference',
    label: 'Конференции',
    pages: [
      { id: 'conference_intro', name: 'Введение' },
      { id: 'conference_goals', name: 'Цели' },
      { id: 'conference_date_venue', name: 'Дата и место проведения' },
      { id: 'conference_participation', name: 'Участие' },
    ]
  },
  {
    id: 'program',
    label: 'Программа',
    pages: [
      { id: 'program_structure', name: 'Структура' },
      { id: 'program_plenary', name: 'Пленарное' },
      { id: 'program_events', name: 'Мероприятия' },
      { id: 'program_forums', name: 'Форумы' },
    ]
  },
  {
    id: 'excursions',
    label: 'Экскурсии',
    pages: [
      { id: 'excursions_main', name: 'Экскурсии' },
    ]
  },
  {
    id: 'exhibition',
    label: 'Выставка',
    pages: [
      { id: 'exhibition_main', name: 'Выставка' },
    ]
  },
  {
    id: 'logistics',
    label: 'Логистика',
    pages: [
      { id: 'logistics_practical', name: 'Практическая информация' },
      { id: 'logistics_visa', name: 'Виза в Таджикистан' },
      { id: 'logistics_press', name: 'Аккредитация прессы' },
      { id: 'logistics_flights', name: 'Авиарейсы' },
      { id: 'logistics_accommodation', name: 'Размещение в гостинице' },
      { id: 'logistics_weather', name: 'Погода' },
    ]
  }
]

// Flatten all pages for easier access
const ALL_PAGES = PAGE_GROUPS.flatMap(group => group.pages)

// Block types with icons and descriptions
const BLOCK_TYPES = [
  { type: 'hero', name: 'Hero', icon: Layout, desc: 'Большой заголовок с фоном' },
  { type: 'text', name: 'Текст', icon: FileText, desc: 'Текстовый блок с HTML' },
  { type: 'image', name: 'Изображение', icon: ImageIcon, desc: 'Одно изображение' },
  { type: 'pdf', name: 'PDF', icon: Upload, desc: 'Загрузить PDF файл' },
  { type: 'info_cards', name: 'Инфо-карточки', icon: Grid3x3, desc: 'Карточки с информацией' },
  { type: 'schedule', name: 'Расписание', icon: Clock, desc: 'График мероприятий' },
  { type: 'list', name: 'Список', icon: List, desc: 'Маркированный список' },
  { type: 'facts', name: 'Факты', icon: Lightbulb, desc: 'Интересные факты' },
  { type: 'cta', name: 'CTA', icon: Megaphone, desc: 'Призыв к действию' }
]

// Icon map for info cards
const INFO_CARD_ICONS = {
  calendar: Calendar,
  map: MapPin,
  users: Users,
  info: Info
}

// Get initial page based on group filter
const getInitialPageForGroup = (groupId) => {
  if (!groupId) return ALL_PAGES[0].id
  const group = PAGE_GROUPS.find(g => g.id === groupId)
  return group?.pages[0]?.id || ALL_PAGES[0].id
}

// Default page header titles
const PAGE_HEADER_DEFAULTS = {
  // Water Decade pages
  water_decade_details: {
    title_ru: 'Подробнее о водном десятилетии', title_en: 'Water Decade Details', title_tj: 'Тафсилоти даҳсолаи обӣ',
    subtitle_ru: 'Международное десятилетие действий «Вода для устойчивого развития» 2018-2028', subtitle_en: 'International Decade for Action "Water for Sustainable Development" 2018-2028', subtitle_tj: 'Даҳсолаи байналмилалии амалиёт «Об барои рушди устувор» 2018-2028'
  },
  // Conference pages
  conference_intro: {
    title_ru: 'Введение', title_en: 'Introduction', title_tj: 'Муқаддима',
    subtitle_ru: 'О конференции', subtitle_en: 'About the conference', subtitle_tj: 'Дар бораи конфронс'
  },
  conference_goals: {
    title_ru: 'Цели', title_en: 'Goals', title_tj: 'Ҳадафҳо',
    subtitle_ru: 'Цели и задачи конференции', subtitle_en: 'Conference goals and objectives', subtitle_tj: 'Ҳадафҳо ва вазифаҳои конфронс'
  },
  conference_date_venue: {
    title_ru: 'Дата и место проведения', title_en: 'Date and Venue', title_tj: 'Сана ва макон',
    subtitle_ru: 'Информация о времени и месте проведения', subtitle_en: 'Information about time and location', subtitle_tj: 'Маълумот дар бораи вақт ва макон'
  },
  conference_participation: {
    title_ru: 'Участие', title_en: 'Participation', title_tj: 'Иштирок',
    subtitle_ru: 'Как принять участие в конференции', subtitle_en: 'How to participate in the conference', subtitle_tj: 'Чӣ тавр дар конфронс иштирок кардан мумкин аст'
  },
  // Program pages
  program_structure: {
    title_ru: 'Структура программы', title_en: 'Program Structure', title_tj: 'Сохтори барнома',
    subtitle_ru: 'Обзор основных форматов конференции', subtitle_en: 'Overview of main conference formats', subtitle_tj: 'Шарҳи форматҳои асосии конфронс'
  },
  program_plenary: {
    title_ru: 'Пленарное заседание', title_en: 'Plenary Session', title_tj: 'Ҷаласаи пленарӣ',
    subtitle_ru: 'Основные темы и вопросы конференции', subtitle_en: 'Main conference topics and issues', subtitle_tj: 'Мавзӯъҳо ва масъалаҳои асосии конфронс'
  },
  program_events: {
    title_ru: 'Мероприятия в рамках конференции', title_en: 'Conference Events', title_tj: 'Чорабиниҳо дар доираи конфронс',
    subtitle_ru: 'Тематические сессии и панельные дискуссии', subtitle_en: 'Thematic sessions and panel discussions', subtitle_tj: 'Сессияҳои мавзӯъӣ ва муҳокимаҳои панелӣ'
  },
  program_forums: {
    title_ru: 'Форумы', title_en: 'Forums', title_tj: 'Форумҳо',
    subtitle_ru: 'Тематические форумы конференции', subtitle_en: 'Thematic conference forums', subtitle_tj: 'Форумҳои мавзӯии конфронс'
  },
  // Events pages
  parallel_events: {
    title_ru: 'Параллельные мероприятия', title_en: 'Parallel Events', title_tj: 'Чорабиниҳои параллелӣ',
    subtitle_ru: 'Сопутствующие мероприятия конференции', subtitle_en: 'Conference side events', subtitle_tj: 'Чорабиниҳои ҳамроҳи конфронс'
  },
  cultural_events: {
    title_ru: 'Культурные мероприятия', title_en: 'Cultural Events', title_tj: 'Чорабиниҳои фарҳангӣ',
    subtitle_ru: 'Культурная программа конференции', subtitle_en: 'Conference cultural program', subtitle_tj: 'Барномаи фарҳангии конфронс'
  },
  events_khisor: {
    title_ru: 'Хисор', title_en: 'Hisor', title_tj: 'Ҳисор',
    subtitle_ru: 'Экскурсия в Хисор', subtitle_en: 'Excursion to Hisor', subtitle_tj: 'Сайр ба Ҳисор'
  },
  events_rogun: {
    title_ru: 'Рогун', title_en: 'Rogun', title_tj: 'Роғун',
    subtitle_ru: 'Экскурсия на Рогунскую ГЭС', subtitle_en: 'Excursion to Rogun HPP', subtitle_tj: 'Сайр ба НОБ Роғун'
  },
  events_dushanbe: {
    title_ru: 'Душанбе', title_en: 'Dushanbe', title_tj: 'Душанбе',
    subtitle_ru: 'Экскурсия по Душанбе', subtitle_en: 'Dushanbe city tour', subtitle_tj: 'Сайр дар Душанбе'
  },
  // Excursions
  excursions_main: {
    title_ru: 'Экскурсии', title_en: 'Excursions', title_tj: 'Экскурсияҳо',
    subtitle_ru: 'Культурная программа для участников', subtitle_en: 'Cultural program for participants', subtitle_tj: 'Барномаи фарҳангӣ барои иштирокчиён'
  },
  // Exhibition
  exhibition_main: {
    title_ru: 'Выставка', title_en: 'Exhibition', title_tj: 'Намоишгоҳ',
    subtitle_ru: 'Международная выставка водных технологий', subtitle_en: 'International Water Technology Exhibition', subtitle_tj: 'Намоишгоҳи байналмилалии технологияҳои обӣ'
  },
  // Logistics pages
  logistics_practical: {
    title_ru: 'Практическая информация', title_en: 'Practical Information', title_tj: 'Маълумоти амалӣ',
    subtitle_ru: 'Полезная информация для участников', subtitle_en: 'Useful information for participants', subtitle_tj: 'Маълумоти муфид барои иштирокчиён'
  },
  logistics_visa: {
    title_ru: 'Виза в Таджикистан', title_en: 'Visa to Tajikistan', title_tj: 'Раводид ба Тоҷикистон',
    subtitle_ru: 'Информация о визовых требованиях', subtitle_en: 'Visa requirements information', subtitle_tj: 'Маълумот дар бораи талаботи раводид'
  },
  logistics_press: {
    title_ru: 'Аккредитация прессы', title_en: 'Press Accreditation', title_tj: 'Аккредитатсияи матбуот',
    subtitle_ru: 'Информация для представителей СМИ', subtitle_en: 'Information for media representatives', subtitle_tj: 'Маълумот барои намояндагони ВАО'
  },
  logistics_flights: {
    title_ru: 'Авиарейсы', title_en: 'Flights', title_tj: 'Парвозҳо',
    subtitle_ru: 'Информация об авиасообщении', subtitle_en: 'Flight information', subtitle_tj: 'Маълумот дар бораи парвозҳо'
  },
  logistics_accommodation: {
    title_ru: 'Размещение в гостинице', title_en: 'Hotel Accommodation', title_tj: 'Ҷойгиршавӣ дар меҳмонхона',
    subtitle_ru: 'Информация о гостиницах', subtitle_en: 'Hotel information', subtitle_tj: 'Маълумот дар бораи меҳмонхонаҳо'
  },
  logistics_weather: {
    title_ru: 'Погода', title_en: 'Weather', title_tj: 'Обу ҳаво',
    subtitle_ru: 'Погодные условия в Душанбе', subtitle_en: 'Weather conditions in Dushanbe', subtitle_tj: 'Шароити обу ҳаво дар Душанбе'
  }
}

export default function EventsManager({ embedded = false, initialPage = null }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [selectedPage, setSelectedPage] = useState(getInitialPageForGroup(initialPage))
  const [langTab, setLangTab] = useState('ru')
  const [pageBlocks, setPageBlocks] = useState([])
  const [expandedBlock, setExpandedBlock] = useState(null)
  const [headerTitles, setHeaderTitles] = useState({
    title_ru: '', title_en: '', title_tj: '',
    subtitle_ru: '', subtitle_en: '', subtitle_tj: ''
  })
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [bannerSettings, setBannerSettings] = useState({
    showBanner: true,
    bannerTitle_ru: '', bannerTitle_en: '', bannerTitle_tj: '',
    bannerSubtitle_ru: '', bannerSubtitle_en: '', bannerSubtitle_tj: ''
  })

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  useEffect(() => {
    loadPageData()
  }, [selectedPage])

  const loadPageData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      // Backend returns setting_key and setting_value, not key and value
      const pageData = settings.find(s => s.setting_key === selectedPage)
      const defaults = PAGE_HEADER_DEFAULTS[selectedPage] || {}
      if (pageData && pageData.setting_value) {
        const parsed = JSON.parse(pageData.setting_value)
        setPageBlocks(parsed.blocks || [])
        setBannerSettings({
          showBanner: parsed.showBanner !== undefined ? parsed.showBanner : true,
          bannerTitle_ru: parsed.bannerTitle_ru ?? defaults.title_ru ?? '',
          bannerTitle_en: parsed.bannerTitle_en ?? defaults.title_en ?? '',
          bannerTitle_tj: parsed.bannerTitle_tj ?? defaults.title_tj ?? '',
          bannerSubtitle_ru: parsed.bannerSubtitle_ru ?? '',
          bannerSubtitle_en: parsed.bannerSubtitle_en ?? '',
          bannerSubtitle_tj: parsed.bannerSubtitle_tj ?? '',
        })
      } else {
        setPageBlocks([])
        setBannerSettings({
          showBanner: true,
          bannerTitle_ru: defaults.title_ru || '',
          bannerTitle_en: defaults.title_en || '',
          bannerTitle_tj: defaults.title_tj || '',
          bannerSubtitle_ru: '',
          bannerSubtitle_en: '',
          bannerSubtitle_tj: '',
        })
      }

      // Load header titles for this page
      const loadedTitles = {
        title_ru: settings.find(s => s.setting_key === `${selectedPage}_title_ru`)?.setting_value || defaults.title_ru || '',
        title_en: settings.find(s => s.setting_key === `${selectedPage}_title_en`)?.setting_value || defaults.title_en || '',
        title_tj: settings.find(s => s.setting_key === `${selectedPage}_title_tj`)?.setting_value || defaults.title_tj || '',
        subtitle_ru: settings.find(s => s.setting_key === `${selectedPage}_subtitle_ru`)?.setting_value || defaults.subtitle_ru || '',
        subtitle_en: settings.find(s => s.setting_key === `${selectedPage}_subtitle_en`)?.setting_value || defaults.subtitle_en || '',
        subtitle_tj: settings.find(s => s.setting_key === `${selectedPage}_subtitle_tj`)?.setting_value || defaults.subtitle_tj || '',
      }
      setHeaderTitles(loadedTitles)
    } catch (error) {
      console.error('Error loading page data:', error)
      setPageBlocks([])
    }
    setLoading(false)
  }

  const savePage = async () => {
    setSaveStatus('saving')
    try {
      const pageData = {
        showBanner: bannerSettings.showBanner,
        bannerTitle_ru: bannerSettings.bannerTitle_ru,
        bannerTitle_en: bannerSettings.bannerTitle_en,
        bannerTitle_tj: bannerSettings.bannerTitle_tj,
        bannerSubtitle_ru: bannerSettings.bannerSubtitle_ru,
        bannerSubtitle_en: bannerSettings.bannerSubtitle_en,
        bannerSubtitle_tj: bannerSettings.bannerSubtitle_tj,
        blocks: pageBlocks,
      }
      const jsonData = JSON.stringify(pageData)
      await saveSettingsApi(selectedPage, jsonData)

      // Also save header titles if this page supports them
      if (PAGE_HEADER_DEFAULTS[selectedPage]) {
        const titleSettings = {
          [`${selectedPage}_title_ru`]: headerTitles.title_ru,
          [`${selectedPage}_title_en`]: headerTitles.title_en,
          [`${selectedPage}_title_tj`]: headerTitles.title_tj,
          [`${selectedPage}_subtitle_ru`]: headerTitles.subtitle_ru,
          [`${selectedPage}_subtitle_en`]: headerTitles.subtitle_en,
          [`${selectedPage}_subtitle_tj`]: headerTitles.subtitle_tj,
        }
        await saveSettingsApi(titleSettings)
      }

      setSaveStatus('success')
      // Reload data after successful save to confirm
      setTimeout(async () => {
        await loadPageData()
        setSaveStatus(null)
      }, 1500)
    } catch (error) {
      console.error('Error saving page:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const addBlock = (type) => {
    const newBlock = createDefaultBlock(type)
    setPageBlocks([...pageBlocks, newBlock])
    setExpandedBlock(newBlock.id)
  }

  const createDefaultBlock = (type) => {
    const id = Date.now().toString()
    const baseBlock = { id, type }

    switch (type) {
      case 'hero':
        return { ...baseBlock, title_ru: '', title_en: '', title_tj: '', subtitle_ru: '', subtitle_en: '', subtitle_tj: '', image: '' }
      case 'text':
        return { ...baseBlock, content_ru: '', content_en: '', content_tj: '', heading_ru: '', heading_en: '', heading_tj: '', background: 'white' }
      case 'image':
        return { ...baseBlock, url: '', alt_ru: '', alt_en: '', alt_tj: '', caption_ru: '', caption_en: '', caption_tj: '', size: 'medium', alignment: 'center' }
      case 'info_cards':
        return { ...baseBlock, cards: [] }
      case 'schedule':
        return { ...baseBlock, heading_ru: 'Программа', heading_en: 'Schedule', heading_tj: 'Барнома', items: [] }
      case 'list':
        return { ...baseBlock, heading_ru: '', heading_en: '', heading_tj: '', items_ru: [], items_en: [], items_tj: [] }
      case 'facts':
        return { ...baseBlock, heading_ru: 'Интересные факты', heading_en: 'Interesting Facts', heading_tj: 'Фактҳои ҷолиб', facts_ru: [], facts_en: [], facts_tj: [] }
      case 'cta':
        return { ...baseBlock, text_ru: '', text_en: '', text_tj: '', button_text_ru: '', button_text_en: '', button_text_tj: '', button_link: '' }
      default:
        return baseBlock
    }
  }

  const updateBlock = (blockId, updates) => {
    setPageBlocks(pageBlocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ))
  }

  const deleteBlock = (blockId) => {
    if (confirm('Удалить этот блок?')) {
      setPageBlocks(pageBlocks.filter(block => block.id !== blockId))
      if (expandedBlock === blockId) setExpandedBlock(null)
    }
  }

  const duplicateBlock = (blockId) => {
    const block = pageBlocks.find(b => b.id === blockId)
    if (block) {
      const newBlock = { ...block, id: Date.now().toString() }
      const index = pageBlocks.findIndex(b => b.id === blockId)
      const newBlocks = [...pageBlocks]
      newBlocks.splice(index + 1, 0, newBlock)
      setPageBlocks(newBlocks)
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(pageBlocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setPageBlocks(items)
  }

  const generateAltText = (filename) => {
    // Remove extension and replace dashes/underscores with spaces
    return filename
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/[-_]/g, ' ') // replace dashes and underscores with spaces
      .replace(/\d+/g, '') // remove numbers
      .trim()
  }

  const handleImageUpload = async (blockId, file, isHeroBackground = false) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()

      if (isHeroBackground) {
        // For hero blocks, update the image field
        updateBlock(blockId, {
          image: data.url || data.path
        })
      } else {
        // For image blocks, generate alt text and update url field
        const altText = generateAltText(file.name)
        updateBlock(blockId, {
          url: data.url || data.path,
          alt_ru: altText,
          alt_en: altText,
          alt_tj: altText
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Ошибка загрузки изображения')
    }
  }

  const handlePdfUpload = async (blockId, file, langCode) => {
    // Validate file type
    if (!file.type.includes('pdf')) {
      alert('Пожалуйста, загрузите PDF файл')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      alert('Размер файла не должен превышать 10MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Ошибка сервера: ${response.status}`)
      }

      const data = await response.json()
      const fileUrl = data.url || data.path

      const updates = {
        [`url_${langCode}`]: fileUrl,
        [`fileName_${langCode}`]: file.name,
      }

      // Set default button texts if not already set
      if (langCode === 'ru') updates.buttonText_ru = updates.buttonText_ru || 'Скачать документ'
      if (langCode === 'en') updates.buttonText_en = updates.buttonText_en || 'Download document'
      if (langCode === 'tj') updates.buttonText_tj = updates.buttonText_tj || 'Боргирӣ кардани ҳуҷҷат'

      updateBlock(blockId, updates)
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert(`Ошибка загрузки PDF: ${error.message}`)
    }
  }

  const getBlockIcon = (type) => {
    const blockType = BLOCK_TYPES.find(bt => bt.type === type)
    return blockType?.icon || FileText
  }

  const getBlockName = (type) => {
    return BLOCK_TYPES.find(bt => bt.type === type)?.name || type
  }

  const getBlockPreview = (block) => {
    switch (block.type) {
      case 'hero':
        return block.title_ru || block.title_en || 'Нет заголовка'
      case 'text':
        return block.heading_ru || block.heading_en || 'Текстовый блок'
      case 'image':
        return block.alt_ru || block.alt_en || 'Изображение'
      case 'pdf':
        const pdfCount = ['ru', 'en', 'tj'].filter(l => block[`url_${l}`]).length
        return pdfCount > 0 ? `PDF (${pdfCount}/3 языков)` : 'PDF документ'
      case 'info_cards':
        return `${(block.cards || []).length} карточек`
      case 'schedule':
        return `${(block.items || []).length} пунктов`
      case 'list':
        return block.heading_ru || 'Список'
      case 'facts':
        return `${(block.facts_ru || []).length} фактов`
      case 'cta':
        return block.text_ru || 'Призыв к действию'
      default:
        return 'Блок'
    }
  }

  const renderBlockEditor = (block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="block-editor-content">
            <div className="form-row">
              <div className="form-group">
                <label>Фоновое изображение</label>
                <input
                  type="text"
                  value={block.image || ''}
                  onChange={(e) => updateBlock(block.id, { image: e.target.value })}
                  placeholder="https://example.com/image.jpg или загрузите файл"
                />
                <label className="file-upload-btn">
                  <Upload size={16} />
                  Загрузить изображение
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(block.id, e.target.files[0], true)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {block.image && (
              <div className="image-preview-box">
                <img src={block.image} alt="Hero Background Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}

            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  value={block[`title_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`title_${langTab}`]: e.target.value })}
                  placeholder="Введите заголовок"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Подзаголовок</label>
                <input
                  type="text"
                  value={block[`subtitle_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`subtitle_${langTab}`]: e.target.value })}
                  placeholder="Введите подзаголовок"
                />
              </div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="block-editor-content">
            <div className="form-row">
              <div className="form-group">
                <label>Фон</label>
                <select
                  value={block.background || 'white'}
                  onChange={(e) => updateBlock(block.id, { background: e.target.value })}
                >
                  <option value="white">Белый</option>
                  <option value="gray">Серый</option>
                </select>
              </div>
            </div>
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  value={block[`heading_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`heading_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Контент (редактор текста)</label>
                <TextEditor block={block} langTab={langTab} updateBlock={updateBlock} />
              </div>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="block-editor-content">
            <div className="form-row">
              <div className="form-group">
                <label>URL изображения</label>
                <input
                  type="text"
                  value={block.url || ''}
                  onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <label className="file-upload-btn">
                  <Upload size={16} />
                  <span>Загрузить файл</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(block.id, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Image Settings */}
            <div className="form-row">
              <div className="form-group">
                <label>Размер изображения</label>
                <select
                  value={block.size || 'medium'}
                  onChange={(e) => updateBlock(block.id, { size: e.target.value })}
                >
                  <option value="small">Маленький (400px)</option>
                  <option value="medium">Средний (800px)</option>
                  <option value="large">Большой (1200px)</option>
                  <option value="full">Полная ширина</option>
                </select>
              </div>
              <div className="form-group">
                <label>Выравнивание</label>
                <select
                  value={block.alignment || 'center'}
                  onChange={(e) => updateBlock(block.id, { alignment: e.target.value })}
                >
                  <option value="left">По левому краю</option>
                  <option value="center">По центру</option>
                  <option value="right">По правому краю</option>
                </select>
              </div>
            </div>

            {block.url && (
              <div className="image-preview-box">
                <img src={block.url} alt="Preview" style={{
                  maxWidth: block.size === 'small' ? '400px' : block.size === 'medium' ? '800px' : block.size === 'large' ? '1200px' : '100%',
                  margin: block.alignment === 'left' ? '0 auto 0 0' : block.alignment === 'right' ? '0 0 0 auto' : '0 auto'
                }} />
              </div>
            )}

            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Alt текст (автоматически из имени файла, можно изменить)</label>
                <input
                  type="text"
                  value={block[`alt_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`alt_${langTab}`]: e.target.value })}
                  placeholder="Автоматически сгенерировано"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Подпись (опционально)</label>
                <input
                  type="text"
                  value={block[`caption_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`caption_${langTab}`]: e.target.value })}
                  placeholder="Добавьте подпись к изображению"
                />
              </div>
            </div>
          </div>
        )

      case 'pdf':
        return (
          <div className="block-editor-content">
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PDF файл ({langTab === 'ru' ? 'Русский' : langTab === 'en' ? 'English' : 'Тоҷикӣ'})</label>
                <input
                  type="text"
                  value={block[`url_${langTab}`] || ''}
                  readOnly
                  placeholder="PDF файл не загружен"
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label className="file-upload-btn">
                    <Upload size={16} />
                    <span>Загрузить PDF</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => e.target.files[0] && handlePdfUpload(block.id, e.target.files[0], langTab)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {block[`url_${langTab}`] && (
                    <button
                      className="file-upload-btn"
                      style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                      onClick={() => updateBlock(block.id, { [`url_${langTab}`]: '', [`fileName_${langTab}`]: '' })}
                    >
                      <Trash2 size={16} />
                      <span>Удалить</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {block[`url_${langTab}`] && (
              <div className="pdf-preview-box">
                <FileText size={48} style={{ color: '#dc2626' }} />
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                  PDF загружен: {block[`fileName_${langTab}`] || 'document.pdf'}
                </p>
                <a href={block[`url_${langTab}`]} target="_blank" rel="noopener noreferrer" style={{
                  color: '#2d5a87',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                  Предпросмотр PDF
                </a>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Заголовок кнопки скачивания</label>
                <input
                  type="text"
                  value={block[`buttonText_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`buttonText_${langTab}`]: e.target.value })}
                  placeholder="Скачать документ"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Описание документа (опционально)</label>
                <textarea
                  rows="2"
                  value={block[`description_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`description_${langTab}`]: e.target.value })}
                  placeholder="Краткое описание документа"
                />
              </div>
            </div>
          </div>
        )

      case 'info_cards':
        return (
          <div className="block-editor-content">
            <button
              className="btn-add-item"
              onClick={() => {
                const newCard = {
                  id: Date.now().toString(),
                  icon: 'calendar',
                  title_ru: '', title_en: '', title_tj: '',
                  text_ru: '', text_en: '', text_tj: ''
                }
                updateBlock(block.id, { cards: [...(block.cards || []), newCard] })
              }}
            >
              <Plus size={16} />
              <span>Добавить карточку</span>
            </button>
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            {(block.cards || []).map((card, index) => {
              const IconComponent = INFO_CARD_ICONS[card.icon] || Info
              return (
                <div key={card.id} className="nested-item">
                  <div className="nested-item-header">
                    <span><IconComponent size={16} /> Карточка #{index + 1}</span>
                    <button onClick={() => updateBlock(block.id, { cards: block.cards.filter(c => c.id !== card.id) })}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Иконка</label>
                      <select
                        value={card.icon}
                        onChange={(e) => {
                          const updatedCards = block.cards.map(c =>
                            c.id === card.id ? { ...c, icon: e.target.value } : c
                          )
                          updateBlock(block.id, { cards: updatedCards })
                        }}
                      >
                        <option value="calendar">Календарь</option>
                        <option value="map">Карта</option>
                        <option value="users">Люди</option>
                        <option value="info">Информация</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Заголовок</label>
                      <input
                        type="text"
                        value={card[`title_${langTab}`] || ''}
                        onChange={(e) => {
                          const updatedCards = block.cards.map(c =>
                            c.id === card.id ? { ...c, [`title_${langTab}`]: e.target.value } : c
                          )
                          updateBlock(block.id, { cards: updatedCards })
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Текст</label>
                      <textarea
                        rows="2"
                        value={card[`text_${langTab}`] || ''}
                        onChange={(e) => {
                          const updatedCards = block.cards.map(c =>
                            c.id === card.id ? { ...c, [`text_${langTab}`]: e.target.value } : c
                          )
                          updateBlock(block.id, { cards: updatedCards })
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )

      case 'schedule':
        return (
          <div className="block-editor-content">
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Заголовок блока</label>
                <input
                  type="text"
                  value={block[`heading_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`heading_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <button
              className="btn-add-item"
              onClick={() => {
                const newItem = {
                  id: Date.now().toString(),
                  time: '',
                  text_ru: '', text_en: '', text_tj: ''
                }
                updateBlock(block.id, { items: [...(block.items || []), newItem] })
              }}
            >
              <Plus size={16} />
              <span>Добавить пункт расписания</span>
            </button>
            {(block.items || []).map((item, index) => (
              <div key={item.id} className="nested-item">
                <div className="nested-item-header">
                  <span><Clock size={16} /> Пункт #{index + 1}</span>
                  <button onClick={() => updateBlock(block.id, { items: block.items.filter(i => i.id !== item.id) })}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Время</label>
                    <input
                      type="text"
                      value={item.time || ''}
                      onChange={(e) => {
                        const updatedItems = block.items.map(i =>
                          i.id === item.id ? { ...i, time: e.target.value } : i
                        )
                        updateBlock(block.id, { items: updatedItems })
                      }}
                      placeholder="08:00"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Описание</label>
                    <input
                      type="text"
                      value={item[`text_${langTab}`] || ''}
                      onChange={(e) => {
                        const updatedItems = block.items.map(i =>
                          i.id === item.id ? { ...i, [`text_${langTab}`]: e.target.value } : i
                        )
                        updateBlock(block.id, { items: updatedItems })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'list':
        return (
          <div className="block-editor-content">
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  value={block[`heading_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`heading_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Элементы списка (один на строку)</label>
                <textarea
                  rows="6"
                  value={(block[`items_${langTab}`] || []).join('\n')}
                  onChange={(e) => updateBlock(block.id, { [`items_${langTab}`]: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Элемент 1&#10;Элемент 2&#10;Элемент 3"
                />
              </div>
            </div>
          </div>
        )

      case 'facts':
        return (
          <div className="block-editor-content">
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  value={block[`heading_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`heading_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Факты (один на строку)</label>
                <textarea
                  rows="8"
                  value={(block[`facts_${langTab}`] || []).join('\n')}
                  onChange={(e) => updateBlock(block.id, { [`facts_${langTab}`]: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Факт 1&#10;Факт 2&#10;Факт 3"
                />
              </div>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className="block-editor-content">
            <div className="lang-tabs-inline">
              <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
              <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
              <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Текст</label>
                <textarea
                  rows="3"
                  value={block[`text_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`text_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Текст кнопки</label>
                <input
                  type="text"
                  value={block[`button_text_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`button_text_${langTab}`]: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ссылка кнопки</label>
                <input
                  type="text"
                  value={block.button_link || ''}
                  onChange={(e) => updateBlock(block.id, { button_link: e.target.value })}
                  placeholder="/registration"
                />
              </div>
            </div>
          </div>
        )

      default:
        return <div>Неизвестный тип блока</div>
    }
  }

  return (
    <div className="elementor-builder">
      {/* Top Bar */}
      <div className="elementor-topbar">
        <div className="topbar-left">
          <h2>Конструктор страниц</h2>
        </div>
        <div className="topbar-right">
          <button
            className={`btn-save ${saveStatus === 'saving' ? 'saving' : ''} ${saveStatus === 'success' ? 'success' : ''}`}
            onClick={savePage}
            disabled={saveStatus === 'saving'}
          >
            <Save size={16} />
            {saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'success' ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Page Tabs - Grouped or filtered by initialPage */}
      <div className="elementor-page-tabs" style={{ flexWrap: 'wrap', gap: '8px', padding: '12px 20px' }}>
        {(initialPage
          ? PAGE_GROUPS.filter(group => group.id === initialPage)
          : PAGE_GROUPS
        ).map(group => (
          <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '16px', marginBottom: '4px' }}>
            {!initialPage && <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginRight: '6px' }}>{group.label}:</span>}
            {group.pages.map(page => (
              <button
                key={page.id}
                className={`page-tab ${selectedPage === page.id ? 'active' : ''}`}
                onClick={() => setSelectedPage(page.id)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {page.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="elementor-loading">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : (
        <div className="elementor-workspace">
          {/* Sidebar with Block Picker */}
          <div className="elementor-sidebar">
            <div className="sidebar-header">
              <h3>Добавить элемент</h3>
            </div>
            <div className="block-picker-grid">
              {BLOCK_TYPES.map(blockType => {
                const IconComponent = blockType.icon
                return (
                  <button
                    key={blockType.type}
                    className="block-picker-item"
                    onClick={() => addBlock(blockType.type)}
                    title={blockType.desc}
                  >
                    <div className="block-icon">
                      <IconComponent size={28} strokeWidth={1.5} />
                    </div>
                    <div className="block-name">{blockType.name}</div>
                  </button>
                )
              })}
            </div>

          </div>

          {/* Canvas Area */}
          <div className="elementor-canvas">
            {/* Banner Settings Panel */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem 1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: bannerSettings.showBanner ? '0.75rem' : 0 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                  Баннер страницы
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {bannerSettings.showBanner ? 'Включен' : 'Выключен'}
                  </span>
                  <input
                    type="checkbox"
                    checked={bannerSettings.showBanner}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, showBanner: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {bannerSettings.showBanner && (
                <div>
                  <div className="lang-tabs-inline" style={{ marginBottom: '0.5rem' }}>
                    <button className={langTab === 'ru' ? 'active' : ''} onClick={() => setLangTab('ru')}>РУС</button>
                    <button className={langTab === 'en' ? 'active' : ''} onClick={() => setLangTab('en')}>ENG</button>
                    <button className={langTab === 'tj' ? 'active' : ''} onClick={() => setLangTab('tj')}>ТАД</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Заголовок баннера</label>
                      <input
                        type="text"
                        value={bannerSettings[`bannerTitle_${langTab}`] || ''}
                        onChange={(e) => setBannerSettings({
                          ...bannerSettings,
                          [`bannerTitle_${langTab}`]: e.target.value
                        })}
                        placeholder={PAGE_HEADER_DEFAULTS[selectedPage]?.[`title_${langTab}`] || 'Введите заголовок'}
                      />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginTop: '0.5rem' }}>
                    <div className="form-group">
                      <label>Подзаголовок баннера</label>
                      <input
                        type="text"
                        value={bannerSettings[`bannerSubtitle_${langTab}`] || ''}
                        onChange={(e) => setBannerSettings({
                          ...bannerSettings,
                          [`bannerSubtitle_${langTab}`]: e.target.value
                        })}
                        placeholder="Введите подзаголовок (необязательно)"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {pageBlocks.length === 0 ? (
              <div className="canvas-empty">
                <div className="empty-icon">
                  <FileText size={64} strokeWidth={1} />
                </div>
                <h3>Начните создавать страницу</h3>
                <p>Выберите элемент слева, чтобы добавить его на страницу</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      className="blocks-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {pageBlocks.map((block, index) => {
                        const BlockIcon = getBlockIcon(block.type)
                        return (
                          <Draggable key={block.id} draggableId={block.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`block-wrapper ${expandedBlock === block.id ? 'expanded' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                              >
                                {/* Block Header */}
                                <div className="block-header" {...provided.dragHandleProps}>
                                  <div className="block-header-left">
                                    <span className="drag-handle">
                                      <GripVertical size={20} />
                                    </span>
                                    <span className="block-type-icon">
                                      <BlockIcon size={20} />
                                    </span>
                                    <span className="block-title">
                                      {getBlockName(block.type)}: {getBlockPreview(block)}
                                    </span>
                                  </div>
                                  <div className="block-header-right">
                                    <button
                                      className="btn-block-action"
                                      onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
                                      title={expandedBlock === block.id ? "Свернуть" : "Редактировать"}
                                    >
                                      {expandedBlock === block.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <button
                                      className="btn-block-action"
                                      onClick={() => duplicateBlock(block.id)}
                                      title="Дублировать"
                                    >
                                      <Copy size={16} />
                                    </button>
                                    <button
                                      className="btn-block-action danger"
                                      onClick={() => deleteBlock(block.id)}
                                      title="Удалить"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>

                                {/* Block Editor (expanded) */}
                                {expandedBlock === block.id && (
                                  <div className="block-editor">
                                    {renderBlockEditor(block)}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
