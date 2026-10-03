/**
 * Разделы сайта — карточки на главной. Порядок здесь = порядок на
 * ней и НЕ связан с порядком в шапке: тот задаётся списком NAV ниже.
 * Сейчас оба начинаются с кукол, но это совпадение, а не правило:
 * менять их придётся в двух местах.
 */
/* photo — настоящий снимок для карточки на главной. Где его нет
   (пока это «Other creations»), остаётся процедурная заглушка.
   photoHover — вторая работа того же раздела: при наведении карточка
   плавно перетекает на неё. Alt у неё не нужен, это тот же смысл
   другой картинкой, и для скринридера она скрыта.

   Снимки берём из public/art/home — это уменьшенные до 525px копии
   тех же кадров. Карточка здесь всего 266px, а полноразмерные из
   галереи весили бы 907 КБ на страницу вместо 584. */
export const SECTIONS = [
  {
    id: 'dolls', to: '/dolls', label: 'Dolls',
    blurb: 'Unique collectible “mini me” dolls with button eyes.',
    accent: '#C9BFD6',
    photo: '/art/home/dolls-a.jpg',
    photoAlt: 'Two wedding dolls side by side: a bride in a lace gown and veil, a groom in a black tuxedo',
    photoHover: '/art/home/dolls-b.jpg',
  },
  {
    id: 'squids', to: '/squids', label: 'Squids',
    blurb: 'Big handmade plush squids. Made from soft faux fur.',
    accent: '#F0A9C6',
    photo: '/art/home/squids-a.jpg',
    photoAlt: 'Black horned plush squid with pink-lined tentacles and an iridescent heart button',
    photoHover: '/art/home/squids-b.jpg',
  },
  {
    id: 'portraits', to: '/portraits', label: 'Portraits',
    blurb: 'Hand-drawn portraits of people as “mini me” dolls, along with their pets.',
    accent: '#E8C46A',
    photo: '/art/home/portraits-a.jpg',
    photoAlt: 'Ink portrait of a girl in glasses holding a toad, framed by drawn vines',
    photoHover: '/art/home/portraits-b.jpg',
  },
  {
    id: 'other', to: '/other', label: 'Other creations',
    blurb: 'Clay pieces, boxes, small things that fit nowhere else.',
    accent: '#8FB3AE',
  },
];

/**
 * Ссылки в шапке. Свой порядок, не общий с SECTIONS.
 */
/* Builder в списке нет намеренно: рядом стоит кнопка «Build a squid»,
   которая ведёт туда же, и два входа в одно место только удлиняли
   строку — из-за неё же порог бургер-меню пришлось поднимать. */
export const NAV = [
  { to: '/dolls',     label: 'Dolls' },
  { to: '/squids',    label: 'Squids' },
  { to: '/portraits', label: 'Portraits' },
  { to: '/gallery',   label: 'Gallery' },
  /* Страница про Риту. Адрес остался /workshop с прежних времён —
     менять его значило бы ломать уже разосланные ссылки. */
  { to: '/workshop',  label: 'About' },
  { to: '/faq',       label: 'Q&A' },
];
