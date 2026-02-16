import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import BlockRenderer from '../../components/BlockRenderer'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'

export default function Rogun() {
  const { language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  const pageData = getJsonSetting('events_rogun', null)
  const blocks = pageData?.blocks || []
  const hasHeroBlock = blocks.some(b => b.type === 'hero')

  const banner = usePageBanner('excursions-rogun', {
    title: { ru: 'Рогун', en: 'Rogun', tj: 'Роғун' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'events_rogun')

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
      <BlockRenderer blocks={blocks} language={language} />
    </>
  )
}
