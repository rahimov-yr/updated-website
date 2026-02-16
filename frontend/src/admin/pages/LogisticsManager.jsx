import { useState, useEffect, useRef } from 'react'
import { useSettings, useUpload } from '../hooks/useApi'
import './LogisticsManager.css'

export default function LogisticsManager({ embedded = false }) {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')
  const [activeSection, setActiveSection] = useState('hotels')
  const [activeTab, setActiveTab] = useState('ru')
  const [editingItem, setEditingItem] = useState(null)
  const [modalType, setModalType] = useState(null) // 'hotel' or 'info'

  const { list: loadSettings, update: saveSettingsApi } = useSettings()
  const { upload, uploading } = useUpload()
  const fileInputRef = useRef(null)

  // Logistics data
  const [hotels, setHotels] = useState([])
  const [transportInfo, setTransportInfo] = useState([])
  const [visaInfo, setVisaInfo] = useState([])
  const [usefulInfo, setUsefulInfo] = useState([])

  // Page settings
  const [pageSettings, setPageSettings] = useState({
    title_ru: 'Логистика',
    title_en: 'Logistics',
    title_tj: 'Логистика',
    subtitle_ru: 'Информация для участников',
    subtitle_en: 'Information for participants',
    subtitle_tj: 'Маълумот барои иштирокчиён',
    // Section titles
    hotels_title_ru: 'Проживание',
    hotels_title_en: 'Accommodation',
    hotels_title_tj: 'Истиқомат',
    hotels_subtitle_ru: 'Рекомендуемые отели для участников конференции',
    hotels_subtitle_en: 'Recommended hotels for conference participants',
    hotels_subtitle_tj: 'Меҳмонхонаҳои тавсияшуда барои иштирокчиёни конфронс',
    transport_title_ru: 'Транспорт',
    transport_title_en: 'Transport',
    transport_title_tj: 'Нақлиёт',
    transport_subtitle_ru: 'Как добраться до места проведения конференции',
    transport_subtitle_en: 'How to get to the conference venue',
    transport_subtitle_tj: 'Чӣ тавр ба ҷои баргузории конфронс расидан мумкин аст',
    visa_title_ru: 'Визовая информация',
    visa_title_en: 'Visa Information',
    visa_title_tj: 'Маълумоти виза',
    visa_subtitle_ru: 'Требования для въезда в Таджикистан',
    visa_subtitle_en: 'Requirements for entry to Tajikistan',
    visa_subtitle_tj: 'Талаботҳо барои воридшавӣ ба Тоҷикистон',
    useful_title_ru: 'Полезная информация',
    useful_title_en: 'Useful Information',
    useful_title_tj: 'Маълумоти муфид',
    useful_subtitle_ru: 'Практические советы для участников',
    useful_subtitle_en: 'Practical tips for participants',
    useful_subtitle_tj: 'Маслиҳатҳои амалӣ барои иштирокчиён',
  })

  // Default data
  const defaultHotels = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      stars: 5,
      name_ru: 'Hyatt Regency Dushanbe',
      name_en: 'Hyatt Regency Dushanbe',
      name_tj: 'Hyatt Regency Душанбе',
      description_ru: 'Официальный отель конференции в центре города',
      description_en: 'Official conference hotel in the city center',
      description_tj: 'Меҳмонхонаи расмии конфронс дар маркази шаҳр',
      amenities_ru: ['Центр города', 'Трансфер', 'СПА'],
      amenities_en: ['City center', 'Transfer', 'SPA'],
      amenities_tj: ['Маркази шаҳр', 'Интиқол', 'СПА'],
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
      stars: 5,
      name_ru: 'Serena Hotel Dushanbe',
      name_en: 'Serena Hotel Dushanbe',
      name_tj: 'Serena Hotel Душанбе',
      description_ru: 'Роскошный отель в историческом районе',
      description_en: 'Luxury hotel in the historic district',
      description_tj: 'Меҳмонхонаи мамтоз дар ноҳияи таърихӣ',
      amenities_ru: ['Исторический район', 'Фитнес', 'Ресторан'],
      amenities_en: ['Historic district', 'Fitness', 'Restaurant'],
      amenities_tj: ['Ноҳияи таърихӣ', 'Фитнес', 'Тарабхона'],
    },
  ]

  const defaultTransport = [
    {
      id: 1,
      icon: 'plane',
      title_ru: 'Аэропорт',
      title_en: 'Airport',
      title_tj: 'Фурудгоҳ',
      description_ru: 'Международный аэропорт Душанбе находится в 20 минутах от центра города',
      description_en: 'Dushanbe International Airport is 20 minutes from the city center',
      description_tj: 'Фурудгоҳи байналмилалии Душанбе 20 дақиқа аз маркази шаҳр',
    },
    {
      id: 2,
      icon: 'bus',
      title_ru: 'Трансфер',
      title_en: 'Shuttle Service',
      title_tj: 'Хадамоти интиқол',
      description_ru: 'Бесплатный трансфер от аэропорта для всех участников',
      description_en: 'Free airport shuttle for all participants',
      description_tj: 'Интиқоли ройгон аз фурудгоҳ барои ҳамаи иштирокчиён',
    },
    {
      id: 3,
      icon: 'taxi',
      title_ru: 'Такси',
      title_en: 'Taxi',
      title_tj: 'Такси',
      description_ru: 'Такси доступно круглосуточно в аэропорту и городе',
      description_en: 'Taxis available 24/7 at the airport and around the city',
      description_tj: 'Такси шабонарӯзӣ дар фурудгоҳ ва шаҳр дастрас аст',
    },
  ]

  const defaultVisa = [
    {
      id: 1,
      icon: 'check',
      title_ru: 'Безвизовый режим',
      title_en: 'Visa-Free Entry',
      title_tj: 'Вуруди бидуни виза',
      description_ru: 'Граждане 52 стран могут въезжать без визы',
      description_en: 'Citizens of 52 countries can enter visa-free',
      description_tj: 'Шаҳрвандони 52 кишвар метавонанд бидуни виза ворид шаванд',
    },
    {
      id: 2,
      icon: 'computer',
      title_ru: 'Электронная виза',
      title_en: 'E-Visa',
      title_tj: 'Визаи электронӣ',
      description_ru: 'Электронная виза доступна для большинства стран',
      description_en: 'E-visa available for most countries',
      description_tj: 'Визаи электронӣ барои аксари кишварҳо дастрас аст',
    },
    {
      id: 3,
      icon: 'help',
      title_ru: 'Визовая поддержка',
      title_en: 'Visa Support',
      title_tj: 'Дастгирии виза',
      description_ru: 'Организаторы помогут с получением визы',
      description_en: 'Organizers will help with visa processing',
      description_tj: 'Ташкилкунандагон дар гирифтани виза кӯмак мекунанд',
    },
  ]

  const defaultUseful = [
    {
      id: 1,
      icon: 'weather',
      title_ru: 'Погода',
      title_en: 'Weather',
      title_tj: 'Обу ҳаво',
      description_ru: 'В мае температура 20-30°C, солнечно',
      description_en: 'May temperatures 20-30°C, sunny',
      description_tj: 'Дар моҳи май ҳарорат 20-30°C, офтобӣ',
    },
    {
      id: 2,
      icon: 'money',
      title_ru: 'Валюта',
      title_en: 'Currency',
      title_tj: 'Асъор',
      description_ru: 'Национальная валюта - сомони (TJS)',
      description_en: 'National currency is Somoni (TJS)',
      description_tj: 'Асъори миллӣ - сомонӣ (TJS)',
    },
    {
      id: 3,
      icon: 'phone',
      title_ru: 'Связь',
      title_en: 'Communication',
      title_tj: 'Алоқа',
      description_ru: 'SIM-карты доступны в аэропорту',
      description_en: 'SIM cards available at the airport',
      description_tj: 'Корти SIM дар фурудгоҳ дастрас аст',
    },
  ]

  // Form state
  const [hotelForm, setHotelForm] = useState({
    image: '',
    stars: 5,
    name_ru: '', name_en: '', name_tj: '',
    description_ru: '', description_en: '', description_tj: '',
    amenities_ru: [], amenities_en: [], amenities_tj: [],
  })

  const [infoForm, setInfoForm] = useState({
    icon: 'check',
    title_ru: '', title_en: '', title_tj: '',
    description_ru: '', description_en: '', description_tj: '',
  })

  const [amenityInputs, setAmenityInputs] = useState({ ru: '', en: '', tj: '' })
  const [modalLangTab, setModalLangTab] = useState('ru')

  useEffect(() => {
    loadLogisticsData()
  }, [])

  const loadLogisticsData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      setHotels(settingsMap.logistics_hotels ? JSON.parse(settingsMap.logistics_hotels) : defaultHotels)
      setTransportInfo(settingsMap.logistics_transport ? JSON.parse(settingsMap.logistics_transport) : defaultTransport)
      setVisaInfo(settingsMap.logistics_visa ? JSON.parse(settingsMap.logistics_visa) : defaultVisa)
      setUsefulInfo(settingsMap.logistics_useful ? JSON.parse(settingsMap.logistics_useful) : defaultUseful)

      if (settingsMap.logistics_page_settings) {
        setPageSettings(JSON.parse(settingsMap.logistics_page_settings))
      }
    } catch (err) {
      console.error('Failed to load logistics:', err)
      setHotels(defaultHotels)
      setTransportInfo(defaultTransport)
      setVisaInfo(defaultVisa)
      setUsefulInfo(defaultUseful)
    } finally {
      setLoading(false)
    }
  }

  const saveLogistics = async () => {
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi([
        { key: 'logistics_hotels', value: JSON.stringify(hotels) },
        { key: 'logistics_transport', value: JSON.stringify(transportInfo) },
        { key: 'logistics_visa', value: JSON.stringify(visaInfo) },
        { key: 'logistics_useful', value: JSON.stringify(usefulInfo) },
        { key: 'logistics_page_settings', value: JSON.stringify(pageSettings) },
      ])
      setSaveStatus({ type: 'success', message: 'Сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save logistics:', err)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const resetHotelForm = () => {
    setHotelForm({
      image: '',
      stars: 5,
      name_ru: '', name_en: '', name_tj: '',
      description_ru: '', description_en: '', description_tj: '',
      amenities_ru: [], amenities_en: [], amenities_tj: [],
    })
    setAmenityInputs({ ru: '', en: '', tj: '' })
  }

  const resetInfoForm = () => {
    setInfoForm({
      icon: 'check',
      title_ru: '', title_en: '', title_tj: '',
      description_ru: '', description_en: '', description_tj: '',
    })
  }

  const addAmenity = (lang) => {
    const input = amenityInputs[lang].trim()
    if (!input) return
    const key = `amenities_${lang}`
    setHotelForm({
      ...hotelForm,
      [key]: [...(hotelForm[key] || []), input]
    })
    setAmenityInputs({ ...amenityInputs, [lang]: '' })
  }

  const removeAmenity = (lang, index) => {
    const key = `amenities_${lang}`
    const updated = [...hotelForm[key]]
    updated.splice(index, 1)
    setHotelForm({ ...hotelForm, [key]: updated })
  }

  // Hotels CRUD
  const addHotel = () => {
    setHotels([...hotels, { id: Date.now(), ...hotelForm }])
    closeModal()
  }

  const updateHotel = () => {
    setHotels(hotels.map(h => h.id === editingItem ? { ...h, ...hotelForm } : h))
    closeModal()
  }

  const deleteHotel = (id) => {
    if (!window.confirm('Удалить этот отель?')) return
    setHotels(hotels.filter(h => h.id !== id))
  }

  const startEditHotel = (hotel) => {
    setHotelForm({ ...hotel })
    setEditingItem(hotel.id)
    setModalType('hotel')
  }

  const openAddHotel = () => {
    resetHotelForm()
    setEditingItem('new')
    setModalType('hotel')
  }

  // Info items CRUD (generic for transport, visa, useful)
  const getCurrentInfoList = () => {
    switch (activeSection) {
      case 'transport': return transportInfo
      case 'visa': return visaInfo
      case 'useful': return usefulInfo
      default: return []
    }
  }

  const setCurrentInfoList = (list) => {
    switch (activeSection) {
      case 'transport': setTransportInfo(list); break
      case 'visa': setVisaInfo(list); break
      case 'useful': setUsefulInfo(list); break
    }
  }

  const addInfoItem = () => {
    const list = getCurrentInfoList()
    setCurrentInfoList([...list, { id: Date.now(), ...infoForm }])
    closeModal()
  }

  const updateInfoItem = () => {
    const list = getCurrentInfoList()
    setCurrentInfoList(list.map(item => item.id === editingItem ? { ...item, ...infoForm } : item))
    closeModal()
  }

  const deleteInfoItem = (id) => {
    if (!window.confirm('Удалить этот элемент?')) return
    const list = getCurrentInfoList()
    setCurrentInfoList(list.filter(item => item.id !== id))
  }

  const startEditInfoItem = (item) => {
    setInfoForm({ ...item })
    setEditingItem(item.id)
    setModalType('info')
  }

  const openAddInfoItem = () => {
    resetInfoForm()
    setEditingItem('new')
    setModalType('info')
  }

  const closeModal = () => {
    setEditingItem(null)
    setModalType(null)
    resetHotelForm()
    resetInfoForm()
    setModalLangTab('ru')
  }

  // SVG Icons
  const svgIcons = {
    plane: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    ),
    bus: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
      </svg>
    ),
    taxi: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    ),
    computer: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    ),
    weather: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
      </svg>
    ),
    money: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
    hotel: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    ),
    car: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
    document: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  }

  const icons = [
    { value: 'plane', label: 'Самолёт' },
    { value: 'bus', label: 'Автобус' },
    { value: 'taxi', label: 'Такси' },
    { value: 'check', label: 'Галочка' },
    { value: 'computer', label: 'Компьютер' },
    { value: 'help', label: 'Помощь' },
    { value: 'weather', label: 'Погода' },
    { value: 'money', label: 'Деньги' },
    { value: 'phone', label: 'Телефон' },
    { value: 'hotel', label: 'Отель' },
    { value: 'info', label: 'Информация' },
  ]

  const getIcon = (iconName) => svgIcons[iconName] || svgIcons.info

  if (loading) {
    return (
      <div className="logistics-manager">
        <div className="section-loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className={`logistics-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Логистика</h1>
          <p>Размещение и транспорт</p>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          {saveStatus.type === 'saving' && (
            <svg className="save-status-spinner" viewBox="0 0 24 24" width="18" height="18">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
            </svg>
          )}
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>×</button>
        </div>
      )}

      <div className="logistics-layout">
        {/* Section Navigation */}
        <div className="section-nav">
          <button
            className={`section-nav-item ${activeSection === 'hotels' ? 'active' : ''}`}
            onClick={() => { setActiveSection('hotels'); setEditingItem(null); }}
          >
            <span className="section-nav-icon">{svgIcons.hotel}</span>
            <span className="section-nav-label">Отели</span>
            <span className="section-nav-count">{hotels.length}</span>
          </button>
          <button
            className={`section-nav-item ${activeSection === 'transport' ? 'active' : ''}`}
            onClick={() => { setActiveSection('transport'); setEditingItem(null); }}
          >
            <span className="section-nav-icon">{svgIcons.car}</span>
            <span className="section-nav-label">Транспорт</span>
            <span className="section-nav-count">{transportInfo.length}</span>
          </button>
          <button
            className={`section-nav-item ${activeSection === 'visa' ? 'active' : ''}`}
            onClick={() => { setActiveSection('visa'); setEditingItem(null); }}
          >
            <span className="section-nav-icon">{svgIcons.document}</span>
            <span className="section-nav-label">Виза</span>
            <span className="section-nav-count">{visaInfo.length}</span>
          </button>
          <button
            className={`section-nav-item ${activeSection === 'useful' ? 'active' : ''}`}
            onClick={() => { setActiveSection('useful'); setEditingItem(null); }}
          >
            <span className="section-nav-icon">{svgIcons.info}</span>
            <span className="section-nav-label">Полезное</span>
            <span className="section-nav-count">{usefulInfo.length}</span>
          </button>
        </div>

        {/* Content */}
        <div className="logistics-content">
          {/* Hotels Section */}
          {activeSection === 'hotels' && (
            <>
              {/* Section Title Editor */}
              <div className="admin-card section-title-card">
                <div className="card-header">
                  <h3>Заголовок секции</h3>
                </div>
                <div className="section-title-form">
                  <div className="lang-tabs-simple">
                    <button className={`lang-tab-simple ${activeTab === 'ru' ? 'active' : ''}`} onClick={() => setActiveTab('ru')}>
                      Русский
                    </button>
                    <button className={`lang-tab-simple ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                      Английский
                    </button>
                    <button className={`lang-tab-simple ${activeTab === 'tj' ? 'active' : ''}`} onClick={() => setActiveTab('tj')}>
                      Таджикский
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Заголовок ({activeTab === 'ru' ? 'Русский' : activeTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                    <input
                      type="text"
                      value={pageSettings[`hotels_title_${activeTab}`] || ''}
                      onChange={(e) => setPageSettings({ ...pageSettings, [`hotels_title_${activeTab}`]: e.target.value })}
                      placeholder="Заголовок секции"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок ({activeTab === 'ru' ? 'Русский' : activeTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                    <input
                      type="text"
                      value={pageSettings[`hotels_subtitle_${activeTab}`] || ''}
                      onChange={(e) => setPageSettings({ ...pageSettings, [`hotels_subtitle_${activeTab}`]: e.target.value })}
                      placeholder="Подзаголовок секции"
                    />
                  </div>
                  <div className="section-title-actions">
                    <button className="btn-save" onClick={saveLogistics}>Сохранить</button>
                  </div>
                </div>
              </div>

              {/* Hotels List */}
              <div className="admin-card">
                <div className="card-header">
                  <h3>Отели</h3>
                  <button className="btn-add" onClick={openAddHotel}>
                    + Добавить отель
                  </button>
                </div>

                <div className="items-list">
                {hotels.map((hotel, index) => (
                  <div key={hotel.id} className="item-card-horizontal">
                    <div className="item-card-image">
                      <img src={hotel.image} alt={hotel.name_ru} />
                    </div>
                    <div className="item-card-content">
                      <div className="item-card-stars">
                        {[...Array(hotel.stars)].map((_, i) => (
                          <span key={i} className="star-icon">{svgIcons.star}</span>
                        ))}
                      </div>
                      <h4>{hotel.name_ru}</h4>
                      <p>{hotel.description_ru}</p>
                    </div>
                    <div className="item-card-actions">
                      <button className="btn-edit" onClick={() => startEditHotel(hotel)}>Изменить</button>
                      <button className="btn-delete" onClick={() => deleteHotel(hotel.id)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
          )}

          {/* Transport, Visa, Useful Sections */}
          {['transport', 'visa', 'useful'].includes(activeSection) && (
            <>
              {/* Section Title Editor */}
              <div className="admin-card section-title-card">
                <div className="card-header">
                  <h3>Заголовок секции</h3>
                </div>
                <div className="section-title-form">
                  <div className="lang-tabs-simple">
                    <button className={`lang-tab-simple ${activeTab === 'ru' ? 'active' : ''}`} onClick={() => setActiveTab('ru')}>
                      Русский
                    </button>
                    <button className={`lang-tab-simple ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                      Английский
                    </button>
                    <button className={`lang-tab-simple ${activeTab === 'tj' ? 'active' : ''}`} onClick={() => setActiveTab('tj')}>
                      Таджикский
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Заголовок ({activeTab === 'ru' ? 'Русский' : activeTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                    <input
                      type="text"
                      value={pageSettings[`${activeSection}_title_${activeTab}`] || ''}
                      onChange={(e) => setPageSettings({ ...pageSettings, [`${activeSection}_title_${activeTab}`]: e.target.value })}
                      placeholder="Заголовок секции"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок ({activeTab === 'ru' ? 'Русский' : activeTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                    <input
                      type="text"
                      value={pageSettings[`${activeSection}_subtitle_${activeTab}`] || ''}
                      onChange={(e) => setPageSettings({ ...pageSettings, [`${activeSection}_subtitle_${activeTab}`]: e.target.value })}
                      placeholder="Подзаголовок секции"
                    />
                  </div>
                  <div className="section-title-actions">
                    <button className="btn-save" onClick={saveLogistics}>Сохранить</button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="admin-card">
                <div className="card-header">
                  <h3>Элементы</h3>
                  <button className="btn-add" onClick={openAddInfoItem}>
                    + Добавить
                  </button>
                </div>

                <div className="items-list">
                {getCurrentInfoList().map((item, index) => (
                  <div key={item.id} className="item-card-simple">
                    <div className="item-card-icon">{getIcon(item.icon)}</div>
                    <div className="item-card-content">
                      <h4>{item.title_ru}</h4>
                      <p>{item.description_ru}</p>
                    </div>
                    <div className="item-card-actions">
                      <button className="btn-edit" onClick={() => startEditInfoItem(item)}>Изменить</button>
                      <button className="btn-delete" onClick={() => deleteInfoItem(item.id)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Hotel Modal - Tabbed Design */}
      {modalType === 'hotel' && (
        <div className="settings-modal-overlay" onClick={closeModal}>
          <div className="settings-modal settings-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingItem === 'new' ? 'Добавление отеля' : 'Редактирование отеля'}</h2>
              <button className="settings-modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="settings-modal-body">
              {/* Language Tabs */}
              <div className="lang-tabs-simple">
                <button className={`lang-tab-simple ${modalLangTab === 'ru' ? 'active' : ''}`} onClick={() => setModalLangTab('ru')}>
                  Русский
                </button>
                <button className={`lang-tab-simple ${modalLangTab === 'en' ? 'active' : ''}`} onClick={() => setModalLangTab('en')}>
                  Английский
                </button>
                <button className={`lang-tab-simple ${modalLangTab === 'tj' ? 'active' : ''}`} onClick={() => setModalLangTab('tj')}>
                  Таджикский
                </button>
              </div>

              {/* Language-specific fields */}
              <div className="form-group">
                <label>Название ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <input
                  type="text"
                  value={hotelForm[`name_${modalLangTab}`]}
                  onChange={(e) => setHotelForm({ ...hotelForm, [`name_${modalLangTab}`]: e.target.value })}
                  placeholder="Название отеля"
                />
              </div>
              <div className="form-group">
                <label>Описание ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <textarea
                  rows="3"
                  value={hotelForm[`description_${modalLangTab}`]}
                  onChange={(e) => setHotelForm({ ...hotelForm, [`description_${modalLangTab}`]: e.target.value })}
                  placeholder="Краткое описание отеля"
                />
              </div>
              <div className="form-group">
                <label>Удобства ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <div className="tags-list">
                  {hotelForm[`amenities_${modalLangTab}`]?.map((a, i) => (
                    <span key={i} className="tag">
                      {a}
                      <button onClick={() => removeAmenity(modalLangTab, i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="tag-input">
                  <input
                    type="text"
                    value={amenityInputs[modalLangTab]}
                    onChange={(e) => setAmenityInputs({ ...amenityInputs, [modalLangTab]: e.target.value })}
                    placeholder="Добавить удобство..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(modalLangTab))}
                  />
                  <button type="button" onClick={() => addAmenity(modalLangTab)}>+</button>
                </div>
              </div>

              {/* Stars */}
              <div className="form-group">
                <label>Звёзды</label>
                <select
                  value={hotelForm.stars}
                  onChange={(e) => setHotelForm({ ...hotelForm, stars: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} звёзд</option>
                  ))}
                </select>
              </div>

              {/* Image Section */}
              <div className="form-group">
                <label>Изображение</label>
                <div className="image-upload-section">
                  {hotelForm.image && (
                    <div className="image-preview">
                      <img src={hotelForm.image} alt="Preview" />
                    </div>
                  )}
                  <div className="image-upload-controls">
                    <input
                      type="text"
                      value={hotelForm.image}
                      onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
                      placeholder="URL изображения или загрузите файл"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          try {
                            const result = await upload(file)
                            if (result.success) {
                              setHotelForm({ ...hotelForm, image: result.url })
                            }
                          } catch (err) {
                            console.error('Upload failed:', err)
                          }
                        }
                      }}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Загрузка...' : 'Загрузить'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button className="btn-save" onClick={() => editingItem === 'new' ? addHotel() : updateHotel()}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Item Modal - Tabbed Design */}
      {modalType === 'info' && (
        <div className="settings-modal-overlay" onClick={closeModal}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingItem === 'new' ? 'Добавление элемента' : 'Редактирование элемента'}</h2>
              <button className="settings-modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="settings-modal-body">
              {/* Icon Picker */}
              <div className="form-group">
                <label>Выберите иконку</label>
                <div className="icon-picker-grid">
                  {icons.map(icon => (
                    <button
                      key={icon.value}
                      type="button"
                      className={`icon-picker-btn ${infoForm.icon === icon.value ? 'active' : ''}`}
                      onClick={() => setInfoForm({ ...infoForm, icon: icon.value })}
                      title={icon.label}
                    >
                      {svgIcons[icon.value]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Tabs */}
              <div className="lang-tabs-simple">
                <button className={`lang-tab-simple ${modalLangTab === 'ru' ? 'active' : ''}`} onClick={() => setModalLangTab('ru')}>
                  Русский
                </button>
                <button className={`lang-tab-simple ${modalLangTab === 'en' ? 'active' : ''}`} onClick={() => setModalLangTab('en')}>
                  Английский
                </button>
                <button className={`lang-tab-simple ${modalLangTab === 'tj' ? 'active' : ''}`} onClick={() => setModalLangTab('tj')}>
                  Таджикский
                </button>
              </div>

              {/* Language-specific fields */}
              <div className="form-group">
                <label>Заголовок ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <input
                  type="text"
                  value={infoForm[`title_${modalLangTab}`]}
                  onChange={(e) => setInfoForm({ ...infoForm, [`title_${modalLangTab}`]: e.target.value })}
                  placeholder="Заголовок"
                />
              </div>
              <div className="form-group">
                <label>Описание ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <textarea
                  rows="3"
                  value={infoForm[`description_${modalLangTab}`]}
                  onChange={(e) => setInfoForm({ ...infoForm, [`description_${modalLangTab}`]: e.target.value })}
                  placeholder="Описание"
                />
              </div>
            </div>

            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button className="btn-save" onClick={() => editingItem === 'new' ? addInfoItem() : updateInfoItem()}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
