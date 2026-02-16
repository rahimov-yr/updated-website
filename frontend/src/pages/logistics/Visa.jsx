import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Stamp, FileCheck, Send, Mail,
  BadgeCheck, PlaneLanding, Building2, Globe
} from 'lucide-react'
import '../../styles/visa-infographic.css'

export default function Visa() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('logistics-visa', {
    title: { ru: 'Виза в Таджикистан', en: 'Visa to Tajikistan', tj: 'Раводиди Тоҷикистон' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_visa')

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

      {/* Process Flow */}
      <section className="vis-flow">
        <div className="vis-flow__pattern"></div>
        <div className="container">
          <div className="vis-flow__header">
            <h2 className="vis-flow__title">{t.flowTitle}</h2>
            <p className="vis-flow__subtitle">{t.flowSubtitle}</p>
          </div>
          <div className="vis-flow__list">
            {t.steps.map((step, i) => (
              <div className={`vis-step vis-step--${i + 1}`} key={i}>
                <div className="vis-step__marker">{stepIcons[i]}</div>
                <div className="vis-step__content">
                  <h3 className="vis-step__name">{step.name}</h3>
                  <p className="vis-step__text" dangerouslySetInnerHTML={{ __html: step.text }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout Highlights */}
      <section className="vis-callouts">
        <div className="container">
          <div className="vis-callouts__grid">
            {t.callouts.map((c, i) => (
              <div className={`vis-callout vis-callout--${calloutVariants[i]}`} key={i}>
                <div className="vis-callout__icon">{calloutIcons[i]}</div>
                <h3 className="vis-callout__title">{c.title}</h3>
                <p className="vis-callout__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Visa Card */}
      <section className="vis-evisa">
        <div className="container">
          <div className="vis-evisa__card">
            <div className="vis-evisa__card-pattern"></div>
            <div className="vis-evisa__body">
              <p className="vis-evisa__badge">{t.evisaBadge}</p>
              <h2 className="vis-evisa__title">{t.evisaTitle}</h2>
              <p className="vis-evisa__text">{t.evisaText}</p>
              <div className="vis-evisa__details">
                {t.evisaDetails.map((d, i) => (
                  <div className="vis-evisa__detail" key={i}>
                    <p className="vis-evisa__detail-label">{d.label}</p>
                    <p className="vis-evisa__detail-value" dangerouslySetInnerHTML={{ __html: d.value }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="vis-contact">
        <div className="container">
          <div className="vis-contact__card">
            <div className="vis-contact__icon"><Mail size={20} /></div>
            <div className="vis-contact__body">
              <h3 className="vis-contact__title">{t.contactTitle}</h3>
              <p className="vis-contact__text" dangerouslySetInnerHTML={{ __html: t.contactText }} />
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="vis-closing">
        <div className="vis-closing__pattern"></div>
        <div className="container">
          <h2 className="vis-closing__title">{t.closingTitle}</h2>
          <p className="vis-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const stepIcons = [
  <FileCheck size={20} key="s0" />,
  <Send size={20} key="s1" />,
  <Stamp size={20} key="s2" />
]

const calloutVariants = ['free', 'arrival', 'embassy', 'exempt']

const calloutIcons = [
  <BadgeCheck size={20} key="c0" />,
  <PlaneLanding size={20} key="c1" />,
  <Building2 size={20} key="c2" />,
  <Globe size={20} key="c3" />
]

const translations = {
  en: {
    stampLabel: 'Visa Information',
    introTitle: 'Visa to Tajikistan',
    introText: 'To travel to Tajikistan, participants are required to obtain a visa, unless they are citizens of countries that have bilateral or multilateral agreements with Tajikistan permitting visa-free entry.',
    flowTitle: 'How to Obtain a Visa',
    flowSubtitle: 'Follow these steps to secure your conference visa.',
    steps: [
      {
        name: 'Check if you need a visa',
        text: 'Citizens of certain countries can enter Tajikistan without a visa or obtain one on arrival at Dushanbe International Airport. Check whether your country has a bilateral or multilateral visa-free agreement with Tajikistan.'
      },
      {
        name: 'Request a Visa Support Letter',
        text: 'If a visa is required, the Conference Secretariat will provide a Visa Support Letter upon official request. Send your request to <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>.'
      },
      {
        name: 'Obtain your visa',
        text: 'Citizens of certain countries can obtain a visa upon arrival at Dushanbe International Airport. All other participants must obtain a visa from the Embassy or Consular section of the Republic of Tajikistan abroad before departure.'
      }
    ],
    callouts: [
      { title: 'Free of Charge', desc: 'Visas for Conference participants are issued free of charge.' },
      { title: 'Visa on Arrival', desc: 'Citizens of certain countries can obtain a visa upon arrival at Dushanbe International Airport.' },
      { title: 'Embassy / Consulate', desc: 'Citizens of other countries must obtain a visa from a Tajik diplomatic mission before departure.' },
      { title: 'Visa-Free Countries', desc: 'Citizens of countries with bilateral or multilateral agreements can enter without a visa.' }
    ],
    evisaBadge: 'E-Visa Option',
    evisaTitle: 'Electronic Visa (E-Visa)',
    evisaText: 'Participants from certain countries who are eligible for visa-free entry or granted a visa on arrival, but wish to have an electronic visa prior to departure, may apply online.',
    evisaDetails: [
      { label: 'Cost', value: '30 USD' },
      { label: 'Website', value: '<a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a>' },
      { label: 'Type', value: 'Electronic' }
    ],
    contactTitle: 'Visa Support Requests',
    contactText: 'Send your request for a Visa Support Letter to the Conference Secretariat at <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>.',
    closingTitle: 'Plan Your Travel',
    closingText: 'Ensure you check visa requirements early and contact the Conference Secretariat for any assistance with your travel documentation.'
  },
  ru: {
    stampLabel: 'Визовая информация',
    introTitle: 'Виза в Таджикистан',
    introText: 'Для поездки в Таджикистан участникам необходимо получить визу, за исключением граждан стран, имеющих двусторонние или многосторонние соглашения с Таджикистаном о безвизовом въезде.',
    flowTitle: 'Как получить визу',
    flowSubtitle: 'Следуйте этим шагам для получения визы конференции.',
    steps: [
      {
        name: 'Проверьте необходимость визы',
        text: 'Граждане ряда стран могут въезжать в Таджикистан без визы или получить визу по прибытии в Международном аэропорту Душанбе. Проверьте, имеет ли ваша страна двустороннее или многостороннее соглашение о безвизовом въезде с Таджикистаном.'
      },
      {
        name: 'Запросите письмо визовой поддержки',
        text: 'Если виза необходима, Секретариат конференции предоставит письмо визовой поддержки по официальному запросу. Направьте запрос на <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>.'
      },
      {
        name: 'Получите визу',
        text: 'Граждане ряда стран могут получить визу по прибытии в аэропорту Душанбе. Остальным участникам необходимо получить визу в посольстве или консульском отделе Республики Таджикистан за рубежом до отъезда.'
      }
    ],
    callouts: [
      { title: 'Бесплатно', desc: 'Визы для участников конференции выдаются бесплатно.' },
      { title: 'Виза по прибытии', desc: 'Граждане ряда стран могут получить визу по прибытии в Международном аэропорту Душанбе.' },
      { title: 'Посольство / Консульство', desc: 'Граждане других стран должны получить визу в дипломатическом представительстве Таджикистана до отъезда.' },
      { title: 'Безвизовые страны', desc: 'Граждане стран с двусторонними или многосторонними соглашениями могут въезжать без визы.' }
    ],
    evisaBadge: 'Электронная виза',
    evisaTitle: 'Электронная виза (E-Visa)',
    evisaText: 'Участники из стран, имеющие право на безвизовый въезд или визу по прибытии, но желающие получить электронную визу до отъезда, могут подать заявку онлайн.',
    evisaDetails: [
      { label: 'Стоимость', value: '30 долл. США' },
      { label: 'Сайт', value: '<a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a>' },
      { label: 'Тип', value: 'Электронная' }
    ],
    contactTitle: 'Запрос визовой поддержки',
    contactText: 'Направьте запрос на получение письма визовой поддержки в Секретариат конференции по адресу <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a>.',
    closingTitle: 'Планируйте поездку',
    closingText: 'Заблаговременно уточните визовые требования и обращайтесь в Секретариат конференции за помощью с оформлением проездных документов.'
  },
  tj: {
    stampLabel: 'Маълумоти визавӣ',
    introTitle: 'Раводиди Тоҷикистон',
    introText: 'Барои сафар ба Тоҷикистон иштирокчиён бояд виза гиранд, ба истиснои шаҳрвандони кишварҳое, ки созишномаҳои дуҷониба ё бисёрҷониба бо Тоҷикистон оид ба сафари бевиза доранд.',
    flowTitle: 'Чӣ тавр виза гирифтан мумкин аст',
    flowSubtitle: 'Ин қадамҳоро барои гирифтани визаи конференсия иҷро кунед.',
    steps: [
      {
        name: 'Зарурати визаро санҷед',
        text: 'Шаҳрвандони як қатор кишварҳо метавонанд бе виза ба Тоҷикистон ворид шаванд ё визаро ҳангоми расидан дар Фурудгоҳи байналмилалии Душанбе гиранд. Санҷед, ки кишвари шумо созишномаи дуҷониба ё бисёрҷониба оид ба сафари бевиза бо Тоҷикистон дорад ё не.'
      },
      {
        name: 'Мактуби дастгирии визаро дархост кунед',
        text: 'Агар виза зарур бошад, Котиботи конференсия бо дархости расмӣ мактуби дастгирии визаро пешниҳод мекунад. Дархостро ба <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> фиристед.'
      },
      {
        name: 'Визаро гиред',
        text: 'Шаҳрвандони як қатор кишварҳо метавонанд визаро ҳангоми расидан дар фурудгоҳи Душанбе гиранд. Дигар иштирокчиён бояд визаро аз сафоратхона ё бахши консулии Ҷумҳурии Тоҷикистон дар хориҷа пеш аз сафар гиранд.'
      }
    ],
    callouts: [
      { title: 'Ройгон', desc: 'Визаҳо барои иштирокчиёни конференсия ройгон дода мешаванд.' },
      { title: 'Виза ҳангоми расидан', desc: 'Шаҳрвандони як қатор кишварҳо метавонанд визаро ҳангоми расидан дар Фурудгоҳи байналмилалии Душанбе гиранд.' },
      { title: 'Сафоратхона / Консулгарӣ', desc: 'Шаҳрвандони дигар кишварҳо бояд визаро аз намояндагии дипломатии Тоҷикистон пеш аз сафар гиранд.' },
      { title: 'Кишварҳои бевиза', desc: 'Шаҳрвандони кишварҳое, ки созишномаҳои дуҷониба ё бисёрҷониба доранд, метавонанд бе виза ворид шаванд.' }
    ],
    evisaBadge: 'Визаи электронӣ',
    evisaTitle: 'Визаи электронӣ (E-Visa)',
    evisaText: 'Иштирокчиёне, ки ҳуқуқи сафари бевиза ё визаи ҳангоми расидан доранд, вале мехоҳанд визаи электронӣ пеш аз сафар гиранд, метавонанд бо таври онлайн ариза диҳанд.',
    evisaDetails: [
      { label: 'Арзиш', value: '30 доллари ИМА' },
      { label: 'Сайт', value: '<a href="https://www.evisa.tj" target="_blank" rel="noopener">www.evisa.tj</a>' },
      { label: 'Навъ', value: 'Электронӣ' }
    ],
    contactTitle: 'Дархости дастгирии визавӣ',
    contactText: 'Дархости мактуби дастгирии визаро ба Котиботи конференсия бо суроғаи <a href="mailto:secretariatconf2026@mfa.tj">secretariatconf2026@mfa.tj</a> фиристед.',
    closingTitle: 'Сафари худро ба нақша гиред',
    closingText: 'Талаботи визавиро пешакӣ санҷед ва барои кӯмак бо ҳуҷҷатҳои сафарӣ ба Котиботи конференсия муроҷиат кунед.'
  }
}
