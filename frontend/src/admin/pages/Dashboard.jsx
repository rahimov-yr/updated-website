import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useApi'
import StatCard from '../components/StatCard/StatCard'
import TrendLineChart from '../components/Charts/LineChart'
import StatsBarChart from '../components/Charts/BarChart'
import RecentTable from '../components/RecentTable/RecentTable'
import './Dashboard.css'

const MONTH_NAMES = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState([])
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const { getStats, getTrends, getRecentRegistrations, loading, error } = useDashboard()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [statsData, trendsData, recentData] = await Promise.all([
        getStats(),
        getTrends().catch(() => []),
        getRecentRegistrations(5).catch(() => ({ items: [] })),
      ])
      setStats(statsData)
      setTrends(trendsData)
      setRecentRegistrations(recentData.items || [])
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  if (loading && !stats) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <span>Загрузка панели управления...</span>
      </div>
    )
  }

  const lineChartData = trends.map(t => ({
    name: MONTH_NAMES[t.month.split('-')[1]] || t.month,
    value: t.total,
  }))

  const barChartData = trends.map(t => ({
    name: MONTH_NAMES[t.month.split('-')[1]] || t.month,
    pending: t.pending,
    approved: t.approved,
  }))

  const recentTableData = recentRegistrations.map(r => ({
    id: r.id,
    name: `${r.first_name} ${r.last_name}`,
    email: r.email,
    country: r.country,
    countryCode: r.country,
    status: r.status,
    date: r.created_at || '',
  }))

  const statCards = [
    {
      title: 'Всего новостей',
      value: stats?.total_news || 0,
      subtitle: `${stats?.total_news || 0} опубликовано`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      color: '#2d5a87',
      link: '/admin/content/news'
    },
    {
      title: 'Спикеры',
      value: stats?.total_speakers || 0,
      subtitle: `${stats?.total_speakers || 0} всего`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      color: '#6366f1',
      link: '/admin/home/speakers'
    },
    {
      title: 'Партнёры',
      value: stats?.total_partners || 0,
      subtitle: `${stats?.total_partners || 0} всего`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.22 19.85c-.18.18-.5.21-.71 0L5.66 14a2.5 2.5 0 0 1 0-3.54l6.36-6.36c.2-.2.51-.2.71 0l6.36 6.36a2.5 2.5 0 0 1 0 3.54l-6.87 5.85z"/>
        </svg>
      ),
      color: '#f59e0b',
      link: '/admin/home/partners'
    },
    {
      title: 'Регистрации',
      value: stats?.total_registrations || 0,
      subtitle: `${stats?.pending_registrations || 0} ожидают`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      color: '#10b981',
      link: '/admin/registrations'
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Панель управления</h1>
          <p className="dashboard-subtitle">Обзор активности и статистики</p>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>Не удалось загрузить статистику.</span>
          <button onClick={loadStats}>Повторить</button>
        </div>
      )}

      <div className="dashboard-stats-grid">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            link={card.link}
          />
        ))}
      </div>

      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <TrendLineChart
            title="Тренд регистраций"
            data={lineChartData.length > 0 ? lineChartData : undefined}
            height={280}
            color="#2d5a87"
          />
        </div>
        <div className="dashboard-chart-card">
          <StatsBarChart
            title="Статистика по месяцам"
            data={barChartData.length > 0 ? barChartData : undefined}
            height={280}
          />
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-table-section">
          <RecentTable
            title="Последние регистрации"
            data={recentTableData.length > 0 ? recentTableData : undefined}
            viewAllLink="/admin/registrations"
          />
        </div>

        <div className="dashboard-side-section">
          <div className="dashboard-card dashboard-quick-actions-card">
            <h3 className="dashboard-card-title">Быстрые действия</h3>
            <div className="dashboard-quick-actions">
              <Link to="/admin/content/news" className="dashboard-quick-action">
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(45, 90, 135, 0.1)', color: '#2d5a87' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <span>Добавить новость</span>
              </Link>
              <Link to="/admin/home/speakers" className="dashboard-quick-action">
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span>Добавить спикера</span>
              </Link>
              <Link to="/admin/registrations" className="dashboard-quick-action">
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <span>Регистрации</span>
              </Link>
              <Link to="/admin/settings" className="dashboard-quick-action">
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                </div>
                <span>Настройки</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-card dashboard-info-card">
            <h3 className="dashboard-card-title">Информация о конференции</h3>
            <div className="dashboard-info-list">
              <div className="dashboard-info-item">
                <div className="dashboard-info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                  </svg>
                </div>
                <div className="dashboard-info-content">
                  <span className="dashboard-info-label">Дата мероприятия</span>
                  <span className="dashboard-info-value">25-28 мая, 2026</span>
                </div>
              </div>
              <div className="dashboard-info-item">
                <div className="dashboard-info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="dashboard-info-content">
                  <span className="dashboard-info-label">Место проведения</span>
                  <span className="dashboard-info-value">Кохи Сомон, Душанбе</span>
                </div>
              </div>
              <div className="dashboard-info-item">
                <div className="dashboard-info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="dashboard-info-content">
                  <span className="dashboard-info-label">Ожидаемые участники</span>
                  <span className="dashboard-info-value">150+ стран</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card dashboard-overview-card">
            <h3 className="dashboard-card-title">Обзор регистраций</h3>
            <div className="dashboard-overview-stats">
              <div className="dashboard-overview-stat">
                <div className="dashboard-overview-value">{stats?.pending_registrations || 0}</div>
                <div className="dashboard-overview-label">На рассмотрении</div>
                <div className="dashboard-overview-bar">
                  <div
                    className="dashboard-overview-bar-fill warning"
                    style={{ width: `${Math.min((stats?.pending_registrations || 0) / (stats?.total_registrations || 1) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="dashboard-overview-stat">
                <div className="dashboard-overview-value">{stats?.approved_registrations || 0}</div>
                <div className="dashboard-overview-label">Одобренные</div>
                <div className="dashboard-overview-bar">
                  <div
                    className="dashboard-overview-bar-fill success"
                    style={{ width: `${Math.min((stats?.approved_registrations || 0) / (stats?.total_registrations || 1) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="dashboard-overview-stat">
                <div className="dashboard-overview-value">{stats?.total_countries || 0}</div>
                <div className="dashboard-overview-label">Страны</div>
                <div className="dashboard-overview-bar">
                  <div
                    className="dashboard-overview-bar-fill info"
                    style={{ width: `${Math.min((stats?.total_countries || 0) / 150 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
