/**
 * Контакты и ссылки — одно место на весь сайт.
 *
 * У Риты три почты намеренно: когда открываются заказы, поток писем
 * большой, и разделение по темам спасает от завала. Не сводить в одну.
 */

export const SOCIAL = {
  instagram: 'https://www.instagram.com/cutesmokey/',
  tiktok:    'https://www.tiktok.com/@cutesmokey_art',
};

export const EMAIL = {
  /** Основная: сквиды и всё, что не куклы. Ставится на видных местах. */
  main:  'squids.cutesmokeyart@gmail.com',
  /** Только куклы: раздел вопросов и юридические страницы. */
  dolls: 'cutesmokeyart@gmail.com',
  /** Реклама и коммерческие предложения: подвал и вкладка PR. */
  pr:    'pr.cutesmokeyart@gmail.com',
  /**
   * Куда бэкенд шлёт заполненные анкеты — и на кукол, и на портреты.
   * Совпадает с основной почтой намеренно: Рита хочет заявки в одном
   * ящике, а не разбирать их по двум. Адрес нигде не показывается,
   * его читает только отправка письма.
   */
  commissions: 'squids.cutesmokeyart@gmail.com',
};

export const BRAND = {
  name: 'cutesmokey',
  tagline: 'Handmade plush squids, collectible dolls and portraits',
};
