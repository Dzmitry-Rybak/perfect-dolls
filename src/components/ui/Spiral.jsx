import styles from './Spiral.module.css';

/**
 * Рисованная спираль — из двух работ Риты. Разделитель секций
 * и, в режиме spin, индикатор загрузки.
 *
 * `unwind` — спираль медленно поворачивается, пока страница проходит
 * мимо неё: не сама по себе, а ровно настолько, насколько её
 * прокрутили. Движение привязано к руке, а не к таймеру, поэтому не
 * отвлекает: остановился — остановилась и она.
 */
export default function Spiral({
  size = 48, spin = false, unwind = false,
  color = 'var(--plum)', className = '',
}) {
  return (
    <svg
      className={[styles.spiral, spin && styles.spin, unwind && styles.unwind, className]
        .filter(Boolean).join(' ')}
      width={size} height={size} viewBox="0 0 100 100"
      aria-hidden="true" focusable="false"
    >
      <path
        d="M50 50
           C50 44 56 42 60 45
           C66 49 66 58 59 63
           C50 69 38 65 33 55
           C27 42 34 27 47 21
           C63 14 81 23 88 39"
        fill="none" stroke={color} strokeWidth="3.2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
