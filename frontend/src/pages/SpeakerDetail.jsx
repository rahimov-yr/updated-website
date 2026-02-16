import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageLoader from '../components/PageLoader'
import { useLanguage } from '../context/LanguageContext'

const stripInlineFontFamily = (html) => {
  if (!html) return ''
  return html.replace(/font-family\s*:[^;"']*(;?)/gi, '')
}

const translations = {
  ru: {
    loading: 'Загрузка...',
    notFound: 'Спикер не найден',
    biography: 'Приветственные послания'
  },
  en: {
    loading: 'Loading...',
    notFound: 'Speaker not found',
    biography: 'Biography'
  },
  tj: {
    loading: 'Бор шуда истодааст...',
    notFound: 'Суханвар ёфт нашуд',
    biography: 'Тарҷумаи ҳол'
  }
}

export default function SpeakerDetail() {
  const { id } = useParams()
  const { language } = useLanguage()
  const [speaker, setSpeaker] = useState(null)
  const [loading, setLoading] = useState(true)

  const t = translations[language] || translations.ru

  useEffect(() => {
    fetch(`/api/speakers/${id}?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setSpeaker(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id, language])

  if (loading) return <PageLoader />

  if (!speaker) {
    return (
      <section className="section">
        <div className="container">
          <div className="content-text" style={{ textAlign: 'center' }}>
            <p>{t.notFound}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section speaker-detail">
      <div className="container">
        <div className="speaker-detail__layout">
          <div className="speaker-detail__sidebar">
            <div className="speaker-detail__image-container">
              <img src={speaker.image} alt={speaker.name} className="speaker-detail__image" />
            </div>
          </div>

          <div className="speaker-detail__content">
            <div className="speaker-detail__header">
              <h1 className="speaker-detail__name">{speaker.name}</h1>
              <p className="speaker-detail__title">{speaker.title}</p>
            </div>

            {speaker.bio && (
              <div className="speaker-detail__section">
                <h2>{speaker.session_title || t.biography}</h2>
                <div className="speaker-detail__bio" dangerouslySetInnerHTML={{ __html: stripInlineFontFamily(speaker.bio) }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
