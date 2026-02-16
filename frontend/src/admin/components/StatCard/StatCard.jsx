import { Link } from 'react-router-dom'
import './StatCard.css'

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
  color,
  link
}) {
  const Card = link ? Link : 'div'
  const cardProps = link ? { to: link } : {}

  return (
    <Card className="stat-card" {...cardProps}>
      <div className="stat-card-content">
        <div className="stat-card-header">
          <span className="stat-card-title">{title}</span>
          {change && (
            <span className={`stat-card-change ${changeType}`}>
              {changeType === 'positive' ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2.5L10 6.5H7V9.5H5V6.5H2L6 2.5Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 9.5L2 5.5H5V2.5H7V5.5H10L6 9.5Z" fill="currentColor"/>
                </svg>
              )}
              {change}
            </span>
          )}
        </div>
        <div className="stat-card-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      </div>
      <div
        className="stat-card-icon"
        style={{ backgroundColor: `${color}12`, color: color }}
      >
        {icon}
      </div>
    </Card>
  )
}
