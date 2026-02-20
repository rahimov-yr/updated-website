import { useState, useMemo } from 'react'
import LocalizedLink from '../../components/LocalizedLink'
import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Star, MapPin, Phone, Globe, ArrowRight,
  Waves, Sparkles, Wifi, UtensilsCrossed, Dumbbell, Coffee, Briefcase, Car
} from 'lucide-react'
import '../../styles/accommodation-infographic.css'

export const hotelImages = [
  '/assets/images/hotels/hyatt-regency.jpg',
  '/assets/images/hotels/hilton.jpg',
  '/assets/images/hotels/serena.jpg',
  '/assets/images/hotels/rumi.jpg',
  '/assets/images/hotels/lotte-palace.jpg',
  '/assets/images/hotels/tajikistan.jpg',
  '/assets/images/hotels/atlas.jpg',
  '/assets/images/hotels/safar.jpg',
  '/assets/images/hotels/asia-grand.jpg',
  '/assets/images/hotels/meridian.jpg'
]

const G = '/assets/images/hotels/gallery'

export const hotelGallery = [
  // 0 - Hyatt Regency
  [`${G}/lobby-1.jpg`, `${G}/pool-1.jpg`, `${G}/room-1.jpg`, `${G}/restaurant-1.jpg`],
  // 1 - Hilton
  [`${G}/lobby-2.jpg`, `${G}/pool-2.jpg`, `${G}/room-2.jpg`, `${G}/spa-1.jpg`],
  // 2 - Serena
  [`${G}/lobby-3.jpg`, `${G}/pool-1.jpg`, `${G}/room-3.jpg`, `${G}/restaurant-2.jpg`],
  // 3 - Rumi
  [`${G}/lobby-1.jpg`, `${G}/room-2.jpg`, `${G}/restaurant-1.jpg`, `${G}/lobby-2.jpg`],
  // 4 - Lotte Palace
  [`${G}/lobby-3.jpg`, `${G}/gym-1.jpg`, `${G}/room-1.jpg`, `${G}/restaurant-2.jpg`],
  // 5 - Hotel Tajikistan
  [`${G}/lobby-2.jpg`, `${G}/room-3.jpg`, `${G}/restaurant-1.jpg`, `${G}/lobby-1.jpg`],
  // 6 - Atlas
  [`${G}/pool-2.jpg`, `${G}/gym-1.jpg`, `${G}/room-2.jpg`, `${G}/lobby-3.jpg`],
  // 7 - Safar
  [`${G}/pool-1.jpg`, `${G}/spa-1.jpg`, `${G}/room-1.jpg`, `${G}/restaurant-2.jpg`],
  // 8 - Asia Grand
  [`${G}/lobby-1.jpg`, `${G}/room-3.jpg`, `${G}/restaurant-1.jpg`, `${G}/lobby-2.jpg`],
  // 9 - Meridian
  [`${G}/lobby-3.jpg`, `${G}/room-2.jpg`, `${G}/restaurant-2.jpg`, `${G}/lobby-1.jpg`]
]

export const amenityIcons = {
  pool: Waves,
  spa: Sparkles,
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  breakfast: Coffee,
  business: Briefcase,
  parking: Car
}

export default function Accommodation() {
  const { language } = useLanguage()
  const { loading } = useSettings()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStars, setActiveStars] = useState('all')

  const banner = usePageBanner('logistics-accommodation', {
    title: { ru: 'Размещение в гостинице', en: 'Hotel Accommodation', tj: 'Ҷойгиршавӣ дар меҳмонхона' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_accommodation')

  const t = translations[language] || translations.en

  const filtered = useMemo(() => {
    return t.hotels
      .map((hotel, i) => ({ ...hotel, _idx: i }))
      .filter(h => {
        if (activeCategory !== 'all' && h.categoryKey !== activeCategory) return false
        if (activeStars !== 'all' && h.stars !== Number(activeStars)) return false
        return true
      })
  }, [t.hotels, activeCategory, activeStars])

  if (loading) return <PageLoader />

  return (
    <>
      {banner.showBanner && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}

      <section className="acc-hotels">
        <div className="container">

          {/* Filters */}
          <div className="acc-filters">
            <div className="acc-filters__tabs">
              {t.categories.map(cat => (
                <button
                  key={cat.key}
                  className={`acc-filters__tab ${activeCategory === cat.key ? 'acc-filters__tab--active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="acc-filters__stars">
              {t.starFilters.map(sf => (
                <button
                  key={sf.key}
                  className={`acc-filters__star-btn ${activeStars === sf.key ? 'acc-filters__star-btn--active' : ''}`}
                  onClick={() => setActiveStars(sf.key)}
                >
                  {sf.key !== 'all' && <Star size={11} fill="currentColor" />}
                  {sf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="acc-hotels__grid">
            {filtered.map(hotel => (
              <LocalizedLink
                to={`/logistics/accommodation/${hotel._idx}`}
                className="acc-hotel-card-link"
                key={hotel._idx}
              >
                <div className="acc-hotel-card">
                  <div className="acc-hotel-card__img-wrap">
                    <img
                      src={hotelImages[hotel._idx]}
                      alt={hotel.name}
                      className="acc-hotel-card__img"
                      loading="lazy"
                    />
                  </div>

                  <div className="acc-hotel-card__accent" />

                  <div className="acc-hotel-card__body">
                    <div className="acc-hotel-card__row">
                      <h3 className="acc-hotel-card__name">{hotel.name}</h3>
                      <span className="acc-hotel-card__rating">
                        <Star size={12} fill="currentColor" />
                        {hotel.stars}.0
                      </span>
                    </div>

                    <div className="acc-hotel-card__location">
                      <MapPin size={13} />
                      <span>{hotel.address}</span>
                    </div>

                    {/* Price */}
                    <div className="acc-hotel-card__price">
                      <span>{hotel.price}</span>
                      <span className="acc-hotel-card__price-label">{t.perNight}</span>
                    </div>

                    <p className="acc-hotel-card__desc">{hotel.desc}</p>

                    {/* Amenities */}
                    <div className="acc-hotel-card__amenities">
                      {hotel.amenities.map(a => {
                        const Icon = amenityIcons[a.key]
                        return (
                          <span className="acc-hotel-card__amenity" key={a.key}>
                            <Icon size={13} />
                            {a.label}
                          </span>
                        )
                      })}
                    </div>

                    {/* Footer */}
                    <div className="acc-hotel-card__footer">
                      <span className="acc-hotel-card__contact">
                        <Phone size={13} />
                        {hotel.phone}
                      </span>
                      {hotel.website && (
                        <span className="acc-hotel-card__link">
                          <Globe size={13} />
                          {t.visitWebsite}
                          <ArrowRight size={13} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="acc-hotels__empty">{t.noResults}</p>
          )}
        </div>
      </section>
    </>
  )
}

/* ── Amenities per hotel (language-independent keys) ── */
export const hotelAmenities = [
  ['pool', 'spa', 'gym', 'restaurant', 'wifi'],       // Hyatt
  ['pool', 'spa', 'gym', 'restaurant', 'wifi'],       // Hilton
  ['pool', 'spa', 'breakfast', 'restaurant', 'wifi'],  // Serena
  ['restaurant', 'business', 'wifi', 'parking'],       // Rumi
  ['gym', 'restaurant', 'business', 'wifi', 'parking'],// Lotte
  ['restaurant', 'business', 'wifi', 'parking'],       // Tajikistan
  ['pool', 'gym', 'business', 'restaurant', 'wifi'],   // Atlas
  ['pool', 'spa', 'restaurant', 'wifi'],               // Safar
  ['restaurant', 'wifi', 'parking'],                   // Asia Grand
  ['restaurant', 'wifi', 'parking']                    // Meridian
]

export const amenityLabels = {
  en: { pool: 'Pool', spa: 'Spa', wifi: 'WiFi', restaurant: 'Restaurant', gym: 'Gym', breakfast: 'Breakfast', business: 'Business Center', parking: 'Parking' },
  ru: { pool: 'Бассейн', spa: 'Спа', wifi: 'WiFi', restaurant: 'Ресторан', gym: 'Зал', breakfast: 'Завтрак', business: 'Бизнес-центр', parking: 'Парковка' },
  tj: { pool: 'Ҳавз', spa: 'Спа', wifi: 'WiFi', restaurant: 'Ресторан', gym: 'Зал', breakfast: 'Субҳона', business: 'Бизнес-марказ', parking: 'Паркинг' }
}

export function buildHotels(base, lang) {
  const labels = amenityLabels[lang] || amenityLabels.en
  return base.map((h, i) => ({
    ...h,
    amenities: hotelAmenities[i].map(key => ({ key, label: labels[key] }))
  }))
}

/* ── Hotel data ── */
export const hotelsBase = {
  en: [
    { name: 'Hyatt Regency Dushanbe', stars: 5, categoryKey: 'luxury', price: '1 960 – 3 815 TJS', desc: 'Premium lakeside hotel in the heart of Dushanbe with world-class amenities, multiple restaurants, and a stunning rooftop pool.', address: '26/1 Ismoili Somoni Ave', phone: '+992 48 702 1234', website: 'https://www.hyatt.com/hyatt-regency/en-US/dushr-hyatt-regency-dushanbe' },
    { name: 'Hilton Dushanbe', stars: 5, categoryKey: 'luxury', price: '1 635 – 3 270 TJS', desc: 'International luxury hotel featuring elegant rooms, a full-service spa and wellness centre, indoor heated pool.', address: '50 Rudaki Ave', phone: '+992 44 620 0000', website: 'https://www.hilton.com/en/hotels/dybhihi-hilton-dushanbe/' },
    { name: 'Dushanbe Serena Hotel', stars: 5, categoryKey: 'luxury', price: '1 526 – 3 052 TJS', desc: 'Renowned Serena Hotels chain with beautifully appointed rooms, celebrated rooftop pool and bar, spa facilities.', address: '14 Rudaki Ave', phone: '+992 48 700 1515', website: 'https://www.serenahotels.com/dushanbe' },
    { name: 'The Rumi Hotel & Residences', stars: 5, categoryKey: 'luxury', price: '1 308 – 2 725 TJS', desc: 'Modern boutique hotel blending contemporary design with Central Asian hospitality and conference facilities.', address: '1 Bokhtar St', phone: '+992 44 640 5050', website: null },
    { name: 'Lotte Palace Dushanbe', stars: 5, categoryKey: 'luxury', price: '1 417 – 2 943 TJS', desc: 'Upscale hotel with spacious rooms, panoramic city views, fitness facilities, and international cuisine.', address: '5/1 Aini St', phone: '+992 37 236 9800', website: null },
    { name: 'Hotel Tajikistan', stars: 4, categoryKey: 'business', price: '654 – 1 308 TJS', desc: 'Iconic landmark hotel in central Dushanbe with conference halls and easy access to government offices.', address: '22 Shotemur St', phone: '+992 37 221 7580', website: null },
    { name: 'Atlas Hotel Dushanbe', stars: 4, categoryKey: 'business', price: '763 – 1 526 TJS', desc: 'Modern business hotel with state-of-the-art business centre, indoor pool, and meeting rooms.', address: '2 Bukhoro St', phone: '+992 48 701 0101', website: null },
    { name: 'Safar Hotel', stars: 4, categoryKey: 'business', price: '709 – 1 417 TJS', desc: 'Well-appointed hotel featuring a swimming pool, spa services, and convenient business district location.', address: '36 Rudaki Ave', phone: '+992 37 227 3300', website: null },
    { name: 'Asia Grand Hotel', stars: 4, categoryKey: 'comfort', price: '600 – 1 199 TJS', desc: 'Centrally located near the Monument of Ismail Samani with well-furnished rooms and restaurant.', address: '83 Rudaki Ave', phone: '+992 37 224 5000', website: null },
    { name: 'Meridian Hotel Dushanbe', stars: 4, categoryKey: 'comfort', price: '490 – 981 TJS', desc: 'Comfortable mid-range hotel with modern amenities and great location for cultural exploration.', address: '10 Mirzo Tursunzoda St', phone: '+992 37 235 0707', website: null }
  ],
  ru: [
    { name: 'Hyatt Regency Душанбе', stars: 5, categoryKey: 'luxury', price: '1 960 – 3 815 TJS', desc: 'Премиальный отель на берегу озера в центре Душанбе с ресторанами и потрясающим бассейном на крыше.', address: 'пр. Исмоили Сомони 26/1', phone: '+992 48 702 1234', website: 'https://www.hyatt.com/hyatt-regency/en-US/dushr-hyatt-regency-dushanbe' },
    { name: 'Hilton Душанбе', stars: 5, categoryKey: 'luxury', price: '1 635 – 3 270 TJS', desc: 'Международный люксовый отель с элегантными номерами, спа-центром и крытым подогреваемым бассейном.', address: 'пр. Рудаки 50', phone: '+992 44 620 0000', website: 'https://www.hilton.com/en/hotels/dybhihi-hilton-dushanbe/' },
    { name: 'Душанбе Серена Отель', stars: 5, categoryKey: 'luxury', price: '1 526 – 3 052 TJS', desc: 'Знаменитая сеть Serena Hotels с прекрасными номерами, бассейном и баром на крыше, спа-услуги.', address: 'пр. Рудаки 14', phone: '+992 48 700 1515', website: 'https://www.serenahotels.com/dushanbe' },
    { name: 'The Rumi Hotel & Residences', stars: 5, categoryKey: 'luxury', price: '1 308 – 2 725 TJS', desc: 'Современный бутик-отель, сочетающий дизайн с центральноазиатским гостеприимством и конференц-залами.', address: 'ул. Бохтар 1', phone: '+992 44 640 5050', website: null },
    { name: 'Lotte Palace Душанбе', stars: 5, categoryKey: 'luxury', price: '1 417 – 2 943 TJS', desc: 'Элитный отель с просторными номерами, панорамным видом, фитнес-залом и ресторанами.', address: 'ул. Айни 5/1', phone: '+992 37 236 9800', website: null },
    { name: 'Гостиница Таджикистан', stars: 4, categoryKey: 'business', price: '654 – 1 308 TJS', desc: 'Легендарный отель в центре Душанбе с конференц-залами и удобным доступом к госучреждениям.', address: 'ул. Шотемур 22', phone: '+992 37 221 7580', website: null },
    { name: 'Atlas Hotel Душанбе', stars: 4, categoryKey: 'business', price: '763 – 1 526 TJS', desc: 'Современный бизнес-отель с бизнес-центром, крытым бассейном и конференц-залами.', address: 'ул. Бухоро 2', phone: '+992 48 701 0101', website: null },
    { name: 'Отель Safar', stars: 4, categoryKey: 'business', price: '709 – 1 417 TJS', desc: 'Благоустроенный отель с бассейном, спа-услугами и удобным расположением в деловом центре.', address: 'пр. Рудаки 36', phone: '+992 37 227 3300', website: null },
    { name: 'Asia Grand Hotel', stars: 4, categoryKey: 'comfort', price: '600 – 1 199 TJS', desc: 'Отель в центре города рядом с памятником Исмоилу Сомони с благоустроенными номерами.', address: 'пр. Рудаки 83', phone: '+992 37 224 5000', website: null },
    { name: 'Meridian Hotel Душанбе', stars: 4, categoryKey: 'comfort', price: '490 – 981 TJS', desc: 'Комфортабельный отель с современными удобствами и отличным расположением для знакомства с городом.', address: 'ул. Мирзо Турсунзода 10', phone: '+992 37 235 0707', website: null }
  ],
  tj: [
    { name: 'Hyatt Regency Душанбе', stars: 5, categoryKey: 'luxury', price: '1 960 – 3 815 TJS', desc: 'Меҳмонхонаи олӣ дар соҳили кӯл дар маркази Душанбе бо чанд ресторан ва ҳавзи шиноварӣ дар бом.', address: 'кӯч. Исмоили Сомонӣ 26/1', phone: '+992 48 702 1234', website: 'https://www.hyatt.com/hyatt-regency/en-US/dushr-hyatt-regency-dushanbe' },
    { name: 'Hilton Душанбе', stars: 5, categoryKey: 'luxury', price: '1 635 – 3 270 TJS', desc: 'Меҳмонхонаи байналмилалии люкс бо ҳуҷраҳои зебо, маркази спа ва ҳавзи шиноварии гармкардашуда.', address: 'кӯч. Рӯдакӣ 50', phone: '+992 44 620 0000', website: 'https://www.hilton.com/en/hotels/dybhihi-hilton-dushanbe/' },
    { name: 'Душанбе Серена Отель', stars: 5, categoryKey: 'luxury', price: '1 526 – 3 052 TJS', desc: 'Занҷираи машҳури Serena Hotels бо ҳуҷраҳои зебо, ҳавзи шиноварӣ ва бар дар бом, хадамоти спа.', address: 'кӯч. Рӯдакӣ 14', phone: '+992 48 700 1515', website: 'https://www.serenahotels.com/dushanbe' },
    { name: 'The Rumi Hotel & Residences', stars: 5, categoryKey: 'luxury', price: '1 308 – 2 725 TJS', desc: 'Меҳмонхонаи муосир бо тарҳи замонавӣ, меҳмоннавозии осиёимиёнагӣ ва толорҳои конференсия.', address: 'кӯч. Бохтар 1', phone: '+992 44 640 5050', website: null },
    { name: 'Lotte Palace Душанбе', stars: 5, categoryKey: 'luxury', price: '1 417 – 2 943 TJS', desc: 'Меҳмонхонаи олӣ бо ҳуҷраҳои васеъ, манзараи панорамӣ, толори варзишӣ ва ресторанҳо.', address: 'кӯч. Айнӣ 5/1', phone: '+992 37 236 9800', website: null },
    { name: 'Меҳмонхонаи Тоҷикистон', stars: 4, categoryKey: 'business', price: '654 – 1 308 TJS', desc: 'Меҳмонхонаи таърихӣ дар маркази Душанбе бо толорҳои конференсия ва дастрасии осон.', address: 'кӯч. Шотемур 22', phone: '+992 37 221 7580', website: null },
    { name: 'Atlas Hotel Душанбе', stars: 4, categoryKey: 'business', price: '763 – 1 526 TJS', desc: 'Меҳмонхонаи муосири тиҷоратӣ бо бизнес-марказ, ҳавзи шиноварии дохилӣ ва толорҳои мулоқот.', address: 'кӯч. Бухоро 2', phone: '+992 48 701 0101', website: null },
    { name: 'Отели Safar', stars: 4, categoryKey: 'business', price: '709 – 1 417 TJS', desc: 'Меҳмонхонаи муҷаҳҳаз бо ҳавзи шиноварӣ, хадамоти спа ва ҷойгиршавии қулай.', address: 'кӯч. Рӯдакӣ 36', phone: '+992 37 227 3300', website: null },
    { name: 'Asia Grand Hotel', stars: 4, categoryKey: 'comfort', price: '600 – 1 199 TJS', desc: 'Меҳмонхона дар наздикии Ёдгории Исмоили Сомонӣ бо ҳуҷраҳои муҷаҳҳаз ва ресторан.', address: 'кӯч. Рӯдакӣ 83', phone: '+992 37 224 5000', website: null },
    { name: 'Meridian Hotel Душанбе', stars: 4, categoryKey: 'comfort', price: '490 – 981 TJS', desc: 'Меҳмонхонаи дараҷаи миёна бо шароитҳои муосир ва ҷойгиршавии аъло.', address: 'кӯч. Мирзо Турсунзода 10', phone: '+992 37 235 0707', website: null }
  ]
}

export const hotels = {
  en: buildHotels(hotelsBase.en, 'en'),
  ru: buildHotels(hotelsBase.ru, 'ru'),
  tj: buildHotels(hotelsBase.tj, 'tj')
}

const translations = {
  en: {
    visitWebsite: 'Website',
    perNight: '/ night',
    noResults: 'No hotels match your filters. Try adjusting your selection.',
    categories: [
      { key: 'all', label: 'All' },
      { key: 'luxury', label: 'Luxury' },
      { key: 'business', label: 'Business' },
      { key: 'comfort', label: 'Comfort' }
    ],
    starFilters: [
      { key: 'all', label: 'Any' },
      { key: '5', label: '5 Star' },
      { key: '4', label: '4 Star' }
    ],
    hotels: hotels.en
  },
  ru: {
    visitWebsite: 'Сайт',
    perNight: '/ ночь',
    noResults: 'Нет гостиниц, соответствующих фильтрам. Попробуйте изменить выбор.',
    categories: [
      { key: 'all', label: 'Все' },
      { key: 'luxury', label: 'Люкс' },
      { key: 'business', label: 'Бизнес' },
      { key: 'comfort', label: 'Комфорт' }
    ],
    starFilters: [
      { key: 'all', label: 'Любые' },
      { key: '5', label: '5 звёзд' },
      { key: '4', label: '4 звезды' }
    ],
    hotels: hotels.ru
  },
  tj: {
    visitWebsite: 'Вебсайт',
    perNight: '/ шаб',
    noResults: 'Ягон меҳмонхона ба филтрҳо мувофиқ нест. Интихоби худро тағйир диҳед.',
    categories: [
      { key: 'all', label: 'Ҳама' },
      { key: 'luxury', label: 'Люкс' },
      { key: 'business', label: 'Бизнес' },
      { key: 'comfort', label: 'Роҳатӣ' }
    ],
    starFilters: [
      { key: 'all', label: 'Ҳама' },
      { key: '5', label: '5 ситора' },
      { key: '4', label: '4 ситора' }
    ],
    hotels: hotels.tj
  }
}
