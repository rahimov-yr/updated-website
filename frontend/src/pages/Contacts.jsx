import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import usePageBanner from '../hooks/usePageBanner'
import {
  Headset, Phone, Mail, ClipboardList, Truck, Camera,
  MapPin, Globe, ExternalLink
} from 'lucide-react'
import '../styles/contacts-infographic.css'

export default function Contacts() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('contacts', {
    title: { ru: 'Контакты', en: 'Contacts', tj: 'Тамос' },
    subtitle: { ru: '', en: '', tj: '' }
  })

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

      {/* Featured – Secretariat */}
      <section className="cnt-main">
        <div className="container">
          <div className="cnt-featured">
            <div className="cnt-featured__pattern"></div>
            <div className="cnt-featured__left">
              <div className="cnt-featured__icon-wrap">
                <Headset size={28} />
              </div>
              <span className="cnt-featured__tag">{t.featured.tag}</span>
            </div>
            <div className="cnt-featured__right">
              <h2 className="cnt-featured__title">{t.featured.title}</h2>
              <p className="cnt-featured__desc">{t.featured.desc}</p>
              <div className="cnt-featured__contacts">
                {t.featured.phones.map((ph, i) => (
                  <a href={`tel:${ph.replace(/[\s()-]/g, '')}`} className="cnt-featured__pill" key={`fp${i}`}>
                    <Phone size={14} />
                    <span>{ph}</span>
                  </a>
                ))}
                {t.featured.emails.map((em, i) => (
                  <a href={`mailto:${em}`} className="cnt-featured__pill" key={`fe${i}`}>
                    <Mail size={14} />
                    <span>{em}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Directory grid */}
          <div className="cnt-grid">
            {t.entries.map((entry, i) => (
              <div className={`cnt-card cnt-card--${entryKeys[i]}`} key={i}>
                <div className="cnt-card__accent"></div>
                <div className="cnt-card__icon">{entryIcons[i]}</div>
                <h3 className="cnt-card__title">{entry.title}</h3>
                <p className="cnt-card__desc">{entry.desc}</p>
                <div className="cnt-card__links">
                  {entry.phones && entry.phones.map((ph, j) => (
                    <a href={`tel:${ph.replace(/[\s()-]/g, '')}`} className="cnt-card__link" key={`p${j}`}>
                      <Phone size={13} />
                      <span>{ph}</span>
                    </a>
                  ))}
                  {entry.emails.map((em, j) => (
                    <a href={`mailto:${em}`} className="cnt-card__link" key={`e${j}`}>
                      <Mail size={13} />
                      <span>{em}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address & Location */}
      <section className="cnt-location">
        <div className="container">
          <div className="cnt-location__card">
            <div className="cnt-location__info">
              <div className="cnt-location__icon"><MapPin size={20} /></div>
              <div>
                <h3 className="cnt-location__title">{t.locationTitle}</h3>
                <p className="cnt-location__address">{t.locationAddress}</p>
              </div>
            </div>
            <a
              href={t.locationMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cnt-location__map-link"
            >
              <Globe size={14} />
              <span>{t.locationMapLabel}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

    </>
  )
}

const entryKeys = ['registration', 'logistics', 'press']
const entryIcons = [
  <ClipboardList size={22} key="i0" />,
  <Truck size={22} key="i1" />,
  <Camera size={22} key="i2" />
]

const translations = {
  en: {
    badgeLabel: 'Get in Touch',
    introTitle: 'Contact Us',
    introText: 'Reach out to the relevant department for assistance with registration, logistics, media accreditation, or general conference inquiries.',
    featured: {
      tag: 'Main Contact',
      title: 'Conference Secretariat',
      desc: 'For all general inquiries about the conference',
      phones: ['+992 (37) 227 68 43', '+992 (37) 221 02 59'],
      emails: ['secretariatconf2026@mfa.tj']
    },
    entries: [
      {
        title: 'Registration Department',
        desc: 'Registration and accreditation inquiries',
        phones: null,
        emails: ['registrationconf2026@mfa.tj']
      },
      {
        title: 'Logistics Coordinator',
        desc: 'Accommodation, transport and visa support',
        phones: ['+992 (37) 221 09 14', '+992 (37) 221 61 05'],
        emails: ['protocol@mfa.tj']
      },
      {
        title: 'Press Office',
        desc: 'Media inquiries and press accreditation',
        phones: ['+992 (97) 221 83 95'],
        emails: ['pressaccreditation@mfa.tj', 'informdepartment@mfa.tj']
      }
    ],
    locationTitle: 'Conference Venue',
    locationAddress: 'Kokhi Somon, Dushanbe, Republic of Tajikistan',
    locationMapUrl: 'https://maps.google.com/?q=Kokhi+Somon+Dushanbe',
    locationMapLabel: 'View on Map',
    closingTitle: 'We\'re Here to Help',
    closingText: 'Don\'t hesitate to contact us with any questions regarding your participation in the conference.'
  },
  ru: {
    badgeLabel: 'Свяжитесь с нами',
    introTitle: 'Контакты',
    introText: 'Обратитесь в соответствующий отдел для получения помощи по вопросам регистрации, логистики, аккредитации СМИ или общим вопросам конференции.',
    featured: {
      tag: 'Главный контакт',
      title: 'Секретариат конференции',
      desc: 'По всем общим вопросам о конференции',
      phones: ['+992 (37) 227 68 43', '+992 (37) 221 02 59'],
      emails: ['secretariatconf2026@mfa.tj']
    },
    entries: [
      {
        title: 'Отдел регистрации',
        desc: 'Вопросы регистрации и аккредитации',
        phones: null,
        emails: ['registrationconf2026@mfa.tj']
      },
      {
        title: 'Координатор по логистике',
        desc: 'Размещение, транспорт и визовая поддержка',
        phones: ['+992 (37) 221 09 14', '+992 (37) 221 61 05'],
        emails: ['protocol@mfa.tj']
      },
      {
        title: 'Пресс-служба',
        desc: 'Медиа-запросы и аккредитация СМИ',
        phones: ['+992 (97) 221 83 95'],
        emails: ['pressaccreditation@mfa.tj', 'informdepartment@mfa.tj']
      }
    ],
    locationTitle: 'Место проведения конференции',
    locationAddress: 'Кохи Сомон, Душанбе, Республика Таджикистан',
    locationMapUrl: 'https://maps.google.com/?q=Kokhi+Somon+Dushanbe',
    locationMapLabel: 'Показать на карте',
    closingTitle: 'Мы готовы помочь',
    closingText: 'Не стесняйтесь обращаться к нам с любыми вопросами относительно вашего участия в конференции.'
  },
  tj: {
    badgeLabel: 'Бо мо тамос гиред',
    introTitle: 'Тамос',
    introText: 'Барои гирифтани кӯмак оид ба бақайдгирӣ, логистика, аккредитатсияи ВАО ё саволҳои умумии конференсия ба шӯъбаи дахлдор муроҷиат кунед.',
    featured: {
      tag: 'Тамоси асосӣ',
      title: 'Котибияти конференсия',
      desc: 'Барои тамоми саволҳо дар бораи конференсия',
      phones: ['+992 (37) 227 68 43', '+992 (37) 221 02 59'],
      emails: ['secretariatconf2026@mfa.tj']
    },
    entries: [
      {
        title: 'Шӯъбаи бақайдгирӣ',
        desc: 'Саволҳо оид ба бақайдгирӣ ва аккредитатсия',
        phones: null,
        emails: ['registrationconf2026@mfa.tj']
      },
      {
        title: 'Ҳамоҳангсози логистика',
        desc: 'Ҷойгиршавӣ, нақлиёт ва дастгирии раводид',
        phones: ['+992 (37) 221 09 14', '+992 (37) 221 61 05'],
        emails: ['protocol@mfa.tj']
      },
      {
        title: 'Хадамоти матбуот',
        desc: 'Дархостҳои расонаҳо ва аккредитатсияи матбуот',
        phones: ['+992 (97) 221 83 95'],
        emails: ['pressaccreditation@mfa.tj', 'informdepartment@mfa.tj']
      }
    ],
    locationTitle: 'Макони баргузории конференсия',
    locationAddress: 'Кохи Сомон, Душанбе, Ҷумҳурии Тоҷикистон',
    locationMapUrl: 'https://maps.google.com/?q=Kokhi+Somon+Dushanbe',
    locationMapLabel: 'Дар харита нишон диҳед',
    closingTitle: 'Мо омодаи кӯмакем',
    closingText: 'Барои ҳар гуна саволҳо оид ба иштироки шумо дар конференсия бо мо тамос гиред.'
  }
}
