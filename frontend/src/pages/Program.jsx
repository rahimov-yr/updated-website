import { PageHero } from '../components/Sections'
import { useLanguage } from '../context/LanguageContext'
import usePageBanner from '../hooks/usePageBanner'
import './Program.css'

const programSections = [
  {
    id: 'structure',
    title_ru: 'Структура программы',
    title_en: 'Program Structure',
    title_tj: 'Сохтори барнома',
    description_ru: 'Обзор основных форматов и структуры мероприятий конференции',
    description_en: 'Overview of main formats and structure of conference events',
    description_tj: 'Шарҳи форматҳои асосӣ ва сохтори чорабиниҳои конфронс',
    link: '/program/structure'
  },
  {
    id: 'plenary',
    title_ru: 'Пленарное заседание',
    title_en: 'Plenary Session',
    title_tj: 'Ҷаласаи пленарӣ',
    description_ru: 'Основные темы и вопросы, обсуждаемые на пленарных заседаниях',
    description_en: 'Main topics and issues discussed at plenary sessions',
    description_tj: 'Мавзӯъҳо ва масъалаҳои асосии муҳокимашаванда дар ҷаласаҳои пленарӣ',
    link: '/program/plenary'
  },
  {
    id: 'events',
    title_ru: 'Мероприятия в рамках конференции',
    title_en: 'Conference Events',
    title_tj: 'Чорабиниҳо дар доираи конфронс',
    description_ru: 'Тематические сессии, панельные дискуссии и специальные мероприятия',
    description_en: 'Thematic sessions, panel discussions and special events',
    description_tj: 'Сессияҳои мавзӯъӣ, муҳокимаҳои панелӣ ва чорабиниҳои махсус',
    link: '/program/events'
  },
  {
    id: 'forums',
    title_ru: 'Форумы',
    title_en: 'Forums',
    title_tj: 'Форумҳо',
    description_ru: 'Специализированные форумы по ключевым направлениям водного сотрудничества',
    description_en: 'Specialized forums on key areas of water cooperation',
    description_tj: 'Форумҳои махсус дар самтҳои калидии ҳамкории обӣ',
    link: '/program/forums'
  }
]

export default function Program() {
  const { language } = useLanguage()

  const banner = usePageBanner('program', {
    title: { ru: 'Программа', en: 'Program', tj: 'Барнома' },
    subtitle: { ru: 'Программа конференции', en: 'Conference Program', tj: 'Барномаи конфронс' }
  })

  const getLocalizedText = (item, field) => {
    const key = `${field}_${language}`
    return item[key] || item[`${field}_ru`]
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

      <section className="section">
        <div className="container">
          <div className="program-sections-grid">
            {programSections.map((section) => (
              <a key={section.id} href={section.link} className="program-section-card">
                <div className="program-section-card__content">
                  <h3>{getLocalizedText(section, 'title')}</h3>
                  <p>{getLocalizedText(section, 'description')}</p>
                </div>
                <div className="program-section-card__arrow">
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
