import styles from './PriceTag.module.css';
import { formatPrice } from '../../lib/format.js';

/** Бумажная бирка на нитке — как на настоящей кукле в мастерской. */
export default function PriceTag({ value, size = 'md', className = '' }) {
  return (
    <span className={`${styles.tag} ${styles[size]} ${className}`}>
      <span className={styles.hole} aria-hidden="true" />
      <span>{formatPrice(value)}</span>
    </span>
  );
}
