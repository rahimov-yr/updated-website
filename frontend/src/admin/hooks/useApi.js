import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useApi() {
  const { token, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        logout()
        throw new Error('Session expired. Please login again.')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token, logout])

  const get = useCallback((endpoint) => request(endpoint), [request])

  const post = useCallback((endpoint, data) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(data) }), [request])

  const put = useCallback((endpoint, data) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(data) }), [request])

  const del = useCallback((endpoint) =>
    request(endpoint, { method: 'DELETE' }), [request])

  return { get, post, put, del, loading, error, setError }
}

// Specific API hooks
export function useNews() {
  const api = useApi()

  return {
    ...api,
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return api.get(`/api/admin/news${query ? `?${query}` : ''}`)
    },
    getById: (id) => api.get(`/api/admin/news/${id}`),
    create: (data) => api.post('/api/admin/news', data),
    update: (id, data) => api.put(`/api/admin/news/${id}`, data),
    remove: (id) => api.del(`/api/admin/news/${id}`),
  }
}

export function useSpeakers() {
  const api = useApi()

  return {
    ...api,
    list: () => api.get('/api/admin/speakers'),
    create: (data) => api.post('/api/admin/speakers', data),
    update: (id, data) => api.put(`/api/admin/speakers/${id}`, data),
    remove: (id) => api.del(`/api/admin/speakers/${id}`),
  }
}

export function usePartners() {
  const api = useApi()

  return {
    ...api,
    list: () => api.get('/api/admin/partners'),
    create: (data) => api.post('/api/admin/partners', data),
    update: (id, data) => api.put(`/api/admin/partners/${id}`, data),
    remove: (id) => api.del(`/api/admin/partners/${id}`),
  }
}

export function useRegistrations() {
  const api = useApi()

  return {
    ...api,
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return api.get(`/api/admin/registrations${query ? `?${query}` : ''}`)
    },
    updateStatus: (id, status) => api.put(`/api/admin/registrations/${id}/status`, { status }),
    remove: (id) => api.del(`/api/admin/registrations/${id}`),
  }
}

export function useSettings() {
  const api = useApi()

  return {
    ...api,
    list: () => api.get('/api/admin/settings'),
    update: (keyOrSettings, value) => {
      // Support update(key, value), update({key: value, ...}), and update([{key, value}, ...])
      if (typeof keyOrSettings === 'string') {
        // Single key-value update
        return api.put('/api/admin/settings', {
          settings: [{ key: keyOrSettings, value: value }]
        })
      } else if (Array.isArray(keyOrSettings)) {
        // Array of {key, value} objects - pass directly
        return api.put('/api/admin/settings', { settings: keyOrSettings })
      } else {
        // Object - convert entries to array
        const settingsArray = Object.entries(keyOrSettings).map(([key, value]) => ({
          key,
          value
        }))
        return api.put('/api/admin/settings', { settings: settingsArray })
      }
    },
  }
}

export function useDashboard() {
  const api = useApi()

  return {
    ...api,
    getStats: () => api.get('/api/admin/dashboard'),
    getTrends: () => api.get('/api/admin/dashboard/trends'),
    getRecentRegistrations: (limit = 5) => api.get(`/api/admin/registrations?limit=${limit}`),
  }
}

export function useUpload() {
  const { token, logout } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const upload = useCallback(async (file) => {
    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401) {
        logout()
        throw new Error('Session expired. Please login again.')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Upload failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      setUploadError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }, [token, logout])

  return { upload, uploading, uploadError, setUploadError }
}
