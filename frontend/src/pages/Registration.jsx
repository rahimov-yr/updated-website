import { useState, useEffect } from 'react'
import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import { Mail, Handshake, Copy, Check } from 'lucide-react'
import '../styles/registration-infographic.css'

const DEADLINE = new Date('2026-05-01T12:00:00Z').getTime()

function useCountdown() {
  const [remaining, setRemaining] = useState(() => {
    const diff = DEADLINE - Date.now()
    return diff > 0 ? diff : 0
  })

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      const diff = DEADLINE - Date.now()
      setRemaining(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(id)
  }, [remaining > 0])

  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)

  return { days, hours, minutes, seconds, expired: remaining <= 0 }
}

export default function Registration() {
  const { language } = useLanguage()
  const { loading } = useSettings()
  const countdown = useCountdown()
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('registration@mfa.tj').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const banner = usePageBanner('registration', {
    title: { ru: 'Регистрация', en: 'Registration', tj: 'Бақайдгирӣ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'registration_page')

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
      <section className="reg-intro">
        <div className="reg-intro__pattern"></div>
        <div className="container">
          <p className="reg-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Steps - Timeline */}
      <section className="reg-steps">
        <div className="reg-steps__pattern"></div>
        <div className="container">
          <h2 className="reg-steps__title">{t.stepsTitle}</h2>
          <p className="reg-steps__subtitle">{t.stepsSubtitle}</p>
          <div className="reg-timeline">
            {t.steps.map((step, i) => (
              <div className="reg-timeline__item" key={i}>
                <div className="reg-timeline__marker">
                  <span className="reg-timeline__num">{i + 1}</span>
                </div>
                <div className="reg-timeline__card">
                  <h3 className="reg-timeline__heading">{step.title}</h3>
                  <p className="reg-timeline__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadline - Gradient banner */}
      <section className="reg-deadline">
        <div className="container">
          <div className="reg-banner">
            <div className="reg-banner__pattern"></div>
            <div className="reg-banner__content">
              <div className="reg-banner__label">
                <Handshake size={13} />
                {t.deadlineTag}
              </div>
              <h2 className="reg-banner__title">{t.deadlineTitle}</h2>
              {!countdown.expired && (
                <div className="reg-countdown">
                  <div className="reg-countdown__unit">
                    <span className="reg-countdown__num">{String(countdown.days).padStart(2, '0')}</span>
                    <span className="reg-countdown__label">{t.countdownDays}</span>
                  </div>
                  <span className="reg-countdown__sep">:</span>
                  <div className="reg-countdown__unit">
                    <span className="reg-countdown__num">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="reg-countdown__label">{t.countdownHours}</span>
                  </div>
                  <span className="reg-countdown__sep">:</span>
                  <div className="reg-countdown__unit">
                    <span className="reg-countdown__num">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="reg-countdown__label">{t.countdownMinutes}</span>
                  </div>
                  <span className="reg-countdown__sep">:</span>
                  <div className="reg-countdown__unit">
                    <span className="reg-countdown__num">{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="reg-countdown__label">{t.countdownSeconds}</span>
                  </div>
                </div>
              )}
              <p className="reg-banner__text">{t.deadlineText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Cards with left accents */}
      <section className="reg-categories">
        <div className="reg-categories__pattern"></div>
        <div className="container">
          <h2 className="reg-categories__title">{t.catTitle}</h2>
          <p className="reg-categories__subtitle">{t.catSubtitle}</p>
          <div className="reg-cat-grid">
            {t.categories.map((cat, i) => (
              <div className={`reg-cat reg-cat--${catColors[i]}`} key={i}>
                <span className="reg-cat__watermark">0{i + 1}</span>
                <h3 className="reg-cat__name">{cat.title}</h3>
                <p className="reg-cat__desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="reg-contact">
        <div className="container">
          <div className="reg-contact__card">
            <div className="reg-contact__icon"><Mail size={20} /></div>
            <div className="reg-contact__body">
              <h3 className="reg-contact__title">{t.contactTitle}</h3>
              <p className="reg-contact__text">{t.contactLabel}</p>
              <div className="reg-contact__email-row">
                <a href="mailto:registration@mfa.tj" className="reg-contact__email">registration@mfa.tj</a>
                <button className={`reg-contact__copy ${copied ? 'reg-contact__copy--done' : ''}`} onClick={copyEmail} title={t.copyLabel}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? t.copiedLabel : t.copyLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

const catColors = ['navy', 'teal']

const translations = {
  en: {
    introText: 'Registration for the High-Level International Conference on the International Decade for Action "Water for Sustainable Development", 2018–2028.',
    stepsTitle: 'How to Register',
    stepsSubtitle: 'Follow these steps to complete your conference registration.',
    steps: [
      {
        title: 'Submit Registration Form',
        desc: 'Complete the online registration form with your personal details, delegation information, and travel arrangements.'
      },
      {
        title: 'Receive Confirmation',
        desc: 'The organizing committee will review your application and send confirmation with your registration status.'
      },
      {
        title: 'Collect Accreditation',
        desc: 'Upon arrival at the conference venue, collect your accreditation badge at the registration desk.'
      }
    ],
    deadlineTag: 'Important Deadline',
    deadlineTitle: 'Registration Closes 1 May 2026',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Seconds',
    deadlineText: 'All registration applications must be submitted by 1 May 2026 at 12:00 UTC. Early registration is strongly recommended to ensure timely processing of your accreditation and logistical arrangements.',
    catTitle: 'Participant Categories',
    catSubtitle: 'Registration is open for the following categories of participants.',
    categories: [
      {
        title: 'Official Delegates',
        desc: 'Representatives of governments, international organizations, and official delegations participating in the conference.'
      },
      {
        title: 'Observers & Experts',
        desc: 'Representatives of NGOs, academic institutions, private sector, and independent experts in the water sector.'
      }
    ],
    contactTitle: 'Registration Support',
    contactLabel: 'For questions regarding registration, please contact:',
    copyLabel: 'Copy',
    copiedLabel: 'Copied!'
  },
  ru: {
    introText: 'Регистрация на Международную конференцию высокого уровня, посвящённую Международному десятилетию действий «Вода для устойчивого развития», 2018–2028.',
    stepsTitle: 'Как зарегистрироваться',
    stepsSubtitle: 'Следуйте этим шагам для завершения регистрации на конференцию.',
    steps: [
      {
        title: 'Заполните форму регистрации',
        desc: 'Заполните онлайн-форму регистрации, указав ваши личные данные, информацию о делегации и условия поездки.'
      },
      {
        title: 'Получите подтверждение',
        desc: 'Оргкомитет рассмотрит вашу заявку и направит подтверждение с информацией о статусе регистрации.'
      },
      {
        title: 'Получите аккредитацию',
        desc: 'По прибытии на место проведения конференции получите бейдж аккредитации на стойке регистрации.'
      }
    ],
    deadlineTag: 'Важный срок',
    deadlineTitle: 'Регистрация закрывается 1 мая 2026',
    countdownDays: 'Дней',
    countdownHours: 'Часов',
    countdownMinutes: 'Минут',
    countdownSeconds: 'Секунд',
    deadlineText: 'Все заявки на регистрацию должны быть поданы до 1 мая 2026 года в 12:00 UTC. Ранняя регистрация настоятельно рекомендуется для своевременной обработки аккредитации и организационных вопросов.',
    catTitle: 'Категории участников',
    catSubtitle: 'Регистрация открыта для следующих категорий участников.',
    categories: [
      {
        title: 'Официальные делегаты',
        desc: 'Представители правительств, международных организаций и официальных делегаций, участвующих в конференции.'
      },
      {
        title: 'Наблюдатели и эксперты',
        desc: 'Представители НПО, академических учреждений, частного сектора и независимые эксперты в области водных ресурсов.'
      }
    ],
    contactTitle: 'Поддержка регистрации',
    contactLabel: 'По вопросам регистрации обращайтесь:',
    copyLabel: 'Копировать',
    copiedLabel: 'Скопировано!'
  },
  tj: {
    introText: 'Бақайдгирӣ ба Конференсияи байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор», 2018–2028.',
    stepsTitle: 'Чӣ тавр бақайд гирифтан мумкин аст',
    stepsSubtitle: 'Барои анҷом додани бақайдгирӣ ба конференсия ин қадамҳоро иҷро кунед.',
    steps: [
      {
        title: 'Формаи бақайдгириро пур кунед',
        desc: 'Формаи бақайдгирии онлайнро бо маълумоти шахсӣ, маълумот дар бораи ҳайат ва шароити сафар пур кунед.'
      },
      {
        title: 'Тасдиқнома гиред',
        desc: 'Кумитаи ташкилӣ аризаи шуморо баррасӣ мекунад ва тасдиқномаро бо маълумот дар бораи ҳолати бақайдгирӣ мефиристад.'
      },
      {
        title: 'Аккредитатсия гиред',
        desc: 'Ҳангоми воридшавӣ ба ҷойи баргузории конференсия нишони аккредитатсияро дар мизи бақайдгирӣ гиред.'
      }
    ],
    deadlineTag: 'Мӯҳлати муҳим',
    deadlineTitle: 'Бақайдгирӣ 1 майи 2026 баста мешавад',
    countdownDays: 'Рӯз',
    countdownHours: 'Соат',
    countdownMinutes: 'Дақиқа',
    countdownSeconds: 'Сония',
    deadlineText: 'Ҳамаи аризаҳои бақайдгирӣ бояд то 1 майи 2026, соати 12:00 UTC пешниҳод карда шаванд. Бақайдгирии барвақт барои коркарди сари вақти аккредитатсия ва масъалаҳои ташкилӣ тавсия дода мешавад.',
    catTitle: 'Категорияҳои иштирокчиён',
    catSubtitle: 'Бақайдгирӣ барои категорияҳои зерини иштирокчиён кушода аст.',
    categories: [
      {
        title: 'Намояндагони расмӣ',
        desc: 'Намояндагони ҳукуматҳо, созмонҳои байналмилалӣ ва ҳайатҳои расмии иштирокчии конференсия.'
      },
      {
        title: 'Мушоҳидон ва коршиносон',
        desc: 'Намояндагони СҶТ, муассисаҳои илмӣ, бахши хусусӣ ва коршиносони мустақил дар соҳаи об.'
      }
    ],
    contactTitle: 'Дастгирии бақайдгирӣ',
    contactLabel: 'Барои саволҳо оид ба бақайдгирӣ муроҷиат кунед:',
    copyLabel: 'Нусха',
    copiedLabel: 'Нусха шуд!'
  }
}
