/**
 * Полка «Available now» на главной: вещи, которые можно забрать
 * сразу, без анкеты и ожидания.
 *
 * Это не архив работ: у архива своя задача — показать, что уже
 * сделано, — и цена там не при чём. Здесь наоборот: снимок, цена
 * и строчка о том, почему вещь свободна.
 *
 * Вещь продали — удалите запись. Пустая полка не выглядит поломкой:
 * вместо карточек появляется приписка о том, что сейчас всё разобрано.
 */
export default {
  name: 'available',
  title: 'В наличии',
  type: 'document',
  fields: [
    {
      name: 'photo',
      title: 'Снимок',
      type: 'image',
      options: { hotspot: true },
      description:
        'Кадр обрезается до вертикального прямоугольника. Если обрезало не то — ' +
        'нажмите кнопку с рамкой (Crop / Hotspot) и перетащите кружок на главное.',
      fields: [
        {
          name: 'alt',
          title: 'Что на снимке',
          type: 'string',
          validation: (R) => R.max(160),
        },
      ],
      validation: (R) => R.required(),
    },
    {
      name: 'name',
      title: 'Название',
      type: 'string',
      validation: (R) => R.required().max(40),
    },
    {
      name: 'kind',
      title: 'Что это',
      type: 'string',
      description: 'Подпись мелкими буквами над названием.',
      options: {
        list: [
          { title: 'Doll',     value: 'Doll' },
          { title: 'Squid',    value: 'Squid' },
          { title: 'Portrait', value: 'Portrait' },
          { title: 'Other',    value: 'Other' },
        ],
        layout: 'radio',
      },
      initialValue: 'Doll',
    },
    {
      name: 'price',
      title: 'Цена, $',
      type: 'number',
      description: 'Только число: знак доллара подставится сам.',
      validation: (R) => R.required().min(1).precision(2),
    },
    {
      name: 'note',
      title: 'Приписка',
      type: 'string',
      description: 'Короткая строка под названием: «one of a kind», «someone changed their mind».',
      validation: (R) => R.max(80),
    },
    {
      name: 'order',
      title: 'Порядок на полке',
      type: 'number',
      description: 'Чем меньше число, тем левее. Пустое — в конец.',
    },
  ],

  preview: {
    select: { title: 'name', kind: 'kind', price: 'price', media: 'photo' },
    prepare: ({ title, kind, price, media }) => ({
      title,
      subtitle: [kind, price && `$${price}`].filter(Boolean).join(' · '),
      media,
    }),
  },

  orderings: [
    { title: 'Как на полке', name: 'shelfOrder',
      by: [{ field: 'order', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }] },
  ],
};
