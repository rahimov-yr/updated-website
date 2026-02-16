import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import '../../styles/goals-infographic.css'

export default function Goals() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('conference-goals', {
    title: { ru: 'Цели', en: 'Goals', tj: 'Мақсадҳо' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'conference_goals')

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

      {/* Objectives Card */}
      <section className="goals-section">
        <div className="goals-section__pattern"></div>
        <div className="container">
          <div className="goals-card">
            <div className="goals-card__header">
              <h2 className="goals-card__title">{t.mainObjectiveTitle}</h2>
            </div>
            <div className="goals-card__body">
              <p className="goals-card__text">{t.mainObjective}</p>
              <div className="goals-card__separator"></div>
              <h3 className="goals-card__subtitle">{t.additionalAimsTitle}</h3>
              <p className="goals-card__text">{t.additionalAims}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="goals-focus">
        <div className="goals-focus__pattern"></div>
        <div className="container">
          <h2 className="goals-focus__title">{t.focusTitle}</h2>

          <div className="goals-steps">
            {t.focusAreas.map((area, i) => (
              <div className="goals-steps__item" key={i}>
                <span className="goals-steps__num">0{i + 1}</span>
                <p className="goals-steps__text">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const translations = {
  en: {
    mainObjectiveTitle: 'Promoting Progress Towards the Water Action Decade',
    mainObjective: 'The main objective of the Fourth Dushanbe Conference on the Water Action Decade is to promote progress towards achieving the goals of the International Decade for Action "Water for Sustainable Development", 2018\u20132028.',
    additionalAimsTitle: 'Additional Aims',
    additionalAims: 'In addition, the Conference aims to promote sustainable development and integrated water resources management in order to achieve social, economic and environmental outcomes; to support the implementation and advancement of relevant programmes and projects; and to enhance cooperation and partnerships at all levels to attain internationally agreed water-related goals and targets, including those set out in the 2030 Agenda for Sustainable Development.',
    focusTitle: 'The Fourth Dushanbe Conference on the Water Action Decade is intended to serve as:',
    focusAreas: [
      'To serve as a key preparatory meeting for the 2026 UN Water Conference co-hosted by the Republic of Senegal and the United Arab Emirates.',
      'To showcase scalable solutions, strengthen cooperation and forge partnerships to address priority water-related opportunities and challenges.',
      'To bolster implementation of the Water Action Decade, building on the four work streams of the United Nations Secretary-General\u2019s Action Plan for the Water Action Decade 2018\u20132028.',
      'To conduct an informal consultation with stakeholders for the UN 2028 Water Conference that will serve as the final comprehensive review of the Water Action Decade 2018\u20132028 and an initial discussion on the way forward, including post-2030.'
    ]
  },
  ru: {
    mainObjectiveTitle: 'Содействие прогрессу Десятилетия водных действий',
    mainObjective: 'Основная цель Четвёртой Душанбинской конференции по Десятилетию водных действий — содействие прогрессу в достижении целей Международного десятилетия действий «Вода для устойчивого развития», 2018–2028 годы.',
    additionalAimsTitle: 'Дополнительные цели',
    additionalAims: 'Кроме того, Конференция направлена на содействие устойчивому развитию и комплексному управлению водными ресурсами для достижения социальных, экономических и экологических результатов; на поддержку реализации и продвижения соответствующих программ и проектов; а также на укрепление сотрудничества и партнёрств на всех уровнях для достижения международно согласованных целей и задач в области водных ресурсов, включая те, которые изложены в Повестке дня в области устойчивого развития на период до 2030 года.',
    focusTitle: 'Четвёртая Душанбинская конференция по Десятилетию водных действий призвана:',
    focusAreas: [
      'Стать ключевым подготовительным мероприятием к Конференции ООН по водным ресурсам 2026 года, организуемой совместно Республикой Сенегал и Объединёнными Арабскими Эмиратами.',
      'Представить масштабируемые решения, укрепить сотрудничество и создать партнёрства для решения приоритетных задач и использования возможностей в области водных ресурсов.',
      'Содействовать реализации Десятилетия водных действий, опираясь на четыре направления работы Плана действий Генерального секретаря ООН по Десятилетию водных действий 2018–2028.',
      'Провести неформальные консультации с заинтересованными сторонами по подготовке к Конференции ООН по водным ресурсам 2028 года, которая станет заключительным всесторонним обзором Десятилетия водных действий 2018–2028 и начальным обсуждением дальнейших шагов, включая период после 2030 года.'
    ]
  },
  tj: {
    mainObjectiveTitle: 'Мусоидат ба пешрафти Даҳсолаи амалиёти обӣ',
    mainObjective: 'Мақсади асосии Конфронси чоруми Душанбе оид ба Даҳсолаи амалиёти обӣ ин мусоидат ба пешрафт дар ноил шудан ба ҳадафҳои Даҳсолаи байналмилалии амал «Об барои рушди устувор», солҳои 2018–2028 мебошад.',
    additionalAimsTitle: 'Мақсадҳои иловагӣ',
    additionalAims: 'Илова бар ин, Конфронс ба мусоидат дар рушди устувор ва идоракунии ҳамаҷонибаи захираҳои обӣ барои ноил шудан ба натиҷаҳои иҷтимоӣ, иқтисодӣ ва экологӣ; ба дастгирии татбиқ ва пешбурди барномаҳо ва лоиҳаҳои дахлдор; ва ба мустаҳкам кардани ҳамкорӣ ва шарикӣ дар ҳамаи сатҳҳо барои ноил шудан ба ҳадафҳо ва вазифаҳои байналмилалии мувофиқашуда дар соҳаи об, аз ҷумла онҳое, ки дар Барномаи рушди устувор то соли 2030 пешбинӣ шудаанд, нигаронида шудааст.',
    focusTitle: 'Конфронси чоруми Душанбе оид ба Даҳсолаи амалиёти обӣ бояд:',
    focusAreas: [
      'Ҳамчун ҷаласаи асосии тайёрӣ барои Конфронси СММ оид ба об дар соли 2026, ки аз ҷониби Ҷумҳурии Сенегал ва Аморати Муттаҳидаи Арабӣ баргузор мегардад, хидмат кунад.',
      'Роҳҳои миқёспазирро намоиш диҳад, ҳамкориро мустаҳкам кунад ва шарикиҳо барои ҳалли масъалаҳо ва истифодаи имконоти афзалиятноки обӣ бунёд кунад.',
      'Татбиқи Даҳсолаи амалиёти обиро, бо такя ба чор самти кории Нақшаи амалиёти Котиби генералии СММ оид ба Даҳсолаи амалиёти обӣ 2018–2028, мустаҳкам кунад.',
      'Машваратҳои ғайрирасмӣ бо ҷонибҳои манфиатдор оид ба Конфронси СММ оид ба об дар соли 2028, ки ҳамчун баррасии ниҳоии ҳамаҷонибаи Даҳсолаи амалиёти обӣ 2018–2028 ва муҳокимаи ибтидоии роҳи пеш, аз ҷумла пас аз соли 2030, хидмат хоҳад кард, гузаронад.'
    ]
  }
}
