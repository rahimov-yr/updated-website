import LocalizedLink from '../components/LocalizedLink'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const langSuffix = (lang) => {
  if (lang === 'en') return '_en'
  if (lang === 'tj') return '_tj'
  return '_ru'
}

const defaultConferences = [
  {
    id: 1, year: '2018', isCurrent: false,
    title_ru: 'Международная конференция высокого уровня',
    title_en: 'High-Level International Conference',
    title_tj: 'Конференсияи байналмилалии сатҳи баланд',
    description_ru: 'Первая конференция Десятилетия действий «Вода для устойчивого развития»',
    description_en: 'First conference of the Water Action Decade',
    description_tj: 'Аввалин конференсияи Даҳсолаи амалиёти «Об барои рушди устувор»',
    url: 'https://waterconference2018.org',
    date_ru: '20-22 июня 2018', date_en: 'June 20-22, 2018', date_tj: '20-22 июни 2018',
    location_ru: 'Душанбе, Таджикистан', location_en: 'Dushanbe, Tajikistan', location_tj: 'Душанбе, Тоҷикистон',
    participants_ru: 'Более 2 000 участников из 120 стран', participants_en: 'Over 2,000 participants from 120 countries', participants_tj: 'Зиёда аз 2 000 иштироккунанда аз 120 кишвар',
    keyOutcomes_ru: 'Принятие Душанбинской декларации. Определение приоритетов действий на первый этап Десятилетия.',
    keyOutcomes_en: 'Adoption of the Dushanbe Declaration. Identification of action priorities for the first phase of the Decade.',
    keyOutcomes_tj: 'Қабули Эъломияи Душанбе. Муайян кардани афзалиятҳои амалиёт барои марҳилаи аввали Даҳсола.',
  },
  {
    id: 2, year: '2022', isCurrent: false,
    title_ru: 'Вторая конференция ООН по водным ресурсам',
    title_en: 'Second UN Water Conference',
    title_tj: 'Конференсияи дуюми СММ оид ба захираҳои обӣ',
    description_ru: 'Конференция по среднесрочному обзору Десятилетия',
    description_en: 'Mid-term review conference of the Water Decade',
    description_tj: 'Конференсияи баррасии миёнамуҳлати Даҳсола',
    url: 'https://waterconference2022.org',
    date_ru: '22-24 марта 2023', date_en: 'March 22-24, 2023', date_tj: '22-24 марти 2023',
    location_ru: 'Нью-Йорк, США', location_en: 'New York, USA', location_tj: 'Ню-Йорк, ИМА',
    participants_ru: 'Более 6 500 участников из 170+ стран', participants_en: 'Over 6,500 participants from 170+ countries', participants_tj: 'Зиёда аз 6 500 иштироккунанда аз 170+ кишвар',
    keyOutcomes_ru: 'Принятие Программы действий по водным ресурсам. Более 700 добровольных обязательств по ускорению достижения целей Десятилетия.',
    keyOutcomes_en: 'Adoption of the Water Action Agenda. Over 700 voluntary commitments to accelerate the achievement of Decade goals.',
    keyOutcomes_tj: 'Қабули Барномаи амалиёт оид ба захираҳои обӣ. Зиёда аз 700 ӯҳдадориҳои ихтиёрӣ барои суръат бахшидан ба ноил шудани ҳадафҳои Даҳсола.',
  },
  {
    id: 3, year: '2024', isCurrent: false,
    title_ru: 'Третья международная конференция',
    title_en: 'Third International Conference',
    title_tj: 'Конференсияи сеюми байналмилалӣ',
    description_ru: 'Продолжение диалога по водным ресурсам',
    description_en: 'Continuation of dialogue on water resources',
    description_tj: 'Идомаи муколама оид ба захираҳои обӣ',
    url: 'https://waterconference2024.org',
    date_ru: '10-13 июня 2024', date_en: 'June 10-13, 2024', date_tj: '10-13 июни 2024',
    location_ru: 'Душанбе, Таджикистан', location_en: 'Dushanbe, Tajikistan', location_tj: 'Душанбе, Тоҷикистон',
    participants_ru: 'Более 3 000 участников из 130+ стран', participants_en: 'Over 3,000 participants from 130+ countries', participants_tj: 'Зиёда аз 3 000 иштироккунанда аз 130+ кишвар',
    keyOutcomes_ru: 'Укрепление глобального партнерства в области водных ресурсов. Обзор прогресса и подготовка к итоговой конференции 2026 года.',
    keyOutcomes_en: 'Strengthening global partnerships in water resources. Progress review and preparation for the 2026 culminating conference.',
    keyOutcomes_tj: 'Мустаҳкам кардани шарикии ҷаҳонӣ дар соҳаи захираҳои обӣ. Баррасии пешрафт ва омодагӣ ба конфронси ҷамъбасткунандаи соли 2026.',
  },
  {
    id: 4, year: '2026', isCurrent: true,
    title_ru: 'Душанбинский водный процесс 2026',
    title_en: 'Dushanbe Water Process 2026',
    title_tj: 'Раванди обии Душанбе 2026',
    description_ru: 'Текущая конференция — итоговое мероприятие Десятилетия',
    description_en: 'Current conference — culminating event of the Decade',
    description_tj: 'Конференсияи ҷорӣ — чорабинии ниҳоии Даҳсола',
    url: '',
    date_ru: '25-28 мая 2026', date_en: 'May 25-28, 2026', date_tj: '25-28 майи 2026',
    location_ru: 'Кохи Сомон, Душанбе, Таджикистан', location_en: 'Kohi Somon, Dushanbe, Tajikistan', location_tj: 'Коҳи Сомон, Душанбе, Тоҷикистон',
    participants_ru: '', participants_en: '', participants_tj: '',
    keyOutcomes_ru: '', keyOutcomes_en: '', keyOutcomes_tj: '',
  },
]

const defaultBriefInfo = {
  aboutTitle_ru: 'О десятилетии',
  aboutTitle_en: 'About the Decade',
  aboutTitle_tj: 'Дар бораи даҳсола',
  aboutText_ru: 'В декабре 2016 года Генеральная Ассамблея ООН провозгласила период 2018-2028 годов Международным десятилетием действий «Вода для устойчивого развития».\n\nРеспублика Таджикистан выступила инициатором данного Десятилетия, продолжая свою активную роль в продвижении глобальной водной повестки дня.',
  aboutText_en: 'In December 2016, the UN General Assembly proclaimed the period 2018-2028 as the International Decade for Action "Water for Sustainable Development".\n\nThe Republic of Tajikistan initiated this Decade, continuing its active role in promoting the global water agenda.',
  aboutText_tj: 'Дар моҳи декабри соли 2016 Маҷмааи Умумии СММ давраи солҳои 2018-2028-ро Даҳсолаи байналмилалии амалиёт «Об барои рушди устувор» эълон кард.\n\nҶумҳурии Тоҷикистон ташаббускори ин Даҳсола буд ва нақши фаъолонаи худро дар пешбурди барномаи ҷаҳонии обӣ идома медиҳад.',
}

export default function WaterDecade() {
  const { t, language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  if (loading) return <PageLoader />

  const suffix = langSuffix(language)
  const conferences = getJsonSetting('water_decade_conferences', defaultConferences)
  const briefInfo = getJsonSetting('water_decade_brief_info', defaultBriefInfo)
  const pageSettings = getJsonSetting('water_decade_page_settings', null)

  const yearStart = pageSettings?.yearStart || '2018'
  const yearEnd = pageSettings?.yearEnd || '2028'

  // Get page title and subtitle from settings with fallback to translations
  const pageTitle = pageSettings?.[`title${suffix}`] || pageSettings?.title_ru || t('waterDecadePage.title')
  const pageSubtitle = pageSettings?.[`subtitle${suffix}`] || pageSettings?.subtitle_ru || t('waterDecadePage.subtitle')

  // Get brief info with fallback to defaults
  const aboutTitle = briefInfo?.[`aboutTitle${suffix}`] || briefInfo?.aboutTitle_ru || defaultBriefInfo.aboutTitle_ru
  const aboutText = briefInfo?.[`aboutText${suffix}`] || briefInfo?.aboutText_ru || defaultBriefInfo.aboutText_ru

  const pastConferences = conferences.filter(c => !c.isCurrent)
  const currentConference = conferences.find(c => c.isCurrent)

  return (
    <section className="section water-decade-page">
        <div className="container">
          {/* Introduction */}
          <div className="water-decade-page__intro reveal">
            <div className="water-decade-page__intro-content">
              <h2 className="water-decade-page__section-title">
                {aboutTitle}
              </h2>
              {aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="water-decade-page__text">
                  {paragraph}
                </p>
              ))}
              <LocalizedLink
                to="/water-decade-details"
                className="water-decade-page__read-more"
              >
                {t('waterDecade.learnMore')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </LocalizedLink>
            </div>
            <div className="water-decade-page__intro-badge">
              <span className="water-decade-page__years">{yearStart}</span>
              <span className="water-decade-page__years-divider">—</span>
              <span className="water-decade-page__years">{yearEnd}</span>
            </div>
          </div>

          {/* Previous Conferences */}
          <div className="water-decade-page__conferences reveal">
            <h2 className="water-decade-page__section-title">
              {t('waterDecadePage.conferencesTitle')}
            </h2>
            <div className="water-decade-page__timeline">
              {pastConferences.map((conf, index) => {
                const cardId = conf.id || index
                return (
                  <div key={cardId} className="water-decade-page__timeline-item">
                    <div className="water-decade-page__timeline-marker">
                      <span>{conf.year}</span>
                    </div>
                    <div className="water-decade-page__timeline-content">
                      <h3>{conf[`title${suffix}`] || conf.title_ru}</h3>
                      <p>{conf[`description${suffix}`] || conf.description_ru}</p>
                      <div className="water-decade-page__timeline-actions">
                        <LocalizedLink
                          to={`/water-decade/${conf.id}`}
                          className="water-decade-page__details-btn"
                        >
                          {t('waterDecadePage.detailedInfo')}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </LocalizedLink>
                        {conf.url && (
                          <a
                            href={conf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="water-decade-page__timeline-link"
                          >
                            {t('waterDecadePage.visitWebsite')}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {/* Current Conference */}
              {currentConference && (
                  <div className="water-decade-page__timeline-item water-decade-page__timeline-item--current">
                    <div className="water-decade-page__timeline-marker water-decade-page__timeline-marker--current">
                      <span>{currentConference.year}</span>
                    </div>
                    <div className="water-decade-page__timeline-content">
                      <h3>{currentConference[`title${suffix}`] || currentConference.title_ru}</h3>
                      <p>{currentConference[`description${suffix}`] || currentConference.description_ru}</p>
                      <div className="water-decade-page__timeline-actions">
                        <LocalizedLink
                          to={`/water-decade/${currentConference.id}`}
                          className="water-decade-page__details-btn"
                        >
                          {t('waterDecadePage.detailedInfo')}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </LocalizedLink>
                        <span className="water-decade-page__current-badge">
                          {t('waterDecadePage.currentConference')}
                        </span>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </section>
  )
}
