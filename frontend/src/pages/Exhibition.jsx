import LocalizedLink from '../components/LocalizedLink'
import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import { ArrowRight, Droplets, Globe, Flag, FlaskConical, Target, Leaf, Users, Building2, Calendar, Mail, MapPin } from 'lucide-react'
import '../styles/exhibition-infographic.css'

export const exhibitionImages = [
  '/assets/images/exhibition/water-tech.jpg',
  '/assets/images/exhibition/international-orgs.jpg',
  '/assets/images/exhibition/national-pavilions.jpg',
  '/assets/images/exhibition/research.jpg',
  '/assets/images/exhibition/sustainable-dev.jpg',
  '/assets/images/exhibition/green-energy.jpg'
]

const G = '/assets/images/exhibition/gallery'

export const exhibitionGallery = [
  [`${G}/exhibit-1.jpg`, `${G}/exhibit-2.jpg`, `${G}/exhibit-3.jpg`, `${G}/exhibit-4.jpg`],
  [`${G}/exhibit-5.jpg`, `${G}/exhibit-6.jpg`, `${G}/exhibit-7.jpg`, `${G}/exhibit-8.jpg`],
  [`${G}/exhibit-9.jpg`, `${G}/exhibit-10.jpg`, `${G}/exhibit-11.jpg`, `${G}/exhibit-12.jpg`],
  [`${G}/exhibit-1.jpg`, `${G}/exhibit-4.jpg`, `${G}/exhibit-7.jpg`, `${G}/exhibit-10.jpg`],
  [`${G}/exhibit-2.jpg`, `${G}/exhibit-5.jpg`, `${G}/exhibit-8.jpg`, `${G}/exhibit-11.jpg`],
  [`${G}/exhibit-3.jpg`, `${G}/exhibit-6.jpg`, `${G}/exhibit-9.jpg`, `${G}/exhibit-12.jpg`]
]

const zoneIcons = [
  <Droplets size={20} key="z0" />,
  <Globe size={20} key="z1" />,
  <Flag size={20} key="z2" />,
  <FlaskConical size={20} key="z3" />,
  <Target size={20} key="z4" />,
  <Leaf size={20} key="z5" />
]

const zoneVariants = ['water', 'international', 'national', 'research', 'sustainable', 'green']

const closingStatIcons = [
  <Building2 size={22} key="s0" />,
  <Users size={22} key="s1" />,
  <Calendar size={22} key="s2" />
]

export default function Exhibition() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('exhibition', {
    title: { ru: 'Выставка', en: 'Exhibition', tj: 'Намоишгоҳ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'exhibition_main')

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

      {/* Exhibition Zones Card Grid */}
      <section className="exh-zones">
        <div className="container">
          <div className="exh-zones__grid">
            {t.zones.map((zone, i) => (
              <LocalizedLink
                to={`/exhibition/${i}`}
                className="exh-zone-card-link"
                key={i}
              >
                <div className={`exh-zone-card exh-zone-card--${zoneVariants[i]}`}>
                  <div className="exh-zone-card__img-wrap">
                    <img src={exhibitionImages[i]} alt={zone.name} loading="lazy" />
                  </div>
                  <div className="exh-zone-card__accent" />
                  <div className="exh-zone-card__body">
                    <h3 className="exh-zone-card__name">{zone.name}</h3>
                    <p className="exh-zone-card__desc">{zone.shortDesc}</p>
                    <div className="exh-zone-card__meta">
                      <span className="exh-zone-card__tag">
                        <Calendar size={13} />
                        {zone.dates}
                      </span>
                      <span className="exh-zone-card__tag">
                        <MapPin size={13} />
                        {zone.location}
                      </span>
                      <span className="exh-zone-card__tag">
                        <Users size={13} />
                        {zone.exhibitorCount}
                      </span>
                    </div>
                    <span className="exh-zone-card__link">
                      {t.viewDetails} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="exh-registration">
        <div className="exh-registration__pattern"></div>
        <div className="container">
          <div className="exh-reg-card">
            <div className="exh-reg-card__top">
              <h2 className="exh-reg-card__heading">{t.regTitle}</h2>
            </div>
            <div className="exh-reg-card__body">
              <div className="exh-reg-steps">
                {t.regSteps.map((step, i) => (
                  <div className="exh-reg-step" key={i}>
                    <div className="exh-reg-step__num">{i + 1}</div>
                    <p className="exh-reg-step__text">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section - Exhibition Highlights */}
      <section className="exh-closing">
        <div className="exh-closing__pattern"></div>
        <div className="container">
          <div className="exh-closing__header">
            <h2 className="exh-closing__title">{t.closingTitle}</h2>
            <p className="exh-closing__text">{t.closingText}</p>
          </div>
          <div className="exh-closing__stats">
            {t.closingStats.map((stat, i) => (
              <div className={`exh-closing__stat exh-closing__stat--${['zones', 'exhibitors', 'days'][i]}`} key={i}>
                <div className="exh-closing__stat-icon">{closingStatIcons[i]}</div>
                <div className="exh-closing__stat-value">{stat.value}</div>
                <div className="exh-closing__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="exh-closing__cta">
            <LocalizedLink to="/registration" className="exh-closing__btn">
              <Mail size={18} />
              {t.closingBtn}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </>
  )
}

export const translations = {
  en: {
    zonesTitle: 'Exhibition Zones',
    zonesSubtitle: 'Explore the diverse exhibition areas showcasing innovations and achievements in water resources management.',
    viewDetails: 'View Details',
    zones: [
      {
        name: 'Water Technology & Infrastructure',
        shortDesc: 'Cutting-edge water treatment, purification, and distribution technologies from leading companies worldwide.',
        dates: 'May 25–27',
        location: 'Hall A',
        exhibitorCount: '20+ exhibitors',
        fullDesc: 'This zone showcases the latest innovations in water treatment, purification, desalination, and distribution technologies. Leading companies from around the world present their solutions for efficient water management, smart metering systems, and advanced infrastructure for water supply and sanitation.',
        highlights: ['Smart water meters', 'Desalination systems', 'Water recycling technology', 'Pipeline innovation'],
        exhibitors: 'Technology companies, engineering firms, equipment manufacturers'
      },
      {
        name: 'International Organizations',
        shortDesc: 'Pavilions of UN agencies, World Bank, and other international bodies leading global water initiatives.',
        dates: 'May 25–27',
        location: 'Hall B',
        exhibitorCount: '15+ exhibitors',
        fullDesc: 'Major international organizations present their programs, initiatives, and achievements in the field of global water resources management. This zone features exhibits from UN agencies, multilateral development banks, and international NGOs working on water security and sustainable development.',
        highlights: ['UN-Water initiatives', 'World Bank programs', 'UNDP water projects', 'UNESCO water heritage'],
        exhibitors: 'UN agencies, multilateral development banks, international NGOs'
      },
      {
        name: 'National Pavilions',
        shortDesc: 'Country exhibits showcasing national water management achievements and cross-border cooperation.',
        dates: 'May 25–27',
        location: 'Hall C',
        exhibitorCount: '25+ exhibitors',
        fullDesc: 'Countries from around the world present their national water management strategies, achievements, and best practices. This zone highlights cross-border water cooperation, indigenous water practices, and innovative policy frameworks adopted by different nations.',
        highlights: ['National water strategies', 'Cross-border cooperation', 'Indigenous water practices', 'Policy frameworks'],
        exhibitors: 'Government delegations, national water authorities, ministries'
      },
      {
        name: 'Research & Innovation',
        shortDesc: 'Academic research, scientific discoveries, and innovative solutions for water challenges.',
        dates: 'May 25–27',
        location: 'Hall D',
        exhibitorCount: '18+ exhibitors',
        fullDesc: 'Leading research institutions and universities present their latest findings in water science, hydrology, glacier monitoring, and climate adaptation. This zone bridges the gap between scientific research and practical applications in water resources management.',
        highlights: ['Glacier monitoring', 'Water quality analysis', 'Climate adaptation research', 'Hydrological modeling'],
        exhibitors: 'Universities, research institutes, scientific organizations'
      },
      {
        name: 'Sustainable Development',
        shortDesc: 'Projects advancing SDG 6 and integrated water resources management worldwide.',
        dates: 'May 25–27',
        location: 'Hall E',
        exhibitorCount: '12+ exhibitors',
        fullDesc: 'This zone features projects and programs that advance Sustainable Development Goal 6 (Clean Water and Sanitation) and promote integrated water resources management. Exhibitors showcase community-based water projects, water-food-energy nexus solutions, and IWRM best practices.',
        highlights: ['SDG 6 progress', 'IWRM best practices', 'Community water projects', 'Water-food-energy nexus'],
        exhibitors: 'NGOs, development agencies, community organizations'
      },
      {
        name: 'Green & Clean Energy',
        shortDesc: 'Hydropower, renewable energy solutions, and environmental technologies for a sustainable future.',
        dates: 'May 25–27',
        location: 'Hall F',
        exhibitorCount: '10+ exhibitors',
        fullDesc: 'Focused on the intersection of water and energy, this zone showcases hydropower innovations, solar-powered water systems, green infrastructure solutions, and environmental monitoring technologies. Exhibitors demonstrate how clean energy can transform water management.',
        highlights: ['Small hydropower', 'Solar water pumps', 'Green infrastructure', 'Environmental monitoring'],
        exhibitors: 'Energy companies, environmental technology firms, green investors'
      }
    ],
    regTitle: 'How to Participate',
    regSteps: [
      'Complete the exhibition registration form provided by the Conference Secretariat.',
      'Submit the completed form to the Conference Secretariat by April 2026.',
      'The Secretariat will notify applicants of the acceptance of their request within five days following the submission of the application.'
    ],
    closingTitle: 'Join the Exhibition',
    closingText: 'Showcase your innovations and achievements in water resources management at the International Exhibition alongside leading organizations from around the world.',
    closingStats: [
      { value: '6', label: 'Exhibition Zones' },
      { value: '100+', label: 'Expected Exhibitors' },
      { value: '3', label: 'Days of Exhibition' }
    ],
    closingBtn: 'Register to Exhibit'
  },
  ru: {
    zonesTitle: 'Зоны выставки',
    zonesSubtitle: 'Изучите разнообразные выставочные зоны, демонстрирующие инновации и достижения в области управления водными ресурсами.',
    viewDetails: 'Подробнее',
    zones: [
      {
        name: 'Водные технологии и инфраструктура',
        shortDesc: 'Передовые технологии водоочистки, опреснения и распределения воды от ведущих мировых компаний.',
        dates: '25–27 мая',
        location: 'Зал A',
        exhibitorCount: '20+ экспонентов',
        fullDesc: 'Эта зона демонстрирует новейшие инновации в области водоочистки, опреснения и распределения воды. Ведущие компании со всего мира представляют свои решения для эффективного управления водными ресурсами, интеллектуальных систем учёта и передовой инфраструктуры водоснабжения и канализации.',
        highlights: ['Умные счётчики воды', 'Системы опреснения', 'Технологии рециклинга воды', 'Инновации в трубопроводах'],
        exhibitors: 'Технологические компании, инженерные фирмы, производители оборудования'
      },
      {
        name: 'Международные организации',
        shortDesc: 'Павильоны агентств ООН, Всемирного банка и других международных организаций.',
        dates: '25–27 мая',
        location: 'Зал B',
        exhibitorCount: '15+ экспонентов',
        fullDesc: 'Крупнейшие международные организации представляют свои программы, инициативы и достижения в области глобального управления водными ресурсами. Здесь представлены экспонаты агентств ООН, многосторонних банков развития и международных НПО.',
        highlights: ['Инициативы UN-Water', 'Программы Всемирного банка', 'Проекты ПРООН', 'Водное наследие ЮНЕСКО'],
        exhibitors: 'Агентства ООН, многосторонние банки развития, международные НПО'
      },
      {
        name: 'Национальные павильоны',
        shortDesc: 'Страновые выставки, демонстрирующие национальные достижения в управлении водными ресурсами.',
        dates: '25–27 мая',
        location: 'Зал C',
        exhibitorCount: '25+ экспонентов',
        fullDesc: 'Страны со всего мира представляют свои национальные стратегии управления водными ресурсами, достижения и лучшие практики. Эта зона освещает трансграничное водное сотрудничество и инновационные политические рамки.',
        highlights: ['Национальные водные стратегии', 'Трансграничное сотрудничество', 'Местные водные практики', 'Политические рамки'],
        exhibitors: 'Правительственные делегации, национальные водные ведомства, министерства'
      },
      {
        name: 'Исследования и инновации',
        shortDesc: 'Научные исследования, открытия и инновационные решения водных проблем.',
        dates: '25–27 мая',
        location: 'Зал D',
        exhibitorCount: '18+ экспонентов',
        fullDesc: 'Ведущие исследовательские институты и университеты представляют свои последние достижения в области водной науки, гидрологии, мониторинга ледников и адаптации к изменению климата.',
        highlights: ['Мониторинг ледников', 'Анализ качества воды', 'Исследования адаптации к климату', 'Гидрологическое моделирование'],
        exhibitors: 'Университеты, научно-исследовательские институты, научные организации'
      },
      {
        name: 'Устойчивое развитие',
        shortDesc: 'Проекты, продвигающие ЦУР 6 и интегрированное управление водными ресурсами.',
        dates: '25–27 мая',
        location: 'Зал E',
        exhibitorCount: '12+ экспонентов',
        fullDesc: 'Эта зона представляет проекты и программы, продвигающие Цель устойчивого развития 6 (Чистая вода и санитария) и содействующие комплексному управлению водными ресурсами.',
        highlights: ['Прогресс ЦУР 6', 'Лучшие практики ИУВР', 'Общественные водные проекты', 'Связь вода-еда-энергия'],
        exhibitors: 'НПО, агентства развития, общественные организации'
      },
      {
        name: 'Зелёная и чистая энергия',
        shortDesc: 'Гидроэнергетика, возобновляемые источники энергии и экологические технологии.',
        dates: '25–27 мая',
        location: 'Зал F',
        exhibitorCount: '10+ экспонентов',
        fullDesc: 'Зона, посвящённая взаимосвязи воды и энергии, демонстрирует инновации в гидроэнергетике, системы на солнечной энергии, решения зелёной инфраструктуры и технологии экологического мониторинга.',
        highlights: ['Малая гидроэнергетика', 'Солнечные водяные насосы', 'Зелёная инфраструктура', 'Экологический мониторинг'],
        exhibitors: 'Энергетические компании, экотехнологические фирмы, зелёные инвесторы'
      }
    ],
    regTitle: 'Как принять участие',
    regSteps: [
      'Заполните регистрационную форму выставки, предоставленную Секретариатом конференции.',
      'Направьте заполненную форму в Секретариат конференции до апреля 2026 года.',
      'Секретариат уведомит заявителей о принятии их заявки в течение пяти дней после подачи заявления.'
    ],
    closingTitle: 'Присоединяйтесь к выставке',
    closingText: 'Продемонстрируйте свои инновации и достижения в области управления водными ресурсами на Международной выставке наряду с ведущими организациями со всего мира.',
    closingStats: [
      { value: '6', label: 'Зон выставки' },
      { value: '100+', label: 'Ожидаемых экспонентов' },
      { value: '3', label: 'Дня выставки' }
    ],
    closingBtn: 'Зарегистрироваться'
  },
  tj: {
    zonesTitle: 'Минтақаҳои намоишгоҳ',
    zonesSubtitle: 'Минтақаҳои гуногуни намоишгоҳро кашф кунед, ки навовариҳо ва дастовардҳоро дар соҳаи идоракунии захираҳои обӣ намоиш медиҳанд.',
    viewDetails: 'Муфассал',
    zones: [
      {
        name: 'Технологияҳои обӣ ва инфрасохтор',
        shortDesc: 'Технологияҳои пешрафтаи тозакунии об, ширинкунӣ ва тақсимот аз ширкатҳои пешбари ҷаҳон.',
        dates: '25–27 май',
        location: 'Толори A',
        exhibitorCount: '20+ иштирокчӣ',
        fullDesc: 'Ин минтақа навовариҳои навтаринро дар соҳаи тозакунии об, ширинкунӣ ва тақсимот намоиш медиҳад. Ширкатҳои пешбар аз саросари ҷаҳон ҳалли худро барои идоракунии самараноки обӣ пешниҳод мекунанд.',
        highlights: ['Ҳисобкунакҳои ақлонии об', 'Системаҳои ширинкунӣ', 'Технологияи бозгардонии об', 'Навоварии қубурҳо'],
        exhibitors: 'Ширкатҳои технологӣ, фирмаҳои муҳандисӣ, истеҳсолкунандагон'
      },
      {
        name: 'Созмонҳои байналмилалӣ',
        shortDesc: 'Павильонҳои агентиҳои СММ, Бонки Ҷаҳонӣ ва дигар ниҳодҳои байналмилалӣ.',
        dates: '25–27 май',
        location: 'Толори B',
        exhibitorCount: '15+ иштирокчӣ',
        fullDesc: 'Созмонҳои бузурги байналмилалӣ барномаҳо, ташаббусҳо ва дастовардҳои худро дар соҳаи идоракунии ҷаҳонии захираҳои обӣ пешниҳод мекунанд.',
        highlights: ['Ташаббусҳои UN-Water', 'Барномаҳои Бонки Ҷаҳонӣ', 'Лоиҳаҳои БАРС', 'Мероси обии ЮНЕСКО'],
        exhibitors: 'Агентиҳои СММ, бонкҳои рушд, СБО-ҳои байналмилалӣ'
      },
      {
        name: 'Павильонҳои миллӣ',
        shortDesc: 'Намоишгоҳҳои кишварҳо, ки дастовардҳои миллӣ дар идоракунии обро намоиш медиҳанд.',
        dates: '25–27 май',
        location: 'Толори C',
        exhibitorCount: '25+ иштирокчӣ',
        fullDesc: 'Кишварҳо аз саросари ҷаҳон стратегияҳо, дастовардҳо ва таҷрибаҳои беҳтарини миллии идоракунии обро пешниҳод мекунанд.',
        highlights: ['Стратегияҳои миллии обӣ', 'Ҳамкории байнисарҳадӣ', 'Таҷрибаҳои маҳаллии обӣ', 'Чаҳорчӯбаҳои сиёсӣ'],
        exhibitors: 'Ҳайатҳои ҳукуматӣ, мақомоти миллии обӣ, вазоратҳо'
      },
      {
        name: 'Тадқиқот ва навоварӣ',
        shortDesc: 'Тадқиқотҳои илмӣ, кашфиётҳо ва ҳалли навоваронаи мушкилоти обӣ.',
        dates: '25–27 май',
        location: 'Толори D',
        exhibitorCount: '18+ иштирокчӣ',
        fullDesc: 'Муассисаҳои тадқиқотӣ ва донишгоҳҳои пешбар дастовардҳои навтарини худро дар соҳаи илми обӣ, гидрология ва мониторинги пиряхҳо пешниҳод мекунанд.',
        highlights: ['Мониторинги пиряхҳо', 'Таҳлили сифати об', 'Тадқиқоти мутобиқшавӣ', 'Моделсозии гидрологӣ'],
        exhibitors: 'Донишгоҳҳо, муассисаҳои тадқиқотӣ, созмонҳои илмӣ'
      },
      {
        name: 'Рушди устувор',
        shortDesc: 'Лоиҳаҳое, ки ҲРУ 6 ва идоракунии ягонаи захираҳои обиро пеш мебаранд.',
        dates: '25–27 май',
        location: 'Толори E',
        exhibitorCount: '12+ иштирокчӣ',
        fullDesc: 'Ин минтақа лоиҳаҳо ва барномаҳоеро намоиш медиҳад, ки Ҳадафи рушди устувори 6-ро пеш мебаранд ва идоракунии комплексии захираҳои обиро мусоидат мекунанд.',
        highlights: ['Пешрафти ҲРУ 6', 'Таҷрибаҳои беҳтарин', 'Лоиҳаҳои обии ҷамоатӣ', 'Робитаи об-ғизо-энергия'],
        exhibitors: 'СБО-ҳо, агентиҳои рушд, созмонҳои ҷамоатӣ'
      },
      {
        name: 'Энергияи сабз ва тоза',
        shortDesc: 'Гидроэнергетика, энергияи барқароршаванда ва технологияҳои экологӣ.',
        dates: '25–27 май',
        location: 'Толори F',
        exhibitorCount: '10+ иштирокчӣ',
        fullDesc: 'Минтақа навовариҳои гидроэнергетикӣ, системаҳои бо энергияи офтобӣ, ҳалли инфрасохтори сабз ва технологияҳои мониторинги экологиро намоиш медиҳад.',
        highlights: ['Гидроэнергетикаи хурд', 'Насосҳои офтобии обӣ', 'Инфрасохтори сабз', 'Мониторинги экологӣ'],
        exhibitors: 'Ширкатҳои энергетикӣ, фирмаҳои экотехнологӣ, сармоягузорон'
      }
    ],
    regTitle: 'Чӣ тавр иштирок кардан мумкин аст',
    regSteps: [
      'Варақаи бақайдгирии намоишгоҳро, ки аз ҷониби Котиботи конференсия пешниҳод шудааст, пур кунед.',
      'Варақаи пуркардашударо то апрели 2026 ба Котиботи конференсия ирсол кунед.',
      'Котибот дар муддати панҷ рӯз пас аз пешниҳоди ариза дар бораи қабули дархости онҳо ба аризадиҳандагон хабар медиҳад.'
    ],
    closingTitle: 'Ба намоишгоҳ ҳамроҳ шавед',
    closingText: 'Навовариҳо ва дастовардҳои худро дар соҳаи идоракунии захираҳои обӣ дар Намоишгоҳи байналмилалӣ дар баробари созмонҳои пешбари ҷаҳон намоиш диҳед.',
    closingStats: [
      { value: '6', label: 'Минтақаи намоишгоҳ' },
      { value: '100+', label: 'Иштирокчиёни интизоршаванда' },
      { value: '3', label: 'Рӯзи намоишгоҳ' }
    ],
    closingBtn: 'Бақайдгирӣ'
  }
}
