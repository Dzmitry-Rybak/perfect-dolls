/**
 * ★ ЕДИНСТВЕННАЯ ТОЧКА ПЕРЕХОДА С МОКОВ НА БЭКЕНД ★
 *
 * Компоненты ходят за данными только сюда и никогда не импортируют
 * src/data/* напрямую. Когда появится Node.js-бэкенд, тела функций
 * меняются на fetch() — компоненты не трогаем вообще.
 *
 * Контракт REST-эндпоинтов описан в /api/CONTRACT.md.
 */

import {
  client, cardUrl, tileUrl, fullUrl,
  cardSrcSet, tileSrcSet, CARD_SIZES, TILE_SIZES,
} from './sanity.js';
import { galleryItems } from '../data/gallery.js';
import { ORDERS } from '../data/shopState.js';
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

/* --- Sanity ---------------------------------------------------
   Контент приехал в Sanity, но встроенные в сборку данные никуда не
   делись: если сервис недоступен, галерея покажет их, а не пустую
   страницу. Заглушки живут ровно для этого. */

/* hotspot и crop обязаны приехать вместе с asset: в них лежит точка,
   которую Маргарита отмечает на снимке в админке. Без них builder не
   знает, что беречь, и режет по центру — у высоких кадров срезало
   голову. Сначала я выбирал только asset, отсюда и была ошибка. */
const WORKS = `*[_type == "work"] | order(order asc, _createdAt desc) {
  "id": _id, kind, title, year, note,
  "shots": shots[]{
    alt, asset, hotspot, crop,
    "w": asset->metadata.dimensions.width,
    "h": asset->metadata.dimensions.height,
    "blur": asset->metadata.lqip
  }
}`;

/* Ссылки на выбранные работы, без самих работ: по ним страница
   раздела достаёт готовые записи из архива. */
const PICKS = `*[_id == "pages"][0]{
  "squid": squidPicks[]._ref,
  "doll": dollPicks[]._ref,
  "portrait": portraitPicks[]._ref
}`;

/* Картинки главной и полка «в наличии» — одним запросом: на главной
   они нужны вместе, а два запроса дали бы два разных момента
   появления и лишний прыжок вёрстки. */
const IMAGE = `{ alt, asset, hotspot, crop }`;
const CARD = `{ "photo": photo${IMAGE}, "photoHover": photoHover${IMAGE} }`;
const HOME = `{
  "home": *[_id == "home"][0]{
    "hero": heroPhoto${IMAGE},
    "squids": squidsCard${CARD},
    "dolls": dollsCard${CARD},
    "portraits": portraitsCard${CARD},
    "other": otherCard${CARD}
  },
  "available": *[_type == "available"] | order(order asc, _createdAt desc){
    "id": _id, name, kind, price, note, "photo": photo${IMAGE}
  }
}`;

/** Три ссылки на кадр: под сетку, под плитку раздела и под модалку.
    Одним файлом на все места обойтись нельзя — размеры разные втрое. */
/** Откат на встроенные данные — штука полезная, но молчаливая:
    сломанный CORS или опечатка в projectId выглядели бы как «всё
    работает». Поэтому в консоль пишем причину. */
function fellBack(what, err) {
  console.warn(
    `[cutesmokey] ${what}: не удалось прочитать из Sanity, показываю данные из сборки.`,
    err?.message ?? err
  );
}

const mapShot = (s) => ({
  src:  cardUrl(s),
  tile: tileUrl(s),
  full: fullUrl(s),
  alt:  s.alt ?? '',
  /* Наборы ширин: браузер сам возьмёт файл под размер ячейки.
     Одного кадра на все экраны не хватало — телефон качал вчетверо
     больше, чем показывал. */
  srcSet:     cardSrcSet(s),
  sizes:      CARD_SIZES,
  tileSrcSet: tileSrcSet(s),
  tileSizes:  TILE_SIZES,
  /* Размеры и крошечная размытая копия (её сервис делает сам).
     Нужны окну: по размерам оно сразу знает, какой формы будет кадр,
     и не схлопывается в пустую коробку, пока грузится снимок,
     а размытая копия занимает это место мгновенно — она весит
     около килобайта и приходит вместе с текстом. */
  w: s.w,
  h: s.h,
  blur: s.blur,
});

/** Одиночная картинка (главная, полка) — та же рамка, что у плитки. */
const mapPhoto = (p) =>
  (p?.asset
    ? { src: tileUrl(p), srcSet: tileSrcSet(p), sizes: TILE_SIZES, alt: p.alt ?? '' }
    : null);

/**
 * Список работ кешируется на минуту.
 *
 * За ним ходят четыре страницы — галерея и три раздела, — и без кеша
 * при переходах между ними запрос уходил бы каждый раз. Минуты хватает,
 * чтобы правка в админке доехала быстро, но переходы были мгновенными.
 */
let cache = null;
const CACHE_MS = 60_000;

/** GET /api/gallery */
export async function getGallery() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.works;
  try {
    const raw = await client.fetch(WORKS);
    if (!raw?.length) throw new Error('пусто');
    const works = raw.map((w) => ({ ...w, shots: w.shots.map(mapShot) }));
    cache = { at: Date.now(), works };
    return works;
  } catch (err) {
    fellBack('галерея', err);
    return respond(galleryItems);
  }
}

/**
 * Работы одного раздела: первые n или все.
 *
 * Заменяет worksOf() из data/gallery.js — тот читал файл и не знал
 * про то, что Маргарита добавила в админке.
 *
 * Что показать на странице раздела, выбирается в админке
 * («Страницы разделов»). Ничего не выбрано — берутся первые по полю
 * «Порядок в галерее», как было раньше. total считается по всему
 * архиву, а не по выбранным: от него зависит ссылка «See the rest»,
 * и она должна появляться, когда в архиве и правда есть ещё.
 */
export async function getWorks(kind, n) {
  /* Оба запроса разом: раньше архив и выбор работ уходили друг за
     другом, и второй ждал первого без всякой причины — лишний круг
     до сервиса на каждой странице раздела. */
  const [works, picks] = await Promise.all([getGallery(), getPicks()]);
  const all = works.filter((w) => w.kind === kind);
  const chosen = picks[kind]
    .map((id) => all.find((w) => w.id === id))
    .filter(Boolean);            // выбранную работу могли удалить из архива
  const shown = chosen.length ? chosen : all;
  return { shown: n === undefined ? shown : shown.slice(0, n), total: all.length };
}

/**
 * Что Маргарита выбрала на страницы разделов.
 *
 * Берём только идентификаторы, а сами работы находим в уже
 * загруженном архиве: второй раз тянуть те же снимки незачем.
 * Кеш общий с архивом по смыслу, но свой по времени — запрос
 * крошечный, а править выбор будут реже, чем сами работы.
 */
let picksCache = null;

async function getPicks() {
  if (picksCache && Date.now() - picksCache.at < CACHE_MS) return picksCache.picks;
  const empty = { squid: [], doll: [], portrait: [] };
  try {
    const raw = await client.fetch(PICKS);
    const picks = {
      squid:    raw?.squid    ?? [],
      doll:     raw?.doll     ?? [],
      portrait: raw?.portrait ?? [],
    };
    picksCache = { at: Date.now(), picks };
    return picks;
  } catch (err) {
    fellBack('страницы разделов', err);
    return empty;
  }
}

/**
 * GET /api/settings — открыты ли заказы.
 *
 * useCdn отключён: переключатель в админке должен срабатывать сразу,
 * а кеш сервиса держит ответ до минуты. Запрос крошечный.
 */
export async function getSettings() {
  try {
    const s = await client.withConfig({ useCdn: false })
      .fetch('*[_id == "settings"][0]');
    if (!s) throw new Error('нет документа');
    return {
      dolls:     { open: !!s.dollsOpen,     window: s.dollsWindow,     note: s.dollsNote },
      portraits: { open: !!s.portraitsOpen, window: s.portraitsWindow, note: s.portraitsNote },
      squids:    { open: !!s.squidsOpen },
    };
  } catch (err) {
    fellBack('настройки', err);
    return structuredClone(ORDERS);
  }
}

/**
 * GET /api/home — картинки главной и полка «в наличии».
 *
 * Пустой ответ — это не поломка: снимки могут быть ещё не выбраны,
 * а полка пуста почти всегда. Поэтому откат здесь не на выдуманные
 * данные, а на то, что уже вшито в сборку: рисованная заглушка
 * вместо большого снимка и кадры разделов из data/nav.js.
 */
export async function getHome() {
  const blank = { hero: null, cards: {}, available: [] };
  try {
    const { home, available } = await client.fetch(HOME);
    const cards = {};
    for (const id of ['squids', 'dolls', 'portraits', 'other']) {
      const photo = mapPhoto(home?.[id]?.photo);
      /* Второй кадр берём только вместе с первым: иначе карточка
         перетекала бы с картинки из сборки на выбранную — это две
         разные работы, и подмена читалась бы как ошибка. */
      if (photo) {
        const hover = mapPhoto(home[id].photoHover);
        cards[id] = {
          photo: photo.src,
          photoSrcSet: photo.srcSet,
          photoSizes: photo.sizes,
          photoAlt: photo.alt,
          photoHover: hover?.src,
          photoHoverSrcSet: hover?.srcSet,
        };
      }
    }
    return {
      hero: mapPhoto(home?.hero),
      cards,
      available: (available ?? [])
        .map((it) => ({ ...it, photo: mapPhoto(it.photo) }))
        .filter((it) => it.photo),
    };
  } catch (err) {
    fellBack('главная', err);
    return blank;
  }
}

/** GET /api/faq */
export function getFaq() {
  return respond(faqItems);
}

