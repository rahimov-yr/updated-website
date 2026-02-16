import LocalizedLink from '../LocalizedLink'

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  href,
  to,
  className = '',
  ...props
}) {
  const baseClass = 'btn'
  const variantClass = variant ? `btn--${variant}` : ''
  const sizeClass = size === 'large' ? 'btn--large' : ''
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()

  if (to) {
    return (
      <LocalizedLink to={to} className={classes} {...props}>
        {children}
      </LocalizedLink>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
