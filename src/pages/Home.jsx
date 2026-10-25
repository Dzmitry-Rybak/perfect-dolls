import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import SectionCard from '../components/home/SectionCard.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import PriceTag from '../components/ui/PriceTag.jsx';
import Photo from '../components/ui/Photo.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getHome } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { SECTIONS } from '../data/nav.js';
import { EMAIL, SOCIAL } from '../data/site.js';
import styles from './Home.module.css';

/**
 * Полка готовых вещей: то, что можно забрать сразу, без анкеты и
 * ожидания. Обычно пуста — почти всё разбирают до того, как дошито.
 *
 * Содержимое приезжает из админки, раздел «В наличии»: снимок,
 * название, что это, цена и строчка о том, почему вещь свободна.
 * Продали — Маргарита удаляет запись, и полка сама возвращает
 * приписку вместо карточек. В коде списка больше нет: держать
 * рядом два источника значило бы, что однажды они разойдутся.
 */

/**
 * Наклоны приколотых вещей. Заданы списком, а не случайно: список
 * видно целиком, и соседние карточки не сваливаются в одну сторону.
 */
const TILTS = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2];

/** Вещей на одной странице полки на телефоне: одна колонка, две строки. */
const PER_PAGE = 2;

/** Разбить список на куски по size. */
const chunk = (list, size) => Array.from(
  { length: Math.ceil(list.length / size) },
  (_, i) => list.slice(i * size, i * size + size),
);

/** Узкий экран (телефон) — тот же порог, что у сетки полки в стилях. */
function usePhone() {
  const query = '(max-width: 559px)';
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

/* Снимки для «проданных» мест — прошлые работы, уменьшенные копии с
   главной. Размыты и приглушены: это намёк, что здесь уже висело и
   ушло, а не витрина. */
const SOLD_SHOTS = [
  '/art/home/squids-a.jpg', '/art/home/dolls-b.jpg',
  '/art/home/squids-b.jpg', '/art/home/dolls-a.jpg',
];

/**
 * Сколько колонок сейчас у полки — чтобы досыпать первый ряд пустыми
 * местами. Колонок столько, сколько влезает (auto-fill), а сколько
 * влезло, знает только браузер: читаем готовую раскладку и следим за
 * шириной.
 */
function useColumns() {
  const ref = useRef(null);
  const [cols, setCols] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setCols(getComputedStyle(el).gridTemplateColumns.split(' ').length);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  });
  return [ref, cols];
}

export default function Home() {
  /* Картинки главной и полка — одним запросом, см. getHome(). */
  const { data, loading } = useAsync(getHome, []);
  const hero = data?.hero;
  const available = data?.available ?? [];
  /* Пустые места на полке. Одна-две вещи на листе во всю ширину
     оставляли пустую бумагу, и полка выглядела недоделанной. Первый
     ряд досыпаем «проданными» карточками: размытый снимок прошлой
     работы и штамп SOLD — видно, что здесь висело и его забрали, и
     следующее появится здесь же.
     Только до конца первого ряда: целый ряд пустых мест был бы уже не
     намёком, а складом. */
  const [shelfRef, cols] = useColumns();
  /* На телефоне полка — одна колонка, по две вещи на странице друг под
     другом; «проданное» добавляем только к одной-единственной вещи,
     чтобы страница не была наполовину пустой. Вещей больше двух —
     страницы по две листаются вбок (carousel в стилях). */
  const phone = usePhone();
  const n = available.length;
  const spots = phone ? (n === 1 ? 1 : 0) : (n < cols ? cols - n : 0);
  const swipe = phone && n > PER_PAGE;

  /* Ячейки полки: вещи и «проданные» места после них. Отдельно от
     раскладки — та бывает сеткой или листающимися страницами. */
  const cells = [
    ...available.map((it, i) => (
      <li key={it.id} className={styles.pinned} style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}>
        <span className={styles.pin} aria-hidden="true" />
        <StitchCard seed={it.id} tilt={false} className={styles.shelfCard}>
          <Photo
            src={it.photo.src}
            srcSet={it.photo.srcSet}
            sizes={it.photo.sizes}
            alt={it.photo.alt || it.name}
          />
          <div className={styles.shelfBody}>
            {it.kind && <p className="eyebrow">{it.kind}</p>}
            <p className={styles.shelfName}>{it.name}</p>
            {it.note && <p className={styles.shelfNote}>{it.note}</p>}
            <div className={styles.shelfFoot}>
              <PriceTag value={it.price} size="sm" className={styles.tag} />
              <Button
                href={`mailto:${EMAIL.main}?subject=${encodeURIComponent(`Available now: ${it.name}`)}`}
                variant="stitched"
              >
                Ask about it
              </Button>
            </div>
          </div>
        </StitchCard>
      </li>
  )),
    ...Array.from({ length: spots }, (_, i) => (
      <li
        key={`sold-${i}`}
        className={`${styles.pinned} ${styles.sold}`}
        style={{ '--tilt': `${TILTS[(available.length + i) % TILTS.length]}deg` }}
        aria-hidden="true"
      >
        <span className={styles.pin} />
        <StitchCard seed={`sold-${i}`} tilt={false} className={styles.shelfCard}>
          <span className={styles.soldShot}>
            <img src={SOLD_SHOTS[i % SOLD_SHOTS.length]} alt="" loading="lazy" decoding="async" />
            <span className={styles.stamp}>Sold</span>
          </span>
          <div className={styles.shelfBody}>
            <p className="eyebrow">Found a home</p>
            <p className={styles.soldNext}>next one lands here ♡</p>
          </div>
        </StitchCard>
      </li>
  )),
  ];

  /* Снимки разделов из админки перекрывают вшитые в сборку. Берём
     карточку целиком, а не по полю: второй кадр без первого — это
     наплыв с одной работы на другую, и выглядел бы он как ошибка. */
  /* Карточка без снимка не показывается. Это «Other creations»: работ
     там пока нет, и вместо снимка стояла рисованная заглушка — пустой
     раздел, выставленный как полный. Появится снимок в админке
     («Главная») — карточка вернётся сама. */
  const sections = SECTIONS
    .map((s) => ({ ...s, ...(data?.cards[s.id] ?? {}) }))
    .filter((s) => s.photo);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.bleed} aria-hidden="true">
          <span className={styles.blobA} />
          <span className={styles.blobB} />
        </div>

        <div className={`page ${styles.heroInner}`}>
          <figure className={styles.avatar}>
            <span className={styles.tape} aria-hidden="true" />
            {/* Пока снимок едет — пустая рамка той же формы, а не
                рисованная кукла: подмена одного лица на другое прямо
                под носом читается хуже, чем секунда ожидания.
                Не выбран в админке — остаётся заглушка. */}
            {loading ? (
              <span className={styles.avatarWait} aria-hidden="true" />
            ) : hero ? (
              <Photo src={hero.src} srcSet={hero.srcSet} sizes={hero.sizes} alt={hero.alt || 'cutesmokey'} />
            ) : (
              <DollPortrait seed="cutesmokey" accent="#FF96C9" alt="cutesmokey" />
            )}
          </figure>

          <div className={styles.heroCopy}>
            {/* Надпись над заголовком убрана: фраза ниже говорит сама
                за себя, и подводка к ней только мешала. */}
            <h1 className={styles.title}>
              To be loved
              <span className={styles.and}>is</span>
              to be seen
            </h1>
            <p className={`prose ${styles.lead}`}>
              Hey, dolly! So happy to see you here. I’m Margarita, and I make
              dolls, plushies, and little creatures with my own two hands.
              I turn the things you love into something you can hold.
              Come on in ♡
            </p>
            {/* Обёртка — для правила по ширине самого блока (container):
                «Support my work» уходит на свою строку не только на
                телефоне, но и на планшете, где колонка текста узкая. */}
            <div className={styles.actionsWrap}>
            <div className={styles.actions}>
              <Button to="/builder" size="lg">Build a squid</Button>
              <Button to="/gallery" size="lg" variant="stitched">See past work</Button>
              {/* Не третья кнопка, а тихая ссылка рядом: донат —
                  не главное действие на странице, а возможность. */}
              <a className={styles.support} href={SOCIAL.coffee} target="_blank" rel="noreferrer noopener">
                Support my work
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`page ${styles.section}`}>
        <h2 className="visually-hidden">What I make</h2>
        <ul className={styles.grid}>
          {sections.map((s) => (
            <li key={s.id}><SectionCard section={s} /></li>
          ))}
        </ul>
      </section>

      <Spiral size={52} unwind className={styles.divider} />

      <section className={`page ${styles.section}`}>
        <div className={styles.availHead}>
          <div>
            <p className="eyebrow">Ready to go</p>
            <h2>Available now</h2>
          </div>
        </div>

        {/* Полка почти всегда пуста, поэтому ожидание показываем честно:
            без него пустая приписка успевала мелькнуть перед карточками. */}
        {loading ? <Loader label="Looking on the shelf…" /> : available.length > 0 ? (
          <div className={styles.board}>
            <span className={styles.boardMargin} aria-hidden="true" />
            {/* На телефоне вещей больше двух — страницы по две (одна
                колонка) листаются вбок целиком. */}
            {swipe ? (
              <ul className={styles.carousel} ref={shelfRef}>
                {chunk(cells, PER_PAGE).map((page, p) => (
                  <li key={p} className={styles.page}>
                    <ul className={styles.shelf}>{page}</ul>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.shelf} ref={shelfRef}>{cells}</ul>
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            <ButtonEye size={26} color="var(--fog)" />
            <p className={styles.emptyText}>
              Nothing on the shelf at the moment — everything I make is spoken
              for before it's finished. Now and then something lands here: a
              piece someone changed their mind about, or one I made just because.
            </p>
            <p className={styles.emptyHint}>
              Worth checking back, or say hello at{' '}
              <a href={`mailto:${EMAIL.main}`}>{EMAIL.main}</a>
            </p>
          </div>
        )}
      </section>

      <section className={`page ${styles.section}`}>
        <div className={styles.strip}>
          <div className={styles.stripPaper} aria-hidden="true" />
          <div className={styles.stripBody}>
            <p className={styles.scribble}>pick your colours</p>
            <h2 className={styles.stripTitle}>Build your own squid</h2>
            <p className={`prose ${styles.stripLead}`}>
              Tap the parts, choose the fur, paint the button, and add your favourite details.
            </p>
            <Button to="/builder" size="lg">Open the builder</Button>
          </div>
        </div>

        {/* Строчка про рекламу — последней на главной и нарочно мелкой.
            Отдельная страница для брендов есть и остаётся, но ссылка на
            неё живёт только в подвале, и бренды до неё не доходили.
            Здесь она попадается на глаза тому, кто дочитал страницу до
            конца, и при этом не мешает тем, кто пришёл за куклой. */}
        <p className={styles.commercial}>
          commercial enquiries:{' '}
          <a href={`mailto:${EMAIL.pr}`}>{EMAIL.pr}</a>
          {' · '}
          <Link to="/pr">more for brands</Link>
        </p>
      </section>
    </>
  );
}
