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
import { EMAIL, SOCIAL } from './site.js';

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
  updated: '18 September 2026',
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

export const PRIVACY = {
  eyebrow: 'Privacy',
  title: 'What happens to your data',
  lead:
    'The short version: the only thing this site collects is what you type into ' +
    'the commission form, and it goes straight to Margarita’s inbox. No analytics, ' +
    'no cookies, no mailing list, nothing sold or shared for advertising.',
  sections: [
    {
      id: 'who',
      title: 'Who is responsible',
      body: [
        'The person who receives and handles everything below is the one who makes the work — ' +
        'there is no company behind her, no team, no support desk.',
        { trader: true },
        `Anything in this document — a copy of your data, a correction, deletion — ` +
        `is done by writing to ${TRADER.email}.`,
      ],
    },
    {
      id: 'form',
      title: 'What the commission form collects',
      body: [
        'Only what is needed to answer you and make the piece:',
        { list: [
          'your name, so there is something to call you',
          'your email, because the answer has to land somewhere',
          'the city and country it ships to, for postage and delivery time',
          'your deadline and budget range, if you give them',
          'your description of what you want',
          'up to five reference files you choose to attach',
          'for squids, the build you put together in the builder',
        ] },
        'The name, the email and the description are required. Everything else can be left blank.',
        'The legal basis is Article 6(1)(b) of the GDPR: steps taken at your request before ' +
        'a contract, and then the contract itself. No profiling, no automated decisions.',
      ],
    },
    {
      id: 'photos',
      title: 'The photos you attach',
      body: [
        'Reference photos are the most personal thing on this site, so they get their own rules.',
        { list: [
          'They are used only to make your piece — never published, never shown to anyone else, never used as reference for another order.',
          `They are deleted within ${POLICY.keepRefs} of the finished piece being sent, or sooner if you ask.`,
          'They are not uploaded to the gallery service, to any AI tool, or anywhere else — they travel by email and stay in that mailbox.',
        ] },
        'If other people are in a photo — a partner, a child, a friend, a wedding party — ' +
        'those people have rights to their own image. Please only send photos you are ' +
        'entitled to share. The form asks you to confirm this before sending.',
      ],
    },
    {
      id: 'automatic',
      title: 'What happens without you doing anything',
      body: [
        { list: [
          'The hosting provider (Vercel) keeps short-lived server logs: IP address, browser, page and time. That is ordinary security housekeeping — Article 6(1)(f), legitimate interest.',
          'The typefaces are loaded from Google Fonts, which means your IP address reaches Google when a page opens. Nothing else is sent, and no cookie is set, but this is a transfer and you should know about it.',
        ] },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and tracking',
      body: [
        'There are none. No cookies at all, no analytics, no advertising pixels, ' +
        'no session recording, nothing stored in your browser.',
        'That is also why there is no cookie banner on this site: there is nothing ' +
        'to ask you to agree to.',
      ],
    },
    {
      id: 'others',
      title: 'Who else touches your data',
      body: [
        'As few as it is possible to have:',
        { list: [
          'Vercel — hosting. Serves the pages and keeps the server logs above.',
          'Google (Gmail) — the mailbox the form lands in, and the fonts described above.',
          'Sanity — the service holding photos of finished work. No customer data is stored there.',
          'The postal carrier — your name and address, when there is something to send.',
        ] },
        'That is the whole list. Nothing is sold, rented, shared for advertising, ' +
        'or used to train machine-learning systems.',
      ],
    },
    {
      id: 'keeping',
      title: 'How long things are kept',
      body: [
        { list: [
          `Enquiries that never became an order — ${POLICY.keepEnquiries}, then deleted.`,
          `Reference files — ${POLICY.keepRefs} after the piece is sent.`,
          `Order and payment records — ${POLICY.keepAccounts}, because tax law requires it.`,
          'Email correspondence — as long as it is useful to remember who you are, and deleted on request.',
        ] },
      ],
    },
    {
      id: 'rights',
      title: 'What you can ask for',
      body: [
        'Under the GDPR you can ask for any of this, and it costs you nothing:',
        { list: [
          'a copy of everything held about you',
          'a correction, if something is wrong',
          'deletion — including of your reference photos, at any point',
          'a pause on processing while something is disputed',
          'your data in a portable file',
          'an objection to processing based on legitimate interest',
        ] },
        `Write to ${TRADER.email}. The answer comes within a month, usually the same week.`,
        'If the answer does not satisfy you, you can complain to the data protection ' +
        'authority in your own country, or to the one where Margarita is registered.',
        { dpa: true },
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: [
        `This page was last changed on ${POLICY.updated}. If it changes in a way that ` +
        'affects an order already under way, you will be told by email rather than ' +
        'left to notice it here.',
      ],
    },
  ],
};

/* --- Условия заказа ------------------------------------------- */

export const TERMS = {
  eyebrow: 'Commission terms',
  title: 'How an order works',
  lead:
    'Everything here is made by one person, to order, and usually for someone who has ' +
    'never commissioned anything before. So this page is the whole arrangement in plain ' +
    'words: what happens when, what is paid when, and what to do when something goes wrong.',
  sections: [
    {
      id: 'who',
      title: 'Who you are buying from',
      body: [{ trader: true }],
    },
    {
      id: 'how',
      title: 'From enquiry to parcel',
      body: [
        { list: [
          'You send the form. Nothing is owed and nothing is booked yet.',
          'You get a reply with a price and a realistic date — usually the same day, at worst within a few days.',
          `If it suits you, a deposit of ${POLICY.deposit}% confirms the slot. Work starts after it arrives.`,
          'Progress photos arrive as the piece takes shape, and you can still steer small things.',
          'The balance is paid when the piece is finished, before it is posted.',
          'It ships tracked, and you get the number.',
        ] },
      ],
    },
    {
      id: 'money',
      title: 'Prices and payment',
      body: [
        'Prices are in US dollars and quoted per piece — every commission is priced ' +
        'individually, because no two take the same time.',
        { list: [
          `The ${POLICY.deposit}% deposit covers materials and the time reserved for you.`,
          'Once work has begun the deposit is not refundable: the fabric is cut, the parts are bought, the slot is gone.',
          'The balance is due before shipping.',
          'Shipping is added on top, at cost.',
        ] },
        { vat: true },
      ],
    },
    {
      id: 'time',
      title: 'How long it takes',
      body: [
        'A squid is usually 2–4 weeks, a doll longer, a portrait shorter. Any date given ' +
        'is an honest estimate rather than a guarantee — this is handwork, and hands get ill.',
        'If a date is going to slip, you hear it from Margarita before it slips, not after. ' +
        'If you have a hard deadline — a birthday, a wedding — say so in the form, because ' +
        'that is what decides whether the order can be taken at all.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes and cancellation',
      body: [
        { list: [
          'Before work begins you can cancel for any reason, and the deposit comes back minus anything already bought for you.',
          'After work begins the deposit stays, and what is already made stays with Margarita.',
          'Small changes along the way are normal and free. A change that means starting over is a new price, agreed before anything is unpicked.',
        ] },
      ],
    },
    {
      id: 'withdrawal',
      title: 'The 14-day right of withdrawal',
      body: [
        'EU consumers usually get fourteen days to change their mind about something ' +
        'bought online. Here it depends on what you bought:',
        { list: [
          'A commissioned piece — made to your description, for you — is exempt under Article 16(c) of Directive 2011/83/EU. There is no 14-day withdrawal, because it cannot be sold to anyone else.',
          'Something bought from the “Available now” shelf already existed before you asked for it, so the full fourteen days apply: tell Margarita within fourteen days of it arriving, send it back at your own cost, and the money — including original postage — comes back within fourteen days of the piece arriving back.',
        ] },
      ],
    },
    {
      id: 'wrong',
      title: 'If something arrives wrong',
      body: [
        { list: [
          `Damaged in the post: photograph the parcel and the piece and write within ${POLICY.damageWindow} of delivery. That is what the carrier needs to pay out.`,
          'Not what was agreed, or a fault in the making: it is repaired or remade, at no cost, postage included.',
          'Your statutory rights as a consumer — including the two-year guarantee of conformity — apply on top of everything on this page and are not reduced by it.',
        ] },
        'Handmade is not flawless by definition: slightly uneven stitching, a visible seam, ' +
        'a button that is not perfectly centred — these are how the thing is made, not faults.',
      ],
    },
    {
      id: 'shipping',
      title: 'Shipping, customs and duties',
      body: [
        'Everything is sent tracked, packed to survive a rough journey.',
        'Import duty, customs handling and local VAT are the buyer’s to pay, and are not ' +
        'included in the price. They are charged by your own country, not by Margarita, ' +
        'and cannot be predicted from here.',
        'Parcels are not marked as gifts and values are not understated: that is fraud, ' +
        'and it invalidates the insurance the parcel travels under.',
      ],
    },
    {
      id: 'toys',
      title: 'These are not toys',
      body: [
        `Everything here is a collector’s item for adults and older children, and is not ` +
        `suitable for anyone under ${POLICY.minAge}. Pieces contain button eyes, wire, ` +
        `beads and small hand-sculpted clay parts that come off under real play, and they ` +
        `are not tested or CE-marked as toys under Directive 2009/48/EC.`,
        'If it is a present for a small child, say so and it can be made without the ' +
        'small parts — sewn features, no wire, nothing to swallow.',
      ],
    },
    {
      id: 'care',
      title: 'Looking after it',
      body: [
        'Spot-clean only, never a washing machine. Keep it out of direct sun — the dyes ' +
        'fade. Dust it with a soft brush rather than water.',
        'If something comes loose years later, write anyway: repairs of her own work are ' +
        'something Margarita does gladly, for the cost of postage.',
      ],
    },
    {
      id: 'law',
      title: 'Law and disputes',
      body: [
        { law: true },
        'If you are a consumer, this does not take away the protection of the mandatory ' +
        'rules of your own country of residence.',
        'Most things sort themselves out in one email. Please start there.',
      ],
    },
  ],
};

/* --- Авторские права ------------------------------------------ */

export const COPYRIGHT = {
  eyebrow: 'Copyright',
  title: 'Whose work is whose',
  lead:
    'Every photograph, drawing, character and pattern on this site was made by one person ' +
    'by hand. This page says plainly what you may do with it, what you may not, and what ' +
    'happens to the photos you send.',
  sections: [
    {
      id: 'mine',
      title: 'What belongs to Margarita',
      body: [
        'All of it: the photographs, the drawings, the text on these pages, the squid ' +
        'artwork in the builder, and the designs of the pieces themselves — the shapes, ' +
        'the faces, the way a squid is put together.',
        `© ${new Date().getFullYear()} cutesmokey. All rights reserved.`,
      ],
    },
    {
      id: 'may',
      title: 'What you are welcome to do',
      body: [
        { list: [
          'Link to any page here.',
          `Repost a photo on social media with credit and a link back — @${SOCIAL.instagram.split('/').filter(Boolean).pop()} is enough.`,
          'Save images to a private moodboard or show them to a friend.',
          'Photograph your own piece and post it however you like. It is yours.',
        ] },
      ],
    },
    {
      id: 'maynot',
      title: 'What you may not do',
      body: [
        { list: [
          'Use any image here commercially: advertising, merchandise, prints, stock, packaging, or anything sold.',
          'Crop out or cover the credit, or present the work as someone else’s.',
          'Copy the designs — making, mass-producing or selling pieces built from these photos, or drafting patterns from them, is copying, not inspiration.',
          'Order a piece and then have it reproduced in a workshop.',
        ] },
        'Small studios copy each other constantly and it is usually obvious. Asking first ' +
        'costs nothing, and the answer is often yes.',
      ],
    },
    {
      id: 'ai',
      title: 'Machine learning and scraping',
      body: [
        'Rights are expressly reserved against text and data mining under Article 4(3) of ' +
        'Directive (EU) 2019/790. Nothing on this site may be used to train, fine-tune or ' +
        'evaluate machine-learning models, and no automated collection of these images is ' +
        'permitted, whether for a dataset, a generator or a resale catalogue.',
        'This is stated for machines as well as people: the site’s robots.txt refuses the ' +
        'known AI crawlers by name.',
      ],
    },
    {
      id: 'owning',
      title: 'Buying a piece',
      body: [
        'You own the object. You can keep it, photograph it, give it away, or sell it on ' +
        'years later — that is yours to decide, and none of it needs permission.',
        'What does not come with it is the design. Copyright stays with Margarita, so a ' +
        'piece cannot be reproduced, cast, patterned or manufactured from, and cannot be ' +
        'used to advertise something else, without written permission.',
      ],
    },
    {
      id: 'yours',
      title: 'The photos you send, and the piece made from them',
      body: [
        'Your reference photos stay yours. Sending them gives permission to use them for ' +
        'one thing only — making your piece — and nothing else; how they are stored and ' +
        'deleted is in the privacy page.',
        'You also confirm, when you send them, that they are yours to send: that you took ' +
        'them or have the right to use them, and that anyone recognisable in them is ' +
        'content for a doll to be made from their face.',
        'Photographs of the finished piece are Margarita’s own work and may appear in the ' +
        'gallery and on social media. If you would rather they did not — a surprise, a ' +
        'private commission, a face you would rather not see online — tick the box in the ' +
        'form or say so in an email, at any point, including after it is posted.',
      ],
    },
    {
      id: 'brands',
      title: 'Brands and press',
      body: [
        `Commercial use, collaborations and press requests go to ${EMAIL.pr} — there is a ` +
        'whole page about it under PR & brands.',
      ],
    },
    {
      id: 'wrong',
      title: 'If something here is wrongly used',
      body: [
        `If you find this work reposted as someone else’s, sold as a pattern, or scraped ` +
        `into a catalogue, telling Margarita at ${TRADER.email} genuinely helps — she cannot ` +
        `watch the whole internet by herself.`,
        'And if something of yours has ended up on this site by mistake, write to the same ' +
        'address and it comes down while it is being sorted out, not after.',
      ],
    },
  ],
};

export const LEGAL = { privacy: PRIVACY, terms: TERMS, copyright: COPYRIGHT };
