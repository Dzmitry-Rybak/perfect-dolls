import { useEffect, useId, useRef } from 'react';
import { watchPointer } from '../../lib/gaze.js';
import styles from './ButtonEye.module.css';

/**
 * Глаз-пуговица — сквозной мотив: маркеры списков, чекбоксы,
 * спиннер, декор. Мигает при наведении на родителя — и сам по себе.
 *
 * ПОЧЕМУ САМ ПО СЕБЕ. Про кукол на этом сайте написано, что они
 * сидят в креслах и смотрят. Глаз, который моргает только когда его
 * трогают, — это кнопка; глаз, который моргнул, пока ты читаешь
 * соседнюю строчку, — это взгляд. Разница в одном правиле, а читается
 * совершенно иначе.
 *
 * Ритм у каждого свой и считается из его собственного идентификатора:
 * одинаковый период дал бы моргание строем, а случайное число при
 * каждой перерисовке сбивало бы его на полпути. Период 11–19 секунд,
 * само моргание — полторы сотые от него, около двухсот миллисекунд:
 * заметить можно, следить не за чем.
 *
 * И ГЛАЗ СЛЕДИТ ЗА КУРСОРОМ. Дырочки с ниткой сдвигаются в его
 * сторону — на единицу с небольшим при диаметре в двадцать одну,
 * то есть на грани заметного. Больше нельзя: пуговица пришита, и
 * если зрачки поедут по ней далеко, она перестанет быть пуговицей.
 * Общий слушатель на все глаза — см. lib/gaze.js.
 */
export default function ButtonEye({ size = 20, color = 'var(--rose)', holes = 4, className = '' }) {
  const id = useId();
  const n = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const beat = {
    '--eye-every': `${11 + (n % 9)}s`,
    '--eye-wait': `${(n * 7) % 13}s`,
  };

  /* Двигаем через ref, а не через состояние: перерисовывать дерево
     React на каждое движение мыши двадцать раз в секунду — то же
     самое, что не делать этого вовсе, только дороже. Здесь меняется
     один атрибут одного узла. */
  const svgRef = useRef(null);
  const pupilRef = useRef(null);

  useEffect(() => {
    const el = svgRef.current;
    const pupil = pupilRef.current;
    if (!el || !pupil) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const REACH = 1.15;   // в единицах viewBox, он здесь 24×24
    return watchPointer(el, (x, y) => {
      pupil.setAttribute(
        'transform',
        `translate(${(x * REACH).toFixed(2)} ${(y * REACH).toFixed(2)})`
      );
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`${styles.eye} ${className}`}
      style={beat}
      width={size} height={size} viewBox="0 0 24 24"
      aria-hidden="true" focusable="false"
    >
      <circle cx="12" cy="12" r="10.5" fill={color} />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--ink)"
              strokeWidth="1" strokeDasharray="1.6 2" opacity=".45" />
      {/* Дырочки и нитка — одной группой: они сдвигаются вместе,
          иначе нитка отстанет от своих дырок. */}
      <g ref={pupilRef} className={styles.pupil}>
        <g fill="var(--ink)">
          <circle cx="8.6" cy="9.2" r="1.7" />
          <circle cx="15.4" cy="9.2" r="1.7" />
          {holes === 4 && <><circle cx="8.6" cy="14.8" r="1.7" /><circle cx="15.4" cy="14.8" r="1.7" /></>}
        </g>
        <path
          className={styles.thread}
          d={holes === 4 ? 'M8.6 9.2 15.4 14.8M15.4 9.2 8.6 14.8' : 'M8.6 9.2 15.4 9.2'}
          stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round"
        />
      </g>
      {/* Веко для моргания */}
      <circle className={styles.lid} cx="12" cy="12" r="10.5" fill="var(--ink-raised)" />
    </svg>
  );
}
