/**
 * ★ ЕДИНСТВЕННАЯ ТОЧКА ПЕРЕХОДА С МОКОВ НА БЭКЕНД ★
 *
 * Компоненты ходят за данными только сюда и никогда не импортируют
 * src/data/* напрямую. Когда появится Node.js-бэкенд, тела функций
 * меняются на fetch() — компоненты не трогаем вообще.
 *
 * Контракт REST-эндпоинтов описан в /api/CONTRACT.md.
 */

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

/* --- Заявки --------------------------------------------------- */

/**
 * POST /api/commissions — заявка на куклу или портрет с референсами.
 *
 * Файлы нельзя положить в JSON, поэтому на бэкенде это multipart/form-data.
 * Тело собирается здесь, чтобы компоненты про транспорт не знали.
 * Сейчас — мок: письмо уйдёт, когда появится бэкенд (см. api/CONTRACT.md).
 */
export function submitCommission(values, kind = 'doll') {
  const body = new FormData();
  body.append('kind', kind);
  for (const [key, value] of Object.entries(values)) {
    if (key === 'files') {
      for (const file of value) body.append('files', file, file.name);
    } else if (Array.isArray(value)) {
      body.append(key, value.join(','));
    } else {
      body.append(key, value ?? '');
    }
  }

  // ↓ когда появится бэкенд, мок ниже меняется на:
  //   return fetch('/api/commissions', { method: 'POST', body })
  //     .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not send'))));
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `CS-${Date.now().toString(36).toUpperCase()}`,
        status: 'received',
        kind,
        files: values.files.map((f) => ({ name: f.name, size: f.size })),
      });
    }, 900);
  });
}

/**
 * POST /api/builds — сборка сквида из конструктора.
 * Цену бэкенд обязан пересчитать сам, а не доверять клиенту.
 */
export function submitBuild(build) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: `SQ-${Date.now().toString(36).toUpperCase()}`, status: 'received', build });
    }, 900);
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

