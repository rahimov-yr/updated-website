import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for responsive design - detects viewport breakpoints
 * Breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop)
 */

// Breakpoint values
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
}

/**
 * Hook to check if a media query matches
 * @param {string} query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event) => setMatches(event.matches)

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [query])

  return matches
}

/**
 * Hook to get current device type based on viewport width
 * @returns {Object} - Object with boolean flags for each device type
 */
export function useDevice() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`)
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet + 1}px) and (max-width: ${BREAKPOINTS.desktop}px)`)
  const isLargeDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop + 1}px)`)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTabletOrMobile: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLargeDesktop,
  }
}

/**
 * Hook to get current viewport dimensions
 * @returns {Object} - Object with width and height
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const handleResize = useCallback(() => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Debounce resize events for performance
    let timeoutId
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [handleResize])

  return viewport
}

/**
 * Hook to check if viewport is below a certain breakpoint
 * @param {number|string} breakpoint - Breakpoint value or name
 * @returns {boolean} - Whether viewport is below the breakpoint
 */
export function useBreakpointDown(breakpoint) {
  const value = typeof breakpoint === 'string' ? BREAKPOINTS[breakpoint] : breakpoint
  return useMediaQuery(`(max-width: ${value}px)`)
}

/**
 * Hook to check if viewport is above a certain breakpoint
 * @param {number|string} breakpoint - Breakpoint value or name
 * @returns {boolean} - Whether viewport is above the breakpoint
 */
export function useBreakpointUp(breakpoint) {
  const value = typeof breakpoint === 'string' ? BREAKPOINTS[breakpoint] : breakpoint
  return useMediaQuery(`(min-width: ${value}px)`)
}

export default useMediaQuery
