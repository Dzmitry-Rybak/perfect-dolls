import { useState } from 'react';
import PageShell from '../components/layout/PageShell.jsx';
import GalleryLightbox from '../components/gallery/GalleryLightbox.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getWorks, getSquidModels } from '../lib/api.js';
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

/* Описание раздела — четырьмя абзацами: вопрос, из чего сделано,
   что приезжает в коробке и подпись в конце. Одним куском это
   читалось бы как инструкция. */
const LEAD = [
  'What if you could bring a creature that exists nowhere else to life?',
  'Each squid is made entirely by hand, with lots of care put into every little '
  + 'detail. I use soft faux fur to make them extra cuddly, and even the buttons '
  + 'are cast from liquid plastic and hand-painted by me.',
  'Every squid comes with a few little extras: custom stickers, tags, an envelope '
  + 'with a postcard, and other tiny surprises. For custom squids, you can even '
  + 'colour in the postcard yourself to match the little creature you created.',
  'Made slowly, by hand, and packed with love.',
];

const FACTS = [
  ['Standard size', '~75 cm / 30 in'],
  ['XL size',       '~1 m / 40 in, +$30'],
  ['Starts at',     `$${BASE_PRICE}`],
  ['Made in',       '2–4 weeks'],
];

/* Цены на сквидов везде в долларах — и в конструкторе, и в фактах выше. */
const usd = (n) => `$${n}`;

export default function Squids() {
  const { data, loading } = useAsync(() => getWorks('squid', SHOWN), []);
  const models = useAsync(() => getSquidModels(), []);
  /* Какую модель рассматривают. Окно то же, что у архива: ему нужна
     работа со списком кадров, а у модели кадр один — заворачиваем. */
  const [shown, setShown] = useState(null);

  return (
    <PageShell
      eyebrow="Plush squids"
      title="Squids"
      lead={LEAD}
      wideLead
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

      {/* Готовые дизайны — между конструктором и архивом намеренно:
          сначала «собери своего», потом «или возьми готового», и только
          потом работы, которых уже не купить. */}
      <section>
        <h2 className={styles.gridTitle}>Ready-made designs</h2>
        <p className={`prose ${styles.modelsLead}`}>
          Eight squids I sew again — same design every time, standard size.
          Pick one as it is, or open the builder and change it.
        </p>

        {models.loading ? <Loader label="Getting them off the shelf…" /> : (
          <ul className={styles.models}>
            {models.data.map((m) => (
              <li key={m.id}>
                <StitchCard seed={m.id} tilt={false} className={styles.model}>
                  {/* Кнопка — сам снимок, а не вся карточка: внутри
                      карточки лежат абзацы, а абзац внутри кнопки —
                      недопустимая вложенность. Да и смысл тот же:
                      нажимают на картинку, чтобы разглядеть её.
                      Пока снимка нет — рамка той же формы, чтобы сетка
                      не переехала, когда он появится, и не кнопка:
                      открывать нечего. */}
                  {m.photo ? (
                    <button
                      type="button"
                      className={`${styles.modelShot} ${styles.modelOpen}`}
                      onClick={() => setShown(m)}
                      aria-label={`Look closer at ${m.name}`}
                    >
                      <Photo
                        src={m.photo.src}
                        srcSet={m.photo.srcSet}
                        sizes={m.photo.sizes}
                        alt={m.photo.alt || m.name}
                      />
                    </button>
                  ) : (
                    <div className={styles.modelShot}>
                      <ButtonEye size={26} holes={2} color="var(--fog)" />
                    </div>
                  )}
                  <div className={styles.modelBody}>
                    <p className={styles.modelName}>{m.name}</p>
                    <p className={styles.modelFrom}>{m.collection}</p>
                    <p className={styles.modelPrice}>{usd(m.price)}</p>
                  </div>
                </StitchCard>
              </li>
            ))}
          </ul>
        )}
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
      {shown && (
        <GalleryLightbox
          item={{
            title: shown.name,
            note: [shown.collection, usd(shown.price)].filter(Boolean).join(' · '),
            shots: [shown.photo],
          }}
          onClose={() => setShown(null)}
        />
      )}
    </PageShell>
  );
}
