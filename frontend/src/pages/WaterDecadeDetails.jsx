import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import PageLoader from '../components/PageLoader'
import BlockRenderer from '../components/BlockRenderer'

export default function WaterDecadeDetails() {
  const { language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  if (loading) return <PageLoader />

  // Get page data from settings (uses the key from WaterDecadePageEditor)
  const pageData = getJsonSetting('water_decade_details_page', { blocks: [] })
  const blocks = pageData.blocks || []

  return (
    <>
      <BlockRenderer blocks={blocks} language={language} />

      {blocks.length === 0 && (
        <section className="section">
          <div className="container">
            <div className="content-text" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                {language === 'en' ? 'Content is being prepared...' :
                 language === 'tj' ? 'Мундариҷа тайёр карда мешавад...' :
                 'Контент готовится...'}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
