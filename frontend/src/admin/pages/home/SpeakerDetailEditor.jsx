import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

// WYSIWYG Editor Component for Biography
function BioEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const applyFormat = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, val)
    }
  }

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML)
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

  return (
    <div className="bio-editor-wrapper">
      <div className="bio-toolbar">
        <button type="button" onClick={() => applyFormat('bold')} title="Жирный"><b>B</b></button>
        <button type="button" onClick={() => applyFormat('italic')} title="Курсив"><i>I</i></button>
        <button type="button" onClick={() => applyFormat('underline')} title="Подчёркнутый"><u>U</u></button>
        <span className="toolbar-divider"></span>
        <button type="button" onClick={() => applyFormat('formatBlock', '<p>')} title="Параграф">P</button>
        <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Список">• List</button>
        <span className="toolbar-divider"></span>
        <button type="button" onClick={() => {
          const url = prompt('URL ссылки:')
          if (url) applyFormat('createLink', url)
        }} title="Ссылка">Link</button>
        <button type="button" onClick={() => applyFormat('removeFormat')} title="Очистить форматирование">Clear</button>
      </div>
      <div
        ref={editorRef}
        className="bio-editor-content"
        contentEditable={true}
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}

// Tags/List Editor Component
function TagsEditor({ value, onChange, placeholder, addButtonText = '+ Добавить' }) {
  const [inputValue, setInputValue] = useState('')

  const items = (() => {
    if (!value) return []
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  const addItem = () => {
    if (!inputValue.trim()) return
    const newItems = [...items, inputValue.trim()]
    onChange(JSON.stringify(newItems))
    setInputValue('')
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems.length > 0 ? JSON.stringify(newItems) : '')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="tags-editor">
      <div className="tags-list">
        {items.map((item, index) => (
          <div key={index} className="tag-item">
            <span className="tag-text">{item}</span>
            <button type="button" className="tag-remove" onClick={() => removeItem(index)}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="tags-input-row">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="tags-input"
        />
        <button type="button" className="tags-add-btn" onClick={addItem}>
          {addButtonText}
        </button>
      </div>
    </div>
  )
}

export default function SpeakerDetailEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [speaker, setSpeaker] = useState(null)
  const [form, setForm] = useState({
    bio_ru: '', bio_en: '', bio_tj: '',
    organization_ru: '', organization_en: '', organization_tj: '',
    country_ru: '', country_en: '', country_tj: '',
    email: '',
    expertise: '',
    achievements: '',
    publications: '',
    session_title_ru: '', session_title_en: '', session_title_tj: '',
    session_time_ru: '', session_time_en: '', session_time_tj: '',
    session_description_ru: '', session_description_en: '', session_description_tj: '',
    clickable: 1,
  })

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
    loadSpeaker()
  }, [id])

  const loadSpeaker = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const data = await apiRequest(`/api/admin/speakers/${id}`)
      console.log('Loaded speaker, clickable from DB:', data.clickable)
      setSpeaker(data)
      setForm({
        bio_ru: data.bio_ru || '',
        bio_en: data.bio_en || '',
        bio_tj: data.bio_tj || '',
        organization_ru: data.organization_ru || '',
        organization_en: data.organization_en || '',
        organization_tj: data.organization_tj || '',
        country_ru: data.country_ru || '',
        country_en: data.country_en || '',
        country_tj: data.country_tj || '',
        email: data.email || '',
        expertise: data.expertise || '',
        achievements: data.achievements || '',
        publications: data.publications || '',
        session_title_ru: data.session_title_ru || '',
        session_title_en: data.session_title_en || '',
        session_title_tj: data.session_title_tj || '',
        session_time_ru: data.session_time_ru || '',
        session_time_en: data.session_time_en || '',
        session_time_tj: data.session_time_tj || '',
        session_description_ru: data.session_description_ru || '',
        session_description_en: data.session_description_en || '',
        session_description_tj: data.session_description_tj || '',
        clickable: data.clickable != null ? Number(data.clickable) : 1,
      })
    } catch (err) {
      console.error('Failed to load speaker:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      // Build explicit payload with only backend-expected fields
      const s = speaker
      const f = form
      const payload = {
        name_ru: s.name_ru,
        name_en: s.name_en,
        name_tj: s.name_tj,
        title_ru: s.title_ru,
        title_en: s.title_en,
        title_tj: s.title_tj,
        bio_ru: f.bio_ru || null,
        bio_en: f.bio_en || null,
        bio_tj: f.bio_tj || null,
        organization_ru: f.organization_ru || null,
        organization_en: f.organization_en || null,
        organization_tj: f.organization_tj || null,
        country_ru: f.country_ru || null,
        country_en: f.country_en || null,
        country_tj: f.country_tj || null,
        email: f.email || null,
        expertise: f.expertise || null,
        achievements: f.achievements || null,
        publications: f.publications || null,
        session_title_ru: f.session_title_ru || null,
        session_title_en: f.session_title_en || null,
        session_title_tj: f.session_title_tj || null,
        session_time_ru: f.session_time_ru || null,
        session_time_en: f.session_time_en || null,
        session_time_tj: f.session_time_tj || null,
        session_description_ru: f.session_description_ru || null,
        session_description_en: f.session_description_en || null,
        session_description_tj: f.session_description_tj || null,
        image: s.image,
        image_source: s.image_source || null,
        image_position: s.image_position || null,
        flag_url: s.flag_url || null,
        flag_alt_ru: s.flag_alt_ru || null,
        flag_alt_en: s.flag_alt_en || null,
        flag_alt_tj: s.flag_alt_tj || null,
        sort_order: s.sort_order,
        clickable: f.clickable,
      }
      console.log('Saving speaker with clickable:', f.clickable, 'payload clickable:', payload.clickable)
      await apiRequest(`/api/admin/speakers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      setSaveStatus({ type: 'success', message: 'Изменения сохранены!' })
      // Reload speaker data to get fresh state from DB
      await loadSpeaker(false)
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save speaker:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="section-panel">
        <div className="loading-state">Загрузка...</div>
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="section-panel">
        <p>Спикер не найден</p>
        <button className="btn-secondary" onClick={() => navigate('/admin/home/speakers')}>Назад</button>
      </div>
    )
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <button
            className="btn-secondary"
            onClick={() => navigate('/admin/home/speakers')}
            style={{padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px'}}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Назад
          </button>
          <div>
            <h2>{speaker.name_ru || speaker.name_en}</h2>
            <p>Подробная информация о спикере</p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
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

      <div className="form-section" style={{background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px 20px'}}>
        <div className="form-group" style={{margin: 0}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500}}>
            <input
              type="checkbox"
              checked={!!form.clickable}
              onChange={(e) => setForm({...form, clickable: e.target.checked ? 1 : 0})}
              style={{width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1890ff'}}
            />
            Открывать страницу спикера при нажатии
          </label>
          <p style={{fontSize: '12px', color: '#8c8c8c', marginTop: '4px', marginLeft: '28px'}}>
            Если выключено, карточка спикера не будет кликабельной
          </p>
        </div>
      </div>

      <div className="form-section">
        <h4>Заголовок раздела</h4>
        <div className="lang-inputs-grid">
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" />
              Русский
            </label>
            <input type="text" value={form.session_title_ru} onChange={(e) => setForm({...form, session_title_ru: e.target.value})} placeholder="Приветственные послания" />
          </div>
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" />
              English
            </label>
            <input type="text" value={form.session_title_en} onChange={(e) => setForm({...form, session_title_en: e.target.value})} placeholder="Welcome Messages" />
          </div>
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" />
              Тоҷикӣ
            </label>
            <input type="text" value={form.session_title_tj} onChange={(e) => setForm({...form, session_title_tj: e.target.value})} placeholder="Паёмҳои хуш омадгӯӣ" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Содержание</h4>
        <div className="lang-inputs-grid bio-editors-grid">
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" />
              Русский
            </label>
            <BioEditor
              value={form.bio_ru}
              onChange={(val) => setForm({...form, bio_ru: val})}
              placeholder="Введите биографию..."
            />
          </div>
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" />
              English
            </label>
            <BioEditor
              value={form.bio_en}
              onChange={(val) => setForm({...form, bio_en: val})}
              placeholder="Enter biography..."
            />
          </div>
          <div className="form-group">
            <label>
              <img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" />
              Тоҷикӣ
            </label>
            <BioEditor
              value={form.bio_tj}
              onChange={(val) => setForm({...form, bio_tj: val})}
              placeholder="Тарҷумаи ҳолро ворид кунед..."
            />
          </div>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingBottom: '24px'}}>
        <button className="btn-secondary" onClick={() => navigate('/admin/home/speakers')}>Отмена</button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}
