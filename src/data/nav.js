/** Разделы сайта. Порядок = порядок в шапке и на главной. */
export const SECTIONS = [
  {
    id: 'squids', to: '/squids', label: 'Squids',
    blurb: 'Big plush squids with button faces. Built to your colours.',
    accent: '#F0A9C6',
  },
  {
    id: 'dolls', to: '/dolls', label: 'Dolls',
    blurb: 'Collectible cloth dolls, made one at a time.',
    accent: '#C9BFD6',
  },
  {
    id: 'portraits', to: '/portraits', label: 'Portraits',
    blurb: 'Hand-drawn portraits of people and their animals.',
    accent: '#E8C46A',
  },
  {
    id: 'other', to: '/other', label: 'Other creations',
    blurb: 'Clay pieces, boxes, small things that fit nowhere else.',
    accent: '#8FB3AE',
  },
];

/** Ссылки в шапке. */
export const NAV = [
  { to: '/squids',    label: 'Squids' },
  { to: '/builder',   label: 'Builder' },
  { to: '/dolls',     label: 'Dolls' },
  { to: '/portraits', label: 'Portraits' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/workshop',  label: 'Workshop' },
  { to: '/faq',       label: 'Q&A' },
];
