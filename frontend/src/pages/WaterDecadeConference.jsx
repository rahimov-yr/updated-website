import { useParams } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import PageLoader from '../components/PageLoader'
import BlockRenderer from '../components/BlockRenderer'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

export default function WaterDecadeConference() {
  const { confId } = useParams()
  const { t, language } = useLanguage()
  const { getJsonSetting, loading } = useSettings()

  const pageData = getJsonSetting(`water_decade_conf_page_${confId}`, { blocks: [] })
  const blocks = pageData.blocks || []

  if (loading) return <PageLoader />

  return (
    <>
      <BlockRenderer blocks={blocks} language={language} />

      {blocks.length === 0 && (
        <section className="section">
          <div className="container">
            <LocalizedLink to="/water-decade" className="water-decade-conf__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {t('waterDecadePage.backToDecade')}
            </LocalizedLink>
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
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
