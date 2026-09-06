import styles from './StitchCard.module.css';
import { tiltFor } from '../../lib/format.js';

/**
 * Карточка с рамкой-беговым-стежком. Висит с лёгким наклоном
 * (как приколотая фотография) и выравнивается при наведении.
 * Наклон детерминирован по seed — не прыгает между рендерами.
 */
export default function StitchCard({
  as: Tag = 'div', seed = '', tilt = true, interactive = false,
  className = '', style, children, ...rest
}) {
  const angle = tilt ? tiltFor(seed) : 0;
  return (
    <Tag
      className={[styles.card, interactive && styles.interactive, className]
        .filter(Boolean).join(' ')}
      style={{ '--tilt': `${angle}deg`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
