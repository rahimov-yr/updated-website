import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Palette, UtensilsCrossed, Gem, Shirt, Music, Droplets,
  Music2, AudioLines, Piano, Mic2, Star, Wind
} from 'lucide-react'
import '../../styles/cultural-infographic.css'

const heritageColors = ['navy', 'teal', 'purple']

export default function CulturalEvents() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('events-cultural', {
    title: { ru: 'Культурные мероприятия', en: 'Cultural Events', tj: 'Чорабиниҳои фарҳангӣ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'cultural_events')

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

      {/* Intro Section */}
      <section className="prl-intro">
        <div className="prl-intro__pattern"></div>
        <div className="container">
          <p className="prl-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="prl-activities">
        <div className="prl-activities__pattern"></div>
        <div className="container">
          <div className="prl-activities__header">
            <h2 className="prl-activities__title">{t.actTitle}</h2>
            <p className="prl-activities__subtitle">{t.actSubtitle}</p>
          </div>
          <div className="prl-act-grid">
            {t.activities.map((act, i) => (
              <div className="prl-act" key={i}>
                <div className="prl-act__icon">{actIcons[i]}</div>
                <h3 className="prl-act__name">{act.name}</h3>
                <p className="prl-act__desc">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="prl-heritage">
        <div className="prl-heritage__pattern"></div>
        <div className="container">
          <div className="prl-heritage__header">
            <h2 className="prl-heritage__title">{t.heritageTitle}</h2>
            <p className="prl-heritage__subtitle">{t.heritageSubtitle}</p>
          </div>
          <div className="prl-heritage-items">
            {t.heritage.map((item, i) => (
              <div className={`prl-heritage-item prl-heritage-item--${heritageColors[i]}`} key={i}>
                <div className="prl-heritage-item__icons">
                  {heritageIcons[i].map((Icon, j) => (
                    <span className={`prl-heritage-item__float prl-heritage-item__float--${j + 1}`} key={j}>
                      <Icon size={heritageIconSizes[i][j]} />
                    </span>
                  ))}
                </div>
                <div className="prl-heritage-item__content">
                  <div className="prl-heritage-item__head">
                    <h3 className="prl-heritage-item__name">{item.name}</h3>
                    <span className="prl-heritage-item__tag">{item.tag}</span>
                  </div>
                  <p className="prl-heritage-item__text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Folk Music Note */}
      <section className="prl-folk">
        <div className="prl-folk__pattern"></div>
        <div className="container">
          <p className="prl-folk__text">{t.folkText}</p>
        </div>
      </section>

      {/* Closing Invitation */}
      <section className="prl-closing">
        <div className="prl-closing__pattern"></div>
        <div className="container">
          <div className="prl-closing__card">
            <h2 className="prl-closing__title">{t.closingTitle}</h2>
            <p className="prl-closing__text">{t.closingText}</p>
          </div>
        </div>
      </section>
    </>
  )
}

const actIcons = [
  <Palette size={24} key="a0" />,
  <UtensilsCrossed size={24} key="a1" />,
  <Gem size={24} key="a2" />,
  <Shirt size={24} key="a3" />,
  <Music size={24} key="a4" />,
  <Droplets size={24} key="a5" />
]

/* ── Pattern motif for Chakan card ── */
function PatternMandala({ size = 24 }) {
  return (
    <img
      src="/assets/images/pattern_transparent_15.png"
      alt=""
      width={size}
      height={size}
      style={{ display: 'block' }}
      draggable={false}
    />
  )
}

// Shashmaqom = music icons, Falak = vocal/celestial icons, Chakan = pattern images
const heritageIcons = [
  [Music2, AudioLines, Piano, Music2, AudioLines],
  [Mic2, Star, Wind, Mic2, Star],
  [PatternMandala, PatternMandala, PatternMandala, PatternMandala, PatternMandala]
]
const heritageIconSizes = [
  [44, 36, 40, 32, 28],
  [44, 36, 40, 32, 28],
  [90, 72, 80, 64, 56]
]

const translations = {
  en: {
    introText: 'Participation in the global discussion on water issues within the framework of the Fourth Dushanbe Conference will provide an opportunity to immerse yourself in the rich culture of the Tajik people. The program also includes exhibitions, an official reception hosted by the Government of the Republic of Tajikistan, excursions, and other cultural and recreational activities.',
    actTitle: 'What to Experience',
    actSubtitle: 'Conference participants will enjoy a variety of cultural and recreational activities.',
    activities: [
      { name: 'Exhibitions', desc: 'Traditional crafts, creativity, and various types of drinking water exhibitions.' },
      { name: 'National Cuisine', desc: 'Taste authentic Tajik national dishes and culinary traditions.' },
      { name: 'Traditional Crafts', desc: 'Explore exhibitions of handmade art and national artisan works.' },
      { name: 'Fashion Shows', desc: 'Shows featuring Tajik national clothing and textile heritage.' },
      { name: 'Concert Program', desc: 'Performances by leading masters of the country\'s musical and performing arts.' },
      { name: 'Water Exhibition', desc: 'Exhibitions showcasing various types of drinking water from Tajikistan.' }
    ],
    heritageTitle: 'Intangible Cultural Heritage',
    heritageSubtitle: 'Tajik national culture is famous for its history, ancient multifaceted and original traditions.',
    heritage: [
      {
        name: 'Shashmaqom',
        tag: 'UNESCO Heritage',
        text: '"Shashmaqom" is a classic of Tajik professional music, formed in the 18th century. It consists of six maqoms (vocal-instrumental suites in national music) combined into a single cycle: "Buzruk", "Navo", "Rost", "Segokh", "Dugoh", and "Irok". Each maqom contains two parts: instrumental "Mushkilot" and vocal "Nasr".'
      },
      {
        name: 'Falak',
        tag: 'UNESCO 2021',
        text: '"Falak" is a highly artistic reflection of an individual\'s life experiences and thoughts on destiny, dreams, aspirations and high human ideals. Performed impromptu, it requires intelligence, wit and high professional skill. This ancient musical genre has been passed down for centuries from mouth to mouth, from heart to heart, through the school of "ustod-shogird" (teacher-student). Falak consists of instrumental and vocal parts performed with dutar, gijak, nay, setor, and Badakhshan rubob. On 15 December 2021, Falak was officially inscribed on the UNESCO World List of Intangible Cultural Heritage.'
      },
      {
        name: 'Chakan',
        tag: 'UNESCO 2018',
        text: '"Chakan" is a Tajik national style of embroidery — typically a wide dress decorated with hand-embroidered patterns made from natural silk material. Chakan has an ancient history: originally, patterns of flowers, stars, petals, the sun, and the moon were made from wood, bones, bronze, leather, and precious stones. On 29 November 2018, the art of chakan embroidery was included in the UNESCO Representative List of the Intangible Cultural Heritage of Humanity.'
      }
    ],
    folkText: 'The folk music and culture of Tajikistan is rich and diverse — it reflects the life of the nation, its character and emotions, customs and traditions. Tajik national culture, having a strong foundation, is famous for its rare written monuments, original works of fine art, and unique musical traditions.',
    closingTitle: 'Experience Tajik Culture',
    closingText: 'By participating in the Fourth Dushanbe Conference on the Water Action Decade, you will have the opportunity to take part in these cultural and recreational activities and to experience the rich culture of the Tajik people.'
  },
  ru: {
    introText: 'Участие в глобальном обсуждении водных вопросов в рамках Четвёртой Душанбинской конференции предоставит возможность погрузиться в богатую культуру таджикского народа. Программа также включает выставки, официальный приём от имени Правительства Республики Таджикистан, экскурсии и другие культурно-развлекательные мероприятия.',
    actTitle: 'Что вас ожидает',
    actSubtitle: 'Участников конференции ждёт разнообразие культурных и развлекательных мероприятий.',
    activities: [
      { name: 'Выставки', desc: 'Выставки традиционных ремёсел, творчества и различных видов питьевой воды.' },
      { name: 'Национальная кухня', desc: 'Дегустация блюд аутентичной таджикской национальной кухни.' },
      { name: 'Традиционные ремёсла', desc: 'Выставки ручного искусства и произведений национальных мастеров.' },
      { name: 'Показы мод', desc: 'Показы таджикской национальной одежды и текстильного наследия.' },
      { name: 'Концертная программа', desc: 'Выступления ведущих мастеров музыкального и сценического искусства страны.' },
      { name: 'Выставка воды', desc: 'Выставки различных видов питьевой воды из Таджикистана.' }
    ],
    heritageTitle: 'Нематериальное культурное наследие',
    heritageSubtitle: 'Таджикская национальная культура славится своей историей, древними многогранными и самобытными традициями.',
    heritage: [
      {
        name: 'Шашмаком',
        tag: 'Наследие ЮНЕСКО',
        text: '«Шашмаком» — классика таджикской профессиональной музыки, сформировавшаяся в XVIII веке. Это шесть макомов (вокально-инструментальных сюит), объединённых в единый цикл: «Бузрук», «Наво», «Рост», «Сегох», «Дугох» и «Ирок». Каждый маком содержит две части: инструментальную «Мушкилот» и вокальную «Наср».'
      },
      {
        name: 'Фалак',
        tag: 'ЮНЕСКО 2021',
        text: '«Фалак» — высокохудожественное отражение жизненного опыта человека и его мыслей о судьбе, мечтах и высоких идеалах. Исполняется экспромтом, что требует ума, остроумия и высокого профессионального мастерства. Этот древний музыкальный жанр передавался веками из уст в уста, от сердца к сердцу через школу «устод-шогирд» (учитель-ученик). 15 декабря 2021 года Фалак был внесён в Список нематериального культурного наследия ЮНЕСКО.'
      },
      {
        name: 'Чакан',
        tag: 'ЮНЕСКО 2018',
        text: '«Чакан» — таджикский национальный стиль вышивки, как правило, широкое платье, украшенное ручной вышивкой из натурального шёлкового материала. Чакан имеет древнюю историю: изначально узоры цветов, звёзд, лепестков, солнца и луны делались из дерева, кости, бронзы, кожи и драгоценных камней. 29 ноября 2018 года искусство вышивки чакан было включено в Репрезентативный список нематериального культурного наследия человечества ЮНЕСКО.'
      }
    ],
    folkText: 'Народная музыка и культура Таджикистана богата и разнообразна — она отражает жизнь нации, её характер и эмоции, обычаи и традиции. Таджикская национальная культура, имея прочную основу, славится своими редкими письменными памятниками, самобытными произведениями изобразительного искусства и уникальными музыкальными традициями.',
    closingTitle: 'Познакомьтесь с культурой Таджикистана',
    closingText: 'Участвуя в Четвёртой Душанбинской конференции по Десятилетию действий в области водных ресурсов, вы получите возможность принять участие в этих культурно-развлекательных мероприятиях и познакомиться с богатой культурой таджикского народа.'
  },
  tj: {
    introText: 'Иштирок дар муҳокимаи ҷаҳонии масъалаҳои обӣ дар доираи Конференсияи чоруми Душанбе имконият медиҳад, ки ба фарҳанги бойи мардуми тоҷик шинос шавед. Барнома инчунин намоишгоҳҳо, зиёфати расмии Ҳукумати Ҷумҳурии Тоҷикистон, сайру гаштҳо ва дигар чорабиниҳои фарҳангию фароғатиро дар бар мегирад.',
    actTitle: 'Чӣ чизро таҷриба кунед',
    actSubtitle: 'Иштирокчиёни конференсия аз чорабиниҳои гуногуни фарҳангию фароғатӣ баҳра мебаранд.',
    activities: [
      { name: 'Намоишгоҳҳо', desc: 'Намоишгоҳҳои ҳунарҳои анъанавӣ, эҷодиёт ва намудҳои гуногуни оби нӯшокӣ.' },
      { name: 'Таоми миллӣ', desc: 'Чашидани хӯрокҳои аслии миллии тоҷикӣ ва анъанаҳои ошпазӣ.' },
      { name: 'Ҳунарҳои анъанавӣ', desc: 'Намоишгоҳҳои санъати дастӣ ва осори ҳунармандони миллӣ.' },
      { name: 'Намоишҳои мӯд', desc: 'Намоишҳои пӯшоки миллии тоҷикӣ ва мероси бофандагӣ.' },
      { name: 'Барномаи концертӣ', desc: 'Баромадҳои устодони пешбари санъати мусиқӣ ва саҳнавии кишвар.' },
      { name: 'Намоишгоҳи об', desc: 'Намоишгоҳҳои намудҳои гуногуни оби нӯшокӣ аз Тоҷикистон.' }
    ],
    heritageTitle: 'Мероси фарҳангии ғайримоддӣ',
    heritageSubtitle: 'Фарҳанги миллии тоҷик бо таърих, анъанаҳои қадимии бисёрҷанба ва аслии худ машҳур аст.',
    heritage: [
      {
        name: 'Шашмақом',
        tag: 'Мероси ЮНЕСКО',
        text: '«Шашмақом» классикаи мусиқии касбии тоҷик аст, ки дар асри XVIII ташаккул ёфтааст. Он аз шаш мақом (сюитаҳои вокалию асбобӣ) иборат буда, ба як давраи ягона муттаҳид шудаанд: «Бузрук», «Наво», «Рост», «Сегоҳ», «Дугоҳ» ва «Ироқ». Ҳар як мақом ду қисмро дар бар мегирад: асбобии «Мушкилот» ва вокалии «Наср».'
      },
      {
        name: 'Фалак',
        tag: 'ЮНЕСКО 2021',
        text: '«Фалак» инъикоси баландсанъати таҷрибаи зиндагии инсон ва андешаҳои ӯ дар бораи тақдир, орзуҳо ва идеалҳои баланди инсонӣ мебошад. Он бадеҳатан иҷро мешавад, ки аз иҷрокунанда зеҳн, зиракӣ ва маҳорати баланди касбиро талаб мекунад. Ин жанри қадимии мусиқӣ асрҳо аз даҳон ба даҳон, аз дил ба дил тавассути мактаби «устод-шогирд» интиқол ёфтааст. 15 декабри 2021 Фалак расман ба Рӯйхати ҷаҳонии мероси фарҳангии ғайримоддии ЮНЕСКО ворид карда шуд.'
      },
      {
        name: 'Чакан',
        tag: 'ЮНЕСКО 2018',
        text: '«Чакан» услуби миллии тоҷикии гулдӯзӣ мебошад — одатан курта бо нақшҳои дастдӯзӣ аз масолеҳи табиии абрешимӣ оро дода мешавад. Чакан таърихи қадима дорад: дар аввал нақшҳои гул, ситора, гулбарг, офтоб ва моҳ аз чӯб, устухон, биринҷӣ, чарм ва сангҳои қиматбаҳо сохта мешуданд. 29 ноябри 2018 санъати гулдӯзии чакан ба Рӯйхати намояндагии мероси фарҳангии ғайримоддии инсоният ворид карда шуд.'
      }
    ],
    folkText: 'Мусиқии мардумӣ ва фарҳанги Тоҷикистон бой ва гуногун аст — он зиндагии миллат, характер ва эҳсосот, урфу одатҳо ва анъанаҳои онро инъикос мекунад. Фарҳанги миллии тоҷик, ки заминаи мустаҳкам дорад, бо ёдгориҳои нодири хаттӣ, осори аслии санъати тасвирӣ ва анъанаҳои беназири мусиқӣ машҳур аст.',
    closingTitle: 'Фарҳанги тоҷикро эҳсос кунед',
    closingText: 'Бо иштирок дар Конференсияи чоруми Душанбе оид ба Даҳсолаи амалиёти обӣ, шумо имконият хоҳед дошт дар ин чорабиниҳои фарҳангию фароғатӣ иштирок кунед ва бо фарҳанги бойи мардуми тоҷик шинос шавед.'
  }
}
