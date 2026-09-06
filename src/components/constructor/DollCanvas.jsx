import styles from './DollCanvas.module.css';

/**
 * Живое превью куклы. Слои рисуются снизу вверх в порядке
 * layers из data/constructorParts.js. Каждая деталь — чистая
 * функция от выбранного id, поэтому смена варианта перерисовывает
 * только свой слой.
 */

const BODY = {
  'body-linen': 'M100 150 C72 150 55 172 49 210 C43 242 46 268 51 280 L149 280 C154 268 157 242 151 210 C145 172 128 150 100 150 Z',
  'body-ash':   'M100 150 C70 150 54 174 50 212 C46 244 48 268 52 280 L148 280 C152 268 154 244 150 212 C146 174 130 150 100 150 Z',
  'body-rose':  'M100 150 C74 150 56 170 48 208 C41 242 45 268 50 280 L150 280 C155 268 159 242 152 208 C144 170 126 150 100 150 Z',
  'body-soot':  'M100 150 C71 150 53 173 48 211 C43 243 46 268 51 280 L149 280 C154 268 157 243 152 211 C147 173 129 150 100 150 Z',
};

function Hair({ id, color }) {
  if (id === 'hair-none') return null;
  if (id === 'hair-long') return (
    <g fill={color}>
      <path d="M56 92 C56 56 76 40 100 40 C124 40 144 56 144 92 C144 78 133 69 122 69 L78 69 C67 69 56 78 56 92 Z" />
      <path d="M58 88 C46 128 48 170 55 196" stroke={color} strokeWidth="17" strokeLinecap="round" fill="none" />
      <path d="M142 88 C154 128 152 170 145 196" stroke={color} strokeWidth="17" strokeLinecap="round" fill="none" />
    </g>
  );
  if (id === 'hair-wax') return (
    <g fill={color}>
      <path d="M56 92 C56 56 76 40 100 40 C124 40 144 56 144 92 C144 78 133 69 122 69 L78 69 C67 69 56 78 56 92 Z" />
      {/* Восковые потёки стекают по краю лица */}
      <path d="M60 84 C58 104 62 116 60 130 C58 140 66 142 68 132 C71 116 66 100 68 84 Z" />
      <path d="M140 84 C142 108 137 120 139 136 C141 148 133 149 131 138 C128 120 134 102 132 84 Z" />
      <path d="M100 40 C96 46 97 54 100 60 C103 54 104 46 100 40 Z" />
    </g>
  );
  // каре
  return (
    <path fill={color}
      d="M56 90 C56 54 76 38 100 38 C124 38 144 54 144 90 C144 76 133 67 122 67 L78 67 C67 67 56 76 56 90 Z" />
  );
}

function Eyes({ id, color }) {
  // «Разные» — левый гагат, правый розовый
  const left  = id === 'eyes-mismatch' ? '#15131A' : color;
  const right = id === 'eyes-mismatch' ? '#FF96C9' : color;

  return [{ cx: 80, fill: left }, { cx: 120, fill: right }].map(({ cx, fill }) => (
    <g key={cx}>
      <circle cx={cx} cy="94" r="13" fill={fill} />
      <circle cx={cx} cy="94" r="13" fill="none" stroke="#0E0D10"
              strokeWidth="1.1" strokeDasharray="1.8 2.4" opacity="0.55" />
      <circle cx={cx - 4.5} cy="90" r="2.1" fill="#0E0D10" />
      <circle cx={cx + 4.5} cy="90" r="2.1" fill="#0E0D10" />
      <circle cx={cx - 4.5} cy="98" r="2.1" fill="#0E0D10" />
      <circle cx={cx + 4.5} cy="98" r="2.1" fill="#0E0D10" />
      <path d={`M${cx - 4.5} 90 ${cx + 4.5} 98M${cx + 4.5} 90 ${cx - 4.5} 98`}
            stroke="#0E0D10" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ));
}

function Mouth({ id, color }) {
  if (id === 'mouth-none') return null;
  if (id === 'mouth-cross') return (
    <g stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <path d="M87 116 L94 123M94 116 L87 123" />
      <path d="M96.5 116 L103.5 123M103.5 116 L96.5 123" />
      <path d="M106 116 L113 123M113 116 L106 123" />
    </g>
  );
  if (id === 'mouth-smile') return (
    <path d="M86 117 Q100 128 114 117" stroke={color} strokeWidth="2.6"
          strokeLinecap="round" fill="none" strokeDasharray="4.5 3.5" />
  );
  return (
    <path d="M86 120 H114" stroke={color} strokeWidth="2.6"
          strokeLinecap="round" strokeDasharray="4.5 3.5" />
  );
}

function Outfit({ id, color }) {
  if (id === 'outfit-lace') return (
    <g>
      {/* Контур обязателен: костяное кружево на льняном теле сливалось
          в одно пятно и платье переставало читаться */}
      <path fill={color} stroke="#5B4A6B" strokeWidth="1.6" opacity="0.95"
        d="M100 152 C76 152 60 176 54 212 C48 244 50 268 55 280 L145 280 C150 268 152 244 146 212 C140 176 124 152 100 152 Z" />
      {/* Кружевная кайма — фестоны по подолу */}
      <g fill="none" stroke="#5B4A6B" strokeWidth="1.5" opacity="0.75">
        <path d="M55 270 q7 -9 14 0 q7 -9 14 0 q7 -9 14 0 q7 -9 14 0 q7 -9 14 0 q7 -9 14 0" />
        <path d="M56 250 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0" />
        <path d="M58 230 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0" />
      </g>
    </g>
  );
  if (id === 'outfit-velvet') return (
    <g>
      <path fill={color}
        d="M100 152 C74 152 57 178 51 214 C45 246 48 268 53 280 L147 280 C152 268 155 246 149 214 C143 178 126 152 100 152 Z" />
      <path d="M100 158 V276" stroke="#0E0D10" strokeWidth="1.6" opacity="0.4" />
      <path d="M74 200 C70 230 71 258 74 276" stroke="#0E0D10" strokeWidth="1.2" opacity="0.25" fill="none" />
      <path d="M126 200 C130 230 129 258 126 276" stroke="#0E0D10" strokeWidth="1.2" opacity="0.25" fill="none" />
    </g>
  );
  if (id === 'outfit-spiral') return (
    <g>
      <path fill={color}
        d="M100 152 C75 152 58 176 52 213 C46 245 49 268 54 280 L146 280 C151 268 154 245 148 213 C142 176 125 152 100 152 Z" />
      {/* Расписная спираль — из работ Риты */}
      <path fill="none" stroke="#EDE6DC" strokeWidth="2.4" strokeLinecap="round" opacity="0.75"
        d="M100 224 C100 218 106 216 110 220 C116 225 115 235 107 240 C96 246 84 240 80 228 C75 213 84 197 99 192 C117 186 136 197 141 214" />
    </g>
  );
  // передник
  return (
    <g>
      <path fill={color}
        d="M100 152 C74 152 57 176 51 212 C45 244 48 268 53 280 L147 280 C152 268 155 244 149 212 C143 176 126 152 100 152 Z" />
      <path fill="#EDE6DC" opacity="0.82"
        d="M79 176 h42 c5 26 8 58 7 88 h-56 c-1 -30 2 -62 7 -88 Z" />
      <path d="M79 176 C74 168 84 162 90 166M121 176 C126 168 116 162 110 166"
            stroke="#EDE6DC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.82" />
    </g>
  );
}

function Accessory({ id, color }) {
  if (id === 'acc-none') return null;
  if (id === 'acc-bat') return (
    <g fill={color} transform="translate(150 66)">
      <ellipse cx="0" cy="0" rx="7" ry="8" />
      <path d="M-6 -6 L-11 -13 L-9 -4 Z M6 -6 L11 -13 L9 -4 Z" />
      <path d="M-6 -1 C-18 -8 -30 -3 -33 6 C-25 3 -19 5 -14 9 C-11 5 -8 2 -6 -1 Z" />
      <path d="M6 -1 C18 -8 30 -3 33 6 C25 3 19 5 14 9 C11 5 8 2 6 -1 Z" />
      <circle cx="-2.6" cy="-1" r="1.5" fill="#E8C46A" />
      <circle cx="2.6" cy="-1" r="1.5" fill="#E8C46A" />
    </g>
  );
  if (id === 'acc-cat') return (
    <g transform="translate(160 250)">
      <path fill={color} d="M0 0 C-11 0 -18 -8 -18 -19 C-18 -30 -11 -37 0 -37 C11 -37 18 -30 18 -19 C18 -8 11 0 0 0 Z" />
      <path fill={color} d="M-13 -32 L-16 -44 L-6 -37 Z M13 -32 L16 -44 L6 -37 Z" />
      <path fill={color} d="M16 -6 C26 -8 30 -18 26 -26 C24 -20 20 -14 15 -12 Z" />
      <circle cx="-6" cy="-24" r="2.4" fill="#E8C46A" />
      <circle cx="6" cy="-24" r="2.4" fill="#E8C46A" />
    </g>
  );
  // Луна на нити — висит в руке, а не парит у виска
  return (
    <g transform="translate(30 246)">
      <path d="M4 -2 C2 6 1 12 0 18" stroke="#EDE6DC" strokeWidth="1.3"
            strokeDasharray="2.5 3" opacity="0.75" fill="none" />
      <path fill={color}
            d="M0 18 C-9 18 -16 25 -16 34 C-16 43 -9 50 0 50 C-4 45 -6 40 -6 34 C-6 28 -4 23 0 18 Z" />
      <circle cx="4" cy="-2" r="1.6" fill="#EDE6DC" opacity="0.8" />
    </g>
  );
}

export default function DollCanvas({ build, partsById }) {
  const get = (layer) => partsById[build[layer]] ?? {};
  const body = get('body');

  return (
    <svg className={styles.canvas} viewBox="0 0 200 300"
         role="img" aria-label="Превью собираемой куклы">
      {/* Тень под куклой */}
      <ellipse cx="100" cy="284" rx="62" ry="9" fill="#0E0D10" opacity="0.35" />

      {/* Руки — под платьем */}
      <path d="M58 186 C40 196 32 220 34 244" stroke={body.color} strokeWidth="12"
            strokeLinecap="round" fill="none" />
      <path d="M142 186 C160 196 168 220 166 244" stroke={body.color} strokeWidth="12"
            strokeLinecap="round" fill="none" />

      {/* Ноги */}
      <path d="M84 262 V292" stroke={body.color} strokeWidth="13" strokeLinecap="round" />
      <path d="M116 262 V292" stroke={body.color} strokeWidth="13" strokeLinecap="round" />

      {/* Тело */}
      <path d={BODY[build.body] ?? BODY['body-linen']} fill={body.color} />

      {/* Наряд поверх тела */}
      <Outfit id={build.outfit} color={get('outfit').color} />

      {/* Шея и голова */}
      <rect x="92" y="126" width="16" height="28" rx="7" fill={body.color} />
      <ellipse cx="100" cy="94" rx="44" ry="48" fill={body.color} />
      {/* Шов по лицу — тряпичная кукла */}
      <path d="M100 48 V140" stroke="#0E0D10" strokeWidth="1.2"
            strokeDasharray="2.5 3.5" opacity="0.28" />

      <Hair id={build.hair} color={get('hair').color} />
      <Eyes id={build.eyes} color={get('eyes').color} />

      {/* Румянец */}
      <ellipse cx="64" cy="110" rx="9" ry="5.5" fill="#FF96C9" opacity="0.22" />
      <ellipse cx="136" cy="110" rx="9" ry="5.5" fill="#FF96C9" opacity="0.22" />

      <Mouth id={build.mouth} color={get('mouth').color} />
      <Accessory id={build.accessory} color={get('accessory').color} />
    </svg>
  );
}
