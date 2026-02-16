import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { localizedPath } from '../utils/languageRouting'

export default function LocalizedLink({ to, children, ...props }) {
  const { language } = useLanguage()
  return (
    <Link to={localizedPath(to, language)} {...props}>
      {children}
    </Link>
  )
}
