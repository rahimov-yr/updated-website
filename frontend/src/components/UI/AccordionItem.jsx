import { useState } from 'react'

export default function AccordionItem({ day, date, title, events, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Determine event type for styling
  const getEventType = (eventTitle) => {
    const lower = eventTitle.toLowerCase()
    if (lower.includes('кофе') || lower.includes('обед') || lower.includes('перерыв')) return 'break'
    if (lower.includes('регистрация')) return 'registration'
    if (lower.includes('открытие') || lower.includes('закрытие') || lower.includes('церемония')) return 'ceremony'
    if (lower.includes('пленарн') || lower.includes('заседание')) return 'plenary'
    if (lower.includes('сессия') || lower.includes('диалог')) return 'session'
    return 'default'
  }

  return (
    <div id={`day-${day}`} className={`accordion__item ${isOpen ? 'accordion__item--open' : ''}`}>
      <div
        className="accordion__header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="accordion__header-left">
          <span className="accordion__day-badge">День {day}</span>
          <div className="accordion__header-info">
            <span className="accordion__date">{date}</span>
            <span className="accordion__title">{title.replace(`День ${day}: `, '')}</span>
          </div>
        </div>
        <div className="accordion__header-right">
          <span className="accordion__events-count">{events.length} событий</span>
          <span className="accordion__toggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div className="accordion__body">
        <div className="schedule">
          {events.map((event, index) => (
            <div key={index} className={`schedule__item schedule__item--${getEventType(event.title)}`}>
              <div className="schedule__time-block">
                <span className="schedule__time">{event.time}</span>
                <span className="schedule__timeline-dot"></span>
              </div>
              <div className="schedule__event">
                <div className="schedule__event-header">
                  <h4 className="schedule__event-title">{event.title}</h4>
                </div>
                {event.description && (
                  <p className="schedule__event-desc">{event.description}</p>
                )}
                <div className="schedule__event-meta">
                  <span className="schedule__location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
