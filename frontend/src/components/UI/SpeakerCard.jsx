import LocalizedLink from '../LocalizedLink'

export default function SpeakerCard({ name, title, image, flag, flagAlt, id, clickable = true }) {
  const content = (
    <>
      <div className="hero__speaker-image">
        <img src={image} alt={name} />
        <div className="hero__speaker-flag">
          <img src={flag} alt={flagAlt} />
        </div>
      </div>
      <div className="hero__speaker-info">
        <p className="hero__speaker-title">{title}</p>
        <p className="hero__speaker-name">{name}</p>
      </div>
    </>
  )

  if (!clickable) {
    return (
      <div className="hero__speaker-card hero__speaker-card--static">
        {content}
      </div>
    )
  }

  return (
    <LocalizedLink to={`/speaker/${id}`} className="hero__speaker-card">
      {content}
    </LocalizedLink>
  )
}
