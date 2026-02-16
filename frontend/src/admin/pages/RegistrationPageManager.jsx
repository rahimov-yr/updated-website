import { useState, useEffect, useRef } from 'react'
import { useSettings } from '../hooks/useApi'
import './WaterDecadeManager.css'

const BLOCK_TYPES = [
  { type: 'text', label: 'Текстовый блок', icon: 'text' },
  { type: 'info_cards', label: 'Информационные карточки', icon: 'cards' },
  { type: 'note', label: 'Примечание', icon: 'note' },
]

const CARD_ICONS = [
  { value: 'calendar', label: 'Календарь' },
  { value: 'location', label: 'Местоположение' },
  { value: 'people', label: 'Люди' },
  { value: 'info', label: 'Информация' },
  { value: 'link', label: 'Ссылка' },
]

function createBlock(type) {
  const id = Date.now() + Math.random()
  switch (type) {
    case 'text':
      return {
        id, type,
        title_ru: '', title_en: '', title_tj: '',
        content_ru: '', content_en: '', content_tj: '',
      }
    case 'info_cards':
      return {
        id, type,
        title_ru: '', title_en: '', title_tj: '',
        cards: [
          { icon: 'calendar', label_ru: '', label_en: '', label_tj: '', value_ru: '', value_en: '', value_tj: '' },
        ],
      }
    case 'note':
      return {
        id, type,
        content_ru: '', content_en: '', content_tj: '',
      }
    default:
      return { id, type }
  }
}

// Simple text editor with formatting toolbar
function TextEditor({ value, onChange, langTab, blockId }) {
  const editorRef = useRef(null)
  const editorId = `editor-${blockId}-${langTab}`

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || ''
    }
  }, [blockId, langTab])

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
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim()
    document.execCommand('insertText', false, text)
  }

  return (
    <div className="reg-editor-wrapper">
      <div className="html-toolbar">
        <button type="button" onClick={() => applyFormat('bold')} title="Жирный" className="toolbar-btn">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => applyFormat('italic')} title="Курсив" className="toolbar-btn">
          <em>I</em>
        </button>
        <button type="button" onClick={() => applyFormat('underline')} title="Подчеркнутый" className="toolbar-btn">
          <u>U</u>
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => applyFormat('formatBlock', 'h2')} title="Заголовок H2" className="toolbar-btn">
          H2
        </button>
        <button type="button" onClick={() => applyFormat('formatBlock', 'h3')} title="Заголовок H3" className="toolbar-btn">
          H3
        </button>
        <button type="button" onClick={() => applyFormat('formatBlock', 'p')} title="Параграф" className="toolbar-btn">
          P
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Список" className="toolbar-btn">
          &bull;
        </button>
        <button type="button" onClick={() => {
          const url = prompt('Введите URL ссылки:')
          if (url) applyFormat('createLink', url)
        }} title="Ссылка" className="toolbar-btn">
          🔗
        </button>
      </div>
      <div
        key={editorId}
        ref={editorRef}
        contentEditable
        className="html-editor"
        onInput={handleInput}
        onPaste={handlePaste}
        style={{ minHeight: '120px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }}
      />
    </div>
  )
}

export default function RegistrationPageManager({ embedded = false }) {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [langTab, setLangTab] = useState('ru')
  const [draggedIndex, setDraggedIndex] = useState(null)

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  // Page-level settings
  const [pageTitle, setPageTitle] = useState({
    title_ru: 'Регистрация',
    title_en: 'Registration',
    title_tj: 'Бақайдгирӣ',
    subtitle_ru: 'Регистрация участников конференции',
    subtitle_en: 'Conference participant registration',
    subtitle_tj: 'Бақайдгирии иштирокчиёни конфронс',
  })

  // Content blocks
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.registration_page_content) {
        const data = JSON.parse(settingsMap.registration_page_content)
        if (data.title_ru) {
          setPageTitle({
            title_ru: data.title_ru || '',
            title_en: data.title_en || '',
            title_tj: data.title_tj || '',
            subtitle_ru: data.subtitle_ru || '',
            subtitle_en: data.subtitle_en || '',
            subtitle_tj: data.subtitle_tj || '',
          })
        }
        if (data.blocks) {
          setBlocks(data.blocks)
        }
      }
    } catch (err) {
      console.error('Failed to load registration page settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      const data = {
        ...pageTitle,
        blocks,
      }
      await saveSettingsApi({
        registration_page_content: JSON.stringify(data),
      })
      setSaveStatus({ type: 'success', message: 'Сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const addBlock = (type) => {
    setBlocks([...blocks, createBlock(type)])
  }

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBlock = (id) => {
    if (window.confirm('Удалить этот блок?')) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }

  const moveBlock = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= blocks.length) return
    const updated = [...blocks]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setBlocks(updated)
  }

  // Drag and drop
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    moveBlock(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Card management for info_cards blocks
  const addCard = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          cards: [...(b.cards || []), {
            icon: 'info',
            label_ru: '', label_en: '', label_tj: '',
            value_ru: '', value_en: '', value_tj: '',
          }]
        }
      }
      return b
    }))
  }

  const updateCard = (blockId, cardIndex, updates) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const cards = [...(b.cards || [])]
        cards[cardIndex] = { ...cards[cardIndex], ...updates }
        return { ...b, cards }
      }
      return b
    }))
  }

  const removeCard = (blockId, cardIndex) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const cards = [...(b.cards || [])]
        cards.splice(cardIndex, 1)
        return { ...b, cards }
      }
      return b
    }))
  }

  const getBlockTypeLabel = (type) => {
    const found = BLOCK_TYPES.find(bt => bt.type === type)
    return found ? found.label : type
  }

  if (loading) {
    return <div className="section-loading">Загрузка...</div>
  }

  return (
    <div className={`water-decade-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Регистрация</h1>
          <p>Конструктор страницы регистрации</p>
        </div>
        <button className="btn-save" onClick={handleSave}>
          Сохранить все изменения
        </button>
      </div>

      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>×</button>
        </div>
      )}

      {/* Language Tabs */}
      <div className="lang-tabs-simple" style={{ marginBottom: '24px' }}>
        {['ru', 'en', 'tj'].map(lang => (
          <button
            key={lang}
            className={`lang-tab-simple ${langTab === lang ? 'active' : ''}`}
            onClick={() => setLangTab(lang)}
          >
            {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Тоҷикӣ'}
          </button>
        ))}
      </div>

      {/* Page Title Settings */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>Заголовок страницы</h3>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="form-group">
            <label>Заголовок</label>
            <input
              type="text"
              value={pageTitle[`title_${langTab}`] || ''}
              onChange={(e) => setPageTitle({ ...pageTitle, [`title_${langTab}`]: e.target.value })}
              placeholder="Регистрация"
            />
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Подзаголовок</label>
            <input
              type="text"
              value={pageTitle[`subtitle_${langTab}`] || ''}
              onChange={(e) => setPageTitle({ ...pageTitle, [`subtitle_${langTab}`]: e.target.value })}
              placeholder="Описание страницы"
            />
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Блоки контента</h3>
      </div>

      {blocks.length === 0 && (
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>Страница пуста. Добавьте блоки контента.</p>
        </div>
      )}

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="admin-card"
          style={{
            marginBottom: '16px',
            opacity: draggedIndex === index ? 0.5 : 1,
            border: draggedIndex === index ? '2px dashed #3b82f6' : undefined,
          }}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          {/* Block Header */}
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ cursor: 'grab', color: '#94a3b8', fontSize: '18px' }} title="Перетащить">⋮⋮</span>
              <h3 style={{ margin: 0 }}>{getBlockTypeLabel(block.type)}</h3>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => moveBlock(index, index - 1)}
                disabled={index === 0}
                title="Вверх"
              >
                ↑
              </button>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => moveBlock(index, index + 1)}
                disabled={index === blocks.length - 1}
                title="Вниз"
              >
                ↓
              </button>
              <button
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => removeBlock(block.id)}
                title="Удалить блок"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Block Content */}
          <div style={{ padding: '20px' }}>
            {block.type === 'text' && (
              <>
                <div className="form-group">
                  <label>Заголовок (необязательно)</label>
                  <input
                    type="text"
                    value={block[`title_${langTab}`] || ''}
                    onChange={(e) => updateBlock(block.id, { [`title_${langTab}`]: e.target.value })}
                    placeholder="Заголовок блока"
                  />
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Содержимое</label>
                  <TextEditor
                    value={block[`content_${langTab}`] || ''}
                    onChange={(html) => updateBlock(block.id, { [`content_${langTab}`]: html })}
                    langTab={langTab}
                    blockId={block.id}
                  />
                </div>
              </>
            )}

            {block.type === 'info_cards' && (
              <>
                <div className="form-group">
                  <label>Заголовок секции (необязательно)</label>
                  <input
                    type="text"
                    value={block[`title_${langTab}`] || ''}
                    onChange={(e) => updateBlock(block.id, { [`title_${langTab}`]: e.target.value })}
                    placeholder="Информация о конференции"
                  />
                </div>
                <div style={{ marginTop: '16px' }}>
                  {(block.cards || []).map((card, cardIndex) => (
                    <div key={cardIndex} style={{
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      background: '#f8fafc',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Карточка {cardIndex + 1}</span>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => removeCard(block.id, cardIndex)}
                          style={{ fontSize: '12px', padding: '2px 8px' }}
                        >
                          Удалить
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                          <label>Иконка</label>
                          <select
                            value={card.icon || 'info'}
                            onChange={(e) => updateCard(block.id, cardIndex, { icon: e.target.value })}
                          >
                            {CARD_ICONS.map(ci => (
                              <option key={ci.value} value={ci.value}>{ci.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Метка</label>
                          <input
                            type="text"
                            value={card[`label_${langTab}`] || ''}
                            onChange={(e) => updateCard(block.id, cardIndex, { [`label_${langTab}`]: e.target.value })}
                            placeholder="Даты проведения"
                          />
                        </div>
                        <div className="form-group">
                          <label>Значение</label>
                          <input
                            type="text"
                            value={card[`value_${langTab}`] || ''}
                            onChange={(e) => updateCard(block.id, cardIndex, { [`value_${langTab}`]: e.target.value })}
                            placeholder="10-12 июня 2026"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => addCard(block.id)}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    + Добавить карточку
                  </button>
                </div>
              </>
            )}

            {block.type === 'note' && (
              <div className="form-group">
                <label>Текст примечания</label>
                <TextEditor
                  value={block[`content_${langTab}`] || ''}
                  onChange={(html) => updateBlock(block.id, { [`content_${langTab}`]: html })}
                  langTab={langTab}
                  blockId={block.id}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Block Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '20px',
        border: '2px dashed #e2e8f0',
        borderRadius: '12px',
        justifyContent: 'center',
        marginBottom: '24px',
      }}>
        {BLOCK_TYPES.map(bt => (
          <button
            key={bt.type}
            className="admin-btn admin-btn-secondary"
            onClick={() => addBlock(bt.type)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {bt.icon === 'text' && '📝'}
            {bt.icon === 'cards' && '🗂️'}
            {bt.icon === 'note' && 'ℹ️'}
            {bt.label}
          </button>
        ))}
      </div>

      {/* Save Button (bottom) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-save" onClick={handleSave}>
          Сохранить все изменения
        </button>
      </div>
    </div>
  )
}
