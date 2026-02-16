import { useState, useEffect, useRef } from 'react'
import { useNews, useUpload } from '../hooks/useApi'
import './NewsManager.css'

// WYSIWYG Content Editor for news
function NewsContentEditor({ value, onChange, id }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      const currentContent = value || ''
      if (editorRef.current.innerHTML !== currentContent) {
        editorRef.current.innerHTML = currentContent
      }
    }
  }, [id])

  const applyFormat = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, val)
    }
  }

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    let text = e.clipboardData.getData('text/plain')
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()
    document.execCommand('insertText', false, text)
  }

  const insertLink = () => {
    const url = prompt('Введите URL ссылки:')
    if (!url) return
    const selection = window.getSelection()
    const selectedText = selection.toString()
    if (selectedText) {
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`)
    } else {
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
    }
  }

  return (
    <div>
      <div className="news-editor-toolbar">
        <button type="button" onClick={() => applyFormat('bold')} title="Жирный (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => applyFormat('italic')} title="Курсив (Ctrl+I)">
          <em>I</em>
        </button>
        <button type="button" onClick={() => applyFormat('underline')} title="Подчеркнутый (Ctrl+U)">
          <u>U</u>
        </button>
        <span className="toolbar-divider" />
        <button type="button" onClick={() => applyFormat('formatBlock', 'h2')} title="Заголовок H2">
          H2
        </button>
        <button type="button" onClick={() => applyFormat('formatBlock', 'h3')} title="Заголовок H3">
          H3
        </button>
        <button type="button" onClick={() => applyFormat('formatBlock', 'p')} title="Параграф">
          P
        </button>
        <span className="toolbar-divider" />
        <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Маркированный список">
          &bull; List
        </button>
        <button type="button" onClick={() => applyFormat('insertOrderedList')} title="Нумерованный список">
          1. List
        </button>
        <span className="toolbar-divider" />
        <button type="button" onClick={insertLink} title="Вставить ссылку">
          Link
        </button>
        <button type="button" onClick={() => applyFormat('removeFormat')} title="Очистить форматирование">
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="news-wysiwyg-editor"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />
    </div>
  )
}

// Default news data
const defaultNewsData = [
  {
    slug: 'tajikistan-prepares-un-water-conference',
    category: 'conference',
    title_ru: 'Таджикистан готовится принять водную конференцию ООН',
    title_en: 'Tajikistan prepares to host UN Water Conference',
    title_tj: 'Тоҷикистон омодагӣ мебинад барои қабули конфронси обии СММ',
    excerpt_ru: 'Подготовка к крупнейшему международному событию в сфере водных ресурсов идет полным ходом.',
    excerpt_en: 'Preparations for the largest international event in the field of water resources are in full swing.',
    excerpt_tj: 'Омодагӣ ба бузургтарин чорабинии байналмилалӣ дар соҳаи захираҳои обӣ бо суръати пурра идома дорад.',
    image: '/assets/images/news-conference.jpg',
    published_at: '2026-01-14',
    content_ru: '<p>Республика Таджикистан активно готовится к проведению Четвертой Международной конференции высокого уровня по Международному десятилетию действий «Вода для устойчивого развития» 2018-2028.</p><p>Ожидается участие делегаций из более чем 150 стран мира, включая глав государств и правительств, министров, представителей международных организаций и экспертного сообщества.</p>',
    content_en: '<p>The Republic of Tajikistan is actively preparing to host the Fourth High-Level International Conference on the International Decade for Action "Water for Sustainable Development" 2018-2028.</p><p>Delegations from more than 150 countries are expected to participate, including heads of state and government, ministers, representatives of international organizations and the expert community.</p>',
    content_tj: '<p>Ҷумҳурии Тоҷикистон фаъолона омодагӣ мебинад барои баргузории Конфронси чоруми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор» 2018-2028.</p><p>Интизор меравад, ки ҳайатҳо аз зиёда аз 150 кишвари ҷаҳон иштирок кунанд.</p>'
  },
  {
    slug: 'preliminary-program-published',
    category: 'program',
    title_ru: 'Опубликована предварительная программа мероприятий',
    title_en: 'Preliminary program of events published',
    title_tj: 'Барномаи пешакии чорабиниҳо нашр шуд',
    excerpt_ru: 'Ознакомьтесь с расписанием пленарных заседаний, тематических сессий и культурных мероприятий.',
    excerpt_en: 'Check out the schedule of plenary sessions, thematic sessions and cultural events.',
    excerpt_tj: 'Бо ҷадвали ҷаласаҳои пленарӣ, сессияҳои мавзӯъӣ ва чорабиниҳои фарҳангӣ шинос шавед.',
    image: '/assets/images/news-program.jpg',
    published_at: '2026-01-10',
    content_ru: '<p>Организационный комитет конференции опубликовал предварительную программу мероприятий.</p><p>Программа конференции рассчитана на четыре дня и включает пленарные заседания, тематические сессии и культурные мероприятия.</p>',
    content_en: '<p>The organizing committee of the conference has published the preliminary program of events.</p><p>The conference program spans four days and includes plenary sessions, thematic sessions and cultural events.</p>',
    content_tj: '<p>Кумитаи ташкилии конфронс барномаи пешакии чорабиниҳоро нашр кард.</p><p>Барномаи конфронс ба чор рӯз пешбинӣ шудааст ва дар бар мегирад ҷаласаҳои пленарӣ, сессияҳои мавзӯъӣ ва чорабиниҳои фарҳангӣ.</p>'
  },
  {
    slug: 'registration-open-international-delegations',
    category: 'registration',
    title_ru: 'Открыта регистрация для международных делегаций',
    title_en: 'Registration open for international delegations',
    title_tj: 'Бақайдгирӣ барои ҳайатҳои байналмилалӣ оғоз ёфт',
    excerpt_ru: 'Представители более 150 стран смогут принять участие в конференции.',
    excerpt_en: 'Representatives from more than 150 countries will be able to participate in the conference.',
    excerpt_tj: 'Намояндагони зиёда аз 150 кишвар дар конфронс иштирок карда метавонанд.',
    image: '/assets/images/news-registration.jpg',
    published_at: '2026-01-05',
    content_ru: '<p>Секретариат конференции официально объявил об открытии регистрации для международных делегаций.</p><p>Регистрация осуществляется через официальный портал конференции.</p>',
    content_en: '<p>The conference secretariat has officially announced the opening of registration for international delegations.</p><p>Registration is carried out through the official conference portal.</p>',
    content_tj: '<p>Котибияти конфронс расман дар бораи оғози бақайдгирӣ барои ҳайатҳои байналмилалӣ эълон кард.</p><p>Бақайдгирӣ тавассути портали расмии конфронс анҷом дода мешавад.</p>'
  },
  {
    slug: 'youth-role-water-management',
    category: 'youth',
    title_ru: 'Роль молодежи в управлении водными ресурсами',
    title_en: 'Role of youth in water resource management',
    title_tj: 'Нақши ҷавонон дар идоракунии захираҳои обӣ',
    excerpt_ru: 'Молодые лидеры со всего мира поделятся своим видением устойчивого развития.',
    excerpt_en: 'Young leaders from around the world will share their vision of sustainable development.',
    excerpt_tj: 'Роҳбарони ҷавон аз саросари ҷаҳон дидгоҳи худро оид ба рушди устувор мубодила хоҳанд кард.',
    image: '/assets/images/news-youth.jpg',
    published_at: '2025-12-28',
    content_ru: '<p>В рамках конференции особое внимание будет уделено роли молодежи в решении глобальных водных проблем.</p><p>Молодежный форум соберет молодых лидеров и активистов со всего мира.</p>',
    content_en: '<p>The conference will pay special attention to the role of youth in solving global water problems.</p><p>The youth forum will bring together young leaders and activists from around the world.</p>',
    content_tj: '<p>Дар доираи конфронс таваҷҷуҳи махсус ба нақши ҷавонон дар ҳалли мушкилоти ҷаҳонии обӣ дода хоҳад шуд.</p><p>Форуми ҷавонон роҳбарон ва фаъолони ҷавонро аз саросари ҷаҳон ҷамъ хоҳад овард.</p>'
  }
]

export default function NewsManager() {
  const [news, setNews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('ru')

  const { list, create, update, remove, loading } = useNews()
  const { upload: uploadFile, uploading } = useUpload()

  const [form, setForm] = useState({
    slug: '',
    category: 'conference',
    title_ru: '',
    title_en: '',
    title_tj: '',
    excerpt_ru: '',
    excerpt_en: '',
    excerpt_tj: '',
    content_ru: '',
    content_en: '',
    content_tj: '',
    image: '/assets/images/news-default.png',
    published_at: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    loadNews()
  }, [pagination.page, search])

  const seedDefaultNews = async () => {
    console.log('Seeding default news...')
    for (const newsItem of defaultNewsData) {
      try {
        await create(newsItem)
      } catch (err) {
        console.error('Failed to seed news:', newsItem.slug, err)
      }
    }
  }

  const loadNews = async () => {
    try {
      const data = await list({ page: pagination.page, limit: 10, search })
      // If no news exist, seed default data
      if (data.total === 0 && pagination.page === 1 && !search) {
        await seedDefaultNews()
        const newData = await list({ page: 1, limit: 10, search: '' })
        setNews(newData.items)
        setPagination({
          page: newData.page,
          total: newData.total,
          totalPages: newData.total_pages,
        })
      } else {
        setNews(data.items)
        setPagination({
          page: data.page,
          total: data.total,
          totalPages: data.total_pages,
        })
      }
    } catch (err) {
      console.error('Failed to load news:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await update(editingItem.id, form)
      } else {
        await create(form)
      }
      setShowModal(false)
      resetForm()
      loadNews()
    } catch (err) {
      console.error('Failed to save news:', err)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      slug: item.slug,
      category: item.category,
      title_ru: item.title_ru,
      title_en: item.title_en,
      title_tj: item.title_tj,
      excerpt_ru: item.excerpt_ru,
      excerpt_en: item.excerpt_en,
      excerpt_tj: item.excerpt_tj,
      content_ru: item.content_ru,
      content_en: item.content_en,
      content_tj: item.content_tj,
      image: item.image,
      published_at: item.published_at,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await remove(id)
        loadNews()
      } catch (err) {
        console.error('Failed to delete news:', err)
      }
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setForm({
      slug: '',
      category: 'conference',
      title_ru: '',
      title_en: '',
      title_tj: '',
      excerpt_ru: '',
      excerpt_en: '',
      excerpt_tj: '',
      content_ru: '',
      content_en: '',
      content_tj: '',
      image: '/assets/images/news-default.png',
      published_at: new Date().toISOString().split('T')[0],
    })
    setActiveTab('ru')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const result = await uploadFile(file)
      if (result && (result.url || result.path)) {
        setForm(f => ({ ...f, image: result.url || result.path }))
      }
    } catch (err) {
      console.error('Failed to upload image:', err)
      alert('Ошибка загрузки изображения')
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[а-яёғӣқӯҳҷ]/g, (char) => {
        const map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ғ': 'g', 'ӣ': 'i', 'қ': 'q', 'ӯ': 'u', 'ҳ': 'h', 'ҷ': 'j' }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="news-manager">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Управление новостями</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
        >
          + Добавить новость
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <input
            type="text"
            className="admin-form-input"
            placeholder="Поиск новостей..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>

        {loading && <div className="admin-loading">Загрузка...</div>}

        {!loading && news.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📰</div>
            <p>Новости не найдены</p>
          </div>
        )}

        {!loading && news.length > 0 && (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Заголовок</th>
                  <th>Категория</th>
                  <th>Опубликовано</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="news-title-cell">
                        <img src={item.image} alt="" className="news-thumb" />
                        <div>
                          <div className="news-title">{item.title_ru || item.title_en}</div>
                          <div className="news-slug">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td>{item.published_at}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          Изменить
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Назад
                </button>
                <span className="admin-pagination-info">
                  Страница {pagination.page} из {pagination.totalPages}
                </span>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Вперёд
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingItem ? 'Редактировать новость' : 'Добавить новость'}
              </h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Slug (ЧПУ)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="news-article-slug"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Категория</label>
                    <select
                      className="admin-form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="conference">Конференция</option>
                      <option value="program">Программа</option>
                      <option value="registration">Регистрация</option>
                      <option value="youth">Молодёжь</option>
                      <option value="projects">Проекты</option>
                      <option value="diplomacy">Дипломатия</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Изображение</label>
                    <div className="news-image-upload">
                      {form.image && (
                        <div className="news-image-preview">
                          <img src={form.image} alt="Preview" />
                        </div>
                      )}
                      <div className="news-image-controls">
                        <label className="admin-btn admin-btn-secondary admin-btn-sm news-upload-btn">
                          {uploading ? 'Загрузка...' : 'Загрузить изображение'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={form.image}
                          onChange={(e) => setForm({ ...form, image: e.target.value })}
                          placeholder="Или введите URL вручную"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Дата публикации</label>
                    <input
                      type="date"
                      className="admin-form-input"
                      value={form.published_at}
                      onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-tabs">
                  <button
                    type="button"
                    className={`admin-tab ${activeTab === 'ru' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ru')}
                  >
                    Русский
                  </button>
                  <button
                    type="button"
                    className={`admin-tab ${activeTab === 'en' ? 'active' : ''}`}
                    onClick={() => setActiveTab('en')}
                  >
                    Английский
                  </button>
                  <button
                    type="button"
                    className={`admin-tab ${activeTab === 'tj' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tj')}
                  >
                    Таджикский
                  </button>
                </div>

                {['ru', 'en', 'tj'].map(lang => {
                  const langLabel = lang === 'ru' ? 'Русский' : lang === 'en' ? 'Английский' : 'Таджикский'
                  return activeTab === lang && (
                    <div key={lang}>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Заголовок ({langLabel})</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={form[`title_${lang}`]}
                          onChange={(e) => {
                            const newTitle = e.target.value
                            setForm(f => ({
                              ...f,
                              [`title_${lang}`]: newTitle,
                              ...(lang === 'ru' ? { slug: generateSlug(newTitle) } : {})
                            }))
                          }}
                          required={lang === 'ru'}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Краткое описание ({langLabel})</label>
                        <textarea
                          className="admin-form-textarea"
                          value={form[`excerpt_${lang}`]}
                          onChange={(e) => setForm({ ...form, [`excerpt_${lang}`]: e.target.value })}
                          rows="2"
                          required={lang === 'ru'}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Содержимое ({langLabel})</label>
                        <NewsContentEditor
                          value={form[`content_${lang}`]}
                          onChange={(html) => setForm(f => ({ ...f, [`content_${lang}`]: html }))}
                          id={`${editingItem?.id || 'new'}-${lang}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : editingItem ? 'Обновить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function getCategoryColor(category) {
  const colors = {
    conference: 'info',
    program: 'success',
    registration: 'warning',
    youth: 'info',
    projects: 'success',
    diplomacy: 'info',
  }
  return colors[category] || 'info'
}

function getCategoryLabel(category) {
  const labels = {
    conference: 'Конференция',
    program: 'Программа',
    registration: 'Регистрация',
    youth: 'Молодёжь',
    projects: 'Проекты',
    diplomacy: 'Дипломатия',
  }
  return labels[category] || category
}
