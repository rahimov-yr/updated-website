import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import BlockRenderer from '../../components/BlockRenderer'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'

export default function ConferenceEvents() {
  const { language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  const pageData = getJsonSetting('program_events', null)
  const blocks = pageData?.blocks || []
  const hasHeroBlock = blocks.some(b => b.type === 'hero')

  const banner = usePageBanner('program-events', {
    title: { ru: 'Мероприятия в рамках конференции', en: 'Conference Events', tj: 'Чорабиниҳои конфронс' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'program_events')

  if (loading) return <PageLoader />

  return (
    <>
      {banner.showBanner && !hasHeroBlock && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}
      {loading ? (
        <section className="section">
          <div className="container">
            <p>Загрузка...</p>
          </div>
        </section>
      ) : blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} language={language} />
      ) : (
        <section className="section">
          <div className="container">
            <div className="content-text">
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                {language === 'en' ? 'Content coming soon...' :
                 language === 'tj' ? 'Мундариҷа ба зудӣ...' :
                 'Контент скоро появится...'}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
