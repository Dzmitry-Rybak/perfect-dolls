import { useRef, useState } from 'react';
import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getWorks, getSquidModels } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { BASE_PRICE } from '../data/squidBuilder.js';
import { EMAIL } from '../data/site.js';
import { useCommission } from '../context/CommissionContext.jsx';
import styles from './Section.module.css';
import flip from '../components/gallery/GalleryCard.module.css';

/* Четыре работы из архива — та же витрина, что у кукол и портретов.
   Раньше здесь был один сквид сбоку от заголовка, и страница про
   сквидов оказывалась единственной, где их почти не видно.
   Состав и порядок задаются в админке («Страницы разделов»);
   ничего не выбрано — берутся первые по полю «Порядок в галерее». */
const SHOWN = 4;

/* Описание раздела — пятью абзацами: вопрос, из чего сделано,
   что приезжает в коробке, подпись и доставка. Одним куском это
   читалось бы как инструкция. Доставка — как цены у портретов:
   последним абзацем, суммы розовым; оговорка под ней мельче. */
const LEAD = [
  'What if you could bring a creature that exists nowhere else to life?',
  'Each squid is made entirely by hand, with lots of care put into every little '
  + 'detail. I use soft faux fur to make them extra cuddly, and even the buttons '
  + 'are cast from liquid plastic and hand-painted by me.',
  'Every squid comes with a few little extras: custom stickers, tags, an envelope '
  + 'with a postcard, and other tiny surprises. For custom squids, you can even '
  + 'colour in the postcard yourself to match the little creature you created.',
  'Made slowly, by hand, and packed with love.',
  <>
    Squid Shipping:<br />
    Europe &amp; UK: <span className={styles.price}>~$20</span>
    {' · '}Canada &amp; Australia: <span className={styles.price}>~$30</span>
    {' · '}USA: <span className={styles.price}>~$40</span> (import duties included)
    <span className={styles.priceNote}>
      Rates may vary slightly by squid size. I’ll let you know in advance if anything changes.
    </span>
  </>,
];

const FACTS = [
  ['Standard size', '~75 cm / 30 in'],
  ['XL size',       '~1 m / 40 in'],
  ['Starts at',     `$${BASE_PRICE}`],
  ['Made in',       '2–4 weeks'],
];

/* Цены на сквидов везде в долларах — и в конструкторе, и в фактах выше. */
const usd = (n) => `$${n}`;

/**
 * Карточка готовой модели.
 *
 * Снимки (до трёх) листаются прямо в карточке — стрелками, точками и
 * свайпом, как в галерее; стрелки, точки и счётчик взяты оттуда же,
 * чтобы листалка на сайте была одна.
 *
 * Нажатие на карточку — заказ этой модели, а не просмотр крупно: за
 * этим сюда и приходят. Открывается та же анкета, что у кукол и
 * портретов, с уже вписанным именем сквида.
 *
 * Кнопка заказа растянута на всю карточку невидимым слоем, а стрелки
 * и точки лежат над ней — иначе листание открывало бы заказ.
 */
function ModelCard({ model, onOrder }) {
  const [i, setI] = useState(0);
  const touchX = useRef(null);
  /* Свайп не должен засчитываться нажатием: после него браузер может
     прислать click, и вместо следующего кадра открылся бы заказ. */
  const swiped = useRef(false);
  const shots = model.photos;
  const many = shots.length > 1;
  const shot = shots[i];

  const go = (d) => setI((v) => (v + d + shots.length) % shots.length);

  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (many && Math.abs(dx) > 40) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  const order = () => {
    if (swiped.current) { swiped.current = false; return; }
    onOrder(model);
  };

  return (
    <StitchCard seed={model.id} tilt={false} interactive className={styles.model}>
      <div className={styles.modelShot}>
        {/* Пока снимков нет — рамка той же формы, чтобы сетка не
            переехала, когда они появятся. */}
        {shot ? (
          <Photo
            key={i}
            src={shot.src}
            srcSet={shot.srcSet}
            sizes={shot.sizes}
            alt={many
              ? `${shot.alt || model.name}. Photo ${i + 1} of ${shots.length}`
              : shot.alt || model.name}
          />
        ) : (
          <ButtonEye size={26} holes={2} color="var(--fog)" />
        )}

        {many && (
          <>
            <button type="button" className={`${flip.arrow} ${flip.prev} ${styles.modelArrow}`} onClick={() => go(-1)}>
              <span className="visually-hidden">Previous photo of {model.name}</span>
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className={`${flip.arrow} ${flip.next} ${styles.modelArrow}`} onClick={() => go(1)}>
              <span className="visually-hidden">Next photo of {model.name}</span>
              <span aria-hidden="true">›</span>
            </button>
            <div className={flip.dots} role="tablist" aria-label={`Photos of ${model.name}`}>
              {shots.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Photo ${n + 1}`}
                  className={`${flip.dot} ${n === i ? flip.dotOn : ''}`}
                  onClick={() => setI(n)}
                />
              ))}
            </div>
            <span className={flip.count}>{i + 1}/{shots.length}</span>
          </>
        )}
      </div>

      <div className={styles.modelBody}>
        <p className={styles.modelName}>{model.name}</p>
        <p className={styles.modelFrom}>{model.collection}</p>
        <p className={styles.modelPrice}>
          {usd(model.price)}
          <span className={styles.modelCta} aria-hidden="true">order →</span>
        </p>
      </div>

      <button
        type="button"
        className={styles.modelOrder}
        onClick={order}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={onTouchEnd}
      >
        <span className="visually-hidden">Order {model.name}, {usd(model.price)}</span>
      </button>
    </StitchCard>
  );
}

export default function Squids() {
  const { data, loading } = useAsync(() => getWorks('squid', SHOWN), []);
  const models = useAsync(() => getSquidModels(), []);
  const { open } = useCommission();
  /* Заказ готовой модели: имя и цена уходят в анкету готовыми. */
  const orderModel = (m) => open({ kind: 'squid', values: { model: m.name, price: m.price } });

  return (
    <PageShell
      eyebrow="Plush squids"
      title="Squids"
      lead={LEAD}
      wideLead
    >
      <section className={`${styles.cta} ${styles.ctaFirst}`}>
        <div className={styles.ctaPaper} aria-hidden="true" />
        {/* Цифры переехали сюда из колонки сбоку: размеры и цена нужны
            ровно там, где принимают решение открыть конструктор. */}
        <div className={styles.ctaGrid}>
          <div className={styles.ctaBody}>
            <p className={styles.scribble}>make it yours</p>
            <h2>Open the builder</h2>
            <p className={`prose ${styles.ctaLead}`}>
              Tap the parts, choose the fur, paint the button, and add your favourite details.
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
          Eight standard-size designs from my mini collections.
        </p>

        {models.loading ? <Loader label="Getting them off the shelf…" /> : (
          <ul className={styles.models}>
            {models.data.map((m) => (
              <li key={m.id}>
                <ModelCard model={m} onOrder={orderModel} />
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
    </PageShell>
  );
}
