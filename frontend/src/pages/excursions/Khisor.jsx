import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import BlockRenderer from '../../components/BlockRenderer'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'

export default function Khisor() {
  const { language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  const pageData = getJsonSetting('events_khisor', null)
  const blocks = pageData?.blocks || []
  const hasHeroBlock = blocks.some(b => b.type === 'hero')

  const banner = usePageBanner('excursions-khisor', {
    title: { ru: 'Хисор', en: 'Hisor', tj: 'Ҳисор' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'events_khisor')

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
