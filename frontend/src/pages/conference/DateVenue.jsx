import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Droplets, MapPin, Users, Compass, MessageCircle
} from 'lucide-react'
import '../../styles/datevenue-infographic.css'

export default function DateVenue() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('conference-date-venue', {
    title: { ru: 'Дата и место проведения', en: 'Date and Venue', tj: 'Сана ва макон' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'conference_date_venue')

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

      {/* Date & Venue Banner */}
      <section className="dv-banner">
        <div className="dv-banner__pattern"></div>
        <div className="container">
          <div className="dv-banner__card">
            <div className="dv-banner__water-bg"></div>
            <div className="dv-banner__body">
              <h2 className="dv-banner__title">{t.overviewTitle}</h2>
              <p className="dv-banner__desc">{t.overview}</p>
              <div className="dv-banner__venue">
                <MapPin size={15} />
                <span>{t.venue}</span>
              </div>
            </div>
            <div className="dv-banner__badge">
              <Droplets size={22} className="dv-banner__badge-icon" />
              <span className="dv-banner__badge-date">25–28</span>
              <span className="dv-banner__badge-month">{t.month} 2026</span>
              <span className="dv-banner__badge-city">{t.dushanbe}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Day Cards Grid */}
      <section className="dv-days">
        <div className="dv-days__pattern"></div>
        <div className="container">
          <h2 className="dv-days__title">{t.scheduleTitle}</h2>
          <div className="dv-days__grid">
            {t.days.map((day, i) => (
              <div className="dv-day-card" key={i}>
                <div className="dv-day-card__top">
                  <span className="dv-day-card__num">{day.day}</span>
                  <span className="dv-day-card__month">{day.month}</span>
                </div>
                <div className="dv-day-card__body">
                  <div className="dv-day-card__icon">
                    {dayIcons[i]}
                  </div>
                  <h3 className="dv-day-card__heading">{day.title}</h3>
                  <p className="dv-day-card__text">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const dayIcons = [
  <MessageCircle size={18} key="d0" />,
  <Users size={18} key="d1" />,
  <Compass size={18} key="d2" />
]

const translations = {
  en: {
    month: 'May',
    dushanbe: 'Dushanbe',
    overviewTitle: 'Four Days of Global Water Action',
    venue: 'Kokhi Somon, Dushanbe, Republic of Tajikistan',
    overview: 'Conference-related events will take place over four days from 25 to 28 May 2026 in Dushanbe, the capital of the Republic of Tajikistan.',
    scheduleTitle: 'Conference Schedule',
    days: [
      {
        day: '25',
        month: 'MAY',
        title: 'Forums & Side Events',
        description: 'Conference Forums and side events will be held on 25 May 2026 in advance of the official opening of the Conference. The venues for the forums and side events will be decided by the organizers and communicated in due course.'
      },
      {
        day: '26–27',
        month: 'MAY',
        title: 'Official High-Level Conference',
        description: 'The official high-level Conference will take place on 26 and 27 May 2026 at the Kokhi Somon complex in Dushanbe, Republic of Tajikistan.'
      },
      {
        day: '28',
        month: 'MAY',
        title: 'Field Trips & Tours',
        description: 'Field trips and tours will be organized on 28 May 2026 for international participants to explore the host country and learn about Tajikistan\u2019s water resources management experiences.'
      }
    ]
  },
  ru: {
    month: 'Мая',
    dushanbe: 'Душанбе',
    overviewTitle: 'Четыре дня глобальных действий в области водных ресурсов',
    venue: 'Кохи Сомон, Душанбе, Республика Таджикистан',
    overview: 'Мероприятия, связанные с Конференцией, будут проходить в течение четырёх дней — с 25 по 28 мая 2026 года в Душанбе, столице Республики Таджикистан.',
    scheduleTitle: 'Расписание конференции',
    days: [
      {
        day: '25',
        month: 'МАЯ',
        title: 'Форумы и параллельные мероприятия',
        description: 'Форумы и параллельные мероприятия Конференции состоятся 25 мая 2026 года, до официального открытия Конференции. Места проведения форумов и параллельных мероприятий будут определены организаторами и сообщены в надлежащем порядке.'
      },
      {
        day: '26–27',
        month: 'МАЯ',
        title: 'Официальная конференция высокого уровня',
        description: 'Официальная конференция высокого уровня пройдёт 26 и 27 мая 2026 года в комплексе Кохи Сомон в Душанбе, Республика Таджикистан.'
      },
      {
        day: '28',
        month: 'МАЯ',
        title: 'Экскурсии и выезды',
        description: 'Экскурсии и выезды будут организованы 28 мая 2026 года для международных участников с целью ознакомления с принимающей страной и опытом Таджикистана в области управления водными ресурсами.'
      }
    ]
  },
  tj: {
    month: 'Май',
    dushanbe: 'Душанбе',
    overviewTitle: 'Чор рӯзи амалиёти ҷаҳонии обӣ',
    venue: 'Кохи Сомон, Душанбе, Ҷумҳурии Тоҷикистон',
    overview: 'Чорабиниҳои марбут ба Конфронс дар давоми чор рӯз — аз 25 то 28 майи соли 2026 дар Душанбе, пойтахти Ҷумҳурии Тоҷикистон баргузор мегарданд.',
    scheduleTitle: 'Ҷадвали конфронс',
    days: [
      {
        day: '25',
        month: 'МАЙ',
        title: 'Форумҳо ва чорабиниҳои ҷонибӣ',
        description: 'Форумҳо ва чорабиниҳои ҷонибии Конфронс 25 майи соли 2026, пеш аз кушоиши расмии Конфронс баргузор мегарданд. Ҷойҳои баргузории форумҳо ва чорабиниҳои ҷонибӣ аз ҷониби ташкилотчиён муайян карда мешаванд.'
      },
      {
        day: '26–27',
        month: 'МАЙ',
        title: 'Конфронси расмии сатҳи баланд',
        description: 'Конфронси расмии сатҳи баланд 26 ва 27 майи соли 2026 дар маҷмааи Кохи Сомон дар Душанбе, Ҷумҳурии Тоҷикистон баргузор мегардад.'
      },
      {
        day: '28',
        month: 'МАЙ',
        title: 'Сафарҳо ва экскурсияҳо',
        description: 'Сафарҳо ва экскурсияҳо 28 майи соли 2026 барои иштирокчиёни байналмилалӣ ҷиҳати шиносоӣ бо кишвари мизбон ва таҷрибаи Тоҷикистон дар соҳаи идоракунии захираҳои обӣ ташкил карда мешаванд.'
      }
    ]
  }
}
