/**
 * Готовые сквиды из коллекций.
 *
 * Это не конструктор: восемь дизайнов, которые Рита уже придумала и
 * повторяет. Человек может не собирать своего, а взять готового —
 * поэтому раздел стоит сразу после конструктора и перед архивом.
 *
 * Все стандартного размера (~75 см), поэтому цена у всех одна и та же
 * базовая. Если у какой-то модели она своя — ставится числом прямо
 * в её строке.
 */

import { BASE_PRICE } from './squidBuilder.js';

/**
 * Порядок здесь = порядок на странице: сначала одиночная модель,
 * потом две коллекции по старшинству.
 *
 * Снимков здесь нет и не будет: они живут в админке, раздел «Готовые
 * сквиды». Этот список — запасной, на случай если сервис недоступен;
 * тогда страница покажет имена с пустыми рамками вместо пустоты.
 * Название коллекции хранится строкой, а не ключом, — ровно так же,
 * как приходит из админки, чтобы два источника не разошлись.
 */
export const squidModels = [
  { id: 'bluet',     name: 'Bluet',      collection: 'Coraline-inspired', price: BASE_PRICE, photo: null },

  { id: 'marta',     name: 'Marta',      collection: "Valentine's collection", price: BASE_PRICE, photo: null },
  { id: 'lilith',    name: 'Lilith',     collection: "Valentine's collection", price: BASE_PRICE, photo: null },
  { id: 'amalthea',  name: 'Amalthea',   collection: "Valentine's collection", price: BASE_PRICE, photo: null },

  { id: 'samael',    name: 'Samael',     collection: 'Halloween collection', price: BASE_PRICE, photo: null },
  { id: 'salem',     name: 'Salem',      collection: 'Halloween collection', price: BASE_PRICE, photo: null },
  { id: 'annabelle', name: 'Annabelle',  collection: 'Halloween collection', price: BASE_PRICE, photo: null },
  { id: 'amon',      name: 'Amon',       collection: 'Halloween collection', price: BASE_PRICE, photo: null },
];
