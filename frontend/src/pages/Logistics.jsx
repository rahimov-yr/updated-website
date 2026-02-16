import { PageHero } from '../components/Sections'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'

const langSuffix = (lang) => {
  if (lang === 'en') return '_en'
  if (lang === 'tj') return '_tj'
  return '_ru'
}

const defaultHotels = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    stars: 5,
    name_ru: 'Hyatt Regency Dushanbe', name_en: 'Hyatt Regency Dushanbe', name_tj: 'Hyatt Regency Душанбе',
    description_ru: 'Официальный отель конференции в центре города',
    description_en: 'Official conference hotel in the city center',
    description_tj: 'Меҳмонхонаи расмии конфронс дар маркази шаҳр',
    amenities_ru: ['Центр города', 'Трансфер', 'СПА'],
    amenities_en: ['City center', 'Transfer', 'SPA'],
    amenities_tj: ['Маркази шаҳр', 'Интиқол', 'СПА'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    stars: 5,
    name_ru: 'Serena Hotel Dushanbe', name_en: 'Serena Hotel Dushanbe', name_tj: 'Serena Hotel Душанбе',
    description_ru: 'Роскошный отель в историческом районе',
    description_en: 'Luxury hotel in the historic district',
    description_tj: 'Меҳмонхонаи мамтоз дар ноҳияи таърихӣ',
    amenities_ru: ['Исторический район', 'Фитнес', 'Ресторан'],
    amenities_en: ['Historic district', 'Fitness', 'Restaurant'],
    amenities_tj: ['Ноҳияи таърихӣ', 'Фитнес', 'Тарабхона'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
    stars: 5,
    name_ru: 'Hilton Dushanbe', name_en: 'Hilton Dushanbe', name_tj: 'Hilton Душанбе',
    description_ru: 'Современный отель с бизнес-центром',
    description_en: 'Modern hotel with business center',
    description_tj: 'Меҳмонхонаи муосир бо маркази тиҷоратӣ',
    amenities_ru: ['Бизнес-центр', 'Рестораны', 'Конференц-залы'],
    amenities_en: ['Business center', 'Restaurants', 'Conference rooms'],
    amenities_tj: ['Маркази тиҷоратӣ', 'Тарабхонаҳо', 'Толорҳои конфронсӣ'],
  },
]

const defaultTransport = [
  {
    id: 1, icon: 'plane',
    title_ru: 'Аэропорт', title_en: 'Airport', title_tj: 'Фурудгоҳ',
    description_ru: 'Международный аэропорт Душанбе находится в 20 минутах от центра города',
    description_en: 'Dushanbe International Airport is 20 minutes from the city center',
    description_tj: 'Фурудгоҳи байналмилалии Душанбе 20 дақиқа аз маркази шаҳр',
  },
  {
    id: 2, icon: 'bus',
    title_ru: 'Трансфер', title_en: 'Shuttle Service', title_tj: 'Хадамоти интиқол',
    description_ru: 'Бесплатный трансфер от аэропорта для всех участников',
    description_en: 'Free airport shuttle for all participants',
    description_tj: 'Интиқоли ройгон аз фурудгоҳ барои ҳамаи иштирокчиён',
  },
  {
    id: 3, icon: 'taxi',
    title_ru: 'Такси', title_en: 'Taxi', title_tj: 'Такси',
    description_ru: 'Такси доступно круглосуточно в аэропорту и городе',
    description_en: 'Taxis available 24/7 at the airport and around the city',
    description_tj: 'Такси шабонарӯзӣ дар фурудгоҳ ва шаҳр дастрас аст',
  },
]

const defaultVisa = [
  {
    id: 1, icon: 'check',
    title_ru: 'Безвизовый режим', title_en: 'Visa-Free Entry', title_tj: 'Вуруди бидуни виза',
    description_ru: 'Граждане 52 стран могут въезжать без визы',
    description_en: 'Citizens of 52 countries can enter visa-free',
    description_tj: 'Шаҳрвандони 52 кишвар метавонанд бидуни виза ворид шаванд',
  },
  {
    id: 2, icon: 'computer',
    title_ru: 'Электронная виза', title_en: 'E-Visa', title_tj: 'Визаи электронӣ',
    description_ru: 'Электронная виза доступна для большинства стран',
    description_en: 'E-visa available for most countries',
    description_tj: 'Визаи электронӣ барои аксари кишварҳо дастрас аст',
  },
  {
    id: 3, icon: 'help',
    title_ru: 'Визовая поддержка', title_en: 'Visa Support', title_tj: 'Дастгирии виза',
    description_ru: 'Организаторы помогут с получением визы',
    description_en: 'Organizers will help with visa processing',
    description_tj: 'Ташкилкунандагон дар гирифтани виза кӯмак мекунанд',
  },
]

const defaultUseful = [
  {
    id: 1, icon: 'weather',
    title_ru: 'Погода', title_en: 'Weather', title_tj: 'Обу ҳаво',
    description_ru: 'В мае температура 20-30°C, солнечно',
    description_en: 'May temperatures 20-30°C, sunny',
    description_tj: 'Дар моҳи май ҳарорат 20-30°C, офтобӣ',
  },
  {
    id: 2, icon: 'money',
    title_ru: 'Валюта', title_en: 'Currency', title_tj: 'Асъор',
    description_ru: 'Национальная валюта - сомони (TJS)',
    description_en: 'National currency is Somoni (TJS)',
    description_tj: 'Асъори миллӣ - сомонӣ (TJS)',
  },
  {
    id: 3, icon: 'phone',
    title_ru: 'Связь', title_en: 'Communication', title_tj: 'Алоқа',
    description_ru: 'SIM-карты доступны в аэропорту',
    description_en: 'SIM cards available at the airport',
    description_tj: 'Корти SIM дар фурудгоҳ дастрас аст',
  },
]

const sectionIcons = {
  accommodation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M16 14v3M12 14v3"></path>
    </svg>
  ),
  transport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <path d="M22 2L2 8.67l9.67 3.67 3.66 9.66L22 2z"></path>
    </svg>
  ),
  visa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M7 15h.01M11 15h2"></path>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
}

const cardIcons = {
  plane: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <path d="M22 2L2 8.67l9.67 3.67 3.66 9.66L22 2z"></path>
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  ),
  taxi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H6c-1.1 0-2.1.8-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2s.1.8.2 1.2c.3 1.1.8 2.8.8 2.8h3M7 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM13 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"></path>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  computer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  weather: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
}

const amenityIcons = {
  location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
}

export default function Logistics() {
  const { t, language } = useLanguage()
  const { getJsonSetting } = useSettings()

  const suffix = langSuffix(language)
  const hotels = getJsonSetting('logistics_hotels', defaultHotels)
  const transportInfo = getJsonSetting('logistics_transport', defaultTransport)
  const visaInfo = getJsonSetting('logistics_visa', defaultVisa)
  const usefulInfo = getJsonSetting('logistics_useful', defaultUseful)
  const pageSettings = getJsonSetting('logistics_page_settings', null)

  const pageTitle = pageSettings ? pageSettings[`title${suffix}`] || t('logistics.title') : t('logistics.title')
  const pageSubtitle = pageSettings ? pageSettings[`subtitle${suffix}`] || t('logistics.subtitle') : t('logistics.subtitle')

  const banner = usePageBanner('logistics', {
    title: { ru: pageTitle, en: pageTitle, tj: pageTitle },
    subtitle: { ru: pageSubtitle, en: pageSubtitle, tj: pageSubtitle }
  })

  // Section titles from database with fallback to translations
  const hotelsTitle = pageSettings?.[`hotels_title${suffix}`] || t('logistics.accommodation.title')
  const hotelsSubtitle = pageSettings?.[`hotels_subtitle${suffix}`] || t('logistics.accommodation.subtitle')
  const transportTitle = pageSettings?.[`transport_title${suffix}`] || t('logistics.transport.title')
  const transportSubtitle = pageSettings?.[`transport_subtitle${suffix}`] || t('logistics.transport.subtitle')
  const visaTitle = pageSettings?.[`visa_title${suffix}`] || t('logistics.visa.title')
  const visaSubtitle = pageSettings?.[`visa_subtitle${suffix}`] || t('logistics.visa.subtitle')
  const usefulTitle = pageSettings?.[`useful_title${suffix}`] || t('logistics.info.title')
  const usefulSubtitle = pageSettings?.[`useful_subtitle${suffix}`] || t('logistics.info.subtitle')

  const getCardIcon = (iconName) => cardIcons[iconName] || cardIcons.check

  return (
    <>
      {banner.showBanner && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}

      {/* Accommodation Section */}
      <section className="section logistics-section" id="accommodation">
        <div className="container">
          <div className="logistics-header">
            <div className="logistics-header__icon">
              {sectionIcons.accommodation}
            </div>
            <div className="logistics-header__text">
              <h2 className="section-title">{hotelsTitle}</h2>
              <p className="logistics-header__desc">{hotelsSubtitle}</p>
            </div>
          </div>

          <div className="hotel-cards-modern">
            {hotels.map((hotel, index) => (
              <div key={hotel.id || index} className="hotel-modern">
                <div className="hotel-modern__image">
                  <img src={hotel.image} alt={hotel[`name${suffix}`] || hotel.name_ru} />
                  <div className="hotel-modern__overlay"></div>
                </div>
                <div className="hotel-modern__content">
                  <div className="hotel-modern__rating">
                    {[...Array(hotel.stars || 5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <h3>{hotel[`name${suffix}`] || hotel.name_ru}</h3>
                  <p className="hotel-modern__desc">{hotel[`description${suffix}`] || hotel.description_ru}</p>
                  <div className="hotel-modern__amenities">
                    {Array.isArray(hotel[`amenities${suffix}`] || hotel.amenities_ru) && (hotel[`amenities${suffix}`] || hotel.amenities_ru).map((amenity, idx) => (
                      <span key={idx}>
                        {amenityIcons.default}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport Section */}
      <section className="section logistics-section logistics-section--alt" id="transport">
        <div className="container">
          <div className="logistics-header">
            <div className="logistics-header__icon">
              {sectionIcons.transport}
            </div>
            <div className="logistics-header__text">
              <h2 className="section-title">{transportTitle}</h2>
              <p className="logistics-header__desc">{transportSubtitle}</p>
            </div>
          </div>

          <div className="logistics-grid">
            {transportInfo.map((item, index) => (
              <div key={item.id || index} className="logistics-card">
                <div className="logistics-card__icon">
                  {getCardIcon(item.icon)}
                </div>
                <div className="logistics-card__content">
                  <h4>{item[`title${suffix}`] || item.title_ru}</h4>
                  <p>{item[`description${suffix}`] || item.description_ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Section */}
      <section className="section logistics-section" id="visa">
        <div className="container">
          <div className="logistics-header">
            <div className="logistics-header__icon">
              {sectionIcons.visa}
            </div>
            <div className="logistics-header__text">
              <h2 className="section-title">{visaTitle}</h2>
              <p className="logistics-header__desc">{visaSubtitle}</p>
            </div>
          </div>

          <div className="logistics-grid">
            {visaInfo.map((item, index) => (
              <div key={item.id || index} className="logistics-card">
                <div className="logistics-card__icon">
                  {getCardIcon(item.icon)}
                </div>
                <div className="logistics-card__content">
                  <h4>{item[`title${suffix}`] || item.title_ru}</h4>
                  <p>{item[`description${suffix}`] || item.description_ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Useful Info Section */}
      <section className="section logistics-section logistics-section--alt" id="info">
        <div className="container">
          <div className="logistics-header">
            <div className="logistics-header__icon">
              {sectionIcons.info}
            </div>
            <div className="logistics-header__text">
              <h2 className="section-title">{usefulTitle}</h2>
              <p className="logistics-header__desc">{usefulSubtitle}</p>
            </div>
          </div>

          <div className="useful-info-grid">
            {usefulInfo.map((item, index) => (
              <div key={item.id || index} className="useful-info-card">
                <div className="useful-info-card__icon">
                  {getCardIcon(item.icon)}
                </div>
                <h4>{item[`title${suffix}`] || item.title_ru}</h4>
                <p>{item[`description${suffix}`] || item.description_ru}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
