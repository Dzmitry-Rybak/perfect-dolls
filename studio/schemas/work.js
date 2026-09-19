/**
 * Работа: сквид, кукла или портрет.
 *
 * Поля названы так, как их видит Маргарита, а не как удобно коду.
 * Обязательных — минимум: вид, название и хотя бы один снимок.
 * Всё остальное можно не заполнять, страница это переживёт: год и
 * подпись не показываются, если пустые (так уже сделано в карточке).
 */
export default {
  name: 'work',
  title: 'Работа',
  type: 'document',
  fields: [
    {
      name: 'kind',
      title: 'Что это',
      type: 'string',
      options: {
        list: [
          { title: 'Сквид',   value: 'squid' },
          { title: 'Кукла',   value: 'doll' },
          { title: 'Портрет', value: 'portrait' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    },
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (R) => R.required().max(60),
    },
    {
      name: 'year',
      title: 'Год',
      type: 'number',
      description: 'Можно не заполнять — тогда в подписи его не будет.',
      validation: (R) => R.min(2015).max(2100).integer(),
    },
    {
      name: 'note',
      title: 'Судьба работы',
      type: 'string',
      description: 'Короткая строка рядом с годом: «Уехала в Гент», «Сделана на заказ».',
      validation: (R) => R.max(80),
    },
    {
      name: 'shots',
      title: 'Снимки',
      type: 'array',
      description:
        'Первым ставьте общий план — он показывается в карточке. Дальше детали. ' +
        'Порядок можно перетаскивать. Размер и формат неважны: снимок сам ' +
        'уменьшится под каждое место на сайте. ' +
        'В карточке кадр обрезается до вертикального прямоугольника, поэтому ' +
        'у очень вытянутых и у горизонтальных снимков края не поместятся. ' +
        'Если обрезало не то — нажмите на снимке кнопку с рамкой (Crop / Hotspot) ' +
        'и перетащите кружок на то, что должно остаться в кадре. ' +
        'При нажатии на работу она открывается целиком, без обрезки.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },   // выбор важной точки для обрезки 4:5 в карточке
          fields: [
            {
              name: 'alt',
              title: 'Что на снимке',
              type: 'string',
              description:
                'Одна фраза для тех, кто не видит картинку, и для поиска. ' +
                'Например: «Чёрный сквид с фиолетовой пуговицей и ягодами из глины».',
              validation: (R) => R.required().max(160),
            },
          ],
        },
      ],
      validation: (R) => R.required().min(1),
    },
    {
      name: 'order',
      title: 'Порядок в галерее',
      type: 'number',
      description: 'Чем меньше число, тем выше работа. Пустое — в конец.',
    },
  ],

  /* Как карточка выглядит в списке админки. */
  preview: {
    select: { title: 'title', kind: 'kind', year: 'year', media: 'shots.0' },
    prepare: ({ title, kind, year, media }) => ({
      title,
      subtitle: [{ squid: 'Сквид', doll: 'Кукла', portrait: 'Портрет' }[kind], year]
        .filter(Boolean).join(' · '),
      media,
    }),
  },

  orderings: [
    { title: 'Как на сайте', name: 'siteOrder',
      by: [{ field: 'order', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }] },
  ],
};
