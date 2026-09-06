import Spiral from '../ui/Spiral.jsx';
import styles from './PageShell.module.css';

export default function PageShell({ eyebrow, title, lead, children, wide = false }) {
  return (
    <div className={`page ${styles.shell} ${wide ? styles.wide : ''}`}>
      <header className={styles.head}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={`prose ${styles.lead}`}>{lead}</p>}
        <Spiral size={40} className={styles.spiral} />
      </header>
      {children}
    </div>
  );
}
