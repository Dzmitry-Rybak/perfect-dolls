import { useState } from 'react';
import { PATH, VIEW, GROUPS } from '../../data/squidArt.js';
import { PART, HORNS, WINGS, WING_RIBS, WOUNDS, WOUND_SPECKS, COLLAR, BOW, SAFETY_PIN, CLAY, CLAY_COLOR, PIERCE, CORSET, heart, star, HEART_BOX, FUR_PATCH, SKULL_FUR, beadSpots, BEAD_R, BEAD_FACE, BEAD_SIDE, BEAD_SIDE_DX, BEAD_RIDGES, BEAD_RIDGE_DEPTH } from '../../data/squidParts.js';
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

/** Масштаб от центра пуговицы — для вырезов в маске линии. */
const BTN_SCALE = (k) =>
  `translate(196.1 212.45) scale(${k}) translate(-196.1 -212.45)`;

/**
 * Куда сажать булавку.
 *
 * Обведена она с листа Риты как есть и легла внизу слева — там, где
 * её нарисовали на том конкретном снимке. Место другое: справа
 * сверху, и снято оно с шаблона Риты.
 *
 * КАК СНЯТО. Шаблон приведён к нашим координатам по ПУГОВИЦЕ — она
 * есть на обоих и опознаётся точно, в отличие от края головы, который
 * на фото уходит в тень. На шаблоне её радиус 115 px, у нас 69.5,
 * отсюда масштаб 0.605. Центр булавки на шаблоне (481, 206) при
 * центре пуговицы (355, 357) — это и даёт (272, 121).
 *
 * Наклон 7°, а не «по касательной к голове»: на шаблоне булавка лежит
 * почти горизонтально (концы на 200 и 213 при длине 112 px). Прошлые
 * 26° я взял из головы, и это было слишком.
 *
 * Перенос описан одним преобразованием, а сам путь не тронут: у него
 * внутри полсотни кривых, и правка координат в них необратима, а
 * transform в любой момент читается и меняется одной строкой.
 */
const PIN_FROM = [142.85, 316.85];   // центр обведённой булавки
const PIN_TO   = [272, 121];         // куда её ставим — с шаблона
const PIN_TURN = 7;
const PIN_SCALE = 0.72;              // 120 px шаблона × 0.605 ÷ 98.1 своих
const PIN_AT =
  `translate(${PIN_TO[0]} ${PIN_TO[1]}) rotate(${PIN_TURN}) scale(${PIN_SCALE})` +
  ` translate(${-PIN_FROM[0]} ${-PIN_FROM[1]})`;

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
      /* Голова вырезана дыркой под КРУГЛУЮ пуговицу. При сердце дырка
         не та: кольцо между сердцем и старым кругом переставало
         кликаться, хотя на вид это обычный мех. Берём голову целиком —
         пуговица нарисована поверх и клики внутри себя ловит сама. */
      d: id === 'head' && heartBtn ? PATH.headSolid : PATH[id],
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

  /* Форма пуговицы. Сердце строится тем же heart(), что и сердце из
     меха, — одна кривая на обе детали. */
  const heartBtn = build.buttonShape === 'heart';
  const HEART_D = heart(...HEART_BOX.button);
  const HEART_IN_D = heart(...HEART_BOX.button, 0.72);

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
        ...(btnRim ? [{ d: heartBtn ? HEART_D : PATH.btnOuter, ...btnRim,
                       width: btnRim.strokeWidth, halo: false }] : []),
        /* Круглая набрана из двух колец, сердце — одной сплошной
           заливкой. Обводка тут НЕ ставится: у круглой её рисует
           общий контур уже после узора, и сердцу обводка кладётся
           там же (см. ButtonGroup). Иначе узор ложится поверх неё
           и вылезает крапинами за край. */
        ...(heartBtn
          ? [{ d: HEART_D, fill: btn },
             /* Внутренний контур — только ради подсветки, сам не
                рисуется (его линию кладёт ButtonGroup поверх узора).
                У круглой btnOuter — это СРАЗУ два кольца, и бегущий
                стежок обводит оба; сердцу собираем такую же пару,
                иначе загоралась бы одна внешняя линия. */
             { d: HEART_IN_D, invisible: true }]
          : [{ d: PATH.btnOuter, fill: btn },
             { d: PATH.btnInner, fill: btn, halo: false }]),
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
          clipD={heartBtn ? HEART_D : PATH.btnDisc}
        />
      )}
      {/* Внутренний ободок — рисованная деталь пуговицы, не красится и
          событий не ловит: клик по нему проходит на пуговицу под ним.
          Идёт ПОСЛЕ узора, иначе узор его закрашивает.
          У круглой он нарисован Ритой (threadRing), сердцу строим
          такое же — сердце поменьше, одной линией. */}
      {heartBtn ? (
        <g fill="none" stroke={INK} pointerEvents="none">
          {/* Край сердца — здесь, а не в заливке: поверх узора,
              как общий контур делает это круглой. */}
          <path d={HEART_D} strokeWidth="5" strokeLinejoin="round" />
          <path d={HEART_IN_D} strokeWidth="3" strokeLinejoin="round" />
        </g>
      ) : (
        <path d={PATH.threadRing} fill={INK} pointerEvents="none" />
      )}
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
    corset: () => CORSET.bowCells.join('') + CORSET.rings,
    furHeart: () => FUR_PATCH.furHeart.d,
    furSkull: () => FUR_PATCH.furSkull.d,
    furStar: () => FUR_PATCH.furStar.d,
  };

  const pathFor = (id) => {
    const part = PARTS.find((p) => p.id === id);
    if (part) return part.shapes.filter((sh) => sh.halo !== false).map((sh) => sh.d).join('');
    if (ADDON_PATH[id]) return ADDON_PATH[id]();

    /* Подсветка головы обводит её край И вырез под пуговицу — он у
       неё внутренний контур. В PATH.head вырез круглый, поэтому при
       сердце загорался круг от пуговицы, которой на схеме уже нет.
       Собираем пару сами: сплошная голова плюс само сердце. */
    if (id === 'head' && heartBtn) return PATH.headSolid + HEART_D;

    return PATH[OWN_PATH[id] ?? id];
  };

  /* Что под добавкой: воротник ложится на щупальца, бант — на воротник,
     если тот включён, иначе тоже на щупальца. */
  const behindCollar = colorOf('tent0', 'tentacle');
  const collarRim = rimFor(build.collarColor, behindCollar);
  const bowRim = rimFor(build.bowColor, has('collar') ? build.collarColor : behindCollar);
  /* Бусины считаем один раз: по ним и рисуется имя, и вырезается
     просвет в пирсинге со стразами, чтобы кольца уходили ЗА бусину,
     а не сливались с ней в кашу. Приём тот же, что у линии под
     нашивкой, — см. маску squid-line-cut ниже. */
  const beads = has('nameBeads') && build.beadWord
    ? beadSpots(build.beadWord.length)
    : null;

  /* Какая нашивка выбрана — форм три, место одно. */
  const patchId = Object.keys(FUR_PATCH).find(has);
  const patch = patchId && FUR_PATCH[patchId];
  /* Череп белый всегда, см. SKULL_FUR. Сердце и звезда берут цвет
     из сборки — он у них общий, чтобы не пропадал при переключении. */
  const skullPatch = patchId === 'furSkull';
  const patchFill = skullPatch ? SKULL_FUR : build.patchColor;
  const patchRim = rimFor(patchFill, colorOf('head', 'head'));
  const ribbonRim = rimFor(build.ribbonColor, colorOf('head', 'head'));

  const lit = hover ?? activePart;
  const litPath = lit ? pathFor(lit) : null;

  return (
    <svg
      className={styles.canvas}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label="Your plush squid preview"
    >
      {/* ---- крылья: ДО головы, чтобы уйти под неё внутренним краем ----
           Цвет не выбирается: они всегда чёрные, как рожки.
           Обводка той же краской сглаживает стыки кривых — светлая
           кромка здесь не нужна, холст лежит на светлом листе, и
           чёрное на нём и так читается. Жилки, наоборот, светлые:
           внутри чёрной перепонки другого способа их показать нет. */}
      {has('wings') && (
        <g pointerEvents="none">
          <path d={WINGS} fill={INK} stroke={INK} strokeWidth="2"
                strokeLinejoin="round" />
          <path d={WING_RIBS} fill="none" stroke="#ECE8DF" strokeOpacity="0.28"
                strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* ---- заливки ---- */}
      <path {...zone('head')} />
      {GROUPS.ear.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.earInner.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.tentacle.map((id) => <path key={id} {...zone(id)} />)}
      {GROUPS.tentacleInner.map((id) => <path key={id} {...zone(id)} />)}

      {/* ---- нашивка из меха: под пуговицей, красится как мех ----
           Сердце, череп или звезда — одна заливка мехом с чёрной
           обводкой. Почему именно обводка, а не вторая уменьшенная
           копия, написано у FUR_PATCH. */}
      {patch && (
        /* Череп — обычная фигура, а не кликабельная зона: красить его
           нечем, и кнопка, которая ничего не делает, хуже отсутствия
           кнопки. События он при этом забирает себе, иначе нажатие
           сквозь него открывало бы палитру головы. */
        <g {...(skullPatch ? null : addon(patchId))}>
          {/* Светлая кромка шире чёрного канта, иначе её не видно
              из-под него: она нужна, когда мех нашивки совпал с мехом
              головы и чёрный кант обе стороны не разделяет. */}
          {patchRim && <path d={patch.d} {...patchRim} strokeWidth="9" />}
          <path d={patch.d} fill={patchFill} stroke={INK} strokeWidth="5.5" />
        </g>
      )}

      {/* ---- пуговица: под линией, обод в ней и нарисован ---- */}
      <ButtonGroup />

      {/* ---- добавки: под линией, чтобы обводка легла поверх ---- */}
      {has('wounds') && (
        <g pointerEvents="none">
          {WOUNDS.map((w, i) => (
            <g key={i}>
              <path d={w.outer} fill={BLOOD} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
              <path d={w.inner} fill={BLOOD_DEEP} />
              {/* Капли — под швами: нитка лежит поверх раны, а не наоборот */}
              <path d={WOUND_SPECKS[i]} fill={BLOOD} />
              {/* Швы. Идут ВМЕСТЕ с раной, отдельной добавкой не бывают:
                  на рисунке Риты рваный край всегда прихвачен ниткой.
                  Две толщины: одинаковая у всех читается как машинная
                  строчка, даже когда сами штрихи кривые. */}
              <path d={w.seam} fill="none" stroke={INK} strokeWidth="2.2"
                    strokeLinecap="round" />
              <path d={w.seamBold} fill="none" stroke={INK} strokeWidth="3.4"
                    strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}

      {/* ---- ЛИНИЯ: поверх заливок, событий не ловит ----

           Из неё два выреза, и оба по одной причине: она рисует не
           только контур, но и детали, которые в некоторых сборках
           лишние. Белое в маске — линия видна, чёрное — спрятана,
           и порядок фигур важен, каждая следующая перекрывает
           предыдущую.

           1. ПУНКТИР-ШОВ ПОД НАШИВКОЙ. Он идёт от темени вниз и
           пересекает нашивку. Нашивка — деталь поверх меха, пунктир
           должен уходить под неё. Прячем линию по форме нашивки.

           2. ОБОДОК ПУГОВИЦЫ ВОЗВРАЩАЕМ. Он тоже часть линии и попал
           бы под тот же вырез. Диск увеличен на 8%: линия ободка идёт
           ПО границе btnDisc, половина её толщины лежит снаружи.
           Выше 137 он не поднимается, а последняя точка пунктира на
           112 — пунктир под нашивкой не воскресает.

           3. У СЕРДЦА-ПУГОВИЦЫ КРУГА БЫТЬ НЕ ДОЛЖНО — вырезаем его
           последним, поверх возврата. Раньше я вместо выреза
           закрашивал круг заплаткой цветом головы; это было видно
           ровно до тех пор, пока под пуговицей не оказывалась
           нашивка: заплатка ложилась поверх неё пятном чужого цвета. */}
      {(patch || heartBtn) && (
        <mask id="squid-line-cut" maskUnits="userSpaceOnUse"
              x="-60" y="-60" width="520" height="1000">
          <rect x="-60" y="-60" width="520" height="1000" fill="#fff" />
          {patch && <path d={patch.d} fill="#000" />}
          {patch && <path d={PATH.btnDisc} transform={BTN_SCALE(1.08)} fill="#fff" />}
          {heartBtn && <path d={PATH.btnDisc} transform={BTN_SCALE(1.09)} fill="#000" />}
        </mask>
      )}
      <path d={PATH.line} fill={INK} pointerEvents="none"
            mask={patch || heartBtn ? 'url(#squid-line-cut)' : undefined} />

      {/* ---- добавки поверх линии ---- */}
      {/* Шнуровка — поверх линии: под ней обводка головы резала люверсы пополам */}
      {has('corset') && (
        <g {...addon('corset')}>
          {/* Бант — НЕСКОЛЬКО ЯЧЕЕК, а не силуэт со штрихами поверх.
              Каждая заливается лентой и обводится одной линией; общие
              границы соседних ячеек их обводки перекрывают, и
              разделительная линия выходит сама, везде одной толщины.
              Раньше край рисовался дважды — силуэтом и обведёнными
              чернилами, — оттого и был рваным. */}
          {/* ДВА ПРОХОДА, и порядок тут не косметика.
              Ячейка — это ВНУТРЕННОСТЬ области, чернила лежат снаружи
              от её границы. Обычная обводка кладёт половину толщины
              внутрь и съедает ленту: при 7 бант почернел.
              Поэтому сперва чернила обводкой вдвое шире полосы (10.6
              при полосе 5.3 — столько занимает линия на листе после
              пересчёта), а затем заливка ячейки поверх. Внутренняя
              половина обводки уходит под заливку, наружу остаётся
              ровно 5.3. У двух соседних ячеек полосы накладываются и
              дают общую границу той же толщины. */}
          {ribbonRim && CORSET.bowCells.map((d, i) => (
            <path key={'rim' + i} d={d} {...ribbonRim} strokeWidth="15" strokeLinejoin="round" />
          ))}
          {CORSET.bowCells.map((d, i) => (
            <path key={'ink' + i} d={d} fill="none" stroke={INK}
                  strokeWidth="10.6" strokeLinejoin="round" />
          ))}
          {CORSET.bowCells.map((d, i) => (
            <path key={i} d={d} fill={build.ribbonColor} />
          ))}
          {/* Люверсы — поверх бантов и своим путём. Построены овалами
              (см. EYELETS), поэтому контур им даёт обводка: отдельного
              пути чернил больше нет, он и двоил линию.
              Обводка тоньше, чем у банта: люверс всего 15 единиц в
              поперечнике, при 5.3 от него осталась бы одна линия. */}
          {ribbonRim && <path d={CORSET.rings} {...ribbonRim} strokeWidth="6" strokeLinejoin="round" />}
          <path d={CORSET.rings} fill={build.ribbonColor}
                stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
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

      {/* Просвет вокруг бусин. Вырез на 2.4 шире самой бусины — узкая
          светлая щель между нею и кольцом: ровно столько, чтобы глаз
          прочитал «бусина лежит сверху», и не столько, чтобы это
          выглядело дырой в ухе. Два кружка на бусину — под лицо и
          под бок. */}
      {beads && (
        <mask id="squid-bead-cut" maskUnits="userSpaceOnUse"
              x="-60" y="-60" width="520" height="1000">
          <rect x="-60" y="-60" width="520" height="1000" fill="#fff" />
          {beads.map(({ x, y }, i) => (
            <g key={i} fill="#000">
              <circle cx={x} cy={y} r={BEAD_R + 2.4} />
              <circle cx={x - BEAD_SIDE_DX} cy={y} r={BEAD_R + 2.4} />
            </g>
          ))}
        </mask>
      )}

      {has('rhinestones') && (
        <path d={PART.rhineLine} fill="#E4E4EC" stroke={INK} strokeWidth="0.5" pointerEvents="none"
              mask={beads ? 'url(#squid-bead-cut)' : undefined} />
      )}

      {/* Чёрный камень из сета теряется на чёрной голове — та же
          светлая кромка, что у рожек. */}
      {has('claySet') && (
        <g pointerEvents="none">
          {/* Сет из глины: шесть пуговок, у каждой своя форма и свой
              цвет — они не выбираются, это готовый набор Риты.
              Поэтому каждая рисуется отдельно: заливка своим цветом,
              поверх — общий чёрный контур той же толщины, что и весь
              рисунок. */}
          {/* треугольник: по правому и нижнему ободу — строчка,
              у колечка внутри — штриховка слева, как на листе */}
          <path d={CLAY.tri} fill={CLAY_COLOR.tri} stroke={INK} strokeWidth="2.6"
                strokeLinejoin="round" />
          <path d={CLAY.triSeam} fill="none" stroke={INK} strokeWidth="0.9"
                strokeLinecap="round" />
          <path d={CLAY.triHole} fill="none" stroke={INK} strokeWidth="1.7" />
          <path d={CLAY.triHatch} fill="none" stroke={INK} strokeWidth="0.9"
                strokeLinecap="round" />
          {/* звёздная */}
          <path d={CLAY.star} fill={CLAY_COLOR.star} stroke={INK} strokeWidth="2.6"
                strokeLinejoin="round" />
          <path d={CLAY.starMark} fill={CLAY_COLOR.starMark} stroke={INK}
                strokeWidth="1.8" strokeLinejoin="round" />
          {/* тёмная: светлая кромка обязательна — на чёрном мехе она
              иначе пропадает целиком */}
          <path d={CLAY.dark} fill={CLAY_COLOR.dark} {...RIM} />
          <path d={CLAY.darkMark} fill={CLAY_COLOR.darkMark} />
          {/* завитки: круг своим цветом, спираль поверх чернилами */}
          {CLAY.swirl.map((d, i) => (
            <g key={i}>
              <path d={d} fill={CLAY_COLOR.swirl[i]} stroke={INK} strokeWidth="2.6"
                    strokeLinejoin="round" />
              <path d={CLAY.swirlLine[i]} fill="none" stroke={INK} strokeWidth="2"
                    strokeLinecap="round" />
            </g>
          ))}
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
              stroke="#ECE8DF" strokeOpacity="0.34" strokeWidth="1.6"
              mask={beads ? 'url(#squid-bead-cut)' : undefined} />
      )}

      {has('pierceFull') && (
        <path d={PIERCE.chain} fill={INK} fillRule="evenodd" pointerEvents="none"
              stroke="#ECE8DF" strokeOpacity="0.34" strokeWidth="1.6"
              mask={beads ? 'url(#squid-bead-cut)' : undefined} />
      )}

      {has('safetyPin') && (
        <g pointerEvents="none" transform={PIN_AT}>
          {/* светлая кромка: на чёрном мехе булавка иначе сливается с ним.
              Ширина обводки 1.8 — по 0.9 единицы с каждой стороны, как у шрамов */}
          <path d={SAFETY_PIN} fill="#ECE8DF" fillOpacity="0.34" stroke="#ECE8DF"
                strokeOpacity="0.34" strokeWidth="1.8" strokeLinejoin="round" fillRule="evenodd" />
          <path d={SAFETY_PIN} fill={INK} fillRule="evenodd" />
        </g>
      )}

      {/* Бусины с буквами — вдоль края левого уха, в наружном ухе.
          Где именно и почему не по самой линии — см. beadSpots
          в squidParts.

          СТОЯТ ПОСЛЕ ПИРСИНГА НАМЕРЕННО. Кольца занимают ту же полосу
          уха, и порядок решает, что кого перекроет. Имя важнее
          украшения: буква, наполовину съеденная кольцом, не читается,
          а кольцо под буквой читается по-прежнему.

          Бусина рисуется двумя кружками, как на фотографии Риты:
          задний сдвинут влево — это её бок, по его левой дуге идут
          насечки-лесенка; передний — лицо с буквой. */}
      {beads && (
        <g pointerEvents="none">
          {beads.map(({ x, y }, i) => {
            const sx = x - BEAD_SIDE_DX;
            return (
              <g key={i}>
                <circle cx={sx} cy={y} r={BEAD_R} fill={BEAD_SIDE}
                        stroke={INK} strokeWidth="1.8" />
                {BEAD_RIDGES.map((deg) => {
                  const a = (deg * Math.PI) / 180;
                  const c = Math.cos(a), s2 = Math.sin(a);
                  return (
                    <line
                      key={deg}
                      x1={sx + c * BEAD_R} y1={y + s2 * BEAD_R}
                      x2={sx + c * (BEAD_R - BEAD_RIDGE_DEPTH)}
                      y2={y + s2 * (BEAD_R - BEAD_RIDGE_DEPTH)}
                      stroke={INK} strokeWidth="1.2" strokeLinecap="round"
                    />
                  );
                })}
                <circle cx={x} cy={y} r={BEAD_R} fill={BEAD_FACE}
                        stroke={INK} strokeWidth="1.8" />
                <text
                  x={x} y={y}
                  textAnchor="middle" dominantBaseline="central"
                  fontFamily="var(--font-ui), sans-serif"
                  fontSize="8" fontWeight="700" fill={INK}
                >
                  {build.beadWord[i]}
                </text>
              </g>
            );
          })}
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
 * Обрезаются по СПЛОШНОЙ форме пуговицы, а не по её внутреннему
 * кругу: раньше рисунок сидел пятачком в середине и не доходил до
 * края. Для круглой это btnDisc, а не btnOuter — у того внутри дырка
 * под ободок нитки, и узор ложился кольцом; для сердца форму
 * передаёт clipD.
 * Сетка строится от радиуса, поэтому при любом шаге накрывает
 * пуговицу целиком, а лишнее срезает обрезка.
 *
 * Крестик нитки рисуется ПОСЛЕ узора — узор уходит под него.
 */
function ButtonPattern({ id, color, clipD = PATH.btnDisc }) {
  const CX = 196, CY = 212;                 // центр пуговицы
  const R = 70;                             // её радиус
  const clip = 'squid-btn-clip';
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
          <path key={i} d={star(x, y, 9.5 * S)} {...P} />
        ))}
        {id === 'stripe' && [...Array(Math.ceil((R * 2) / (13 * S)) + 1)].map((_, i) => (
          <rect key={i} x={CX - R - 4} y={CY - R + i * 13 * S} width={R * 2 + 8} height={6 * S} {...P} />
        ))}
      </g>
    </>
  );
}
