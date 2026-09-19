import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas/index.js';

/**
 * Админка cutesmokey.
 *
 * Разделов пять: архив работ, полка «в наличии», главная, страницы
 * разделов и настройки. Три последних — документы в одном экземпляре
 * на весь сайт, поэтому открываются сразу, без списка из одной
 * строки, и завести второй такой нельзя.
 */

/** Документы, которых на сайте ровно по одному. */
const SINGLETONS = ['home', 'pages', 'settings'];

/** Пункт меню, который сразу открывает единственный документ. */
const single = (S, id, title) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(id).documentId(id).title(title));

export default defineConfig({
  name: 'cutesmokey',
  title: 'cutesmokey',
  projectId: 'jfxrdzrs',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Сайт')
          .items([
            S.listItem()
              .title('Работы')
              .child(S.documentTypeList('work').title('Работы')),
            S.listItem()
              .title('В наличии')
              .child(S.documentTypeList('available').title('В наличии')),
            S.divider(),
            single(S, 'home', 'Главная'),
            single(S, 'pages', 'Страницы разделов'),
            S.divider(),
            single(S, 'settings', 'Настройки'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    /* Документы-одиночки из общего меню «создать» убираем — они уже есть. */
    templates: (prev) => prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },

  document: {
    /* «Создать» оставляем у работ и у полки, у одиночек — нет. */
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => !SINGLETONS.includes(t.templateId))
        : prev,
  },
});
