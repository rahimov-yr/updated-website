import { useState } from 'react'
import { Link } from 'react-router-dom'
import './RecentTable.css'

const defaultData = []

const statusConfig = {
  approved: { label: 'Одобрен', class: 'success' },
  pending: { label: 'Ожидает', class: 'warning' },
  rejected: { label: 'Отклонён', class: 'danger' }
}

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

export default function RecentTable({
  data = defaultData,
  title = 'Последние регистрации',
  viewAllLink = '/admin/registrations'
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="recent-table-container">
      <div className="recent-table-header">
        <h3 className="recent-table-title">{title}</h3>
        <div className="recent-table-actions">
          <div className="recent-table-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to={viewAllLink} className="recent-table-view-all">
            Все
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="recent-table-wrapper">
        <table className="recent-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Страна</th>
              <th>Статус</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="recent-table-empty">
                  Нет результатов
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="recent-table-user">
                      <div className="recent-table-avatar">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="recent-table-user-info">
                        <span className="recent-table-name">{item.name}</span>
                        <span className="recent-table-email">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="recent-table-country">
                      <span className="flag">{getFlagEmoji(item.countryCode)}</span>
                      {item.country}
                    </span>
                  </td>
                  <td>
                    <span className={`recent-table-status ${statusConfig[item.status].class}`}>
                      {statusConfig[item.status].label}
                    </span>
                  </td>
                  <td>
                    <span className="recent-table-date">{formatDate(item.date)}</span>
                  </td>
                  <td>
                    <Link to={`/admin/registrations/${item.id}`} className="recent-table-action-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
