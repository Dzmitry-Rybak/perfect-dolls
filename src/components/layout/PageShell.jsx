import Spiral from '../ui/Spiral.jsx';
import styles from './PageShell.module.css';

/**
 * Шапка раздела. `aside` кладётся СПРАВА от заголовка с подводкой —
 * так окно заказа видно сразу, не пролистывая страницу.
 *
 * `lead` — строка или список строк. Список нужен там, где описание
 * не укладывается в одну мысль (сквиды): абзацы разделяются здесь,
 * а не переносами внутри одного предложения.
 *
 * `wideLead` снимает ограничение на длину строки и пускает описание
 * во всю ширину страницы. По умолчанию его нет намеренно: длинная
 * строка читается хуже, глаз теряет начало следующей. Включается
 * там, где так попросили.
 */
export default function PageShell({
  eyebrow, title, lead, aside, children, wide = false, wideLead = false,
}) {
  return (
    <div className={`page ${styles.shell} ${wide ? styles.wide : ''}`}>
      <header className={[styles.head, aside && styles.split, wideLead && styles.headFull]
        .filter(Boolean).join(' ')}>
        <div className={styles.headText}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lead && (Array.isArray(lead) ? lead : [lead]).map((line, i) => (
            <p key={i} className={`prose ${styles.lead}`}>{line}</p>
          ))}
          <Spiral size={40} className={styles.spiral} />
        </div>
        {aside && <div className={styles.headAside}>{aside}</div>}
      </header>
      {children}
    </div>
  );
}
