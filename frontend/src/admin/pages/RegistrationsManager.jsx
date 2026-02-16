import { useState, useEffect } from 'react'
import { useRegistrations } from '../hooks/useApi'
import './RegistrationsManager.css'

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  const { list, updateStatus, remove, loading } = useRegistrations()

  useEffect(() => {
    loadRegistrations()
  }, [pagination.page, search, statusFilter])

  const loadRegistrations = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: 20,
      }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const data = await list(params)
      setRegistrations(data.items)
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.total_pages,
      })
    } catch (err) {
      console.error('Failed to load registrations:', err)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status)
      loadRegistrations()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту регистрацию?')) {
      try {
        await remove(id)
        loadRegistrations()
      } catch (err) {
        console.error('Failed to delete registration:', err)
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      cancelled: 'info',
    }
    return badges[status] || 'info'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'На рассмотрении',
      approved: 'Одобрено',
      rejected: 'Отклонено',
      cancelled: 'Отменено',
    }
    return labels[status] || status
  }

  return (
    <div className="registrations-manager">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Регистрации</h1>
        <div className="registrations-stats">
          <span className="reg-stat">Всего: {pagination.total}</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="registrations-filters">
          <input
            type="text"
            className="admin-form-input"
            placeholder="Поиск по имени, email, организации..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <select
            className="admin-form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобрено</option>
            <option value="rejected">Отклонено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>

        {loading && <div className="admin-loading">Загрузка...</div>}

        {!loading && registrations.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📋</div>
            <p>Регистрации не найдены</p>
          </div>
        )}

        {!loading && registrations.length > 0 && (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Организация</th>
                  <th>Страна</th>
                  <th>Тип</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div className="reg-name">
                        {reg.first_name} {reg.last_name}
                      </div>
                    </td>
                    <td>{reg.email}</td>
                    <td>{reg.organization || '-'}</td>
                    <td>{reg.country}</td>
                    <td>
                      <span className="reg-type">{reg.participation_type}</span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${getStatusBadge(reg.status)}`}>
                        {getStatusLabel(reg.status)}
                      </span>
                    </td>
                    <td>{reg.created_at?.split('T')[0]}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => setSelectedRegistration(reg)}
                        >
                          Просмотр
                        </button>
                        {reg.status === 'pending' && (
                          <button
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleStatusChange(reg.id, 'approved')}
                          >
                            Одобрить
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Назад
                </button>
                <span className="admin-pagination-info">
                  Страница {pagination.page} из {pagination.totalPages}
                </span>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Вперёд
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedRegistration && (
        <div className="admin-modal-overlay" onClick={() => setSelectedRegistration(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Детали регистрации</h2>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedRegistration(null)}
              >
                &times;
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="reg-detail-grid">
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Полное имя</span>
                  <span className="reg-detail-value">
                    {selectedRegistration.first_name} {selectedRegistration.last_name}
                  </span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Email</span>
                  <span className="reg-detail-value">{selectedRegistration.email}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Телефон</span>
                  <span className="reg-detail-value">{selectedRegistration.phone || '-'}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Организация</span>
                  <span className="reg-detail-value">{selectedRegistration.organization || '-'}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Должность</span>
                  <span className="reg-detail-value">{selectedRegistration.position || '-'}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Страна</span>
                  <span className="reg-detail-value">{selectedRegistration.country}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Тип участия</span>
                  <span className="reg-detail-value">{selectedRegistration.participation_type}</span>
                </div>
                <div className="reg-detail-item">
                  <span className="reg-detail-label">Статус</span>
                  <span className={`admin-badge admin-badge-${getStatusBadge(selectedRegistration.status)}`}>
                    {getStatusLabel(selectedRegistration.status)}
                  </span>
                </div>
                {selectedRegistration.dietary_requirements && (
                  <div className="reg-detail-item reg-detail-full">
                    <span className="reg-detail-label">Диетические требования</span>
                    <span className="reg-detail-value">{selectedRegistration.dietary_requirements}</span>
                  </div>
                )}
                {selectedRegistration.accessibility_needs && (
                  <div className="reg-detail-item reg-detail-full">
                    <span className="reg-detail-label">Особые потребности</span>
                    <span className="reg-detail-value">{selectedRegistration.accessibility_needs}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <select
                className="admin-form-select"
                value={selectedRegistration.status}
                onChange={(e) => {
                  handleStatusChange(selectedRegistration.id, e.target.value)
                  setSelectedRegistration({ ...selectedRegistration, status: e.target.value })
                }}
                style={{ marginRight: 'auto' }}
              >
                <option value="pending">На рассмотрении</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
                <option value="cancelled">Отменено</option>
              </select>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => {
                  handleDelete(selectedRegistration.id)
                  setSelectedRegistration(null)
                }}
              >
                Удалить
              </button>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedRegistration(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
