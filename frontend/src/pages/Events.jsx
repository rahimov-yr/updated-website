import { PageHero } from '../components/Sections'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'

const langSuffix = (lang) => {
  if (lang === 'en') return '_en'
  if (lang === 'tj') return '_tj'
  return '_ru'
}

const defaultMainEvents = [
  {
    id: 1, icon: 'people',
    category_ru: 'Пленарные заседания', category_en: 'Plenary Sessions', category_tj: 'Ҷаласаҳои пленарӣ',
    title_ru: 'Пленарные заседания высокого уровня', title_en: 'High-Level Plenary Sessions', title_tj: 'Ҷаласаҳои пленарии сатҳи баланд',
    description_ru: 'Выступления глав государств и правительств, министров и руководителей международных организаций',
    description_en: 'Speeches by heads of state and government, ministers and leaders of international organizations',
    description_tj: 'Суханрониҳои сарони давлатҳо ва ҳукуматҳо, вазирон ва роҳбарони ташкилотҳои байналмилалӣ',
    highlights_ru: ['Доклады министров', 'Обсуждение политики', 'Принятие решений'],
    highlights_en: ['Ministerial reports', 'Policy discussions', 'Decision making'],
    highlights_tj: ['Гузоришҳои вазирон', 'Муҳокимаи сиёсат', 'Қабули қарорҳо'],
  },
  {
    id: 2, icon: 'book',
    category_ru: 'Тематические сессии', category_en: 'Thematic Sessions', category_tj: 'Сессияҳои мавзӯъӣ',
    title_ru: 'Интерактивные тематические сессии', title_en: 'Interactive Thematic Sessions', title_tj: 'Сессияҳои интерактивии мавзӯъӣ',
    description_ru: 'Глубокое обсуждение ключевых вопросов управления водными ресурсами',
    description_en: 'In-depth discussion of key water resource management issues',
    description_tj: 'Муҳокимаи амиқи масъалаҳои калидии идоракунии захираҳои обӣ',
    highlights_ru: ['Экспертные дискуссии', 'Обмен опытом', 'Лучшие практики'],
    highlights_en: ['Expert discussions', 'Experience sharing', 'Best practices'],
    highlights_tj: ['Муҳокимаҳои коршиносон', 'Мубодилаи таҷриба', 'Беҳтарин таҷрибаҳо'],
  },
  {
    id: 3, icon: 'globe',
    category_ru: 'Специальные события', category_en: 'Special Events', category_tj: 'Чорабиниҳои махсус',
    title_ru: 'Специальные мероприятия и церемонии', title_en: 'Special Events and Ceremonies', title_tj: 'Чорабиниҳои махсус ва маросимҳо',
    description_ru: 'Торжественные церемонии открытия и закрытия, вручение наград',
    description_en: 'Grand opening and closing ceremonies, award presentations',
    description_tj: 'Маросимҳои кушоиш ва хотима, супоридани ҷоизаҳо',
    highlights_ru: ['Церемония открытия', 'Церемония закрытия', 'Награждения'],
    highlights_en: ['Opening ceremony', 'Closing ceremony', 'Awards'],
    highlights_tj: ['Маросими кушоиш', 'Маросими хотима', 'Ҷоизаҳо'],
  },
  {
    id: 4, icon: 'graduation',
    category_ru: 'Молодёжный форум', category_en: 'Youth Forum', category_tj: 'Форуми ҷавонон',
    title_ru: 'Международный молодёжный форум', title_en: 'International Youth Forum', title_tj: 'Форуми байналмилалии ҷавонон',
    description_ru: 'Платформа для молодых лидеров и активистов в сфере водных ресурсов',
    description_en: 'Platform for young leaders and activists in the water sector',
    description_tj: 'Платформа барои роҳбарони ҷавон ва фаъолон дар соҳаи обӣ',
    highlights_ru: ['Молодые лидеры', 'Инновации', 'Нетворкинг'],
    highlights_en: ['Young leaders', 'Innovations', 'Networking'],
    highlights_tj: ['Роҳбарони ҷавон', 'Навоварӣ', 'Шабакасозӣ'],
  },
]

const defaultSideEvents = [
  {
    id: 1,
    title_ru: 'Выставка достижений', title_en: 'Exhibition', title_tj: 'Намоишгоҳ',
    description_ru: 'Международная выставка технологий и решений в сфере водных ресурсов',
    description_en: 'International exhibition of technologies and solutions in water resources',
    description_tj: 'Намоишгоҳи байналмилалии технологияҳо ва роҳҳои ҳалли захираҳои обӣ',
    link: '/exhibition',
  },
  {
    id: 2,
    title_ru: 'Культурная программа', title_en: 'Cultural Program', title_tj: 'Барномаи фарҳангӣ',
    description_ru: 'Знакомство с культурой и традициями Таджикистана',
    description_en: 'Introduction to the culture and traditions of Tajikistan',
    description_tj: 'Шиносоӣ бо фарҳанг ва анъанаҳои Тоҷикистон',
    link: '/excursions',
  },
  {
    id: 3,
    title_ru: 'Экскурсии', title_en: 'Excursions', title_tj: 'Экскурсияҳо',
    description_ru: 'Посещение достопримечательностей и водных объектов страны',
    description_en: 'Visits to attractions and water facilities of the country',
    description_tj: 'Боздид аз ҷойҳои дидании кишвар ва объектҳои обӣ',
    link: '/excursions',
  },
]

const defaultScheduleStats = {
  days: '4',
  eventsCount: '100+',
  countries: '150+',
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  date_ru: '25-28 МАЯ 2026',
  date_en: 'MAY 25-28, 2026',
  date_tj: '25-28 МАЙИ 2026',
  title_ru: 'Программа конференции',
  title_en: 'Conference Program',
  title_tj: 'Барномаи конфронс',
  description_ru: 'Четыре дня насыщенной программы: пленарные заседания, тематические сессии, специальные мероприятия и культурная программа. Более 100 мероприятий с участием экспертов из 150+ стран мира.',
  description_en: 'Four days of intensive program: plenary sessions, thematic sessions, special events and cultural program. More than 100 events with experts from 150+ countries.',
  description_tj: 'Чор рӯзи барномаи пурмазмун: ҷаласаҳои пленарӣ, сессияҳои мавзӯъӣ, чорабиниҳои махсус ва барномаи фарҳангӣ. Зиёда аз 100 чорабинӣ бо иштироки коршиносон аз 150+ кишварҳои ҷаҳон.'
}

const iconSvgs = {
  people: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
  ),
}

export default function Events() {
  const { t, language } = useLanguage()
  const { getJsonSetting } = useSettings()

  const suffix = langSuffix(language)
  const mainEvents = getJsonSetting('events_main', defaultMainEvents)
  const sideEvents = getJsonSetting('events_side', defaultSideEvents)
  const scheduleStats = getJsonSetting('events_schedule_stats', defaultScheduleStats)
  const pageSettings = getJsonSetting('events_page_settings', null)

  const pageTitle = pageSettings ? pageSettings[`title${suffix}`] || t('events.title') : t('events.title')
  const pageSubtitle = pageSettings ? pageSettings[`subtitle${suffix}`] || t('events.subtitle') : t('events.subtitle')
  const mainEventsTitle = pageSettings ? pageSettings[`mainEventsTitle${suffix}`] || t('events.mainEvents') : t('events.mainEvents')
  const mainEventsSubtitle = pageSettings ? pageSettings[`mainEventsSubtitle${suffix}`] || t('events.mainEventsSubtitle') : t('events.mainEventsSubtitle')
  const sideEventsTitle = pageSettings ? pageSettings[`sideEventsTitle${suffix}`] || t('events.sideEvents') : t('events.sideEvents')
  const sideEventsSubtitle = pageSettings ? pageSettings[`sideEventsSubtitle${suffix}`] || t('events.sideEventsSubtitle') : t('events.sideEventsSubtitle')

  const banner = usePageBanner('events', {
    title: { ru: pageTitle, en: pageTitle, tj: pageTitle },
    subtitle: { ru: pageSubtitle, en: pageSubtitle, tj: pageSubtitle }
  })

  return (
    <>
      {banner.showBanner && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}

      {/* Parallel Events */}
      <section id="parallel" className="section events-main">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Параллельные мероприятия</h2>
            <p className="section-subtitle">Специальные сессии и мероприятия, организуемые партнерами конференции</p>
          </div>

          <div className="events-grid">
            {mainEvents.map((event, index) => (
              <div key={event.id || index} className="event-card">
                <div className="event-card__header">
                  <div className="event-card__icon">
                    {iconSvgs[event.icon] || iconSvgs.globe}
                  </div>
                  <span className="event-card__category">{event[`category${suffix}`] || event.category_ru}</span>
                </div>
                <div className="event-card__content">
                  <h3>{event[`title${suffix}`] || event.title_ru}</h3>
                  <p>{event[`description${suffix}`] || event.description_ru}</p>
                  <ul className="event-card__highlights">
                    {Array.isArray(event[`highlights${suffix}`] || event.highlights_ru) && (event[`highlights${suffix}`] || event.highlights_ru).map((highlight, idx) => (
                      <li key={idx}>
                        <span className="highlight-icon">
                          {event.highlightIcon || '✓'}
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Teaser */}
      <section className="section events-schedule">
        <div className="container">
          <div className="events-schedule__content">
            <div className="events-schedule__text">
              <span className="events-schedule__label">{scheduleStats[`date${suffix}`] || scheduleStats.date_ru || t('events.schedule.label')}</span>
              <h2>{scheduleStats[`title${suffix}`] || scheduleStats.title_ru || t('events.schedule.title')}</h2>
              <p>{scheduleStats[`description${suffix}`] || scheduleStats.description_ru || t('events.schedule.description')}</p>
              <div className="events-schedule__stats">
                <div className="events-stat">
                  <span className="events-stat__number">{scheduleStats.days}</span>
                  <span className="events-stat__label">{t('events.schedule.days')}</span>
                </div>
                <div className="events-stat">
                  <span className="events-stat__number">{scheduleStats.eventsCount}</span>
                  <span className="events-stat__label">{t('events.schedule.eventsCount')}</span>
                </div>
                <div className="events-stat">
                  <span className="events-stat__number">{scheduleStats.countries}</span>
                  <span className="events-stat__label">{t('events.schedule.countries')}</span>
                </div>
              </div>
              <a href="/program" className="btn btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {t('events.schedule.viewProgram')}
              </a>
            </div>
            <div className="events-schedule__image">
              <img src={scheduleStats.image} alt="Conference" />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Events */}
      <section id="cultural" className="section section--gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Культурные мероприятия</h2>
            <p className="section-subtitle">Знакомство с богатой культурой и традициями Таджикистана</p>
          </div>
          <div className="content-text">
            <p>В рамках конференции участники смогут познакомиться с уникальной культурой Таджикистана:</p>
            <ul>
              <li><strong>Церемония открытия</strong> - традиционное представление с элементами таджикской культуры</li>
              <li><strong>Гала-ужин</strong> - традиционная таджикская кухня и музыкальная программа</li>
              <li><strong>Культурный вечер</strong> - выступления национальных ансамблей</li>
              <li><strong>Ремесленная выставка</strong> - демонстрация традиционных ремесел</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Side Events */}
      <section className="section events-side">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{sideEventsTitle}</h2>
            <p className="section-subtitle">{sideEventsSubtitle}</p>
          </div>

          <div className="side-events-grid">
            {sideEvents.map((event, index) => (
              <a key={event.id || index} href={event.link} className="side-event-card">
                <div className="side-event-card__content">
                  <h3>{event[`title${suffix}`] || event.title_ru}</h3>
                  <p>{event[`description${suffix}`] || event.description_ru}</p>
                </div>
                <div className="side-event-card__arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
