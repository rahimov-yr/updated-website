import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  ClipboardList, ShieldCheck, Plane, Camera, Bus, Languages,
  Users, Palette, LayoutGrid, Thermometer, Clock, DollarSign,
  Stethoscope
} from 'lucide-react'
import '../../styles/practical-infographic.css'

const cardColors = ['navy', 'teal', 'green', 'purple', 'rose', 'cyan', 'amber', 'navy', 'teal', 'green']

export default function PracticalInfo() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('logistics-practical', {
    title: { ru: 'Практическая информация', en: 'Practical Information', tj: 'Маълумоти амалӣ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_practical')

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

      {/* Intro */}
      <section className="pra-intro">
        <div className="pra-intro__pattern"></div>
        <div className="container">
          <p className="pra-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Info Hub */}
      <section className="pra-hub">
        <div className="container">
          <div className="pra-hub__grid">
            <div className="pra-hub__card">
              <div className="pra-hub__card-badge">{t.keyDateHeading}</div>
              {t.keyDate.map((item, i) => (
                <div className="pra-hub__row" key={i}>
                  <p className="pra-hub__label">{item.label}</p>
                  <p className="pra-hub__value">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="pra-hub__card">
              <div className="pra-hub__card-badge">{t.keyContactHeading}</div>
              {t.keyContact.map((item, i) => (
                <div className="pra-hub__row" key={i}>
                  <p className="pra-hub__label">{item.label}</p>
                  <p className="pra-hub__value" dangerouslySetInnerHTML={{ __html: item.value }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guide */}
      <section className="pra-guide">
        <div className="pra-guide__pattern"></div>
        <div className="container">
          <div className="pra-guide__header">
            <h2 className="pra-guide__title">{t.topicsTitle}</h2>
            <p className="pra-guide__subtitle">{t.topicsSubtitle}</p>
          </div>
          <div className="pra-guide-list">
            {t.topics.map((topic, i) => (
              <div className={`pra-card pra-card--${cardColors[i]}`} key={i}>
                <div className="pra-card__head">
                  <span className="pra-card__pill">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pra-card__icon">{topicIcons[i]}</span>
                  <h3 className="pra-card__name">{topic.name}</h3>
                </div>
                <div className="pra-card__body">
                  <p className="pra-card__text" dangerouslySetInnerHTML={{ __html: topic.text }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="pra-ref">
        <div className="container">
          <p className="pra-ref__title">{t.factsTitle}</p>
          <div className="pra-ref__grid">
            {t.facts.map((fact, i) => (
              <div className="pra-ref__item" key={i}>
                <div className="pra-ref__item-icon">{factIcons[i]}</div>
                <p className="pra-ref__item-value">{fact.value}</p>
                <p className="pra-ref__item-label">{fact.label}</p>
                {fact.note && <p className="pra-ref__item-note">{fact.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pra-closing">
        <div className="pra-closing__pattern"></div>
        <div className="container">
          <h2 className="pra-closing__title">{t.closingTitle}</h2>
          <p className="pra-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const topicIcons = [
  <ClipboardList size={16} key="t0" />,
  <ShieldCheck size={16} key="t1" />,
  <Plane size={16} key="t2" />,
  <Camera size={16} key="t3" />,
  <Bus size={16} key="t4" />,
  <Languages size={16} key="t5" />,
  <Users size={16} key="t6" />,
  <Palette size={16} key="t7" />,
  <LayoutGrid size={16} key="t8" />,
  <Plane size={16} key="t9" />
]

const factIcons = [
  <Thermometer size={20} key="f0" />,
  <Clock size={20} key="f1" />,
  <DollarSign size={20} key="f2" />,
  <Stethoscope size={20} key="f3" />
]

const translations = {
  en: {
    introLabel: 'Attendee Guide',
    introTitle: 'Practical Information',
    introText: 'The Conference is organized by the Government of the Republic of Tajikistan in cooperation with the United Nations and other development partners to advance progress towards the achievement of the objectives of the International Decade for Action "Water for Sustainable Development", 2018\u20132028, declared by the UN General Assembly Resolution 71/222 of 21 December 2016.',
    keyDateHeading: 'Date & Venue',
    keyDate: [
      { label: 'Dates', value: '25\u201328 May 2026' },
      { label: 'City', value: 'Dushanbe, Republic of Tajikistan' },
      { label: 'Venue', value: 'State Complex "Kokhi Somon", 122 Rudaki St.' },
      { label: 'Opening', value: '26 May 2026, 09:00' }
    ],
    keyContactHeading: 'Contact Information',
    keyContact: [
      { label: 'Secretariat', value: 'Ministry of Foreign Affairs of the Republic of Tajikistan' },
      { label: 'Phone', value: '(992 37) 227 68 43' },
      { label: 'Fax', value: '(992 37) 221 02 59' },
      { label: 'Email', value: '<a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>' },
      { label: 'Website', value: '<a href="https://conf2026.dushanbewaterprocess.org/" target="_blank" rel="noopener">conf2026.dushanbewaterprocess.org</a>' }
    ],
    topicsTitle: 'Conference Guide',
    topicsSubtitle: 'Everything you need to know to prepare for and attend the Conference.',
    topics: [
      {
        name: 'Registration',
        text: 'Heads of State and Government of UN Member States, international and regional organizations, financial institutions, research and educational institutions, the private sector, NGOs, civil society, river and lake basin organizations, women\'s, youth and children\'s organizations are invited to attend.<br/><br/>Official delegations must register on the Conference website by filling out a form indicating delegate details, route, flight, arrival/departure time, and personal photo (3\u00d74). This information should also be sent via diplomatic channels to <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> and <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a>.<br/><br/>Based on the information received, organizers will book hotels, arrange airport pickup, and prepare badges. <strong>Registration deadline: 1 May 2026 at 12:00 UTC.</strong>'
      },
      {
        name: 'Visa Support',
        text: 'Participants are required to obtain a visa, unless they are citizens of countries with bilateral/multilateral visa-free agreements with Tajikistan.<br/><br/>The Conference Secretariat will provide a Visa Support Letter upon official request sent to <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>. Citizens of certain countries can obtain a visa on arrival at Dushanbe International Airport. All others must obtain a visa from a Tajik Embassy/Consulate before departure. <strong>Conference visas are issued free of charge.</strong><br/><br/>Participants eligible for visa-free entry who wish to obtain an e-visa prior to departure may apply at <a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a> (cost: 30 USD).'
      },
      {
        name: 'Arrival & Departure',
        text: 'To obtain permission through diplomatic channels to use the airspace and land at Dushanbe International Airport, send a note with a completed application to the State Protocol Department at <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a>. Application form: <a href="https://mfa.tj/en/main/view/2087/state-protocol" target="_blank" rel="noopener">mfa.tj/state-protocol</a>.<br/><br/>High-ranking guests and accompanying persons will be met by the organizers at the CIP and VIP halls of Dushanbe International Airport.'
      },
      {
        name: 'Media Accreditation',
        text: 'Foreign journalists, including personal press representatives of heads of delegations, must obtain accreditation from the Ministry of Foreign Affairs to cover the Conference.<br/><br/>Send accreditation information to the Information and Press Department by <strong>1 May 2026</strong>: <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a> and <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a>.<br/><br/>Admission of media representatives to official events will be carried out according to the accredited list and valid ID.'
      },
      {
        name: 'Local Transport',
        text: 'Transport will be organized for delegations upon arrival/departure from/to the airport. Shuttle buses will be provided to transport delegates from hotels to the Conference venue and back.'
      },
      {
        name: 'Languages',
        text: 'The working languages of the Conference are <strong>Tajik, English, and Russian</strong>, with simultaneous translation provided. If a head of delegation wishes to make a speech in another language, they will need to provide their own interpreter.'
      },
      {
        name: 'Conference Format',
        text: 'The Conference will adopt a multi-stakeholder approach, bringing together high-level officials and representatives from UN Member States, UN entities, international organizations, financial institutions, the private sector, academia, civil society, local governments, and communities. <strong>The Conference will be held in person.</strong>'
      },
      {
        name: 'Cultural Events',
        text: 'The Conference provides for various cultural events where participants will explore the diverse forms of ancient Tajik cultural heritage. The event will showcase cultural and traditional aspects from all regions of Tajikistan. Folk music groups will delight guests with spectacular performances, and participants can familiarize themselves with Tajik national cuisine.'
      },
      {
        name: 'Exhibitions',
        text: 'Conference participants can visit the exhibition on water-related topics organized on the sidelines of the Conference in the state complex "Kokhi Somon".'
      },
      {
        name: 'Airlines & Flights',
        text: 'Regular international flights operate to/from Dushanbe International Airport from major cities: Almaty, Dubai, Istanbul, Jeddah, Munich, Moscow, Saint Petersburg, Tehran, Mashhad, New Delhi, Kuwait, Baku, Urumqi, Tashkent, and others.<br/><br/>More information is available at <a href="http://airport.tj" target="_blank" rel="noopener">airport.tj</a>. Air transport is carried out by both national and international carriers.'
      }
    ],
    factsTitle: 'Quick Reference',
    facts: [
      { label: 'Weather', value: '25\u201335\u00b0C', note: 'Dry & hot in May' },
      { label: 'Time Zone', value: 'GMT+5', note: 'Dushanbe' },
      { label: 'Currency', value: 'Somoni (TJS)', note: 'Exchange at banks, hotels, airport' },
      { label: 'Medical', value: 'First Aid', note: 'Available at venue & hotels' }
    ],
    closingTitle: 'Need More Information?',
    closingText: 'All necessary information about the Conference is available on the official website. For further inquiries, contact the Conference Secretariat.'
  },
  ru: {
    introLabel: 'Руководство участника',
    introTitle: 'Практическая информация',
    introText: 'Конференция организована Правительством Республики Таджикистан в сотрудничестве с Организацией Объединённых Наций и другими партнёрами по развитию в целях содействия достижению целей Международного десятилетия действий \u00abВода для устойчивого развития\u00bb, 2018\u20132028 гг., объявленного резолюцией Генеральной Ассамблеи ООН 71/222 от 21 декабря 2016 года.',
    keyDateHeading: 'Дата и место',
    keyDate: [
      { label: 'Даты', value: '25\u201328 мая 2026 г.' },
      { label: 'Город', value: 'Душанбе, Республика Таджикистан' },
      { label: 'Место', value: 'Государственный комплекс \u00abКохи Сомон\u00bb, ул. Рудаки, 122' },
      { label: 'Открытие', value: '26 мая 2026 г., 09:00' }
    ],
    keyContactHeading: 'Контактная информация',
    keyContact: [
      { label: 'Секретариат', value: 'Министерство иностранных дел Республики Таджикистан' },
      { label: 'Телефон', value: '(992 37) 227 68 43' },
      { label: 'Факс', value: '(992 37) 221 02 59' },
      { label: 'Эл. почта', value: '<a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>' },
      { label: 'Сайт', value: '<a href="https://conf2026.dushanbewaterprocess.org/" target="_blank" rel="noopener">conf2026.dushanbewaterprocess.org</a>' }
    ],
    topicsTitle: 'Руководство конференции',
    topicsSubtitle: 'Всё, что нужно знать для подготовки и участия в конференции.',
    topics: [
      {
        name: 'Регистрация',
        text: 'К участию в конференции приглашаются главы государств и правительств стран \u2014 членов ООН, международные и региональные организации, финансовые учреждения, научно-образовательные институты, частный сектор, НПО, гражданское общество, организации речных и озёрных бассейнов, женские, молодёжные и детские организации.<br/><br/>Официальные делегации должны зарегистрироваться на сайте конференции, заполнив форму с указанием данных делегатов, маршрута, рейса, времени прибытия/отъезда и фото (3\u00d74). Информацию также следует продублировать по дипломатическим каналам на адреса <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> и <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a>.<br/><br/>На основании полученной информации организаторы забронируют отель, организуют встречу в аэропорту и подготовят бейджи. <strong>Срок регистрации: 1 мая 2026 г., 12:00 UTC.</strong>'
      },
      {
        name: 'Визовая поддержка',
        text: 'Участникам необходимо получить визу, за исключением граждан стран с двусторонними/многосторонними соглашениями о безвизовом въезде.<br/><br/>Секретариат конференции предоставит письмо о визовой поддержке по запросу на <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>. Граждане ряда стран могут получить визу по прибытии в аэропорту Душанбе. Остальным необходимо получить визу в посольстве/консульстве Таджикистана. <strong>Визы для участников конференции выдаются бесплатно.</strong><br/><br/>Участники, имеющие право на безвизовый въезд, но желающие получить электронную визу заранее, могут подать заявку на <a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a> (стоимость: 30 долл. США).'
      },
      {
        name: 'Прибытие и отъезд',
        text: 'Для получения разрешения на использование воздушного пространства и посадку в аэропорту Душанбе необходимо направить ноту с заполненной заявкой в Управление государственного протокола на <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a>. Форма заявки: <a href="https://mfa.tj/en/main/view/2087/state-protocol" target="_blank" rel="noopener">mfa.tj/state-protocol</a>.<br/><br/>Высокопоставленных гостей и сопровождающих лиц организаторы встретят в залах CIP и VIP аэропорта Душанбе.'
      },
      {
        name: 'Аккредитация СМИ',
        text: 'Иностранные журналисты, включая пресс-представителей глав делегаций, должны получить аккредитацию в МИД Республики Таджикистан.<br/><br/>Информацию для аккредитации необходимо направить до <strong>1 мая 2026 г.</strong> на адреса: <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a> и <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a>.<br/><br/>Допуск представителей СМИ на мероприятия осуществляется по списку и при предъявлении удостоверения личности.'
      },
      {
        name: 'Местный транспорт',
        text: 'Для делегаций будет организован транспорт при прибытии/отъезде в/из аэропорта. Автобусы-шаттлы доставят делегатов из отелей к месту проведения конференции и обратно.'
      },
      {
        name: 'Языки',
        text: 'Рабочие языки конференции \u2014 <strong>таджикский, английский и русский</strong> с синхронным переводом. Если глава делегации желает выступить на другом языке, необходимо обеспечить собственного переводчика.'
      },
      {
        name: 'Формат конференции',
        text: 'Конференция будет проведена в многостороннем формате с участием высокопоставленных представителей государств \u2014 членов ООН, структур ООН, международных организаций, финансовых институтов, частного сектора, научных кругов, гражданского общества, местных органов власти и сообществ. <strong>Конференция проводится в очном формате.</strong>'
      },
      {
        name: 'Культурные мероприятия',
        text: 'В рамках конференции запланированы различные культурные мероприятия, на которых участники смогут познакомиться с разнообразными формами древнего культурного наследия таджикского народа. Фольклорные коллективы из различных регионов Таджикистана порадуют гостей яркими выступлениями, а участники смогут познакомиться с таджикской национальной кухней.'
      },
      {
        name: 'Выставки',
        text: 'Участники конференции могут посетить выставку по водной тематике, организованную в государственном комплексе \u00abКохи Сомон\u00bb.'
      },
      {
        name: 'Авиарейсы',
        text: 'Регулярные международные рейсы выполняются в/из аэропорта Душанбе из крупных городов: Алматы, Дубай, Стамбул, Джидда, Мюнхен, Москва, Санкт-Петербург, Тегеран, Мешхед, Нью-Дели, Кувейт, Баку, Урумчи, Ташкент и др.<br/><br/>Подробная информация доступна на сайте <a href="http://airport.tj" target="_blank" rel="noopener">airport.tj</a>. Авиаперевозки осуществляются национальными и международными перевозчиками.'
      }
    ],
    factsTitle: 'Краткая справка',
    facts: [
      { label: 'Погода', value: '25\u201335\u00b0C', note: 'Сухо и жарко в мае' },
      { label: 'Часовой пояс', value: 'GMT+5', note: 'Душанбе' },
      { label: 'Валюта', value: 'Сомони (TJS)', note: 'Обмен в банках, отелях, аэропорту' },
      { label: 'Медицина', value: 'Первая помощь', note: 'На месте и в отелях' }
    ],
    closingTitle: 'Нужна дополнительная информация?',
    closingText: 'Вся необходимая информация о конференции доступна на официальном сайте. По дополнительным вопросам обращайтесь в Секретариат конференции.'
  },
  tj: {
    introLabel: 'Дастури иштирокчӣ',
    introTitle: 'Маълумоти амалӣ',
    introText: 'Конференсия аз ҷониби Ҳукумати Ҷумҳурии Тоҷикистон бо ҳамкории Созмони Милали Муттаҳид ва дигар шарикони рушд барои пешбурди пешрафт дар ноил шудан ба ҳадафҳои Даҳсолаи байналмилалии амал \u00abОб барои рушди устувор\u00bb, 2018\u20132028, ки бо қарори Маҷмаи Умумии СММ 71/222 аз 21 декабри 2016 эълон шудааст, ташкил карда мешавад.',
    keyDateHeading: 'Сана ва макон',
    keyDate: [
      { label: 'Санаҳо', value: '25\u201328 майи 2026' },
      { label: 'Шаҳр', value: 'Душанбе, Ҷумҳурии Тоҷикистон' },
      { label: 'Макон', value: 'Маҷмааи давлатии \u00abКохи Сомон\u00bb, кӯч. Рӯдакӣ, 122' },
      { label: 'Кушоиш', value: '26 майи 2026, 09:00' }
    ],
    keyContactHeading: 'Маълумоти тамос',
    keyContact: [
      { label: 'Котибот', value: 'Вазорати корҳои хориҷии Ҷумҳурии Тоҷикистон' },
      { label: 'Телефон', value: '(992 37) 227 68 43' },
      { label: 'Факс', value: '(992 37) 221 02 59' },
      { label: 'Почта', value: '<a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>' },
      { label: 'Сайт', value: '<a href="https://conf2026.dushanbewaterprocess.org/" target="_blank" rel="noopener">conf2026.dushanbewaterprocess.org</a>' }
    ],
    topicsTitle: 'Дастури конференсия',
    topicsSubtitle: 'Ҳамаи он чизе, ки барои омодагӣ ва иштирок дар конференсия лозим аст.',
    topics: [
      {
        name: 'Бақайдгирӣ',
        text: 'Сарони давлат ва ҳукумати кишварҳои аъзои СММ, созмонҳои байналмилалӣ ва минтақавӣ, муассисаҳои молиявӣ, илмию таълимӣ, бахши хусусӣ, СҶҒ, ҷомеаи шаҳрвандӣ, созмонҳои ҳавзаҳои дарёю кӯлҳо, созмонҳои занон, ҷавонон ва кӯдакон ба иштирок даъват карда мешаванд.<br/><br/>Ҳайатҳои расмӣ бояд дар сайти конференсия бо пур кардани формаи маълумот дар бораи аъзоён, масир, парвоз, вақти омадан/рафтан ва акс (3\u00d74) ба қайд гиранд. Ин маълумот инчунин бояд тавассути каналҳои дипломатӣ ба <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> ва <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a> фиристода шавад.<br/><br/><strong>Мӯҳлати бақайдгирӣ: 1 майи 2026, 12:00 UTC.</strong>'
      },
      {
        name: 'Дастгирии визавӣ',
        text: 'Иштирокчиён бояд виза гиранд, ба истиснои шаҳрвандони кишварҳое, ки созишномаҳои дуҷониба/бисёрҷониба оид ба сафари бевиза доранд.<br/><br/>Котиботи конференсия бо дархости расмӣ мактуби дастгирии визаро пешниҳод мекунад. Дархостро ба <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> фиристед. <strong>Визаҳо барои иштирокчиёни конференсия ройгон дода мешаванд.</strong><br/><br/>Иштирокчиёне, ки мехоҳанд визаи электронӣ гиранд, метавонанд дар <a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a> ариза диҳанд (арзиш: 30 доллари ИМА).'
      },
      {
        name: 'Омадан ва рафтан',
        text: 'Барои гирифтани иҷозат тавассути каналҳои дипломатӣ барои истифодаи фазои ҳавоии Тоҷикистон ва нишастан дар Фурудгоҳи байналмилалии Душанбе, ёддошт бо аризаи пуркарда ба Шӯъбаи протоколи давлатӣ ба <a href="mailto:protocol@mfa.tj">protocol@mfa.tj</a> фиристед.<br/><br/>Меҳмонони олирутба ва ҳамроҳонашон аз ҷониби ташкилотчиён дар толорҳои CIP ва VIP пешвоз гирифта мешаванд.'
      },
      {
        name: 'Аккредитатсияи ВАО',
        text: 'Журналистони хориҷӣ, аз ҷумла намояндагони матбуоти сарони ҳайатҳо, бояд аз ВКХ аккредитатсия гиранд.<br/><br/>Маълумотро то <strong>1 майи 2026</strong> ба суроғаҳои <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a> ва <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a> фиристед.<br/><br/>Роҳ додани намояндагони ВАО ба чорабиниҳои расмӣ мувофиқи рӯйхат ва ҳуҷҷати шахсият анҷом дода мешавад.'
      },
      {
        name: 'Нақлиёти маҳаллӣ',
        text: 'Барои ҳайатҳо нақлиёт ҳангоми омадан/рафтан аз/ба фурудгоҳ ташкил карда мешавад. Автобусҳои маршрутӣ делегатҳоро аз меҳмонхонаҳо ба маҳалли конференсия ва баръакс мерасонанд.'
      },
      {
        name: 'Забонҳо',
        text: 'Забонҳои корӣ \u2014 <strong>тоҷикӣ, англисӣ ва русӣ</strong> бо тарҷумаи ҳамзамон. Агар сарвари ҳайат хоҳад бо забони дигар баромад кунад, бояд тарҷумони худро таъмин кунад.'
      },
      {
        name: 'Формати конференсия',
        text: 'Конференсия дар формати бисёрҷониба баргузор мешавад бо иштироки намояндагони сатҳи баланди кишварҳои аъзои СММ, сохторҳои СММ, созмонҳои байналмилалӣ, институтҳои молиявӣ, бахши хусусӣ, ҷомеаи илмӣ, ҷомеаи шаҳрвандӣ ва мақомоти маҳаллӣ. <strong>Конференсия ба таври ҳузурӣ баргузор мешавад.</strong>'
      },
      {
        name: 'Чорабиниҳои фарҳангӣ',
        text: 'Дар доираи конференсия чорабиниҳои гуногуни фарҳангӣ пешбинӣ шудааст, ки дар онҳо иштирокчиён бо шаклҳои гуногуни мероси фарҳангии қадимаи мардуми тоҷик шинос мешаванд. Гурӯҳҳои мусиқии мардумӣ меҳмононро бо баромадҳои дилкаш хурсанд мекунанд ва иштирокчиён бо таоми миллии тоҷик шинос мешаванд.'
      },
      {
        name: 'Намоишгоҳҳо',
        text: 'Иштирокчиёни конференсия метавонанд намоишгоҳи мавзӯи обиро, ки дар маҷмааи давлатии \u00abКохи Сомон\u00bb ташкил карда шудааст, тамошо кунанд.'
      },
      {
        name: 'Авиарейсҳо',
        text: 'Парвозҳои мунтазами байналмилалӣ аз/ба Фурудгоҳи байналмилалии Душанбе аз шаҳрҳои калон: Алмаато, Дубай, Истанбул, Ҷидда, Мюнхен, Маскав, Санкт-Петербург, Теҳрон, Машҳад, Деҳлии Нав, Кувейт, Боку, Урумчи, Тошканд ва ғ. иҷро мешаванд.<br/><br/>Маълумоти бештар дар <a href="http://airport.tj" target="_blank" rel="noopener">airport.tj</a> дастрас аст.'
      }
    ],
    factsTitle: 'Маълумоти мухтасар',
    facts: [
      { label: 'Ҳаво', value: '25\u201335\u00b0C', note: 'Хушк ва гарм дар май' },
      { label: 'Минтақаи вақт', value: 'GMT+5', note: 'Душанбе' },
      { label: 'Асъор', value: 'Сомонӣ (TJS)', note: 'Мубодила дар бонкҳо, меҳмонхонаҳо' },
      { label: 'Тиббӣ', value: 'Ёрии аввалин', note: 'Дар макон ва меҳмонхонаҳо' }
    ],
    closingTitle: 'Маълумоти бештар лозим аст?',
    closingText: 'Ҳамаи маълумоти зарурӣ дар бораи конференсия дар сайти расмӣ дастрас аст. Барои саволҳои иловагӣ ба Котиботи конференсия муроҷиат кунед.'
  }
}
