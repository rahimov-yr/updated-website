import { useState } from 'react'
import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Download, FileText, MapPin,
  ChevronLeft, ChevronRight,
  Sparkles, Briefcase, FlaskConical, Heart
} from 'lucide-react'
import '../../styles/progstructure-infographic.css'

export default function ProgramStructure() {
  const { language } = useLanguage()
  const { loading } = useSettings()
  const [activeDay, setActiveDay] = useState(0)

  const banner = usePageBanner('program-structure', {
    title: { ru: 'Структура программы', en: 'Program Structure', tj: 'Сохтори барнома' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'program_structure')

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

      {/* Overview Section */}
      <section className="ps-overview">
        <div className="ps-overview__pattern"></div>
        <div className="container">
          <div className="ps-overview__card">
            <div className="ps-overview__badge">
              <span className="ps-overview__badge-number">4</span>
              <span className="ps-overview__badge-label">{t.badgeLabel}</span>
              <span className="ps-overview__badge-sub">25–28 {t.badgeMonth} 2026</span>
            </div>
            <div className="ps-overview__body">
              <h2 className="ps-overview__title">{t.title}</h2>
              <p className="ps-overview__text">{t.overview}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="ps-formats">
        <div className="ps-formats__pattern"></div>
        <div className="container">
          <h2 className="ps-formats__title">{t.formatsTitle}</h2>
          <div className="ps-formats__list">
            {t.formats.map((f, i) => (
              <div className="ps-fmt" key={i}>
                <span className="ps-fmt__num">0{i + 1}</span>
                <div className="ps-fmt__content">
                  <h3 className="ps-fmt__title">{f.title}</h3>
                  <p className="ps-fmt__text">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Bar */}
      <section className="ps-download">
        <div className="container">
          <div className="ps-download__bar">
            <div className="ps-download__info">
              <div className="ps-download__icon">
                <FileText size={24} />
              </div>
              <div className="ps-download__text">
                <h3>{t.downloadTitle}</h3>
                <p>{t.downloadDesc}</p>
              </div>
            </div>
            <a
              href="/assets/documents/program.html"
              target="_blank"
              rel="noopener noreferrer"
              className="ps-download__btn"
            >
              <Download size={16} />
              {t.downloadBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Full Schedule - Tabbed */}
      <section className="ps-schedule">
        <div className="ps-schedule__pattern"></div>
        <div className="container">
          <h2 className="ps-schedule__title">{t.scheduleTitle}</h2>

          {/* Day tabs */}
          <div className="ps-tabs">
            {t.days.map((day, di) => (
              <button
                key={di}
                className={`ps-tab${activeDay === di ? ' ps-tab--active' : ''}`}
                onClick={() => setActiveDay(di)}
              >
                <span className="ps-tab__label">{t.dayWord} {di + 1}</span>
                <span className="ps-tab__date">{day.date}</span>
                <span className="ps-tab__dot"></span>
              </button>
            ))}
          </div>

          {/* Active day panel */}
          <div className="ps-panel">
            <div className="ps-panel__inner" key={activeDay}>
              <div className="ps-panel__header">
                <div className="ps-panel__day-info">
                  <div className={`ps-panel__day-badge ps-panel__day-badge--${dayColors[activeDay]}`}>
                    {t.dayWord} {activeDay + 1}
                  </div>
                  <div className="ps-panel__day-details">
                    <h3 className="ps-panel__day-title">{t.days[activeDay].name}</h3>
                    <span className="ps-panel__day-date">{t.days[activeDay].date}</span>
                  </div>
                </div>
                <span className="ps-panel__event-count">
                  {t.days[activeDay].events.length} {t.eventsWord}
                </span>
              </div>

              <div className="ps-timeline">
                {t.days[activeDay].events.map((ev, ei) => (
                  <div className={`ps-event ps-event--${ev.type || 'default'}`} key={ei}>
                    <div className="ps-event__time-block">
                      <span className="ps-event__time">{ev.time}</span>
                      <span className="ps-event__dot"></span>
                    </div>
                    <div className="ps-event__content">
                      <p className="ps-event__name">{ev.title}</p>
                      {ev.desc && <p className="ps-event__desc">{ev.desc}</p>}
                      <span className="ps-event__location">
                        <MapPin size={12} />
                        {ev.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <div className="ps-schedule__nav">
            <button
              className="ps-schedule__arrow"
              onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
              disabled={activeDay === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="ps-schedule__arrow"
              onClick={() => setActiveDay(Math.min(t.days.length - 1, activeDay + 1))}
              disabled={activeDay === t.days.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Forums Section */}
      <section className="ps-forums">
        <div className="ps-forums__pattern"></div>
        <div className="container">
          <h2 className="ps-forums__title">{t.forumsTitle}</h2>
          <p className="ps-forums__subtitle">{t.forumsSubtitle}</p>
          <div className="ps-forums__list">
            {t.forums.map((f, i) => (
              <div className="ps-forum" key={i}>
                <div className={`ps-forum__icon ps-forum__icon--${forumColors[i]}`}>
                  {forumIcons[i]}
                </div>
                <div className="ps-forum__content">
                  <h3 className="ps-forum__name">{f.name}</h3>
                  <p className="ps-forum__desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const dayColors = ['blue', 'teal', 'green', 'amber']

const forumIcons = [
  <Sparkles size={22} key="f0" />,
  <Briefcase size={22} key="f1" />,
  <FlaskConical size={22} key="f2" />,
  <Heart size={22} key="f3" />
]

const forumColors = ['blue', 'green', 'purple', 'rose']

const translations = {
  en: {
    badgeLabel: 'Days',
    badgeMonth: 'May',
    label: 'Program Structure',
    title: 'Conference Format Overview',
    overview: 'The conference will take place over 4 days and includes the following formats, designed to maximize engagement and deliver actionable outcomes across all levels of participation.',
    formatsTitle: 'Conference Formats',
    formats: [
      {
        title: 'Plenary Sessions',
        description: 'High-level plenary sessions with participation of heads of state and government, setting the strategic direction for global water action.'
      },
      {
        title: 'Thematic Sessions',
        description: 'Focused sessions on key areas of the water agenda, bringing together experts and practitioners to address critical challenges.'
      },
      {
        title: 'Side Events',
        description: 'Parallel events organized by conference partners, providing platforms for showcasing initiatives and fostering collaboration.'
      },
      {
        title: 'Exhibition',
        description: 'Demonstration of innovative solutions and technologies in water resources management from around the world.'
      }
    ],
    downloadTitle: 'Conference Program',
    downloadDesc: 'Download the full detailed program with schedule and venues',
    downloadBtn: 'Download Program',
    scheduleTitle: 'Detailed Schedule',
    dayWord: 'Day',
    eventsWord: 'events',
    days: [
      {
        name: 'Day 1: Opening Ceremony',
        date: '25 May 2026',
        events: [
          { time: '08:30 – 10:00', title: 'Participant Registration', desc: 'Badge and conference materials distribution', location: 'Main Hall Foyer', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Grand Opening Ceremony', desc: 'Welcome speeches by heads of delegations', location: 'Main Hall', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Coffee Break', location: 'Foyer', type: 'break' },
          { time: '12:00 – 13:30', title: 'High-Level Plenary Session', desc: 'Reports by ministers and international organization representatives', location: 'Main Hall', type: 'plenary' },
          { time: '13:30 – 15:00', title: 'Lunch', location: 'Banquet Hall', type: 'break' },
          { time: '15:00 – 18:00', title: 'Plenary Session (continued)', desc: 'Statements by participating country delegations', location: 'Main Hall', type: 'plenary' }
        ]
      },
      {
        name: 'Day 2: Thematic Sessions',
        date: '26 May 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Session: Water Resources Management', desc: 'Best practices in integrated water resources management', location: 'Hall A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Coffee Break', location: 'Foyer', type: 'break' },
          { time: '11:00 – 12:30', title: 'Session: Climate and Water Security', desc: 'Climate change adaptation in the water sector', location: 'Hall B', type: 'session' },
          { time: '12:30 – 14:00', title: 'Lunch', location: 'Banquet Hall', type: 'break' },
          { time: '14:00 – 15:30', title: 'Session: Transboundary Cooperation', desc: 'Joint water resources management experience', location: 'Hall A', type: 'session' },
          { time: '15:30 – 17:00', title: 'Session: Water Sector Innovations', desc: 'Technological solutions for sustainable water use', location: 'Hall B', type: 'session' }
        ]
      },
      {
        name: 'Day 3: Interactive Dialogues',
        date: '27 May 2026',
        events: [
          { time: '09:00 – 11:00', title: 'Multi-Stakeholder Dialogue', desc: 'Discussion on pathways to achieve SDG 6', location: 'Main Hall', type: 'dialogue' },
          { time: '11:00 – 11:30', title: 'Coffee Break', location: 'Foyer', type: 'break' },
          { time: '11:30 – 13:00', title: 'Innovative Solutions Presentations', desc: 'Showcase of cutting-edge technologies', location: 'Exhibition Hall', type: 'presentation' },
          { time: '13:00 – 14:30', title: 'Lunch', location: 'Banquet Hall', type: 'break' },
          { time: '14:30 – 17:00', title: 'Partner Special Events', desc: 'Parallel sessions by international organizations', location: 'Halls A, B, C', type: 'partner' }
        ]
      },
      {
        name: 'Day 4: Closing Ceremony',
        date: '28 May 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Preparation of Final Documents', desc: 'Finalization of the conference declaration', location: 'Conference Room', type: 'session' },
          { time: '10:30 – 11:00', title: 'Coffee Break', location: 'Foyer', type: 'break' },
          { time: '11:00 – 12:30', title: 'Adoption of Final Documents', desc: 'Official adoption of the Dushanbe Declaration', location: 'Main Hall', type: 'ceremony' },
          { time: '12:30 – 13:30', title: 'Grand Closing Ceremony', desc: 'Summary of outcomes and closing of the conference', location: 'Main Hall', type: 'ceremony' },
          { time: '13:30 – 15:00', title: 'Gala Lunch', location: 'Banquet Hall', type: 'break' }
        ]
      }
    ],
    forumsTitle: 'Thematic Forums',
    forumsSubtitle: 'The conference will feature a number of thematic forums bringing together specialized communities.',
    forums: [
      { name: 'Youth Water Forum', desc: 'Engaging the younger generation in solving water problems' },
      { name: 'Water Business Forum', desc: 'The role of the private sector in developing water technologies' },
      { name: 'Scientific Forum', desc: 'Innovations and research in the field of water resources' },
      { name: 'NGO Forum', desc: 'The role of civil society in water resources management' }
    ]
  },
  ru: {
    badgeLabel: 'Дня',
    badgeMonth: 'Мая',
    label: 'Структура программы',
    title: 'Обзор формата конференции',
    overview: 'Конференция будет проходить в течение 4 дней и включает следующие форматы, направленные на максимальное вовлечение участников и достижение практических результатов на всех уровнях.',
    formatsTitle: 'Форматы конференции',
    formats: [
      {
        title: 'Пленарные заседания',
        description: 'Пленарные заседания высокого уровня с участием глав государств и правительств, определяющие стратегическое направление глобальных действий в области водных ресурсов.'
      },
      {
        title: 'Тематические сессии',
        description: 'Целенаправленные сессии по ключевым направлениям водной повестки, объединяющие экспертов и практиков для решения критических задач.'
      },
      {
        title: 'Параллельные мероприятия',
        description: 'Мероприятия, организуемые партнёрами конференции, предоставляющие платформы для демонстрации инициатив и развития сотрудничества.'
      },
      {
        title: 'Выставка',
        description: 'Демонстрация инновационных решений и технологий в области управления водными ресурсами со всего мира.'
      }
    ],
    downloadTitle: 'Программа конференции',
    downloadDesc: 'Скачайте полную программу с расписанием и местами проведения',
    downloadBtn: 'Скачать программу',
    scheduleTitle: 'Подробное расписание',
    dayWord: 'День',
    eventsWord: 'мероприятий',
    days: [
      {
        name: 'День 1: Церемония открытия',
        date: '25 мая 2026',
        events: [
          { time: '08:30 – 10:00', title: 'Регистрация участников', desc: 'Выдача бейджей и материалов конференции', location: 'Фойе главного зала', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Торжественное открытие', desc: 'Приветственные речи глав делегаций', location: 'Главный зал', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
          { time: '12:00 – 13:30', title: 'Пленарное заседание высокого уровня', desc: 'Доклады министров и представителей международных организаций', location: 'Главный зал', type: 'plenary' },
          { time: '13:30 – 15:00', title: 'Обед', location: 'Банкетный зал', type: 'break' },
          { time: '15:00 – 18:00', title: 'Пленарное заседание (продолжение)', desc: 'Выступления делегаций стран-участниц', location: 'Главный зал', type: 'plenary' }
        ]
      },
      {
        name: 'День 2: Тематические сессии',
        date: '26 мая 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Сессия: Управление водными ресурсами', desc: 'Лучшие практики интегрированного управления водными ресурсами', location: 'Зал A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
          { time: '11:00 – 12:30', title: 'Сессия: Климат и водная безопасность', desc: 'Адаптация к изменению климата в водном секторе', location: 'Зал B', type: 'session' },
          { time: '12:30 – 14:00', title: 'Обед', location: 'Банкетный зал', type: 'break' },
          { time: '14:00 – 15:30', title: 'Сессия: Трансграничное сотрудничество', desc: 'Опыт совместного управления водными ресурсами', location: 'Зал A', type: 'session' },
          { time: '15:30 – 17:00', title: 'Сессия: Инновации в водной отрасли', desc: 'Технологические решения для устойчивого водопользования', location: 'Зал B', type: 'session' }
        ]
      },
      {
        name: 'День 3: Интерактивные диалоги',
        date: '27 мая 2026',
        events: [
          { time: '09:00 – 11:00', title: 'Многосторонний диалог', desc: 'Обсуждение путей достижения ЦУР 6', location: 'Главный зал', type: 'dialogue' },
          { time: '11:00 – 11:30', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
          { time: '11:30 – 13:00', title: 'Презентации инновационных решений', desc: 'Демонстрация передовых технологий', location: 'Выставочный зал', type: 'presentation' },
          { time: '13:00 – 14:30', title: 'Обед', location: 'Банкетный зал', type: 'break' },
          { time: '14:30 – 17:00', title: 'Специальные мероприятия партнёров', desc: 'Параллельные сессии международных организаций', location: 'Залы A, B, C', type: 'partner' }
        ]
      },
      {
        name: 'День 4: Церемония закрытия',
        date: '28 мая 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Подготовка итоговых документов', desc: 'Финализация декларации конференции', location: 'Зал заседаний', type: 'session' },
          { time: '10:30 – 11:00', title: 'Кофе-брейк', location: 'Фойе', type: 'break' },
          { time: '11:00 – 12:30', title: 'Принятие итоговых документов', desc: 'Официальное принятие Душанбинской декларации', location: 'Главный зал', type: 'ceremony' },
          { time: '12:30 – 13:30', title: 'Торжественная церемония закрытия', desc: 'Подведение итогов и закрытие конференции', location: 'Главный зал', type: 'ceremony' },
          { time: '13:30 – 15:00', title: 'Торжественный обед', location: 'Банкетный зал', type: 'break' }
        ]
      }
    ],
    forumsTitle: 'Тематические форумы',
    forumsSubtitle: 'В рамках конференции пройдёт ряд тематических форумов, объединяющих специализированные сообщества.',
    forums: [
      { name: 'Молодёжный водный форум', desc: 'Вовлечение молодого поколения в решение водных проблем' },
      { name: 'Бизнес-форум по воде', desc: 'Роль частного сектора в развитии водных технологий' },
      { name: 'Научный форум', desc: 'Инновации и исследования в области водных ресурсов' },
      { name: 'Форум НПО', desc: 'Роль гражданского общества в управлении водными ресурсами' }
    ]
  },
  tj: {
    badgeLabel: 'Рӯз',
    badgeMonth: 'Май',
    label: 'Сохтори барнома',
    title: 'Шарҳи формати конфронс',
    overview: 'Конфронс дар давоми 4 рӯз баргузор мешавад ва форматҳои зеринро дар бар мегирад, ки барои ҳадди аксари ҷалби иштирокчиён ва ноил шудан ба натиҷаҳои амалӣ дар ҳамаи сатҳҳо пешбинӣ шудаанд.',
    formatsTitle: 'Форматҳои конфронс',
    formats: [
      {
        title: 'Ҷаласаҳои пленарӣ',
        description: 'Ҷаласаҳои пленарии сатҳи баланд бо иштироки сарони давлатҳо ва ҳукуматҳо, ки самти стратегии амалиёти ҷаҳонии обиро муайян мекунанд.'
      },
      {
        title: 'Сессияҳои мавзӯӣ',
        description: 'Сессияҳои мутамарказ оид ба самтҳои калидии дастури кории обӣ, ки коршиносон ва амалиётчиёнро барои ҳалли масъалаҳои муҳим муттаҳид мекунанд.'
      },
      {
        title: 'Чорабиниҳои параллелӣ',
        description: 'Чорабиниҳо, ки аз ҷониби шарикони конфронс ташкил карда мешаванд ва барои намоиши ташаббусҳо ва рушди ҳамкорӣ платформа фароҳам меоваранд.'
      },
      {
        title: 'Намоишгоҳ',
        description: 'Намоиши роҳҳои ҳалли навоварона ва технологияҳо дар соҳаи идоракунии захираҳои обӣ аз саросари ҷаҳон.'
      }
    ],
    downloadTitle: 'Барномаи конфронс',
    downloadDesc: 'Барномаи пурраро бо ҷадвал ва ҷойҳои баргузорӣ боргирӣ кунед',
    downloadBtn: 'Боргирии барнома',
    scheduleTitle: 'Ҷадвали муфассал',
    dayWord: 'Рӯзи',
    eventsWord: 'чорабиниҳо',
    days: [
      {
        name: 'Рӯзи 1: Маросими кушоиш',
        date: '25 майи 2026',
        events: [
          { time: '08:30 – 10:00', title: 'Бақайдгирии иштирокчиён', desc: 'Додани бейҷҳо ва маводи конфронс', location: 'Фойеи толори асосӣ', type: 'registration' },
          { time: '10:00 – 11:30', title: 'Кушоиши тантанавӣ', desc: 'Суханрониҳои хайрияти сарони ҳайатҳо', location: 'Толори асосӣ', type: 'ceremony' },
          { time: '11:30 – 12:00', title: 'Танаффус', location: 'Фойе', type: 'break' },
          { time: '12:00 – 13:30', title: 'Ҷаласаи пленарии сатҳи баланд', desc: 'Маърӯзаҳои вазирон ва намояндагони созмонҳои байналмилалӣ', location: 'Толори асосӣ', type: 'plenary' },
          { time: '13:30 – 15:00', title: 'Хӯроки нисфирӯзӣ', location: 'Толори зиёфат', type: 'break' },
          { time: '15:00 – 18:00', title: 'Ҷаласаи пленарӣ (идома)', desc: 'Баромадҳои ҳайатҳои кишварҳои иштирокчӣ', location: 'Толори асосӣ', type: 'plenary' }
        ]
      },
      {
        name: 'Рӯзи 2: Сессияҳои мавзӯӣ',
        date: '26 майи 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Сессия: Идоракунии захираҳои обӣ', desc: 'Таҷрибаҳои беҳтарини идоракунии ҳамаҷонибаи захираҳои обӣ', location: 'Толори A', type: 'session' },
          { time: '10:30 – 11:00', title: 'Танаффус', location: 'Фойе', type: 'break' },
          { time: '11:00 – 12:30', title: 'Сессия: Иқлим ва амнияти обӣ', desc: 'Мутобиқшавӣ ба тағйироти иқлим дар бахши обӣ', location: 'Толори B', type: 'session' },
          { time: '12:30 – 14:00', title: 'Хӯроки нисфирӯзӣ', location: 'Толори зиёфат', type: 'break' },
          { time: '14:00 – 15:30', title: 'Сессия: Ҳамкории трансмарзӣ', desc: 'Таҷрибаи идоракунии муштараки захираҳои обӣ', location: 'Толори A', type: 'session' },
          { time: '15:30 – 17:00', title: 'Сессия: Навоварӣ дар соҳаи об', desc: 'Роҳҳои ҳалли технологӣ барои истифодаи устувори об', location: 'Толори B', type: 'session' }
        ]
      },
      {
        name: 'Рӯзи 3: Муколамаҳои интерактивӣ',
        date: '27 майи 2026',
        events: [
          { time: '09:00 – 11:00', title: 'Муколамаи бисёрҷониба', desc: 'Муҳокимаи роҳҳои ноил шудан ба ҲРУ 6', location: 'Толори асосӣ', type: 'dialogue' },
          { time: '11:00 – 11:30', title: 'Танаффус', location: 'Фойе', type: 'break' },
          { time: '11:30 – 13:00', title: 'Презентатсияи роҳҳои ҳалли навоварона', desc: 'Намоиши технологияҳои пешрафта', location: 'Толори намоишӣ', type: 'presentation' },
          { time: '13:00 – 14:30', title: 'Хӯроки нисфирӯзӣ', location: 'Толори зиёфат', type: 'break' },
          { time: '14:30 – 17:00', title: 'Чорабиниҳои махсуси шарикон', desc: 'Сессияҳои параллелии созмонҳои байналмилалӣ', location: 'Толорҳои A, B, C', type: 'partner' }
        ]
      },
      {
        name: 'Рӯзи 4: Маросими хотима',
        date: '28 майи 2026',
        events: [
          { time: '09:00 – 10:30', title: 'Тайёр кардани ҳуҷҷатҳои ниҳоӣ', desc: 'Ниҳоӣ кардани эъломияи конфронс', location: 'Толори ҷаласа', type: 'session' },
          { time: '10:30 – 11:00', title: 'Танаффус', location: 'Фойе', type: 'break' },
          { time: '11:00 – 12:30', title: 'Қабули ҳуҷҷатҳои ниҳоӣ', desc: 'Қабули расмии Эъломияи Душанбе', location: 'Толори асосӣ', type: 'ceremony' },
          { time: '12:30 – 13:30', title: 'Маросими тантанавии хотима', desc: 'Ҷамъбасти натиҷаҳо ва хотимаи конфронс', location: 'Толори асосӣ', type: 'ceremony' },
          { time: '13:30 – 15:00', title: 'Хӯроки тантанавӣ', location: 'Толори зиёфат', type: 'break' }
        ]
      }
    ],
    forumsTitle: 'Форумҳои мавзӯӣ',
    forumsSubtitle: 'Дар доираи конфронс қатор форумҳои мавзӯӣ баргузор мешаванд, ки ҷамоатҳои тахассусиро муттаҳид мекунанд.',
    forums: [
      { name: 'Форуми обии ҷавонон', desc: 'Ҷалб кардани насли ҷавон ба ҳалли масъалаҳои обӣ' },
      { name: 'Форуми тиҷоратии обӣ', desc: 'Нақши бахши хусусӣ дар рушди технологияҳои обӣ' },
      { name: 'Форуми илмӣ', desc: 'Навоварӣ ва таҳқиқот дар соҳаи захираҳои обӣ' },
      { name: 'Форуми ТҶМ', desc: 'Нақши ҷомеаи шаҳрвандӣ дар идоракунии захираҳои обӣ' }
    ]
  }
}
