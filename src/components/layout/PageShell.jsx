import Spiral from '../ui/Spiral.jsx';
import styles from './PageShell.module.css';

/**
 * Шапка раздела. `aside` кладётся СПРАВА от заголовка с подводкой —
 * так окно заказа видно сразу, не пролистывая страницу.
 */
export default function PageShell({ eyebrow, title, lead, aside, children, wide = false }) {
  return (
    <div className={`page ${styles.shell} ${wide ? styles.wide : ''}`}>
      <header className={`${styles.head} ${aside ? styles.split : ''}`}>
        <div className={styles.headText}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={`prose ${styles.lead}`}>{lead}</p>}
          <Spiral size={40} className={styles.spiral} />
        </div>
        {aside && <div className={styles.headAside}>{aside}</div>}
      </header>
      {children}
    </div>
  );
}
