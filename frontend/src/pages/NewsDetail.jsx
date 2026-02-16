import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'

const stripInlineFontFamily = (html) => {
  if (!html) return ''
  return html.replace(/font-family\s*:[^;"']*(;?)/gi, '')
}

export default function NewsDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const [news, setNews] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/news/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(() => {
        setNews(null)
        setLoading(false)
      })

    fetch('/api/news?limit=4')
      .then(res => res.json())
      .then(data => setRelatedNews(data.filter(n => n.slug !== slug).slice(0, 3)))
      .catch(() => {})
  }, [slug])

  if (loading) return <PageLoader />

  if (!news) {
    return (
      <section className="section news-detail">
        <div className="container">
          <div className="news-detail__not-found">
            <h2>{t('newsSection.notFound')}</h2>
            <LocalizedLink to="/news" className="btn btn--primary">
              {t('newsSection.backToNews')}
            </LocalizedLink>
          </div>
        </div>
      </section>
    )
  }

  const getField = (prefix) => {
    const langSuffix = language === 'en' ? '_en' : language === 'tj' ? '_tj' : '_ru'
    return news[`${prefix}${langSuffix}`] || news[`${prefix}_ru`] || ''
  }

  const title = getField('title')
  const date = news.published_at
  const category = news.category
  const content = getField('content')

  const getRelatedLocalized = (item, field) => {
    if (!item[field]) return ''
    if (typeof item[field] === 'object') {
      return item[field][language] || item[field].ru || ''
    }
    return item[field]
  }

  return (
    <>
      <section className="news-detail__hero">
        <div className="news-detail__hero-bg">
          <img src={news.image} alt={title} />
          <div className="news-detail__hero-overlay"></div>
        </div>
        <div className="container">
          <div className="news-detail__hero-content">
            <button onClick={() => navigate(-1)} className="news-detail__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {t('newsSection.backBtn')}
            </button>
            <div className="news-detail__meta">
              <span className="news-detail__category">{category}</span>
              <span className="news-detail__date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {date}
              </span>
            </div>
            <h1 className="news-detail__title">{title}</h1>
          </div>
        </div>
      </section>

      <section className="section news-detail__content-section">
        <div className="container">
          <div className="news-detail__layout">
            <article className="news-detail__article">
              <div
                className="news-detail__content"
                dangerouslySetInnerHTML={{ __html: stripInlineFontFamily(content) }}
              />

              <div className="news-detail__share">
                <span className="news-detail__share-label">
                  {t('newsSection.share')}
                </span>
                <div className="news-detail__share-buttons">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="news-detail__share-btn" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="news-detail__share-btn" aria-label="Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="news-detail__share-btn" aria-label="Telegram">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="news-detail__share-btn"
                    aria-label="Copy link"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            <aside className="news-detail__sidebar">
              <div className="news-detail__sidebar-section">
                <h3 className="news-detail__sidebar-title">
                  {t('newsSection.otherNews')}
                </h3>
                <div className="news-detail__related">
                  {relatedNews.map((item) => (
                    <LocalizedLink key={item.id} to={`/news/${item.slug}`} className="news-detail__related-item">
                      <div className="news-detail__related-image">
                        <img src={item.image} alt={getRelatedLocalized(item, 'title')} />
                      </div>
                      <div className="news-detail__related-content">
                        <span className="news-detail__related-category">{item.category}</span>
                        <h4 className="news-detail__related-title">{getRelatedLocalized(item, 'title')}</h4>
                        <span className="news-detail__related-date">{item.published_at}</span>
                      </div>
                    </LocalizedLink>
                  ))}
                </div>
              </div>

              <div className="news-detail__sidebar-section">
                <LocalizedLink to="/news" className="btn btn--outline btn--full">
                  {t('newsSection.allNews')}
                </LocalizedLink>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}