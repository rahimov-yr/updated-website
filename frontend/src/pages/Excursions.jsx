import LocalizedLink from '../components/LocalizedLink'
import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import { Clock, MapPin, ArrowRight, Mountain, Compass, Sparkles } from 'lucide-react'
import '../styles/excursions-infographic.css'

export const excursionImages = [
  '/assets/images/excursions/rogun.jpg',
  '/assets/images/excursions/dushanbe.jpg',
  '/assets/images/excursions/khisor.jpg'
]

export const excursionSlugs = ['rogun', 'dushanbe', 'khisor']

const G = '/assets/images/excursions/gallery'

export const excursionGallery = [
  [`${G}/rogun-1.jpg`, `${G}/rogun-2.jpg`, `${G}/rogun-3.jpg`, `${G}/rogun-4.jpg`],
  [`${G}/dushanbe-1.jpg`, `${G}/dushanbe-2.jpg`, `${G}/dushanbe-3.jpg`, `${G}/dushanbe-4.jpg`],
  [`${G}/khisor-1.jpg`, `${G}/khisor-2.jpg`, `${G}/khisor-3.jpg`, `${G}/khisor-4.jpg`]
]

export default function Excursions() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('excursions', {
    title: { ru: 'Экскурсии', en: 'Excursions', tj: 'Экскурсияҳо' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'excursions_main')

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

      {/* Destinations Card Grid */}
      <section className="exc-destinations">
        <div className="container">
          <div className="exc-destinations__grid">
            {t.destinations.map((dest, i) => (
              <LocalizedLink
                to={dest.route}
                className="exc-dest-card-link"
                key={i}
              >
                <div className="exc-dest-card">
                  <div className="exc-dest-card__img-wrap">
                    <img src={excursionImages[i]} alt={dest.name} loading="lazy" />
                  </div>
                  <div className="exc-dest-card__accent" />
                  <div className="exc-dest-card__body">
                    <h3 className="exc-dest-card__name">{dest.name}</h3>
                    <p className="exc-dest-card__desc">{dest.shortDesc}</p>
                    <div className="exc-dest-card__meta">
                      <span className="exc-dest-card__tag">
                        <Clock size={13} />
                        {dest.duration}
                      </span>
                      <span className="exc-dest-card__tag">
                        <MapPin size={13} />
                        {dest.distance}
                      </span>
                    </div>
                    <span className="exc-dest-card__link">
                      {t.viewDetails} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {/* Excursion Day Band */}
      <section className="exc-day">
        <div className="exc-day__band">
          <div className="exc-day__band-pattern"></div>
          <div className="container">
            <div className="exc-day__date-block">
              <p className="exc-day__date-num">28</p>
              <p className="exc-day__date-month">{t.dayMonth}</p>
            </div>
            <div className="exc-day__content">
              <h2 className="exc-day__title">{t.dayTitle}</h2>
              <p className="exc-day__text">{t.dayText}</p>
              <span className="exc-day__tag">{t.dayTag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section - Tajikistan Highlights */}
      <section className="exc-closing">
        <div className="exc-closing__pattern"></div>
        <div className="container">
          <div className="exc-closing__header">
            <h2 className="exc-closing__title">{t.closingTitle}</h2>
            <p className="exc-closing__text">{t.closingText}</p>
          </div>
          <div className="exc-closing__features">
            {t.closingFeatures.map((feat, i) => (
              <div className={`exc-closing__feature exc-closing__feature--${['nature', 'culture', 'free'][i]}`} key={i}>
                <div className="exc-closing__feature-icon">{closingFeatureIcons[i]}</div>
                <h4 className="exc-closing__feature-title">{feat.title}</h4>
                <p className="exc-closing__feature-text">{feat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const closingFeatureIcons = [
  <Mountain size={22} key="f0" />,
  <Compass size={22} key="f1" />,
  <Sparkles size={22} key="f2" />
]

export const translations = {
  en: {
    sectionTitle: 'Excursion Destinations',
    sectionSubtitle: 'Explore these magnificent destinations during the free excursion day organized by the Government of Tajikistan.',
    viewDetails: 'View Details',
    destinations: [
      {
        name: 'Rogun Dam',
        shortDesc: 'Visit the world\'s tallest dam under construction — a symbol of Tajikistan\'s hydropower ambitions and engineering achievement.',
        fullDesc: 'The Rogun Dam is a hydroelectric dam under construction on the Vakhsh River in southern Tajikistan. Upon completion, it will be the tallest dam in the world at 335 meters. The project represents Tajikistan\'s ambition to become a major energy exporter in Central Asia and is a symbol of national pride and engineering achievement. Participants will travel through scenic mountain landscapes along the Vakhsh River valley, witnessing one of the most ambitious infrastructure projects in modern Central Asia.',
        duration: '08:00–18:00',
        distance: '110 km from Dushanbe',
        route: '/excursions/rogun',
        highlights: ['World\'s tallest dam (335m)', 'Scenic Vakhsh River valley', 'Hydropower engineering tour', 'Mountain landscape drive'],
        info: 'Full-day excursion with lunch provided. Comfortable bus transportation from the conference venue. Professional guides in multiple languages.'
      },
      {
        name: 'Dushanbe City Tour',
        shortDesc: 'Explore the vibrant capital with its museums, monuments, parks, traditional bazaars, and rich cultural heritage.',
        fullDesc: 'Discover Dushanbe, the vibrant capital of Tajikistan, on a guided tour of the city\'s most iconic landmarks. Visit the National Museum of Tajikistan with its rich collection of archaeological artifacts, explore Rudaki Park and the stunning Palace of Nations, browse the colorful Mehrgon Bazaar, and admire the world\'s tallest flagpole. The tour offers a comprehensive introduction to Tajik culture, history, and modern development.',
        duration: '09:00–13:00',
        distance: 'City Center',
        route: '/excursions/dushanbe',
        highlights: ['National Museum of Tajikistan', 'Rudaki Park & Palace of Nations', 'Mehrgon Bazaar', 'Historical monuments & architecture'],
        info: 'Half-day walking and bus tour. Comfortable transportation between sites. Professional multilingual guides provided.'
      },
      {
        name: 'Hisor Fortress',
        shortDesc: 'Discover the ancient fortress dating back over 3,000 years — a gateway to Central Asian history and architecture.',
        fullDesc: 'Hisor Fortress is one of the most significant historical monuments in Tajikistan, with a history spanning over 3,000 years. Located just 30 km west of Dushanbe, this ancient fortification served as a gateway along the Silk Road. The complex includes the fortress gates, two medieval madrasas (Islamic schools), a caravanserai, and a mausoleum. Surrounded by beautiful gardens, Hisor offers a fascinating glimpse into Central Asian history, architecture, and the region\'s role in ancient trade routes.',
        duration: '09:00–14:00',
        distance: '30 km from Dushanbe',
        route: '/excursions/khisor',
        highlights: ['3,000+ year old fortress', 'Silk Road heritage site', 'Medieval madrasas & caravanserai', 'Archaeological museum'],
        info: 'Half-day excursion with refreshments. Bus transportation from the conference venue. Expert historical guides available.'
      }
    ],
    dayMonth: 'May 2026',
    dayTitle: 'Free Excursion Day',
    dayText: 'On the fourth day of the Conference, the Government of the Republic of Tajikistan will organize free excursions, offering participants a unique opportunity to explore the rich history, culture, and natural beauty of Tajikistan.',
    dayTag: 'Organized by the Government',
    closingTitle: 'Experience Tajikistan',
    closingText: 'By participating in the Conference in Dushanbe, the capital of Tajikistan, you will have the opportunity to personally experience the country\'s many attractions and discover the beauty of this ancient land.',
    closingFeatures: [
      { title: 'Breathtaking Nature', text: '93% mountains, 10,000+ glaciers, and pristine alpine lakes await you in one of Central Asia\'s most scenic countries.' },
      { title: 'Rich Cultural Heritage', text: 'Over 3,000 years of history, ancient fortresses, Buddhist monasteries, and world-renowned traditional crafts.' },
      { title: 'Complimentary Excursions', text: 'All excursions on May 28 are fully organized and funded by the Government of Tajikistan for conference participants.' }
    ]
  },
  ru: {
    sectionTitle: 'Направления экскурсий',
    sectionSubtitle: 'Исследуйте эти великолепные направления во время бесплатного экскурсионного дня, организованного Правительством Таджикистана.',
    viewDetails: 'Подробнее',
    destinations: [
      {
        name: 'Рогунская ГЭС',
        shortDesc: 'Посетите самую высокую строящуюся плотину в мире — символ гидроэнергетических амбиций и инженерных достижений Таджикистана.',
        fullDesc: 'Рогунская ГЭС — строящаяся гидроэлектростанция на реке Вахш на юге Таджикистана. По завершении строительства её плотина высотой 335 метров станет самой высокой в мире. Проект олицетворяет стремление Таджикистана стать крупным экспортёром энергии в Центральной Азии и является символом национальной гордости и инженерных достижений. Участники проедут через живописные горные ландшафты вдоль долины реки Вахш, увидев один из самых масштабных инфраструктурных проектов современной Центральной Азии.',
        duration: '08:00–18:00',
        distance: '110 км от Душанбе',
        route: '/excursions/rogun',
        highlights: ['Самая высокая плотина в мире (335 м)', 'Живописная долина реки Вахш', 'Экскурсия по гидроэнергетике', 'Горные пейзажи'],
        info: 'Экскурсия на полный день с обедом. Комфортабельный автобус от места проведения конференции. Профессиональные гиды на нескольких языках.'
      },
      {
        name: 'Экскурсия по Душанбе',
        shortDesc: 'Откройте для себя яркую столицу с её музеями, памятниками, парками, традиционными базарами и богатым культурным наследием.',
        fullDesc: 'Откройте для себя Душанбе, яркую столицу Таджикистана, во время экскурсии по самым знаковым достопримечательностям города. Посетите Национальный музей Таджикистана с богатой коллекцией археологических находок, прогуляйтесь по парку Рудаки и полюбуйтесь Дворцом наций, загляните на колоритный базар Мехргон и увидьте самый высокий флагшток в мире. Экскурсия предлагает полное знакомство с таджикской культурой, историей и современным развитием.',
        duration: '09:00–13:00',
        distance: 'Центр города',
        route: '/excursions/dushanbe',
        highlights: ['Национальный музей Таджикистана', 'Парк Рудаки и Дворец наций', 'Базар Мехргон', 'Исторические памятники и архитектура'],
        info: 'Пешеходная и автобусная экскурсия на полдня. Комфортабельный транспорт между объектами. Профессиональные гиды на нескольких языках.'
      },
      {
        name: 'Гиссарская крепость',
        shortDesc: 'Откройте древнюю крепость возрастом более 3 000 лет — ворота в историю и архитектуру Центральной Азии.',
        fullDesc: 'Гиссарская крепость — один из самых значимых исторических памятников Таджикистана, с историей более 3 000 лет. Расположенная всего в 30 км к западу от Душанбе, эта древняя крепость служила воротами на Великом шёлковом пути. Комплекс включает крепостные ворота, два средневековых медресе, каравансарай и мавзолей. Окружённая прекрасными садами, Гиссарская крепость предлагает увлекательное путешествие в историю Центральной Азии, архитектуру и роль региона в древних торговых маршрутах.',
        duration: '09:00–14:00',
        distance: '30 км от Душанбе',
        route: '/excursions/khisor',
        highlights: ['Крепость возрастом 3 000+ лет', 'Наследие Великого шёлкового пути', 'Средневековые медресе и каравансарай', 'Археологический музей'],
        info: 'Экскурсия на полдня с прохладительными напитками. Автобус от места проведения конференции. Экспертные исторические гиды.'
      }
    ],
    dayMonth: 'Май 2026',
    dayTitle: 'День бесплатных экскурсий',
    dayText: 'На четвёртый день конференции Правительство Республики Таджикистан организует бесплатные экскурсии, предоставляя участникам уникальную возможность познакомиться с богатой историей, культурой и природной красотой Таджикистана.',
    dayTag: 'Организовано Правительством',
    closingTitle: 'Познакомьтесь с Таджикистаном',
    closingText: 'Участвуя в конференции в Душанбе, столице Таджикистана, вы получите возможность лично познакомиться с многочисленными достопримечательностями страны и открыть для себя красоту этой древней земли.',
    closingFeatures: [
      { title: 'Захватывающая природа', text: '93% гор, 10 000+ ледников и первозданные высокогорные озёра ждут вас в одной из самых живописных стран Центральной Азии.' },
      { title: 'Богатое наследие', text: 'Более 3 000 лет истории, древние крепости, буддийские монастыри и всемирно известные традиционные ремёсла.' },
      { title: 'Бесплатные экскурсии', text: 'Все экскурсии 28 мая полностью организованы и финансируются Правительством Таджикистана для участников конференции.' }
    ]
  },
  tj: {
    sectionTitle: 'Самтҳои экскурсияҳо',
    sectionSubtitle: 'Ин ҷойҳои шоёнро дар рӯзи экскурсияи ройгон, ки аз ҷониби Ҳукумати Тоҷикистон ташкил карда мешавад, кашф кунед.',
    viewDetails: 'Муфассал',
    destinations: [
      {
        name: 'Нерӯгоҳи обии Роғун',
        shortDesc: 'Аз баландтарин сарбанди дар ҳоли сохтмон дар ҷаҳон дидан кунед — рамзи дастовардҳои гидроэнергетикӣ ва муҳандисии Тоҷикистон.',
        fullDesc: 'Нерӯгоҳи обии Роғун — нерӯгоҳи гидроэлектрикие, ки дар рӯди Вахш дар ҷануби Тоҷикистон сохта мешавад. Пас аз анҷоми сохтмон, сарбанди он бо баландии 335 метр баландтарин дар ҷаҳон хоҳад буд. Ин лоиҳа орзуи Тоҷикистонро барои табдил шудан ба содироткунандаи бузурги энергия дар Осиёи Марказӣ ифода мекунад ва рамзи ифтихори миллӣ ва дастовардҳои муҳандисӣ мебошад.',
        duration: '08:00–18:00',
        distance: '110 км аз Душанбе',
        route: '/excursions/rogun',
        highlights: ['Баландтарин сарбанди ҷаҳон (335 м)', 'Водии зебои дарёи Вахш', 'Сайри гидроэнергетикӣ', 'Манзараҳои кӯҳӣ'],
        info: 'Экскурсияи тамоми рӯз бо хӯроки нисфирӯзӣ. Автобуси роҳат аз ҷои баргузории конференсия. Роҳбалади касбӣ бо забонҳои гуногун.'
      },
      {
        name: 'Сайри шаҳри Душанбе',
        shortDesc: 'Пойтахти зебо бо осорхонаҳо, ёдгориҳо, боғҳо, бозорҳои анъанавӣ ва мероси фарҳангии бойро кашф кунед.',
        fullDesc: 'Душанбе, пойтахти зебои Тоҷикистонро дар сайри ҷойҳои намоёнтарини шаҳр кашф кунед. Аз Осорхонаи миллии Тоҷикистон бо маҷмӯаи бои ёдгориҳои бостоншиносӣ дидан кунед, дар боғи Рӯдакӣ ва Кохи миллат қадам занед, бозори рангини Меҳргонро тамошо кунед ва баландтарин сутуни парчамро дар ҷаҳон бубинед.',
        duration: '09:00–13:00',
        distance: 'Маркази шаҳр',
        route: '/excursions/dushanbe',
        highlights: ['Осорхонаи миллии Тоҷикистон', 'Боғи Рӯдакӣ ва Кохи миллат', 'Бозори Меҳргон', 'Ёдгориҳои таърихӣ ва меъморӣ'],
        info: 'Сайри пиёдагардӣ ва автобусӣ дар нисфи рӯз. Нақлиёти роҳат байни ҷойҳо. Роҳбалади касбии бисёрзабона.'
      },
      {
        name: 'Қалъаи Ҳисор',
        shortDesc: 'Қалъаи қадимаро, ки зиёда аз 3 000 сол таърих дорад — дарвозаи таърих ва меъмории Осиёи Марказӣ кашф кунед.',
        fullDesc: 'Қалъаи Ҳисор яке аз муҳимтарин ёдгориҳои таърихии Тоҷикистон аст, ки таърихи он зиёда аз 3 000 сол дорад. Дар 30 км ғарби Душанбе ҷойгир буда, ин истеҳкоми қадима дарвозае дар Роҳи абрешим буд. Маҷмӯа дарвозаи қалъа, ду мадрасаи асримиёнагӣ, корвонсарой ва мақбараро дар бар мегирад. Қалъаи Ҳисор бо боғҳои зебо иҳотакардашуда, нигоҳи ҷолибро ба таърихи Осиёи Марказӣ пешниҳод мекунад.',
        duration: '09:00–14:00',
        distance: '30 км аз Душанбе',
        route: '/excursions/khisor',
        highlights: ['Қалъаи 3 000+ сола', 'Мероси Роҳи абрешим', 'Мадрасаҳо ва корвонсарой', 'Осорхонаи бостоншиносӣ'],
        info: 'Экскурсияи нисфирӯзӣ бо нӯшокиҳо. Автобус аз ҷои баргузории конференсия. Роҳбалади таърихии касбӣ.'
      }
    ],
    dayMonth: 'Майи 2026',
    dayTitle: 'Рӯзи экскурсияҳои ройгон',
    dayText: 'Дар рӯзи чоруми конференсия Ҳукумати Ҷумҳурии Тоҷикистон экскурсияҳои ройгон ташкил мекунад, ки ба иштирокчиён имконияти беназир барои шинос шудан бо таърихи бой, фарҳанг ва зебоии табиии Тоҷикистонро пешниҳод менамояд.',
    dayTag: 'Аз ҷониби Ҳукумат ташкил карда мешавад',
    closingTitle: 'Тоҷикистонро эҳсос кунед',
    closingText: 'Бо иштирок дар конференсия дар Душанбе, пойтахти Тоҷикистон, шумо имконият хоҳед дошт шахсан бо ҷозибаҳои сершумори кишвар шинос шавед ва зебоии ин замини қадимаро кашф кунед.',
    closingFeatures: [
      { title: 'Табиати ҳайратовар', text: '93% кӯҳҳо, 10 000+ пиряхҳо ва кӯлҳои тозаи баландкӯҳ дар яке аз зеботарин кишварҳои Осиёи Марказӣ шуморо интизоранд.' },
      { title: 'Мероси бой', text: 'Зиёда аз 3 000 сол таърих, қалъаҳои қадима, дайрҳои буддоӣ ва ҳунарҳои анъанавии ҷаҳоншинос.' },
      { title: 'Экскурсияҳои ройгон', text: 'Ҳамаи экскурсияҳо дар 28 май пурра аз ҷониби Ҳукумати Тоҷикистон барои иштирокчиёни конференсия ташкил ва маблағгузорӣ мешаванд.' }
    ]
  }
}
