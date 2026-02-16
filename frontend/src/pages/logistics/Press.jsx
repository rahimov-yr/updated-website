import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Camera, FileText, Image, Building, CreditCard, UserCheck,
  AlertTriangle, Phone
} from 'lucide-react'
import '../../styles/press-infographic.css'

export default function Press() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('logistics-press', {
    title: { ru: 'Аккредитация прессы', en: 'Press Accreditation', tj: 'Аккредитатсияи матбуот' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_press')

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
      <section className="prs-intro">
        <div className="prs-intro__pattern"></div>
        <div className="container">
          <p className="prs-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Required Documents */}
      <section className="prs-docs">
        <div className="prs-docs__pattern"></div>
        <div className="container">
          <div className="prs-docs__header">
            <h2 className="prs-docs__title">{t.docsTitle}</h2>
            <p className="prs-docs__subtitle">{t.docsSubtitle}</p>
          </div>
          <div className="prs-docs__list">
            {t.docs.map((doc, i) => (
              <div className={`prs-doc prs-doc--${i + 1}`} key={i}>
                <div className="prs-doc__check">{docIcons[i]}</div>
                <div className="prs-doc__body">
                  <h3 className="prs-doc__name">{doc.name}</h3>
                  <p className="prs-doc__desc">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadline Banner */}
      <section className="prs-deadline">
        <div className="prs-deadline__band">
          <div className="prs-deadline__band-pattern"></div>
          <div className="container">
            <div className="prs-deadline__date">
              <p className="prs-deadline__date-label">{t.deadlineLabel}</p>
              <div className="prs-deadline__date-block">
                <p className="prs-deadline__date-day">1</p>
                <p className="prs-deadline__date-month">{t.deadlineMonth}</p>
              </div>
            </div>
            <div className="prs-deadline__info">
              <h2 className="prs-deadline__info-title">{t.deadlineTitle}</h2>
              <p className="prs-deadline__info-text">{t.deadlineText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Notice */}
      <section className="prs-notice">
        <div className="container">
          <div className="prs-notice__card">
            <div className="prs-notice__icon"><AlertTriangle size={20} /></div>
            <div className="prs-notice__body">
              <h3 className="prs-notice__title">{t.noticeTitle}</h3>
              <p className="prs-notice__text">{t.noticeText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="prs-contact">
        <div className="container">
          <div className="prs-contact__card">
            <div className="prs-contact__icon"><Phone size={20} /></div>
            <div className="prs-contact__body">
              <h3 className="prs-contact__title">{t.contactTitle}</h3>
              <p className="prs-contact__text" dangerouslySetInnerHTML={{ __html: t.contactText }} />
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="prs-closing">
        <div className="prs-closing__pattern"></div>
        <div className="container">
          <h2 className="prs-closing__title">{t.closingTitle}</h2>
          <p className="prs-closing__text">{t.closingText}</p>
        </div>
      </section>
    </>
  )
}

const docIcons = [
  <FileText size={18} key="d0" />,
  <Image size={18} key="d1" />,
  <Building size={18} key="d2" />,
  <CreditCard size={18} key="d3" />,
  <UserCheck size={18} key="d4" />
]

const translations = {
  en: {
    badgeLabel: 'Media Accreditation',
    introTitle: 'Press Accreditation',
    introText: 'To obtain accreditation for covering the High-Level International Conference and accompanying events, media representatives arriving in Dushanbe are required to send the following information in advance.',
    docsTitle: 'Required Documents',
    docsSubtitle: 'Please send the following documents to pressaccreditation@mfa.tj.',
    docs: [
      {
        name: 'Official Letter',
        desc: 'A letter on official letterhead signed by the senior management of the media outlet, indicating the full name of the media representative, their position, and the list of equipment to be used.'
      },
      {
        name: 'Photo',
        desc: 'A photo 3.5\u00d74.5 cm, 300 dpi in JPEG format.'
      },
      {
        name: 'Media Agency Information',
        desc: 'Name of the media agency, country, official address, and e-mail address.'
      },
      {
        name: 'Passport Copy',
        desc: 'A copy of the passport of the media representative.'
      },
      {
        name: 'Biography / CV',
        desc: 'A biography or CV/resume of the media representative.'
      }
    ],
    deadlineLabel: 'Deadline',
    deadlineMonth: 'May 2026',
    deadlineTitle: 'Application Deadline',
    deadlineText: 'All accreditation applications must be submitted by 1 May 2026. Late applications may not be processed in time.',
    noticeTitle: 'Admission to Events',
    noticeText: 'The admission of media representatives to official events will be carried out according to the accredited list and a valid identity document.',
    contactTitle: 'Department of Information and Press',
    contactText: 'Ministry of Foreign Affairs of the Republic of Tajikistan<br/>Phone: <a href="tel:+99237221-83-95">(+992 37) 221-83-95</a><br/>Email: <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a><br/>Accreditation: <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a>',
    closingTitle: 'Cover the Conference',
    closingText: 'Ensure your accreditation is submitted before the deadline to secure your media access to all Conference events.'
  },
  ru: {
    badgeLabel: 'Аккредитация СМИ',
    introTitle: 'Аккредитация прессы',
    introText: 'Для получения аккредитации для освещения Международной конференции высокого уровня и сопутствующих мероприятий представители СМИ, прибывающие в Душанбе, должны заблаговременно направить следующую информацию.',
    docsTitle: 'Необходимые документы',
    docsSubtitle: 'Направьте следующие документы на адрес pressaccreditation@mfa.tj.',
    docs: [
      {
        name: 'Официальное письмо',
        desc: 'Письмо на официальном бланке, подписанное руководством СМИ, с указанием полного имени представителя, его должности и списка оборудования.'
      },
      {
        name: 'Фотография',
        desc: 'Фотография 3,5\u00d74,5 см, 300 dpi в формате JPEG.'
      },
      {
        name: 'Информация о СМИ',
        desc: 'Название агентства, страна, официальный адрес и адрес электронной почты.'
      },
      {
        name: 'Копия паспорта',
        desc: 'Копия паспорта представителя СМИ.'
      },
      {
        name: 'Биография / резюме',
        desc: 'Биография или резюме представителя СМИ.'
      }
    ],
    deadlineLabel: 'Крайний срок',
    deadlineMonth: 'Май 2026',
    deadlineTitle: 'Срок подачи заявок',
    deadlineText: 'Все заявки на аккредитацию должны быть поданы до 1 мая 2026 года. Заявки, поданные позже, могут не быть рассмотрены вовремя.',
    noticeTitle: 'Допуск на мероприятия',
    noticeText: 'Допуск представителей СМИ на официальные мероприятия осуществляется по списку аккредитованных лиц и при предъявлении удостоверения личности.',
    contactTitle: 'Управление информации и печати',
    contactText: 'Министерство иностранных дел Республики Таджикистан<br/>Телефон: <a href="tel:+99237221-83-95">(+992 37) 221-83-95</a><br/>Эл. почта: <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a><br/>Аккредитация: <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a>',
    closingTitle: 'Освещайте конференцию',
    closingText: 'Убедитесь, что ваша заявка на аккредитацию подана до истечения срока для обеспечения медиа-доступа ко всем мероприятиям конференции.'
  },
  tj: {
    badgeLabel: 'Аккредитатсияи ВАО',
    introTitle: 'Аккредитатсияи матбуот',
    introText: 'Барои гирифтани аккредитатсия ҷиҳати пӯшиши Конференсияи байналмилалии сатҳи баланд ва чорабиниҳои ҳамроҳ, намояндагони ВАО, ки ба Душанбе меоянд, бояд маълумоти зеринро пешакӣ фиристанд.',
    docsTitle: 'Ҳуҷҷатҳои зарурӣ',
    docsSubtitle: 'Ҳуҷҷатҳои зеринро ба суроғаи pressaccreditation@mfa.tj фиристед.',
    docs: [
      {
        name: 'Мактуби расмӣ',
        desc: 'Мактуб дар бланки расмӣ, ки аз ҷониби роҳбарияти ВАО имзо шудааст, бо зикри номи пурраи намоянда, вазифа ва рӯйхати таҷҳизот.'
      },
      {
        name: 'Акс',
        desc: 'Акси 3,5\u00d74,5 см, 300 dpi дар формати JPEG.'
      },
      {
        name: 'Маълумот дар бораи ВАО',
        desc: 'Номи агентӣ, кишвар, суроғаи расмӣ ва суроғаи почтаи электронӣ.'
      },
      {
        name: 'Нусхаи шиноснома',
        desc: 'Нусхаи шиносномаи намояндаи ВАО.'
      },
      {
        name: 'Тарҷумаи ҳол',
        desc: 'Тарҷумаи ҳол ё резюмеи намояндаи ВАО.'
      }
    ],
    deadlineLabel: 'Мӯҳлати охирин',
    deadlineMonth: 'Майи 2026',
    deadlineTitle: 'Мӯҳлати пешниҳоди аризаҳо',
    deadlineText: 'Ҳамаи аризаҳо барои аккредитатсия бояд то 1 майи 2026 пешниҳод карда шаванд. Аризаҳои дертар пешниҳодшуда метавонанд сари вақт баррасӣ нашаванд.',
    noticeTitle: 'Роҳ додан ба чорабиниҳо',
    noticeText: 'Роҳ додани намояндагони ВАО ба чорабиниҳои расмӣ мувофиқи рӯйхати аккредитатсияшудагон ва ҳуҷҷати шахсияти эътиборнок анҷом дода мешавад.',
    contactTitle: 'Шӯъбаи иттилоот ва матбуот',
    contactText: 'Вазорати корҳои хориҷии Ҷумҳурии Тоҷикистон<br/>Телефон: <a href="tel:+99237221-83-95">(+992 37) 221-83-95</a><br/>Почта: <a href="mailto:informdepartment@mfa.tj">informdepartment@mfa.tj</a><br/>Аккредитатсия: <a href="mailto:pressaccreditation@mfa.tj">pressaccreditation@mfa.tj</a>',
    closingTitle: 'Конференсияро пӯшиш диҳед',
    closingText: 'Боварӣ ҳосил кунед, ки аризаи аккредитатсияи шумо пеш аз мӯҳлати охирин пешниҳод шудааст, то дастрасии медиавӣ ба ҳамаи чорабиниҳои конференсия таъмин шавад.'
  }
}
