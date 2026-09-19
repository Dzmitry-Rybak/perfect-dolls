import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

/**
 * Чтение контента из Sanity.
 *
 * Токен не нужен: датасет публичный на чтение, а писать может только
 * админка. useCdn — кеш на стороне сервиса, отдаёт быстро; для
 * настроек его отключаем, иначе переключатель заказов срабатывал бы
 * с задержкой до минуты.
 *
 * ВАЖНО ПРИ ПЕРЕЕЗДЕ НА СВОЙ ДОМЕН: каждый адрес, с которого сайт
 * открывается, должен быть в списке разрешённых —
 * sanity.io → проект jfxrdzrs → API → CORS origins (без Allow
 * credentials, датасет публичный). Иначе браузеру запретят запрос,
 * и сайт молча покажет вшитые в сборку данные вместо настоящих:
 * заметить это можно только по предупреждению в консоли.
 * Сейчас разрешены http://localhost:5173 и https://dolls-henna.vercel.app
 */
export const client = createClient({
  projectId: 'jfxrdzrs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,

  /* Быстро сдаваться важнее, чем упорствовать.
     По умолчанию клиент повторяет неудачный запрос пять раз с
     растущими паузами. Для мигнувшей сети это правильно, но самая
     частая поломка здесь другая — домен не внесён в разрешённые
     (CORS), и тогда повторы бессмысленны: браузер запретит все пять
     одинаково. Стоило это шести секунд спиннера на каждой странице,
     после которых всё равно показывались данные из сборки.
     Одна повторная попытка ловит случайный сбой, дальше — откат. */
  maxRetries: 1,
  retryDelay: () => 300,
  timeout: 5000,
});

const builder = createImageUrlBuilder(client);

/**
 * Ссылки на картинку под конкретное место.
 *
 * Размер задаём здесь, а не грузим один файл на все случаи: сервис
 * режет и сжимает на лету, а auto('format') отдаёт webp тем, кто его
 * понимает. fit('crop') учитывает точку, которую Маргарита отметила
 * на снимке в админке, — по ней и обрезается, а не по центру.
 */
const img = (source) => builder.image(source).auto('format').quality(78);

/** Карточка в сетке галереи — рамка 4:5. */
export const cardUrl = (source, w = 700) =>
  img(source).width(w).height(Math.round(w * 5 / 4)).fit('crop').url();

/** Плитка на страницах разделов и главной — рамка 200:260. */
export const tileUrl = (source, w = 620) =>
  img(source).width(w).height(Math.round(w * 260 / 200)).fit('crop').url();

/** Модалка — целиком, без обрезки. */
export const fullUrl = (source, w = 1800) =>
  img(source).width(w).fit('max').url();

/**
 * Набор ширин для srcset.
 *
 * Без него телефон качал кадр в 700px в ячейку шириной ~170px —
 * вчетверо больше нужного. Браузер сам выберет подходящий файл,
 * зная ширину ячейки из sizes ниже.
 */
const srcSet = (make, widths) =>
  widths.map((w) => `${make(w)} ${w}w`).join(', ');

export const cardSrcSet = (source) =>
  srcSet((w) => cardUrl(source, w), [340, 480, 700, 900]);

export const tileSrcSet = (source) =>
  srcSet((w) => tileUrl(source, w), [300, 420, 620, 840]);

/* Сколько места кадр занимает на экране — по сетке из Gallery.module.css
   (две колонки на телефоне) и Section.module.css (колонки от 210px).
   Числа должны меняться вместе с теми сетками. */
export const CARD_SIZES = '(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 280px';
export const TILE_SIZES = '(max-width: 700px) 92vw, (max-width: 1100px) 44vw, 300px';
