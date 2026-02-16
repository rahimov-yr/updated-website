import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import {
  Save, Layout, FileText, Image as ImageIcon, Grid3x3,
  Clock, List, Lightbulb, Megaphone, GripVertical,
  ChevronDown, ChevronUp, Copy, Trash2, Plus, Upload,
  Calendar, MapPin, Users, Info, ArrowLeft
} from 'lucide-react'
import { useSettings } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import './EventsManager.css'

const API_URL = import.meta.env.VITE_API_URL || ''

// Text Editor Component
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

  const handleClick = (e) => {
    const clickedLink = e.target.closest('a')
    if (clickedLink) {
      e.preventDefault()
      editLink(clickedLink)
    }
  }

  const editLink = (linkElement) => {
    const currentUrl = linkElement.getAttribute('href') || ''
    const currentTarget = linkElement.getAttribute('target')

    const newUrl = prompt('Редактировать URL ссылки:', currentUrl)
    if (newUrl === null) return

    const openInNewTab = window.confirm(
      `Открыть ссылку в новой вкладке?\n\nТекущее значение: ${currentTarget === '_blank' ? 'Да' : 'Нет'}`
    )

    linkElement.setAttribute('href', newUrl)
    if (openInNewTab) {
      linkElement.setAttribute('target', '_blank')
      linkElement.setAttribute('rel', 'noopener noreferrer')
    } else {
      linkElement.removeAttribute('target')
      linkElement.removeAttribute('rel')
    }

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
      const linkHtml = openInNewTab
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`
        : `<a href="${url}">${selectedText}</a>`
      document.execCommand('insertHTML', false, linkHtml)
    } else {
      const linkHtml = openInNewTab
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        : `<a href="${url}">${url}</a>`
      document.execCommand('insertHTML', false, linkHtml)
    }
  }

  return (
    <>
      <div className="html-toolbar">
        <button type="button" onClick={() => applyFormat('formatBlock', 'p')} title="Параграф" className="toolbar-btn">
          <FileText size={16} /> P
        </button>
        <button type="button" onClick={() => applyFormat('bold')} title="Жирный (Ctrl+B)" className="toolbar-btn">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => applyFormat('italic')} title="Курсив (Ctrl+I)" className="toolbar-btn">
          <em>I</em>
        </button>
        <button type="button" onClick={() => applyFormat('underline')} title="Подчеркнутый (Ctrl+U)" className="toolbar-btn">
          <u>U</u>
        </button>
        <button type="button" onClick={() => applyFormat('strikeThrough')} title="Зачеркнутый" className="toolbar-btn">
          <s>S</s>
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => applyFormat('formatBlock', 'h2')} title="Заголовок H2" className="toolbar-btn">
          H2
        </button>
        <button type="button" onClick={() => applyFormat('formatBlock', 'h3')} title="Заголовок H3" className="toolbar-btn">
          H3
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => applyFormat('justifyLeft')} title="По левому краю" className="toolbar-btn">
          ≡
        </button>
        <button type="button" onClick={() => applyFormat('justifyCenter')} title="По центру" className="toolbar-btn">
          ≣
        </button>
        <button type="button" onClick={() => applyFormat('justifyRight')} title="По правому краю" className="toolbar-btn">
          ≡
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Маркированный список" className="toolbar-btn">
          • List
        </button>
        <button type="button" onClick={() => applyFormat('insertOrderedList')} title="Нумерованный список" className="toolbar-btn">
          1. List
        </button>
        <button type="button" onClick={() => applyFormat('indent')} title="Увеличить отступ" className="toolbar-btn">
          →
        </button>
        <button type="button" onClick={() => applyFormat('outdent')} title="Уменьшить отступ" className="toolbar-btn">
          ←
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
        <button type="button" onClick={() => insertLink()} title="Ссылка" className="toolbar-btn">
          Link
        </button>
        <button type="button" onClick={() => applyFormat('insertHTML', '<br>')} title="Перенос строки" className="toolbar-btn">
          BR
        </button>
        <button type="button" onClick={() => applyFormat('removeFormat')} title="Удалить форматирование" className="toolbar-btn">
          Clear
        </button>
      </div>

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
          lineHeight: '1.8',
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

// Block types
const BLOCK_TYPES = [
  { type: 'hero', name: 'Hero', icon: Layout, desc: 'Большой заголовок с фоном' },
  { type: 'text', name: 'Текст', icon: FileText, desc: 'Текстовый блок с HTML' },
  { type: 'image', name: 'Изображение', icon: ImageIcon, desc: 'Одно изображение' },
  { type: 'info_cards', name: 'Инфо-карточки', icon: Grid3x3, desc: 'Карточки с информацией' },
  { type: 'schedule', name: 'Расписание', icon: Clock, desc: 'График мероприятий' },
  { type: 'list', name: 'Список', icon: List, desc: 'Маркированный список' },
  { type: 'facts', name: 'Факты', icon: Lightbulb, desc: 'Интересные факты' },
  { type: 'cta', name: 'CTA', icon: Megaphone, desc: 'Призыв к действию' }
]

const INFO_CARD_ICONS = {
  calendar: Calendar,
  map: MapPin,
  users: Users,
  info: Info
}

const DEFAULT_SETTINGS_KEY = 'water_decade_details_page'

export default function WaterDecadePageEditor() {
  const navigate = useNavigate()
  const { confId } = useParams()
  const { token } = useAuth()
  const settingsKey = confId ? `water_decade_conf_page_${confId}` : DEFAULT_SETTINGS_KEY
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [langTab, setLangTab] = useState('ru')
  const [pageBlocks, setPageBlocks] = useState([])
  const [expandedBlock, setExpandedBlock] = useState(null)

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  useEffect(() => {
    loadPageData()
  }, [settingsKey])

  const loadPageData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const pageData = settings.find(s => s.setting_key === settingsKey)
      if (pageData && pageData.setting_value) {
        const parsed = JSON.parse(pageData.setting_value)
        setPageBlocks(parsed.blocks || [])
      } else {
        setPageBlocks([])
      }
    } catch (error) {
      console.error('Error loading page data:', error)
      setPageBlocks([])
    }
    setLoading(false)
  }

  const savePage = async () => {
    setSaveStatus('saving')
    try {
      const pageData = { blocks: pageBlocks }
      const jsonData = JSON.stringify(pageData)
      await saveSettingsApi(settingsKey, jsonData)
      setSaveStatus('success')
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
    return filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\d+/g, '')
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
        updateBlock(blockId, { image: data.url || data.path })
      } else {
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
                <label>Alt текст</label>
                <input
                  type="text"
                  value={block[`alt_${langTab}`] || ''}
                  onChange={(e) => updateBlock(block.id, { [`alt_${langTab}`]: e.target.value })}
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
          <button
            onClick={() => navigate(confId ? '/admin/pages?page=water-decade' : '/admin/pages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          <h2>{confId ? `Страница конференции #${confId}` : 'Подробнее о десятилетии'}</h2>
        </div>
        <div className="topbar-right">
          <a
            href={confId ? `/water-decade/${confId}` : '/water-decade-details'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-preview-page"
            style={{
              marginRight: '12px',
              padding: '8px 16px',
              background: '#f3f4f6',
              borderRadius: '8px',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Просмотр страницы
          </a>
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
                                      <BlockIcon size={18} />
                                    </span>
                                    <span className="block-type-label">
                                      {getBlockName(block.type)}: {getBlockPreview(block)}
                                    </span>
                                  </div>
                                  <div className="block-header-right">
                                    <button
                                      className="block-action-btn"
                                      onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
                                      title={expandedBlock === block.id ? 'Свернуть' : 'Развернуть'}
                                    >
                                      {expandedBlock === block.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    <button
                                      className="block-action-btn"
                                      onClick={() => duplicateBlock(block.id)}
                                      title="Дублировать"
                                    >
                                      <Copy size={18} />
                                    </button>
                                    <button
                                      className="block-action-btn delete"
                                      onClick={() => deleteBlock(block.id)}
                                      title="Удалить"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>

                                {/* Block Content */}
                                {expandedBlock === block.id && (
                                  <div className="block-body">
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
