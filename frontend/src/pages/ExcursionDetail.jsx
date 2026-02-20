import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import { useLanguage } from '../context/LanguageContext'
import { excursionImages, excursionSlugs, excursionGallery, translations } from './Excursions'
import {
  ArrowLeft, ChevronLeft, ChevronRight, X,
  Image as ImageIcon, Info, CheckCircle, Clock, MapPin
} from 'lucide-react'
import '../styles/excursion-detail.css'

const detailTranslations = {
  en: {
    back: 'Back to Excursions',
    highlights: 'Key Highlights',
    practicalInfo: 'Practical Information',
    gallery: 'Gallery',
    notFound: 'Excursion not found',
    backToList: 'Back to excursions',
    schedule: 'Schedule',
    location: 'Location'
  },
  ru: {
    back: 'Назад к экскурсиям',
    highlights: 'Основные моменты',
    practicalInfo: 'Практическая информация',
    gallery: 'Галерея',
    notFound: 'Экскурсия не найдена',
    backToList: 'Назад к экскурсиям',
    schedule: 'Расписание',
    location: 'Расположение'
  },
  tj: {
    back: 'Бозгашт ба экскурсияҳо',
    highlights: 'Нуктаҳои асосӣ',
    practicalInfo: 'Маълумоти амалӣ',
    gallery: 'Галерея',
    notFound: 'Экскурсия ёфт нашуд',
    backToList: 'Бозгашт ба экскурсияҳо',
    schedule: 'Ҷадвал',
    location: 'Ҷойгиршавӣ'
  }
}

export default function ExcursionDetail() {
  const { excursionId } = useParams()
  const { language } = useLanguage()
  const t = detailTranslations[language] || detailTranslations.en
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const idx = excursionSlugs.indexOf(excursionId)
  const destinations = (translations[language] || translations.en).destinations
  const dest = idx >= 0 ? destinations[idx] : null

  const allImages = dest ? [excursionImages[idx], ...(excursionGallery[idx] || [])] : []

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % allImages.length)

  if (!dest) {
    return (
      <section className="exc-detail">
        <div className="container">
          <div className="exc-detail__not-found">
            <p>{t.notFound}</p>
            <LocalizedLink to="/excursions" className="exc-detail__back-btn">
              <ArrowLeft size={16} />
              {t.backToList}
            </LocalizedLink>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="exc-detail">
      <div className="exc-detail__hero" onClick={() => openLightbox(0)} role="button" tabIndex={0}>
        <img
          src={excursionImages[idx]}
          alt={dest.name}
          className="exc-detail__hero-img"
        />
        <div className="exc-detail__hero-overlay" />
        <div className="exc-detail__hero-content">
          <LocalizedLink
            to="/excursions"
            className="exc-detail__back"
            onClick={e => e.stopPropagation()}
          >
            <ArrowLeft size={16} />
            {t.back}
          </LocalizedLink>
          <h1 className="exc-detail__title">{dest.name}</h1>
        </div>
        <div className="exc-detail__hero-gallery-hint">
          <ImageIcon size={16} />
          <span>{allImages.length}</span>
        </div>
      </div>

      <div className="container">
        <div className="exc-detail__body">
          {/* Main Content */}
          <div className="exc-detail__main">
            {/* Description */}
            <p className="exc-detail__desc">{dest.fullDesc}</p>

            {/* Gallery */}
            <div className="exc-detail__section">
              <h2 className="exc-detail__section-title">
                <ImageIcon size={18} />
                {t.gallery}
              </h2>
              <div className="exc-detail__gallery">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    className={`exc-detail__gallery-item ${i === 0 ? 'exc-detail__gallery-item--main' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img src={src} alt={`${dest.name} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="exc-detail__section">
              <h2 className="exc-detail__section-title">
                <CheckCircle size={18} />
                {t.highlights}
              </h2>
              <div className="exc-detail__highlights">
                {dest.highlights.map((h, i) => (
                  <div className="exc-detail__highlight" key={i}>
                    <CheckCircle size={16} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="exc-detail__sidebar">
            <div className="exc-detail__info-card">
              <h3 className="exc-detail__info-title">
                <Info size={18} />
                {t.practicalInfo}
              </h3>
              <div className="exc-detail__info-meta">
                <div className="exc-detail__info-row">
                  <Clock size={15} />
                  <div>
                    <span className="exc-detail__info-label">{t.schedule}</span>
                    <span className="exc-detail__info-value">{dest.duration}</span>
                  </div>
                </div>
                <div className="exc-detail__info-row">
                  <MapPin size={15} />
                  <div>
                    <span className="exc-detail__info-label">{t.location}</span>
                    <span className="exc-detail__info-value">{dest.distance}</span>
                  </div>
                </div>
              </div>
              <p className="exc-detail__info-text">{dest.info}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="exc-lightbox" onClick={closeLightbox}>
          <button className="exc-lightbox__close" onClick={closeLightbox}>
            <X size={24} />
          </button>
          <button
            className="exc-lightbox__nav exc-lightbox__nav--prev"
            onClick={e => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft size={32} />
          </button>
          <div className="exc-lightbox__content" onClick={e => e.stopPropagation()}>
            <img
              src={allImages[lightboxIndex]}
              alt={`${dest.name} ${lightboxIndex + 1}`}
              className="exc-lightbox__img"
            />
            <div className="exc-lightbox__counter">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
          <button
            className="exc-lightbox__nav exc-lightbox__nav--next"
            onClick={e => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  )
}
