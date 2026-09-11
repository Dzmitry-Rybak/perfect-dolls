/**
 * Squid plushie builder — data.
 *
 * Prices and options come straight from Margarita's spec sheet.
 * Everything the customer can pick lives here, so wording, colours
 * and prices can be edited without touching components.
 */

export const BASE_PRICE = 110;

export const SIZES = [
  { id: 'standard', label: 'Standard', note: '~75 cm / 30 in', priceDelta: 0 },
  { id: 'xl',       label: 'XL',       note: '~1 m / 40 in',   priceDelta: 30 },
];

/**
 * Мех — ТОЧНЫЕ коды, подобранные Ритой под настоящую ткань.
 * Это единственная палитра, где цвет обязан совпадать с оригиналом,
 * поэтому значения взяты из её скриншотов пипетки как есть и
 * не подгонялись под тему сайта.
 *
 * Чёрный намеренно #1C1C1C, а не 000: на нём должны читаться
 * чёрные детали — рожки, глиняная пуговица из сета Коралины.
 */
export const FUR_COLORS = [
  { id: 'black',  label: 'Black',  hex: '#1C1C1C' },
  { id: 'cream',  label: 'Cream',  hex: '#ECE8DF' },
  { id: 'blue',   label: 'Blue',   hex: '#92A5C8' },
  { id: 'pink',   label: 'Pink',   hex: '#E2A7C1' },
  { id: 'sage',   label: 'Sage',   hex: '#95A989' },
  { id: 'red',    label: 'Red',    hex: '#C30924' },
  { id: 'orange', label: 'Orange', hex: '#ED8712' },
  { id: 'lilac',  label: 'Lilac',  hex: '#D896E8' },
];

/**
 * Пуговицы Рита лепит из глины и красит сама, поэтому цвет тут
 * не ограничен ничем: рядом с готовыми образцами стоит свободный
 * выбор любого оттенка (FREE_PICK ниже).
 *
 * Готовые 24 — приглушённые и смешиваемые. Кислотных нет намеренно:
 * «я их просто не намешаю».
 */
export const BUTTON_COLORS = [
  { id: 'black',   label: 'Black',       hex: '#1C1C1C' },
  { id: 'slate',   label: 'Slate',       hex: '#514C58' },
  { id: 'grey',    label: 'Grey',        hex: '#9A9AA5' },
  { id: 'cream',   label: 'Cream',       hex: '#ECE8DF' },
  { id: 'sand',    label: 'Sand',        hex: '#D9C3A5' },
  { id: 'honey',   label: 'Honey',       hex: '#E8C46A' },
  { id: 'gold',    label: 'Gold',        hex: '#DBC643' },
  { id: 'rust',    label: 'Rust',        hex: '#B4642F' },
  { id: 'orange',  label: 'Orange',      hex: '#ED8712' },
  { id: 'brown',   label: 'Brown',       hex: '#58281D' },
  { id: 'red',     label: 'Red',         hex: '#C30924' },
  { id: 'wine',    label: 'Wine',        hex: '#660F17' },
  { id: 'rasp',    label: 'Raspberry',   hex: '#E43F6A' },
  { id: 'pink',    label: 'Pink',        hex: '#E2A7C1' },
  { id: 'blush',   label: 'Blush',       hex: '#F3B4D4' },
  { id: 'dusty',   label: 'Dusty rose',  hex: '#A5677E' },
  { id: 'plum',    label: 'Plum',        hex: '#8E5A78' },
  { id: 'purple',  label: 'Purple',      hex: '#4F1060' },
  { id: 'lilac',   label: 'Lilac',       hex: '#D896E8' },
  { id: 'navy',    label: 'Navy',        hex: '#101360' },
  { id: 'blue',    label: 'Blue',        hex: '#92A5C8' },
  { id: 'teal',    label: 'Teal',        hex: '#26A7CF' },
  { id: 'mint',    label: 'Mint',        hex: '#98EBE7' },
  { id: 'sage',    label: 'Sage',        hex: '#95A989' },
];

/**
 * Быстрые цвета для узора на пуговице. Полная палитра давала два ряда
 * образцов ради одной детали — здесь хватает пары ходовых и пипетки
 * рядом, цвет всё равно не ограничен.
 */
export const PATTERN_PRESETS = ['black', 'cream', 'rasp', 'gold']
  .map((id) => BUTTON_COLORS.find((c) => c.id === id));

/** Свободный выбор цвета — там, где Рита красит вручную. */
export const FREE_PICK = ['button', 'thread', 'pattern'];

/**
 * Добавки со своим цветом — единый список для панели и для схемы.
 * Раньше он был захардкожен в панели, и по самой детали кликнуть было
 * нельзя: цвет менялся только свотчами внизу справа.
 * `palette`: 'ribbon' — RIBBON_COLORS, 'fur' — FUR_COLORS.
 */
export const ADDON_COLORS = [
  { addon: 'corset',   key: 'ribbonColor',   label: 'Ribbon colour',    palette: 'ribbon' },
  { addon: 'collar',   key: 'collarColor',   label: 'Collar colour',    palette: 'ribbon' },
  { addon: 'bow',      key: 'bowColor',      label: 'Bow colour',       palette: 'ribbon' },
  { addon: 'furHeart', key: 'furHeartColor', label: 'Fur heart colour', palette: 'fur' },
];

/** Пять красящихся зон меха. Порядок = порядок в подсказке. */
export const FUR_PARTS = [
  { id: 'ear',           label: 'Ears',                pieces: 2 },
  { id: 'earInner',      label: 'Inner ears',          pieces: 2 },
  { id: 'head',          label: 'Head',                pieces: 1 },
  { id: 'tentacle',      label: 'Tentacles',           pieces: 7 },
  { id: 'tentacleInner', label: 'Tentacle undersides', pieces: 7 },
];

/** Простые паттерны на пуговице. ВРЕМЕННЫЕ — ждём финальный список. */
export const BUTTON_PATTERNS = [
  { id: 'hearts', label: 'Hearts' },
  { id: 'stars',  label: 'Stars' },
  { id: 'dots',   label: 'Dots' },
  { id: 'cross',  label: 'Crosses' },
  { id: 'stripe', label: 'Stripes' },
];

/**
 * Добавки. `customizable` — деталь появляется «пустой» и её можно
 * настроить кликом на схеме. `group` — взаимоисключающие варианты
 * (три вида пирсинга нельзя выбрать одновременно).
 */
/**
 * ЦЕНЫ ПРИМЕРНЫЕ — Рита назовёт настоящие позже.
 * Все они собраны здесь и в PATTERN_PRICE / SHAPE_PRICE ниже,
 * больше нигде в коде чисел нет. Поиск по PLACEHOLDER-PRICE
 * находит всё, что нужно будет заменить.
 */
export const ADDONS = [
  // свой цвет: чёрные, кровь, стразы — красить нечего
  { id: 'horns',        label: 'Black horns',              price: 5,  group: null },
  { id: 'stitches',     label: 'Scars',                    price: 5,  group: null },
  { id: 'wounds',       label: 'Bloody wounds',            price: 5,  group: null },
  { id: 'rhinestones',  label: 'Rhinestones',              price: 10, group: null },   // PLACEHOLDER-PRICE
  { id: 'claySet',      label: 'Coraline-inspired clay set', price: 20, group: null }, // PLACEHOLDER-PRICE

  // пирсинг: простой — только дырочки, фулл — дырочки, цепь и подвески
  { id: 'pierceHoles',  label: 'Ear piercings — holes only', price: 5,  group: 'pierce' },
  { id: 'pierceFull',   label: 'Ear piercings — full set',   price: 10, group: 'pierce', customizable: 'charm' },

  // красится после добавления
  { id: 'corset',       label: 'Corset-style ribbon',      price: 10, group: null, customizable: 'ribbon' },
  { id: 'collar',       label: 'Collar',                   price: 10, group: null, customizable: 'trim' },   // PLACEHOLDER-PRICE
  { id: 'bow',          label: 'Bow + charm',              price: 10, group: null, customizable: 'bow' },    // PLACEHOLDER-PRICE
  { id: 'furHeart',     label: 'Fur heart',                price: 10, group: null, customizable: 'fur' },    // PLACEHOLDER-PRICE
  { id: 'safetyPin',    label: 'Safety pin + pendant',     price: 5,  group: null, customizable: 'charm' },
];

/** Блёстки поверх пуговицы. На схеме не показываются. */
export const GLITTER_PRICE = 5;   // PLACEHOLDER-PRICE

/**
 * Ленты — 17 точных кодов от того же продавца, у которого Рита их
 * покупает. Атлас и кружево различаются только материалом, поэтому
 * палитра у них ОДНА: в её папке один набор образцов, а не два.
 */
export const RIBBON_COLORS = [
  { id: 'black',   label: 'Black',      hex: '#141414' },
  { id: 'white',   label: 'White',      hex: '#F9F8F6' },
  { id: 'brown',   label: 'Brown',      hex: '#58281D' },
  { id: 'burg',    label: 'Burgundy',   hex: '#660F17' },
  { id: 'red',     label: 'Red',        hex: '#B5081C' },
  { id: 'rasp',    label: 'Raspberry',  hex: '#E43F6A' },
  { id: 'pink',    label: 'Pink',       hex: '#F3B4D4' },
  { id: 'lilac',   label: 'Lilac',      hex: '#D898E7' },
  { id: 'purple',  label: 'Purple',     hex: '#4F1060' },
  { id: 'navy',    label: 'Navy',       hex: '#101360' },
  { id: 'sky',     label: 'Sky',        hex: '#83B1D8' },
  { id: 'teal',    label: 'Teal',       hex: '#26A7CF' },
  { id: 'mint',    label: 'Mint',       hex: '#98EBE7' },
  { id: 'green',   label: 'Green',      hex: '#84B46A' },
  { id: 'lime',    label: 'Lime',       hex: '#ABD553' },
  { id: 'mustard', label: 'Mustard',    hex: '#DBC643' },
  { id: 'orange',  label: 'Orange',     hex: '#F57100' },
];

export const RIBBON_KINDS = [
  { id: 'satin', label: 'Satin' },
  { id: 'lace',  label: 'Lace' },
];

export const PATTERN_PRICE = { simple: 10, complex: 20 };

export const defaultBuild = {
  size: 'standard',
  mix: false,
  fur: {
    ear: '#1C1C1C', earInner: '#E2A7C1', head: '#1C1C1C',
    tentacle: '#1C1C1C', tentacleInner: '#E2A7C1',
  },
  pieces: {},              // поштучные цвета в режиме «микс»
  button: '#ECE8DF',
  glitter: false,          // блёстки поверх пуговицы — на схеме не показываем
  thread: '#1C1C1C',
  pattern: null,
  patternColor: '#E43F6A',
  complexNote: '',
  addons: [],
  ribbonKind: 'satin',
  ribbonColor: '#F3B4D4',
  collarColor: '#F9F8F6',
  bowColor: '#F3B4D4',
  bowCharm: null,
  furHeartColor: '#E2A7C1',
  notes: '',
};
