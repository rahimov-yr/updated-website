import { PageHero } from '../../components/Sections'
import PageLoader from '../../components/PageLoader'
import BlockRenderer from '../../components/BlockRenderer'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import usePageBanner from '../../hooks/usePageBanner'

export default function Weather() {
  const { language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  const pageData = getJsonSetting('logistics_weather', null)
  const blocks = pageData?.blocks || []
  const hasHeroBlock = blocks.some(b => b.type === 'hero')

  const banner = usePageBanner('logistics-weather', {
    title: { ru: 'Погода', en: 'Weather', tj: 'Обу ҳаво' },
    subtitle: { ru: '', en: '', tj: '' }
  }, 'logistics_weather')

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
