/**
 * Анкета на заказ куклы.
 *
 * Вопросы вынесены сюда, чтобы формулировки правились в одном месте,
 * без залезания в компоненты. Порядок шагов = порядок в массиве.
 *
 * Типы полей: text · email · textarea · select · chips (множественный) · files
 * required: true — шаг не пропустит дальше, пока поле не заполнено.
 */

export const MAX_FILES = 5;
export const MAX_FILE_MB = 8;
export const MAX_TOTAL_MB = 20;
export const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,application/pdf';

export const steps = [
  {
    id: 'who',
    title: 'Кто это будет',
    hint: 'Начнём с главного — кого вы хотите увидеть.',
    fields: [
      {
        name: 'kind', label: 'Что шьём', type: 'select', required: true,
        options: [
          { value: 'doll',    label: 'Куклу' },
          { value: 'arttoy',  label: 'Art toy' },
          { value: 'clothes', label: 'Одежду для куклы' },
          { value: 'unsure',  label: 'Пока не знаю' },
        ],
      },
      {
        name: 'height', label: 'Примерный рост', type: 'select',
        options: [
          { value: 'mini',   label: 'До 15 см' },
          { value: 'small',  label: '15–25 см' },
          { value: 'medium', label: '25–35 см' },
          { value: 'large',  label: 'Больше 35 см' },
          { value: 'unsure', label: 'На ваше усмотрение' },
        ],
      },
      {
        name: 'idea', label: 'Расскажите про неё', type: 'textarea', required: true,
        placeholder: 'Кто она, откуда, какой у неё характер. Можно одним предложением, можно историей — Рите важнее настроение, чем точность.',
        rows: 5,
      },
    ],
  },

  {
    id: 'look',
    title: 'Как она выглядит',
    hint: 'Если чего-то не знаете — оставьте пустым, обсудим потом.',
    fields: [
      {
        name: 'eyes', label: 'Глаза-пуговицы', type: 'select',
        options: [
          { value: 'pearl',    label: 'Перламутровые' },
          { value: 'jet',      label: 'Гагат, чёрные' },
          { value: 'rose',     label: 'Розовые' },
          { value: 'mismatch', label: 'Разные' },
          { value: 'trust',    label: 'Доверяю Рите' },
        ],
      },
      {
        name: 'hair', label: 'Волосы', type: 'select',
        options: [
          { value: 'bob',   label: 'Каре' },
          { value: 'long',  label: 'Длинные пряди' },
          { value: 'wax',   label: 'Восковые потёки' },
          { value: 'none',  label: 'Без волос' },
          { value: 'trust', label: 'Доверяю Рите' },
        ],
      },
      {
        name: 'palette', label: 'Цвета, которые нравятся', type: 'chips',
        hint: 'Можно выбрать несколько',
        options: [
          { value: 'black',  label: 'Чёрный' },
          { value: 'rose',   label: 'Нежно-розовый' },
          { value: 'plum',   label: 'Слива' },
          { value: 'bone',   label: 'Костяной' },
          { value: 'gold',   label: 'Приглушённое золото' },
          { value: 'teal',   label: 'Тёмная бирюза' },
          { value: 'lilac',  label: 'Сирень' },
          { value: 'rust',   label: 'Ржавый' },
        ],
      },
      {
        name: 'companion', label: 'Спутник', type: 'select',
        options: [
          { value: 'none',  label: 'Никого' },
          { value: 'bat',   label: 'Летучая мышь' },
          { value: 'cat',   label: 'Чёрный кот' },
          { value: 'moon',  label: 'Луна на нити' },
          { value: 'other', label: 'Другое — напишу ниже' },
        ],
      },
      {
        name: 'avoid', label: 'Чего точно не хочется', type: 'textarea', rows: 3,
        placeholder: 'Иногда это важнее пожеланий. Например: без блёсток, без красного, не страшную.',
      },
    ],
  },

  {
    id: 'when',
    title: 'Сроки и вы',
    hint: 'Чтобы Рита понимала, успевает ли она и куда потом отправлять.',
    fields: [
      { name: 'name',  label: 'Как к вам обращаться', type: 'text', required: true,
        placeholder: 'Имя' },
      { name: 'email', label: 'Почта для ответа', type: 'email', required: true,
        placeholder: 'you@example.com' },
      { name: 'deadline', label: 'Нужна к дате', type: 'text',
        placeholder: 'Например: к 12 марта, подарок. Или «не горит»' },
      {
        name: 'budget', label: 'Бюджет', type: 'select',
        hint: 'Ориентир, не обязательство',
        options: [
          { value: 'to150',  label: 'До 150 €' },
          { value: '150300', label: '150–300 €' },
          { value: '300500', label: '300–500 €' },
          { value: 'over500',label: 'Больше 500 €' },
          { value: 'ask',    label: 'Назовите сами' },
        ],
      },
      { name: 'place', label: 'Куда отправлять', type: 'text',
        placeholder: 'Город и страна' },
    ],
  },

  {
    id: 'refs',
    title: 'Референсы',
    hint: 'Картинки говорят лучше слов. Скриншоты из Pinterest, фото, наброски — всё подойдёт.',
    fields: [
      { name: 'files', label: 'Прикрепите файлы', type: 'files' },
      { name: 'links', label: 'Или ссылки', type: 'textarea', rows: 3,
        placeholder: 'Pinterest, Instagram — по одной ссылке на строку' },
    ],
  },
];

/** Пустое состояние формы, собранное из описания полей. */
export function emptyValues() {
  const v = {};
  for (const step of steps) {
    for (const f of step.fields) {
      v[f.name] = f.type === 'chips' ? [] : f.type === 'files' ? [] : '';
    }
  }
  return v;
}
