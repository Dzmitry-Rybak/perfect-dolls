/**
 * Готовые сквиды из коллекций — блок «Ready-made designs» на странице
 * «Сквиды», между конструктором и архивом.
 *
 * Документ один на весь сайт: это не список работ, который растёт, а
 * короткий прайс готовых дизайнов. Их восемь, больше в ряд на экране
 * не помещается — отсюда и ограничение.
 *
 * Пока снимок не загружен, карточка показывает пустую рамку, а не
 * пропадает: так видно, какому дизайну фотографии ещё не хватает.
 */
const COLLECTIONS = [
  'Coraline-inspired',
  "Valentine's collection",
  'Halloween collection',
];

export default {
  name: 'squidModels',
  title: 'Готовые сквиды',
  type: 'document',
  fields: [
    {
      name: 'models',
      title: 'Модели',
      type: 'array',
      description:
        'Не больше восьми: на широком экране они стоят одним рядом. ' +
        'Порядок здесь — порядок на странице, строки можно перетаскивать.',
      validation: (R) => R.max(8),
      of: [
        {
          type: 'object',
          name: 'squidModel',
          title: 'Модель',
          fields: [
            {
              name: 'name',
              title: 'Имя',
              type: 'string',
              validation: (R) => R.required().max(24),
            },
            {
              name: 'collection',
              title: 'Коллекция',
              type: 'string',
              description: 'Подпись мелким шрифтом под именем.',
              options: { list: COLLECTIONS, layout: 'dropdown' },
            },
            {
              name: 'price',
              title: 'Цена, $',
              type: 'number',
              description: 'Только число: знак доллара подставится сам.',
              validation: (R) => R.required().min(1).precision(2),
            },
            {
              name: 'photo',
              title: 'Снимок',
              type: 'image',
              options: { hotspot: true },
              description:
                'Кадр обрезается до вертикального прямоугольника. Если обрезало ' +
                'не то — нажмите кнопку с рамкой (Crop / Hotspot) и перетащите ' +
                'кружок на главное. По нажатию на карточку снимок открывается ' +
                'целиком, поэтому грузите файл покрупнее.',
              fields: [
                {
                  name: 'alt',
                  title: 'Что на снимке',
                  type: 'string',
                  validation: (R) => R.max(160),
                },
              ],
            },
          ],
          preview: {
            select: { title: 'name', collection: 'collection', price: 'price', media: 'photo' },
            prepare: ({ title, collection, price, media }) => ({
              title,
              subtitle: [collection, price && `$${price}`].filter(Boolean).join(' · '),
              media,
            }),
          },
        },
      ],
    },
  ],

  preview: {
    select: { models: 'models' },
    prepare: ({ models }) => ({
      title: 'Готовые сквиды',
      subtitle: `${models?.length ?? 0} из 8`,
    }),
  },
};
