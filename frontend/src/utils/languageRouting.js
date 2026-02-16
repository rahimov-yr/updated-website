const LANGUAGE_PREFIXES = ['ru', 'tj']
const DEFAULT_LANGUAGE = 'en'

export function getLanguageFromPath(pathname) {
  if (pathname.startsWith('/admin')) return null

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && LANGUAGE_PREFIXES.includes(segments[0])) {
    return segments[0]
  }
  return DEFAULT_LANGUAGE
}

export function stripLanguagePrefix(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && LANGUAGE_PREFIXES.includes(segments[0])) {
    const rest = segments.slice(1).join('/')
    return '/' + rest
  }
  return pathname
}

export function localizedPath(path, language) {
  if (!path || path.startsWith('/admin') || path.startsWith('http') || path === '#') {
    return path
  }

  const cleanPath = stripLanguagePrefix(path)

  if (!language || language === DEFAULT_LANGUAGE) {
    return cleanPath
  }

  if (cleanPath === '/') {
    return `/${language}`
  }

  return `/${language}${cleanPath}`
}
