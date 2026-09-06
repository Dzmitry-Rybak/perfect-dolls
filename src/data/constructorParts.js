/** Детали конструктора. Порядок слоёв = порядок отрисовки снизу вверх. */

export const BASE_PRICE = 180;

export const layers = [
  { id: 'body',      label: 'Тело',     hint: 'основа и оттенок ткани' },
  { id: 'hair',      label: 'Волосы',   hint: 'мохер, шерсть или воск' },
  { id: 'eyes',      label: 'Глаза',    hint: 'пуговицы — главное решение' },
  { id: 'mouth',     label: 'Рот',      hint: 'вышивается вручную' },
  { id: 'outfit',    label: 'Наряд',    hint: 'ткань из моих запасов' },
  { id: 'accessory', label: 'Спутник',  hint: 'кто поедет вместе с ней' },
];

/** priceDelta — надбавка к BASE_PRICE.
 *  color — заливка слоя, подставляется в SVG через currentColor. */
export const parts = {
  body: [
    { id: 'body-linen', name: 'Небелёный лён',  priceDelta: 0,  color: '#D8C9B4' },
    { id: 'body-ash',   name: 'Пепельный',       priceDelta: 10, color: '#9E97A3' },
    { id: 'body-rose',  name: 'Пыльно-розовый',  priceDelta: 15, color: '#D9A9BC' },
    { id: 'body-soot',  name: 'Сажа',            priceDelta: 20, color: '#3A343F' },
  ],
  hair: [
    { id: 'hair-bob',    name: 'Каре',           priceDelta: 0,  color: '#2A2230' },
    { id: 'hair-long',   name: 'Длинные пряди',  priceDelta: 18, color: '#4A2F3D' },
    { id: 'hair-wax',    name: 'Восковые потёки',priceDelta: 32, color: '#E8C46A' },
    { id: 'hair-none',   name: 'Без волос',      priceDelta: 0,  color: 'transparent' },
  ],
  eyes: [
    { id: 'eyes-pearl',  name: 'Перламутр',      priceDelta: 0,  color: '#EDE6DC' },
    { id: 'eyes-jet',    name: 'Гагат',          priceDelta: 12, color: '#15131A' },
    { id: 'eyes-rose',   name: 'Розовые',        priceDelta: 14, color: '#FF96C9' },
    { id: 'eyes-mismatch', name: 'Разные',       priceDelta: 22, color: '#A5677E' },
  ],
  mouth: [
    { id: 'mouth-stitch', name: 'Стежок',        priceDelta: 0,  color: '#8E3F5C' },
    { id: 'mouth-cross',  name: 'Крестики',      priceDelta: 8,  color: '#C13F63' },
    { id: 'mouth-smile',  name: 'Полуулыбка',    priceDelta: 8,  color: '#8E3F5C' },
    { id: 'mouth-none',   name: 'Без рта',       priceDelta: 0,  color: 'transparent' },
  ],
  outfit: [
    { id: 'outfit-pinafore', name: 'Передник',   priceDelta: 24, color: '#5B4A6B' },
    { id: 'outfit-lace',     name: 'Кружево',    priceDelta: 46, color: '#EDE6DC' },
    { id: 'outfit-velvet',   name: 'Бархат',     priceDelta: 52, color: '#3E2440' },
    { id: 'outfit-spiral',   name: 'Спираль',    priceDelta: 38, color: '#A5677E' },
  ],
  accessory: [
    { id: 'acc-none',   name: 'Никого',          priceDelta: 0,  color: 'transparent' },
    { id: 'acc-bat',    name: 'Летучая мышь',    priceDelta: 26, color: '#2A2230' },
    { id: 'acc-cat',    name: 'Чёрный кот',      priceDelta: 34, color: '#15131A' },
    { id: 'acc-moon',   name: 'Луна на нити',    priceDelta: 20, color: '#E8C46A' },
  ],
};

/** Сборка по умолчанию — открывается при первом заходе. */
export const defaultBuild = {
  body: 'body-linen',
  hair: 'hair-bob',
  eyes: 'eyes-pearl',
  mouth: 'mouth-stitch',
  outfit: 'outfit-pinafore',
  accessory: 'acc-none',
};
