import LocalizedLink from '../LocalizedLink'
import { useLanguage } from '../../context/LanguageContext'

export default function NewsCard({ id, slug, title, titleEn, titleTj, date, dateEn, dateTj, image, category, categoryEn, categoryTj, excerpt, excerptEn, excerptTj }) {
  const { language } = useLanguage()

  // Get localized content
  const localizedTitle = language === 'en' && titleEn ? titleEn : language === 'tj' && titleTj ? titleTj : title
  const localizedDate = language === 'en' && dateEn ? dateEn : language === 'tj' && dateTj ? dateTj : date
  const localizedCategory = language === 'en' && categoryEn ? categoryEn : language === 'tj' && categoryTj ? categoryTj : category
  const localizedExcerpt = language === 'en' && excerptEn ? excerptEn : language === 'tj' && excerptTj ? excerptTj : excerpt

  const readMoreText = language === 'ru' ? 'Читать далее' : language === 'en' ? 'Read more' : 'Бештар хондан'

  return (
    <article className="news__card">
      <LocalizedLink to={`/news/${slug}`} className="news__image-link">
        <div className="news__image-container">
          <img
            src={image}
            alt={localizedTitle}
            className="news__image"
          />
          <div className="news__image-overlay"></div>
          {localizedCategory && <span className="news__category">{localizedCategory}</span>}
        </div>
      </LocalizedLink>
      <div className="news__content">
        <div className="news__meta">
          <span className="news__date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {localizedDate}
          </span>
        </div>
        <h3 className="news__title">
          <LocalizedLink to={`/news/${slug}`}>{localizedTitle}</LocalizedLink>
        </h3>
        {localizedExcerpt && <p className="news__excerpt">{localizedExcerpt}</p>}
        <LocalizedLink to={`/news/${slug}`} className="news__link">
          <span>{readMoreText}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </LocalizedLink>
      </div>
    </article>
  )
}
