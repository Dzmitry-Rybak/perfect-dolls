/**
 * Фоновая графика: элементы, вырезанные из набора Риты.
 *
 * ТРИ ТИПА РАЗМЕЩЕНИЯ, и это не украшательство, а следствие геометрии.
 *
 * 1. side   — в поле сбоку от колонки (1240px). Размер и место —
 *             доли ширины поля: поле = max(0, (100vw − 1240px) / 2).
 * 2. corner — в углу вьюпорта, крупные, уходят за край; виден фрагмент.
 *             Размер в vmin, поэтому живут на любом экране.
 * 3. band   — сверху и снизу, размер в vw.
 * 4. free   — в процентах вьюпорта, размер в vmin. Единственный тип,
 *             которому разрешено заходить НА колонку текста, поэтому
 *             только он и работает на 14-дюймовом экране: там поле
 *             сбоку всего 136px (1512 − 1240) / 2 и side не помещается.
 *             Плата за это — низкая непрозрачность: чем ближе к центру,
 *             тем бледнее, иначе элемент спорит с текстом над ним.
 *
 * ПОЧЕМУ У SIDE ТАКИЕ ВЫСОКИЕ ПОРОГИ
 * Порог = ширина экрана, при которой элемент получает пригодный размер:
 *     порог = 1240 + 2 × минимум / k
 * Первая версия пускала боковые элементы уже с 1120px. На 1280–1440
 * поле там 20–100px, и элементы схлопывались до 5–18 пикселей — по
 * краям получалась не декорация, а грязь.
 * Пороги посчитаны на минимум 90px: k=0.74 → 1483, k=0.66 → 1513,
 * k=0.60 → 1540, k=0.30 → 1840. Раньше стояли значения под минимум
 * ~120px, и на 14 дюймах не включалось вообще ничего.
 *
 *  y/x   — % вьюпорта
 *  px    — где внутри поля: 0 — у края экрана, 1 — у края текста
 *  k     — размер как доля ширины поля
 *  vmin  — размер для corner
 *  vw    — размер для band
 *  x/y   — % вьюпорта для free
 *  min   — минимальная ширина экрана
 *  t     — ярус: 'f' сюжетный, 'b' пуговица
 *  mob   — показывать и на телефоне (только для free: остальные типы
 *          привязаны к полям, которых на узком экране нет)
 */

export const SLOTS = [
  /* ---------- УГЛЫ: работают на любом экране ---------- */
  { kind:'corner', t:'f', at:'tl', ox:-7,  oy:-5,  vmin:24, op:0.20, rot:-12, min:900 },
  { kind:'corner', t:'f', at:'br', ox:-6,  oy:-7,  vmin:26, op:0.17, rot:9,   min:900 },
  { kind:'corner', t:'b', at:'tr', ox:-3,  oy:2,   vmin:9,  op:0.26, rot:14,  min:900 },
  { kind:'corner', t:'b', at:'bl', ox:1,   oy:-3,  vmin:11, op:0.22, rot:-18, min:900 },
  { kind:'corner', t:'f', at:'bl', ox:-9,  oy:-12, vmin:22, op:0.11, rot:6,   min:1240, blur:1.5 },
  { kind:'corner', t:'b', at:'tl', ox:6,   oy:9,   vmin:7,  op:0.18, rot:-7,  min:1240 },

  /* ---------- СВЕРХУ И СНИЗУ ---------- */
  { kind:'band', t:'b', x:26, y:-3, vw:6,   op:0.13, rot:18,  min:1200, blur:1 },
  { kind:'band', t:'b', x:70, y:-2, vw:4.5, op:0.16, rot:-11, min:1200 },
  { kind:'band', t:'b', x:34, y:94, vw:5,   op:0.12, rot:9,   min:1200 },
  { kind:'band', t:'b', x:78, y:96, vw:6,   op:0.11, rot:-17, min:1200, blur:1 },

  /* ---------- СВОБОДНЫЕ: заходят на колонку, работают с 1100px ----------
     Именно они наполняют 14-дюймовый экран: там поле сбоку 136px и
     side не помещается. Три полосы по глубине — край, середина, центр;
     чем ближе к центру, тем бледнее и размытее.
     Потолок непрозрачности 0.26 взят из худшего случая: белый элемент
     на #0E0D10 даёт фон #4D4C4E, текст #EDE6DC на нём — 6.9:1 (AA).
     Реальные элементы тёмные, у них запас больше.                    */
  { kind:'free', t:'f', x:11, y:22, vmin:15,  op:0.26, rot:-8,  min:1100, mob:1 },
  { kind:'free', t:'f', x:90, y:33, vmin:14,  op:0.24, rot:9,   min:1100, mob:1 },
  { kind:'free', t:'b', x:17, y:58, vmin:6,   op:0.30, rot:12,  min:1100, mob:1 },
  { kind:'free', t:'b', x:84, y:68, vmin:5.5, op:0.28, rot:-10, min:1100, mob:1 },
  { kind:'free', t:'f', x:9,  y:78, vmin:13,  op:0.22, rot:6,   min:1100, mob:1 },
  { kind:'free', t:'f', x:92, y:84, vmin:12,  op:0.21, rot:-6,  min:1100, mob:1 },

  { kind:'free', t:'f', x:24, y:14, vmin:12,  op:0.19, rot:14,  min:1300 },
  { kind:'free', t:'f', x:77, y:90, vmin:11,  op:0.18, rot:-12, min:1300 },
  { kind:'free', t:'b', x:29, y:88, vmin:5,   op:0.24, rot:-15, min:1300, mob:1 },
  { kind:'free', t:'b', x:71, y:20, vmin:4.5, op:0.22, rot:18,  min:1300, mob:1 },
  { kind:'free', t:'f', x:33, y:46, vmin:11,  op:0.16, rot:-5,  min:1400, blur:1 },
  { kind:'free', t:'b', x:66, y:52, vmin:4.5, op:0.20, rot:22,  min:1400 },

  { kind:'free', t:'f', x:44, y:22, vmin:10,  op:0.13, rot:11,  min:1500, blur:1.5 },
  { kind:'free', t:'f', x:57, y:80, vmin:10,  op:0.12, rot:8,   min:1500, blur:1.5 },
  { kind:'free', t:'b', x:50, y:63, vmin:4,   op:0.14, rot:-19, min:1500, blur:1 },

  /* ---------- В ПОЛЕ СБОКУ: только когда поле реально есть ---------- */
  { kind:'side', t:'f', side:'l', y:8,  px:0.34, k:0.74, op:0.30, rot:-13, min:1500 },
  { kind:'side', t:'f', side:'r', y:18, px:0.40, k:0.66, op:0.24, rot:10,  min:1560 },
  { kind:'side', t:'f', side:'l', y:46, px:0.28, k:0.64, op:0.17, rot:7,   min:1560, blur:1.5 },
  { kind:'side', t:'f', side:'r', y:54, px:0.32, k:0.62, op:0.34, rot:-8,  min:1580 },
  { kind:'side', t:'f', side:'l', y:76, px:0.38, k:0.60, op:0.22, rot:15,  min:1580 },
  { kind:'side', t:'f', side:'r', y:82, px:0.26, k:0.56, op:0.18, rot:-16, min:1620, blur:1 },

  { kind:'side', t:'b', side:'l', y:28, px:0.74, k:0.30, op:0.34, rot:-6,  min:1620 },
  { kind:'side', t:'b', side:'r', y:70, px:0.76, k:0.28, op:0.36, rot:24,  min:1660 },
  { kind:'side', t:'b', side:'l', y:92, px:0.70, k:0.26, op:0.28, rot:-21, min:1660 },
  { kind:'side', t:'b', side:'r', y:6,  px:0.72, k:0.22, op:0.30, rot:12,  min:1700 },
  { kind:'side', t:'b', side:'r', y:38, px:0.60, k:0.20, op:0.20, rot:-5,  min:1740 },
  { kind:'side', t:'b', side:'l', y:62, px:0.66, k:0.19, op:0.22, rot:19,  min:1800 },
  { kind:'side', t:'b', side:'l', y:16, px:0.12, k:0.18, op:0.18, rot:14,  min:1800 },
  { kind:'side', t:'b', side:'r', y:30, px:0.10, k:0.17, op:0.22, rot:-22, min:1860 },
  { kind:'side', t:'f', side:'l', y:88, px:0.10, k:0.44, op:0.13, rot:-9,  min:1740, blur:1 },
  { kind:'side', t:'f', side:'r', y:66, px:0.08, k:0.40, op:0.12, rot:6,   min:1800, blur:1.5 },
];

/** Сюжетные — то, ради чего фон вообще нужен. */
export const FEATURES = [
  'cat', 'door-stone', 'galaxy', 'gate-mushrooms', 'door-green',
  'eye-lights', 'web-spiders', 'house-victorian', 'skull-key',
  'yarn-pins', 'patch-striped', 'jar-eyes', 'door-brown',
  'bone-hand', 'spiral-cloud', 'cat-sitting', 'web-tree',
  'key-old', 'patch-check', 'spiral-shape', 'button-needle', 'pincushion',
];

/** Пуговицы — взаимозаменяемый наполнитель. */
export const BUTTONS = [
  'button-black-lg', 'button-blue-lg', 'button-wine', 'buttons-pair',
  'button-purple', 'button-navy', 'button-violet', 'button-red',
  'button-black-thread', 'button-periwinkle', 'button-lilac',
  'button-black', 'button-red-sm', 'button-violet-sm',
  'button-black-sm', 'button-dark-sm',
  'btn2-1', 'btn2-2', 'btn2-3', 'btn2-4', 'btn2-5', 'btn2-6',
  'btn2-7', 'btn2-8', 'btn2-9', 'btn2-10', 'btn2-11',
];

/**
 * Поправка непрозрачности на собственную яркость элемента.
 *
 * Яркость графики Риты гуляет от 29 (чёрная пуговица) до 132 (банка с
 * глазами) при фоне сайта 13. На одной и той же непрозрачности тёмные
 * элементы дают подъём над фоном в 3 единицы и не видны вовсе, а
 * светлые — в 26 и лезут в глаза. Страница выглядела то пустой, то
 * пёстрой в зависимости от того, что выпало в ротации.
 *
 * gain = (70 − 13) / (яркость − 13), зажат в [0.5, 3.0]. После него
 * подъём над фоном у всех попадает в 10–16 вместо 3–26.
 * Побочно это ещё и повышает безопасность контраста: самые светлые
 * элементы приглушаются, и текст над ними не теряет читаемость.
 */
export const GAIN = {
  'bone-hand': 0.69, 'btn2-1': 1.7, 'btn2-10': 1.78, 'btn2-11': 0.85,
  'btn2-2': 0.97, 'btn2-3': 0.73, 'btn2-4': 0.89, 'btn2-5': 0.66,
  'btn2-6': 1.76, 'btn2-7': 1.15, 'btn2-8': 1.71, 'btn2-9': 0.74,
  'button-black': 2.57, 'button-black-lg': 1.99, 'button-black-sm': 3.0,
  'button-black-thread': 3.0, 'button-blue-lg': 1.05,
  'button-dark-sm': 2.24, 'button-lilac': 1.49, 'button-navy': 1.96,
  'button-needle': 1.43, 'button-periwinkle': 1.39, 'button-purple': 1.42,
  'button-red': 1.36, 'button-red-sm': 1.37, 'button-violet': 1.42,
  'button-violet-sm': 1.37, 'button-wine': 1.25, 'buttons-pair': 1.37,
  'cat': 2.12, 'cat-sitting': 1.99, 'door-brown': 0.9, 'door-green': 0.95,
  'door-stone': 0.94, 'eye-lights': 0.5, 'galaxy': 1.42,
  'gate-mushrooms': 1.18, 'house-victorian': 0.72, 'jar-eyes': 0.5,
  'key-old': 1.61, 'patch-check': 1.52, 'patch-striped': 1.17,
  'pincushion': 1.24, 'skull-key': 1.1, 'spiral-cloud': 1.46,
  'spiral-shape': 1.9, 'web-spiders': 1.8, 'web-tree': 1.18,
  'yarn-pins': 2.07
};

export function offsetFor(pathname, len) {
  let h = 0;
  for (let i = 0; i < pathname.length; i++) h = (h * 31 + pathname.charCodeAt(i)) | 0;
  return Math.abs(h) % len;
}
