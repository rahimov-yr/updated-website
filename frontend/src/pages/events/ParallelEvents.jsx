import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'
import { Info } from 'lucide-react'
import '../../styles/parallel-infographic.css'

export default function ParallelEvents() {
  const { language } = useLanguage()
  const { loading } = useSettings()

  const banner = usePageBanner('events-parallel', {
    title: { ru: 'Параллельные мероприятия', en: 'Parallel Events', tj: 'Чорабиниҳои паралелӣ' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'parallel_events')

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
      <section className="prl-statement">
        <div className="prl-statement__pattern"></div>
        <div className="container">
          <p className="prl-statement__text">{t.text}</p>
        </div>
      </section>

      {/* Notice Section */}
      <section className="prl-notice">
        <div className="container">
          <div className="prl-notice__card">
            <div className="prl-notice__icon">
              <Info size={22} />
            </div>
            <p className="prl-notice__text">{t.notice}</p>
          </div>
        </div>
      </section>
    </>
  )
}

const translations = {
  en: {
    title: 'Side Events',
    text: 'Interested delegations will have the opportunity to organize side events to the Conference on 25-26 May 2026. More information on the registration of side events will be provided in due course.',
    notice: 'More information on the registration and organization of side events will be provided in due course.'
  },
  ru: {
    title: 'Параллельные мероприятия',
    text: 'Заинтересованные делегации получат возможность организовать параллельные мероприятия к конференции 25-26 мая 2026 года. Дополнительная информация о регистрации параллельных мероприятий будет предоставлена в установленном порядке.',
    notice: 'Дополнительная информация о регистрации и организации параллельных мероприятий будет предоставлена в установленном порядке.'
  },
  tj: {
    title: 'Чорабиниҳои паралелӣ',
    text: 'Ҳайатҳои манфиатдор имконият хоҳанд дошт, ки чорабиниҳои паралелиро ба конференсия дар 25-26 майи 2026 ташкил кунанд. Маълумоти бештар дар бораи бақайдгирии чорабиниҳои паралелӣ дар вақти муайян пешниҳод карда мешавад.',
    notice: 'Маълумоти бештар дар бораи бақайдгирӣ ва ташкили чорабиниҳои паралелӣ дар вақти муайян пешниҳод карда мешавад.'
  }
}
