import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { watchPointer, remeasureGaze } from '../../lib/gaze.js';
import styles from './FortuneCard.module.css';

/** Пока одно предсказание-заглушка. Потом здесь будет колода. */
const FORTUNE = {
  label: 'the card says',
  text: 'The thread you are afraid to pull is the one holding everything together. Pull it anyway.',
};

const FRONT = '/art/fortune/card-front-lids.webp';
const EYE   = '/art/fortune/eye.webp';
const BACK  = '/art/fortune/card-back.webp';

/**
 * Глаз между век на лицевой стороне.
 *
 * Лицевая картинка с вырезанным овалом между век (сделан из рисунка
 * Риты: залитый бумажным цветом овал стал прозрачным). Под ней —
 * белок того же бумажного цвета и радужка, которая ходит за курсором.
 * Края радужки прячут сами веки: они лежат поверх.
 *
 * Сдвиг пишется в две CSS-переменные через ref, без состояния React:
 * перерисовывать дерево на каждое движение мыши незачем.
 */
function CardEye() {
  const wellRef = useRef(null);

  useEffect(() => {
    const well = wellRef.current;
    if (!well || reduced()) return;
    // На телефоне глаз, пока его не трогают, сам озирается (.wander).
    // Как только палец коснулся экрана — озирание замирает и глаз
    // смотрит на палец; через пару секунд без касаний снова озирается.
    let idle = 0;
    const touchOnly = window.matchMedia('(hover: none)').matches;
    const unwatch = watchPointer(well, (x, y, dist) => {
      // Курсор рядом с глазом — смотрит почти прямо, далеко — до упора
      const k = Math.min(1, dist / 260);
      well.style.setProperty('--gx', (x * k).toFixed(3));
      well.style.setProperty('--gy', (y * k).toFixed(3));
      if (!touchOnly) return;   // с мышью глаз просто смотрит на курсор
      well.dataset.tracking = '';
      clearTimeout(idle);
      idle = setTimeout(() => {
        delete well.dataset.tracking;
        well.style.setProperty('--gx', '0');
        well.style.setProperty('--gy', '0');
      }, 2500);
    });
    return () => { clearTimeout(idle); unwatch(); };
  }, []);

  return (
    <span ref={wellRef} className={styles.well} aria-hidden="true">
      <span className={styles.wander}>
        <img className={styles.iris} src={EYE} alt="" draggable="false" />
      </span>
    </span>
  );
}

/** Цвета искр — с самой карты: золото точек, оранжевое солнце,
 *  розовые веки, фиолетовое и бирюзовое небо, белые блики. */
const SPARK_COLORS = ['#E8C46A', '#F7A63A', '#FF96C9', '#B98BE0', '#56C3D6', '#FFF6EA'];

const rnd = (a, b) => a + Math.random() * (b - a);

/**
 * Волшебство на перевороте.
 *
 * Монтируется в тот момент, когда карта начинает поворачиваться, и
 * все анимации отсчитываются от него: на середине переворота, когда
 * карта встаёт ребром, — вспышка, которая прячет смену сторон, и
 * взрыв искр. Сзади раскрывается сияние и медленно вращается круг
 * со звёздами; на фоне загораются и мерцают звёзды. Сияние, круг и
 * звёзды остаются, пока карта открыта, — карта «светится».
 *
 * Случайные числа — один раз на открытие (useMemo): иначе каждая
 * перерисовка разбрасывала бы искры заново.
 */
function useSparks() {
  return useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const angle = rnd(0, Math.PI * 2);
    const dist = rnd(45, 110);                 // в процентах ширины карты
    return {
      key: i,
      star: i % 3 !== 2,
      style: {
        '--dx': `${Math.cos(angle) * dist}cqw`,
        '--dy': `${Math.sin(angle) * dist * 1.25}cqw`,
        '--s': `${rnd(i % 3 === 2 ? 1.6 : 3.5, i % 3 === 2 ? 3 : 8)}cqw`,
        '--rot': `${rnd(-200, 200)}deg`,
        '--dur': `${rnd(900, 1700)}ms`,
        '--delay': `${rnd(300, 460)}ms`,
        '--c': SPARK_COLORS[i % SPARK_COLORS.length],
      },
    };
  }), []);
}

function useSkyStars() {
  return useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    key: i,
    style: {
      left: `${rnd(3, 97)}%`,
      top: `${rnd(4, 96)}%`,
      '--s': `${rnd(6, 16)}px`,
      '--c': SPARK_COLORS[i % SPARK_COLORS.length],
      '--delay': `${rnd(200, 1400)}ms`,
      '--every': `${rnd(2.4, 5)}s`,
    },
  })), []);
}

function SpellBehind() {
  const sparks = useSparks();
  return (
    <div className={styles.spellBehind} aria-hidden="true">
      <span className={styles.halo} />
      <span className={styles.rays} />
      <svg className={styles.ring} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="none" stroke="#E8C46A" strokeWidth="0.8" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#FF96C9" strokeWidth="0.5" opacity="0.7" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = 100 + Math.cos(a) * 92, y = 100 + Math.sin(a) * 92;
          return i % 3 === 0
            ? <path key={i} d={`M${x} ${y - 5}L${x + 1.4} ${y - 1.4}L${x + 5} ${y}L${x + 1.4} ${y + 1.4}L${x} ${y + 5}L${x - 1.4} ${y + 1.4}L${x - 5} ${y}L${x - 1.4} ${y - 1.4}Z`} fill="#E8C46A" />
            : <circle key={i} cx={x} cy={y} r="1.6" fill="#FFF6EA" />;
        })}
      </svg>
      {sparks.map(({ key, star, style }) => (
        <span key={key} className={star ? styles.sparkStar : styles.sparkDot} style={style} />
      ))}
    </div>
  );
}

function SkyStars() {
  const stars = useSkyStars();
  return (
    <div className={styles.sky} aria-hidden="true">
      {stars.map(({ key, style }) => <span key={key} className={styles.skyStar} style={style} />)}
    </div>
  );
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Карта-предсказание Риты в правом верхнем углу.
 *
 * Маленькая висит под шапкой и время от времени вздрагивает — зовёт
 * нажать. По нажатию она сама вырастает в центр экрана (container
 * transform: та же карта, а не новое окно поверх) и переворачивается
 * чёрной рамкой к зрителю — там предсказание.
 *
 * Как сделан рост. Большая карта стоит в центре по CSS. Первым кадром
 * её сдвигают и уменьшают ровно в прямоугольник маленькой (FLIP) и
 * отпускают — она «вылетает» из угла. Закрытие — то же в обратную
 * сторону: переворот назад, потом полёт в угол.
 */
export default function FortuneCard() {
  // closed → opening → open → closing → closed
  const [phase, setPhase] = useState('closed');
  const slotRef = useRef(null);
  const flyRef = useRef(null);
  const cardRef = useRef(null);
  const veilRef = useRef(null);
  const closeRef = useRef(null);
  const busy = useRef(false);
  const returnFocus = useRef(false);
  const dialogRef = useRef(null);
  // Волшебство: off → on (с началом переворота) → fading (закрытие)
  const [spell, setSpell] = useState('off');

  /** Сдвиг и масштаб, которые сажают большую карту на место маленькой. */
  const toSlot = useCallback(() => {
    const from = slotRef.current.getBoundingClientRect();
    const to = flyRef.current.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = from.width / to.width;
    return `translate(${dx}px, ${dy}px) scale(${s})`;
  }, []);

  // Открыли с клавиатуры (Enter/пробел) или пальцем/мышью. От этого
  // зависит, куда ставить фокус: клавиатуре нужен видимый фокус на
  // крестике и возврат на карту, а после касания рамка фокуса только
  // мешает — на телефоне она висела на крестике и потом на карте.
  const byKeyboard = useRef(false);

  const open = (e) => {
    if (busy.current || phase !== 'closed') return;
    byKeyboard.current = e?.detail === 0;   // клик без указателя = клавиатура
    busy.current = true;
    setPhase('opening');
  };

  const close = useCallback(() => {
    if (busy.current || phase !== 'open') return;
    busy.current = true;
    setPhase('closing');
  }, [phase]);

  // Полёт из угла и переворот — сразу после того, как большая карта
  // появилась в разметке, но до первой отрисовки: иначе мелькнёт
  // кадр, где она уже стоит в центре.
  useLayoutEffect(() => {
    if (phase !== 'opening') return;
    const fly = flyRef.current, card = cardRef.current, veil = veilRef.current;

    if (reduced()) {
      card.style.transform = 'rotateY(180deg)';
      setPhase('open');
      busy.current = false;
      return;
    }

    const start = toSlot();
    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'both' });
    const grow = fly.animate(
      [{ transform: start }, { transform: 'none' }],
      { duration: 640, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
    );
    grow.finished.then(() => {
      setSpell('on');
      // Переворот чуть медленнее и с подъёмом на середине — чтобы
      // вспышка успела вспыхнуть, пока карта стоит ребром.
      const flip = card.animate(
        [
          { transform: 'rotateY(0deg) scale(1)' },
          { transform: 'rotateY(90deg) scale(1.12)', offset: 0.5 },
          { transform: 'rotateY(180deg) scale(1)' },
        ],
        { duration: 900, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' },
      );
      return flip.finished;
    }).then(() => {
      setPhase('open');
      busy.current = false;
    }).catch(() => {});
  }, [phase, toSlot]);

  useEffect(() => {
    if (phase !== 'closing') return;
    const fly = flyRef.current, card = cardRef.current, veil = veilRef.current;
    setSpell('fading');

    const done = () => {
      setPhase('closed');
      setSpell('off');
      busy.current = false;
      returnFocus.current = true;
    };
    if (reduced()) { done(); return; }

    card.animate(
      [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }],
      { duration: 480, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' },
    ).finished.then(() => {
      veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-in', fill: 'both' });
      return fly.animate(
        [{ transform: 'none' }, { transform: toSlot() }],
        { duration: 480, easing: 'cubic-bezier(0.55, 0, 0.75, 0.2)', fill: 'both' },
      ).finished;
    }).then(done).catch(() => {});
  }, [phase, toSlot]);

  // Пока карта раскрыта: страница не прокручивается, Esc закрывает,
  // фокус на кнопке закрытия.
  const shown = phase !== 'closed';
  useEffect(() => {
    if (!shown) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [shown, close]);

  // Фокус: на «Close», когда карта раскрылась, и обратно на маленькую,
  // когда закрылась. Обратно — только после перерисовки: до неё
  // маленькая ещё скрыта (visibility) и фокус не принимает.
  useEffect(() => {
    // Глаза меряются один раз и кешируются; карта только что
    // перелетела — старые прямоугольники уже неверны.
    remeasureGaze();
    if (phase === 'open') {
      // Фокус всё равно уводим внутрь окна (так положено модальному
      // окну), но после касания — на само окно, без рамки.
      (byKeyboard.current ? closeRef.current : dialogRef.current)
        ?.focus({ preventScroll: true });
    }
    if (phase === 'closed' && returnFocus.current) {
      returnFocus.current = false;
      if (byKeyboard.current) slotRef.current?.focus({ preventScroll: true });
      else document.activeElement?.blur?.();
    }
  }, [phase]);

  // Большие картинки — заранее, как только к карте потянулись,
  // чтобы на перевороте не было пустой рамки.
  const preload = () => {
    for (const src of [FRONT, BACK, EYE]) { const i = new Image(); i.src = src; }
  };

  return (
    <>
      <button
        ref={slotRef}
        type="button"
        className={`${styles.slot} ${shown ? styles.slotAway : ''}`}
        onClick={open}
        onPointerEnter={preload}
        onFocus={preload}
        aria-haspopup="dialog"
        aria-label="Draw a fortune card"
      >
        <span className={styles.slotCard}>
          <CardEye />
          <img className={styles.lids} src="/art/fortune/card-front-lids-sm.webp" alt="" width="300" height="496" draggable="false" />
        </span>
      </button>

      {shown && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Your fortune"
          onClick={close}
        >
          <div ref={veilRef} className={styles.veil} aria-hidden="true">
            {spell !== 'off' && <SkyStars />}
          </div>

          <div
            ref={flyRef}
            className={`${styles.fly} ${spell === 'fading' ? styles.spellFading : ''}`}
          >
            {spell !== 'off' && <SpellBehind />}
            <div ref={cardRef} className={styles.card}>
              <div className={`${styles.face} ${styles.front}`}>
                <CardEye />
                <img className={styles.lids} src={FRONT} alt="" draggable="false" />
              </div>
              <div className={`${styles.face} ${styles.back}`}>
                <img src={BACK} alt="" draggable="false" />
                <div className={styles.text}>
                  <span className={styles.label}>{FORTUNE.label}</span>
                  <p className={styles.fortune}>{FORTUNE.text}</p>
                </div>
              </div>
            </div>

            {spell !== 'off' && <span className={styles.flash} aria-hidden="true" />}

            {/* Крестик в правом верхнем углу карты. Внутри .fly, а не
                .card: летит вместе с картой, но не переворачивается. */}
            <button
              ref={closeRef}
              type="button"
              className={`${styles.close} ${phase === 'open' ? styles.closeShown : ''}`}
              onClick={close}
              aria-label="Close"
            >
              {/* Крестик как на рисунке Риты: чёрная тушь с белой
                  обводкой — так обведены когти-ресницы на карте. */}
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17" stroke="#FFF6EA" strokeWidth="5.6" strokeLinecap="round" />
                <path d="M7 7l10 10M17 7L7 17" stroke="#1A1210" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
