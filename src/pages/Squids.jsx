import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import { BASE_PRICE } from '../data/squidBuilder.js';
import { EMAIL } from '../data/site.js';
import styles from './Section.module.css';

const FACTS = [
  ['Standard size', '~75 cm / 30 in'],
  ['XL size',       '~1 m / 40 in, +$30'],
  ['Starts at',     `$${BASE_PRICE}`],
  ['Made in',       '2–4 weeks'],
];

export default function Squids() {
  return (
    <PageShell
      eyebrow="Plush squids"
      title="Squids"
      lead="Soft, heavy, slightly unsettling — a round head with cat ears, a button sewn where a face should be, and seven tentacles. They sit in armchairs and stare."
    >
      <section className={styles.cta}>
        <div className={styles.ctaPaper} aria-hidden="true" />
        {/* Цифры переехали сюда из колонки сбоку: размеры и цена нужны
            ровно там, где принимают решение открыть конструктор. */}
        <div className={styles.ctaGrid}>
          <div className={styles.ctaBody}>
            <p className={styles.scribble}>make it yours</p>
            <h2>Open the builder</h2>
            <p className={`prose ${styles.ctaLead}`}>
              Tap the parts, choose the fur, paint the button. The price updates
              as you go, and you can send the whole thing to me in one click.
            </p>
            <div className={styles.ctaActions}>
              <Button to="/builder" size="lg">Build your squid</Button>
              <a href={`mailto:${EMAIL.main}`} className={styles.mail}>
                or just email me →
              </a>
            </div>
          </div>

          <dl className={styles.facts}>
            {FACTS.map(([k, v]) => (
              <div key={k} className={styles.fact}>
                <dt>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <p className={`${styles.footNote} eye-host`}>
        <ButtonEye size={14} holes={2} color="var(--plum)" />
        Squid orders are open all year — they're built, not batched.
      </p>
    </PageShell>
  );
}
