export const navigationData = [
  {
    label: 'Конференция',
    path: '/',
    hasDropdown: true,
    dropdown: [
      { label: 'О конференции', path: '/' },
      { label: 'Приветственные послания', path: '/#speakers' },
      { label: 'Программа', path: '/#program' },
      { label: 'Партнёры', path: '/#partners' },
    ],
  },
  { label: 'Программа', path: '/program' },
  { label: 'Мероприятия', path: '/events' },
  { label: 'Экскурсии', path: '/excursions' },
  { label: 'Выставка', path: '/exhibition' },
  {
    label: 'Логистика',
    path: '/logistics',
    hasDropdown: true,
    dropdown: [
      { label: 'Проживание', path: '/logistics#accommodation' },
      { label: 'Транспорт', path: '/logistics#transport' },
      { label: 'Визовая информация', path: '/logistics#visa' },
      { label: 'Полезная информация', path: '/logistics#info' },
    ],
  },
  { label: 'Регистрация', path: '/registration' },
  { label: 'Контакты', path: '/contacts' },
]

export const socialLinks = [
  {
    name: 'Twitter',
    url: '#',
    icon: 'twitter',
  },
  {
    name: 'Instagram',
    url: '#',
    icon: 'instagram',
  },
  {
    name: 'Facebook',
    url: '#',
    icon: 'facebook',
  },
]
