import { useState, useEffect } from 'react'
import { usePartners } from '../hooks/useApi'

export default function PartnersManager() {
  const [partners, setPartners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const { list, create, update, remove, loading } = usePartners()

  const [form, setForm] = useState({
    name: '',
    logo: '/assets/images/partner-default.png',
    website: '',
    partner_type: 'partner',
    sort_order: 0,
  })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const data = await list()
      setPartners(data)
    } catch (err) {
      console.error('Failed to load partners:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await update(editingItem.id, form)
      } else {
        await create(form)
      }
      setShowModal(false)
      resetForm()
      loadPartners()
    } catch (err) {
      console.error('Failed to save partner:', err)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      logo: item.logo,
      website: item.website || '',
      partner_type: item.partner_type,
      sort_order: item.sort_order,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await remove(id)
        loadPartners()
      } catch (err) {
        console.error('Failed to delete partner:', err)
      }
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setForm({
      name: '',
      logo: '/assets/images/partner-default.png',
      website: '',
      partner_type: 'partner',
      sort_order: partners.length,
    })
  }

  const getTypeBadge = (type) => {
    const badges = {
      organizer: 'info',
      partner: 'success',
      media: 'warning',
    }
    return badges[type] || 'info'
  }

  return (
    <div className="partners-manager">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Partners Management</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
        >
          + Add Partner
        </button>
      </div>

      <div className="admin-card">
        {loading && <div className="admin-loading">Loading...</div>}

        {!loading && partners.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">🤝</div>
            <p>No partners found</p>
          </div>
        )}

        {!loading && partners.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Type</th>
                <th>Website</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.logo}
                        alt=""
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'contain',
                          background: '#f0f2f5',
                          borderRadius: '8px',
                          padding: '4px',
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${getTypeBadge(item.partner_type)}`}>
                      {item.partner_type}
                    </span>
                  </td>
                  <td>
                    {item.website ? (
                      <a href={item.website} target="_blank" rel="noopener noreferrer">
                        {item.website.replace(/^https?:\/\//, '').substring(0, 30)}...
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingItem ? 'Edit Partner' : 'Add Partner'}
              </h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Partner Name</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Partner Organization Name"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Logo URL</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="/assets/images/..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Website URL</label>
                  <input
                    type="url"
                    className="admin-form-input"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Partner Type</label>
                    <select
                      className="admin-form-select"
                      value={form.partner_type}
                      onChange={(e) => setForm({ ...form, partner_type: e.target.value })}
                    >
                      <option value="organizer">Organizer</option>
                      <option value="partner">Partner</option>
                      <option value="media">Media Partner</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
