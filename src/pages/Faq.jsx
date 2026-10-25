import PageShell from '../components/layout/PageShell.jsx';
import Loader from '../components/ui/Loader.jsx';
import Button from '../components/ui/Button.jsx';
import { getFaq } from '../lib/api.js';
import { EMAIL } from '../data/site.js';
import useAsync from '../lib/useAsync.js';
import styles from './Faq.module.css';

export default function Faq() {
  const { data: items, loading } = useAsync(() => getFaq(), []);

  return (
    <PageShell
      eyebrow="Questions"
      title="Things people ask"
      spiral={false}
    >
      {loading ? <Loader label="Digging out the answers…" /> : (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <li key={item.q}>
              {/* <details> вместо самописного аккордеона: работает
                  с клавиатурой и поиском по странице из коробки */}
              <details className={styles.item} open={i === 0}>
                <summary className={styles.q}>
                  <span>{item.q}</span>
                  <span className={styles.marker} aria-hidden="true" />
                </summary>
                {/* Ответ — список абзацев. Строка это обычный абзац,
                    пара { label, text } — абзац с подписью: так
                    разделён ответ про уход, где у кукол и сквидов
                    разные правила. */}
                <div className={`prose ${styles.a}`}>
                  {item.a.map((part, n) =>
                    (typeof part === 'string' ? (
                      <p key={n}>{part}</p>
                    ) : (
                      <p key={n}>
                        <b className={styles.aLabel}>{part.label}:</b> {part.text}
                      </p>
                    )))}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.contact}>
        <h2 className={styles.contactTitle}>Still wondering?</h2>
        <p className={`prose ${styles.contactText}`}>
          Timings, fabrics, shipping, or one specific idea — write to me directly.
          Doll questions go to the first address, everything else to the second.
        </p>
        <div className={styles.mails}>
          <Button href={`mailto:${EMAIL.dolls}`} variant="stitched">Dolls · {EMAIL.dolls}</Button>
          <Button href={`mailto:${EMAIL.main}`}>Everything else · {EMAIL.main}</Button>
        </div>
      </div>
    </PageShell>
  );
}
