import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import { History, Landmark, Scissors, Mountain, MapPin } from 'lucide-react'
import '../styles/excursions-infographic.css'

const timelineVariants = ['history', 'landmarks', 'crafts', 'cuisine']
const statVariants = ['mountains', 'glaciers', 'ranges']

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

      {/* Hero Quote */}
      <section className="exc-hero-quote">
        <div className="exc-hero-quote__pattern"></div>
        <div className="container">
          <div className="exc-hero-quote__block">
            <h2 className="exc-hero-quote__tagline">{t.tagline}</h2>
            <p className="exc-hero-quote__text">{t.introText}</p>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="exc-journey">
        <div className="exc-journey__pattern"></div>
        <div className="container">
          <div className="exc-journey__header">
            <h2 className="exc-journey__title">{t.journeyTitle}</h2>
            <p className="exc-journey__subtitle">{t.journeySubtitle}</p>
          </div>
          <div className="exc-timeline">
            {t.stops.map((stop, i) => (
              <div className={`exc-timeline-item exc-timeline-item--${timelineVariants[i]}`} key={i}>
                <div className="exc-timeline-item__dot">{timelineIcons[i]}</div>
                <div className="exc-timeline-item__card">
                  <h3 className="exc-timeline-item__name">{stop.name}</h3>
                  <p className="exc-timeline-item__text">{stop.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nature Stats */}
      <section className="exc-nature">
        <div className="exc-nature__pattern"></div>
        <div className="container">
          <div className="exc-nature__header">
            <h2 className="exc-nature__title">{t.natureTitle}</h2>
            <p className="exc-nature__subtitle">{t.natureSubtitle}</p>
          </div>
          <div className="exc-stats-mosaic">
            {t.stats.map((stat, i) => (
              <div className={`exc-stat-block exc-stat-block--${statVariants[i]}`} key={i}>
                <p className="exc-stat-block__value">{stat.value}</p>
                <p className="exc-stat-block__label">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="exc-nature__desc">{t.natureDesc}</p>
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

      {/* Closing Banner */}
      <section className="exc-closing">
        <div className="exc-closing__pattern"></div>
        <div className="container">
          <h2 className="exc-closing__title">{t.closingTitle}</h2>
          <p className="exc-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const timelineIcons = [
  <History size={20} key="t0" />,
  <Landmark size={20} key="t1" />,
  <Scissors size={20} key="t2" />,
  <Mountain size={20} key="t3" />
]

const translations = {
  en: {
    tagline: 'Discover the Rich History, Culture, and Natural Beauty of Tajikistan',
    introText: 'Participation in the 4th High-Level International Conference on the International Decade for Action "Water for Sustainable Development", 2018–2028, offers a unique opportunity to discover the rich history, culture, and breathtaking natural beauty of Tajikistan.',
    journeyTitle: 'A Land of Rich Heritage',
    journeySubtitle: 'Tajikistan is one of the world\'s most ancient countries, renowned for its distinctive culture and unique natural landscapes.',
    stops: [
      {
        name: 'Ancient History',
        text: 'The territory of Tajikistan was inhabited by peoples as early as the mid-1st millennium BC, who established renowned ancient states such as Sogdiana and Bactria. The country is rich in historical and cultural landmarks.'
      },
      {
        name: 'Historical Landmarks',
        text: 'The Hissar Fortress, the Khoja Mashhad Mausoleum, the remains of Buddhist monasteries dating back to the 7th–8th centuries, and many other monuments reflect the key milestones in the history of Tajikistan.'
      },
      {
        name: 'Traditional Crafts',
        text: 'Modern Tajikistan carefully preserves its ancient historical and cultural heritage and revives traditional crafts. Many ancient cities are home to renowned dynasties of artisans — masters of gold embroidery, silk production, abr (ikat) weaving, batik, guldūzī embroidery, skullcap embroidery, weaving, jewelry making, and ceramics.'
      },
      {
        name: 'Hospitality & Cuisine',
        text: 'Tajikistan is known for its hospitable people and exceptionally delicious cuisine. The country\'s unique culinary traditions, warm hospitality, and vibrant culture create an unforgettable experience for every visitor.'
      }
    ],
    natureTitle: 'Majestic Mountains & Glaciers',
    natureSubtitle: 'Tajikistan is a land of majestic mountains belonging to some of the world\'s highest mountain systems.',
    stats: [
      { value: '93%', label: 'Territory covered by mountains' },
      { value: '10,000+', label: 'Mountain glaciers' },
      { value: '3', label: 'Major mountain ranges' }
    ],
    natureDesc: 'The Tien Shan, Pamir, and Gissar-Alay ranges dominate the landscape. Tajikistan is home to more than ten thousand mountain glaciers, the largest of which is the Vanjyakh (Fedchenko) Glacier.',
    dayMonth: 'May 2026',
    dayTitle: 'Free Excursion Day',
    dayText: 'On the fourth day of the Conference, the Government of the Republic of Tajikistan will organize free excursions, offering participants a unique opportunity to explore the rich history, culture, and natural beauty of Tajikistan.',
    dayTag: 'Organized by the Government',
    closingTitle: 'Experience Tajikistan',
    closingText: 'By participating in the Conference in Dushanbe, the capital of Tajikistan, you will have the opportunity to personally experience the country\'s many attractions and discover the beauty of this ancient land.'
  },
  ru: {
    tagline: 'Откройте богатую историю, культуру и природную красоту Таджикистана',
    introText: 'Участие в 4-й Международной конференции высокого уровня по Международному десятилетию действий «Вода для устойчивого развития», 2018–2028 гг., предоставляет уникальную возможность познакомиться с богатой историей, культурой и захватывающей природной красотой Таджикистана.',
    journeyTitle: 'Земля богатого наследия',
    journeySubtitle: 'Таджикистан — одна из древнейших стран мира, славящаяся самобытной культурой и уникальными природными ландшафтами.',
    stops: [
      {
        name: 'Древняя история',
        text: 'Территория Таджикистана была заселена народами ещё в середине I тысячелетия до н.э., которые основали известные древние государства — Согдиану и Бактрию. Страна богата историческими и культурными памятниками.'
      },
      {
        name: 'Исторические памятники',
        text: 'Гиссарская крепость, мавзолей Ходжа Машхад, остатки буддийских монастырей VII–VIII веков и множество других памятников отражают ключевые вехи в истории Таджикистана.'
      },
      {
        name: 'Традиционные ремёсла',
        text: 'Современный Таджикистан бережно хранит своё древнее историко-культурное наследие и возрождает традиционные ремёсла. Во многих древних городах живут знаменитые династии мастеров — золотошвеи, шёлкопряды, ткачи абра (икат), батика, гулдӯзӣ, тюбетейщики, ювелиры и керамисты.'
      },
      {
        name: 'Гостеприимство и кухня',
        text: 'Таджикистан славится гостеприимным народом и исключительно вкусной кухней. Уникальные кулинарные традиции страны, тёплое гостеприимство и яркая культура создают незабываемые впечатления для каждого гостя.'
      }
    ],
    natureTitle: 'Величественные горы и ледники',
    natureSubtitle: 'Таджикистан — страна величественных гор, принадлежащих к высочайшим горным системам мира.',
    stats: [
      { value: '93%', label: 'Территории покрыто горами' },
      { value: '10 000+', label: 'Горных ледников' },
      { value: '3', label: 'Крупные горные системы' }
    ],
    natureDesc: 'Тянь-Шань, Памир и Гиссаро-Алайские хребты доминируют в ландшафте. Таджикистан является домом для более чем десяти тысяч горных ледников, крупнейшим из которых является ледник Ванджях (Федченко).',
    dayMonth: 'Май 2026',
    dayTitle: 'День бесплатных экскурсий',
    dayText: 'На четвёртый день конференции Правительство Республики Таджикистан организует бесплатные экскурсии, предоставляя участникам уникальную возможность познакомиться с богатой историей, культурой и природной красотой Таджикистана.',
    dayTag: 'Организовано Правительством',
    closingTitle: 'Познакомьтесь с Таджикистаном',
    closingText: 'Участвуя в конференции в Душанбе, столице Таджикистана, вы получите возможность лично познакомиться с многочисленными достопримечательностями страны и открыть для себя красоту этой древней земли.'
  },
  tj: {
    tagline: 'Таърихи бой, фарҳанг ва зебоии табиии Тоҷикистонро кашф кунед',
    introText: 'Иштирок дар Конференсияи 4-уми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор», 2018–2028, имконияти беназирро барои кашфи таърихи бой, фарҳанг ва зебоии ҳайратовари табиии Тоҷикистон пешниҳод мекунад.',
    journeyTitle: 'Замини мероси бой',
    journeySubtitle: 'Тоҷикистон яке аз қадимтарин кишварҳои ҷаҳон аст, ки бо фарҳанги хоси худ ва манзараҳои табиии беназираш машҳур аст.',
    stops: [
      {
        name: 'Таърихи қадим',
        text: 'Ҳудуди Тоҷикистон ҳанӯз дар миёнаи ҳазорсолаи I то милод аз ҷониби мардумон маскун шуда буд, ки давлатҳои бузурги қадимаро ба мисли Суғд ва Бохтар таъсис доданд. Кишвар бо осори таърихию фарҳангӣ бой аст.'
      },
      {
        name: 'Осори таърихӣ',
        text: 'Қалъаи Ҳисор, мақбараи Хоҷа Машҳад, боқимондаҳои дайрҳои буддоии асрҳои VII–VIII ва бисёр ёдгориҳои дигар нуқтаҳои асосии таърихи Тоҷикистонро инъикос мекунанд.'
      },
      {
        name: 'Ҳунарҳои анъанавӣ',
        text: 'Тоҷикистони муосир мероси таърихию фарҳангии қадимаи худро бодиққат ҳифз мекунад ва ҳунарҳои анъанавиро эҳё менамояд. Дар бисёр шаҳрҳои қадимӣ сулолаҳои машҳури ҳунармандон — устоёни заррдӯзӣ, абрешимбофӣ, абрбофӣ, батик, гулдӯзӣ, тоқидӯзӣ, бофандагӣ, заргарӣ ва кулолгарӣ зиндагӣ мекунанд.'
      },
      {
        name: 'Меҳмоннавозӣ ва ошпазӣ',
        text: 'Тоҷикистон бо мардуми меҳмоннавоз ва хӯрокҳои бениҳоят болаззат машҳур аст. Анъанаҳои хоси ошпазӣ, меҳмоннавозии гарм ва фарҳанги рангини кишвар барои ҳар як меҳмон таассуроти фаромӯшнашаванда эҷод мекунанд.'
      }
    ],
    natureTitle: 'Кӯҳҳои бузургвор ва пиряхҳо',
    natureSubtitle: 'Тоҷикистон кишвари кӯҳҳои бузургвор аст, ки ба баландтарин системаҳои кӯҳии ҷаҳон тааллуқ доранд.',
    stats: [
      { value: '93%', label: 'Ҳудудро кӯҳҳо фаро гирифтаанд' },
      { value: '10 000+', label: 'Пиряхҳои кӯҳӣ' },
      { value: '3', label: 'Системаҳои бузурги кӯҳӣ' }
    ],
    natureDesc: 'Тяншон, Помир ва силсилакӯҳҳои Ҳисору Олой дар манзара ҳукмронӣ мекунанд. Тоҷикистон зиёда аз даҳ ҳазор пиряхи кӯҳӣ дорад, ки бузургтаринашон пиряхи Ванҷях (Федченко) мебошад.',
    dayMonth: 'Майи 2026',
    dayTitle: 'Рӯзи экскурсияҳои ройгон',
    dayText: 'Дар рӯзи чоруми конференсия Ҳукумати Ҷумҳурии Тоҷикистон экскурсияҳои ройгон ташкил мекунад, ки ба иштирокчиён имконияти беназир барои шинос шудан бо таърихи бой, фарҳанг ва зебоии табиии Тоҷикистонро пешниҳод менамояд.',
    dayTag: 'Аз ҷониби Ҳукумат ташкил карда мешавад',
    closingTitle: 'Тоҷикистонро эҳсос кунед',
    closingText: 'Бо иштирок дар конференсия дар Душанбе, пойтахти Тоҷикистон, шумо имконият хоҳед дошт шахсан бо ҷозибаҳои сершумори кишвар шинос шавед ва зебоии ин замини қадимаро кашф кунед.'
  }
}
