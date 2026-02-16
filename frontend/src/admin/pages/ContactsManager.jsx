import { useState, useEffect } from 'react'
import { useSettings } from '../hooks/useApi'
import './ContactsManager.css'

const defaultContactCards = [
  {
    id: 1,
    type: 'secretariat',
    icon: 'phone',
    phone: '+992 (37) 227-68-43',
    email: 'secretariat@dushanbewaterprocess.org',
    category_ru: 'Главный контакт',
    category_en: 'Main Contact',
    category_tj: 'Тамоси асоси',
    title_ru: 'Секретариат конференции',
    title_en: 'Conference Secretariat',
    title_tj: 'Котибияти конференсия',
    description_ru: 'По всем общим вопросам о конференции',
    description_en: 'For all general inquiries about the conference',
    description_tj: 'Барои тамоми саволхо дар бораи конференсия'
  },
  {
    id: 2,
    type: 'registration',
    icon: 'email',
    phone: '',
    email: 'registration@dushanbewaterprocess.org',
    category_ru: 'Регистрация',
    category_en: 'Registration',
    category_tj: 'Бакайдгири',
    title_ru: 'Отдел регистрации',
    title_en: 'Registration Department',
    title_tj: 'Шуъбаи бакайдгири',
    description_ru: 'Вопросы регистрации и аккредитации',
    description_en: 'Registration and accreditation inquiries',
    description_tj: 'Саволхо оид ба бакайдгири ва аккредитатсия'
  },
  {
    id: 3,
    type: 'logistics',
    icon: 'hotel',
    phone: '',
    email: 'logistics@dushanbewaterprocess.org',
    category_ru: 'Логистика',
    category_en: 'Logistics',
    category_tj: 'Логистика',
    title_ru: 'Координатор по логистике',
    title_en: 'Logistics Coordinator',
    title_tj: 'Хамохангсози логистика',
    description_ru: 'Размещение, транспорт и визовая поддержка',
    description_en: 'Accommodation, transport and visa support',
    description_tj: 'Чойгиршави, наклиёт ва дастгирии раводид'
  },
  {
    id: 4,
    type: 'media',
    icon: 'camera',
    phone: '',
    email: 'media@dushanbewaterprocess.org',
    category_ru: 'Пресса',
    category_en: 'Press',
    category_tj: 'Матбуот',
    title_ru: 'Пресс-служба',
    title_en: 'Press Office',
    title_tj: 'Хадамоти матбуот',
    description_ru: 'Медиа-запросы и аккредитация СМИ',
    description_en: 'Media inquiries and press accreditation',
    description_tj: 'Дархостхои расонахо ва аккредитатсияи матбуот'
  }
]

const defaultMapSettings = {
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.7657!2d68.7738!3d38.5598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDMzJzM1LjMiTiA2OMKwNDYnMjUuNyJF!5e0!3m2!1sru!2s!4v1234567890',
  address_ru: 'Душанбе, Таджикистан',
  address_en: 'Dushanbe, Tajikistan',
  address_tj: 'Душанбе, Точикистон'
}

const defaultSocialLinks = [
  { id: 1, platform: 'facebook', url: 'https://facebook.com/dushanbewaterprocess', enabled: true },
  { id: 2, platform: 'twitter', url: 'https://twitter.com/dushanbewaterprocess', enabled: true },
  { id: 3, platform: 'instagram', url: 'https://instagram.com/dushanbewaterprocess', enabled: true },
  { id: 4, platform: 'telegram', url: 'https://t.me/dushanbewaterprocess', enabled: true }
]

// SVG Icons
const icons = {
  phone: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  hotel: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <circle cx="12" cy="12" r="3.2"/>
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  contacts: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/>
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  spinner: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="save-status-spinner">
      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  )
}

const iconOptions = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'camera', label: 'Camera' },
  { value: 'building', label: 'Building' },
  { value: 'info', label: 'Info' },
  { value: 'globe', label: 'Globe' },
  { value: 'location', label: 'Location' }
]

const platformOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' }
]

const getIcon = (name) => icons[name] || icons.info

export default function ContactsManager({ embedded = false }) {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ru')
  const [activeSection, setActiveSection] = useState('cards')

  // Modal states
  const [showCardModal, setShowCardModal] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [editingCardId, setEditingCardId] = useState(null)
  const [editingSocialId, setEditingSocialId] = useState(null)
  const [modalLangTab, setModalLangTab] = useState('ru')

  // Form states for modals
  const [cardForm, setCardForm] = useState({
    icon: 'info',
    phone: '',
    email: '',
    category_ru: '', category_en: '', category_tj: '',
    title_ru: '', title_en: '', title_tj: '',
    description_ru: '', description_en: '', description_tj: ''
  })

  const [socialForm, setSocialForm] = useState({
    platform: 'facebook',
    url: '',
    enabled: true
  })

  const { list: loadSettings, update: saveSettingsApi } = useSettings()

  const [contactCards, setContactCards] = useState(defaultContactCards)
  const [mapSettings, setMapSettings] = useState(defaultMapSettings)
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [pageSettings, setPageSettings] = useState({
    title_ru: 'Контакты',
    title_en: 'Contacts',
    title_tj: 'Тамосҳо',
    subtitle_ru: 'Свяжитесь с организаторами конференции',
    subtitle_en: 'Contact the conference organizers',
    subtitle_tj: 'Бо ташкилкунандагони конфронс тамос гиред',
  })

  useEffect(() => {
    loadContactsData()
  }, [])

  const loadContactsData = async () => {
    setLoading(true)
    try {
      const settings = await loadSettings()
      const settingsMap = {}
      settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      setContactCards(settingsMap.contacts_cards ? JSON.parse(settingsMap.contacts_cards) : defaultContactCards)
      setMapSettings(settingsMap.contacts_map ? JSON.parse(settingsMap.contacts_map) : defaultMapSettings)
      setSocialLinks(settingsMap.contacts_social ? JSON.parse(settingsMap.contacts_social) : defaultSocialLinks)
      if (settingsMap.contacts_page_settings) {
        setPageSettings(JSON.parse(settingsMap.contacts_page_settings))
      }
      // Load banner settings
      setBannerSettings({
        showBanner: settingsMap.contacts_show_banner !== 'false',
        bannerTitle_ru: settingsMap.contacts_banner_title_ru || 'Контакты',
        bannerTitle_en: settingsMap.contacts_banner_title_en || 'Contacts',
        bannerTitle_tj: settingsMap.contacts_banner_title_tj || 'Тамос'
      })
    } catch (err) {
      console.error('Failed to load contacts:', err)
      setContactCards(defaultContactCards)
      setMapSettings(defaultMapSettings)
      setSocialLinks(defaultSocialLinks)
    } finally {
      setLoading(false)
    }
  }

  const saveAll = async (overrides = {}) => {
    const data = {
      cards: overrides.cards ?? contactCards,
      map: overrides.map ?? mapSettings,
      social: overrides.social ?? socialLinks,
      page: overrides.page ?? pageSettings,
      banner: overrides.banner ?? bannerSettings,
    }
    setSaveStatus({ type: 'saving', message: 'Сохранение...' })
    try {
      await saveSettingsApi([
        { key: 'contacts_cards', value: JSON.stringify(data.cards) },
        { key: 'contacts_map', value: JSON.stringify(data.map) },
        { key: 'contacts_social', value: JSON.stringify(data.social) },
        { key: 'contacts_page_settings', value: JSON.stringify(data.page) },
        { key: 'contacts_show_banner', value: data.banner.showBanner ? 'true' : 'false' },
        { key: 'contacts_banner_title_ru', value: data.banner.bannerTitle_ru },
        { key: 'contacts_banner_title_en', value: data.banner.bannerTitle_en },
        { key: 'contacts_banner_title_tj', value: data.banner.bannerTitle_tj },
      ])
      setSaveStatus({ type: 'success', message: 'Сохранено!' })
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus({ type: 'error', message: 'Ошибка сохранения' })
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  // Card modal functions
  const openAddCardModal = () => {
    setCardForm({
      icon: 'info',
      phone: '',
      email: '',
      category_ru: '', category_en: '', category_tj: '',
      title_ru: '', title_en: '', title_tj: '',
      description_ru: '', description_en: '', description_tj: ''
    })
    setEditingCardId('new')
    setModalLangTab('ru')
    setShowCardModal(true)
  }

  const openEditCardModal = (card) => {
    setCardForm({ ...card })
    setEditingCardId(card.id)
    setModalLangTab('ru')
    setShowCardModal(true)
  }

  const closeCardModal = () => {
    setShowCardModal(false)
    setEditingCardId(null)
  }

  const saveCardModal = () => {
    let newCards
    if (editingCardId === 'new') {
      newCards = [...contactCards, { ...cardForm, id: Date.now(), type: 'custom' }]
    } else {
      newCards = contactCards.map(card =>
        card.id === editingCardId ? { ...card, ...cardForm } : card
      )
    }
    setContactCards(newCards)
    closeCardModal()
    saveAll({ cards: newCards })
  }

  const handleDeleteCard = (id) => {
    if (window.confirm('Удалить этот контакт?')) {
      const newCards = contactCards.filter(card => card.id !== id)
      setContactCards(newCards)
      saveAll({ cards: newCards })
    }
  }

  const handleMapChange = (field, value) => {
    setMapSettings(prev => ({ ...prev, [field]: value }))
  }

  // Social modal functions
  const openAddSocialModal = () => {
    setSocialForm({
      platform: 'facebook',
      url: '',
      enabled: true
    })
    setEditingSocialId('new')
    setShowSocialModal(true)
  }

  const openEditSocialModal = (link) => {
    setSocialForm({ ...link })
    setEditingSocialId(link.id)
    setShowSocialModal(true)
  }

  const closeSocialModal = () => {
    setShowSocialModal(false)
    setEditingSocialId(null)
  }

  const saveSocialModal = () => {
    let newSocial
    if (editingSocialId === 'new') {
      newSocial = [...socialLinks, { ...socialForm, id: Date.now() }]
    } else {
      newSocial = socialLinks.map(link =>
        link.id === editingSocialId ? { ...link, ...socialForm } : link
      )
    }
    setSocialLinks(newSocial)
    closeSocialModal()
    saveAll({ social: newSocial })
  }

  const handleDeleteSocial = (id) => {
    if (window.confirm('Удалить эту ссылку?')) {
      const newSocial = socialLinks.filter(link => link.id !== id)
      setSocialLinks(newSocial)
      saveAll({ social: newSocial })
    }
  }

  const handleSocialToggle = (id, enabled) => {
    const newSocial = socialLinks.map(link =>
      link.id === id ? { ...link, enabled } : link
    )
    setSocialLinks(newSocial)
    saveAll({ social: newSocial })
  }

  const sections = [
    { id: 'cards', label: 'Контакты', icon: 'contacts', count: contactCards.length }
  ]

  // Banner settings handlers
  const [bannerSettings, setBannerSettings] = useState({
    showBanner: true,
    bannerTitle_ru: 'Контакты',
    bannerTitle_en: 'Contacts',
    bannerTitle_tj: 'Тамос'
  })
  const [bannerLangTab, setBannerLangTab] = useState('ru')

  if (loading) {
    return <div className="section-loading">Загрузка...</div>
  }

  return (
    <div className={`contacts-manager ${embedded ? 'embedded' : ''}`}>
      {/* Header */}
      <div className="page-manager-header">
        <div className="page-manager-title">
          <h1>Контакты</h1>
          <p>Контактная информация</p>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`save-status save-status--${saveStatus.type}`}>
          {saveStatus.type === 'saving' && icons.spinner}
          {saveStatus.type === 'success' && icons.check}
          {saveStatus.type === 'error' && icons.error}
          <span>{saveStatus.message}</span>
          <button className="save-status-close" onClick={() => setSaveStatus(null)}>{icons.close}</button>
        </div>
      )}

      {/* Section Navigation - Horizontal Tabs */}
      <nav className="section-tabs-horizontal">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="section-tab-label">{section.label}</span>
            {section.count !== undefined && (
              <span className="section-tab-count">{section.count}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="contacts-layout">
        {/* Content */}
        <div className="contacts-content">
          {/* Banner Settings Card - Always visible at top */}
          <div className="banner-settings-card" style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: bannerSettings.showBanner ? '12px' : 0 }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                Баннер страницы
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {bannerSettings.showBanner ? 'Включен' : 'Выключен'}
                </span>
                <input
                  type="checkbox"
                  checked={bannerSettings.showBanner}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, showBanner: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>

            {bannerSettings.showBanner && (
              <div>
                <div className="lang-tabs-inline" style={{ marginBottom: '0.5rem' }}>
                  <button className={bannerLangTab === 'ru' ? 'active' : ''} onClick={() => setBannerLangTab('ru')}>РУС</button>
                  <button className={bannerLangTab === 'en' ? 'active' : ''} onClick={() => setBannerLangTab('en')}>ENG</button>
                  <button className={bannerLangTab === 'tj' ? 'active' : ''} onClick={() => setBannerLangTab('tj')}>ТАД</button>
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Заголовок баннера</label>
                  <input
                    type="text"
                    value={bannerSettings[`bannerTitle_${bannerLangTab}`] || ''}
                    onChange={(e) => setBannerSettings({
                      ...bannerSettings,
                      [`bannerTitle_${bannerLangTab}`]: e.target.value
                    })}
                    placeholder="Введите заголовок"
                  />
                </div>
                <button
                  className="btn-save-banner"
                  onClick={() => saveAll()}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #2d5a87 0%, #1e4268 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Сохранить
                </button>
              </div>
            )}
          </div>

          {/* Contact Cards Section */}
          {activeSection === 'cards' && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Контактные карточки</h3>
                <button className="btn-add" onClick={openAddCardModal}>+ Добавить контакт</button>
              </div>

              <div className="contacts-list">
                {contactCards.map(card => (
                  <div key={card.id} className="contact-card-admin">
                    <div className="contact-card-icon">
                      {getIcon(card.icon)}
                    </div>
                    <div className="contact-card-content">
                      <span className="contact-card-category">{card.category_ru}</span>
                      <h4>{card.title_ru || 'Без названия'}</h4>
                      <p>{card.description_ru}</p>
                      <div className="contact-card-info">
                        {card.phone && <span>{icons.phone} {card.phone}</span>}
                        {card.email && <span>{icons.email} {card.email}</span>}
                      </div>
                    </div>
                    <div className="contact-card-actions">
                      <button className="btn-edit" onClick={() => openEditCardModal(card)}>Изменить</button>
                      <button className="btn-delete" onClick={() => handleDeleteCard(card.id)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Contact Card Modal */}
      {showCardModal && (
        <div className="settings-modal-overlay" onClick={closeCardModal}>
          <div className="settings-modal settings-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{editingCardId === 'new' ? 'Добавление контакта' : 'Редактирование контакта'}</h2>
              <button className="settings-modal-close" onClick={closeCardModal}>
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
                  {iconOptions.map(icon => (
                    <button
                      key={icon.value}
                      type="button"
                      className={`icon-picker-btn ${cardForm.icon === icon.value ? 'active' : ''}`}
                      onClick={() => setCardForm({ ...cardForm, icon: icon.value })}
                      title={icon.label}
                    >
                      {getIcon(icon.value)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="form-row">
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="text"
                    value={cardForm.phone}
                    onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                    placeholder="+992 (XX) XXX-XX-XX"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={cardForm.email}
                    onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                    placeholder="email@example.org"
                  />
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
                <label>Категория ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <input
                  type="text"
                  value={cardForm[`category_${modalLangTab}`]}
                  onChange={(e) => setCardForm({ ...cardForm, [`category_${modalLangTab}`]: e.target.value })}
                  placeholder="Категория контакта"
                />
              </div>
              <div className="form-group">
                <label>Название ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <input
                  type="text"
                  value={cardForm[`title_${modalLangTab}`]}
                  onChange={(e) => setCardForm({ ...cardForm, [`title_${modalLangTab}`]: e.target.value })}
                  placeholder="Название контакта"
                />
              </div>
              <div className="form-group">
                <label>Описание ({modalLangTab === 'ru' ? 'Русский' : modalLangTab === 'en' ? 'Английский' : 'Таджикский'})</label>
                <textarea
                  rows="3"
                  value={cardForm[`description_${modalLangTab}`]}
                  onChange={(e) => setCardForm({ ...cardForm, [`description_${modalLangTab}`]: e.target.value })}
                  placeholder="Описание контакта"
                />
              </div>
            </div>
            <div className="settings-modal-footer">
              <button className="btn-cancel" onClick={closeCardModal}>Отмена</button>
              <button className="btn-save" onClick={saveCardModal}>Сохранить</button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
