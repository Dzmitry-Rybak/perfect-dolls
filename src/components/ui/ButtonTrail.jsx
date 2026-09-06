import { useEffect, useRef } from 'react';
import styles from './ButtonTrail.module.css';

/**
 * След из пуговиц за курсором.
 *
 * Пуговицы «роняются» вдоль пути, чуть проседают вниз, поворачиваются
 * и гаснут — как будто просыпались из коробки. Это тот же мотив,
 * что и глаза кукол, поэтому эффект читается как часть мастерской,
 * а не как посторонний курсор-трейл.
 *
 * Отключается сам: при prefers-reduced-motion и на устройствах без
 * точного указателя (тач — там курсора нет, эффекту неоткуда взяться).
 */

const COLORS = [
  '#FF96C9', // розовый бренда
  '#FFD3E2', // нежно-розовый
  '#E8C46A', // луна
  '#C9BFD6', // сирень
  '#A5677E', // слива
  '#EDE6DC', // кость
  '#8FB3AE', // призрачный сине-зелёный из акварелей
];

const POOL = 22;        // переиспользуемых элементов
const MIN_DIST = 26;    // px пути между появлениями
const LIFE = [1320, 1750];   // +0.5 c — след держится дольше

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/** Пуговица тем же языком, что ButtonEye: круг, штриховка по краю, дырки. */
function makeButton() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add(styles.btn);

  const disc = document.createElementNS(NS, 'circle');
  disc.setAttribute('cx', '12'); disc.setAttribute('cy', '12'); disc.setAttribute('r', '10.5');

  const rim = document.createElementNS(NS, 'circle');
  rim.setAttribute('cx', '12'); rim.setAttribute('cy', '12'); rim.setAttribute('r', '10.5');
  rim.setAttribute('fill', 'none');
  rim.setAttribute('stroke', '#0E0D10');
  rim.setAttribute('stroke-width', '1');
  rim.setAttribute('stroke-dasharray', '1.6 2');
  rim.setAttribute('opacity', '0.45');

  const holes = document.createElementNS(NS, 'g');
  holes.setAttribute('fill', '#0E0D10');
  for (const [cx, cy] of [[8.6, 9.2], [15.4, 9.2], [8.6, 14.8], [15.4, 14.8]]) {
    const h = document.createElementNS(NS, 'circle');
    h.setAttribute('cx', cx); h.setAttribute('cy', cy); h.setAttribute('r', '1.8');
    holes.appendChild(h);
  }

  // Нитка крест-накрест — видна только на крупных пуговицах,
  // на мелких превращается в грязь
  const thread = document.createElementNS(NS, 'path');
  thread.setAttribute('d', 'M8.6 9.2 15.4 14.8M15.4 9.2 8.6 14.8');
  thread.setAttribute('stroke', '#0E0D10');
  thread.setAttribute('stroke-width', '1.6');
  thread.setAttribute('stroke-linecap', 'round');

  svg.append(disc, rim, holes, thread);
  return { svg, disc, thread };
}

export default function ButtonTrail() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    if (calm.matches || !fine.matches) return;

    const pool = Array.from({ length: POOL }, () => {
      const b = makeButton();
      host.appendChild(b.svg);
      return { ...b, anim: null };
    });

    let cursor = 0;
    let lastX = null, lastY = null;

    const drop = (x, y) => {
      const item = pool[cursor];
      cursor = (cursor + 1) % POOL;

      // Элемент мог не догореть с прошлого раза — переиспользуем сразу
      item.anim?.cancel();

      const size = rand(11, 21);
      const half = size / 2;
      item.svg.setAttribute('width', size);
      item.svg.setAttribute('height', size);
      item.disc.setAttribute('fill', pick(COLORS));
      item.thread.setAttribute('opacity', size > 15 ? '1' : '0');

      const r0 = rand(-40, 40);
      const dx = rand(-9, 9);          // лёгкий снос вбок
      const dy = rand(16, 30);         // проседание вниз — пуговица падает
      const life = rand(LIFE[0], LIFE[1]);

      item.anim = item.svg.animate(
        [
          { transform: `translate3d(${x - half}px, ${y - half}px, 0) rotate(${r0}deg) scale(0.35)`,
            opacity: 0 },
          { transform: `translate3d(${x - half}px, ${y - half + 2}px, 0) rotate(${r0 + 6}deg) scale(1)`,
            opacity: 1, offset: 0.16 },
          { transform: `translate3d(${x - half + dx}px, ${y - half + dy}px, 0) rotate(${r0 + rand(30, 90)}deg) scale(0.5)`,
            opacity: 0 },
        ],
        { duration: life, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
      );
    };

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      if (lastX === null) { lastX = x; lastY = y; return; }
      if (Math.hypot(x - lastX, y - lastY) < MIN_DIST) return;
      lastX = x; lastY = y;
      drop(x, y);
    };

    // Курсор мог уйти за пределы окна — не тянем нитку через всю страницу
    const onLeave = () => { lastX = null; lastY = null; };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      pool.forEach((p) => { p.anim?.cancel(); p.svg.remove(); });
    };
  }, []);

  return <div ref={hostRef} className={styles.host} aria-hidden="true" />;
}
