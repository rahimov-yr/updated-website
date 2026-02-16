import { useParams, Navigate } from 'react-router-dom'
import { localizedPath } from '../utils/languageRouting'
import { PageHero } from '../components/Sections'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import './CustomPage.css'

const stripInlineFontFamily = (html) => {
  if (!html) return ''
  return html.replace(/font-family\s*:[^;"']*(;?)/gi, '')
}

export default function CustomPage() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const { getCustomPageBySlug, loading } = useSettings()

  const page = getCustomPageBySlug(slug)

  if (loading) return <PageLoader />

  // Page not found - redirect to home
  if (!page) {
    return <Navigate to={localizedPath('/', language)} replace />
  }

  // Get localized content
  const title = page[`title_${language}`] || page.title_ru || page.title_en
  const description = page[`description_${language}`] || page.description_ru || page.description_en
  const content = page[`content_${language}`] || page.content_ru || page.content_en

  return (
    <>
      <PageHero
        title={title}
        subtitle={description}
      />

      <section className="section custom-page-section">
        <div className="container">
          <div
            className="custom-page-content"
            dangerouslySetInnerHTML={{ __html: stripInlineFontFamily(content) }}
          />
        </div>
      </section>
    </>
  )
}
