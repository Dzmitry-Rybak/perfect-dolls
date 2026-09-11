import { useLocation } from 'react-router-dom';
import { SLOTS, FEATURES, BUTTONS, GAIN, offsetFor } from '../../data/backdrop.js';
import styles from './Backdrop.module.css';

/**
 * Фоновая графика из набора Риты: пуговицы, ключ с черепом, кот,
 * двери, паутина, лоскуты.
 *
 * Слой фиксированный — элементы видны всегда, иначе на длинной
 * странице их пришлось бы плодить десятками.
 *
 * Геометрия и пороги видимости описаны в data/backdrop.js.
 */
export default function Backdrop() {
  const { pathname } = useLocation();
  // Ярусы тасуются отдельно, иначе сюжетные вещи попадают
  // в мелкие слоты и пропадают
  const fShift = offsetFor(pathname, FEATURES.length);
  const bShift = offsetFor(pathname, BUTTONS.length);
  let fi = 0, bi = 0;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {SLOTS.map((s, i) => {
        const name = s.t === 'f'
          ? FEATURES[(fi++ + fShift) % FEATURES.length]
          : BUTTONS[(bi++ + bShift) % BUTTONS.length];

        const cls = [styles.el];
        if (s.kind === 'side')   cls.push(s.side === 'l' ? styles.left : styles.right);
        if (s.kind === 'corner') cls.push(styles.corner, styles[`c_${s.at}`]);
        if (s.kind === 'band')   cls.push(styles.band);
        if (s.kind === 'free')   cls.push(styles.free);

        return (
          <img
            key={`${pathname}-${i}`}
            src={`/art/el/${name}.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            className={cls.join(' ')}
            data-min={s.min}
            data-mob={s.mob ? 1 : undefined}
            style={{
              '--y': `${s.y ?? 0}%`,
              '--x': `${s.x ?? 0}%`,
              '--px': s.px ?? 0,
              '--k': s.k ?? 0,
              '--vmin': `${s.vmin ?? 10}vmin`,
              '--vw': `${s.vw ?? 6}vw`,
              '--ox': `${s.ox ?? 0}%`,
              '--oy': `${s.oy ?? 0}%`,
              // Поправка на собственную яркость элемента — см. GAIN
              '--op': (s.op * (GAIN[name] ?? 1)).toFixed(3),
              '--rot': `${s.rot}deg`,
              '--blur': s.blur ? `${s.blur}px` : '0px',
              // Разная длительность и фаза: иначе весь фон качается
              // синхронно и читается как один общий сдвиг
              '--dur': `${18 + (i % 7) * 4}s`,
              '--delay': `${-(i * 2.3).toFixed(1)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
