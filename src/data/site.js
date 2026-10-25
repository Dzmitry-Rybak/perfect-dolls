/**
 * Контакты и ссылки — одно место на весь сайт.
 *
 * У Риты три почты намеренно: когда открываются заказы, поток писем
 * большой, и разделение по темам спасает от завала. Не сводить в одну.
 */

export const SOCIAL = {
  instagram: 'https://www.instagram.com/cutesmokey/',
  tiktok:    'https://www.tiktok.com/@cutesmokey_art',
  /** Мини-донаты: «Support my work» на главной, в About и в подвале. */
  coffee:    'https://buymeacoffee.com/cutesmokeyart',
};

export const EMAIL = {
  /** Основная: сквиды и всё, что не куклы. Ставится на видных местах. */
  main:  'squids.cutesmokeyart@gmail.com',
  /** Только куклы: раздел вопросов и юридические страницы. */
  dolls: 'cutesmokeyart@gmail.com',
  /** Реклама и коммерческие предложения: подвал и вкладка PR. */
  pr:    'pr.cutesmokeyart@gmail.com',
  /**
   * Куда бэкенд шлёт заполненные анкеты — по виду анкеты. Анкеты на
   * куклу Рита попросила слать на кукольный ящик, остальные — на
   * основной. Адреса нигде не показываются, их читает только отправка
   * письма.
   */
  commissions: {
    doll:     'cutesmokeyart@gmail.com',
    portrait: 'squids.cutesmokeyart@gmail.com',
    squid:    'squids.cutesmokeyart@gmail.com',
    build:    'squids.cutesmokeyart@gmail.com',
  },
};

export const BRAND = {
  name: 'cutesmokey',
  tagline: 'Handmade plush squids, collectible dolls and portraits',
};
