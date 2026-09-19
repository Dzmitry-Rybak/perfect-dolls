/**
 * Главный экран. Документ ровно один — второй завести нельзя
 * (в конфиге он подключён как singleton).
 *
 * Здесь лежат только картинки: тексты главной по-прежнему в коде,
 * их правят редко и не по одному, а вместе с вёрсткой.
 *
 * Если снимок не выбран, сайт не ломается: большая картинка
 * заменяется на рисованную заглушку, а карточка раздела — на кадр,
 * вшитый в сборку (src/data/nav.js).
 */
export default {
  name: 'home',
  title: 'Главная',
  type: 'document',
  groups: [
    { name: 'hero',  title: 'Вверху страницы', default: true },
    { name: 'cards', title: 'Четыре раздела' },
  ],
  fields: [
    {
      name: 'heroPhoto',
      title: 'Главное изображение',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description:
        'Самый верхний снимок, рядом с «Sewn from the dark». ' +
        'Стоит вертикально, в рамке с кусочком скотча сверху.',
      fields: [
        {
          name: 'alt',
          title: 'Что на снимке',
          type: 'string',
          description: 'Одна фраза для тех, кто не видит картинку.',
          validation: (R) => R.max(160),
        },
      ],
    },

    /* Четыре карточки идут ровно в том порядке, в каком стоят
       на главной; их набор задан кодом, поэтому поля именованные,
       а не список — лишнюю карточку всё равно некуда показать. */
    { name: 'squidsCard',    title: 'Squids',          type: 'homeCard', group: 'cards' },
    { name: 'dollsCard',     title: 'Dolls',           type: 'homeCard', group: 'cards' },
    { name: 'portraitsCard', title: 'Portraits',       type: 'homeCard', group: 'cards' },
    { name: 'otherCard',     title: 'Other creations', type: 'homeCard', group: 'cards' },
  ],

  preview: {
    select: { media: 'heroPhoto' },
    prepare: ({ media }) => ({ title: 'Главная', media }),
  },
};
