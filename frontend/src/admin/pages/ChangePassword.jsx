import { useState } from 'react'
import { useApi } from '../hooks/useApi'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const { post, loading } = useApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 6) {
      setMessage('Новый пароль должен быть не менее 6 символов')
      setMessageType('error')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают')
      setMessageType('error')
      return
    }

    try {
      await post('/api/admin/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      setMessage('Пароль успешно изменён')
      setMessageType('success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage(err.message || 'Ошибка при смене пароля')
      setMessageType('error')
    }
  }

  return (
    <div className="change-password-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Смена пароля</h1>
      </div>

      <div className="admin-card" style={{ maxWidth: '500px' }}>
        <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
          Изменить пароль администратора
        </h3>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              background: messageType === 'success' ? '#e6f7ee' : '#fde8e8',
              color: messageType === 'success' ? '#0d7a3e' : '#c0392b',
              border: `1px solid ${messageType === 'success' ? '#b7ebd0' : '#f5c6cb'}`,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-form-label">Текущий пароль</label>
              <input
                type="password"
                className="admin-form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-form-label">Новый пароль</label>
              <input
                type="password"
                className="admin-form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', display: 'block' }}>
                Минимум 6 символов
              </span>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-form-label">Подтвердите новый пароль</label>
              <input
                type="password"
                className="admin-form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              style={{ marginTop: '8px', alignSelf: 'flex-start' }}
            >
              {loading ? 'Сохранение...' : 'Изменить пароль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
