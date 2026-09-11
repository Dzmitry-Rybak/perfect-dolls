import { useState } from 'react';
import { PATH, VIEW, GROUPS } from '../../data/squidArt.js';
import { PART, HORNS, WOUNDS, WOUND_SPECKS, COLLAR, BOW, SAFETY_PIN, CLAY, PIERCE, CORSET, heart, HEART_BOX } from '../../data/squidParts.js';
import styles from './SquidCanvas.module.css';

/**
 * Схема сквида на контурах из фотошопного исходника Риты.
 *
 * Заливаемые области идут первыми, поверх них ложится линия. Так
 * цвет никогда не перекрывает рисунок, а любая часть остаётся
 * кликабельной: обводка нарисована сверху и не ловит события
 * (pointer-events: none).
 *
 * Координаты добавок подобраны под её геометрию:
 * голова x 45..347 y 44..383 · уши y 7..162 · пуговица x 129..265 y 147..278.
 */

const INK = '#15131A';
const BLOOD = '#A8323C';       // цвет раны фиксированный — так у Риты в спеке
const BLOOD_DEEP = '#5A0F17';  // глубина разрыва
const CHARM = '#D9D4CE';       // подвеска — металл, цвет не выбирается

/**
 * Тонкая светлая кромка для ЧЁРНЫХ деталей: рожки и шрамики на чёрном
 * мехе сливались с фоном. Обводка идёт по центру контура, поэтому
 * наружу выходит половина — получается волосок, а не рамка.
 * На светлом мехе она почти не видна и рисунку не мешает.
 */
const RIM = { stroke: '#ECE8DF', strokeOpacity: 0.55, strokeWidth: 1.6 };

/**
 * Кромка для детали, слившейся с фоном.
 *
 * Чёрный бант на чёрном мехе, чёрная пуговица на чёрной голове, чёрная
 * нитка на чёрной пуговице — всё это пропадало. Рисовать обводку всегда
 * нельзя: на контрастных сочетаниях она читается как лишняя линия.
 * Поэтому считаем контраст по WCAG и ставим кромку только там, где он
 * ниже 1.4 — на глаз это порог, за которым деталь перестаёт отделяться.
 * Цвет кромки — противоположный: светлый на тёмном, тёмный на светлом.
 */
const srgb = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => srgb(c / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const rimFor = (color, behind) => {
  if (!color || !behind || contrast(color, behind) >= 1.4) return null;
  return {
    stroke: lum(color) < 0.18 ? '#ECE8DF' : '#15131A',
    strokeOpacity: 0.55,
    strokeWidth: 2.6,
    fill: 'none',
  };
};

/**
 * Шрамики: где и под каким углом. Сняты с эскиза Риты — четыре штуки,
 * по два сверху и снизу, наклонены в разные стороны.
 */
const SCARS = [[96,144,-30], [156,80,14], [302,266,-46], [216,346,-24]];

/** Какой группе принадлежит область. */
const groupOf = Object.fromEntries(
  Object.entries(GROUPS).flatMap(([g, ids]) => ids.map((id) => [id, g]))
);

/** Пуговица и нитка кликаются по своим путям, а не по PATH[id]. */
const OWN_PATH = { button: 'btnOuter', thread: 'thread' };

export default function SquidCanvas({ build, colorOf, onPick, activePart }) {
  const has = (id) => build.addons.includes(id);
  const [hover, setHover] = useState(null);

  /**
   * Наведение и фокус ведут в одно состояние: подсветка рисуется
   * ОТДЕЛЬНЫМ путём поверх всего, включая чёрную линию. Иначе её
   * закрывает обводка рисунка и остаётся еле заметное свечение.
   */
  const mark = (id) => ({
    onMouseEnter: () => setHover(id),
    onMouseLeave: () => setHover((h) => (h === id ? null : h)),
    onFocus: () => setHover(id),
    onBlur: () => setHover((h) => (h === id ? null : h)),
  });

  /**
   * Палитра открывается по pointerdown, а не по click.
   *
   * На сенсорном экране click браузер синтезирует уже ПОСЛЕ pointerdown,
   * и к этому моменту открытая палитра успевала закрыться — первый тап
   * по другой детали только подсвечивал её, выбрать получалось со
   * второго раза. Pointerdown приходит сразу и одинаково от мыши,
   * пальца и пера. Клавиатура идёт своим путём — onKeyDown ниже.
   *
   * data-colour-zone читает ColorPopover: нажатие на другую деталь
   * он не считает «кликом мимо» и не закрывается — новая палитра
   * просто встаёт на место старой.
   */
  const zone = (id) => {
    const group = groupOf[id];
    return {
      d: PATH[id],
      fill: colorOf(id, group),
      className: styles.zone,
      tabIndex: 0,
      role: 'button',
      'aria-label': `Change colour: ${group}`,
      'data-colour-zone': '',
      onPointerDown: (e) => onPick(id, group, e),
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(id, group, e); }
      },
      ...mark(id),
    };
  };

  /**
   * ОПИСАНИЕ ПУГОВИЦЫ — ЕДИНСТВЕННЫЙ ИСТОЧНИК.
   *
   * Раньше рисование, попадание курсора и подсветка задавались в трёх
   * разных местах, и правка одного расходилась с двумя другими: то
   * подсвечивался круг вместо сердца, то крестик не подсвечивался, то
   * наведение на крестик меняло цвет пуговицы. Теперь форма описывается
   * одним списком, а всё остальное из него выводится:
   *   shapes — что рисуем; halo:false у тех, что не участвуют в обводке
   *   pad    — невидимая широкая линия, чтобы в тонкую нитку попадали
   * Порядок частей = порядок отрисовки, поэтому нитка, идущая второй,
   * перехватывает курсор у пуговицы там, где они накладываются.
   */

  const buttonParts = () => {
    const btn = colorOf('button', 'button');
    const thr = colorOf('thread', 'thread');
    /* Пуговица лежит на голове, нитка — на пуговице: кромку каждой
       считаем от того, что под ней, а не от фона страницы. */
    const btnRim = rimFor(btn, colorOf('head', 'head'));
    const thrRim = rimFor(thr, btn);
    return [
      { id: 'button', shapes: [
        ...(btnRim ? [{ d: PATH.btnOuter, ...btnRim, width: btnRim.strokeWidth, halo: false }] : []),
        { d: PATH.btnOuter, fill: btn },
        { d: PATH.btnInner, fill: btn, halo: false },
      ] },
      /* Крестик заливается СПЛОШНЫМ: threadCross нарисован обводкой
         с дырками внутри, и заливка целиком давала полый крестик. */
      { id: 'thread', shapes: [
        ...(thrRim ? [{ d: PATH.threadCrossSolid, ...thrRim, width: thrRim.strokeWidth, halo: false }] : []),
        { d: PATH.threadCrossSolid, fill: thr },
      ] },
    ];
  };

  const PARTS = buttonParts();

  /**
   * Пуговица целиком: сначала её детали, затем узор, затем крестик.
   * Порядок именно такой, чтобы узор ложился НА пуговицу, но ПОД
   * крестик — иначе крестик тонет в рисунке.
   */
  const ButtonGroup = () => (
    <>
      {PARTS.filter((p) => p.id !== 'thread').map((p) => <Part key={p.id} part={p} />)}
      {build.pattern && (
        <ButtonPattern
          id={build.pattern}
          color={build.patternColor}
        />
      )}
      {/* Контурный круг — рисованная деталь пуговицы, не красится и
          событий не ловит: клик по нему проходит на пуговицу под ним.
          Идёт ПОСЛЕ узора, иначе узор его закрашивает. */}
      <path d={PATH.threadRing} fill={INK} pointerEvents="none" />
      {PARTS.filter((p) => p.id === 'thread').map((p) => <Part key={p.id} part={p} />)}
    </>
  );

  /**
   * Добавка со своим цветом кликается так же, как мех и пуговица:
   * те же обработчики, та же подсветка. Раньше цвет менялся только
   * свотчами в панели — по самой детали кликнуть было нельзя.
   */
  const addon = (id) => ({
    className: styles.zone,
    tabIndex: 0,
    role: 'button',
    'aria-label': `Change colour: ${id}`,
    'data-colour-zone': '',
    onPointerDown: (e) => onPick(id, id, e),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(id, id, e); }
    },
    ...mark(id),
  });

  const Part = ({ part }) => (
    <g
      className={styles.zone}
      tabIndex={0} role="button"
      aria-label={`Change colour: ${part.id}`}
      data-colour-zone=""
      onPointerDown={(e) => onPick(part.id, part.id, e)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(part.id, part.id, e); } }}
      {...mark(part.id)}
    >
      {part.shapes.map((sh, i) => (
        <path
          key={i} d={sh.d}
          fill={sh.invisible ? 'none' : sh.fill}
          stroke={sh.invisible ? 'none' : sh.stroke}
          strokeOpacity={sh.strokeOpacity}
          strokeWidth={sh.width}
          strokeLinejoin="round"
        />
      ))}
      {part.pad && (
        <path d={part.pad.d} fill="none" stroke="transparent" strokeWidth={part.pad.width} />
      )}
    </g>
  );

  /**
   * Путь для подсветки. Повторяет то, из чего состоит сама деталь.
   *
   * У круглой пуговицы btnOuter — это ДВА кольца, внешнее и
   * внутреннее, и подсвечиваются оба. Сердцу собираем такую же пару,
   * иначе у него загоралась только внешняя линия.
   */
  /** Контуры цветных добавок для подсветки — по ним же они и кликаются. */
  const ADDON_PATH = {
    collar: () => COLLAR.frill,
    bow: () => BOW.loops + BOW.tails + BOW.knot,
    corset: () => corset.bows + CORSET.rings,
    furHeart: () => heart(...HEART_BOX.fur),
  };

  const pathFor = (id) => {
    const part = PARTS.find((p) => p.id === id);
    if (part) return part.shapes.filter((sh) => sh.halo !== false).map((sh) => sh.d).join('');
    if (ADDON_PATH[id]) return ADDON_PATH[id]();

    return PATH[OWN_PATH[id] ?? id];
  };

  /* Что под добавкой: воротник ложится на щупальца, бант — на воротник,
     если тот включён, иначе тоже на щупальца. */
  const behindCollar = colorOf('tent0', 'tentacle');
  const collarRim = rimFor(build.collarColor, behindCollar);
  const bowRim = rimFor(build.bowColor, has('collar') ? build.collarColor : behindCollar);
  const heartRim = rimFor(build.furHeartColor, colorOf('head', 'head'));
  const ribbonRim = rimFor(build.ribbonColor, colorOf('head', 'head'));
  const corset = build.ribbonKind === 'lace' ? CORSET.lace : CORSET.satin;

  const lit = hover ?? activePart;
  const litPath = lit ? pathFor(lit) : null;

  return (
    <svg
      className={styles.canvas}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label="Your plush squid preview"
    >
      {/* ---- заливки ---- */}
      <path {...zone('head')} />
      {GROUPS.ear.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.earInner.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.tentacle.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.tentacleInner.map((id) => <path key={id} {...zone(id)} />)}

      {/* ---- сердце из меха: под пуговицей, красится как мех ---- */}
      {has('furHeart') && (
        <g {...addon('furHeart')}>
          {heartRim && <path d={heart(...HEART_BOX.fur)} {...heartRim} strokeWidth="4.6" />}
          <path d={heart(...HEART_BOX.fur)} fill={INK} />
          <path d={heart(...HEART_BOX.fur, 0.97)} fill={build.furHeartColor} />
        </g>
      )}

      {/* ---- пуговица (и сердце под ней): под линией, обод в ней и нарисован ---- */}
      <ButtonGroup />

      {/* ---- добавки: под линией, чтобы обводка легла поверх ---- */}
      {has('wounds') && (
        <g pointerEvents="none">
          {WOUNDS.map((w, i) => (
            <g key={i}>
              <path d={w.outer} fill={BLOOD} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
              <path d={w.inner} fill={BLOOD_DEEP} />
            </g>
          ))}
          {WOUND_SPECKS.map((d, i) => <path key={i} d={d} fill={BLOOD} />)}
        </g>
      )}

      {/* ---- ЛИНИЯ: поверх заливок, событий не ловит ---- */}
      <path d={PATH.line} fill={INK} pointerEvents="none" />

      {/* ---- добавки поверх линии ---- */}
      {/* Шнуровка — поверх линии: под ней обводка головы резала люверсы пополам */}
      {has('corset') && (
        <g {...addon('corset')}>
          {ribbonRim && <path d={corset.bows} {...ribbonRim} strokeWidth="4" fillRule="evenodd" strokeLinejoin="round" />}
          <path d={corset.bows} fill={build.ribbonColor} fillRule="evenodd"
                stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d={corset.line} fill={INK} fillRule="evenodd" />
          {/* Кольца — поверх бантов и своим путём: в общем они выедались evenodd */}
          {ribbonRim && <path d={CORSET.rings} {...ribbonRim} strokeWidth="4" fillRule="evenodd" strokeLinejoin="round" />}
          <path d={CORSET.rings} fill={build.ribbonColor} fillRule="evenodd"
                stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d={CORSET.ringLine} fill={INK} fillRule="evenodd" />
        </g>
      )}

      {/* ---- воротник: поверх линии, иначе обводки щупалец режут его на полосы ---- */}
      {has('collar') && (
        <g {...addon('collar')}>
          {collarRim && <path d={COLLAR.frill} {...collarRim} strokeWidth="5.6" strokeLinejoin="round" />}
          <path d={COLLAR.frill} fill={build.collarColor}
                stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      )}

      {has('bow') && (
        <g {...addon('bow')}>
          {bowRim && <>
            <path d={BOW.tails} {...bowRim} strokeWidth="5" strokeLinejoin="round" />
            <path d={BOW.loops} {...bowRim} strokeWidth="5" strokeLinejoin="round" />
            <path d={BOW.knot} {...bowRim} strokeWidth="5" strokeLinejoin="round" />
          </>}
          <path d={BOW.tails} fill={build.bowColor} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d={BOW.loops} fill={build.bowColor} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d={BOW.creases} fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <path d={BOW.ring} fill="none" stroke={INK} strokeWidth="2" />
          <path d={BOW.charm} fill={CHARM} stroke={INK} strokeWidth="2" />
          <path d={BOW.knot} fill={build.bowColor} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        </g>
      )}

      {has('rhinestones') && (
        <path d={PART.rhineLine} fill="#E4E4EC" stroke={INK} strokeWidth="0.5" pointerEvents="none" />
      )}

      {/* Чёрный камень из сета теряется на чёрной голове — та же
          светлая кромка, что у рожек. */}
      {has('claySet') && (
        <g pointerEvents="none">
          {/* светлая кромка: контурные фигурки иначе тонут в чёрном мехе */}
          <path d={CLAY.line} fill="none" stroke="#ECE8DF" strokeOpacity="0.34"
                strokeWidth="4.4" strokeLinejoin="round" />
          <path d={CLAY.spirals} fill="none" stroke="#ECE8DF" strokeOpacity="0.34"
                strokeWidth="3.8" strokeLinecap="round" />
          <path d={CLAY.line} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d={CLAY.spirals} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d={CLAY.dark} fill={INK} {...RIM} />
          <path d={CLAY.darkMark} fill="#ECE8DF" />
        </g>
      )}

      {/* Рожки построены по рисунку Риты — см. HORNS в squidParts.
           Контур чёрный, как у остального рисунка. Обводка той же
           краской сглаживает край: без неё видны стыки кривых. */}
      {has('horns') && (
        <path d={HORNS} fill={INK} stroke={INK} strokeWidth="2"
              strokeLinejoin="round" pointerEvents="none" />
      )}

      {/* Шрамики по эскизу Риты: пологая дуга и два поперечных
           штриха через неё. Раньше это были просто крестики.
           Четыре штуки по голове, как на её рисунке. */}
      {has('stitches') && (
        <g fill="none" strokeLinecap="round" pointerEvents="none">
          {/* Тонкая светлая кромка: на чёрном мехе чёрный шрам иначе
              не виден. Шире линии всего на 0.9 единицы с каждой
              стороны и на треть непрозрачности — на светлом мехе
              совпадает с ним и не читается. */}
          {[
            { stroke: '#ECE8DF', strokeOpacity: 0.34, strokeWidth: 5 },
            { stroke: INK, strokeWidth: 3.2 },
          ].map((paint, layer) => (
            <g key={layer} {...paint}>
              {SCARS.map(([x, y, a], i) => (
                <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <path d="M-23,0 Q0,-7 23,0" />
                  <path d="M-10,-10 L-7,10 M8,-10 L11,10" />
                </g>
              ))}
            </g>
          ))}
        </g>
      )}

      {(has('pierceHoles') || has('pierceFull')) && (
        <path d={PIERCE.rings} fill={INK} fillRule="evenodd" pointerEvents="none"
              stroke="#ECE8DF" strokeOpacity="0.34" strokeWidth="1.6" />
      )}

      {has('pierceFull') && (
        <path d={PIERCE.chain} fill={INK} fillRule="evenodd" pointerEvents="none"
              stroke="#ECE8DF" strokeOpacity="0.34" strokeWidth="1.6" />
      )}

      {has('safetyPin') && (
        <g pointerEvents="none">
          {/* светлая кромка: на чёрном мехе булавка иначе сливается с ним.
              Ширина обводки 1.8 — по 0.9 единицы с каждой стороны, как у шрамов */}
          <path d={SAFETY_PIN} fill="#ECE8DF" fillOpacity="0.34" stroke="#ECE8DF"
                strokeOpacity="0.34" strokeWidth="1.8" strokeLinejoin="round" fillRule="evenodd" />
          <path d={SAFETY_PIN} fill={INK} fillRule="evenodd" />
        </g>
      )}

      {/* ---- ПОДСВЕТКА: последней, поверх линии и добавок ----
           Обводит ровно ту деталь, на которую наведён курсор.
           Толщина в экранных пикселях (non-scaling-stroke), иначе
           на маленьком экране линия истончается вместе со схемой. */}
      {litPath && (
        <g pointerEvents="none" className={activePart === lit ? styles.litActive : ''}>
          <path d={litPath} className={styles.haloGlow} />
          <path d={litPath} className={styles.haloLine} />
        </g>
      )}
    </svg>
  );
}

/** Простые паттерны на пуговице — обрезаны по её внутреннему кругу. */
/**
 * Простые узоры на пуговице.
 *
 * Обрезаются по СПЛОШНОМУ кругу пуговицы (btnDisc), а не по её
 * внутреннему кругу: раньше рисунок сидел пятачком в середине и не
 * доходил до края. Именно btnDisc, а не btnOuter — у того внутри
 * дырка под ободок нитки, и узор ложился кольцом.
 * Сетка строится от радиуса, поэтому при любом шаге накрывает
 * пуговицу целиком, а лишнее срезает обрезка.
 *
 * Крестик нитки рисуется ПОСЛЕ узора — узор уходит под него.
 */
function ButtonPattern({ id, color }) {
  const CX = 196, CY = 212;                 // центр пуговицы
  const R = 70;                             // её радиус
  const clip = 'squid-btn-clip';
  const clipD = PATH.btnDisc;
  const P = { fill: color, stroke: 'none' };

  /** Узлы сетки, накрывающей пуговицу целиком. */
  const grid = (step) => {
    const n = Math.ceil((R * 2) / step) + 1;
    const half = ((n - 1) * step) / 2;
    const out = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) out.push([CX - half + c * step, CY - half + r * step]);
    }
    return out;
  };

  const S = 1;
  return (
    <>
      <clipPath id={clip}><path d={clipD} /></clipPath>
      <g clipPath={`url(#${clip})`} opacity="0.9" pointerEvents="none">
        {id === 'dots' && grid(20 * S).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4.5 * S} {...P} />
        ))}
        {id === 'hearts' && grid(26 * S).map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + 6 * S} C${x - 9 * S} ${y - 4 * S}, ${x - 2 * S} ${y - 10 * S}, ${x} ${y - 3 * S}
                            C${x + 2 * S} ${y - 10 * S}, ${x + 9 * S} ${y - 4 * S}, ${x} ${y + 6 * S} Z`} {...P} />
        ))}
        {id === 'stars' && grid(26 * S).map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 9 * S} L${x + 2.6 * S} ${y - 2.6 * S} L${x + 9 * S} ${y}
                            L${x + 2.6 * S} ${y + 2.6 * S} L${x} ${y + 9 * S} L${x - 2.6 * S} ${y + 2.6 * S}
                            L${x - 9 * S} ${y} L${x - 2.6 * S} ${y - 2.6 * S} Z`} {...P} />
        ))}
        {id === 'cross' && grid(26 * S).map(([x, y], i) => (
          <path key={i} d={`M${x - 6 * S} ${y - 6 * S} L${x + 6 * S} ${y + 6 * S}
                            M${x + 6 * S} ${y - 6 * S} L${x - 6 * S} ${y + 6 * S}`}
                stroke={color} strokeWidth={3 * S} strokeLinecap="round" fill="none" />
        ))}
        {id === 'stripe' && [...Array(Math.ceil((R * 2) / (13 * S)) + 1)].map((_, i) => (
          <rect key={i} x={CX - R - 4} y={CY - R + i * 13 * S} width={R * 2 + 8} height={6 * S} {...P} />
        ))}
      </g>
    </>
  );
}
