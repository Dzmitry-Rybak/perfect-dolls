/** Валюта меняется здесь — одна константа на весь сайт. */
export const CURRENCY = 'EUR';
export const LOCALE = 'ru-RU';

const money = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => money.format(value);

/** Детерминированный «случайный» наклон: карточка всегда висит
 *  под одним и тем же углом, а не прыгает при каждом рендере. */
export function tiltFor(seed) {
  const n = String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((n % 13) - 6) / 10; // −0.6° … +0.6°
}

/** Русское склонение: plural(1,'кукла','куклы','кукол') → 'кукла' */
export function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
