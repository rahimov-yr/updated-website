import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import './HomePageManager.css'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function HomePageManager() {
  const { token } = useAuth()
  const [activeSection, setActiveSection] = useState('hero')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  // Hero Section State
  const [heroData, setHeroData] = useState({
    video_url: '/assets/video/hero-background.mp4',
    youtube_url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
    video_source: 'url', // 'url' or 'upload'
    title_ru: '4-ая МЕЖДУНАРОДНАЯ КОНФЕРЕНЦИЯ ВЫСОКОГО УРОВНЯ ПО МЕЖДУНАРОДНОМУ ДЕСЯТИЛЕТИЮ ДЕЙСТВИЙ «ВОДА ДЛЯ УСТОЙЧИВОГО РАЗВИТИЯ»',
    title_en: '4th HIGH-LEVEL INTERNATIONAL CONFERENCE ON THE INTERNATIONAL DECADE FOR ACTION "WATER FOR SUSTAINABLE DEVELOPMENT"',
    title_tj: 'КОНФРОНСИ БАЙНАЛМИЛАЛИИ 4-УМИ САТҲИ БАЛАНД ОИДИ ДАҲСОЛАИ БАЙНАЛМИЛАЛИИ АМАЛ «ОБ БАРОИ РУШДИ УСТУВОР»',
    dates_ru: '25-28 мая 2026',
    dates_en: 'May 25-28, 2026',
    dates_tj: '25-28 майи 2026',
    location_ru: 'Кохи Сомон, Душанбе',
    location_en: 'Kohi Somon, Dushanbe',
    location_tj: 'Коҳи Сомон, Душанбе',
    quote_ru: '«Вода — это основа жизни и устойчивого развития. Мы должны объединить усилия для её сохранения.»',
    quote_en: '"Water is the foundation of life and sustainable development. We must unite efforts for its preservation."',
    quote_tj: '«Об асоси ҳаёт ва рушди устувор аст. Мо бояд кӯшишҳои худро барои нигоҳдории он муттаҳид созем.»',
    quote_author_ru: 'Эмомали Рахмон',
    quote_author_en: 'Emomali Rahmon',
    quote_author_tj: 'Эмомалӣ Раҳмон',
    registration_btn_ru: 'Регистрация',
    registration_btn_en: 'Registration',
    registration_btn_tj: 'Бақайдгирӣ',
    video_btn_ru: 'Видео презентация',
    video_btn_en: 'Video Presentation',
    video_btn_tj: 'Видео муаррифӣ',
    scroll_down_ru: 'Прокрутите вниз',
    scroll_down_en: 'Scroll down',
    scroll_down_tj: 'Ба поён ғелонед',
  })
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Video compression state
  const [compressionState, setCompressionState] = useState({
    isProcessing: false,
    stage: '', // 'analyzing', 'compressing', 'uploading', 'complete', 'error'
    progress: 0,
    originalSize: 0,
    compressedSize: 0,
    fileName: '',
    errorMessage: ''
  })

  // Speakers State
  const [speakers, setSpeakers] = useState([])
  const [editingSpeaker, setEditingSpeaker] = useState(null)
  const [speakerForm, setSpeakerForm] = useState({
    name_ru: '', name_en: '', name_tj: '',
    title_ru: '', title_en: '', title_tj: '',
    image: '/assets/images/speaker-default.png',
    image_source: 'url', // 'url' or 'upload'
    image_position: 'center center', // CSS object-position value
    flag_url: '', flag_alt_ru: '', flag_alt_en: '', flag_alt_tj: '',
    sort_order: 0
  })
  const [uploadingSpeakerImage, setUploadingSpeakerImage] = useState(false)
  const [isDraggingPosition, setIsDraggingPosition] = useState(false)
  const imagePositionRef = useRef(null)

  // News State
  const [news, setNews] = useState([])
  const [editingNews, setEditingNews] = useState(null)

  // Partners State
  const [partners, setPartners] = useState([])
  const [editingPartner, setEditingPartner] = useState(null)
  const [partnerForm, setPartnerForm] = useState({
    name: '', logo: '/assets/images/partner-default.png',
    website: '', partner_type: 'partner', sort_order: 0
  })

  // Program Stats State
  const [programStats, setProgramStats] = useState({
    days: '4', sessions: '20+', speakers_count: '150+'
  })

  // App Section State
  const [appData, setAppData] = useState({
    app_store_url: '#',
    google_play_url: '#',
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadSpeakers(),
        loadNews(),
        loadPartners(),
        loadSettings()
      ])
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const loadSpeakers = async () => {
    try {
      const data = await apiRequest('/api/admin/speakers')
      setSpeakers(data)
    } catch (err) {
      console.error('Failed to load speakers:', err)
    }
  }

  const loadNews = async () => {
    try {
      const data = await apiRequest('/api/admin/news')
      setNews(data.slice(0, 6)) // Only show first 6 for home page
    } catch (err) {
      console.error('Failed to load news:', err)
    }
  }

  const loadPartners = async () => {
    try {
      const data = await apiRequest('/api/admin/partners')
      setPartners(data)
    } catch (err) {
      console.error('Failed to load partners:', err)
    }
  }

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/api/admin/settings')
      const settings = {}
      data.forEach(s => { settings[s.setting_key] = s.setting_value })

      // Hero settings
      if (settings.hero_video_url) setHeroData(prev => ({ ...prev, video_url: settings.hero_video_url }))
      if (settings.hero_youtube_url) setHeroData(prev => ({ ...prev, youtube_url: settings.hero_youtube_url }))
      if (settings.hero_video_source) setHeroData(prev => ({ ...prev, video_source: settings.hero_video_source }))
      if (settings.hero_title_ru) setHeroData(prev => ({ ...prev, title_ru: settings.hero_title_ru }))
      if (settings.hero_title_en) setHeroData(prev => ({ ...prev, title_en: settings.hero_title_en }))
      if (settings.hero_title_tj) setHeroData(prev => ({ ...prev, title_tj: settings.hero_title_tj }))
      if (settings.hero_dates_ru) setHeroData(prev => ({ ...prev, dates_ru: settings.hero_dates_ru }))
      if (settings.hero_dates_en) setHeroData(prev => ({ ...prev, dates_en: settings.hero_dates_en }))
      if (settings.hero_dates_tj) setHeroData(prev => ({ ...prev, dates_tj: settings.hero_dates_tj }))
      if (settings.hero_location_ru) setHeroData(prev => ({ ...prev, location_ru: settings.hero_location_ru }))
      if (settings.hero_location_en) setHeroData(prev => ({ ...prev, location_en: settings.hero_location_en }))
      if (settings.hero_location_tj) setHeroData(prev => ({ ...prev, location_tj: settings.hero_location_tj }))
      if (settings.hero_quote_ru) setHeroData(prev => ({ ...prev, quote_ru: settings.hero_quote_ru }))
      if (settings.hero_quote_en) setHeroData(prev => ({ ...prev, quote_en: settings.hero_quote_en }))
      if (settings.hero_quote_tj) setHeroData(prev => ({ ...prev, quote_tj: settings.hero_quote_tj }))
      if (settings.hero_quote_author_ru) setHeroData(prev => ({ ...prev, quote_author_ru: settings.hero_quote_author_ru }))
      if (settings.hero_quote_author_en) setHeroData(prev => ({ ...prev, quote_author_en: settings.hero_quote_author_en }))
      if (settings.hero_quote_author_tj) setHeroData(prev => ({ ...prev, quote_author_tj: settings.hero_quote_author_tj }))
      if (settings.hero_registration_btn_ru) setHeroData(prev => ({ ...prev, registration_btn_ru: settings.hero_registration_btn_ru }))
      if (settings.hero_registration_btn_en) setHeroData(prev => ({ ...prev, registration_btn_en: settings.hero_registration_btn_en }))
      if (settings.hero_registration_btn_tj) setHeroData(prev => ({ ...prev, registration_btn_tj: settings.hero_registration_btn_tj }))
      if (settings.hero_video_btn_ru) setHeroData(prev => ({ ...prev, video_btn_ru: settings.hero_video_btn_ru }))
      if (settings.hero_video_btn_en) setHeroData(prev => ({ ...prev, video_btn_en: settings.hero_video_btn_en }))
      if (settings.hero_video_btn_tj) setHeroData(prev => ({ ...prev, video_btn_tj: settings.hero_video_btn_tj }))
      if (settings.hero_scroll_down_ru) setHeroData(prev => ({ ...prev, scroll_down_ru: settings.hero_scroll_down_ru }))
      if (settings.hero_scroll_down_en) setHeroData(prev => ({ ...prev, scroll_down_en: settings.hero_scroll_down_en }))
      if (settings.hero_scroll_down_tj) setHeroData(prev => ({ ...prev, scroll_down_tj: settings.hero_scroll_down_tj }))

      // App settings
      if (settings.app_store_url) setAppData(prev => ({ ...prev, app_store_url: settings.app_store_url }))
      if (settings.google_play_url) setAppData(prev => ({ ...prev, google_play_url: settings.google_play_url }))

      // Program stats
      if (settings.program_days) setProgramStats(prev => ({ ...prev, days: settings.program_days }))
      if (settings.program_sessions) setProgramStats(prev => ({ ...prev, sessions: settings.program_sessions }))
      if (settings.program_speakers) setProgramStats(prev => ({ ...prev, speakers_count: settings.program_speakers }))
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const saveSettings = async (settingsToSave) => {
    setSaveStatus('saving')
    try {
      const settingsArray = Object.entries(settingsToSave).map(([key, value]) => ({ key, value }))
      await apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsArray })
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaveStatus('error')
    }
  }

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Compress video using canvas
  const compressVideo = async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true

      video.onloadedmetadata = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Calculate target dimensions (max 1280px width, maintain aspect ratio)
        const maxWidth = 1280
        const maxHeight = 720
        let width = video.videoWidth
        let height = video.videoHeight

        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        // Get video duration
        const duration = video.duration
        const fps = 24
        const frameCount = Math.floor(duration * fps)
        const frameInterval = 1 / fps

        // Prepare MediaRecorder
        const stream = canvas.captureStream(fps)
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 1500000 // 1.5 Mbps
        })

        const chunks = []
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' })
          resolve(blob)
        }

        mediaRecorder.onerror = (e) => reject(e)

        // Start recording
        mediaRecorder.start()

        // Process frames
        let currentFrame = 0
        video.currentTime = 0

        const processFrame = () => {
          if (currentFrame >= frameCount || video.currentTime >= duration) {
            mediaRecorder.stop()
            return
          }

          ctx.drawImage(video, 0, 0, width, height)
          currentFrame++
          onProgress(Math.round((currentFrame / frameCount) * 100))

          video.currentTime = currentFrame * frameInterval
        }

        video.onseeked = processFrame
        video.currentTime = 0
      }

      video.onerror = () => reject(new Error('Failed to load video'))
      video.src = URL.createObjectURL(file)
    })
  }

  // Simple compression fallback - just reduce quality via re-encoding
  const simpleCompressVideo = async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true

      video.onloadeddata = async () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Calculate target dimensions
          const maxWidth = 1280
          let width = video.videoWidth
          let height = video.videoHeight

          if (width > maxWidth) {
            height = Math.round((maxWidth / width) * height)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const stream = canvas.captureStream(24)

          // Check for audio tracks
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()

          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
              ? 'video/webm;codecs=vp9'
              : 'video/webm',
            videoBitsPerSecond: 1500000
          })

          const chunks = []
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data)
          }

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            URL.revokeObjectURL(video.src)
            resolve(blob)
          }

          mediaRecorder.onerror = reject

          // Play and record
          mediaRecorder.start(100)

          const duration = video.duration
          let lastProgress = 0

          const updateProgress = () => {
            const progress = Math.round((video.currentTime / duration) * 100)
            if (progress !== lastProgress) {
              lastProgress = progress
              onProgress(progress)
            }
            if (!video.ended && !video.paused) {
              requestAnimationFrame(updateProgress)
            }
          }

          const drawFrame = () => {
            if (!video.ended && !video.paused) {
              ctx.drawImage(video, 0, 0, width, height)
              requestAnimationFrame(drawFrame)
            }
          }

          video.onended = () => {
            mediaRecorder.stop()
          }

          video.play().then(() => {
            drawFrame()
            updateProgress()
          }).catch(reject)

        } catch (err) {
          reject(err)
        }
      }

      video.onerror = () => reject(new Error('Не удалось загрузить видео'))
      video.src = URL.createObjectURL(file)
    })
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('Пожалуйста, выберите видео файл')
      return
    }

    // Reset input
    e.target.value = ''

    // Initialize compression state
    setCompressionState({
      isProcessing: true,
      stage: 'analyzing',
      progress: 0,
      originalSize: file.size,
      compressedSize: 0,
      fileName: file.name,
      errorMessage: ''
    })

    try {
      // Stage 1: Analyzing
      await new Promise(resolve => setTimeout(resolve, 500))

      // Stage 2: Compressing
      setCompressionState(prev => ({ ...prev, stage: 'compressing', progress: 0 }))

      let compressedBlob
      try {
        compressedBlob = await simpleCompressVideo(file, (progress) => {
          setCompressionState(prev => ({ ...prev, progress }))
        })
      } catch (compressionError) {
        console.warn('Compression failed, using original file:', compressionError)
        compressedBlob = file
      }

      const compressedSize = compressedBlob.size
      setCompressionState(prev => ({
        ...prev,
        stage: 'uploading',
        progress: 0,
        compressedSize
      }))

      // Stage 3: Uploading
      const formData = new FormData()
      const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webm'
      formData.append('file', compressedBlob, fileName)

      const xhr = new XMLHttpRequest()

      await new Promise((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setCompressionState(prev => ({ ...prev, progress }))
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            reject(new Error('Ошибка загрузки'))
          }
        }

        xhr.onerror = () => reject(new Error('Ошибка сети'))

        xhr.open('POST', `${API_URL}/api/admin/upload`)
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send(formData)
      }).then(data => {
        setHeroData(prev => ({ ...prev, video_url: data.url }))
        setCompressionState(prev => ({ ...prev, stage: 'complete', progress: 100 }))

        // Auto-hide after 3 seconds
        setTimeout(() => {
          setCompressionState(prev => ({ ...prev, isProcessing: false }))
        }, 3000)
      })

    } catch (err) {
      console.error('Failed to process video:', err)
      setCompressionState(prev => ({
        ...prev,
        stage: 'error',
        errorMessage: err.message || 'Не удалось обработать видео'
      }))
    }
  }

  const cancelVideoProcessing = () => {
    setCompressionState({
      isProcessing: false,
      stage: '',
      progress: 0,
      originalSize: 0,
      compressedSize: 0,
      fileName: '',
      errorMessage: ''
    })
  }

  // Speaker CRUD
  const handleSaveSpeaker = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      if (editingSpeaker && editingSpeaker.id) {
        await apiRequest(`/api/admin/speakers/${editingSpeaker.id}`, {
          method: 'PUT',
          body: JSON.stringify(speakerForm)
        })
      } else {
        await apiRequest('/api/admin/speakers', {
          method: 'POST',
          body: JSON.stringify(speakerForm)
        })
      }
      setSaveStatus({ type: 'success', message: 'Спикер успешно сохранён!' })
      setEditingSpeaker(null)
      resetSpeakerForm()
      loadSpeakers()
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save speaker:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения: ' + err.message })
      // Auto-hide error after 5 seconds
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleDeleteSpeaker = async (id) => {
    if (!window.confirm('Удалить этого спикера?')) return
    try {
      await apiRequest(`/api/admin/speakers/${id}`, { method: 'DELETE' })
      setSaveStatus({ type: 'success', message: 'Спикер удалён!' })
      loadSpeakers()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to delete speaker:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка удаления: ' + err.message })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetSpeakerForm = () => {
    setSpeakerForm({
      name_ru: '', name_en: '', name_tj: '',
      title_ru: '', title_en: '', title_tj: '',
      image: '/assets/images/speaker-default.png',
      image_source: 'url',
      image_position: 'center center',
      flag_url: '', flag_alt_ru: '', flag_alt_en: '', flag_alt_tj: '',
      sort_order: speakers.length
    })
  }

  // Speaker image upload handler
  const handleSpeakerImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    e.target.value = ''
    setUploadingSpeakerImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) throw new Error('Ошибка загрузки')

      const data = await response.json()
      setSpeakerForm(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      console.error('Failed to upload image:', err)
      alert('Не удалось загрузить изображение')
    } finally {
      setUploadingSpeakerImage(false)
    }
  }

  // Image position dragging handlers
  const parsePosition = (posString) => {
    // Convert "center center" or "50% 50%" to {x: 50, y: 50}
    const parts = posString.split(' ')
    const map = { left: 0, center: 50, right: 100, top: 0, bottom: 100 }
    const x = map[parts[0]] !== undefined ? map[parts[0]] : parseFloat(parts[0])
    const y = map[parts[1]] !== undefined ? map[parts[1]] : parseFloat(parts[1])
    return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y }
  }

  const handlePositionDrag = useCallback((e) => {
    if (!imagePositionRef.current) return

    const rect = imagePositionRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    let x = ((clientX - rect.left) / rect.width) * 100
    let y = ((clientY - rect.top) / rect.height) * 100

    // Clamp values between 0 and 100
    x = Math.max(0, Math.min(100, x))
    y = Math.max(0, Math.min(100, y))

    setSpeakerForm(prev => ({ ...prev, image_position: `${x.toFixed(0)}% ${y.toFixed(0)}%` }))
  }, [])

  const handlePositionDragStart = useCallback((e) => {
    e.preventDefault()
    setIsDraggingPosition(true)
    handlePositionDrag(e)
  }, [handlePositionDrag])

  const handlePositionDragEnd = useCallback(() => {
    setIsDraggingPosition(false)
  }, [])

  useEffect(() => {
    if (isDraggingPosition) {
      const handleMove = (e) => handlePositionDrag(e)
      const handleEnd = () => handlePositionDragEnd()

      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)

      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDraggingPosition, handlePositionDrag, handlePositionDragEnd])

  // Partner CRUD
  const handleSavePartner = async () => {
    try {
      if (editingPartner) {
        await apiRequest(`/api/admin/partners/${editingPartner.id}`, {
          method: 'PUT',
          body: JSON.stringify(partnerForm)
        })
      } else {
        await apiRequest('/api/admin/partners', {
          method: 'POST',
          body: JSON.stringify(partnerForm)
        })
      }
      setEditingPartner(null)
      resetPartnerForm()
      loadPartners()
    } catch (err) {
      console.error('Failed to save partner:', err)
    }
  }

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Удалить этого партнёра?')) return
    try {
      await apiRequest(`/api/admin/partners/${id}`, { method: 'DELETE' })
      loadPartners()
    } catch (err) {
      console.error('Failed to delete partner:', err)
    }
  }

  const resetPartnerForm = () => {
    setPartnerForm({
      name: '', logo: '/assets/images/partner-default.png',
      website: '', partner_type: 'partner', sort_order: partners.length
    })
  }

  const sections = [
    { id: 'hero', label: 'Главный баннер', icon: 'hero' },
    { id: 'speakers', label: 'Спикеры', icon: 'speakers' },
    { id: 'news', label: 'Новости', icon: 'news' },
    { id: 'program', label: 'Статистика', icon: 'calendar' },
    { id: 'partners', label: 'Партнёры', icon: 'partners' },
    { id: 'app', label: 'Приложение', icon: 'smartphone' },
  ]

  const getIcon = (name) => {
    const icons = {
      hero: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
      speakers: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      news: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      partners: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      smartphone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      ),
    }
    return icons[name] || null
  }

  return (
    <div className="home-page-manager">
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Главная страница</h1>
          <p>Управление всеми разделами главной страницы</p>
        </div>
        {saveStatus && (
          <div className={`save-status save-status--${saveStatus.type}`}>
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
            <button className="save-status-close" onClick={() => setSaveStatus(null)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="page-manager-layout">
        {/* Section Navigation */}
        <div className="section-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="section-nav-icon">{getIcon(section.icon)}</span>
              <span className="section-nav-label">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="section-content">
          {loading ? (
            <div className="section-loading">Загрузка...</div>
          ) : (
            <>
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Главный баннер</h2>
                    <p>Настройка главного баннера на главной странице</p>
                  </div>

                  {/* Conference Title */}
                  <div className="form-section">
                    <h3 className="form-section-title">Название конференции</h3>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                      <textarea
                        value={heroData.title_ru}
                        onChange={e => setHeroData({ ...heroData, title_ru: e.target.value })}
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                      <textarea
                        value={heroData.title_en}
                        onChange={e => setHeroData({ ...heroData, title_en: e.target.value })}
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                      <textarea
                        value={heroData.title_tj}
                        onChange={e => setHeroData({ ...heroData, title_tj: e.target.value })}
                        rows="2"
                      />
                    </div>
                  </div>

                  {/* Date and Location */}
                  <div className="form-section">
                    <h3 className="form-section-title">Дата и место проведения</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Даты (Русский)</label>
                        <input
                          type="text"
                          value={heroData.dates_ru}
                          onChange={e => setHeroData({ ...heroData, dates_ru: e.target.value })}
                          placeholder="25-28 мая 2026"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Даты (Английский)</label>
                        <input
                          type="text"
                          value={heroData.dates_en}
                          onChange={e => setHeroData({ ...heroData, dates_en: e.target.value })}
                          placeholder="May 25-28, 2026"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Даты (Таджикский)</label>
                        <input
                          type="text"
                          value={heroData.dates_tj}
                          onChange={e => setHeroData({ ...heroData, dates_tj: e.target.value })}
                          placeholder="25-28 майи 2026"
                        />
                      </div>
                    </div>
                    <h4 className="form-subsection-title">Место проведения</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                        <input
                          type="text"
                          value={heroData.location_ru}
                          onChange={e => setHeroData({ ...heroData, location_ru: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                        <input
                          type="text"
                          value={heroData.location_en}
                          onChange={e => setHeroData({ ...heroData, location_en: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                        <input
                          type="text"
                          value={heroData.location_tj}
                          onChange={e => setHeroData({ ...heroData, location_tj: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="form-section">
                    <h3 className="form-section-title">Цитата</h3>
                    <h4 className="form-subsection-title">Текст цитаты</h4>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                      <textarea
                        value={heroData.quote_ru}
                        onChange={e => setHeroData({ ...heroData, quote_ru: e.target.value })}
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                      <textarea
                        value={heroData.quote_en}
                        onChange={e => setHeroData({ ...heroData, quote_en: e.target.value })}
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                      <textarea
                        value={heroData.quote_tj}
                        onChange={e => setHeroData({ ...heroData, quote_tj: e.target.value })}
                        rows="2"
                      />
                    </div>
                    <h4 className="form-subsection-title">Автор цитаты</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                        <input
                          type="text"
                          value={heroData.quote_author_ru}
                          onChange={e => setHeroData({ ...heroData, quote_author_ru: e.target.value })}
                          placeholder="Эмомали Рахмон"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                        <input
                          type="text"
                          value={heroData.quote_author_en}
                          onChange={e => setHeroData({ ...heroData, quote_author_en: e.target.value })}
                          placeholder="Emomali Rahmon"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                        <input
                          type="text"
                          value={heroData.quote_author_tj}
                          onChange={e => setHeroData({ ...heroData, quote_author_tj: e.target.value })}
                          placeholder="Эмомалӣ Раҳмон"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="form-section">
                    <h3 className="form-section-title">Кнопка регистрации</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                        <input
                          type="text"
                          value={heroData.registration_btn_ru}
                          onChange={e => setHeroData({ ...heroData, registration_btn_ru: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                        <input
                          type="text"
                          value={heroData.registration_btn_en}
                          onChange={e => setHeroData({ ...heroData, registration_btn_en: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                        <input
                          type="text"
                          value={heroData.registration_btn_tj}
                          onChange={e => setHeroData({ ...heroData, registration_btn_tj: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Кнопка видео</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                        <input
                          type="text"
                          value={heroData.video_btn_ru}
                          onChange={e => setHeroData({ ...heroData, video_btn_ru: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                        <input
                          type="text"
                          value={heroData.video_btn_en}
                          onChange={e => setHeroData({ ...heroData, video_btn_en: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                        <input
                          type="text"
                          value={heroData.video_btn_tj}
                          onChange={e => setHeroData({ ...heroData, video_btn_tj: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>URL YouTube видео</label>
                      <input
                        type="text"
                        value={heroData.youtube_url}
                        onChange={e => setHeroData({ ...heroData, youtube_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <span className="form-hint">Ссылка на видео для кнопки "Видео презентация"</span>
                    </div>
                  </div>

                  {/* Scroll Down Text */}
                  <div className="form-section">
                    <h3 className="form-section-title">Текст прокрутки</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</label>
                        <input
                          type="text"
                          value={heroData.scroll_down_ru}
                          onChange={e => setHeroData({ ...heroData, scroll_down_ru: e.target.value })}
                          placeholder="Прокрутите вниз"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</label>
                        <input
                          type="text"
                          value={heroData.scroll_down_en}
                          onChange={e => setHeroData({ ...heroData, scroll_down_en: e.target.value })}
                          placeholder="Scroll down"
                        />
                      </div>
                      <div className="form-group">
                        <label><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</label>
                        <input
                          type="text"
                          value={heroData.scroll_down_tj}
                          onChange={e => setHeroData({ ...heroData, scroll_down_tj: e.target.value })}
                          placeholder="Ба поён ғелонед"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Background Video */}
                  <div className="form-section">
                    <h3 className="form-section-title">Фоновое видео</h3>

                    <div className="video-source-toggle">
                      <label className="toggle-label">Источник видео:</label>
                      <div className="toggle-buttons">
                        <button
                          type="button"
                          className={`toggle-btn ${heroData.video_source === 'url' ? 'active' : ''}`}
                          onClick={() => setHeroData({ ...heroData, video_source: 'url' })}
                        >
                          URL ссылка
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn ${heroData.video_source === 'upload' ? 'active' : ''}`}
                          onClick={() => setHeroData({ ...heroData, video_source: 'upload' })}
                        >
                          Загрузить файл
                        </button>
                      </div>
                    </div>

                    {heroData.video_source === 'url' ? (
                      <div className="form-group">
                        <label>URL фонового видео</label>
                        <input
                          type="text"
                          value={heroData.video_url}
                          onChange={e => setHeroData({ ...heroData, video_url: e.target.value })}
                          placeholder="/assets/video/hero-background.mp4"
                        />
                        <span className="form-hint">Путь к файлу фонового видео</span>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>Загрузить видео</label>

                        {/* Animated Processing Overlay */}
                        {compressionState.isProcessing && (
                          <div className="video-processing-overlay">
                            <div className="video-processing-card">
                              <div className="processing-header">
                                <div className="processing-icon-container">
                                  {compressionState.stage === 'analyzing' && (
                                    <div className="processing-icon analyzing">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                      </svg>
                                    </div>
                                  )}
                                  {compressionState.stage === 'compressing' && (
                                    <div className="processing-icon compressing">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                      </svg>
                                    </div>
                                  )}
                                  {compressionState.stage === 'uploading' && (
                                    <div className="processing-icon uploading">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                      </svg>
                                    </div>
                                  )}
                                  {compressionState.stage === 'complete' && (
                                    <div className="processing-icon complete">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                      </svg>
                                    </div>
                                  )}
                                  {compressionState.stage === 'error' && (
                                    <div className="processing-icon error">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="processing-title">
                                  {compressionState.stage === 'analyzing' && 'Анализ видео...'}
                                  {compressionState.stage === 'compressing' && 'Сжатие видео...'}
                                  {compressionState.stage === 'uploading' && 'Загрузка на сервер...'}
                                  {compressionState.stage === 'complete' && 'Готово!'}
                                  {compressionState.stage === 'error' && 'Ошибка'}
                                </div>
                              </div>

                              <div className="processing-file-info">
                                <span className="file-name">{compressionState.fileName}</span>
                                <div className="file-sizes">
                                  <span>Исходный: {formatBytes(compressionState.originalSize)}</span>
                                  {compressionState.compressedSize > 0 && (
                                    <span className="compressed-size">
                                      Сжатый: {formatBytes(compressionState.compressedSize)}
                                      <span className="size-reduction">
                                        (-{Math.round((1 - compressionState.compressedSize / compressionState.originalSize) * 100)}%)
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar */}
                              {(compressionState.stage === 'compressing' || compressionState.stage === 'uploading') && (
                                <div className="progress-container">
                                  <div className="progress-bar">
                                    <div
                                      className={`progress-fill ${compressionState.stage}`}
                                      style={{ width: `${compressionState.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="progress-text">{compressionState.progress}%</span>
                                </div>
                              )}

                              {/* Stage Indicators */}
                              <div className="stage-indicators">
                                <div className={`stage-dot ${['analyzing', 'compressing', 'uploading', 'complete'].includes(compressionState.stage) ? 'active' : ''} ${compressionState.stage === 'analyzing' ? 'current' : ''}`}>
                                  <span>1</span>
                                  <label>Анализ</label>
                                </div>
                                <div className="stage-line"></div>
                                <div className={`stage-dot ${['compressing', 'uploading', 'complete'].includes(compressionState.stage) ? 'active' : ''} ${compressionState.stage === 'compressing' ? 'current' : ''}`}>
                                  <span>2</span>
                                  <label>Сжатие</label>
                                </div>
                                <div className="stage-line"></div>
                                <div className={`stage-dot ${['uploading', 'complete'].includes(compressionState.stage) ? 'active' : ''} ${compressionState.stage === 'uploading' ? 'current' : ''}`}>
                                  <span>3</span>
                                  <label>Загрузка</label>
                                </div>
                                <div className="stage-line"></div>
                                <div className={`stage-dot ${compressionState.stage === 'complete' ? 'active current' : ''}`}>
                                  <span>4</span>
                                  <label>Готово</label>
                                </div>
                              </div>

                              {/* Error Message */}
                              {compressionState.stage === 'error' && (
                                <div className="error-message">
                                  {compressionState.errorMessage}
                                </div>
                              )}

                              {/* Cancel/Close Button */}
                              {(compressionState.stage === 'error' || compressionState.stage === 'complete') && (
                                <button
                                  className="processing-close-btn"
                                  onClick={cancelVideoProcessing}
                                >
                                  {compressionState.stage === 'error' ? 'Закрыть' : 'Готово'}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Upload Area */}
                        <div className="upload-area">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            disabled={compressionState.isProcessing}
                            id="video-upload"
                            className="file-input"
                          />
                          <label htmlFor="video-upload" className={`upload-label ${compressionState.isProcessing ? 'disabled' : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <span>Нажмите для выбора видео файла</span>
                            <span className="upload-hint">Видео будет автоматически сжато перед загрузкой</span>
                          </label>
                        </div>
                        {heroData.video_url && (
                          <div className="current-video">
                            <span className="form-hint">Текущее видео: {heroData.video_url}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-save"
                    onClick={() => saveSettings({
                      hero_video_url: heroData.video_url,
                      hero_youtube_url: heroData.youtube_url,
                      hero_video_source: heroData.video_source,
                      hero_title_ru: heroData.title_ru,
                      hero_title_en: heroData.title_en,
                      hero_title_tj: heroData.title_tj,
                      hero_dates_ru: heroData.dates_ru,
                      hero_dates_en: heroData.dates_en,
                      hero_dates_tj: heroData.dates_tj,
                      hero_location_ru: heroData.location_ru,
                      hero_location_en: heroData.location_en,
                      hero_location_tj: heroData.location_tj,
                      hero_quote_ru: heroData.quote_ru,
                      hero_quote_en: heroData.quote_en,
                      hero_quote_tj: heroData.quote_tj,
                      hero_quote_author_ru: heroData.quote_author_ru,
                      hero_quote_author_en: heroData.quote_author_en,
                      hero_quote_author_tj: heroData.quote_author_tj,
                      hero_registration_btn_ru: heroData.registration_btn_ru,
                      hero_registration_btn_en: heroData.registration_btn_en,
                      hero_registration_btn_tj: heroData.registration_btn_tj,
                      hero_video_btn_ru: heroData.video_btn_ru,
                      hero_video_btn_en: heroData.video_btn_en,
                      hero_video_btn_tj: heroData.video_btn_tj,
                      hero_scroll_down_ru: heroData.scroll_down_ru,
                      hero_scroll_down_en: heroData.scroll_down_en,
                      hero_scroll_down_tj: heroData.scroll_down_tj,
                    })}
                  >
                    Сохранить настройки баннера
                  </button>
                </div>
              )}

              {/* Speakers Section */}
              {activeSection === 'speakers' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Приветственные обращения / Спикеры</h2>
                    <p>Управление спикерами, отображаемыми в главном баннере</p>
                    <button
                      className="btn-add"
                      onClick={() => {
                        setEditingSpeaker({})
                        resetSpeakerForm()
                      }}
                    >
                      + Добавить спикера
                    </button>
                  </div>

                  {editingSpeaker !== null && (
                    <div className="edit-form-card">
                      <h3>{editingSpeaker.id ? 'Редактировать спикера' : 'Добавить нового спикера'}</h3>

                      {/* Image Section */}
                      <div className="form-section">
                        <h4 className="form-subsection-title">Фото спикера</h4>

                        {/* Image Source Toggle */}
                        <div className="video-source-toggle" style={{ marginBottom: '16px' }}>
                          <label className="toggle-label">Источник изображения:</label>
                          <div className="toggle-buttons">
                            <button
                              type="button"
                              className={`toggle-btn ${speakerForm.image_source === 'url' ? 'active' : ''}`}
                              onClick={() => setSpeakerForm({ ...speakerForm, image_source: 'url' })}
                            >
                              URL ссылка
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${speakerForm.image_source === 'upload' ? 'active' : ''}`}
                              onClick={() => setSpeakerForm({ ...speakerForm, image_source: 'upload' })}
                            >
                              Загрузить
                            </button>
                          </div>
                        </div>

                        <div className="speaker-image-editor">
                          {/* Image Preview with Draggable Position Control */}
                          <div className="image-preview-container">
                            <div
                              className={`image-preview-wrapper ${isDraggingPosition ? 'dragging' : ''}`}
                              ref={imagePositionRef}
                              onMouseDown={handlePositionDragStart}
                              onTouchStart={handlePositionDragStart}
                            >
                              <img
                                src={speakerForm.image}
                                alt="Preview"
                                className="speaker-image-preview"
                                style={{ objectPosition: speakerForm.image_position }}
                                draggable={false}
                              />
                              {/* Draggable Focal Point */}
                              <div className="focal-point-overlay">
                                <div
                                  className="focal-point"
                                  style={{
                                    left: `${parsePosition(speakerForm.image_position).x}%`,
                                    top: `${parsePosition(speakerForm.image_position).y}%`
                                  }}
                                >
                                  <div className="focal-point-ring"></div>
                                  <div className="focal-point-center"></div>
                                </div>
                                {/* Crosshair lines */}
                                <div
                                  className="focal-line focal-line-h"
                                  style={{ top: `${parsePosition(speakerForm.image_position).y}%` }}
                                />
                                <div
                                  className="focal-line focal-line-v"
                                  style={{ left: `${parsePosition(speakerForm.image_position).x}%` }}
                                />
                              </div>
                            </div>
                            <span className="image-position-hint">
                              Перетащите точку для выбора фокуса ({speakerForm.image_position})
                            </span>
                          </div>

                          {/* URL Input or Upload Area */}
                          <div className="image-input-area">
                            {speakerForm.image_source === 'url' ? (
                              <div className="form-group">
                                <label>URL изображения</label>
                                <input
                                  type="text"
                                  value={speakerForm.image}
                                  onChange={e => setSpeakerForm({ ...speakerForm, image: e.target.value })}
                                  placeholder="/assets/images/speaker.jpg"
                                />
                              </div>
                            ) : (
                              <div className="form-group">
                                <label>Загрузить изображение</label>
                                <div className="upload-area">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSpeakerImageUpload}
                                    disabled={uploadingSpeakerImage}
                                    id="speaker-image-upload"
                                    className="file-input"
                                  />
                                  <label htmlFor="speaker-image-upload" className={`upload-label ${uploadingSpeakerImage ? 'disabled' : ''}`}>
                                    {uploadingSpeakerImage ? (
                                      <>
                                        <svg className="spinner" viewBox="0 0 24 24" width="24" height="24">
                                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" />
                                        </svg>
                                        <span>Загрузка...</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                          <polyline points="17 8 12 3 7 8"></polyline>
                                          <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <span>Нажмите для выбора</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Flag URL */}
                      <div className="form-group">
                        <label>URL флага страны</label>
                        <input
                          type="text"
                          value={speakerForm.flag_url}
                          onChange={e => setSpeakerForm({ ...speakerForm, flag_url: e.target.value })}
                          placeholder="https://flagcdn.com/w80/tj.png"
                        />
                        <span className="form-hint">Флаг страны спикера (опционально)</span>
                      </div>

                      {/* Multilingual Fields with Flags */}
                      <div className="lang-tabs">
                        <div className="lang-section">
                          <h4><img src="https://flagcdn.com/w20/ru.png" alt="RU" className="lang-flag" /> Русский</h4>
                          <div className="form-group">
                            <label>Имя</label>
                            <input
                              type="text"
                              value={speakerForm.name_ru}
                              onChange={e => setSpeakerForm({ ...speakerForm, name_ru: e.target.value })}
                              placeholder="Имя Фамилия"
                            />
                          </div>
                          <div className="form-group">
                            <label>Должность</label>
                            <input
                              type="text"
                              value={speakerForm.title_ru}
                              onChange={e => setSpeakerForm({ ...speakerForm, title_ru: e.target.value })}
                              placeholder="Премьер-Министр"
                            />
                          </div>
                        </div>
                        <div className="lang-section">
                          <h4><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="lang-flag" /> Английский</h4>
                          <div className="form-group">
                            <label>Имя</label>
                            <input
                              type="text"
                              value={speakerForm.name_en}
                              onChange={e => setSpeakerForm({ ...speakerForm, name_en: e.target.value })}
                              placeholder="First Last"
                            />
                          </div>
                          <div className="form-group">
                            <label>Должность</label>
                            <input
                              type="text"
                              value={speakerForm.title_en}
                              onChange={e => setSpeakerForm({ ...speakerForm, title_en: e.target.value })}
                              placeholder="Prime Minister"
                            />
                          </div>
                        </div>
                        <div className="lang-section">
                          <h4><img src="https://flagcdn.com/w20/tj.png" alt="TJ" className="lang-flag" /> Таджикский</h4>
                          <div className="form-group">
                            <label>Имя</label>
                            <input
                              type="text"
                              value={speakerForm.name_tj}
                              onChange={e => setSpeakerForm({ ...speakerForm, name_tj: e.target.value })}
                              placeholder="Ном Насаб"
                            />
                          </div>
                          <div className="form-group">
                            <label>Должность</label>
                            <input
                              type="text"
                              value={speakerForm.title_tj}
                              onChange={e => setSpeakerForm({ ...speakerForm, title_tj: e.target.value })}
                              placeholder="Сарвазир"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Порядок сортировки</label>
                        <input
                          type="number"
                          value={speakerForm.sort_order}
                          onChange={e => setSpeakerForm({ ...speakerForm, sort_order: parseInt(e.target.value) || 0 })}
                          style={{ width: '100px' }}
                        />
                      </div>

                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setEditingSpeaker(null)}>Отмена</button>
                        <button className="btn-save" onClick={handleSaveSpeaker}>Сохранить спикера</button>
                      </div>
                    </div>
                  )}

                  <div className="items-grid">
                    {speakers.map(speaker => (
                      <div key={speaker.id} className="item-card">
                        <img src={speaker.image} alt="" className="item-image" />
                        <div className="item-info">
                          <strong>{speaker.name_ru || speaker.name_en}</strong>
                          <span>{speaker.title_ru || speaker.title_en}</span>
                        </div>
                        <div className="item-actions">
                          <button
                            className="btn-edit"
                            onClick={() => {
                              setEditingSpeaker(speaker)
                              setSpeakerForm({
                                name_ru: speaker.name_ru || '',
                                name_en: speaker.name_en || '',
                                name_tj: speaker.name_tj || '',
                                title_ru: speaker.title_ru || '',
                                title_en: speaker.title_en || '',
                                title_tj: speaker.title_tj || '',
                                image: speaker.image || '/assets/images/speaker-default.png',
                                image_source: speaker.image_source || 'url',
                                image_position: speaker.image_position || 'center center',
                                flag_url: speaker.flag_url || '',
                                flag_alt_ru: speaker.flag_alt_ru || '',
                                flag_alt_en: speaker.flag_alt_en || '',
                                flag_alt_tj: speaker.flag_alt_tj || '',
                                sort_order: speaker.sort_order || 0
                              })
                            }}
                          >
                            Изменить
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteSpeaker(speaker.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News Section */}
              {activeSection === 'news' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Раздел новостей</h2>
                    <p>На главной странице отображаются 6 последних новостей</p>
                    <a href="/admin/news" className="btn-link">Управление всеми новостями &rarr;</a>
                  </div>

                  <div className="info-box">
                    <strong>Как это работает:</strong> На главной странице автоматически отображаются 6 последних новостей.
                    Чтобы изменить отображаемые новости, перейдите в Менеджер новостей для добавления, редактирования или удаления статей.
                  </div>

                  <div className="items-list">
                    {news.map((item, index) => (
                      <div key={item.id} className="item-row">
                        <span className="item-order">{index + 1}</span>
                        <img src={item.image} alt="" className="item-thumb" />
                        <div className="item-details">
                          <strong>{item.title_ru || item.title_en}</strong>
                          <span>{item.date}</span>
                        </div>
                        <span className="item-badge">{item.category || item.category_en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Stats Section */}
              {activeSection === 'program' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Статистика программы</h2>
                    <p>Настройка статистики, отображаемой в разделе программы</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Количество дней</label>
                      <input
                        type="text"
                        value={programStats.days}
                        onChange={e => setProgramStats({ ...programStats, days: e.target.value })}
                        placeholder="4"
                      />
                    </div>
                    <div className="form-group">
                      <label>Количество сессий</label>
                      <input
                        type="text"
                        value={programStats.sessions}
                        onChange={e => setProgramStats({ ...programStats, sessions: e.target.value })}
                        placeholder="20+"
                      />
                    </div>
                    <div className="form-group">
                      <label>Количество спикеров</label>
                      <input
                        type="text"
                        value={programStats.speakers_count}
                        onChange={e => setProgramStats({ ...programStats, speakers_count: e.target.value })}
                        placeholder="150+"
                      />
                    </div>
                  </div>

                  <button
                    className="btn-save"
                    onClick={() => saveSettings({
                      program_days: programStats.days,
                      program_sessions: programStats.sessions,
                      program_speakers: programStats.speakers_count
                    })}
                  >
                    Сохранить статистику
                  </button>

                  <div className="info-box">
                    <strong>Примечание:</strong> Полное расписание программы управляется отдельно в настройках страницы Программа.
                    Эта статистика отображается как основные показатели в разделе предпросмотра программы.
                  </div>
                </div>
              )}

              {/* Partners Section */}
              {activeSection === 'partners' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Раздел партнёров</h2>
                    <p>Управление логотипами партнёров на главной странице</p>
                    <button
                      className="btn-add"
                      onClick={() => {
                        setEditingPartner({})
                        resetPartnerForm()
                      }}
                    >
                      + Добавить партнёра
                    </button>
                  </div>

                  {editingPartner !== null && (
                    <div className="edit-form-card">
                      <h3>{editingPartner.id ? 'Редактировать партнёра' : 'Добавить нового партнёра'}</h3>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Название организации</label>
                          <input
                            type="text"
                            value={partnerForm.name}
                            onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                            placeholder="Название организации"
                          />
                        </div>
                        <div className="form-group">
                          <label>Тип партнёра</label>
                          <select
                            value={partnerForm.partner_type}
                            onChange={e => setPartnerForm({ ...partnerForm, partner_type: e.target.value })}
                          >
                            <option value="organizer">Организатор</option>
                            <option value="partner">Партнёр</option>
                            <option value="media">Медиа-партнёр</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>URL логотипа</label>
                        <input
                          type="text"
                          value={partnerForm.logo}
                          onChange={e => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                          placeholder="/assets/images/partner-logo.png"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>URL сайта</label>
                          <input
                            type="url"
                            value={partnerForm.website}
                            onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="form-group">
                          <label>Порядок сортировки</label>
                          <input
                            type="number"
                            value={partnerForm.sort_order}
                            onChange={e => setPartnerForm({ ...partnerForm, sort_order: parseInt(e.target.value) || 0 })}
                            style={{ width: '100px' }}
                          />
                        </div>
                      </div>

                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setEditingPartner(null)}>Отмена</button>
                        <button className="btn-save" onClick={handleSavePartner}>Сохранить партнёра</button>
                      </div>
                    </div>
                  )}

                  <div className="items-grid partners-grid">
                    {partners.map(partner => (
                      <div key={partner.id} className="item-card partner-card">
                        <img src={partner.logo} alt="" className="partner-logo" />
                        <div className="item-info">
                          <strong>{partner.name}</strong>
                          <span className={`type-badge type-badge--${partner.partner_type}`}>
                            {partner.partner_type === 'organizer' ? 'Организатор' : partner.partner_type === 'media' ? 'Медиа' : 'Партнёр'}
                          </span>
                        </div>
                        <div className="item-actions">
                          <button
                            className="btn-edit"
                            onClick={() => {
                              setEditingPartner(partner)
                              setPartnerForm({
                                name: partner.name || '',
                                logo: partner.logo || '',
                                website: partner.website || '',
                                partner_type: partner.partner_type || 'partner',
                                sort_order: partner.sort_order || 0
                              })
                            }}
                          >
                            Изменить
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeletePartner(partner.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* App Download Section */}
              {activeSection === 'app' && (
                <div className="section-panel">
                  <div className="section-panel-header">
                    <h2>Раздел загрузки приложения</h2>
                    <p>Настройка ссылок для скачивания мобильного приложения</p>
                  </div>

                  <div className="form-group">
                    <label>URL App Store</label>
                    <input
                      type="url"
                      value={appData.app_store_url}
                      onChange={e => setAppData({ ...appData, app_store_url: e.target.value })}
                      placeholder="https://apps.apple.com/..."
                    />
                    <span className="form-hint">Ссылка на iOS приложение в App Store</span>
                  </div>

                  <div className="form-group">
                    <label>URL Google Play</label>
                    <input
                      type="url"
                      value={appData.google_play_url}
                      onChange={e => setAppData({ ...appData, google_play_url: e.target.value })}
                      placeholder="https://play.google.com/store/apps/..."
                    />
                    <span className="form-hint">Ссылка на Android приложение в Google Play</span>
                  </div>

                  <button
                    className="btn-save"
                    onClick={() => saveSettings({
                      app_store_url: appData.app_store_url,
                      google_play_url: appData.google_play_url
                    })}
                  >
                    Сохранить ссылки приложения
                  </button>

                  <div className="info-box">
                    <strong>Примечание:</strong> Описания функций приложения и текстовое содержимое управляются через файлы переводов.
                    Используйте "#" в качестве URL, если приложение ещё не доступно.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
