/**
 * Страницы разделов — Squids, Dolls, Portraits.
 *
 * На каждой показываются три работы из архива. Здесь выбирается,
 * какие именно: перетащите нужные, лишние удалите. Больше трёх
 * не поместится — четвёртую админка не даст добавить.
 *
 * Если ничего не выбрано, страница сама возьмёт первые три работы
 * раздела по полю «Порядок в галерее» — так было до этого выбора.
 * Выбранная работа, если её удалить из архива, просто исчезнет
 * со страницы, а не оставит дыру.
 */
const picks = (name, title, kind) => ({
  name,
  title,
  type: 'array',
  description: 'Не больше трёх. Порядок слева направо — как здесь.',
  of: [
    {
      type: 'reference',
      to: [{ type: 'work' }],
      options: {
        filter: 'kind == $kind',
        filterParams: { kind },
        disableNew: true,
      },
    },
  ],
  validation: (R) => R.max(3).unique(),
});

export default {
  name: 'pages',
  title: 'Страницы разделов',
  type: 'document',
  fields: [
    picks('squidPicks',    'Squids — три работы',    'squid'),
    picks('dollPicks',     'Dolls — три работы',     'doll'),
    picks('portraitPicks', 'Portraits — три работы', 'portrait'),
  ],
  preview: {
    prepare: () => ({ title: 'Страницы разделов' }),
  },
};
