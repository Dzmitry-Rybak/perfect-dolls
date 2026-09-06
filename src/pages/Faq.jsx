import PageShell from '../components/layout/PageShell.jsx';
import Loader from '../components/ui/Loader.jsx';
import Button from '../components/ui/Button.jsx';
import { getFaq } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Faq.module.css';

export default function Faq() {
  const { data: items, loading } = useAsync(() => getFaq(), []);

  return (
    <PageShell
      eyebrow="Вопросы"
      title="То, что спрашивают чаще всего"
      lead="Если ответа здесь нет — напишите, отвечаю обычно в тот же день."
    >
      {loading ? <Loader label="Вспоминаю ответы…" /> : (
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
                <p className={`prose ${styles.a}`}>{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.contact}>
        <h2 className={styles.contactTitle}>Остались вопросы?</h2>
        <p className={`prose ${styles.contactText}`}>
          Про сроки, ткани, доставку или конкретную идею — пишите напрямую.
        </p>
        <Button href="mailto:hello@ritadolls.example">Написать письмо</Button>
      </div>
    </PageShell>
  );
}
