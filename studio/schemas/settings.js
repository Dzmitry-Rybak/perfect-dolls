/**
 * Настройки сайта. Документ ровно один — второй завести нельзя
 * (в конфиге он подключён как singleton).
 *
 * Сюда переезжает то, что сейчас лежит в src/data/shopState.js и
 * правится в коде руками, плюс переключатель из шапки, который
 * пока живёт в localStorage у каждого посетителя своим.
 */
export default {
  name: 'settings',
  title: 'Настройки',
  type: 'document',
  fields: [
    {
      name: 'dollsOpen',
      title: 'Заказы на кукол открыты',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'dollsWindow',
      title: 'Когда откроются — куклы',
      type: 'string',
      description: 'Показывается, пока заказы закрыты. Например: «late October 2026».',
      hidden: ({ document }) => document?.dollsOpen === true,
    },
    {
      name: 'dollsNote',
      title: 'Приписка — куклы',
      type: 'string',
      hidden: ({ document }) => document?.dollsOpen === true,
    },

    {
      name: 'portraitsOpen',
      title: 'Заказы на портреты открыты',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'portraitsWindow',
      title: 'Когда откроются — портреты',
      type: 'string',
      hidden: ({ document }) => document?.portraitsOpen === true,
    },
    {
      name: 'portraitsNote',
      title: 'Приписка — портреты',
      type: 'string',
      hidden: ({ document }) => document?.portraitsOpen === true,
    },

    {
      name: 'squidsOpen',
      title: 'Заказы на сквидов открыты',
      type: 'boolean',
      description: 'Сквиды собираются в конструкторе, обычно открыты всегда.',
      initialValue: true,
    },
  ],

  preview: {
    prepare: () => ({ title: 'Настройки сайта' }),
  },
};
