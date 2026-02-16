import { useState, useEffect } from 'react'
import { useSpeakers } from '../hooks/useApi'

export default function SpeakersManager() {
  const [speakers, setSpeakers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('ru')

  const { list, create, update, remove, loading } = useSpeakers()

  const [form, setForm] = useState({
    name_ru: '',
    name_en: '',
    name_tj: '',
    title_ru: '',
    title_en: '',
    title_tj: '',
    image: '/assets/images/speaker-default.png',
    flag_url: '',
    flag_alt_ru: '',
    flag_alt_en: '',
    flag_alt_tj: '',
    sort_order: 0,
  })

  useEffect(() => {
    loadSpeakers()
  }, [])

  const loadSpeakers = async () => {
    try {
      const data = await list()
      setSpeakers(data)
    } catch (err) {
      console.error('Failed to load speakers:', err)
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
      loadSpeakers()
    } catch (err) {
      console.error('Failed to save speaker:', err)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      name_ru: item.name_ru,
      name_en: item.name_en,
      name_tj: item.name_tj,
      title_ru: item.title_ru,
      title_en: item.title_en,
      title_tj: item.title_tj,
      image: item.image,
      flag_url: item.flag_url || '',
      flag_alt_ru: item.flag_alt_ru || '',
      flag_alt_en: item.flag_alt_en || '',
      flag_alt_tj: item.flag_alt_tj || '',
      sort_order: item.sort_order,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      try {
        await remove(id)
        loadSpeakers()
      } catch (err) {
        console.error('Failed to delete speaker:', err)
      }
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setForm({
      name_ru: '',
      name_en: '',
      name_tj: '',
      title_ru: '',
      title_en: '',
      title_tj: '',
      image: '/assets/images/speaker-default.png',
      flag_url: '',
      flag_alt_ru: '',
      flag_alt_en: '',
      flag_alt_tj: '',
      sort_order: speakers.length,
    })
    setActiveTab('ru')
  }

  return (
    <div className="speakers-manager">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Speakers Management</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
        >
          + Add Speaker
        </button>
      </div>

      <div className="admin-card">
        {loading && <div className="admin-loading">Loading...</div>}

        {!loading && speakers.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">🎤</div>
            <p>No speakers found</p>
          </div>
        )}

        {!loading && speakers.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Speaker</th>
                <th>Title</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.name_en}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.name_ru}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{item.title_en}</div>
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
                {editingItem ? 'Edit Speaker' : 'Add Speaker'}
              </h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/assets/images/speaker-..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Flag URL</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.flag_url}
                      onChange={(e) => setForm({ ...form, flag_url: e.target.value })}
                      placeholder="https://flagcdn.com/w80/..."
                    />
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

                <div className="admin-tabs">
                  {['ru', 'en', 'tj'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`admin-tab ${activeTab === lang ? 'active' : ''}`}
                      onClick={() => setActiveTab(lang)}
                    >
                      {lang === 'ru' ? 'Russian' : lang === 'en' ? 'English' : 'Tajik'}
                    </button>
                  ))}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Name ({activeTab === 'ru' ? 'Russian' : activeTab === 'en' ? 'English' : 'Tajik'})
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form[`name_${activeTab}`]}
                    onChange={(e) => setForm({ ...form, [`name_${activeTab}`]: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Title ({activeTab === 'ru' ? 'Russian' : activeTab === 'en' ? 'English' : 'Tajik'})
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form[`title_${activeTab}`]}
                    onChange={(e) => setForm({ ...form, [`title_${activeTab}`]: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Flag Alt Text ({activeTab === 'ru' ? 'Russian' : activeTab === 'en' ? 'English' : 'Tajik'})
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form[`flag_alt_${activeTab}`]}
                    onChange={(e) => setForm({ ...form, [`flag_alt_${activeTab}`]: e.target.value })}
                  />
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
