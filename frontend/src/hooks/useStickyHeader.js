import { useState, useEffect, useRef, useCallback } from 'react'

const useStickyHeader = (defaultSticky = false) => {
  const [isSticky, setIsSticky] = useState(defaultSticky)
  const headerRef = useRef(null)

  const toggleStickiness = useCallback(
    ({ top }) => {
      // When header's top edge reaches or passes the viewport top, make it sticky
      if (top <= 0) {
        !isSticky && setIsSticky(true)
      } else {
        isSticky && setIsSticky(false)
      }
    },
    [isSticky]
  )

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        toggleStickiness(headerRef.current.getBoundingClientRect())
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Check initial state
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toggleStickiness])

  return { headerRef, isSticky }
}

export default useStickyHeader
