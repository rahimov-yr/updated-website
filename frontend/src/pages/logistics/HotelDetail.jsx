import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LocalizedLink from '../../components/LocalizedLink'
import { useLanguage } from '../../context/LanguageContext'
import { hotels, hotelImages, hotelGallery, amenityIcons } from './Accommodation'
import {
  Star, MapPin, Phone, Globe, ArrowLeft, ArrowRight, DollarSign,
  ChevronLeft, ChevronRight, X, Image as ImageIcon
} from 'lucide-react'
import '../../styles/hotel-detail.css'

const translations = {
  en: {
    back: 'Back to Hotels',
    perNight: 'per night',
    amenities: 'Amenities',
    contact: 'Contact',
    callNow: 'Call Now',
    visitWebsite: 'Visit Website',
    location: 'Location',
    gallery: 'Gallery',
    notFound: 'Hotel not found',
    backToList: 'Back to hotel list'
  },
  ru: {
    back: 'Назад к гостиницам',
    perNight: 'за ночь',
    amenities: 'Удобства',
    contact: 'Контакты',
    callNow: 'Позвонить',
    visitWebsite: 'Перейти на сайт',
    location: 'Расположение',
    gallery: 'Галерея',
    notFound: 'Гостиница не найдена',
    backToList: 'Назад к списку гостиниц'
  },
  tj: {
    back: 'Бозгашт ба меҳмонхонаҳо',
    perNight: 'дар як шаб',
    amenities: 'Шароитҳо',
    contact: 'Тамос',
    callNow: 'Занг задан',
    visitWebsite: 'Ба вебсайт гузаштан',
    location: 'Ҷойгиршавӣ',
    gallery: 'Галерея',
    notFound: 'Меҳмонхона ёфт нашуд',
    backToList: 'Бозгашт ба рӯйхати меҳмонхонаҳо'
  }
}

export default function HotelDetail() {
  const { hotelId } = useParams()
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const idx = Number(hotelId)
  const hotelList = hotels[language] || hotels.en
  const hotel = hotelList[idx]

  // Combine main image + gallery images
  const allImages = hotel ? [hotelImages[idx], ...(hotelGallery[idx] || [])] : []

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % allImages.length)

  if (!hotel) {
    return (
      <section className="htl-detail">
        <div className="container">
          <div className="htl-detail__not-found">
            <p>{t.notFound}</p>
            <LocalizedLink to="/logistics/accommodation" className="htl-detail__back-btn">
              <ArrowLeft size={16} />
              {t.backToList}
            </LocalizedLink>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="htl-detail">
      <div className="htl-detail__hero" onClick={() => openLightbox(0)} role="button" tabIndex={0}>
        <img
          src={hotelImages[idx]}
          alt={hotel.name}
          className="htl-detail__hero-img"
        />
        <div className="htl-detail__hero-overlay" />
        <div className="htl-detail__hero-content">
          <LocalizedLink
            to="/logistics/accommodation"
            className="htl-detail__back"
            onClick={e => e.stopPropagation()}
          >
            <ArrowLeft size={16} />
            {t.back}
          </LocalizedLink>
          <h1 className="htl-detail__title">{hotel.name}</h1>
          <div className="htl-detail__meta">
            <span className="htl-detail__stars">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
              ))}
            </span>
            <span className="htl-detail__rating-badge">
              <Star size={13} fill="currentColor" />
              {hotel.stars}.0
            </span>
          </div>
        </div>
        <div className="htl-detail__hero-gallery-hint">
          <ImageIcon size={16} />
          <span>{allImages.length}</span>
        </div>
      </div>

      <div className="container">
        <div className="htl-detail__body">
          {/* Main Info */}
          <div className="htl-detail__main">
            {/* Price Banner */}
            <div className="htl-detail__price-card">
              <div className="htl-detail__price-icon">
                <DollarSign size={22} />
              </div>
              <div className="htl-detail__price-info">
                <span className="htl-detail__price-value">{hotel.price}</span>
                <span className="htl-detail__price-label">{t.perNight}</span>
              </div>
            </div>

            {/* Description */}
            <p className="htl-detail__desc">{hotel.desc}</p>

            {/* Gallery */}
            <div className="htl-detail__section">
              <h2 className="htl-detail__section-title">
                <ImageIcon size={18} />
                {t.gallery}
              </h2>
              <div className="htl-detail__gallery">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    className={`htl-detail__gallery-item ${i === 0 ? 'htl-detail__gallery-item--main' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img src={src} alt={`${hotel.name} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="htl-detail__section">
              <h2 className="htl-detail__section-title">
                <MapPin size={18} />
                {t.location}
              </h2>
              <p className="htl-detail__address">{hotel.address}</p>
            </div>

            {/* Amenities */}
            <div className="htl-detail__section">
              <h2 className="htl-detail__section-title">{t.amenities}</h2>
              <div className="htl-detail__amenities">
                {hotel.amenities.map(a => {
                  const Icon = amenityIcons[a.key]
                  return (
                    <div className="htl-detail__amenity" key={a.key}>
                      <div className="htl-detail__amenity-icon">
                        <Icon size={20} />
                      </div>
                      <span>{a.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="htl-detail__sidebar">
            <div className="htl-detail__contact-card">
              <h3 className="htl-detail__contact-title">{t.contact}</h3>

              <a
                href={`tel:${hotel.phone.replace(/\s/g, '')}`}
                className="htl-detail__phone-btn"
              >
                <Phone size={18} />
                <div>
                  <span className="htl-detail__phone-label">{t.callNow}</span>
                  <span className="htl-detail__phone-number">{hotel.phone}</span>
                </div>
              </a>

              {hotel.website && (
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="htl-detail__website-btn"
                >
                  <Globe size={18} />
                  {t.visitWebsite}
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="htl-lightbox" onClick={closeLightbox}>
          <button className="htl-lightbox__close" onClick={closeLightbox}>
            <X size={24} />
          </button>
          <button
            className="htl-lightbox__nav htl-lightbox__nav--prev"
            onClick={e => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft size={32} />
          </button>
          <div className="htl-lightbox__content" onClick={e => e.stopPropagation()}>
            <img
              src={allImages[lightboxIndex]}
              alt={`${hotel.name} ${lightboxIndex + 1}`}
              className="htl-lightbox__img"
            />
            <div className="htl-lightbox__counter">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
          <button
            className="htl-lightbox__nav htl-lightbox__nav--next"
            onClick={e => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  )
}
