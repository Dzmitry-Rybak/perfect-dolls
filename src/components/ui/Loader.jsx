import Spiral from './Spiral.jsx';
import styles from './Loader.module.css';

export default function Loader({ label = 'Достаю из мастерской…' }) {
  return (
    <div className={styles.wrap} role="status">
      <Spiral size={44} spin color="var(--rose)" />
      <p className={styles.label}>{label}</p>
    </div>
  );
}
