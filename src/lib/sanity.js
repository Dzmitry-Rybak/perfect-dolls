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
