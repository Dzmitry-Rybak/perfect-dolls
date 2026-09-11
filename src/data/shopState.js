/**
 * Открыты ли заказы.
 *
 * Куклы и портреты Рита открывает окнами, а не постоянно — иначе
 * заявок приходит больше, чем можно сшить. Пока это правится здесь
 * руками; позже переедет в админку.
 *
 * open: false  → кнопка ведёт на страницу «заказы закрыты» с подпиской
 * open: true   → кнопка открывает анкету
 * window       → примерный срок, если точной даты ещё нет
 */

export const ORDERS = {
  dolls: {
    open: false,
    window: 'late October 2026',
    note: 'Exact date announced a week or two before.',
  },
  portraits: {
    open: false,
    window: 'November 2026',
    note: 'Portrait slots open a few times a year, usually in small batches.',
  },
  /** Сквиды принимаются всегда — они собираются в конструкторе. */
  squids: { open: true },
};
