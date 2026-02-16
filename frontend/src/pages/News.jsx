import { useState, useEffect } from 'react'
import LocalizedLink from '../components/LocalizedLink'
import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import usePageBanner from '../hooks/usePageBanner'

export default function News() {
  const { language, t } = useLanguage()
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news?limit=50')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(() => {})
      .finally(() => setNewsLoading(false))
  }, [])

  const banner = usePageBanner('news', {
    title: { ru: 'Новости', en: 'News', tj: 'Навидҳо' },
    subtitle: { ru: 'Последние новости конференции', en: 'Latest Conference News', tj: 'Навидҳои охирини конфронс' }
  })

  const getLocalized = (item, field) => {
    if (!item[field]) return ''
    if (typeof item[field] === 'object') {
      return item[field][language] || item[field].ru || ''
    }
    return item[field]
  }

  return (
    <>
      {banner.showBanner && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}

      {newsLoading ? (
        <PageLoader />
      ) : (
      <section className="section news-page">
        <div className="container">
          <div className="news-page__grid">
            {news.map((item) => (
              <article key={item.id} className="news-page__card">
                <LocalizedLink to={`/news/${item.slug}`} className="news-page__image-link">
                  <div className="news-page__image-container">
                    <img
                      src={item.image}
                      alt={getLocalized(item, 'title')}
                      className="news-page__image"
                    />
                    <div className="news-page__image-overlay"></div>
                    <span className="news-page__category">{item.category}</span>
                  </div>
                </LocalizedLink>
                <div className="news-page__content">
                  <div className="news-page__meta">
                    <span className="news-page__date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {item.published_at}
                    </span>
                  </div>
                  <h3 className="news-page__title">
                    <LocalizedLink to={`/news/${item.slug}`}>{getLocalized(item, 'title')}</LocalizedLink>
                  </h3>
                  <p className="news-page__excerpt">{getLocalized(item, 'excerpt')}</p>
                  <LocalizedLink to={`/news/${item.slug}`} className="news-page__link">
                    <span>{t('newsSection.readMore')}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </LocalizedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  )
}