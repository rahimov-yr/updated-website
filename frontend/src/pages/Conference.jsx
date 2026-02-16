import { PageHero } from '../components/Sections'
import { useLanguage } from '../context/LanguageContext'
import usePageBanner from '../hooks/usePageBanner'

export default function Conference() {
  const { t } = useLanguage()

  const banner = usePageBanner('conference', {
    title: { ru: 'Конференция', en: 'Conference', tj: 'Конфронс' },
    subtitle: { ru: 'О конференции', en: 'About the Conference', tj: 'Дар бораи конфронс' }
  })

  return (
    <>
      {banner.showBanner && (
        <PageHero
          title={banner.title}
          subtitle={banner.subtitle}
          backgroundImage={banner.backgroundImage}
        />
      )}

      {/* Введение (Introduction) */}
      <section id="intro" className="section">
        <div className="container">
          <h2 className="section-title">{t('conferencePage.introTitle') || 'Введение'}</h2>
          <div className="content-text">
            <p>
              4-ая Международная конференция высокого уровня по Международному десятилетию действий
              «Вода для устойчивого развития» состоится в Душанбе, Таджикистан, 25-28 мая 2026 года.
            </p>
            <p>
              Конференция станет ключевым мероприятием Десятилетия и платформой для обсуждения
              достигнутых результатов и планирования дальнейших шагов в области водных ресурсов.
            </p>
          </div>
        </div>
      </section>

      {/* Цели (Goals) */}
      <section id="goals" className="section section--gray">
        <div className="container">
          <h2 className="section-title">{t('conferencePage.goalsTitle') || 'Цели конференции'}</h2>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-icon">🎯</div>
              <h3>Оценка прогресса</h3>
              <p>Анализ достижений Международного десятилетия действий «Вода для устойчивого развития»</p>
            </div>
            <div className="goal-card">
              <div className="goal-icon">🤝</div>
              <h3>Укрепление сотрудничества</h3>
              <p>Расширение международного партнерства в области водных ресурсов</p>
            </div>
            <div className="goal-card">
              <div className="goal-icon">💡</div>
              <h3>Обмен опытом</h3>
              <p>Распространение лучших практик и инновационных решений</p>
            </div>
            <div className="goal-card">
              <div className="goal-icon">🌍</div>
              <h3>Устойчивое развитие</h3>
              <p>Содействие достижению Целей устойчивого развития, связанных с водой</p>
            </div>
          </div>
        </div>
      </section>

      {/* Дата и место (Date and Venue) */}
      <section id="date-venue" className="section">
        <div className="container">
          <h2 className="section-title">{t('conferencePage.dateVenueTitle') || 'Дата и место проведения'}</h2>
          <div className="venue-info">
            <div className="venue-card">
              <h3>📅 Даты</h3>
              <p className="venue-detail">25-28 мая 2026 года</p>
            </div>
            <div className="venue-card">
              <h3>📍 Место</h3>
              <p className="venue-detail">Кохи Сомон, Душанбе</p>
              <p className="venue-detail">Республика Таджикистан</p>
            </div>
            <div className="venue-card">
              <h3>🏛️ Организатор</h3>
              <p className="venue-detail">Правительство Республики Таджикистан</p>
              <p className="venue-detail">ООН</p>
            </div>
          </div>
        </div>
      </section>

      {/* Участие (Participation) */}
      <section id="participation" className="section section--gray">
        <div className="container">
          <h2 className="section-title">{t('conferencePage.participationTitle') || 'Условия участия'}</h2>
          <div className="content-text">
            <h3>Категории участников</h3>
            <ul>
              <li><strong>Делегации стран</strong> - представители правительств государств-членов ООН</li>
              <li><strong>Международные организации</strong> - представители агентств ООН и других МО</li>
              <li><strong>Гражданское общество</strong> - НПО, научные круги, частный сектор</li>
              <li><strong>СМИ</strong> - аккредитованные журналисты</li>
            </ul>
            <h3 style={{ marginTop: '2rem' }}>Регистрация</h3>
            <p>
              Для участия в конференции необходимо пройти регистрацию через официальный портал.
              Регистрация открыта до 1 апреля 2026 года.
            </p>
            <a href="/registration" className="btn btn--primary" style={{ marginTop: '1rem' }}>
              Зарегистрироваться
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
