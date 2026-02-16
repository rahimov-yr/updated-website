import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import {
  Users, Globe, Building2, Landmark, Briefcase,
  Heart, UserCircle, Sparkles, TreePine, Home,
  GraduationCap, FlaskConical, Lightbulb, Handshake, MapPin
} from 'lucide-react'
import '../../styles/participation-infographic.css'

export default function Participation() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('conference-participation', {
    title: { ru: 'Участие', en: 'Participation', tj: 'Иштирок' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'conference_participation')

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

      {/* Statement Section */}
      <section className="part-statement">
        <div className="part-statement__pattern"></div>
        <div className="container">
          <div className="part-statement__card">
            <div className="part-statement__icon-wrap">
              <Users size={32} />
            </div>
            <div className="part-statement__content">
              <div className="part-statement__label">
                <Handshake size={13} />
                {t.label}
              </div>
              <h2 className="part-statement__title">{t.title}</h2>
              <p className="part-statement__text">{t.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Grid */}
      <section className="part-stakeholders">
        <div className="part-stakeholders__pattern"></div>
        <div className="container">
          <h2 className="part-stakeholders__title">{t.stakeholdersTitle}</h2>
          <p className="part-stakeholders__subtitle">{t.stakeholdersSubtitle}</p>
          <div className="part-stakeholders__grid">
            {t.stakeholders.map((s, i) => (
              <div className={`part-chip part-chip--${chipColors[i]}`} key={i}>
                <div className="part-chip__icon">
                  {chipIcons[i]}
                </div>
                <span className="part-chip__name">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="part-highlights">
        <div className="part-highlights__pattern"></div>
        <div className="container">
          <div className="part-highlights__grid">
            <div className="part-hl part-hl--cross">
              <div className="part-hl__icon">
                <Lightbulb size={20} />
              </div>
              <h3 className="part-hl__title">{t.crossTitle}</h3>
              <p className="part-hl__text">{t.crossText}</p>
            </div>
            <div className="part-hl part-hl--inperson">
              <div className="part-hl__icon">
                <MapPin size={20} />
              </div>
              <h3 className="part-hl__title">{t.inPersonTitle}</h3>
              <p className="part-hl__text">{t.inPersonText}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const chipIcons = [
  <Globe size={19} key="c0" />,
  <Building2 size={19} key="c1" />,
  <Landmark size={19} key="c2" />,
  <Briefcase size={19} key="c3" />,
  <Briefcase size={19} key="c4" />,
  <Heart size={19} key="c5" />,
  <UserCircle size={19} key="c6" />,
  <Sparkles size={19} key="c7" />,
  <TreePine size={19} key="c8" />,
  <Home size={19} key="c9" />,
  <Home size={19} key="c10" />,
  <GraduationCap size={19} key="c11" />,
  <FlaskConical size={19} key="c12" />
]

const chipColors = [
  'blue', 'navy', 'teal', 'amber', 'green',
  'rose', 'purple', 'amber', 'green', 'teal',
  'navy', 'blue', 'purple'
]

const translations = {
  en: {
    label: 'Multi-Stakeholder',
    title: 'Format and Participation Modalities',
    description: 'The Conference is multi-stakeholder in nature and will bring together different groups and actors involved in the implementation of water-related goals and targets.',
    stakeholdersTitle: 'Who Will Participate',
    stakeholdersSubtitle: 'The Conference will gather high-level representatives from a wide range of sectors and organizations.',
    stakeholders: [
      'UN Member States',
      'UN Entities',
      'International & Regional Organizations',
      'International Financial Institutions',
      'Private Sector',
      'Civil Society',
      'Women',
      'Youth',
      'Indigenous Peoples',
      'Local Communities',
      'Local Governments',
      'Academic Institutions',
      'Scientific Community'
    ],
    crossTitle: 'Beyond the Water Box',
    crossText: 'To provide an opportunity for the promotion of integrated approaches and partnerships, participation of representatives from different sectors "out of water box" is strongly encouraged.',
    inPersonTitle: 'In-Person Event',
    inPersonText: 'The 4th Dushanbe Water Action Decade Conference will be an in-person event to ensure the highest level of interaction among participants.'
  },
  ru: {
    label: 'Многосторонний формат',
    title: 'Формат и условия участия',
    description: 'Конференция носит многосторонний характер и объединит различные группы и участников, вовлечённых в реализацию целей и задач в области водных ресурсов.',
    stakeholdersTitle: 'Кто примет участие',
    stakeholdersSubtitle: 'Конференция соберёт представителей высокого уровня из широкого круга секторов и организаций.',
    stakeholders: [
      'Государства — члены ООН',
      'Структуры ООН',
      'Международные и региональные организации',
      'Международные финансовые институты',
      'Частный сектор',
      'Гражданское общество',
      'Женщины',
      'Молодёжь',
      'Коренные народы',
      'Местные сообщества',
      'Местные органы власти',
      'Академические учреждения',
      'Научное сообщество'
    ],
    crossTitle: 'За пределами водной тематики',
    crossText: 'В целях содействия продвижению комплексных подходов и партнёрств, участие представителей из различных секторов «за пределами водной тематики» настоятельно приветствуется.',
    inPersonTitle: 'Очный формат',
    inPersonText: '4-я Душанбинская конференция по Десятилетию водных действий пройдёт в очном формате для обеспечения максимально высокого уровня взаимодействия между участниками.'
  },
  tj: {
    label: 'Формати бисёрҷонибӣ',
    title: 'Формат ва шартҳои иштирок',
    description: 'Конфронс хусусияти бисёрҷониба дорад ва гурӯҳҳо ва ҷонибҳои гуногуни дар татбиқи ҳадафҳо ва вазифаҳои марбут ба об фаъолро муттаҳид мекунад.',
    stakeholdersTitle: 'Кӣ иштирок мекунад',
    stakeholdersSubtitle: 'Конфронс намояндагони сатҳи баландро аз доираи васеи соҳаҳо ва созмонҳо ҷамъ меорад.',
    stakeholders: [
      'Давлатҳои аъзои СММ',
      'Сохторҳои СММ',
      'Созмонҳои байналмилалӣ ва минтақавӣ',
      'Муассисаҳои молиявии байналмилалӣ',
      'Бахши хусусӣ',
      'Ҷомеаи шаҳрвандӣ',
      'Занон',
      'Ҷавонон',
      'Мардуми бумӣ',
      'Ҷамоатҳои маҳаллӣ',
      'Ҳокимиятҳои маҳаллӣ',
      'Муассисаҳои академӣ',
      'Ҷомеаи илмӣ'
    ],
    crossTitle: 'Берун аз доираи об',
    crossText: 'Барои мусоидат ба пешбурди равишҳои ҳамаҷониба ва шарикӣ, иштироки намояндагон аз соҳаҳои гуногун «берун аз доираи об» ҷиддан тавсия дода мешавад.',
    inPersonTitle: 'Формати ҳузурӣ',
    inPersonText: 'Конфронси 4-уми Душанбе оид ба Даҳсолаи амалиёти обӣ дар формати ҳузурӣ баргузор мегардад, то сатҳи баландтарини ҳамкории байни иштирокчиён таъмин гардад.'
  }
}
