import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

/**
 * Hook for getting page banner settings from the admin panel.
 * Checks sources in priority order:
 *   1. Page data settings: pageDataKey (e.g., 'program_structure') with bannerTitle and bannerSubtitle fields
 *   2. Dedicated banner config: page_banner_{pageSlug} (from BannerManager)
 *   3. Hardcoded defaults passed as parameter
 *
 * @param {string} pageSlug - Unique page identifier (e.g., 'program-structure')
 * @param {object} defaults - Default values: { title: { ru, en, tj }, subtitle: { ru, en, tj } }
 * @param {string} [pageDataKey] - Optional settings key for the page data (e.g., 'program_structure')
 * @returns {{ showBanner: boolean, title: string, subtitle: string, backgroundImage: string }}
 */
export default function usePageBanner(pageSlug, defaults = {}, pageDataKey = null) {
  const { language } = useLanguage()
  const { getJsonSetting } = useSettings()

  // Source 1: Dedicated banner config (from BannerManager admin page)
  const bannerConfig = getJsonSetting(`page_banner_${pageSlug}`, null)

  // Source 2: Page data (from PagesManager / EventsManager per-page banner editor)
  const pageData = pageDataKey ? getJsonSetting(pageDataKey, null) : null

  const defaultTitle = defaults.title?.[language] || defaults.title?.ru || ''
  const defaultSubtitle = defaults.subtitle?.[language] || defaults.subtitle?.ru || ''
  const defaultBg = '/assets/images/background_wave.jpg'

  // Priority: pageData (per-page editor) > bannerConfig (BannerManager) > defaults
  let showBanner
  if (pageData && pageData.showBanner !== undefined) {
    showBanner = pageData.showBanner !== false
  } else if (bannerConfig) {
    showBanner = bannerConfig.showBanner !== false
  } else {
    showBanner = true
  }

  const title =
    pageData?.[`bannerTitle_${language}`] ||
    bannerConfig?.[`title_${language}`] ||
    defaultTitle

  const subtitle =
    pageData?.[`bannerSubtitle_${language}`] ||
    bannerConfig?.[`subtitle_${language}`] ||
    defaultSubtitle

  const backgroundImage = bannerConfig?.backgroundImage || defaultBg

  return { showBanner, title, subtitle, backgroundImage }
}
