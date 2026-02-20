import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SettingsContext = createContext()

const API_BASE = import.meta.env.VITE_API_URL || ''

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/settings`)
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Get a single setting value
  const getSetting = useCallback((key, defaultValue = '') => {
    return settings[key] ?? defaultValue
  }, [settings])

  // Get a JSON-parsed setting value
  const getJsonSetting = useCallback((key, defaultValue = null) => {
    const value = settings[key]
    if (!value) return defaultValue
    try {
      return JSON.parse(value)
    } catch {
      return defaultValue
    }
  }, [settings])

  // Get site title settings (browser tab title)
  const getSiteTitleSettings = useCallback(() => {
    return {
      titleRu: getSetting('site_title_ru', ''),
      titleEn: getSetting('site_title_en', ''),
      titleTj: getSetting('site_title_tj', ''),
    }
  }, [getSetting])

  // Get header settings
  const getHeaderSettings = useCallback(() => {
    return {
      logoUrl: getSetting('header_logo_url', '/assets/images/logo-compact.png'),
      // Language-specific logos
      logoUrlRu: getSetting('header_logo_url_ru', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_ru.png'),
      logoUrlEn: getSetting('header_logo_url_en', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_eng.png'),
      logoUrlTj: getSetting('header_logo_url_tj', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_left_taj.png'),
      // Title is saved as header_title_* from HeaderManager
      titleRu: getSetting('header_title_ru', ''),
      titleEn: getSetting('header_title_en', ''),
      titleTj: getSetting('header_title_tj', ''),
      navigation: getJsonSetting('header_navigation', null),
      socialTwitter: getSetting('header_twitter_url', ''),
      socialInstagram: getSetting('header_instagram_url', ''),
      socialFacebook: getSetting('header_facebook_url', ''),
    }
  }, [getSetting, getJsonSetting])

  // Get footer settings
  // Keys must match what FooterManager saves: footer_ + fieldName
  const getFooterSettings = useCallback(() => {
    return {
      // Language-specific logos
      logoUrlRu: getSetting('footer_logo_url_ru', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_full_ru.png'),
      logoUrlEn: getSetting('footer_logo_url_en', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_full_eng.png'),
      logoUrlTj: getSetting('footer_logo_url_tj', '/assets/images/logo/LOGO_WATER_CONFERENCE_2026_full_taj.png'),
      // Description
      descriptionRu: getSetting('footer_description_ru', ''),
      descriptionEn: getSetting('footer_description_en', ''),
      descriptionTj: getSetting('footer_description_tj', ''),
      // Links
      quickLinks: getJsonSetting('footer_quick_links', null),
      participantLinks: getJsonSetting('footer_participant_links', null),
      // Column titles
      quickLinksTitle: {
        ru: getSetting('footer_quick_links_title_ru', 'Навигация'),
        en: getSetting('footer_quick_links_title_en', 'Quick Links'),
        tj: getSetting('footer_quick_links_title_tj', 'Навигатсия'),
      },
      participantLinksTitle: {
        ru: getSetting('footer_participants_title_ru', 'Участникам'),
        en: getSetting('footer_participants_title_en', 'For Participants'),
        tj: getSetting('footer_participants_title_tj', 'Барои иштирокчиён'),
      },
      // Contacts title
      contactsTitle: {
        ru: getSetting('footer_contacts_title_ru', 'Контакты'),
        en: getSetting('footer_contacts_title_en', 'Contacts'),
        tj: getSetting('footer_contacts_title_tj', 'Тамос'),
      },
      // Contact info (language-specific address)
      addressRu: getSetting('footer_address_ru', 'Душанбе, Таджикистан'),
      addressEn: getSetting('footer_address_en', 'Dushanbe, Tajikistan'),
      addressTj: getSetting('footer_address_tj', 'Душанбе, Тоҷикистон'),
      phone: getSetting('footer_phone', '+992 (37) 227-68-43'),
      email: getSetting('footer_email', 'secretariat@dushanbewaterprocess.org'),
      // Copyright & organizer
      copyrightRu: getSetting('footer_copyright_ru', '© 2026 Водная конференция Душанбе. Все права защищены.'),
      copyrightEn: getSetting('footer_copyright_en', '© 2026 Dushanbe Water Conference. All rights reserved.'),
      copyrightTj: getSetting('footer_copyright_tj', '© 2026 Конфронси обии Душанбе. Ҳамаи ҳуқуқҳо ҳифз шудаанд.'),
      organizerRu: getSetting('footer_organizer_ru', 'Правительство Республики Таджикистан'),
      organizerEn: getSetting('footer_organizer_en', 'Government of the Republic of Tajikistan'),
      organizerTj: getSetting('footer_organizer_tj', 'Ҳукумати Ҷумҳурии Тоҷикистон'),
      // Social links
      socialFacebook: getSetting('footer_facebook_url', ''),
      socialInstagram: getSetting('footer_instagram_url', ''),
      socialTwitter: getSetting('footer_twitter_url', ''),
    }
  }, [getSetting, getJsonSetting])

  // Get program settings
  const getProgramSettings = useCallback(() => {
    return {
      programData: getJsonSetting('program_data', null),
      pdfRu: getSetting('program_pdf_ru', ''),
      pdfEn: getSetting('program_pdf_en', ''),
      pdfTj: getSetting('program_pdf_tj', ''),
    }
  }, [getSetting, getJsonSetting])

  // Get hero section settings
  const getHeroSettings = useCallback(() => {
    return {
      // Video settings
      videoUrl: getSetting('hero_video_url', '/assets/video/hero-background.mp4'),
      youtubeUrl: getSetting('hero_youtube_url', ''),
      videoSource: getSetting('hero_video_source', 'url'),
      // Title
      titleRu: getSetting('hero_title_ru', ''),
      titleEn: getSetting('hero_title_en', ''),
      titleTj: getSetting('hero_title_tj', ''),
      // Dates
      datesRu: getSetting('hero_dates_ru', '25-28 мая 2026'),
      datesEn: getSetting('hero_dates_en', 'May 25-28, 2026'),
      datesTj: getSetting('hero_dates_tj', '25-28 майи 2026'),
      // Location
      locationRu: getSetting('hero_location_ru', ''),
      locationEn: getSetting('hero_location_en', ''),
      locationTj: getSetting('hero_location_tj', ''),
      // Quote
      quoteRu: getSetting('hero_quote_ru', ''),
      quoteEn: getSetting('hero_quote_en', ''),
      quoteTj: getSetting('hero_quote_tj', ''),
      quoteAuthorRu: getSetting('hero_quote_author_ru', ''),
      quoteAuthorEn: getSetting('hero_quote_author_en', ''),
      quoteAuthorTj: getSetting('hero_quote_author_tj', ''),
      // Buttons
      registrationBtnRu: getSetting('hero_registration_btn_ru', ''),
      registrationBtnEn: getSetting('hero_registration_btn_en', ''),
      registrationBtnTj: getSetting('hero_registration_btn_tj', ''),
      videoBtnRu: getSetting('hero_video_btn_ru', ''),
      videoBtnEn: getSetting('hero_video_btn_en', ''),
      videoBtnTj: getSetting('hero_video_btn_tj', ''),
      // Button visibility
      showRegistrationBtn: getSetting('hero_show_registration_btn', 'true'),
      showVideoBtn: getSetting('hero_show_video_btn', 'false'),
    }
  }, [getSetting])

  // Get news section settings
  const getNewsSettings = useCallback(() => {
    return {
      titleRu: getSetting('news_section_title_ru', 'Новости'),
      titleEn: getSetting('news_section_title_en', 'News'),
      titleTj: getSetting('news_section_title_tj', 'Хабарҳо'),
    }
  }, [getSetting])

  // Get loading screen settings
  const getLoadingSettings = useCallback(() => {
    return {
      logoUrl: getSetting('loading_logo_url', '/assets/images/logo-mini.png'),
      titleLine1Ru: getSetting('loading_title_line1_ru', ''),
      titleLine1En: getSetting('loading_title_line1_en', ''),
      titleLine1Tj: getSetting('loading_title_line1_tj', ''),
      titleLine2Ru: getSetting('loading_title_line2_ru', ''),
      titleLine2En: getSetting('loading_title_line2_en', ''),
      titleLine2Tj: getSetting('loading_title_line2_tj', ''),
      titleLine3Ru: getSetting('loading_title_line3_ru', ''),
      titleLine3En: getSetting('loading_title_line3_en', ''),
      titleLine3Tj: getSetting('loading_title_line3_tj', ''),
      titleLine4Ru: getSetting('loading_title_line4_ru', ''),
      titleLine4En: getSetting('loading_title_line4_en', ''),
      titleLine4Tj: getSetting('loading_title_line4_tj', ''),
      titleLine5Ru: getSetting('loading_title_line5_ru', ''),
      titleLine5En: getSetting('loading_title_line5_en', ''),
      titleLine5Tj: getSetting('loading_title_line5_tj', ''),
      duration: getSetting('loading_duration', '2'),
      bgColorStart: getSetting('loading_bg_color_start', '#0c4a6e'),
      bgColorMid: getSetting('loading_bg_color_mid', '#075985'),
      bgColorEnd: getSetting('loading_bg_color_end', '#0369a1'),
      dateColor: getSetting('loading_date_color', '#7dd3fc'),
    }
  }, [getSetting])

  // Get custom pages
  const getCustomPages = useCallback(() => {
    return getJsonSetting('custom_pages', [])
  }, [getJsonSetting])

  // Get a single custom page by slug
  const getCustomPageBySlug = useCallback((slug) => {
    const pages = getCustomPages()
    return pages.find(p => p.slug === slug && p.isPublished)
  }, [getCustomPages])

  // Get published custom pages for menu
  const getPublishedCustomPages = useCallback(() => {
    const pages = getCustomPages()
    return pages.filter(p => p.isPublished && p.showInMenu)
  }, [getCustomPages])

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      error,
      getSetting,
      getJsonSetting,
      getSiteTitleSettings,
      getHeaderSettings,
      getFooterSettings,
      getProgramSettings,
      getHeroSettings,
      getNewsSettings,
      getLoadingSettings,
      getCustomPages,
      getCustomPageBySlug,
      getPublishedCustomPages,
      refetchSettings: fetchSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
