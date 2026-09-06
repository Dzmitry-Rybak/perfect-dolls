/**
 * ★ ЕДИНСТВЕННАЯ ТОЧКА ПЕРЕХОДА С МОКОВ НА БЭКЕНД ★
 *
 * Компоненты ходят за данными только сюда и никогда не импортируют
 * src/data/* напрямую. Когда появится Node.js-бэкенд, тела функций
 * меняются на fetch() — компоненты не трогаем вообще.
 *
 * Контракт REST-эндпоинтов описан в /api/CONTRACT.md.
 */

import { dolls, CATEGORIES } from '../data/dolls.js';
import { layers, parts, BASE_PRICE } from '../data/constructorParts.js';
import { galleryItems } from '../data/gallery.js';
import { faqItems } from '../data/faq.js';

/** Искусственная задержка: состояния загрузки должны быть настоящими
 *  с первого дня, а не появиться сюрпризом при подключении бэкенда. */
const latency = () => 180 + Math.random() * 220;

function respond(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), latency());
  });
}

export class NotFoundError extends Error {
  constructor(what) {
    super(`Не найдено: ${what}`);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

/* --- Каталог ------------------------------------------------ */

/** GET /api/dolls?category= */
export function getDolls({ category = 'all' } = {}) {
  const list = category === 'all' ? dolls : dolls.filter((d) => d.category === category);
  return respond(list);
}

/** GET /api/dolls/:slug */
export async function getDoll(slug) {
  const found = dolls.find((d) => d.slug === slug);
  if (!found) {
    await respond(null);
    throw new NotFoundError(`кукла «${slug}»`);
  }
  return respond(found);
}

/** GET /api/dolls?featured=true */
export function getFeatured(limit = 4) {
  return respond(dolls.filter((d) => d.status !== 'sold').slice(0, limit));
}

/** GET /api/categories */
export function getCategories() {
  return respond(CATEGORIES);
}

/* --- Конструктор -------------------------------------------- */

/** GET /api/constructor/parts */
export function getConstructorParts() {
  return respond({ layers, parts, basePrice: BASE_PRICE });
}

/** POST /api/builds */
export function submitBuild(config) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `build_${Date.now().toString(36)}`,
        status: 'received',
        config,
      });
    }, 600);
  });
}

/* --- Контент ------------------------------------------------ */

/** GET /api/gallery */
export function getGallery() {
  return respond(galleryItems);
}

/** GET /api/faq */
export function getFaq() {
  return respond(faqItems);
}
