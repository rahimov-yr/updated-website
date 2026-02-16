import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Hotel, CalendarCheck, CreditCard, Users, Info,
  PlaneLanding, Bus
} from 'lucide-react'
import '../../styles/accommodation-infographic.css'

export default function Accommodation() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('logistics-accommodation', {
    title: { ru: 'Размещение в гостинице', en: 'Hotel Accommodation', tj: 'Ҷойгиршавӣ дар меҳмонхона' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_accommodation')

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
      <section className="acc-intro">
        <div className="acc-intro__pattern"></div>
        <div className="container">
          <p className="acc-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Key Info Highlights */}
      <section className="acc-highlights">
        <div className="container">
          <div className="acc-highlights__grid">
            {t.highlights.map((h, i) => (
              <div className={`acc-highlight acc-highlight--${highlightKeys[i]}`} key={i}>
                <div className="acc-highlight__icon">{highlightIcons[i]}</div>
                <h3 className="acc-highlight__title">{h.title}</h3>
                <p className="acc-highlight__desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="acc-discount">
        <div className="acc-discount__band">
          <div className="acc-discount__band-pattern"></div>
          <div className="container">
            <div className="acc-discount__value">
              <p className="acc-discount__value-label">{t.discountLabel}</p>
              <div className="acc-discount__value-block">
                <p className="acc-discount__value-pct">20–30%</p>
                <p className="acc-discount__value-sub">{t.discountSub}</p>
              </div>
            </div>
            <div className="acc-discount__info">
              <h2 className="acc-discount__info-title">{t.discountTitle}</h2>
              <p className="acc-discount__info-text">{t.discountText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="acc-transport">
        <div className="acc-transport__pattern"></div>
        <div className="container">
          <div className="acc-transport__header">
            <h2 className="acc-transport__title">{t.transportTitle}</h2>
            <p className="acc-transport__subtitle">{t.transportSubtitle}</p>
          </div>
          <div className="acc-transport__cards">
            {t.transport.map((card, i) => (
              <div className={`acc-transport__card acc-transport__card--${transportKeys[i]}`} key={i}>
                <div className="acc-transport__card-icon">{transportIcons[i]}</div>
                <h3 className="acc-transport__card-title">{card.title}</h3>
                <p className="acc-transport__card-text">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="acc-closing">
        <div className="container">
          <h2 className="acc-closing__title">{t.closingTitle}</h2>
          <p className="acc-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const highlightKeys = ['booking', 'cost', 'delegation', 'info']
const highlightIcons = [
  <CalendarCheck size={18} key="h0" />,
  <CreditCard size={18} key="h1" />,
  <Users size={18} key="h2" />,
  <Info size={18} key="h3" />
]

const transportKeys = ['airport', 'shuttle']
const transportIcons = [
  <PlaneLanding size={18} key="t0" />,
  <Bus size={18} key="t1" />
]

const translations = {
  en: {
    badgeLabel: 'Hotel Accommodation',
    introTitle: 'Accommodation',
    introText: 'Hotel booking and accommodation arrangements for participants of the High-Level International Conference on the International Decade for Action "Water for Sustainable Development", 2018–2028.',
    highlights: [
      {
        title: 'Booking Responsibility',
        desc: 'Hotel booking for participants is the responsibility of the relevant departments of the host country and the organizing committee.'
      },
      {
        title: 'Cost Coverage',
        desc: 'Accommodation costs for participants of official delegations are covered at their own expense or by the sending party.'
      },
      {
        title: 'Delegation Accommodation',
        desc: 'Heads of delegations and high-level officials will be accommodated in hotels pre-selected by the organizing committee.'
      },
      {
        title: 'Hotel Availability',
        desc: 'Dushanbe offers a range of international-standard hotels within close proximity to the conference venue.'
      }
    ],
    discountLabel: 'Discount',
    discountSub: 'Special Rate',
    discountTitle: 'Exclusive Hotel Discounts',
    discountText: 'Special discounted rates of 20–30% have been negotiated with partner hotels for all registered conference participants during the event period.',
    transportTitle: 'Transport Services',
    transportSubtitle: 'Complimentary transport is provided for conference participants.',
    transport: [
      {
        title: 'Airport Pickup',
        text: 'Shuttle buses will be available at Dushanbe International Airport to transport participants to their designated hotels upon arrival.'
      },
      {
        title: 'Hotel–Venue Shuttle',
        text: 'Regular shuttle bus services will operate between partner hotels and the conference venue throughout the event.'
      }
    ],
    closingTitle: 'Comfortable Stay',
    closingText: 'The organizing committee is committed to ensuring a comfortable and convenient stay for all conference participants in Dushanbe.'
  },
  ru: {
    badgeLabel: 'Размещение в гостинице',
    introTitle: 'Размещение',
    introText: 'Бронирование гостиниц и организация размещения участников Международной конференции высокого уровня, посвящённой Международному десятилетию действий «Вода для устойчивого развития», 2018–2028.',
    highlights: [
      {
        title: 'Бронирование',
        desc: 'Бронирование гостиниц для участников осуществляется соответствующими подразделениями принимающей страны и оргкомитетом.'
      },
      {
        title: 'Оплата проживания',
        desc: 'Расходы на проживание участников официальных делегаций покрываются за их собственный счёт или за счёт направляющей стороны.'
      },
      {
        title: 'Размещение делегаций',
        desc: 'Главы делегаций и высокопоставленные лица будут размещены в гостиницах, заранее выбранных оргкомитетом.'
      },
      {
        title: 'Гостиницы',
        desc: 'Душанбе предлагает широкий выбор гостиниц международного уровня в непосредственной близости от места проведения конференции.'
      }
    ],
    discountLabel: 'Скидка',
    discountSub: 'Специальный тариф',
    discountTitle: 'Эксклюзивные скидки',
    discountText: 'С партнёрскими гостиницами согласованы специальные скидки в размере 20–30% для всех зарегистрированных участников конференции на период мероприятия.',
    transportTitle: 'Транспортные услуги',
    transportSubtitle: 'Бесплатный транспорт предоставляется для участников конференции.',
    transport: [
      {
        title: 'Встреча в аэропорту',
        text: 'Автобусы-шаттлы будут доступны в Международном аэропорту Душанбе для доставки участников в назначенные гостиницы по прибытии.'
      },
      {
        title: 'Шаттл гостиница–площадка',
        text: 'Регулярное автобусное сообщение будет работать между партнёрскими гостиницами и местом проведения конференции в течение всего мероприятия.'
      }
    ],
    closingTitle: 'Комфортное пребывание',
    closingText: 'Оргкомитет стремится обеспечить комфортное и удобное пребывание всех участников конференции в Душанбе.'
  },
  tj: {
    badgeLabel: 'Ҷойгиршавӣ дар меҳмонхона',
    introTitle: 'Ҷойгиршавӣ',
    introText: 'Фармоиши меҳмонхонаҳо ва ташкили ҷойгиршавии иштирокчиёни Конференсияи байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор», 2018–2028.',
    highlights: [
      {
        title: 'Фармоиши меҳмонхона',
        desc: 'Фармоиши меҳмонхонаҳо барои иштирокчиён аз ҷониби шӯъбаҳои дахлдори кишвари мизбон ва кумитаи ташкилӣ анҷом дода мешавад.'
      },
      {
        title: 'Пардохти ҷойгиршавӣ',
        desc: 'Хароҷоти ҷойгиршавии иштирокчиёни ҳайатҳои расмӣ аз ҳисоби худашон ё аз ҷониби тарафи фиристанда пардохт мешавад.'
      },
      {
        title: 'Ҷойгиршавии ҳайатҳо',
        desc: 'Сарварони ҳайатҳо ва шахсони баландмартаба дар меҳмонхонаҳои пешакӣ интихобшудаи кумитаи ташкилӣ ҷойгир карда мешаванд.'
      },
      {
        title: 'Меҳмонхонаҳо',
        desc: 'Душанбе меҳмонхонаҳои сатҳи байналмилалиро дар наздикии ҷойи баргузории конференсия пешниҳод мекунад.'
      }
    ],
    discountLabel: 'Тахфиф',
    discountSub: 'Тарифи махсус',
    discountTitle: 'Тахфифҳои махсус',
    discountText: 'Бо меҳмонхонаҳои шарикӣ тахфифҳои махсуси 20–30% барои ҳамаи иштирокчиёни бақайдгирифташудаи конференсия дар давраи чорабинӣ мувофиқа шудааст.',
    transportTitle: 'Хадамоти нақлиёт',
    transportSubtitle: 'Нақлиёти ройгон барои иштирокчиёни конференсия пешниҳод мешавад.',
    transport: [
      {
        title: 'Пешвозӣ аз фурудгоҳ',
        text: 'Автобусҳои шаттл дар Фурудгоҳи байналмилалии Душанбе барои интиқоли иштирокчиён ба меҳмонхонаҳои таъиншуда ҳангоми воридшавӣ дастрас мебошанд.'
      },
      {
        title: 'Шаттл меҳмонхона–толор',
        text: 'Хадамоти мунтазами автобусҳои шаттл байни меҳмонхонаҳои шарикӣ ва ҷойи баргузории конференсия дар тамоми давраи чорабинӣ кор мекунад.'
      }
    ],
    closingTitle: 'Истиқомати роҳат',
    closingText: 'Кумитаи ташкилӣ ба таъмини истиқомати роҳат ва қулай барои ҳамаи иштирокчиёни конференсия дар Душанбе кӯшиш мекунад.'
  }
}
