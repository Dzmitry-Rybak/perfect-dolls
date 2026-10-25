/**
 * Правовые страницы: приватность, условия заказа, авторские права.
 *
 * ★ ПЕРЕД ЗАПУСКОМ ЗАПОЛНИТЬ TRADER ★
 * Маргарита зарегистрирована как предприниматель в ЕС, а значит адрес,
 * регистрационный номер и VAT обязаны быть на сайте (Directive
 * 2000/31/EC, art. 5). Поля ниже стоят пустыми (null): строка с
 * пустым полем просто не выводится, а при локальной разработке
 * страница показывает красный список того, чего не хватает.
 *
 * Тексты сознательно лежат в коде, а не в админке: они меняются раз
 * в год и требуют внимательности, а не удобства правки. Если понадобится
 * править из админки — переносится так же, как переехала галерея.
 *
 * Это рабочий черновик нормального уровня, а не заверенный юристом
 * документ. Числа в POLICY (депозит, сроки хранения) — то, что принято
 * у мастеров такого масштаба; Маргарита должна подтвердить, что это
 * её настоящие правила, иначе на сайте будет написана неправда.
 */
import { EMAIL } from './site.js';

/** Реквизиты продавца. null — «ещё не знаем», строка не выводится. */
export const TRADER = {
  /** Имя, на которое зарегистрировано дело (не псевдоним). */
  name: null,
  /** Форма: sole trader / eenmanszaak / Einzelunternehmen — как в бумагах. */
  form: null,
  /** Адрес одной строкой: улица, дом, индекс, город. */
  address: null,
  /** Страна регистрации — от неё зависит право и надзорный орган. */
  country: null,
  /** Регистрационный номер предпринимателя (KBO/KVK/HRB/…). */
  regNumber: null,
  /** Номер НДС, если есть. Нет — оставить null и см. PRICES ниже. */
  vat: null,
  /** Надзорный орган по защите данных страны регистрации. */
  dpa: null,
  /** Почта для правовых вопросов — единственное, что уже известно. */
  email: EMAIL.dolls,
};

/** Чего не хватает в реквизитах. Показывается только при разработке. */
export const TRADER_MISSING = Object.entries(TRADER)
  .filter(([, v]) => !v)
  .map(([k]) => k);

/**
 * Числа, на которые ссылаются все три страницы. Собраны здесь, чтобы
 * в текстах они не разъехались: срок хранения референсов встречается
 * и в приватности, и в условиях.
 */
export const POLICY = {
  /* Даты обновления — у каждой страницы своя, в её описании ниже
     (updated): строка «Last updated» внизу страницы. */
  /** Приватность — та же дата ещё и словами в её последнем разделе. */
  privacyUpdated: '10 October 2026',
  /** Предоплата, % от цены. */
  deposit: 30,
  /** Референсы удаляются через столько после отправки работы. */
  keepRefs: '6 months',
  /** Заявки, не ставшие заказом. */
  keepEnquiries: '12 months',
  /** Бухгалтерские документы по состоявшимся заказам. */
  keepAccounts: '7 years',
  /** Сообщить о повреждении при доставке. */
  damageWindow: '7 days',
  /** Возраст, с которого работы безопасны. */
  minAge: 14,
};

/* --- Приватность --------------------------------------------- */

/* Почта в тексте — ссылкой: { mail } внутри абзаца из кусков (parts). */
const mail = { mail: EMAIL.main };

/**
 * Текст Риты, слово в слово (10 октября 2026). Своих пояснений здесь
 * больше нет — ни про хостинг и шрифты, ни про права по GDPR: она
 * прислала готовый текст и попросила именно его.
 */
export const PRIVACY = {
  title: 'Privacy Policy',
  lead: [
    'Your privacy matters to me.',
    'I only collect the information I need to communicate with you, create your order, ' +
    'and ship it to you. I don’t sell your personal data, use it for advertising, or share ' +
    'it with third parties for their own purposes.',
  ],
  updated: POLICY.privacyUpdated,
  sections: [
    {
      id: 'who',
      title: 'Who handles your data?',
      body: [
        'I’m Margarita, the artist behind cutesmokey, and I personally handle your enquiries, ' +
        'reference photos, and orders.',
        { parts: ['If you have any questions about your personal data, you can reach me at ', mail] },
      ],
    },
    {
      id: 'collect',
      title: 'What information do I collect?',
      body: [
        'Depending on your enquiry or order, I may collect:',
        { list: [
          'Your name and email address',
          'Your shipping details',
          'Your budget and deadline, if provided',
          'Your description of the piece you’d like me to create',
          'Reference photos and other files you choose to send',
          'Your custom squid design, if you use the configurator',
          'Order and payment records',
        ] },
        'I use this information only to communicate with you, create your piece, arrange ' +
        'delivery, and keep the records required by law.',
      ],
    },
    {
      id: 'photos',
      title: 'What about your reference photos?',
      body: [
        'I know that reference photos can be personal, especially when they include you or ' +
        'someone you love. I treat them with care and use them to create your commissioned piece.',
        'Your photos are never sold, used for advertising, submitted to AI tools, or used to ' +
        'train AI. I don’t use them for other customers’ orders or share them with other ' +
        'artists or businesses for their own use.',
        'Sometimes, I share photos of my work in progress on social media to show how a piece ' +
        'comes to life. I always ask for your permission before sharing anything. If you’d ' +
        'prefer your order to remain completely private, please let me know from the start. ' +
        'I’ll respect that.',
        'I may also keep reference photos in my personal archive as part of my artistic portfolio.',
      ],
    },
    {
      id: 'access',
      title: 'Who can access your information?',
      body: [
        'I handle your enquiries and reference photos personally. Emails are handled through ' +
        'Gmail, and payments are processed by the relevant payment providers. These services ' +
        'process information as needed to provide their services.',
        'When I ship your order, I also share the necessary delivery details with the postal ' +
        'or courier service.',
        'I don’t sell your data or share it with third parties for advertising or their own ' +
        'marketing purposes.',
      ],
    },
    {
      id: 'keeping',
      title: 'How long do I keep your information?',
      body: [
        'I keep emails and correspondence for as long as reasonably needed to manage your ' +
        'enquiry, order, or any follow-up. Order and payment records are kept for the period ' +
        'required by Polish law.',
      ],
    },
    {
      id: 'updates',
      title: 'Updates to this policy',
      body: [
        `This policy was last updated on ${POLICY.privacyUpdated}. If anything changes, ` +
        'I’ll update this page.',
      ],
    },
  ],
};

/* --- Условия заказа ------------------------------------------- */

/** Текст Риты, слово в слово. Даты в нём нет — стоит день, когда он
    появился на сайте. */
export const TERMS = {
  title: 'Terms & Conditions',
  lead: 'A few things worth knowing before placing an order.',
  updated: '25 October 2026',
  sections: [
    {
      id: 'order',
      title: 'Placing an order',
      body: [
        'The process depends on what you’d like to order, so here’s how each type works.',
        /* Вид заказа — жирным в начале абзаца, как у Риты двоеточием. */
        { parts: [{ strong: 'Portraits:' }, ' The price is listed on the website. Sending an ' +
          'application doesn’t guarantee a spot, so please wait for my email. If your ' +
          'application is selected, I’ll send you an invoice with the details.'] },
        { parts: [{ strong: 'Squids:' }, ' If you choose a design from one of my collections and ' +
          'don’t request any changes, the listed price is your price, plus shipping. The same ' +
          'goes for the configurator: the estimated price shown there is what you can expect to ' +
          'pay, plus shipping, as long as you don’t request anything extra or unusual. If you’d ' +
          'like to add something special, I’ll let you know the additional cost by email before ' +
          'you decide.'] },
        { parts: [{ strong: 'Custom dolls:' }, ' Submitting an application doesn’t guarantee a ' +
          'spot. If you’re selected, we’ll discuss your idea and the final price by email. Once ' +
          'everything is agreed upon, I’ll send you an invoice for the full amount.'] },
      ],
    },
    {
      id: 'cancel',
      title: 'Cancellations & Changes',
      body: [
        'Please make sure you’re ready to commit before placing an order, as custom pieces are ' +
        'made specifically for you.',
        'If you need to cancel or change something, please contact me as soon as possible. Small ' +
        'adjustments may be possible while I’m working, but changes that require significant ' +
        'extra work may affect the price.',
        'Once I’ve started working on your custom piece, cancellations and refunds are generally ' +
        'not possible. Custom-made items may be excluded from the usual 14-day withdrawal right. ' +
        'If you have any doubts, please get in touch before placing your order.',
      ],
    },
    {
      id: 'shipping',
      title: 'Shipping & Customs',
      body: [
        'Orders are shipped from Poland with tracking. Delivery times depend on the destination ' +
        'and may be affected by postal delays.',
        'I know waiting for a package can be stressful, and I’ll always do my best to help if ' +
        'anything goes wrong along the way. Thankfully, I’ve never had a parcel go missing in all ' +
        'the years I’ve been doing this, so it’s not something I’d worry too much about!',
        'Once a parcel has been shipped, I can’t control what happens to it in transit. If it’s ' +
        'delayed, I’ll gladly help you check its status and do whatever I can to help things go ' +
        'smoothly. However, if a parcel is confirmed lost in transit, I’m unable to offer a ' +
        'refund, as the loss happens after it has left my hands.',
        'Some countries charge import taxes, customs duties, or handling fees when a parcel ' +
        'arrives. These charges are set by your country, not by me, and I can’t always pay them ' +
        'in advance. For example, UK orders may be subject to import charges, and other ' +
        'destinations may have similar rules. By placing an order, you agree to cover any ' +
        'applicable charges that are not included in your purchase price. For US orders, I cover ' +
        'applicable import taxes in advance, so you shouldn’t need to pay them again upon delivery.',
        'Please make sure your shipping details are correct and that you can receive your parcel. ' +
        'If a parcel is returned because you provided incorrect details or didn’t collect it, ' +
        'you’ll need to cover the cost of resending it. If the mistake was mine, I’ll take ' +
        'responsibility and cover the additional shipping costs myself.',
      ],
    },
    {
      id: 'care',
      title: 'Caring for your piece',
      body: [
        'My dolls and squids are handmade collectible pieces, made to be cherished and displayed ' +
        'rather than used for everyday rough play. They may contain wire, small parts, and ' +
        'sculpted details that can break or come loose if handled roughly.',
        'If young children handle them, please make sure they’re supervised.',
        'Of course, once a piece is yours, how you choose to enjoy it is up to you. I simply hope ' +
        'you’ll treat it with care, so it can stay with you and bring you joy for as long as ' +
        'possible! ♡',
      ],
    },
    {
      id: 'questions',
      title: 'Questions?',
      body: [
        { parts: ['If anything is unclear or you have a question about your order, feel free to ' +
          'email me at ', mail, '. I’m always happy to help!'] },
      ],
    },
  ],
};

/* --- Авторские права ------------------------------------------ */

/** Текст Риты, слово в слово (10 октября 2026). */
export const COPYRIGHT = {
  title: 'Copyright',
  lead: [
    'Everything you see here is my own work, from the photographs and videos to the ' +
    'drawings, characters, and designs. I create everything with a lot of time, care, ' +
    'and love, and I ask that you respect that.',
    `© ${new Date().getFullYear()} cutesmokey. All rights reserved.`,
  ],
  /* Даты в тексте нет — стоит день, когда Рита его прислала. */
  updated: '10 October 2026',
  sections: [
    {
      id: 'sharing',
      title: 'Sharing my work',
      body: [
        'You’re welcome to share my work on social media, as long as you credit @cutesmokey ' +
        'and link back to the original. You can save my work for personal inspiration or ' +
        'share it with a friend, too.',
        'Please don’t copy my designs, reproduce my creations, sell my artwork, use my photos ' +
        'or videos commercially, or present my work as your own. My work may not be used to ' +
        'train AI models, either.',
        'If you’d like to use my work for something beyond personal sharing, please ask me first.',
      ],
    },
    {
      id: 'bought',
      title: 'If you’ve bought something from me',
      body: [
        'The piece you buy is yours. You can keep it, photograph it, give it to someone, or do ' +
        'whatever you like with the actual object.',
        'The design itself remains my intellectual property, so please don’t reproduce or ' +
        'manufacture copies of it.',
      ],
    },
    {
      id: 'photos',
      title: 'Your photos',
      body: [
        'I use the reference photos you send me to create your commission. I may also share ' +
        'photos or videos of the creative process or finished piece on my social media, but I ' +
        'always ask for your permission first. If you’d prefer your commission to stay ' +
        'private, just let me know.',
        { parts: [
          'You can read more about how I handle your photos on the ',
          { link: '/privacy', label: 'Privacy page' },
          '.',
        ] },
      ],
    },
    {
      id: 'copy',
      title: 'Spotted a copy?',
      body: [
        { parts: [
          'If you come across someone using my work without permission, I’d really appreciate ' +
          'it if you let me know at ', mail, '.',
        ] },
        'I believe that everyone deserves to have their work respected, and that creating ' +
        'something of your own is always better than taking someone else’s.',
      ],
    },
  ],
};

export const LEGAL = { privacy: PRIVACY, terms: TERMS, copyright: COPYRIGHT };
