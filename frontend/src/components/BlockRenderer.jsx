import { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { PageHero } from './Sections'
import { CalendarIcon, MapPinIcon, UsersIcon, InfoIcon } from './Icons'

// Use local worker bundled by Vite to avoid CORS issues with external CDNs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const langSuffix = (lang) => {
  if (lang === 'en') return '_en'
  if (lang === 'tj') return '_tj'
  return '_ru'
}

// Strip inline font-family from HTML content to ensure site font is used
const stripInlineFontFamily = (html) => {
  if (!html) return ''
  return html.replace(/font-family\s*:[^;"']*(;?)/gi, '')
}

const iconComponents = {
  calendar: CalendarIcon,
  map: MapPinIcon,
  users: UsersIcon,
  info: InfoIcon
}

export default function BlockRenderer({ blocks, language }) {
  const suffix = langSuffix(language)

  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'hero':
            return (
              <PageHero
                key={block.id || index}
                title={block[`title${suffix}`] || block.title_ru || ''}
                subtitle={block[`subtitle${suffix}`] || block.subtitle_ru || ''}
                backgroundImage={block.image}
              />
            )

          case 'text':
            return (
              <section
                key={block.id || index}
                className={`section ${block.background === 'gray' ? 'section--gray' : ''}`}
              >
                <div className="container">
                  <div className="content-text">
                    {block[`heading${suffix}`] && (
                      <h2>{block[`heading${suffix}`]}</h2>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: stripInlineFontFamily(block[`content${suffix}`] || block.content_ru || '')
                      }}
                    />
                  </div>
                </div>
              </section>
            )

          case 'image':
            const getImageMaxWidth = (size) => {
              switch (size) {
                case 'small': return '400px'
                case 'medium': return '800px'
                case 'large': return '1200px'
                case 'full': return '100%'
                default: return '800px'
              }
            }

            const getImageAlignment = (alignment) => {
              switch (alignment) {
                case 'left': return 'flex-start'
                case 'right': return 'flex-end'
                case 'center': return 'center'
                default: return 'center'
              }
            }

            return (
              <section key={block.id || index} className="section">
                <div className="container">
                  {block.url && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: getImageAlignment(block.alignment || 'center')
                    }}>
                      <img
                        src={block.url}
                        alt={block[`alt${suffix}`] || ''}
                        style={{
                          maxWidth: getImageMaxWidth(block.size || 'medium'),
                          width: '100%',
                          height: 'auto',
                          borderRadius: '8px'
                        }}
                      />
                      {block[`caption${suffix}`] && (
                        <p style={{
                          marginTop: '1rem',
                          color: '#6b7280',
                          fontStyle: 'italic',
                          textAlign: block.alignment || 'center',
                          maxWidth: getImageMaxWidth(block.size || 'medium')
                        }}>
                          {block[`caption${suffix}`]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )

          case 'pdf':
            return <PDFViewer key={block.id || index} block={block} suffix={suffix} />

          case 'info_cards':
            return (
              <section key={block.id || index} className="section">
                <div className="container">
                  <div className="excursion-info-grid" style={{ marginTop: '2rem' }}>
                    {(block.cards || []).map((card, cardIndex) => {
                      const IconComponent = iconComponents[card.icon] || InfoIcon
                      return (
                        <div key={card.id || cardIndex} className="excursion-info-card">
                          <div className="excursion-info-icon">
                            <IconComponent width={24} height={24} />
                          </div>
                          <h3>{card[`title${suffix}`] || card.title_ru || ''}</h3>
                          <p>{card[`text${suffix}`] || card.text_ru || ''}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )

          case 'schedule':
            return (
              <section key={block.id || index} className="section section--gray">
                <div className="container">
                  <div className="content-text">
                    {block[`heading${suffix}`] && (
                      <h2>{block[`heading${suffix}`]}</h2>
                    )}
                    <ul style={{ marginTop: '1.5rem' }}>
                      {(block.items || []).map((item, itemIndex) => (
                        <li key={item.id || itemIndex}>
                          {item.time && <strong>{item.time}</strong>}
                          {item.time && ' - '}
                          {item[`text${suffix}`] || item.text_ru || ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )

          case 'list':
            return (
              <section key={block.id || index} className="section">
                <div className="container">
                  <div className="content-text">
                    {block[`heading${suffix}`] && (
                      <h2>{block[`heading${suffix}`]}</h2>
                    )}
                    <ul style={{ marginTop: '1.5rem' }}>
                      {(block[`items${suffix}`] || block.items_ru || []).map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )

          case 'facts':
            return (
              <section key={block.id || index} className="section section--gray">
                <div className="container">
                  <div className="content-text">
                    {block[`heading${suffix}`] && (
                      <h2>{block[`heading${suffix}`]}</h2>
                    )}
                    <ul style={{ marginTop: '1.5rem' }}>
                      {(block[`facts${suffix}`] || block.facts_ru || []).map((fact, factIndex) => (
                        <li key={factIndex}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )

          case 'cta':
            return (
              <section key={block.id || index} className="section">
                <div className="container">
                  <div className="content-text" style={{ textAlign: 'center' }}>
                    {block[`text${suffix}`] && (
                      <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                        {block[`text${suffix}`]}
                      </p>
                    )}
                    {block[`button_text${suffix}`] && block.button_link && (
                      <a href={block.button_link} className="btn btn--primary btn--large">
                        {block[`button_text${suffix}`]}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}

// Custom PDF Viewer Component - Renders PDF as images
function PDFViewer({ block, suffix }) {
  const [numPages, setNumPages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageWidth, setPageWidth] = useState(800)
  const containerRef = useRef(null)

  // Use per-language URL if available, fall back to legacy single URL
  const pdfUrl = block[`url${suffix}`] || block.url || ''

  // Measure actual container width and update on resize
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateWidth = () => {
      const w = el.clientWidth
      if (w > 0) setPageWidth(w)
    }

    updateWidth()

    const ro = new ResizeObserver(updateWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error)
    setLoading(false)
  }

  const hasDescription = block[`description${suffix}`]

  return (
    <section className={`section ${hasDescription ? 'section--pdf' : ''}`} style={{ background: 'white', padding: hasDescription ? undefined : '1rem 0' }}>
      <div className="container">
        {hasDescription && (
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: '700',
              color: '#1e3a5f',
              marginBottom: '0.5rem'
            }}>
              {hasDescription}
            </h2>
          </div>
        )}

        {pdfUrl && (
          <div ref={containerRef} style={{
            margin: '0 auto',
            width: '100%'
          }}>
            {/* Document Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '0.75rem',
              marginBottom: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(pdfUrl)
                    const blob = await res.blob()
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = block[`fileName${suffix}`] || block.fileName_ru || 'document.pdf'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  } catch {
                    window.open(pdfUrl, '_blank')
                  }
                }}
                className="btn btn--primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 20px)',
                  background: '#2d5a87',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1e4268'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2d5a87'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {block[`buttonText${suffix}`] || block.buttonText_ru || 'Download'}
              </button>
            </div>

            {/* PDF Pages as Images */}
            <div style={{
              width: '100%',
              background: 'white',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {loading && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280',
                  fontSize: 'clamp(14px, 2.5vw, 16px)'
                }}>
                  Loading document...
                </div>
              )}

              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
              >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    style={{
                      marginBottom: index < numPages - 1 ? '20px' : '0',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
