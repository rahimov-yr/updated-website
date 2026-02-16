import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSettings } from '../hooks/useApi'
import EventsManager from './EventsManager'
import ExcursionsManager from './ExcursionsManager'
import ExhibitionManager from './ExhibitionManager'
import LogisticsManager from './LogisticsManager'
import ContactsManager from './ContactsManager'
import WaterDecadeManager from './WaterDecadeManager'
import EventsSubpagesManager from './EventsSubpagesManager'
import './PagesManager.css'

// SVG Icons
const icons = {
  calendar: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
    </svg>
  ),
  event: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  page: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  delete: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
  visible: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  ),
  hidden: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>
  ),
}

// Default built-in pages configuration (fallback)
const defaultBuiltInPages = [
  { id: 'conference', label: 'Конференция', icon: 'event', description: 'О конференции', isBuiltIn: true },
  { id: 'program', label: 'Программа', icon: 'calendar', description: 'Расписание конференции', isBuiltIn: true },
  { id: 'events', label: 'Мероприятия', icon: 'event', description: 'Основные и сопутствующие события', isBuiltIn: true },
  { id: 'exhibition', label: 'Выставка', icon: 'page', description: 'Выставочные зоны', isBuiltIn: true },
  { id: 'excursions', label: 'Экскурсии', icon: 'map', description: 'Экскурсии для участников', isBuiltIn: true },
  { id: 'logistics', label: 'Логистика', icon: 'truck', description: 'Размещение и транспорт', isBuiltIn: true },
  { id: 'contacts', label: 'Контакты', icon: 'phone', description: 'Контактная информация', isBuiltIn: true },
  { id: 'registration', label: 'Регистрация', icon: 'add', description: 'Страница регистрации', isBuiltIn: true },
  { id: 'water-decade', label: 'Водное десятилетие', icon: 'event', description: 'Водное десятилетие ООН', isBuiltIn: true },
]

// Map navigation ID to icon
const iconMap = {
  'conference': 'event',
  'program': 'calendar',
  'events': 'event',
  'excursions': 'map',
  'exhibition': 'page',
  'logistics': 'truck',
  'contacts': 'phone',
  'registration': 'add',
  'water-decade': 'event',
}

export default function PagesManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPage = searchParams.get('page') || 'program'
  const [activePage, setActivePage] = useState(initialPage)
  const [customPages, setCustomPages] = useState([])
  const [builtInPages, setBuiltInPages] = useState(defaultBuiltInPages)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [activeTab, setActiveTab] = useState('ru')

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  // Form state for new/edit page
  const [pageForm, setPageForm] = useState({
    slug: '',
    title_ru: '',
    title_en: '',
    title_tj: '',
    description_ru: '',
    description_en: '',
    description_tj: '',
    content_ru: '',
    content_en: '',
    content_tj: '',
    showInMenu: true,
    isPublished: true,
  })

  // Auto-collapse sidebar when Pages page opens
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('admin-collapse-sidebar'))
  }, [])

  // Load custom pages
  useEffect(() => {
    loadCustomPages()
  }, [])

  // Update URL when page changes
  useEffect(() => {
    setSearchParams({ page: activePage })
  }, [activePage, setSearchParams])

  const loadCustomPages = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.custom_pages) {
        setCustomPages(JSON.parse(settingsMap.custom_pages))
      }

      // Load navigation from database and convert to sidebar format
      if (settingsMap.header_navigation) {
        try {
          const navData = JSON.parse(settingsMap.header_navigation)
          if (Array.isArray(navData) && navData.length > 0) {
            // Transform navigation items to sidebar format
            const pages = navData
              .filter(item => item.id !== 'registration') // Registration handled separately below
              .map(item => {
                // Get the icon for this nav item
                const icon = iconMap[item.id] || 'page'
                // Extract page id from path (remove leading slash)
                const pageId = item.path?.replace('/', '') || item.id
                return {
                  id: pageId || item.id,
                  label: item.label_ru || item.id,
                  icon: icon,
                  description: item.submenus?.length > 0
                    ? `${item.submenus.length} подразделов`
                    : item.label_ru || '',
                  isBuiltIn: true,
                }
              })

            // Ensure 'excursions' is always present (may be missing in older saved configs)
            if (!pages.find(p => p.id === 'excursions')) {
              const exhibitionIndex = pages.findIndex(p => p.id === 'exhibition')
              pages.splice(exhibitionIndex + 1, 0, {
                id: 'excursions',
                label: 'Экскурсии',
                icon: 'map',
                description: 'Экскурсии для участников',
                isBuiltIn: true,
              })
            }

            // Always add Registration page
            pages.push({
              id: 'registration',
              label: 'Регистрация',
              icon: 'add',
              description: 'Страница регистрации',
              isBuiltIn: true,
            })

            if (pages.length > 0) {
              setBuiltInPages(pages)
            }
          }
        } catch (e) {
          console.error('Failed to parse navigation:', e)
        }
      }
    } catch (err) {
      console.error('Failed to load custom pages:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveCustomPages = async (pages) => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi('custom_pages', JSON.stringify(pages))
      setSaveStatus({ type: 'success', message: 'Страницы сохранены!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save custom pages:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetForm = () => {
    setPageForm({
      slug: '',
      title_ru: '',
      title_en: '',
      title_tj: '',
      description_ru: '',
      description_en: '',
      description_tj: '',
      content_ru: '',
      content_en: '',
      content_tj: '',
      showInMenu: true,
      isPublished: true,
    })
    setActiveTab('ru')
  }

  const openAddModal = () => {
    resetForm()
    setEditingPage(null)
    setShowModal(true)
  }

  const openEditModal = (page) => {
    setPageForm({ ...page })
    setEditingPage(page.id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPage(null)
    resetForm()
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya' }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (lang, value) => {
    setPageForm(prev => ({
      ...prev,
      [`title_${lang}`]: value,
      ...(lang === 'ru' && !editingPage ? { slug: generateSlug(value) } : {})
    }))
  }

  const handleSubmit = () => {
    if (!pageForm.title_ru.trim()) {
      alert('Введите название страницы')
      return
    }

    // Generate slug from title
    const slug = generateSlug(pageForm.title_ru)

    // Check for duplicate slug
    const slugExists = customPages.some(p => p.slug === slug)
    if (slugExists) {
      alert('Страница с таким названием уже существует')
      return
    }

    // Create new page with minimal data
    const newPageId = Date.now()
    const newPage = {
      slug,
      title_ru: pageForm.title_ru,
      title_en: '',
      title_tj: '',
      description_ru: '',
      description_en: '',
      description_tj: '',
      content_ru: '',
      content_en: '',
      content_tj: '',
      showInMenu: true,
      isPublished: false, // Start as draft
      id: newPageId,
      createdAt: new Date().toISOString(),
    }

    const updatedPages = [...customPages, newPage]
    setCustomPages(updatedPages)
    saveCustomPages(updatedPages)
    closeModal()

    // Open the page editor (like WordPress)
    setActivePage(`custom-${newPageId}`)
  }

  const deletePage = (pageId) => {
    if (!window.confirm('Удалить эту страницу?')) return

    const updatedPages = customPages.filter(p => p.id !== pageId)
    setCustomPages(updatedPages)
    saveCustomPages(updatedPages)

    // If we're viewing the deleted page, switch to program
    if (activePage === `custom-${pageId}`) {
      setActivePage('program')
    }
  }

  const togglePageVisibility = (pageId) => {
    const updatedPages = customPages.map(p =>
      p.id === pageId ? { ...p, isPublished: !p.isPublished } : p
    )
    setCustomPages(updatedPages)
    saveCustomPages(updatedPages)
  }

  // Combine built-in and custom pages
  const allPages = [
    ...builtInPages,
    ...customPages.map(p => ({
      id: `custom-${p.id}`,
      label: p.title_ru,
      icon: 'page',
      description: p.description_ru || 'Пользовательская страница',
      isCustom: true,
      customData: p,
    }))
  ]

  const renderContent = () => {
    // Check for custom page
    if (activePage.startsWith('custom-')) {
      const pageId = parseInt(activePage.replace('custom-', ''))
      const customPage = customPages.find(p => p.id === pageId)
      if (customPage) {
        return <CustomPageEditor page={customPage} onSave={(updated) => {
          const updatedPages = customPages.map(p => p.id === pageId ? updated : p)
          setCustomPages(updatedPages)
          saveCustomPages(updatedPages)
        }} />
      }
    }

    // Built-in pages
    switch (activePage) {
      case 'conference':
        return <EventsManager embedded initialPage="conference" />
      case 'program':
        return <EventsManager embedded initialPage="program" />
      case 'events':
        return <EventsManager embedded initialPage="events" />
      case 'excursions':
        return <EventsManager embedded initialPage="excursions" />
      case 'exhibition':
        return <EventsManager embedded initialPage="exhibition" />
      case 'logistics':
        return <EventsManager embedded initialPage="logistics" />
      case 'contacts':
        return <ContactsManager embedded />
      case 'registration':
        return <EventsSubpagesManager initialPage="registration_page" />
      case 'water-decade':
        return <WaterDecadeManager embedded />
      default:
        return <EventsManager embedded initialPage={activePage} />
    }
  }

  const getIcon = (iconName) => icons[iconName] || icons.page

  return (
    <div className="pages-manager">
      <div className="pages-manager-header">
        <div className="pages-manager-title">
          <h1>Страницы</h1>
          <p>Управление страницами сайта</p>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>
            {icons.close}
          </button>
        </div>
      )}

      <div className="pages-manager-layout">
        <aside className="pages-manager-sidebar">
          <div className="pages-nav-section">
            <div className="pages-nav-section-title">Основные страницы</div>
            <nav className="pages-nav">
              {builtInPages.map((page) => (
                <button
                  key={page.id}
                  className={`pages-nav-item ${activePage === page.id ? 'active' : ''}`}
                  onClick={() => setActivePage(page.id)}
                >
                  <span className="pages-nav-icon">{getIcon(page.icon)}</span>
                  <div className="pages-nav-text">
                    <span className="pages-nav-label">{page.label}</span>
                    <span className="pages-nav-description">{page.description}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {customPages.length > 0 && (
            <div className="pages-nav-section">
              <div className="pages-nav-section-title">Пользовательские страницы</div>
              <nav className="pages-nav">
                {customPages.map((page) => (
                  <div
                    key={page.id}
                    className={`pages-nav-item ${activePage === `custom-${page.id}` ? 'active' : ''} ${!page.isPublished ? 'unpublished' : ''}`}
                  >
                    <button
                      className="pages-nav-item-main"
                      onClick={() => setActivePage(`custom-${page.id}`)}
                    >
                      <span className="pages-nav-icon">{icons.page}</span>
                      <div className="pages-nav-text">
                        <span className="pages-nav-label">{page.title_ru}</span>
                        <span className="pages-nav-description">/{page.slug}</span>
                      </div>
                    </button>
                    <div className="pages-nav-item-actions">
                      <button
                        className="pages-nav-action"
                        onClick={(e) => { e.stopPropagation(); togglePageVisibility(page.id) }}
                        title={page.isPublished ? 'Скрыть' : 'Показать'}
                      >
                        {page.isPublished ? icons.visible : icons.hidden}
                      </button>
                      <button
                        className="pages-nav-action"
                        onClick={(e) => { e.stopPropagation(); openEditModal(page) }}
                        title="Редактировать"
                      >
                        {icons.edit}
                      </button>
                      <button
                        className="pages-nav-action delete"
                        onClick={(e) => { e.stopPropagation(); deletePage(page.id) }}
                        title="Удалить"
                      >
                        {icons.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          )}

          <button className="pages-nav-add" onClick={openAddModal}>
            {icons.add}
            <span>Добавить страницу</span>
          </button>
        </aside>

        <main className="pages-manager-content">
          {renderContent()}
        </main>
      </div>

      {/* Add Page Modal - Simple name input only */}
      {showModal && (
        <div className="pages-modal-overlay" onClick={closeModal}>
          <div className="pages-modal pages-modal--simple" onClick={(e) => e.stopPropagation()}>
            <div className="pages-modal-header">
              <h2>Новая страница</h2>
              <button className="pages-modal-close" onClick={closeModal}>
                {icons.close}
              </button>
            </div>

            <div className="pages-modal-body">
              <div className="form-group">
                <label>Название страницы</label>
                <input
                  type="text"
                  value={pageForm.title_ru}
                  onChange={(e) => setPageForm({ ...pageForm, title_ru: e.target.value })}
                  placeholder="Введите название страницы"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
                {pageForm.title_ru && (
                  <span className="slug-preview">URL: /{generateSlug(pageForm.title_ru)}</span>
                )}
              </div>
            </div>

            <div className="pages-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-save" onClick={handleSubmit}>
                Создать страницу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Template blocks for content insertion (matching public website components)
const templateBlocks = [
  {
    id: 'news-grid',
    name: 'Сетка новостей',
    description: 'Блок из 3-х карточек новостей в ряд',
    category: 'news',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M4 5v13h17V5H4zm10 2v3.5h-3V7h3zM6 7h3v3.5H6V7zm0 9v-3.5h3V16H6zm5 0v-3.5h3V16h-3zm8 0h-3v-3.5h3V16zm-3-5.5V7h3v3.5h-3z"/></svg>,
    html: `<div class="news-page__grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 32px 0;">
  <div class="news-page__card" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="height: 200px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); display: flex; align-items: center; justify-content: center; color: white;">
      <span style="font-size: 14px;">Изображение новости</span>
    </div>
    <div style="padding: 20px;">
      <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
      <h3 style="font-size: 18px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости</h3>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">Краткое описание новости...</p>
      <a href="#" style="display: inline-flex; align-items: center; color: #2d5a87; font-size: 14px; font-weight: 500; margin-top: 12px;">Подробнее →</a>
    </div>
  </div>
  <div class="news-page__card" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="height: 200px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); display: flex; align-items: center; justify-content: center; color: white;">
      <span style="font-size: 14px;">Изображение новости</span>
    </div>
    <div style="padding: 20px;">
      <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
      <h3 style="font-size: 18px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости</h3>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">Краткое описание новости...</p>
      <a href="#" style="display: inline-flex; align-items: center; color: #2d5a87; font-size: 14px; font-weight: 500; margin-top: 12px;">Подробнее →</a>
    </div>
  </div>
  <div class="news-page__card" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="height: 200px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); display: flex; align-items: center; justify-content: center; color: white;">
      <span style="font-size: 14px;">Изображение новости</span>
    </div>
    <div style="padding: 20px;">
      <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
      <h3 style="font-size: 18px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости</h3>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">Краткое описание новости...</p>
      <a href="#" style="display: inline-flex; align-items: center; color: #2d5a87; font-size: 14px; font-weight: 500; margin-top: 12px;">Подробнее →</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'news-card',
    name: 'Карточка новости',
    description: 'Отдельная карточка новости',
    category: 'news',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>,
    html: `<div class="news-card" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 400px;">
  <div style="height: 200px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); display: flex; align-items: center; justify-content: center; color: white; position: relative;">
    <span style="font-size: 14px;">Изображение новости</span>
    <span style="position: absolute; top: 12px; left: 12px; background: rgba(45,90,135,0.9); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Категория</span>
  </div>
  <div style="padding: 20px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #6b7280; font-size: 13px;">
      <span>📅 24 января 2025</span>
    </div>
    <h3 style="font-size: 18px; font-weight: 600; color: #1e3a5f; margin-bottom: 12px; line-height: 1.4;">Заголовок новости</h3>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Краткое описание новости. Здесь может быть несколько строк текста...</p>
    <a href="#" style="display: inline-flex; align-items: center; color: #2d5a87; font-size: 14px; font-weight: 500; text-decoration: none;">
      Читать далее
      <span style="margin-left: 4px;">→</span>
    </a>
  </div>
</div>`
  },
  {
    id: 'featured-article',
    name: 'Главная статья',
    description: 'Большая карточка для выделенной новости',
    category: 'news',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
    html: `<div class="featured-article" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.1); margin: 32px 0;">
  <div style="height: 400px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); display: flex; align-items: center; justify-content: center; color: white;">
    <span style="font-size: 16px;">Главное изображение</span>
  </div>
  <div style="padding: 40px 40px 40px 0; display: flex; flex-direction: column; justify-content: center;">
    <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 16px; width: fit-content;">Главная новость</span>
    <h2 style="font-size: 28px; font-weight: 700; color: #1e3a5f; margin-bottom: 16px; line-height: 1.3;">Заголовок главной новости</h2>
    <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">Подробное описание главной новости. Этот блок предназначен для выделения самой важной новости на странице.</p>
    <div style="display: flex; align-items: center; gap: 16px;">
      <a href="#" style="display: inline-flex; align-items: center; background: #2d5a87; color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;">
        Читать статью
      </a>
      <span style="color: #9ca3af; font-size: 14px;">📅 24 января 2025</span>
    </div>
  </div>
</div>`
  },
  {
    id: 'news-section',
    name: 'Секция новостей',
    description: 'Блок новостей с заголовком секции',
    category: 'news',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>,
    html: `<section class="news-section" style="padding: 60px 0;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
    <div>
      <h2 style="font-size: 32px; font-weight: 700; color: #1e3a5f; margin-bottom: 8px;">Последние новости</h2>
      <p style="color: #6b7280; font-size: 16px;">Актуальная информация о мероприятии</p>
    </div>
    <a href="/news" style="display: inline-flex; align-items: center; color: #2d5a87; font-size: 14px; font-weight: 500; text-decoration: none;">
      Все новости
      <span style="margin-left: 8px;">→</span>
    </a>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
    <div style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <div style="height: 180px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%);"></div>
      <div style="padding: 20px;">
        <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
        <h3 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости 1</h3>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">Краткое описание...</p>
      </div>
    </div>
    <div style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <div style="height: 180px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%);"></div>
      <div style="padding: 20px;">
        <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
        <h3 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости 2</h3>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">Краткое описание...</p>
      </div>
    </div>
    <div style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <div style="height: 180px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%);"></div>
      <div style="padding: 20px;">
        <span style="display: inline-block; background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px;">Категория</span>
        <h3 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Заголовок новости 3</h3>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">Краткое описание...</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'article-content',
    name: 'Контент статьи',
    description: 'Шаблон основного контента статьи',
    category: 'article',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/></svg>,
    html: `<article class="article-content" style="max-width: 800px; margin: 0 auto;">
  <header style="margin-bottom: 32px;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <span style="background: rgba(45,90,135,0.1); color: #2d5a87; padding: 4px 12px; border-radius: 20px; font-size: 13px;">Категория</span>
      <span style="color: #9ca3af; font-size: 14px;">📅 24 января 2025</span>
      <span style="color: #9ca3af; font-size: 14px;">⏱ 5 мин чтения</span>
    </div>
    <h1 style="font-size: 36px; font-weight: 700; color: #1e3a5f; line-height: 1.3; margin-bottom: 16px;">Заголовок статьи</h1>
    <p style="font-size: 18px; color: #6b7280; line-height: 1.6;">Краткое описание или лид статьи. Это вступительный текст, который привлекает внимание читателя.</p>
  </header>

  <div style="height: 400px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); border-radius: 16px; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; color: white;">
    <span style="font-size: 16px;">Главное изображение статьи</span>
  </div>

  <div style="font-size: 16px; line-height: 1.8; color: #374151;">
    <p style="margin-bottom: 20px;">Первый параграф статьи. Здесь начинается основной контент. Текст должен быть информативным и интересным для читателя.</p>

    <h2 style="font-size: 24px; font-weight: 600; color: #1e3a5f; margin: 32px 0 16px;">Подзаголовок секции</h2>
    <p style="margin-bottom: 20px;">Продолжение текста статьи. Разбивайте текст на логические блоки с помощью подзаголовков для лучшей читаемости.</p>

    <blockquote style="border-left: 4px solid #2d5a87; padding: 16px 24px; background: #f3f7fc; margin: 24px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #4b5563;">
      "Важная цитата или выделенный текст, который привлекает особое внимание читателя."
    </blockquote>

    <p style="margin-bottom: 20px;">Завершающий параграф статьи с выводами или призывом к действию.</p>
  </div>
</article>`
  },
  {
    id: 'share-buttons',
    name: 'Кнопки социальных сетей',
    description: 'Блок с кнопками шеринга',
    category: 'social',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>,
    html: `<div class="share-buttons" style="display: flex; align-items: center; gap: 16px; padding: 24px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin: 32px 0;">
  <span style="font-weight: 500; color: #374151;">Поделиться:</span>
  <div style="display: flex; gap: 8px;">
    <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: #3b5998; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;" title="Facebook">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
    </a>
    <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: #1da1f2; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;" title="Twitter">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
    </a>
    <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: #0077b5; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;" title="LinkedIn">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
    </a>
    <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;" title="WhatsApp">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: #0088cc; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;" title="Telegram">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    </a>
  </div>
</div>`
  },
  {
    id: 'related-news',
    name: 'Связанные новости',
    description: 'Блок с похожими новостями',
    category: 'news',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    html: `<div class="related-news" style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
  <h3 style="font-size: 20px; font-weight: 600; color: #1e3a5f; margin-bottom: 24px;">Похожие новости</h3>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <a href="#" style="display: flex; gap: 16px; text-decoration: none; padding: 16px; border-radius: 12px; background: #f9fafb; transition: background 0.2s;">
      <div style="width: 100px; height: 80px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); border-radius: 8px; flex-shrink: 0;"></div>
      <div>
        <h4 style="font-size: 14px; font-weight: 600; color: #1e3a5f; margin-bottom: 4px; line-height: 1.4;">Заголовок связанной новости</h4>
        <span style="font-size: 12px; color: #9ca3af;">24 января 2025</span>
      </div>
    </a>
    <a href="#" style="display: flex; gap: 16px; text-decoration: none; padding: 16px; border-radius: 12px; background: #f9fafb; transition: background 0.2s;">
      <div style="width: 100px; height: 80px; background: linear-gradient(135deg, #2d5a87 0%, #4a90c2 100%); border-radius: 8px; flex-shrink: 0;"></div>
      <div>
        <h4 style="font-size: 14px; font-weight: 600; color: #1e3a5f; margin-bottom: 4px; line-height: 1.4;">Ещё одна связанная новость</h4>
        <span style="font-size: 12px; color: #9ca3af;">23 января 2025</span>
      </div>
    </a>
  </div>
</div>`
  },
  {
    id: 'info-box',
    name: 'Информационный блок',
    description: 'Выделенный блок с важной информацией',
    category: 'content',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    html: `<div class="info-box" style="background: linear-gradient(135deg, rgba(45,90,135,0.05) 0%, rgba(45,90,135,0.1) 100%); border: 1px solid rgba(45,90,135,0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
  <div style="display: flex; gap: 16px;">
    <div style="width: 48px; height: 48px; background: #2d5a87; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    </div>
    <div>
      <h4 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">Важная информация</h4>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0;">Здесь размещается важная информация, на которую нужно обратить внимание читателя.</p>
    </div>
  </div>
</div>`
  },
  {
    id: 'cta-block',
    name: 'Призыв к действию',
    description: 'Блок с кнопкой действия',
    category: 'content',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
    html: `<div class="cta-block" style="background: linear-gradient(135deg, #2d5a87 0%, #1e4268 100%); border-radius: 16px; padding: 40px; text-align: center; margin: 32px 0;">
  <h3 style="font-size: 24px; font-weight: 700; color: white; margin-bottom: 12px;">Присоединяйтесь к нам!</h3>
  <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto;">Зарегистрируйтесь на мероприятие и станьте частью важного события</p>
  <a href="/registration" style="display: inline-flex; align-items: center; background: white; color: #2d5a87; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; transition: transform 0.2s;">
    Зарегистрироваться
    <span style="margin-left: 8px;">→</span>
  </a>
</div>`
  },
  {
    id: 'two-columns',
    name: 'Две колонки',
    description: 'Текст в две колонки',
    category: 'layout',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10 18h5V5h-5v13zm-6 0h5V5H4v13zM16 5v13h5V5h-5z"/></svg>,
    html: `<div class="two-columns" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 24px 0;">
  <div>
    <h3 style="font-size: 20px; font-weight: 600; color: #1e3a5f; margin-bottom: 12px;">Заголовок первой колонки</h3>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7;">Текст первой колонки. Здесь можно разместить информацию, которая будет отображаться слева.</p>
  </div>
  <div>
    <h3 style="font-size: 20px; font-weight: 600; color: #1e3a5f; margin-bottom: 12px;">Заголовок второй колонки</h3>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7;">Текст второй колонки. Здесь можно разместить информацию, которая будет отображаться справа.</p>
  </div>
</div>`
  }
]

// WordPress-like WYSIWYG Editor Toolbar Icons
const editorIcons = {
  bold: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
  italic: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>,
  underline: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
  strikethrough: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
  unlink: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4.01 1.41-1.41L3.41 2.86 2 4.27z"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  listBullet: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
  listNumber: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
  alignLeft: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>,
  alignCenter: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>,
  alignRight: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>,
  quote: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  heading: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>,
  code: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
  undo: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
  redo: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
  fullscreen: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>,
  preview: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
  hr: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 11h16v2H4z"/></svg>,
  table: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/></svg>,
  template: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5v-2h7v2zm7-4H5v-2h14v2zm0-4H5V7h14v2z"/></svg>,
}

// Custom page editor component - WordPress-like interface
function CustomPageEditor({ page, onSave }) {
  const [activeTab, setActiveTab] = useState('ru')
  const [form, setForm] = useState(page)
  const [hasChanges, setHasChanges] = useState(false)
  const [editorMode, setEditorMode] = useState('visual') // 'visual' or 'html'
  const [showPreview, setShowPreview] = useState(false)
  const [editingSlug, setEditingSlug] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [templateCategory, setTemplateCategory] = useState('all')
  const editorRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    setForm(page)
    setHasChanges(false)
  }, [page])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(form)
    setHasChanges(false)
  }

  // Generate slug from title (for slug editing)
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya' }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // WYSIWYG Editor Commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    syncContentFromEditor()
  }

  const syncContentFromEditor = () => {
    if (editorRef.current && editorMode === 'visual') {
      const content = editorRef.current.innerHTML
      handleChange(`content_${activeTab}`, content)
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
    syncContentFromEditor()
  }

  const insertLink = () => {
    const url = prompt('Введите URL ссылки:', 'https://')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Введите URL изображения:', 'https://')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const insertHeading = () => {
    const level = prompt('Уровень заголовка (1-6):', '2')
    if (level && level >= 1 && level <= 6) {
      execCommand('formatBlock', `h${level}`)
    }
  }

  // Insert template block to ALL languages
  const insertTemplate = (template) => {
    const languages = ['ru', 'en', 'tj']

    if (editorMode === 'visual' && editorRef.current) {
      // Insert at cursor position in visual editor for current language
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const fragment = document.createRange().createContextualFragment(template.html)
        range.insertNode(fragment)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // Append at end if no selection
        editorRef.current.innerHTML += template.html
      }

      // Sync current editor content and update all other languages
      const currentContent = editorRef.current.innerHTML
      setForm(prev => {
        const updates = {}
        languages.forEach(lang => {
          if (lang === activeTab) {
            updates[`content_${lang}`] = currentContent
          } else {
            // Append template to other languages
            updates[`content_${lang}`] = (prev[`content_${lang}`] || '') + '\n' + template.html
          }
        })
        return { ...prev, ...updates }
      })
      setHasChanges(true)
    } else {
      // HTML mode: append to ALL languages
      setForm(prev => {
        const updates = {}
        languages.forEach(lang => {
          updates[`content_${lang}`] = (prev[`content_${lang}`] || '') + '\n' + template.html
        })
        return { ...prev, ...updates }
      })
      setHasChanges(true)
    }
    setShowTemplates(false)
  }

  // Get filtered templates
  const getFilteredTemplates = () => {
    if (templateCategory === 'all') return templateBlocks
    return templateBlocks.filter(t => t.category === templateCategory)
  }

  // Template categories
  const templateCategories = [
    { id: 'all', name: 'Все' },
    { id: 'news', name: 'Новости' },
    { id: 'article', name: 'Статьи' },
    { id: 'content', name: 'Контент' },
    { id: 'social', name: 'Соцсети' },
    { id: 'layout', name: 'Разметка' },
  ]

  // Featured image upload
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        handleChange('featured_image', data.url)
      } else {
        alert('Ошибка загрузки изображения')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Ошибка загрузки')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeFeaturedImage = () => {
    handleChange('featured_image', '')
  }

  // Toolbar button component
  const ToolbarButton = ({ icon, title, onClick, active }) => (
    <button
      type="button"
      className={`editor-toolbar-btn ${active ? 'active' : ''}`}
      title={title}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      {icon}
    </button>
  )

  return (
    <div className="wp-page-editor">
      {/* Top Bar */}
      <div className="wp-editor-topbar">
        <div className="wp-editor-topbar-left">
          <span className="wp-editor-status">
            {form.isPublished ? (
              <span className="status-published">Опубликовано</span>
            ) : (
              <span className="status-draft">Черновик</span>
            )}
          </span>
          {hasChanges && <span className="wp-unsaved-indicator">• Несохранённые изменения</span>}
        </div>
        <div className="wp-editor-topbar-right">
          <button className="wp-btn wp-btn-secondary" onClick={() => setShowPreview(!showPreview)}>
            {editorIcons.preview}
            <span>Предпросмотр</span>
          </button>
          <button
            className="wp-btn wp-btn-primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            {form.isPublished ? 'Обновить' : 'Сохранить черновик'}
          </button>
          {!form.isPublished && (
            <button
              className="wp-btn wp-btn-publish"
              onClick={() => { handleChange('isPublished', true); setTimeout(handleSave, 100) }}
            >
              Опубликовать
            </button>
          )}
        </div>
      </div>

      <div className="wp-editor-layout">
        {/* Main Content Area */}
        <div className="wp-editor-main">
          {/* Language Tabs */}
          <div className="wp-lang-tabs">
            <button
              className={`wp-lang-tab ${activeTab === 'ru' ? 'active' : ''}`}
              onClick={() => setActiveTab('ru')}
            >
              <img src="https://flagcdn.com/w20/ru.png" alt="RU" />
              <span>Русский</span>
            </button>
            <button
              className={`wp-lang-tab ${activeTab === 'en' ? 'active' : ''}`}
              onClick={() => setActiveTab('en')}
            >
              <img src="https://flagcdn.com/w20/gb.png" alt="EN" />
              <span>English</span>
            </button>
            <button
              className={`wp-lang-tab ${activeTab === 'tj' ? 'active' : ''}`}
              onClick={() => setActiveTab('tj')}
            >
              <img src="https://flagcdn.com/w20/tj.png" alt="TJ" />
              <span>Тоҷикӣ</span>
            </button>
          </div>

          {/* Title Input */}
          <div className="wp-title-wrapper">
            <input
              type="text"
              className="wp-title-input"
              value={form[`title_${activeTab}`] || ''}
              onChange={(e) => handleChange(`title_${activeTab}`, e.target.value)}
              placeholder={activeTab === 'ru' ? 'Введите заголовок' : activeTab === 'en' ? 'Enter title here' : 'Номро ворид кунед'}
            />
          </div>

          {/* Permalink */}
          <div className="wp-permalink">
            <span className="wp-permalink-label">Постоянная ссылка:</span>
            <span className="wp-permalink-url">/page/</span>
            {editingSlug ? (
              <input
                type="text"
                className="wp-permalink-input"
                value={form.slug}
                onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
                onBlur={() => setEditingSlug(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingSlug(false)}
                autoFocus
              />
            ) : (
              <>
                <span className="wp-permalink-slug">{form.slug}</span>
                <button className="wp-permalink-edit" onClick={() => setEditingSlug(true)}>
                  Изменить
                </button>
              </>
            )}
          </div>

          {/* Editor Area */}
          <div className="wp-editor-container">
            {/* Mode Tabs */}
            <div className="wp-editor-mode-tabs">
              <button
                className={`wp-mode-tab ${editorMode === 'visual' ? 'active' : ''}`}
                onClick={() => setEditorMode('visual')}
              >
                Визуальный
              </button>
              <button
                className={`wp-mode-tab ${editorMode === 'html' ? 'active' : ''}`}
                onClick={() => setEditorMode('html')}
              >
                Текст (HTML)
              </button>
            </div>

            {/* Toolbar */}
            {editorMode === 'visual' && (
              <div className="wp-editor-toolbar">
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.bold} title="Жирный (Ctrl+B)" onClick={() => execCommand('bold')} />
                  <ToolbarButton icon={editorIcons.italic} title="Курсив (Ctrl+I)" onClick={() => execCommand('italic')} />
                  <ToolbarButton icon={editorIcons.underline} title="Подчёркнутый (Ctrl+U)" onClick={() => execCommand('underline')} />
                  <ToolbarButton icon={editorIcons.strikethrough} title="Зачёркнутый" onClick={() => execCommand('strikeThrough')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.link} title="Вставить ссылку" onClick={insertLink} />
                  <ToolbarButton icon={editorIcons.unlink} title="Удалить ссылку" onClick={() => execCommand('unlink')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.listBullet} title="Маркированный список" onClick={() => execCommand('insertUnorderedList')} />
                  <ToolbarButton icon={editorIcons.listNumber} title="Нумерованный список" onClick={() => execCommand('insertOrderedList')} />
                  <ToolbarButton icon={editorIcons.quote} title="Цитата" onClick={() => execCommand('formatBlock', 'blockquote')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.alignLeft} title="По левому краю" onClick={() => execCommand('justifyLeft')} />
                  <ToolbarButton icon={editorIcons.alignCenter} title="По центру" onClick={() => execCommand('justifyCenter')} />
                  <ToolbarButton icon={editorIcons.alignRight} title="По правому краю" onClick={() => execCommand('justifyRight')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.heading} title="Заголовок" onClick={insertHeading} />
                  <ToolbarButton icon={editorIcons.image} title="Вставить изображение" onClick={insertImage} />
                  <ToolbarButton icon={editorIcons.hr} title="Горизонтальная линия" onClick={() => execCommand('insertHorizontalRule')} />
                  <ToolbarButton icon={editorIcons.code} title="Код" onClick={() => execCommand('formatBlock', 'pre')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <ToolbarButton icon={editorIcons.undo} title="Отменить (Ctrl+Z)" onClick={() => execCommand('undo')} />
                  <ToolbarButton icon={editorIcons.redo} title="Повторить (Ctrl+Y)" onClick={() => execCommand('redo')} />
                </div>
                <div className="toolbar-separator" />
                <div className="toolbar-group">
                  <button
                    type="button"
                    className={`editor-toolbar-btn template-btn ${showTemplates ? 'active' : ''}`}
                    title="Вставить шаблон"
                    onClick={() => setShowTemplates(!showTemplates)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {editorIcons.template}
                    <span className="template-btn-text">Шаблоны</span>
                  </button>
                </div>
              </div>
            )}

            {/* Template Blocks Panel */}
            {showTemplates && (
              <div className="wp-templates-panel">
                <div className="wp-templates-header">
                  <h3>Готовые блоки контента</h3>
                  <button className="wp-templates-close" onClick={() => setShowTemplates(false)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
                <div className="wp-templates-categories">
                  {templateCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`wp-template-category ${templateCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setTemplateCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="wp-templates-grid">
                  {getFilteredTemplates().map(template => (
                    <button
                      key={template.id}
                      className="wp-template-item"
                      onClick={() => insertTemplate(template)}
                    >
                      <div className="wp-template-icon">{template.icon}</div>
                      <div className="wp-template-info">
                        <span className="wp-template-name">{template.name}</span>
                        <span className="wp-template-desc">{template.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Editor */}
            {editorMode === 'visual' ? (
              <div
                ref={editorRef}
                className="wp-visual-editor"
                contentEditable
                dangerouslySetInnerHTML={{ __html: form[`content_${activeTab}`] || '' }}
                onInput={syncContentFromEditor}
                onBlur={syncContentFromEditor}
                onPaste={handlePaste}
              />
            ) : (
              <textarea
                className="wp-html-editor"
                value={form[`content_${activeTab}`] || ''}
                onChange={(e) => handleChange(`content_${activeTab}`, e.target.value)}
                placeholder={activeTab === 'ru' ? 'HTML контент страницы...' : activeTab === 'en' ? 'Page HTML content...' : 'HTML мундариҷаи саҳифа...'}
              />
            )}
          </div>

          {/* Description (Excerpt) */}
          <div className="wp-excerpt-box">
            <h3>Краткое описание (Excerpt)</h3>
            <p className="wp-excerpt-help">Описание отображается в меню и поисковой выдаче</p>
            <textarea
              className="wp-excerpt-textarea"
              value={form[`description_${activeTab}`] || ''}
              onChange={(e) => handleChange(`description_${activeTab}`, e.target.value)}
              placeholder={activeTab === 'ru' ? 'Введите краткое описание...' : activeTab === 'en' ? 'Enter excerpt...' : 'Тавсифи кӯтоҳ...'}
              rows="3"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="wp-editor-sidebar">
          {/* Publish Box */}
          <div className="wp-sidebar-box">
            <div className="wp-sidebar-box-header">
              <h3>Публикация</h3>
            </div>
            <div className="wp-sidebar-box-content">
              <div className="wp-publish-row">
                <span className="wp-publish-label">Статус:</span>
                <span className="wp-publish-value">
                  {form.isPublished ? 'Опубликовано' : 'Черновик'}
                </span>
                <button
                  className="wp-publish-edit"
                  onClick={() => handleChange('isPublished', !form.isPublished)}
                >
                  Изменить
                </button>
              </div>
              <div className="wp-publish-row">
                <span className="wp-publish-label">Видимость:</span>
                <span className="wp-publish-value">Публичная</span>
              </div>
              <div className="wp-publish-row">
                <span className="wp-publish-label">Дата:</span>
                <span className="wp-publish-value">
                  {form.createdAt ? new Date(form.createdAt).toLocaleDateString('ru-RU') : 'Сейчас'}
                </span>
              </div>
            </div>
            <div className="wp-sidebar-box-footer">
              <button
                className="wp-btn wp-btn-link wp-btn-delete"
                onClick={() => {
                  if (confirm('Удалить эту страницу?')) {
                    // Handle deletion via parent
                  }
                }}
              >
                Удалить
              </button>
              <button
                className="wp-btn wp-btn-primary"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                {form.isPublished ? 'Обновить' : 'Сохранить'}
              </button>
            </div>
          </div>

          {/* Page Attributes */}
          <div className="wp-sidebar-box">
            <div className="wp-sidebar-box-header">
              <h3>Атрибуты страницы</h3>
            </div>
            <div className="wp-sidebar-box-content">
              <div className="wp-field">
                <label>Показать в меню</label>
                <label className="wp-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.showInMenu}
                    onChange={(e) => handleChange('showInMenu', e.target.checked)}
                  />
                  <span>Отображать в навигации сайта</span>
                </label>
              </div>
              <div className="wp-field">
                <label>Порядок в меню</label>
                <input
                  type="number"
                  className="wp-input wp-input-small"
                  value={form.menuOrder || 0}
                  onChange={(e) => handleChange('menuOrder', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <p className="wp-field-help">Чем меньше число, тем выше в меню</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="wp-sidebar-box">
            <div className="wp-sidebar-box-header">
              <h3>Изображение записи</h3>
            </div>
            <div className="wp-sidebar-box-content">
              {form.featured_image ? (
                <div className="wp-featured-image">
                  <img src={form.featured_image} alt="Featured" />
                  <div className="wp-featured-image-actions">
                    <label className="wp-btn wp-btn-small">
                      Заменить
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        hidden
                      />
                    </label>
                    <button className="wp-btn wp-btn-small wp-btn-danger" onClick={removeFeaturedImage}>
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="wp-featured-image-placeholder">
                  <label className="wp-featured-image-upload">
                    {uploadingImage ? (
                      <span>Загрузка...</span>
                    ) : (
                      <>
                        {editorIcons.image}
                        <span>Задать изображение записи</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      disabled={uploadingImage}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="wp-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="wp-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-preview-header">
              <h2>Предпросмотр страницы</h2>
              <button className="wp-preview-close" onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="wp-preview-content">
              <h1>{form[`title_${activeTab}`] || 'Без названия'}</h1>
              <div
                className="wp-preview-body"
                dangerouslySetInnerHTML={{ __html: form[`content_${activeTab}`] || '<p>Нет содержимого</p>' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
