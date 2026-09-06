import styles from './ButtonEye.module.css';

/**
 * Глаз-пуговица — сквозной мотив: маркеры списков, чекбоксы,
 * спиннер, декор. Мигает при наведении на родителя.
 */
export default function ButtonEye({ size = 20, color = 'var(--rose)', holes = 4, className = '' }) {
  return (
    <svg
      className={`${styles.eye} ${className}`}
      width={size} height={size} viewBox="0 0 24 24"
      aria-hidden="true" focusable="false"
    >
      <circle cx="12" cy="12" r="10.5" fill={color} />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--ink)"
              strokeWidth="1" strokeDasharray="1.6 2" opacity=".45" />
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
      {/* Веко для моргания */}
      <circle className={styles.lid} cx="12" cy="12" r="10.5" fill="var(--ink-raised)" />
    </svg>
  );
}
