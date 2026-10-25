/**
 * Вопросы и ответы — слова Риты, слово в слово.
 *
 * `a` — список абзацев. Абзац это либо строка, либо пара
 * { label, text }: подпись жирным и текст за ней. Пара нужна там, где
 * ответ делится на части по видам работ, — пока это только уход.
 *
 * ТЕКСТ РИТЫ — ДОСЛОВНО. Порядок вопросов, разбивка на абзацы,
 * знаки препинания и пробелы — её. Ничего не переставлять и не
 * «причёсывать»: однажды я переставил два вопроса про доставку
 * рядом, стало логичнее на мой вкус и хуже по смыслу.
 */
export const faqItems = [
  {
    q: 'How do I order a custom doll?',
    a: [
      'You can only order a doll when commissions are open. During each opening, a form will appear on the Dolls page, which you’ll need to fill out with as much detail as possible. By submitting the form, you’re confirming that you’re ready to purchase and pay for your doll in full if selected. ',
      'Since I can only take a very limited number of orders, submitting the form doesn’t guarantee a spot. Within 24 hours of the opening closing, I randomly select orders from all the submissions to keep things as fair as possible.',
      'I’ll email everyone with the result, whether you’ve been selected or not. I’m so sorry I can’t take everyone! ♡',
    ],
  },
  {
    q: 'When do custom doll orders open?',
    a: [
      'Since I’m the only one working on everything by hand, custom doll orders aren’t open all the time. I open them a few times a year and always announce each opening in advance.',
      'You can find the current status on my Dolls page and Instagram. Sometimes I don’t know the exact date yet, so I may announce a time window instead.',
      'To make sure you don’t miss it, subscribe to my newsletter or follow me on Instagram. I also post daily reminders in my Stories for two weeks before each opening.',
    ],
  },
  {
    q: 'Can I guarantee a spot for my doll?',
    a: [
      'If you really have your heart set on getting a doll during a particular opening, I offer a few guaranteed spots for an additional 50% of the doll’s price.',
      'The regular selection is always open to everyone, free of charge, and gives everyone a chance to be chosen. The guaranteed spot is simply an extra option for those who’d rather not leave it to chance.',
      'If you’d like this option, just fill out the regular application form during the opening and email me afterwards to let me know.',
    ],
  },
  {
    q: 'How long does a doll commission take?',
    a: [
      'Dolls are the most time-consuming projects I make, so I can’t give an exact timeline. Depending on my current workload, a doll can take anywhere from a month to several months to complete, especially since I work on other projects and other dolls at the same time, all by myself.',
      'If you have a specific date you need your doll by, please let me know in advance and I’ll do my best to work around it. Otherwise, sometimes it’s simply a matter of being patient, and I’m always very grateful for that!!',
    ],
  },
  {
    q: 'How much does a custom doll cost?',
    a: [
      'The current starting price for a doll can always be found on the Dolls page. The final price depends on how many details and how much extra work your project requires. Things like sculpted open limbs, detailed or layered clothing, complex hairstyles, tattoos, hand-painted clothing, and other custom details can all affect the price.',
      'Because of this, please keep in mind that the final price of your doll may be higher than the starting price.',
    ],
  },
  {
    q: 'How do I pay for my order?',
    a: [
      'Everything I make is custom and often involves discussing the details with you, so you can’t purchase my creations directly through the website.',
      'Once we’ve agreed on your order, I’ll send you an official PayPal invoice by email using the details you provide for shipping. You can pay the invoice by card, Apple Pay, or other available payment methods, even if you don’t have a PayPal account.',
      'Since I run an official business in Poland, all my invoices are issued in Polish złoty (PLN) for accounting and tax purposes. I use the current exchange rate to calculate the equivalent amount in USD.',
      'For dolls, you’ll find out the exact price once you’ve been selected and we start discussing your project by email. For squid babies, the builder will show you the expected price of your order, unless you request something extra that needs to be priced separately.',
    ],
  },
  {
    q: 'Do you ship internationally, and how much is shipping?',
    a: [
      'I ship from Poland to almost anywhere in the world, with a few exceptions. Shipping for dolls and squids usually costs $20–45, depending on the destination, while portraits usually cost $10–20 to ship. Shipping is added separately to the price of your order.',
      'Some countries, such as the UK, may charge local import taxes or fees when your package arrives. These are set by your local authorities and are outside of my control.  For orders to the US, I cover the applicable import taxes in advance, so you won’t need to pay them upon delivery.',
      'Shipping rules and prices can also change from time to time, so I’ll always let you know if anything affects your order!',
    ],
  },
  {
    q: 'Can I cancel or return my order?',
    a: [
      'Since every piece is made specifically for you, I don’t accept cancellations or returns once I’ve started working on your order. This is why I ask you to make sure you’re ready to commit before placing your order.',
      'I’m a small one-person business, not a big production company, so every order takes a lot of time, care, and love from me personally. Thank you for understanding and being gentle with my  business!',
      'If something is wrong with your order when it arrives, please get in touch with me as soon as possible and send me photos or other proof of the issue. We’ll look at what happened and discuss the best way to make things right. Depending on the situation, I’ll do my best to help, repair or replace the affected part, or find another solution together.',
    ],
  },
  {
    q: 'How long does shipping take?',
    a: [
      'Shipping times depend on the destination. As a general estimate, parcels take around 2 weeks to the US, 1–2 weeks within Europe and to the UK, and 3 weeks or more to Australia and other more distant destinations.',
      'Please keep in mind that these are only estimates, and once your parcel is on its way, I don’t have control over how quickly it travels or whether there are any delays along the way.',
      'If a parcel is returned to me for a reason outside of your control, I’ll happily send it again at my own expense. If it was returned because it wasn’t collected or the delivery information was incorrect, the additional shipping cost will need to be covered by you.',
      'If a parcel is unfortunately lost in transit, I’m not able to refund the order, as the loss happens after the parcel has left my hands. Thankfully, I’ve never had a parcel go missing in all the years I’ve been doing this, so it’s not something I’d worry too much about. I’ll always do my best to help you figure out what happened and assist with the shipping claim if possible!',
    ],
  },
  {
    q: 'How do I take care of my doll or squid?',
    a: [
      'Both dolls and squid babies are handmade pieces, so they need to be treated with care.',
      { label: 'Dolls', text: 'Keep your doll away from water and heat. Be gentle with the hair, clothes, and other small details. Although the limbs that aren’t sculpted from polymer clay can bend, try not to overdo it or force them into positions they weren’t made for.' },
      'Of course, you’re free to decide how you want to interact with your doll, but my biggest wish is for you to be able to keep it for as long as possible. I’d love for it to still be bringing you joy decades from now, and maybe even one day meet the next generations of your family.',
      { label: 'Squids', text: 'They’re soft and cuddly, but please treat them gently too. Avoid washing them in a washing machine or soaking them in water. If they get a little dirty, spot-clean them gently instead. Please keep the button dry and avoid scratching it, as they’re hand-painted and can be damaged by rough handling.' },
    ],
  },
];
