import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import { Handshake } from 'lucide-react'
import '../../styles/plenary-infographic.css'

export default function Plenary() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('program-plenary', {
    title: { ru: 'Пленарное заседание', en: 'Plenary Session', tj: 'Ҷаласаи пленарӣ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'program_plenary')

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

      {/* Intro - Quote style */}
      <section className="pln-intro">
        <div className="pln-intro__pattern"></div>
        <div className="container">
          <div className="pln-intro__quote">
            <p className="pln-intro__text">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Session Format - Timeline */}
      <section className="pln-format">
        <div className="pln-format__pattern"></div>
        <div className="container">
          <h2 className="pln-format__title">{t.pointsTitle}</h2>
          <p className="pln-format__subtitle">{t.pointsSubtitle}</p>
          <div className="pln-timeline">
            {t.steps.map((step, i) => (
              <div className="pln-timeline__item" key={i}>
                <div className="pln-timeline__marker">
                  <span className="pln-timeline__num">{i + 1}</span>
                </div>
                <div className="pln-timeline__card">
                  <h3 className="pln-timeline__heading">{step.title}</h3>
                  <p className="pln-timeline__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments - Gradient banner */}
      <section className="pln-commit-section">
        <div className="container">
          <div className="pln-banner">
            <div className="pln-banner__pattern"></div>
            <div className="pln-banner__content">
              <div className="pln-banner__label">
                <Handshake size={13} />
                {t.commitTag}
              </div>
              <h2 className="pln-banner__title">{t.commitTitle}</h2>
              <p className="pln-banner__text">{t.commitText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics - Card grid */}
      <section className="pln-topics">
        <div className="pln-topics__pattern"></div>
        <div className="container">
          <h2 className="pln-topics__title">{t.topicsTitle}</h2>
          <div className="pln-topics__grid">
            {t.topics.map((topic, i) => (
              <div className={`pln-card pln-card--${cardColors[i]}`} key={i}>
                <span className="pln-card__watermark">0{i + 1}</span>
                <h3 className="pln-card__name">{topic.name}</h3>
                <p className="pln-card__desc">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const cardColors = ['blue', 'teal', 'green', 'navy']

const translations = {
  en: {
    accentLabel: 'High Level',
    tag: 'Political Statements',
    title: 'Plenary Sessions',
    description: 'The Plenary sessions will provide an opportunity for the Heads of Delegation to make political statements. Guidelines to make statements consistent with the Water Action Decade, SDG 6 and other internationally agreed water-related goals and targets will be provided to Heads of Delegations through diplomatic channels, as appropriate.',
    pointsTitle: 'Session Format',
    pointsSubtitle: 'Key aspects of the plenary session organization and participation.',
    steps: [
      {
        title: 'Statements by Heads of Delegation',
        desc: 'Each delegation will have the opportunity to present their national position and vision on water-related issues at the highest political level.'
      },
      {
        title: 'Guidelines via Diplomatic Channels',
        desc: 'Detailed guidelines ensuring consistency with the Water Action Decade and SDG 6 will be communicated through official diplomatic channels.'
      },
      {
        title: 'Commitments & Progress Updates',
        desc: 'Statements that provide progress updates on existing Water Action Agenda commitments and announcements of new commitments are highly welcome.'
      }
    ],
    commitTag: 'Water Action Agenda',
    commitTitle: 'New Commitments Welcome',
    commitText: 'Delegations are strongly encouraged to announce new voluntary commitments to the Water Action Agenda during the plenary sessions. Progress updates on existing commitments demonstrate collective action toward achieving SDG 6 and water-related targets.',
    topicsTitle: 'Focus Areas for Statements',
    topics: [
      { name: 'Water Action Decade', desc: 'Progress and achievements within the International Decade for Action "Water for Sustainable Development" 2018–2028.' },
      { name: 'SDG 6 Implementation', desc: 'National and regional efforts to ensure availability and sustainable management of water and sanitation for all.' },
      { name: 'Transboundary Cooperation', desc: 'Cross-border water resource management and partnerships between states on shared water bodies.' },
      { name: 'Innovation & Investment', desc: 'Technological advances and financial mechanisms supporting sustainable water resource management.' }
    ]
  },
  ru: {
    accentLabel: 'Высокий уровень',
    tag: 'Политические заявления',
    title: 'Пленарные заседания',
    description: 'Пленарные заседания предоставят возможность главам делегаций выступить с политическими заявлениями. Руководства по подготовке заявлений, соответствующих Десятилетию действий в области водных ресурсов, ЦУР 6 и другим согласованным на международном уровне целям и задачам, будут доведены до глав делегаций по дипломатическим каналам.',
    pointsTitle: 'Формат заседаний',
    pointsSubtitle: 'Ключевые аспекты организации и участия в пленарных заседаниях.',
    steps: [
      {
        title: 'Выступления глав делегаций',
        desc: 'Каждая делегация получит возможность представить свою национальную позицию и видение по водным вопросам на высшем политическом уровне.'
      },
      {
        title: 'Руководства по дипломатическим каналам',
        desc: 'Подробные руководства, обеспечивающие соответствие Десятилетию действий в области водных ресурсов и ЦУР 6, будут переданы через официальные дипломатические каналы.'
      },
      {
        title: 'Обязательства и отчёты о прогрессе',
        desc: 'Приветствуются заявления с обновлённой информацией о выполнении существующих обязательств Повестки дня водных действий и объявления о новых обязательствах.'
      }
    ],
    commitTag: 'Повестка водных действий',
    commitTitle: 'Новые обязательства приветствуются',
    commitText: 'Делегациям настоятельно рекомендуется объявить о новых добровольных обязательствах в рамках Повестки дня водных действий во время пленарных заседаний. Отчёты о прогрессе по существующим обязательствам демонстрируют коллективные действия по достижению ЦУР 6.',
    topicsTitle: 'Тематические направления заявлений',
    topics: [
      { name: 'Десятилетие водных действий', desc: 'Прогресс и достижения в рамках Международного десятилетия действий «Вода для устойчивого развития» 2018–2028.' },
      { name: 'Реализация ЦУР 6', desc: 'Национальные и региональные усилия по обеспечению доступности и устойчивого управления водными ресурсами и санитарией для всех.' },
      { name: 'Трансграничное сотрудничество', desc: 'Управление трансграничными водными ресурсами и партнёрство между государствами в отношении общих водных объектов.' },
      { name: 'Инновации и инвестиции', desc: 'Технологические достижения и финансовые механизмы, поддерживающие устойчивое управление водными ресурсами.' }
    ]
  },
  tj: {
    accentLabel: 'Сатҳи баланд',
    tag: 'Баёнотҳои сиёсӣ',
    title: 'Ҷаласаҳои пленарӣ',
    description: 'Ҷаласаҳои пленарӣ ба сарони ҳайатҳо имконият медиҳанд, ки бо баёнотҳои сиёсӣ баромад кунанд. Дастурҳо барои тайёр кардани баёнотҳо мутобиқ бо Даҳсолаи амалиёти обӣ, ҲРУ 6 ва дигар ҳадафҳо ва вазифаҳои ба об марбута тавассути каналҳои дипломатӣ ба сарони ҳайатҳо расонида мешаванд.',
    pointsTitle: 'Формати ҷаласа',
    pointsSubtitle: 'Ҷанбаҳои асосии ташкил ва иштирок дар ҷаласаҳои пленарӣ.',
    steps: [
      {
        title: 'Баромадҳои сарони ҳайатҳо',
        desc: 'Ҳар як ҳайат имконият хоҳад дошт, ки мавқеи миллӣ ва дурнамои худро оид ба масъалаҳои обӣ дар сатҳи баландтарини сиёсӣ пешниҳод кунад.'
      },
      {
        title: 'Дастурҳо тавассути каналҳои дипломатӣ',
        desc: 'Дастурҳои муфассал, ки мутобиқати бо Даҳсолаи амалиёти обӣ ва ҲРУ 6-ро таъмин мекунанд, тавассути каналҳои расмии дипломатӣ расонида мешаванд.'
      },
      {
        title: 'Ӯҳдадориҳо ва гузоришҳои пешрафт',
        desc: 'Баёнотҳо бо маълумоти навшуда дар бораи иҷрои ӯҳдадориҳои мавҷуда ва эълони ӯҳдадориҳои нав хеле хуш пазируфта мешаванд.'
      }
    ],
    commitTag: 'Барномаи амалиёти обӣ',
    commitTitle: 'Ӯҳдадориҳои нав хуш пазируфта мешаванд',
    commitText: 'Ба ҳайатҳо тавсия дода мешавад, ки дар давоми ҷаласаҳои пленарӣ ӯҳдадориҳои нави ихтиёрӣ дар доираи Барномаи амалиёти обӣ эълон кунанд. Гузоришҳо дар бораи пешрафти ӯҳдадориҳои мавҷуда амалиёти дастаҷамъиро барои ноил шудан ба ҲРУ 6 нишон медиҳанд.',
    topicsTitle: 'Самтҳои мавзӯии баёнотҳо',
    topics: [
      { name: 'Даҳсолаи амалиёти обӣ', desc: 'Пешрафт ва дастовардҳо дар доираи Даҳсолаи байналмилалии амалиёт «Об барои рушди устувор» 2018–2028.' },
      { name: 'Татбиқи ҲРУ 6', desc: 'Кӯшишҳои миллӣ ва минтақавӣ барои таъмини дастрасӣ ва идоракунии устувори захираҳои обӣ ва санитария барои ҳама.' },
      { name: 'Ҳамкории трансмарзӣ', desc: 'Идоракунии захираҳои обии трансмарзӣ ва шарикии байни давлатҳо оид ба объектҳои муштараки обӣ.' },
      { name: 'Навоварӣ ва сармоягузорӣ', desc: 'Дастовардҳои технологӣ ва механизмҳои молиявӣ, ки идоракунии устувори захираҳои обиро дастгирӣ мекунанд.' }
    ]
  }
}
