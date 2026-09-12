/**
 * Архив работ. У каждой — несколько кадров: карточка листается
 * на месте, отдельная страница под каждую работу не нужна.
 *
 * Кадр — это { src, alt }. Раньше здесь стояли процедурные заглушки
 * { seed, accent } и выдуманные работы («Went to Ghent», «Shown at
 * Seam»); теперь по всем трём разделам есть настоящие снимки, и
 * держать рядом с ними придуманные экспонаты незачем.
 *
 * Снимки лежат в public/art/{squids,dolls,portraits}. Исходники
 * (HEIC и PNG с телефона) — в squidy/, dolls/ и portrsits/, в
 * репозиторий не идут: HEIC браузеры не открывают, а полный размер
 * здесь не нужен — карточка в сетке шире 341px не бывает.
 * Пересобрать: sips -s format jpeg -s formatOptions 75 -Z 900,
 * потом снять EXIF (модель телефона и дата), оставив ICC.
 *
 * Порядок кадров задан вручную, а не по имени файла: первым идёт
 * общий план, за ним детали.
 *
 * ЖДЁМ ОТ МАРГАРИТЫ: названия, годы и судьбу работ — сейчас заголовки
 * описательные, а year и note заполнены только там, где это видно
 * на самом снимке.
 */
const work = (id, kind, title, shots, extra = {}) => ({ id, kind, title, shots, ...extra });

export const galleryItems = [
  /* ---------- сквиды ---------- */
  work('s1', 'squid', 'Red Lace', [
    { src: '/art/squids/1-1.jpg', alt: 'Red plush squid with a black glitter button and small red buttons scattered over the fur' },
    { src: '/art/squids/1-3.jpg', alt: 'Black lace and satin bow pinned to the ear, with a tiny silver key charm below' },
    { src: '/art/squids/1-2.jpg', alt: 'Black lace bow on the body with a skull-key pendant and silver star studs' },
  ]),
  work('s2', 'squid', 'Blackberry', [
    { src: '/art/squids/2-3.jpg', alt: 'Black plush squid with a purple button, clay blackberries and purple satin bows' },
    { src: '/art/squids/2-1.jpg', alt: 'Head of the black squid: hand-painted purple button surrounded by clay blackberries and leaves' },
    { src: '/art/squids/2-2.jpg', alt: 'Close-up of the clay blackberries — each berry sculpted bead by bead' },
  ]),
  work('s3', 'squid', 'Meadow', [
    { src: '/art/squids/3-1.jpg', alt: 'Sage green and yellow squid with a pink polka-dot button, daisies and gingham flowers' },
    { src: '/art/squids/3-3.jpg', alt: 'Side of the green squid: a patchwork strip of yellow, gingham, mint and lilac, above a yellow ruffle collar' },
    { src: '/art/squids/3-2.jpg', alt: 'Close-up of the pink polka-dot button sewn with peach thread, a clay ladybird on its rim' },
  ]),
  work('s4', 'squid', 'Cosmic Heart', [
    { src: '/art/squids/4-2.jpg', alt: 'Black horned squid with pink-lined tentacles and an iridescent heart button' },
    { src: '/art/squids/4-1.jpg', alt: 'The same squid held in both arms, showing its size — about as wide as a torso' },
    { src: '/art/squids/4-3.jpg', alt: 'Close-up of the handmade clay heart button in blue and green, with clay planets and silver stars around it' },
  ]),
  work('s5', 'squid', 'Pumpkin Season', [
    { src: '/art/squids/5-1.jpg', alt: 'Black and orange squid with horns, an orange button, clay pumpkins and orange bows' },
    { src: '/art/squids/5-2.jpg', alt: 'Side view: a wide orange satin bow above slashes in the fur lined with orange' },
  ]),

  /* ---------- куклы ---------- */
  work('d1', 'doll', 'The Wedding Pair', [
    { src: '/art/dolls/1-4.jpg', alt: 'Two wedding dolls side by side: a bride in a lace gown and veil, a groom in a black tuxedo' },
    { src: '/art/dolls/1-2.jpg', alt: 'The bride doll alone — lace gown, embroidered veil and a bouquet of black flowers' },
    { src: '/art/dolls/1-3.jpg', alt: 'The groom doll alone — black tuxedo, bow tie and a stitched beard' },
    { src: '/art/dolls/1-1.jpg', alt: 'The pair next to the wedding photograph they were made from' },
  ], { note: 'Made from a wedding photograph' }),
  work('d2', 'doll', 'Che', [
    { src: '/art/dolls/2-2.jpg', alt: 'Doll in camouflage uniform and black boots, with braided hair and button eyes' },
    { src: '/art/dolls/2-1.jpg', alt: 'The doll held up beside the person it was made for, both in the same uniform' },
    { src: '/art/dolls/2-3.jpg', alt: 'Close-up of the face: painted brows, long lashes and grey button eyes' },
  ], { note: 'A "mini me" made to order' }),
  work('d3', 'doll', 'Overalls', [
    { src: '/art/dolls/3-2.jpg', alt: 'Doll in denim overalls with white hearts, a black long-sleeve top and two braids' },
    { src: '/art/dolls/3-1.jpg', alt: 'The doll standing on a pink sewing machine in the workshop, among cobwebs and photographs' },
    { src: '/art/dolls/3-4.jpg', alt: 'Close-up of the denim overalls — hand-stitched heart pocket and straps that really unclip' },
  ], { note: 'A "mini me" made to order' }),
  work('d4', 'doll', 'Jalea', [
    { src: '/art/dolls/4-2.jpg', alt: 'Doll with black curls in an all-black outfit and a miniature shoulder bag' },
    { src: '/art/dolls/4-3.jpg', alt: 'Close-up of the face: black curls, button eyes, a nose ring and glossy lips' },
    { src: '/art/dolls/4-1.jpg', alt: 'Close-up of the miniature leather bag, sewn to match a real one' },
  ], { note: 'A "mini me" made to order' }),

  /* ---------- портреты ---------- */
  work('p1', 'portrait', 'A Batch of Fourteen', [
    { src: '/art/portraits/1.jpg', alt: 'Fourteen finished ink portraits laid out on a dark table, each face with button eyes' },
  ]),
  work('p2', 'portrait', 'Curls and a Cocker Spaniel', [
    { src: '/art/portraits/2.jpg', alt: 'Ink portrait of a woman with curls and her cocker spaniel, shown beside the photographs it was drawn from' },
  ]),
  work('p3', 'portrait', 'Couple with a Tuxedo Cat', [
    { src: '/art/portraits/3.jpg', alt: 'Ink portrait of two people and their tuxedo cat, shown beside the photographs it was drawn from' },
  ]),
  work('p4', 'portrait', 'Three Dogs', [
    { src: '/art/portraits/4.jpg', alt: 'Ink portrait of a couple with three dogs, on a pink table beside buttons and thread' },
  ]),
  work('p5', 'portrait', 'Girl with a Toad', [
    { src: '/art/portraits/5.jpg', alt: 'Ink portrait of a girl in glasses holding a toad, framed by drawn vines and carnivorous plants' },
  ]),
  work('p6', 'portrait', 'Couple with a Black Kitten', [
    { src: '/art/portraits/6.jpg', alt: 'Ink portrait of two people and a black kitten, surrounded by drawn squids' },
  ]),
];

export const GALLERY_FILTERS = [
  { id: 'all',      label: 'Everything' },
  { id: 'squid',    label: 'Squids' },
  { id: 'doll',     label: 'Dolls' },
  { id: 'portrait', label: 'Portraits' },
];

/**
 * Работы раздела. Без n — все, с n — первые n.
 * Витрины на страницах разделов берут первые три, а полное число
 * нужно им же, чтобы решить, показывать ли ссылку в архив.
 */
export const worksOf = (kind, n) => {
  const all = galleryItems.filter((w) => w.kind === kind);
  return n === undefined ? all : all.slice(0, n);
};
