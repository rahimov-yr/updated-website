import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import { Eye, Lightbulb, Handshake, FlaskConical } from 'lucide-react'
import '../styles/exhibition-infographic.css'

const objVariants = ['awareness', 'innovation', 'partnership', 'showcase']

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

      {/* Intro Section */}
      <section className="exh-intro">
        <div className="exh-intro__pattern"></div>
        <div className="container">
          <p className="exh-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="exh-objectives">
        <div className="exh-objectives__pattern"></div>
        <div className="container">
          <div className="exh-objectives__header">
            <h2 className="exh-objectives__title">{t.objTitle}</h2>
            <p className="exh-objectives__subtitle">{t.objSubtitle}</p>
          </div>
          <div className="exh-obj-grid">
            {t.objectives.map((obj, i) => (
              <div className={`exh-obj-card exh-obj-card--${objVariants[i]}`} key={i}>
                <div className="exh-obj-card__icon">{objIcons[i]}</div>
                <div className="exh-obj-card__body">
                  <h3 className="exh-obj-card__name">{obj.name}</h3>
                  <p className="exh-obj-card__desc">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section className="exh-participants">
        <div className="exh-participants__pattern"></div>
        <div className="container">
          <div className="exh-participants__header">
            <h2 className="exh-participants__title">{t.partTitle}</h2>
            <p className="exh-participants__subtitle">{t.partSubtitle}</p>
          </div>
          <div className="exh-tags">
            {t.participants.map((p, i) => (
              <span className="exh-tag" key={i}>
                <span className="exh-tag__dot"></span>
                {p}
              </span>
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

      {/* Closing Banner */}
      <section className="exh-closing">
        <div className="exh-closing__pattern"></div>
        <div className="container">
          <h2 className="exh-closing__title">{t.closingTitle}</h2>
          <p className="exh-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const objIcons = [
  <Eye size={22} key="o0" />,
  <FlaskConical size={22} key="o1" />,
  <Lightbulb size={22} key="o2" />,
  <Handshake size={22} key="o3" />
]

const translations = {
  en: {
    introTitle: 'International Exhibition',
    introText: 'As part of the Fourth High-Level International Conference on the International Decade for Action "Water for Sustainable Development", 2018–2028, an International Exhibition will be held.',
    objTitle: 'Exhibition Objectives',
    objSubtitle: 'The exhibition aims to raise awareness and promote collaboration across key areas.',
    objectives: [
      { name: 'Raise Awareness', desc: 'Raise awareness of the measures undertaken and the progress achieved in the implementation of the International Decade for Action "Water for Sustainable Development".' },
      { name: 'Showcase Knowledge', desc: 'Showcase cutting-edge knowledge, best practices, and scientific achievements in the field of water resources.' },
      { name: 'Promote Innovation', desc: 'Promote the introduction of innovative approaches, methods, techniques, and technologies for sustainable water resources management.' },
      { name: 'Strengthen Partnerships', desc: 'Further strengthen and develop cooperation among stakeholders and facilitate the establishment of close business and partnership relations.' }
    ],
    partTitle: 'Who Is Invited',
    partSubtitle: 'A wide range of stakeholders are invited to participate in the exhibition.',
    participants: [
      'International Organizations',
      'Regional Organizations',
      'National Authorities',
      'Local Governments',
      'Non-Governmental Organizations',
      'Private Companies',
      'Academic Institutions',
      'Research Institutions'
    ],
    regTitle: 'How to Participate',
    regSteps: [
      'Complete the exhibition registration form provided by the Conference Secretariat.',
      'Submit the completed form to the Conference Secretariat by April 2026.',
      'The Secretariat will notify applicants of the acceptance of their request within five days following the submission of the application.'
    ],
    closingTitle: 'Join the Exhibition',
    closingText: 'Showcase your innovations and achievements in water resources management at the International Exhibition alongside leading organizations from around the world.'
  },
  ru: {
    introTitle: 'Международная выставка',
    introText: 'В рамках Четвёртой Международной конференции высокого уровня по Международному десятилетию действий «Вода для устойчивого развития», 2018–2028 гг., будет проведена Международная выставка.',
    objTitle: 'Цели выставки',
    objSubtitle: 'Выставка направлена на повышение осведомлённости и содействие сотрудничеству в ключевых областях.',
    objectives: [
      { name: 'Повышение осведомлённости', desc: 'Повышение осведомлённости о мерах, предпринятых и достигнутом прогрессе в реализации Международного десятилетия действий «Вода для устойчивого развития».' },
      { name: 'Демонстрация знаний', desc: 'Демонстрация передовых знаний, лучших практик и научных достижений в области водных ресурсов.' },
      { name: 'Продвижение инноваций', desc: 'Содействие внедрению инновационных подходов, методов, методик и технологий для устойчивого управления водными ресурсами.' },
      { name: 'Укрепление партнёрства', desc: 'Дальнейшее укрепление и развитие сотрудничества между заинтересованными сторонами и содействие установлению тесных деловых и партнёрских отношений.' }
    ],
    partTitle: 'Кто приглашён',
    partSubtitle: 'Широкий круг заинтересованных сторон приглашён к участию в выставке.',
    participants: [
      'Международные организации',
      'Региональные организации',
      'Национальные органы власти',
      'Местные органы власти',
      'Неправительственные организации',
      'Частные компании',
      'Академические учреждения',
      'Научно-исследовательские учреждения'
    ],
    regTitle: 'Как принять участие',
    regSteps: [
      'Заполните регистрационную форму выставки, предоставленную Секретариатом конференции.',
      'Направьте заполненную форму в Секретариат конференции до апреля 2026 года.',
      'Секретариат уведомит заявителей о принятии их заявки в течение пяти дней после подачи заявления.'
    ],
    closingTitle: 'Присоединяйтесь к выставке',
    closingText: 'Продемонстрируйте свои инновации и достижения в области управления водными ресурсами на Международной выставке наряду с ведущими организациями со всего мира.'
  },
  tj: {
    introTitle: 'Намоишгоҳи байналмилалӣ',
    introText: 'Дар доираи Конференсияи чоруми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор», 2018–2028, Намоишгоҳи байналмилалӣ баргузор мегардад.',
    objTitle: 'Ҳадафҳои намоишгоҳ',
    objSubtitle: 'Намоишгоҳ ба баланд бардоштани огоҳӣ ва мусоидат ба ҳамкорӣ дар самтҳои асосӣ равона шудааст.',
    objectives: [
      { name: 'Баланд бардоштани огоҳӣ', desc: 'Баланд бардоштани огоҳӣ дар бораи чораҳои андешидашуда ва пешрафти ба даст овардашуда дар татбиқи Даҳсолаи байналмилалии амал «Об барои рушди устувор».' },
      { name: 'Намоиши дониш', desc: 'Намоиши донишҳои пешрафта, таҷрибаи беҳтарин ва дастовардҳои илмӣ дар соҳаи захираҳои обӣ.' },
      { name: 'Пешбурди навоварӣ', desc: 'Мусоидат ба ҷорӣ намудани равишҳо, усулҳо, техникаҳо ва технологияҳои навоварона барои идоракунии устувори захираҳои обӣ.' },
      { name: 'Тақвияти шарикӣ', desc: 'Тақвият ва рушди минбаъдаи ҳамкорӣ дар байни тарафҳои манфиатдор ва мусоидат ба барқарор намудани муносибатҳои наздики тиҷоратӣ ва шарикӣ.' }
    ],
    partTitle: 'Кӣ даъват шудааст',
    partSubtitle: 'Доираи васеи тарафҳои манфиатдор ба иштирок дар намоишгоҳ даъват шудаанд.',
    participants: [
      'Созмонҳои байналмилалӣ',
      'Созмонҳои минтақавӣ',
      'Мақомоти миллӣ',
      'Мақомоти маҳаллӣ',
      'Созмонҳои ғайриҳукуматӣ',
      'Ширкатҳои хусусӣ',
      'Муассисаҳои академӣ',
      'Муассисаҳои тадқиқотӣ'
    ],
    regTitle: 'Чӣ тавр иштирок кардан мумкин аст',
    regSteps: [
      'Варақаи бақайдгирии намоишгоҳро, ки аз ҷониби Котиботи конференсия пешниҳод шудааст, пур кунед.',
      'Варақаи пуркардашударо то апрели 2026 ба Котиботи конференсия ирсол кунед.',
      'Котибот дар муддати панҷ рӯз пас аз пешниҳоди ариза дар бораи қабули дархости онҳо ба аризадиҳандагон хабар медиҳад.'
    ],
    closingTitle: 'Ба намоишгоҳ ҳамроҳ шавед',
    closingText: 'Навовариҳо ва дастовардҳои худро дар соҳаи идоракунии захираҳои обӣ дар Намоишгоҳи байналмилалӣ дар баробари созмонҳои пешбари ҷаҳон намоиш диҳед.'
  }
}
