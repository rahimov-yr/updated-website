import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import { Plane, ExternalLink, Building2 } from 'lucide-react'
import '../../styles/flights-infographic.css'

export default function Flights() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('logistics-flights', {
    title: { ru: 'Авиарейсы', en: 'Flights', tj: 'Парвозҳо' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_flights')

  const t = translations[language] || translations.en

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

      {/* Intro */}
      <section className="flt-intro">
        <div className="flt-intro__pattern"></div>
        <div className="container">
          <p className="flt-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Destinations */}
      <section className="flt-destinations">
        <div className="flt-destinations__pattern"></div>
        <div className="container">
          <div className="flt-destinations__header">
            <h2 className="flt-destinations__title">{t.destTitle}</h2>
            <p className="flt-destinations__subtitle">{t.destSubtitle}</p>
          </div>
          <div className="flt-routes">
            {destinations.map((dest, i) => (
              <div className={`flt-route flt-route--${dest.region}`} key={i}>
                <span className="flt-route__dot"></span>
                {dest.names[language] || dest.names.en}
              </div>
            ))}
          </div>
          <div className="flt-legend">
            {t.legend.map((l, i) => (
              <div className="flt-legend__item" key={i}>
                <span className={`flt-legend__dot flt-legend__dot--${legendKeys[i]}`}></span>
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airport Card */}
      <section className="flt-airport">
        <div className="container">
          <div className="flt-airport__card">
            <div className="flt-airport__card-pattern"></div>
            <div className="flt-airport__body">
              <span className="flt-airport__code">DYU</span>
              <h2 className="flt-airport__name">{t.airportName}</h2>
              <p className="flt-airport__location">{t.airportLocation}</p>
              <a
                href="http://airport.tj"
                target="_blank"
                rel="noopener noreferrer"
                className="flt-airport__link"
              >
                <span className="flt-airport__link-icon"><ExternalLink size={14} /></span>
                airport.tj
              </a>
            </div>
            <div className="flt-airport__side">
              {t.airportStats.map((s, i) => (
                <div className="flt-airport__stat" key={i}>
                  <p className="flt-airport__stat-value">{s.value}</p>
                  <p className="flt-airport__stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="flt-carriers">
        <div className="container">
          <div className="flt-carriers__card">
            <div className="flt-carriers__icon"><Building2 size={20} /></div>
            <div className="flt-carriers__body">
              <h3 className="flt-carriers__title">{t.carriersTitle}</h3>
              <p className="flt-carriers__text">{t.carriersText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="flt-closing">
        <div className="flt-closing__pattern"></div>
        <div className="container">
          <h2 className="flt-closing__title">{t.closingTitle}</h2>
          <p className="flt-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const legendKeys = ['cis', 'mideast', 'europe', 'asia', 'caucasus']

const destinations = [
  { names: { en: 'Moscow', ru: 'Москва', tj: 'Маскав' }, region: 'cis' },
  { names: { en: 'Saint Petersburg', ru: 'Санкт-Петербург', tj: 'Санкт-Петербург' }, region: 'cis' },
  { names: { en: 'Almaty', ru: 'Алматы', tj: 'Алмаато' }, region: 'cis' },
  { names: { en: 'Tashkent', ru: 'Ташкент', tj: 'Тошканд' }, region: 'cis' },
  { names: { en: 'Istanbul', ru: 'Стамбул', tj: 'Истанбул' }, region: 'mideast' },
  { names: { en: 'Dubai', ru: 'Дубай', tj: 'Дубай' }, region: 'mideast' },
  { names: { en: 'Jeddah', ru: 'Джидда', tj: 'Ҷидда' }, region: 'mideast' },
  { names: { en: 'Kuwait', ru: 'Кувейт', tj: 'Кувейт' }, region: 'mideast' },
  { names: { en: 'Tehran', ru: 'Тегеран', tj: 'Теҳрон' }, region: 'mideast' },
  { names: { en: 'Mashhad', ru: 'Мешхед', tj: 'Машҳад' }, region: 'mideast' },
  { names: { en: 'Munich', ru: 'Мюнхен', tj: 'Мюнхен' }, region: 'europe' },
  { names: { en: 'New Delhi', ru: 'Нью-Дели', tj: 'Деҳлии Нав' }, region: 'asia' },
  { names: { en: 'Urumqi', ru: 'Урумчи', tj: 'Урумчи' }, region: 'asia' },
  { names: { en: 'Baku', ru: 'Баку', tj: 'Боку' }, region: 'caucasus' }
]

const translations = {
  en: {
    badgeLabel: 'Air Travel',
    introTitle: 'Airlines & Flights',
    introText: 'Regular international flights operate to and from Dushanbe International Airport, connecting Tajikistan with major cities across the CIS, Middle East, Europe, and Asia.',
    destTitle: 'Direct Destinations',
    destSubtitle: 'Dushanbe International Airport offers regular flights to the following cities.',
    legend: ['CIS', 'Middle East', 'Europe', 'Asia', 'Caucasus'],
    airportName: 'Dushanbe International Airport',
    airportLocation: 'Dushanbe, Republic of Tajikistan',
    airportStats: [
      { value: '14+', label: 'Destinations' },
      { value: 'DYU', label: 'IATA Code' }
    ],
    carriersTitle: 'Airlines',
    carriersText: 'Air transportation is carried out by both national and international carriers operating regular scheduled flights to and from Dushanbe.',
    closingTitle: 'Plan Your Flight',
    closingText: 'Visit airport.tj for the latest flight schedules, airline information, and travel updates to plan your journey to Dushanbe.'
  },
  ru: {
    badgeLabel: 'Авиаперелёт',
    introTitle: 'Авиарейсы',
    introText: 'Регулярные международные рейсы выполняются в/из Международного аэропорта Душанбе, связывая Таджикистан с крупными городами СНГ, Ближнего Востока, Европы и Азии.',
    destTitle: 'Прямые направления',
    destSubtitle: 'Международный аэропорт Душанбе предлагает регулярные рейсы в следующие города.',
    legend: ['СНГ', 'Ближний Восток', 'Европа', 'Азия', 'Кавказ'],
    airportName: 'Международный аэропорт Душанбе',
    airportLocation: 'Душанбе, Республика Таджикистан',
    airportStats: [
      { value: '14+', label: 'Направлений' },
      { value: 'DYU', label: 'Код IATA' }
    ],
    carriersTitle: 'Авиакомпании',
    carriersText: 'Авиаперевозки осуществляются как национальными, так и международными перевозчиками, выполняющими регулярные рейсы в/из Душанбе.',
    closingTitle: 'Планируйте перелёт',
    closingText: 'Посетите airport.tj для получения актуального расписания рейсов, информации об авиакомпаниях и обновлений для планирования поездки в Душанбе.'
  },
  tj: {
    badgeLabel: 'Сафари ҳавоӣ',
    introTitle: 'Парвозҳо',
    introText: 'Парвозҳои мунтазами байналмилалӣ аз/ба Фурудгоҳи байналмилалии Душанбе иҷро мешаванд, ки Тоҷикистонро бо шаҳрҳои калони ИДМ, Шарқи Миёна, Аврупо ва Осиё пайваст мекунанд.',
    destTitle: 'Самтҳои мустақим',
    destSubtitle: 'Фурудгоҳи байналмилалии Душанбе парвозҳои мунтазам ба шаҳрҳои зерин пешниҳод мекунад.',
    legend: ['ИДМ', 'Шарқи Миёна', 'Аврупо', 'Осиё', 'Қафқоз'],
    airportName: 'Фурудгоҳи байналмилалии Душанбе',
    airportLocation: 'Душанбе, Ҷумҳурии Тоҷикистон',
    airportStats: [
      { value: '14+', label: 'Самтҳо' },
      { value: 'DYU', label: 'Рамзи IATA' }
    ],
    carriersTitle: 'Авиаширкатҳо',
    carriersText: 'Интиқоли ҳавоӣ аз ҷониби интиқолдиҳандагони миллӣ ва байналмилалӣ, ки парвозҳои мунтазам аз/ба Душанбе иҷро мекунанд, анҷом дода мешавад.',
    closingTitle: 'Парвози худро ба нақша гиред',
    closingText: 'Барои ҷадвали охирини парвозҳо, маълумот дар бораи авиаширкатҳо ва навгониҳои сафар ба airport.tj муроҷиат кунед.'
  }
}
