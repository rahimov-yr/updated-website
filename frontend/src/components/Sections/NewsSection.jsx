import { useState, useEffect } from 'react'
import { NewsCard } from '../UI'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'

export default function NewsSection() {
  const { t, language } = useLanguage()
  const { getNewsSettings } = useSettings()
  const [news, setNews] = useState([])

  const newsSettings = getNewsSettings()

  useEffect(() => {
    fetch('/api/news?limit=6')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(() => {})
  }, [])

  const getTitle = () => {
    const title = language === 'en' ? newsSettings.titleEn :
                  language === 'tj' ? newsSettings.titleTj :
                  newsSettings.titleRu
    return title && title.trim() ? title : t('home.news.title')
  }

  return (
    <section className="news-section section" id="news">
      <div className="news-section__pattern"></div>
      <div className="container">
        <h2 className="news__section-title reveal">{getTitle()}</h2>
        <div className="news__grid reveal">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              slug={item.slug}
              title={item.title.ru}
              titleEn={item.title.en}
              titleTj={item.title.tj}
              date={item.published_at}
              image={item.image}
              category={item.category}
              excerpt={item.excerpt.ru}
              excerptEn={item.excerpt.en}
              excerptTj={item.excerpt.tj}
            />
          ))}
        </div>
      </div>
    </section>
  )
}