import { useRef, useEffect, useState } from 'react'
import LocalizedLink from '../LocalizedLink'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import { CalendarIcon, LocationIcon, UserPlusIcon } from '../Icons'
import { SpeakerCard } from '../UI'

export default function HeroSection() {
  const { t, language } = useLanguage()
  const { getHeroSettings, loading: settingsLoading } = useSettings()
  const videoRef = useRef(null)
  const [speakers, setSpeakers] = useState([])

  // Get hero settings from database
  const heroSettings = getHeroSettings()

  // Get values based on current language
  const getLocalizedValue = (ruKey, enKey, tjKey, fallbackKey) => {
    const value = language === 'en' ? heroSettings[enKey] :
                  language === 'tj' ? heroSettings[tjKey] :
                  heroSettings[ruKey]
    return value && value.trim() ? value : (fallbackKey ? t(fallbackKey) : '')
  }

  const title = getLocalizedValue('titleRu', 'titleEn', 'titleTj', '')
  const dates = t('hero.date')
  const location = getLocalizedValue('locationRu', 'locationEn', 'locationTj', 'hero.location')
  const quote = getLocalizedValue('quoteRu', 'quoteEn', 'quoteTj', 'heroQuote.text')
  const quoteAuthor = getLocalizedValue('quoteAuthorRu', 'quoteAuthorEn', 'quoteAuthorTj', 'heroQuote.author')
  const registrationBtn = getLocalizedValue('registrationBtnRu', 'registrationBtnEn', 'registrationBtnTj', 'hero.registerBtn')
  const videoBtn = getLocalizedValue('videoBtnRu', 'videoBtnEn', 'videoBtnTj', 'hero.videoBtn')

  // Video URL
  const videoUrl = heroSettings.videoSource === 'youtube'
    ? heroSettings.youtubeUrl
    : (heroSettings.videoUrl || '/assets/video/hero-background.mp4')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set initial opacity
    video.style.opacity = 0

    const handleCanPlay = () => {
      // Start playing and fade in
      video.play().catch(() => {
        // Autoplay failed, show video anyway
        video.style.opacity = 1
      })
    }

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime
      // Start fading out 1.5 seconds before video ends
      if (timeLeft <= 1.5) {
        video.style.opacity = timeLeft / 1.5
      } else if (video.currentTime <= 1.5) {
        // Fade in during first 1.5 seconds
        video.style.opacity = Math.max(0.1, video.currentTime / 1.5)
      } else {
        video.style.opacity = 1
      }
    }

    const handleError = () => {
      // If video fails to load, hide it gracefully
      video.style.display = 'none'
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('error', handleError)

    // If video is already ready, trigger play
    if (video.readyState >= 3) {
      handleCanPlay()
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // Fetch speakers from API
  useEffect(() => {
    fetch(`/api/speakers?lang=${language}`)
      .then(res => res.json())
      .then(data => setSpeakers(data))
      .catch(() => {})
  }, [language])

  // Parse title into lines (if it contains line breaks or use as single block)
  const renderTitle = () => {
    if (!title) {
      // Fallback to translation keys
      return (
        <>
          {t('hero.conference')}<br />
          {t('hero.highLevel')}<br />
          {t('hero.decade')}<br />
          <span>{t('hero.waterForSustainable')}</span>
        </>
      )
    }

    // If title has newlines, split and render
    if (title.includes('\n')) {
      const lines = title.split('\n').filter(line => line.trim())
      return lines.map((line, index) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))
    }

    // Single line title
    return title
  }

  return (
    <section className="hero" id="conference">
      <div className="hero__background">
        {heroSettings.videoSource !== 'youtube' ? (
          <video
            ref={videoRef}
            className="hero__bg-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />
          </video>
        ) : (
          <div className="hero__bg-video hero__bg-video--youtube">
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(heroSettings.youtubeUrl)}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Background Video"
            />
          </div>
        )}
        <div className="hero__bg-overlay"></div>
      </div>

      <div className="hero__pattern"></div>

      <div className="hero__waves">
        <div className="hero__wave hero__wave--1"></div>
      </div>

      <div className="container">
        <div className="hero__layout">
          <div className="hero__content">
            <h1 className="hero__title">
              {renderTitle()}
            </h1>

            <div className="hero__meta">
              <div className="hero__meta-item">
                <CalendarIcon width={24} height={24} />
                <span>{dates}</span>
              </div>
              <div className="hero__meta-item">
                <LocationIcon />
                <span>{location}</span>
              </div>
            </div>

            {/* Mobile quote - fills space between meta and buttons */}
            <div className="hero__mobile-quote">
              <blockquote>
                {quote}
              </blockquote>
              <cite>{quoteAuthor}</cite>
            </div>

            {!settingsLoading && (heroSettings.showRegistrationBtn !== 'false' || heroSettings.showVideoBtn !== 'false') && (
              <div className="hero__actions">
                {heroSettings.showRegistrationBtn !== 'false' && (
                  <LocalizedLink to="/registration" className="btn btn--primary btn--large">
                    <UserPlusIcon />
                    {registrationBtn}
                  </LocalizedLink>
                )}
                {heroSettings.showVideoBtn !== 'false' && (
                  <a
                    href={heroSettings.youtubeUrl || "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--icon"
                    aria-label="Watch on YouTube"
                  >
                    <img src="/assets/images/youtube-icon.png" alt="YouTube" width="32" height="22" />
                    <span>{videoBtn}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="hero__quote">
            <div className="hero__quote-icon">&#10077;</div>
            <blockquote className="hero__quote-text">
              {quote}
            </blockquote>
            <p className="hero__quote-author">{quoteAuthor}</p>
          </div>
        </div>

        <div className="hero__speakers" id="speakers">
          <h3 className="hero__speakers-title">{t('nav.welcomeMessages')}</h3>
          <div className="hero__speakers-grid">
            {speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                id={speaker.id}
                name={speaker.name}
                title={speaker.title}
                image={speaker.image}
                flag={speaker.flag_url}
                flagAlt={speaker.flag_alt}
                clickable={speaker.clickable}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <div className="hero__scroll-mouse"></div>
        <span className="hero__scroll-text">{t('hero.scrollDown')}</span>
      </div>
    </section>
  )
}

// Helper function to extract YouTube video ID from URL
function getYoutubeId(url) {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}
