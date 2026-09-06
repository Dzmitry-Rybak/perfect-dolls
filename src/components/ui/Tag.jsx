import styles from './Tag.module.css';
import { STATUS } from '../../lib/format.js';

export function StatusTag({ status }) {
  const s = STATUS[status];
  if (!s) return null;
  return <span className={`${styles.tag} ${styles[s.tone]}`}>{s.label}</span>;
}

export default function Tag({ tone = 'neutral', children }) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}
