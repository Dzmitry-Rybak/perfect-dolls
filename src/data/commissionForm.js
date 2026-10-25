/**
 * Анкеты на заказ: куклы, портреты и готовые сквиды — разные формы,
 * вопросы почти не пересекаются. Куда уходит каждая — EMAIL.commissions
 * в data/site.js: у кукол свой ящик, у остальных общий.
 *
 * Формулировки и варианты правятся здесь, без залезания в компоненты.
 *
 * Типы полей: text · email · textarea · select · chips · files · checkbox
 * и heading — подзаголовок группы полей, без значения; note — абзац-
 * напоминание под полями; choice — выбор одного варианта (radio).
 * У files свой accept. Шаг может задать next(values) — id следующего
 * шага вместо обычного «по порядку» — и oneOf: список полей, из которых
 * заполнено должно быть хотя бы одно (снимок или описание).
 * showIf(values) — поле видно и проверяется, только когда вернёт true.
 * default — значение при открытии анкеты (галочка, стоящая сразу).
 */

export const MAX_FILES = 5;
export const MAX_FILE_MB = 8;
export const MAX_TOTAL_MB = 20;
export const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,application/pdf';
/* У кукол поля раздельные: на шагах внешности — только снимки, а на
   развилке «у меня всё собрано» — только документ, PDF или Word: так
   в задании у Риты. */
export const ACCEPT_PHOTOS = 'image/jpeg,image/png,image/webp,image/heic';
export const ACCEPT_DOCS = 'application/pdf,application/msword,'
  + 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const contactStep = (extra = []) => ({
  id: 'you',
  title: 'Dates and you',
  hint: 'So I know whether I can make it in time, and where it goes afterwards.',
  fields: [
    { name: 'name',  label: 'What should I call you', type: 'text',  required: true, placeholder: 'Your name' },
    { name: 'email', label: 'Email for my reply',     type: 'email', required: true, placeholder: 'you@example.com' },
    { name: 'deadline', label: 'Needed by', type: 'text',
      placeholder: 'e.g. before 12 March, it’s a gift. Or "no rush"' },
    { name: 'place', label: 'Where it ships', type: 'text', placeholder: 'City and country' },
    ...extra,
  ],
});

/**
 * Галочка в конце последнего шага — общая для всех анкет: куклы,
 * портреты, готовые сквиды и сквид из конструктора.
 *
 * Согласие сразу с обеими страницами — условиями и приватностью: так
 * попросила Рита. Подпись — из кусков, чтобы обе страницы были
 * ссылками прямо в тексте.
 *
 * Раньше их было две, и первая тащила в себе ещё и подтверждение прав
 * на присланные фотографии. Фраза выходила длинная и читалась как
 * предупреждение, хотя права на снимки и так оговорены в условиях —
 * их принимают, отправляя заявку, а не отдельной галочкой.
 *
 * Вторая запрещала показывать готовую работу в галерее. Её убрали:
 * попросить об этом можно письмом в любой момент, в том числе после
 * публикации, и это написано в условиях.
 */
const permissions = [
  { name: 'consent', type: 'checkbox', required: true,
    label: [
      'I have read and agree to the ',
      { href: '/terms', label: 'Terms & Conditions' },
      ' and the ',
      { href: '/privacy', label: 'Privacy Policy' },
      '.',
    ] },
];

/**
 * Последний шаг анкеты на портрет — свой, а не общий с куклой.
 *
 * У портрета референс — это не настроение, а исходник: Рита рисует
 * с конкретных снимков, и ей нужны не «похожие картинки из интернета»,
 * а причёска, верх одежды и украшения этого человека. Поэтому ссылок
 * здесь нет, а вместо них — свободное поле про фон и детали, которое
 * раньше стояло на первом шаге и спрашивалось слишком рано:
 * про фон думаешь, уже глядя на присланные фотографии.
 */
const portraitRefsStep = {
  id: 'refs',
  title: 'References',
  hint: 'Show me the details that are important to you!',
  fields: [
    { name: 'files', label: 'Attach files', type: 'files',
      hint: 'I’d like to see the hairstyle, the top part of the outfit, and any accessories. '
          + 'If it’s a pet, please send me a front-facing photo without any distortion.' },
    { name: 'idea', label: 'Anything I should know', type: 'textarea', rows: 4,
      placeholder: 'Leave the background up to me, or let me know if you have something special '
                 + 'in mind for it. You can also describe any particularly important details or '
                 + 'share your pet’s name with me.' },
    ...permissions,
  ],
};

/* ---------------- КУКЛЫ ---------------- */

/* Под снимок и под описание — одна пара на каждом шаге внешности. */
const LEAVE_IT = 'Describe your idea in a little more detail, or leave it up to me!';
const photos = (name) => ({ name, type: 'files', accept: ACCEPT_PHOTOS });
/* На шагах внешности пустым уйти нельзя: нужен снимок или хоть пара
   слов (oneOf у шага). Подпись ошибки встаёт под описанием. */
export const ONE_OF_MESSAGE = 'Add a photo or a few words';

/**
 * Анкета на куклу — по тексту Риты, слово в слово.
 *
 * Никаких своих пояснений здесь нет: Рита попросила оставить только её
 * тексты. Поэтому у первых шагов нет заголовка (вместо него — имя
 * анкеты), а подписи полей первого шага — перевод её списка.
 *
 * На втором шаге развилка: кто уже собрал всё в файл, сразу попадает
 * на последний шаг (next), остальные идут по порядку.
 */
export const dollForm = {
  kind: 'doll',
  title: 'Order a doll',
  /* Только тексты Риты: без подписей у дорожки шагов, без примечания
     в подвале и без строки с адресом после отправки. */
  bare: true,
  /* Абзац — строка или список кусков; кусок { u: '…' } подчёркнут.
     Срок ответа выделен по просьбе Риты. */
  done: [
    [
      'Dear dolly, thank you so much for taking the time to fill out the application '
      + 'so carefully! I usually reply within ',
      { u: '1-2 days' },
      '. Please keep in mind that due to the high demand, your order may not be '
      + 'selected this time. You’ll receive a response either way ♡',
    ],
  ],
  steps: [
    {
      id: 'you',
      fields: [
        { name: 'name',      label: 'Your name', type: 'text',  required: true, half: true },
        { name: 'email',     label: 'Email',     type: 'email', required: true, half: true },
        { name: 'instagram', label: 'Instagram', type: 'text',  half: true },
        { name: 'dolls', label: 'How many dolls', type: 'select', required: true, half: true,
          options: ['1', '2', '3', '4'].map((n) => ({ value: n, label: n })) },
        { name: 'country', label: 'Which country will your doll ship to', type: 'text', required: true,
          auto: 'country-name' },
        { name: 'message', label: 'Your message to me', type: 'textarea', rows: 3,
          placeholder: 'If you’d like, write a few words for me here!' },
      ],
    },
    {
      id: 'path',
      /* Пока «по шагам» не выбрано — сразу на последний шаг: так
         дорожка до выбора показывает короткий путь из трёх пуговиц, а
         шаги внешности дорастают, только когда их правда выбрали. */
      next: (v) => (v.path === 'steps' ? null : 'final'),
      fields: [
        { name: 'path', type: 'choice', required: true, options: [
          { value: 'steps', label: 'I’d like to continue filling out your form step by step' },
          { value: 'file',  label: 'I already have all the details gathered for you',
            hint: 'Attach a file with all the detailed information if you’re already '
                + 'familiar with the process.' },
        ] },
        { name: 'brief', type: 'files', accept: ACCEPT_DOCS, required: true,
          showIf: (v) => v.path === 'file' },
      ],
    },
    {
      id: 'colours',
      fields: [
        { name: 'colours', label: 'Button & thread colors', type: 'textarea', rows: 3, required: true,
          placeholder: 'Describe your desired color, or leave it up to me' },
        { name: 'mouth', label: 'Mouth type', type: 'choice', inline: true, required: true, options: [
          { value: 'regular',  label: 'Regular' },
          { value: 'stitched', label: 'Stitched' },
          { value: 'bloody',   label: 'Stitched & very bloody' },
        ] },
        { name: 'scary', label: 'Scary Details', type: 'checkbox',
          hint: 'Only for the brave! By selecting this option, you’re giving me permission '
              + 'to add bloody stains and drips to the face, body, and clothes, as well as '
              + 'scratches, wounds, and other creepy little details to make your doll look '
              + 'extra spooky, all at my own discretion.' },
      ],
    },
    {
      id: 'skin',
      title: 'Skin tone',
      oneOf: ['skinPhotos', 'skinNote'],
      hint: 'I’d like to see the skin tone as clearly as possible in natural daylight. '
          + 'The more photos, the better for me!',
      fields: [
        photos('skinPhotos'),
        /* У Риты подсказки здесь не было, и пустое поле выглядело
           дырой. «Leave it up to me», как на соседних шагах, не
           подходит: тон кожи по снимкам, а не на усмотрение. */
        { name: 'skinNote', type: 'textarea', rows: 3,
          placeholder: 'Tell me a little more about the skin tone, if you’d like!' },
      ],
    },
    {
      id: 'hair',
      title: 'Hair',
      oneOf: ['hairPhotos', 'hairNote'],
      hint: 'Show me the hairstyle you’d like! Just keep in mind that the hair is made from '
          + 'yarn, so I may not always be able to recreate your hairstyle exactly.',
      fields: [
        photos('hairPhotos'),
        { name: 'hairNote', type: 'textarea', rows: 3, placeholder: LEAVE_IT },
      ],
    },
    {
      id: 'outfit',
      title: 'Outfit',
      oneOf: ['outfitPhotos', 'outfitNote'],
      hint: 'What would you like the doll to wear?',
      fields: [
        photos('outfitPhotos'),
        { name: 'outfitNote', type: 'textarea', rows: 3, placeholder: LEAVE_IT },
        { name: 'outfitRule', type: 'note',
          label: 'Please note: I don’t create clothing that is too revealing, such as deep '
               + 'necklines, open backs, or exposed stomachs. In some cases, I may be able '
               + 'to make an exception.' },
      ],
    },
    {
      id: 'shoes',
      title: 'Shoes',
      oneOf: ['shoesPhotos', 'shoesNote'],
      hint: 'What kind of shoes will your doll be wearing?',
      fields: [
        photos('shoesPhotos'),
        { name: 'shoesNote', type: 'textarea', rows: 3, placeholder: LEAVE_IT },
        { name: 'shoesRule', type: 'note',
          label: 'Please note: I don’t create open-toed or barefoot-style shoes, or shoes with '
               + 'very high or thin heels, as I want the doll to be able to stand on her own.' },
      ],
    },
    {
      id: 'details',
      title: 'Additional details',
      oneOf: ['detailsPhotos', 'detailsNote'],
      hint: 'Piercings, jewelry, tattoos, nails, glasses, bags, and anything else you’d like '
          + 'to add. The more details you provide, the more personalized your doll can be!',
      fields: [
        photos('detailsPhotos'),
        { name: 'detailsNote', type: 'textarea', rows: 3, placeholder: LEAVE_IT },
      ],
    },
    {
      id: 'final',
      fields: [
        { name: 'dollName', label: 'Doll’s name', type: 'text',
          placeholder: 'I’ll use it for the packaging' },
        { name: 'packaging', label: 'Any special requests for the packaging?', type: 'textarea',
          rows: 2, placeholder: 'Birthday or holiday note, or a personal message from you' },
        { name: 'companion', type: 'checkbox',
          label: 'I’d like a mini squiddie companion for my doll (+$75)' },
        { name: 'companionNote', type: 'textarea', rows: 2,
          placeholder: 'Describe the fur color and button, or leave it up to me.',
          showIf: (v) => v.companion },
        { name: 'reserve', type: 'checkbox', label: 'I’d like to secure my spot',
          hint: 'Very limited offer. By choosing this option, you agree to an additional 50% '
              + 'reservation fee based on the total price of the doll.' },
        { name: 'extra', label: 'Is there anything else you’d like to add?', type: 'textarea',
          rows: 3, placeholder: 'Add anything else you’d like that I haven’t mentioned in the form.' },
        ...permissions,
      ],
    },
  ],
};

/* ---------------- ПОРТРЕТЫ ---------------- */
export const portraitForm = {
  kind: 'portrait',
  title: 'Order a portrait',
  steps: [
    {
      id: 'who',
      title: 'Who is in it',
      hint: 'Numbers first — they decide how long it takes.',
      fields: [
        /* Потолок — четыре, и людей, и животных: больше Рита на одном
           листе не рисует. Раньше последним вариантом стояло «четыре и
           больше», и заявка на шестерых выглядела разрешённой. */
        { name: 'people', label: 'How many people', type: 'select', required: true,
          options: [
            { value: '1', label: 'One' }, { value: '2', label: 'Two' },
            { value: '3', label: 'Three' }, { value: '4', label: 'Four' },
          ] },
        { name: 'pets', label: 'Any animals', type: 'select',
          options: [
            { value: '0', label: 'None' }, { value: '1', label: 'One' },
            { value: '2', label: 'Two' }, { value: '3', label: 'Three' },
            { value: '4', label: 'Four' },
          ] },
      ],
    },
    contactStep(),
    portraitRefsStep,
  ],
};

/* ---------------- ГОТОВЫЕ СКВИДЫ ---------------- */

/**
 * Адрес — одним набором для доставки и для счёта. Префикс отличает
 * второй набор от первого: ship_city и invoice_city.
 *
 * half — поле в половину строки. Короткие поля стоят парами, иначе
 * анкета вытягивалась в длинный столбик и пугала одним видом.
 * На телефоне пары снова встают друг под другом.
 */
const addressFields = (prefix, showIf) => {
  /* auto — подсказка телефону, что подставить из сохранённого адреса:
     адрес доставки и адрес для счёта он хранит раздельно. */
  const ac = (what) => `${prefix === 'ship' ? 'shipping' : 'billing'} ${what}`;
  return [
    { name: `${prefix}_street`,   label: 'Street, house number',    type: 'text', required: true, half: true, showIf, auto: ac('address-line1') },
    { name: `${prefix}_unit`,     label: 'Apartment / unit number', type: 'text', half: true, showIf, auto: ac('address-line2') },
    { name: `${prefix}_city`,     label: 'City',                    type: 'text', required: true, half: true, showIf, auto: ac('address-level2') },
    { name: `${prefix}_state`,    label: 'State / Province',        type: 'text', half: true, showIf, auto: ac('address-level1') },
    { name: `${prefix}_country`,  label: 'Country',                 type: 'text', required: true, half: true, showIf, auto: ac('country-name') },
    { name: `${prefix}_postcode`, label: 'Postal code',             type: 'text', required: true, half: true, showIf, auto: ac('postal-code') },
    /* tel — на телефоне открывается цифровая клавиатура. */
    { name: `${prefix}_phone`,    label: 'Phone number',            type: 'tel', showIf, auto: ac('tel') },
  ];
};

/* Второй набор нужен, только если галочку сняли: платит один, а
   доставляют в другое место и на другое имя. */
const separateInvoice = (v) => !v.sameInvoice;

/**
 * Заказ одной из восьми моделей со страницы «Сквиды».
 *
 * Про замысел здесь спрашивать нечего — дизайн готов. Нужно знать,
 * кому выставить счёт и куда отправить. Имя модели и цена приходят от
 * нажатой карточки (prefill.values) и уходят с заявкой, полями их
 * не показываем: имя видно в шапке анкеты.
 *
 * Два шага: сначала кто и куда, потом счёт. В один шаг анкета
 * выходила огромной. Если счёт на того же человека, второй шаг — это
 * одна галочка и согласие.
 */
export const squidForm = {
  kind: 'squid',
  title: 'Order a ready-made squid',
  done: [
    'Thank you for your order, dolly! Your squid is already getting ready '
    + 'for the trip to its new home. I’ll prepare your invoice soon and send '
    + 'it to the email address you provided.',
    'If I have any questions about the delivery, I’ll get in touch with you by email.',
  ],
  steps: [
    {
      id: 'details',
      title: 'Your details',
      hint: 'Who it’s for and where it goes.',
      fields: [
        { name: 'name',  label: 'Full name', type: 'text',  required: true, half: true },
        { name: 'email', label: 'Email',     type: 'email', required: true, half: true,
          placeholder: 'you@example.com' },

        { name: 'shipHeading', type: 'heading', label: 'Shipping address' },
        ...addressFields('ship'),
      ],
    },
    {
      id: 'invoice',
      title: 'Invoice',
      hint: 'Sometimes one person pays and the squid goes to someone else.',
      fields: [
        { name: 'sameInvoice', type: 'checkbox', default: true,
          label: 'Please use these details for both shipping and the invoice.' },

        { name: 'invoiceHeading', type: 'heading', label: 'Invoice details', showIf: separateInvoice },
        { name: 'invoice_name',  label: 'Full name', type: 'text',  required: true, half: true, auto: 'billing name',
          showIf: separateInvoice },
        { name: 'invoice_email', label: 'Email',     type: 'email', half: true, showIf: separateInvoice, auto: 'billing email',
          placeholder: 'you@example.com' },
        ...addressFields('invoice', separateInvoice),

        ...permissions,
      ],
    },
  ],
};

/* ---------------- СКВИД ИЗ КОНСТРУКТОРА ---------------- */
/**
 * «Send this to Margarita» в конструкторе. Анкета та же, что у
 * готового сквида: кто, куда и кому счёт. Сам сквид приходит от
 * конструктора (prefill.values): сводка словами (build), сырая сборка
 * (buildJson) и цена. Своё только «спасибо»: этого сквида ещё нет,
 * его будут шить.
 */
export const buildForm = {
  ...squidForm,
  kind: 'build',
  title: 'Order your squid',
  done: [
    'Thank you for your design, dolly! I can’t wait to bring your squid to life. '
    + 'I’ll prepare your invoice soon and send it to the email address you provided.',
    'If I have any questions about your design or the delivery, I’ll get in touch '
    + 'with you by email.',
  ],
};

export const FORMS = { doll: dollForm, portrait: portraitForm, squid: squidForm, build: buildForm };

export function emptyValues(form) {
  const v = {};
  for (const step of form.steps) {
    for (const f of step.fields) {
      if (f.type === 'heading' || f.type === 'note') continue;
      v[f.name] =
        f.default !== undefined ? f.default
        : f.type === 'chips' || f.type === 'files' ? []
        : f.type === 'checkbox' ? false
        : '';
    }
  }
  return v;
}
