import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import '../../styles/forums-infographic.css'

const forumColors = ['navy', 'teal', 'green', 'purple', 'rose', 'cyan']

export default function Forums() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('program-forums', {
    title: { ru: 'Форумы', en: 'Forums', tj: 'Форумҳо' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'program_forums')

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

      {/* Intro - Quote style */}
      <section className="frm-intro">
        <div className="frm-intro__pattern"></div>
        <div className="container">
          <p className="frm-intro__text">{t.introText}</p>
        </div>
      </section>

      {/* Forums Grid - Cards with left accents */}
      <section className="frm-grid">
        <div className="frm-grid__pattern"></div>
        <div className="container">
          <h2 className="frm-grid__title">{t.gridTitle}</h2>
          <p className="frm-grid__subtitle">{t.gridSubtitle}</p>
          <div className="frm-cards">
            {t.forums.map((forum, i) => (
              <div className={`frm-card frm-card--${forumColors[i]}`} key={i}>
                <span className="frm-card__watermark">0{i + 1}</span>
                <span className={`frm-card__tag frm-card__tag--${forumColors[i]}`}>
                  {t.forumWord} {i + 1}
                </span>
                <h3 className="frm-card__name">{forum.name}</h3>
                <p className="frm-card__desc">{forum.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives - Stacked glass list */}
      <section className="frm-objectives">
        <div className="frm-objectives__pattern"></div>
        <div className="container">
          <h2 className="frm-objectives__title">{t.objTitle}</h2>
          <div className="frm-obj-list">
            {t.objectives.map((obj, i) => (
              <div className="frm-obj" key={i}>
                <span className="frm-obj__num">0{i + 1}</span>
                <p className="frm-obj__text">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes - Accent card */}
      <section className="frm-outcomes">
        <div className="frm-outcomes__pattern"></div>
        <div className="container">
          <div className="frm-outcomes__card">
            <h2 className="frm-outcomes__title">{t.outTitle}</h2>
            <p className="frm-outcomes__text">{t.outText}</p>
          </div>
        </div>
      </section>
    </>
  )
}

const translations = {
  en: {
    introText: 'Interested delegations will have the opportunity to organize Conference Forums on 25 May 2026 in advance of the Opening Session of the Conference. The objective of the Forums is to create an additional platform for inclusive discussions on water-related issues among different types of stakeholders or within certain geographic regions.',
    gridTitle: 'Proposed Forums',
    gridSubtitle: 'Six preliminary topics have been proposed for the Conference Forums.',
    forumWord: 'Forum',
    forums: [
      { name: 'Private Sector Forum', desc: 'Engaging business and industry leaders in sustainable water management, investment, and innovative solutions.' },
      { name: 'Africa Water Forum', desc: 'Addressing water challenges specific to the African continent and fostering regional cooperation and partnerships.' },
      { name: 'Indigenous Peoples Forum', desc: 'Recognizing and integrating traditional knowledge systems and Indigenous perspectives on water stewardship.' },
      { name: 'Women Water Forum', desc: 'Empowering women\'s leadership and participation in water governance and decision-making processes.' },
      { name: 'Youth Water Forum', desc: 'Mobilizing the next generation of water leaders and innovators for sustainable water management.' },
      { name: 'Glaciers & Cryosphere Forum', desc: 'Addressing the impacts of climate change on glaciers, snow, and ice and their role in global water resources.' }
    ],
    objTitle: 'Forum Objectives',
    objectives: [
      'Create an additional platform for inclusive discussions on water-related issues among different types of stakeholders.',
      'Involve diverse stakeholders in the implementation of the water agenda with a focus on accelerating action.',
      'Foster increased collaboration and partnership at the local, national, regional and global levels.',
      'Facilitate focused engagement of the private sector, academia, the scientific community, women, youth, Indigenous Peoples, and other major groups.'
    ],
    outTitle: 'Forum Outcomes',
    outText: 'The terms of reference for the Conference Forums will be prepared by the Conference Secretariat and shared with interested parties in a timely manner. The key messages from the Conference Forums will be presented during the Closing Session. The main conclusions and recommendations will also be reflected in the outcome documents of the 4th Dushanbe Water Action Decade Conference.'
  },
  ru: {
    introText: 'Заинтересованные делегации получат возможность организовать форумы конференции 25 мая 2026 года перед открытием конференции. Цель форумов — создать дополнительную платформу для инклюзивных дискуссий по водным вопросам между различными заинтересованными сторонами или в рамках определённых географических регионов.',
    gridTitle: 'Предлагаемые форумы',
    gridSubtitle: 'Шесть предварительных тем предложены для форумов конференции.',
    forumWord: 'Форум',
    forums: [
      { name: 'Форум частного сектора', desc: 'Привлечение лидеров бизнеса и промышленности к устойчивому управлению водными ресурсами, инвестициям и инновационным решениям.' },
      { name: 'Африканский водный форум', desc: 'Решение водных проблем, специфичных для Африканского континента, и содействие региональному сотрудничеству и партнёрству.' },
      { name: 'Форум коренных народов', desc: 'Признание и интеграция традиционных систем знаний и перспектив коренных народов в управлении водными ресурсами.' },
      { name: 'Женский водный форум', desc: 'Укрепление лидерства и участия женщин в управлении водными ресурсами и процессах принятия решений.' },
      { name: 'Молодёжный водный форум', desc: 'Мобилизация нового поколения лидеров и новаторов в области водных ресурсов для устойчивого управления водой.' },
      { name: 'Форум ледников и криосферы', desc: 'Рассмотрение воздействия изменения климата на ледники, снег и лёд и их роли в глобальных водных ресурсах.' }
    ],
    objTitle: 'Цели форумов',
    objectives: [
      'Создать дополнительную платформу для инклюзивных дискуссий по водным вопросам между различными заинтересованными сторонами.',
      'Вовлечь разнообразные заинтересованные стороны в реализацию водной повестки дня с акцентом на ускорение действий.',
      'Содействовать расширению сотрудничества и партнёрства на местном, национальном, региональном и глобальном уровнях.',
      'Обеспечить целенаправленное участие частного сектора, научных кругов, женщин, молодёжи, коренных народов и других основных групп.'
    ],
    outTitle: 'Результаты форумов',
    outText: 'Круг полномочий для форумов конференции будет подготовлен Секретариатом конференции и своевременно доведён до заинтересованных сторон. Ключевые послания форумов будут представлены на заключительном заседании. Основные выводы и рекомендации также будут отражены в итоговых документах 4-й Душанбинской конференции по Десятилетию действий в области водных ресурсов.'
  },
  tj: {
    introText: 'Ҳайатҳои манфиатдор имконият хоҳанд дошт, ки форумҳои конференсияро 25 май 2026 пеш аз кушодани конференсия ташкил кунанд. Ҳадафи форумҳо эҷоди як платформаи иловагӣ барои муҳокимаҳои фарогир оид ба масъалаҳои обӣ дар байни намудҳои гуногуни тарафҳои манфиатдор ё дар доираи минтақаҳои муайяни ҷуғрофӣ мебошад.',
    gridTitle: 'Форумҳои пешниҳодшуда',
    gridSubtitle: 'Шаш мавзӯи ибтидоӣ барои форумҳои конференсия пешниҳод шудаанд.',
    forumWord: 'Форум',
    forums: [
      { name: 'Форуми сектори хусусӣ', desc: 'Ҷалби роҳбарони тиҷорат ва саноат ба идоракунии устувори захираҳои обӣ, сармоягузорӣ ва ҳалли навоварона.' },
      { name: 'Форуми обии Африқо', desc: 'Ҳалли мушкилоти обии хоси қитъаи Африқо ва мусоидат ба ҳамкорӣ ва шарикии минтақавӣ.' },
      { name: 'Форуми мардумони бумӣ', desc: 'Эътироф ва ҳамгироии системаҳои дониши анъанавӣ ва дурнамоҳои мардумони бумӣ дар идоракунии захираҳои обӣ.' },
      { name: 'Форуми обии занон', desc: 'Тақвияти роҳбарӣ ва иштироки занон дар идоракунии захираҳои обӣ ва раванди қабули қарорҳо.' },
      { name: 'Форуми обии ҷавонон', desc: 'Сафарбар кардани насли нави роҳбарон ва навоварон дар соҳаи захираҳои обӣ барои идоракунии устувори об.' },
      { name: 'Форуми пиряхҳо ва криосфера', desc: 'Баррасии таъсири тағйироти иқлим ба пиряхҳо, барф ва ях ва нақши онҳо дар захираҳои ҷаҳонии обӣ.' }
    ],
    objTitle: 'Ҳадафҳои форумҳо',
    objectives: [
      'Эҷоди як платформаи иловагӣ барои муҳокимаҳои фарогир оид ба масъалаҳои обӣ дар байни тарафҳои гуногуни манфиатдор.',
      'Ҷалби тарафҳои гуногуни манфиатдор ба татбиқи барномаи обӣ бо тамаркуз ба суръат бахшидани амалиёт.',
      'Мусоидат ба густариши ҳамкорӣ ва шарикӣ дар сатҳҳои маҳаллӣ, миллӣ, минтақавӣ ва ҷаҳонӣ.',
      'Таъмини иштироки ҳадафноки бахши хусусӣ, доираҳои илмӣ, занон, ҷавонон, мардумони бумӣ ва дигар гурӯҳҳои асосӣ.'
    ],
    outTitle: 'Натиҷаҳои форумҳо',
    outText: 'Доираи ваколатҳо барои форумҳои конференсия аз ҷониби Котиботи конференсия тайёр карда шуда, сари вақт ба тарафҳои манфиатдор расонида мешавад. Паёмҳои калидии форумҳо дар ҷаласаи хотимавӣ пешниҳод карда мешаванд. Хулосаҳо ва тавсияҳои асосӣ инчунин дар ҳуҷҷатҳои ниҳоии Конференсияи 4-уми Душанбе оид ба Даҳсолаи амалиёти обӣ инъикос карда мешаванд.'
  }
}
