import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import { useLanguage } from '../context/LanguageContext'
import { exhibitionImages, exhibitionGallery, translations } from './Exhibition'
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X,
  Image as ImageIcon, Users, CheckCircle
} from 'lucide-react'
import '../styles/exhibition-detail.css'

const detailTranslations = {
  en: {
    back: 'Back to Exhibition',
    highlights: 'Key Highlights',
    expectedExhibitors: 'Expected Exhibitors',
    gallery: 'Gallery',
    notFound: 'Exhibition zone not found',
    backToList: 'Back to exhibition'
  },
  ru: {
    back: 'Назад к выставке',
    highlights: 'Основные моменты',
    expectedExhibitors: 'Ожидаемые экспоненты',
    gallery: 'Галерея',
    notFound: 'Зона выставки не найдена',
    backToList: 'Назад к выставке'
  },
  tj: {
    back: 'Бозгашт ба намоишгоҳ',
    highlights: 'Нуктаҳои асосӣ',
    expectedExhibitors: 'Иштирокчиёни интизоршаванда',
    gallery: 'Галерея',
    notFound: 'Минтақаи намоишгоҳ ёфт нашуд',
    backToList: 'Бозгашт ба намоишгоҳ'
  }
}

export default function ExhibitionDetail() {
  const { zoneId } = useParams()
  const { language } = useLanguage()
  const t = detailTranslations[language] || detailTranslations.en
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const idx = Number(zoneId)
  const zones = (translations[language] || translations.en).zones
  const zone = zones[idx]

  const allImages = zone ? [exhibitionImages[idx], ...(exhibitionGallery[idx] || [])] : []

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % allImages.length)

  if (!zone) {
    return (
      <section className="exh-detail">
        <div className="container">
          <div className="exh-detail__not-found">
            <p>{t.notFound}</p>
            <LocalizedLink to="/exhibition" className="exh-detail__back-btn">
              <ArrowLeft size={16} />
              {t.backToList}
            </LocalizedLink>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="exh-detail">
      <div className="exh-detail__hero" onClick={() => openLightbox(0)} role="button" tabIndex={0}>
        <img
          src={exhibitionImages[idx]}
          alt={zone.name}
          className="exh-detail__hero-img"
        />
        <div className="exh-detail__hero-overlay" />
        <div className="exh-detail__hero-content">
          <LocalizedLink
            to="/exhibition"
            className="exh-detail__back"
            onClick={e => e.stopPropagation()}
          >
            <ArrowLeft size={16} />
            {t.back}
          </LocalizedLink>
          <h1 className="exh-detail__title">{zone.name}</h1>
        </div>
        <div className="exh-detail__hero-gallery-hint">
          <ImageIcon size={16} />
          <span>{allImages.length}</span>
        </div>
      </div>

      <div className="container">
        <div className="exh-detail__body">
          {/* Main Content */}
          <div className="exh-detail__main">
            {/* Description */}
            <p className="exh-detail__desc">{zone.fullDesc}</p>

            {/* Gallery */}
            <div className="exh-detail__section">
              <h2 className="exh-detail__section-title">
                <ImageIcon size={18} />
                {t.gallery}
              </h2>
              <div className="exh-detail__gallery">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    className={`exh-detail__gallery-item ${i === 0 ? 'exh-detail__gallery-item--main' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img src={src} alt={`${zone.name} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="exh-detail__section">
              <h2 className="exh-detail__section-title">
                <CheckCircle size={18} />
                {t.highlights}
              </h2>
              <div className="exh-detail__highlights">
                {zone.highlights.map((h, i) => (
                  <div className="exh-detail__highlight" key={i}>
                    <CheckCircle size={16} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="exh-detail__sidebar">
            <div className="exh-detail__info-card">
              <h3 className="exh-detail__info-title">
                <Users size={18} />
                {t.expectedExhibitors}
              </h3>
              <p className="exh-detail__info-text">{zone.exhibitors}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="exh-lightbox" onClick={closeLightbox}>
          <button className="exh-lightbox__close" onClick={closeLightbox}>
            <X size={24} />
          </button>
          <button
            className="exh-lightbox__nav exh-lightbox__nav--prev"
            onClick={e => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft size={32} />
          </button>
          <div className="exh-lightbox__content" onClick={e => e.stopPropagation()}>
            <img
              src={allImages[lightboxIndex]}
              alt={`${zone.name} ${lightboxIndex + 1}`}
              className="exh-lightbox__img"
            />
            <div className="exh-lightbox__counter">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
          <button
            className="exh-lightbox__nav exh-lightbox__nav--next"
            onClick={e => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  )
}
