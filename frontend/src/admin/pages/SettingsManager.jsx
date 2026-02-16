import { useState, useEffect } from 'react'
import { useSettings } from '../hooks/useApi'

export default function SettingsManager() {
  const [settings, setSettings] = useState([])
  const [editedSettings, setEditedSettings] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  const { list, update, loading } = useSettings()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await list()
      setSettings(data)
      const initial = {}
      data.forEach((s) => {
        initial[s.setting_key] = s.setting_value
      })
      setEditedSettings(initial)
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleChange = (key, value) => {
    setEditedSettings({ ...editedSettings, [key]: value })
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      const settingsArray = Object.entries(editedSettings).map(([key, value]) => ({
        key,
        value,
      }))
      await update(settingsArray)
      setHasChanges(false)
      loadSettings()
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  const settingsGroups = {
    conference: {
      title: 'Информация о конференции',
      keys: ['conference_name_ru', 'conference_name_en', 'conference_name_tj', 'conference_dates'],
    },
    location: {
      title: 'Место проведения',
      keys: ['conference_location_ru', 'conference_location_en', 'conference_location_tj'],
    },
    contact: {
      title: 'Контактная информация',
      keys: ['contact_email', 'contact_phone', 'contact_address_ru', 'contact_address_en', 'contact_address_tj'],
    },
  }

  const getLabel = (key) => {
    const labels = {
      conference_name_ru: 'Название конференции (Русский)',
      conference_name_en: 'Название конференции (Английский)',
      conference_name_tj: 'Название конференции (Таджикский)',
      conference_dates: 'Даты конференции',
      conference_location_ru: 'Место проведения (Русский)',
      conference_location_en: 'Место проведения (Английский)',
      conference_location_tj: 'Место проведения (Таджикский)',
      contact_email: 'Email',
      contact_phone: 'Телефон',
      contact_address_ru: 'Адрес (Русский)',
      contact_address_en: 'Адрес (Английский)',
      contact_address_tj: 'Адрес (Таджикский)',
    }
    return labels[key] || key
  }

  return (
    <div className="settings-manager">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Настройки сайта</h1>
        {hasChanges && (
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        )}
      </div>

      {loading && settings.length === 0 && (
        <div className="admin-loading">Загрузка...</div>
      )}

      {Object.entries(settingsGroups).map(([groupKey, group]) => (
        <div key={groupKey} className="admin-card" style={{ marginBottom: '24px' }}>
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            {group.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {group.keys.map((key) => (
              <div key={key} className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-form-label">{getLabel(key)}</label>
                {key.includes('name') || key.includes('address') ? (
                  <textarea
                    className="admin-form-textarea"
                    value={editedSettings[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows="2"
                  />
                ) : (
                  <input
                    type={key === 'contact_email' ? 'email' : 'text'}
                    className="admin-form-input"
                    value={editedSettings[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {settings.length > 0 && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            Все настройки
          </h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ключ</th>
                <th>Значение</th>
                <th>Последнее обновление</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.id}>
                  <td>
                    <code style={{ background: '#f0f2f5', padding: '4px 8px', borderRadius: '4px' }}>
                      {setting.setting_key}
                    </code>
                  </td>
                  <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {setting.setting_value}
                  </td>
                  <td>{setting.updated_at?.split('T')[0] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
