import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Droplets, Globe, CalendarDays, Users,
  Handshake, Building2,
  ArrowRight, Landmark, Megaphone, MessageCircle,
  Compass, Award, UserCheck, Share2
} from 'lucide-react'
import '../../styles/introduction-infographic.css'

export default function Introduction() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('conference-introduction', {
    title: { ru: 'Введение', en: 'Introduction', tj: 'Муқаддима' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'conference_intro')

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

      {/* Main Conference Overview */}
      <section className="intro-section">
        <div className="intro-pattern-corner intro-pattern-corner--top-right"></div>
        <div className="container">
          <div className="intro-hero-card">
            <div className="intro-hero-card__water-bg"></div>
            <div className="intro-hero-card__body">
              <h2 className="intro-hero-card__title">{t.heroTitle}</h2>
              <p className="intro-hero-card__text">{t.heroText}</p>
            </div>
            <div className="intro-hero-card__badge">
              <Droplets size={22} className="intro-hero-card__badge-icon" />
              <span className="intro-hero-card__badge-date">25–28</span>
              <span className="intro-hero-card__badge-month">{t.may} 2026</span>
              <span className="intro-hero-card__badge-city">{t.dushanbe}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dushanbe Water Process */}
      <section className="intro-section intro-section--light">
        <div className="intro-pattern-bg intro-pattern-bg--light"></div>
        <div className="container">
          <h2 className="intro-section-header__title">{t.waterProcessTitle}</h2>
          <div className="intro-process-card">
            <div className="intro-process-card__accent"></div>
            <p>{t.waterProcessText}</p>
            <div className="intro-process-card__footer">
              <div className="intro-process-card__stat">
                <Users size={20} />
                <span>{t.coChaired}</span>
              </div>
              <div className="intro-process-card__stat">
                <Building2 size={20} />
                <span>{t.govTajikistan}</span>
              </div>
              <div className="intro-process-card__stat">
                <Globe size={20} />
                <span>{t.unitedNations}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline of Conferences */}
      <section className="intro-section">
        <div className="intro-pattern-corner intro-pattern-corner--bottom-left"></div>
        <div className="container">
          <h2 className="intro-section-header__title">{t.timelineTitle}</h2>
          <p className="intro-section-subtitle">{t.timelineSubtitle}</p>

          <div className="intro-timeline">
            {t.conferences.map((conf, i) => (
              <div className={`intro-timeline-card ${i === 3 ? 'intro-timeline-card--active' : ''}`} key={i}>
                {i === 3 && <div className="intro-timeline-card__pattern"></div>}
                <div className="intro-timeline-card__number">{conf.number}</div>
                <div className="intro-timeline-card__content">
                  <div className="intro-timeline-card__year">{conf.year}</div>
                  <h3 className="intro-timeline-card__title">{conf.title}</h3>
                  <p className="intro-timeline-card__date">
                    <CalendarDays size={14} />
                    {conf.date}
                  </p>
                  {conf.subtitle && (
                    <p className="intro-timeline-card__subtitle">{conf.subtitle}</p>
                  )}
                </div>
                {i < 3 && <div className="intro-timeline-card__connector"><ArrowRight size={16} /></div>}
              </div>
            ))}
          </div>

          <div className="intro-continuation-card">
            <Droplets size={24} />
            <p>{t.continuationText}</p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="intro-section intro-section--dark">
        <div className="intro-pattern-bg intro-pattern-bg--dark"></div>
        <div className="intro-pattern-bg intro-pattern-bg--dark-left"></div>
        <div className="intro-section__water-decoration"></div>
        <div className="container">
          <h2 className="intro-section-header__title intro-section-header__title--light">{t.objectivesTitle}</h2>

          <div className="intro-objective-main">
            <div className="intro-objective-main__icon">
              <Megaphone size={28} />
            </div>
            <div>
              <h3>{t.mainObjectiveLabel}</h3>
              <p>{t.mainObjective}</p>
            </div>
          </div>

          <p className="intro-objective-secondary">{t.alsoAims}</p>

          <h3 className="intro-objectives-list-title">{t.focusTitle}</h3>
          <div className="intro-objectives-grid">
            {t.objectives.map((obj, i) => (
              <div className="intro-objective-card" key={i}>
                <div className="intro-objective-card__icon">
                  {objectiveIcons[i]}
                </div>
                <div className="intro-objective-card__number">0{i + 1}</div>
                <p className="intro-objective-card__text">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dates and Venue */}
      <section className="intro-section">
        <div className="intro-pattern-corner intro-pattern-corner--top-right"></div>
        <div className="container">
          <h2 className="intro-section-header__title">{t.datesTitle}</h2>

          <div className="intro-schedule-grid">
            {t.schedule.map((item, i) => (
              <div className="intro-schedule-card" key={i}>
                <div className="intro-schedule-card__header">
                  <div className="intro-schedule-card__icon">
                    {scheduleIcons[i]}
                  </div>
                  <div className="intro-schedule-card__date">{item.date}</div>
                </div>
                <h3 className="intro-schedule-card__title">{item.title}</h3>
                <p className="intro-schedule-card__desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Format & Participation */}
      <section className="intro-section intro-section--light">
        <div className="intro-pattern-bg intro-pattern-bg--light-bottom"></div>
        <div className="container">
          <h2 className="intro-section-header__title">{t.formatTitle}</h2>

          <div className="intro-format-grid">
            <div className="intro-format-card">
              <div className="intro-format-card__icon">
                <Share2 size={28} />
              </div>
              <h3>{t.multiStakeholderTitle}</h3>
              <p>{t.multiStakeholderText}</p>
            </div>

            <div className="intro-format-card">
              <div className="intro-format-card__icon">
                <Award size={28} />
              </div>
              <h3>{t.participantsTitle}</h3>
              <p>{t.participantsText}</p>
            </div>

            <div className="intro-format-card">
              <div className="intro-format-card__icon">
                <UserCheck size={28} />
              </div>
              <h3>{t.inPersonTitle}</h3>
              <p>{t.inPersonText}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const objectiveIcons = [
  <Globe size={24} key="obj0" />,
  <Handshake size={24} key="obj1" />,
  <Droplets size={24} key="obj2" />,
  <MessageCircle size={24} key="obj3" />
]

const scheduleIcons = [
  <MessageCircle size={24} key="sch0" />,
  <Landmark size={24} key="sch1" />,
  <Compass size={24} key="sch2" />
]

const translations = {
  en: {
    may: 'May',
    dushanbe: 'Dushanbe',
    heroTitle: 'The Fourth High-Level International Conference',
    heroText: 'The Fourth High-Level International Conference on the International Decade for Action "Water for Sustainable Development", 2018\u20132028, will be held from 25 to 28 May 2026 in Dushanbe within the framework of the Dushanbe Water Process.',
    waterProcessTitle: 'The Dushanbe Water Process',
    waterProcessText: 'The Dushanbe Water Process is an initiative of the Government of the Republic of Tajikistan aimed at supporting the implementation of the objectives of the International Decade for Action "Water for Sustainable Development", 2018\u20132028, through a series of conferences convened every two years by the Government of Tajikistan in close cooperation with the United Nations. The conferences are co-chaired by the Prime Minister of the Republic of Tajikistan and the United Nations Under-Secretary-General for Economic and Social Affairs.',
    coChaired: 'Co-chaired leadership',
    govTajikistan: 'Government of Tajikistan',
    unitedNations: 'United Nations',
    timelineTitle: 'Conference History',
    timelineSubtitle: 'To date, three Dushanbe Conferences on the Water Action Decade have been successfully held in Dushanbe:',
    conferences: [
      { number: '1st', year: '2018', title: 'First High-Level International Conference', date: '20\u201322 June 2018', subtitle: null },
      { number: '2nd', year: '2022', title: 'Second High-Level International Conference', date: '6\u20139 June 2022', subtitle: '"Catalyzing Actions and Partnerships for Water at Local, National, Regional and Global Levels"' },
      { number: '3rd', year: '2024', title: 'Third High-Level International Conference', date: '10\u201313 June 2024', subtitle: null },
      { number: '4th', year: '2026', title: 'Fourth High-Level International Conference', date: '25\u201328 May 2026', subtitle: null }
    ],
    continuationText: 'The organization and convening of the Fourth Dushanbe Conference on the Water Action Decade from 25 to 28 May 2026 in Dushanbe will continue Tajikistan\u2019s long-standing tradition of providing an inclusive platform for policy dialogue, exchange of views, partnership-building, and the promotion of global action.',
    objectivesTitle: 'Objectives',
    mainObjectiveLabel: 'Main Objective',
    mainObjective: 'The main objective of the Fourth Dushanbe Conference on the Water Action Decade is to further mobilize collective efforts and support the implementation of voluntary commitments registered in the Water Action Agenda of the UN Water Conference, as well as to stimulate new partnerships and accelerate actions towards achieving the objectives of the 2030 Agenda for Sustainable Development.',
    alsoAims: 'The Conference also aims to facilitate the exchange of best practices and innovative solutions, strengthen partnerships among stakeholders, enhance the role of water in sustainable development, raise awareness, and mobilize political will to accelerate progress in achieving water-related goals of the 2030 Agenda.',
    focusTitle: 'In particular, the Fourth Dushanbe Conference on the Water Action Decade will focus on:',
    objectives: [
      'To serve as a key preparatory meeting for the 2026 UN Water Conference co-hosted by the Republic of Senegal and the United Arab Emirates.',
      'To showcase scalable solutions, strengthen cooperation and forge partnerships to address priority water-related opportunities and challenges.',
      'To bolster implementation of the Water Action Decade, building on the four work streams of the United Nations Secretary-General\u2019s Action Plan for the Water Action Decade 2018\u20132028.',
      'To conduct an informal consultation with stakeholders for the UN 2028 Water Conference that will serve as the final comprehensive review of the Water Action Decade 2018\u20132028 and an initial discussion on the way forward, including post-2030.'
    ],
    datesTitle: 'Dates & Venue',
    schedule: [
      { date: '25 May 2026', title: 'Forums & Side Events', description: 'Forums and side events will be held on the eve of the official opening. The venues will be determined by the organizers and communicated at a later stage.' },
      { date: '26\u201327 May 2026', title: 'Official High-Level Conference', description: 'The official High-Level Conference will be held at the Kohi Somon Complex in Dushanbe, Republic of Tajikistan.' },
      { date: '28 May 2026', title: 'Field Visits & Study Tours', description: 'Field visits and study tours will be organized for international participants to familiarize them with the host country and explore Tajikistan\u2019s experience in water resources management.' }
    ],
    formatTitle: 'Format & Participation',
    multiStakeholderTitle: 'Multi-Stakeholder Nature',
    multiStakeholderText: 'The Conference is multi-stakeholder in nature and will bring together different groups and actors involved in the implementation of water-related goals and targets.',
    participantsTitle: 'High-Level Participants',
    participantsText: 'The Conference will gather high-level representatives of UN Member States, UN entities, international and regional organizations, international financial institutions, the private sector, civil society, women, youth, Indigenous Peoples, local communities, local governments, academic institutions, the scientific community and other stakeholders. Participation of representatives from different sectors "out of water box" is strongly encouraged.',
    inPersonTitle: 'In-Person Event',
    inPersonText: 'The 4th Dushanbe Water Action Decade Conference will be an in-person event to ensure the highest level of interaction among participants.'
  },
  ru: {
    may: 'Мая',
    dushanbe: 'Душанбе',
    heroTitle: 'Четвёртая международная конференция высокого уровня',
    heroText: 'Четвёртая международная конференция высокого уровня по Международному десятилетию действий «Вода для устойчивого развития», 2018–2028 годы, пройдёт с 25 по 28 мая 2026 года в Душанбе в рамках Душанбинского водного процесса.',
    waterProcessTitle: 'Душанбинский водный процесс',
    waterProcessText: 'Душанбинский водный процесс — это инициатива Правительства Республики Таджикистан, направленная на поддержку реализации целей Международного десятилетия действий «Вода для устойчивого развития», 2018–2028 годы, посредством серии конференций, проводимых каждые два года Правительством Таджикистана в тесном сотрудничестве с Организацией Объединённых Наций. Конференции проводятся под сопредседательством Премьер-министра Республики Таджикистан и Заместителя Генерального секретаря ООН по экономическим и социальным вопросам.',
    coChaired: 'Сопредседательство',
    govTajikistan: 'Правительство Таджикистана',
    unitedNations: 'Организация Объединённых Наций',
    timelineTitle: 'История конференций',
    timelineSubtitle: 'На сегодняшний день в Душанбе успешно проведены три Душанбинские конференции по Десятилетию водных действий:',
    conferences: [
      { number: '1-я', year: '2018', title: 'Первая международная конференция высокого уровня', date: '20–22 июня 2018 г.', subtitle: null },
      { number: '2-я', year: '2022', title: 'Вторая международная конференция высокого уровня', date: '6–9 июня 2022 г.', subtitle: '«Катализация действий и партнёрств в области водных ресурсов на местном, национальном, региональном и глобальном уровнях»' },
      { number: '3-я', year: '2024', title: 'Третья международная конференция высокого уровня', date: '10–13 июня 2024 г.', subtitle: null },
      { number: '4-я', year: '2026', title: 'Четвёртая международная конференция высокого уровня', date: '25–28 мая 2026 г.', subtitle: null }
    ],
    continuationText: 'Организация и проведение Четвёртой Душанбинской конференции по Десятилетию водных действий с 25 по 28 мая 2026 года в Душанбе продолжит давнюю традицию Таджикистана по предоставлению инклюзивной платформы для политического диалога, обмена мнениями, построения партнёрств и содействия глобальным действиям.',
    objectivesTitle: 'Цели',
    mainObjectiveLabel: 'Основная цель',
    mainObjective: 'Основная цель Четвёртой Душанбинской конференции по Десятилетию водных действий — дальнейшая мобилизация коллективных усилий и поддержка выполнения добровольных обязательств, зарегистрированных в Повестке водных действий Конференции ООН по водным ресурсам, а также стимулирование новых партнёрств и ускорение действий по достижению целей Повестки дня в области устойчивого развития на период до 2030 года.',
    alsoAims: 'Конференция также направлена на содействие обмену передовым опытом и инновационными решениями, укрепление партнёрств между заинтересованными сторонами, повышение роли воды в устойчивом развитии, повышение осведомлённости и мобилизацию политической воли для ускорения прогресса в достижении водных целей Повестки дня на период до 2030 года.',
    focusTitle: 'В частности, Четвёртая Душанбинская конференция будет сосредоточена на следующих целях:',
    objectives: [
      'Стать ключевым подготовительным мероприятием к Конференции ООН по водным ресурсам 2026 года, организуемой совместно Республикой Сенегал и Объединёнными Арабскими Эмиратами.',
      'Представить масштабируемые решения, укрепить сотрудничество и создать партнёрства для решения приоритетных задач и использования возможностей в области водных ресурсов.',
      'Содействовать реализации Десятилетия водных действий, опираясь на четыре направления работы Плана действий Генерального секретаря ООН по Десятилетию водных действий 2018–2028.',
      'Провести неформальные консультации с заинтересованными сторонами по подготовке к Конференции ООН по водным ресурсам 2028 года, которая станет заключительным всесторонним обзором Десятилетия водных действий 2018–2028 и начальным обсуждением дальнейших шагов, включая период после 2030 года.'
    ],
    datesTitle: 'Даты и место проведения',
    schedule: [
      { date: '25 мая 2026', title: 'Форумы и параллельные мероприятия', description: 'Форумы и параллельные мероприятия пройдут накануне официального открытия конференции. Места проведения будут определены организаторами и сообщены дополнительно.' },
      { date: '26–27 мая 2026', title: 'Официальная конференция высокого уровня', description: 'Официальная конференция высокого уровня пройдёт в комплексе Кохи Сомон в Душанбе, Республика Таджикистан.' },
      { date: '28 мая 2026', title: 'Полевые визиты и ознакомительные поездки', description: 'Для международных участников будут организованы полевые визиты и ознакомительные поездки для знакомства со страной-хозяйкой и изучения опыта Таджикистана в управлении водными ресурсами.' }
    ],
    formatTitle: 'Формат и участие',
    multiStakeholderTitle: 'Многосторонний характер',
    multiStakeholderText: 'Конференция носит многосторонний характер и объединит различные группы и участников, задействованных в реализации водных целей и задач.',
    participantsTitle: 'Участники высокого уровня',
    participantsText: 'Конференция соберёт представителей высокого уровня государств — членов ООН, учреждений ООН, международных и региональных организаций, международных финансовых институтов, частного сектора, гражданского общества, женщин, молодёжи, коренных народов, местных сообществ, местных органов власти, академических учреждений, научного сообщества и других заинтересованных сторон. Особенно приветствуется участие представителей различных секторов «за пределами водной тематики».',
    inPersonTitle: 'Очный формат',
    inPersonText: '4-я Душанбинская конференция по Десятилетию водных действий пройдёт в очном формате для обеспечения максимального уровня взаимодействия между участниками.'
  },
  tj: {
    may: 'Май',
    dushanbe: 'Душанбе',
    heroTitle: 'Конфронси чоруми байналмилалии сатҳи баланд',
    heroText: 'Конфронси чоруми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор», солҳои 2018–2028, аз 25 то 28 майи соли 2026 дар Душанбе дар доираи Раванди обии Душанбе баргузор мегардад.',
    waterProcessTitle: 'Раванди обии Душанбе',
    waterProcessText: 'Раванди обии Душанбе ташаббуси Ҳукумати Ҷумҳурии Тоҷикистон мебошад, ки ба дастгирии татбиқи ҳадафҳои Даҳсолаи байналмилалии амал «Об барои рушди устувор», солҳои 2018–2028, тавассути силсилаи конфронсҳое, ки ҳар ду сол аз ҷониби Ҳукумати Тоҷикистон бо ҳамкории зич бо Созмони Милали Муттаҳид баргузор мегарданд, равона шудааст. Конфронсҳо бо ҳамраисии Сарвазири Ҷумҳурии Тоҷикистон ва Муовини Котиби генералии СММ оид ба масъалаҳои иқтисодӣ ва иҷтимоӣ баргузор мешаванд.',
    coChaired: 'Ҳамраисӣ',
    govTajikistan: 'Ҳукумати Тоҷикистон',
    unitedNations: 'Созмони Милали Муттаҳид',
    timelineTitle: 'Таърихи конфронсҳо',
    timelineSubtitle: 'То ба имрӯз се Конфронси Душанбе оид ба Даҳсолаи амалиёти обӣ дар Душанбе бомуваффақият баргузор шудаанд:',
    conferences: [
      { number: '1-ум', year: '2018', title: 'Конфронси якуми байналмилалии сатҳи баланд', date: '20–22 июни 2018', subtitle: null },
      { number: '2-юм', year: '2022', title: 'Конфронси дуюми байналмилалии сатҳи баланд', date: '6–9 июни 2022', subtitle: '«Ташвиқи амалиётҳо ва шарикиҳо дар соҳаи об дар сатҳи маҳаллӣ, миллӣ, минтақавӣ ва ҷаҳонӣ»' },
      { number: '3-юм', year: '2024', title: 'Конфронси сеюми байналмилалии сатҳи баланд', date: '10–13 июни 2024', subtitle: null },
      { number: '4-ум', year: '2026', title: 'Конфронси чоруми байналмилалии сатҳи баланд', date: '25–28 майи 2026', subtitle: null }
    ],
    continuationText: 'Ташкил ва баргузории Конфронси чоруми Душанбе оид ба Даҳсолаи амалиёти обӣ аз 25 то 28 майи соли 2026 дар Душанбе анъанаи деринаи Тоҷикистонро дар пешниҳоди платформаи фарогир барои муколамаи сиёсӣ, мубодилаи назарҳо, бунёди шарикӣ ва пешбурди амалиёти ҷаҳонӣ идома хоҳад дод.',
    objectivesTitle: 'Мақсадҳо',
    mainObjectiveLabel: 'Мақсади асосӣ',
    mainObjective: 'Мақсади асосии Конфронси чоруми Душанбе оид ба Даҳсолаи амалиёти обӣ ин сафарбар кардани минбаъдаи кӯшишҳои дастаҷамъӣ ва дастгирии иҷрои ӯҳдадориҳои ихтиёрии дар Барномаи амалиёти обии Конфронси СММ оид ба об ба қайд гирифташуда, инчунин ташвиқи шарикиҳои нав ва суръат бахшидан ба амалиётҳо барои ноил шудан ба ҳадафҳои Барномаи рушди устувор то соли 2030 мебошад.',
    alsoAims: 'Конфронс инчунин ба мусоидат дар мубодилаи таҷрибаи беҳтарин ва роҳҳои навоварона, мустаҳкам кардани шарикӣ байни ҷонибҳои манфиатдор, баланд бардоштани нақши об дар рушди устувор, боло бардоштани огоҳӣ ва сафарбар кардани иродаи сиёсӣ барои суръат бахшидан ба пешрафт дар ноил шудан ба ҳадафҳои обии Барномаи рушди то соли 2030 нигаронида шудааст.',
    focusTitle: 'Конфронси чоруми Душанбе ба мақсадҳои зерин тамаркуз хоҳад кард:',
    objectives: [
      'Ҳамчун ҷаласаи асосии тайёрӣ барои Конфронси СММ оид ба об дар соли 2026, ки аз ҷониби Ҷумҳурии Сенегал ва Аморати Муттаҳидаи Арабӣ баргузор мегардад, хидмат кунад.',
      'Роҳҳои миқёспазирро намоиш диҳад, ҳамкориро мустаҳкам кунад ва шарикиҳо барои ҳалли масъалаҳо ва истифодаи имконоти афзалиятноки обӣ бунёд кунад.',
      'Татбиқи Даҳсолаи амалиёти обиро, бо такя ба чор самти кории Нақшаи амалиёти Котиби генералии СММ оид ба Даҳсолаи амалиёти обӣ 2018–2028, мустаҳкам кунад.',
      'Машваратҳои ғайрирасмӣ бо ҷонибҳои манфиатдор оид ба Конфронси СММ оид ба об дар соли 2028, ки ҳамчун баррасии ниҳоии ҳамаҷонибаи Даҳсолаи амалиёти обӣ 2018–2028 ва муҳокимаи ибтидоии роҳи пеш, аз ҷумла пас аз соли 2030, хидмат хоҳад кард, гузаронад.'
    ],
    datesTitle: 'Санаҳо ва макони баргузорӣ',
    schedule: [
      { date: '25 майи 2026', title: 'Форумҳо ва чорабиниҳои ҷонибӣ', description: 'Форумҳо ва чорабиниҳои ҷонибӣ дар арафаи ифтитоҳи расмии конфронс баргузор мегарданд. Макони баргузории ин чорабиниҳо аз ҷониби ташкилкунандагон муайян карда мешавад.' },
      { date: '26–27 майи 2026', title: 'Конфронси расмии сатҳи баланд', description: 'Конфронси расмии сатҳи баланд дар маҷмааи Кохи Сомон дар Душанбе, Ҷумҳурии Тоҷикистон баргузор мегардад.' },
      { date: '28 майи 2026', title: 'Боздидҳои саҳроӣ ва сафарҳои омӯзишӣ', description: 'Барои иштирокчиёни байналмилалӣ боздидҳои саҳроӣ ва сафарҳои омӯзишӣ барои шинос шудан бо кишвари мизбон ва омӯхтани таҷрибаи Тоҷикистон дар идоракунии захираҳои обӣ ташкил карда мешаванд.' }
    ],
    formatTitle: 'Формат ва иштирок',
    multiStakeholderTitle: 'Табиати бисёрҷонибадор',
    multiStakeholderText: 'Конфронс хусусияти бисёрҷонибадор дошта, гурӯҳҳо ва иштирокчиёни гуногуни дар татбиқи ҳадафҳо ва вазифаҳои обӣ фаъолро муттаҳид мекунад.',
    participantsTitle: 'Иштирокчиёни сатҳи баланд',
    participantsText: 'Конфронс намояндагони сатҳи баланди давлатҳои аъзои СММ, муассисаҳои СММ, созмонҳои байналмилалӣ ва минтақавӣ, муассисаҳои молиявии байналмилалӣ, бахши хусусӣ, ҷомеаи шаҳрвандӣ, занон, ҷавонон, халқҳои таҳҷоӣ, ҷамоатҳои маҳаллӣ, мақомоти маҳаллии ҳокимият, муассисаҳои академӣ, ҷомеаи илмӣ ва дигар ҷонибҳои манфиатдорро ҷамъ мекунад.',
    inPersonTitle: 'Чорабинии рӯ ба рӯ',
    inPersonText: 'Конфронси 4-уми Душанбе оид ба Даҳсолаи амалиёти обӣ ҳамчун чорабинии рӯ ба рӯ барои таъмини сатҳи баландтарини ҳамкории байни иштирокчиён баргузор мегардад.'
  }
}
