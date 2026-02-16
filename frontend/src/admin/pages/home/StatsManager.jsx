import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function StatsManager() {
  const { token } = useAuth()
  const [saveStatus, setSaveStatus] = useState(null)
  const [programStats, setProgramStats] = useState({
    days: '4',
    sessions: '20+',
    speakers_count: '150+'
  })

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })
      if (settings.program_days) setProgramStats(prev => ({ ...prev, days: settings.program_days }))
      if (settings.program_sessions) setProgramStats(prev => ({ ...prev, sessions: settings.program_sessions }))
      if (settings.program_speakers) setProgramStats(prev => ({ ...prev, speakers_count: settings.program_speakers }))
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: [
            { key: 'program_days', value: programStats.days },
            { key: 'program_sessions', value: programStats.sessions },
            { key: 'program_speakers', value: programStats.speakers_count },
          ]
        })
      })
      setSaveStatus({ type: 'success', message: 'Статистика сохранена!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  return (
    <div className="section-panel">
      <div className="section-panel-header">
        <div>
          <h2>Статистика программы</h2>
          <p>Настройка показателей статистики на главной странице</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>Сохранить изменения</button>
      </div>

      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`} style={{ marginBottom: '20px' }}>
          {saveStatus.type === 'saving' && (
            <svg className="save-status-spinner" viewBox="0 0 24 24" width="18" height="18">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
            </svg>
          )}
          {saveStatus.type === 'success' && (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
          {saveStatus.type === 'error' && (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>×</button>
        </div>
      )}

      <div className="form-section">
        <h3 className="form-section-title">Показатели конференции</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Количество дней</label>
            <input type="text" value={programStats.days} onChange={(e) => setProgramStats({...programStats, days: e.target.value})} placeholder="4" />
          </div>
          <div className="form-group">
            <label>Количество сессий</label>
            <input type="text" value={programStats.sessions} onChange={(e) => setProgramStats({...programStats, sessions: e.target.value})} placeholder="20+" />
          </div>
          <div className="form-group">
            <label>Количество спикеров</label>
            <input type="text" value={programStats.speakers_count} onChange={(e) => setProgramStats({...programStats, speakers_count: e.target.value})} placeholder="150+" />
          </div>
        </div>
      </div>
    </div>
  )
}
