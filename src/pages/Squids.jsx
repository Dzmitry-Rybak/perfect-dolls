import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getWorks } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { BASE_PRICE } from '../data/squidBuilder.js';
import { EMAIL } from '../data/site.js';
import styles from './Section.module.css';

/* Три работы из архива — та же витрина, что у кукол и портретов.
   Раньше здесь был один сквид сбоку от заголовка, и страница про
   сквидов оказывалась единственной, где их почти не видно.
   Состав и порядок задаются в админке («Страницы разделов»);
   ничего не выбрано — берутся первые три по полю «Порядок в галерее». */
const SHOWN = 3;

const FACTS = [
  ['Standard size', '~75 cm / 30 in'],
  ['XL size',       '~1 m / 40 in, +$30'],
  ['Starts at',     `$${BASE_PRICE}`],
  ['Made in',       '2–4 weeks'],
];

export default function Squids() {
  const { data, loading } = useAsync(() => getWorks('squid', SHOWN), []);

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

      <section>
        <h2 className={styles.gridTitle}>Squids that already found homes</h2>

        {loading ? <Loader label="Waking them up…" /> : (
          <>
            <ul className={styles.tiles}>
              {data.shown.map((w) => (
                <li key={w.id}>
                  <StitchCard seed={w.id} className={styles.tile}>
                    <Photo
                      src={w.shots[0].tile ?? w.shots[0].src}
                      srcSet={w.shots[0].tileSrcSet}
                      sizes={w.shots[0].tileSizes}
                      alt={w.shots[0].alt}
                    />
                    <p className={styles.tileName}>{w.title}</p>
                  </StitchCard>
                </li>
              ))}
            </ul>

            {/* Ссылку показываем, только если в архиве и правда осталось ещё. */}
            {data.total > SHOWN && (
              <div className={styles.more}>
                <Button to="/gallery?kind=squid" variant="stitched">See the rest →</Button>
              </div>
            )}
          </>
        )}
      </section>

      <p className={`${styles.footNote} eye-host`}>
        <ButtonEye size={14} holes={2} color="var(--plum)" />
        Squid orders are open all year — they're built, not batched.
      </p>
    </PageShell>
  );
}
