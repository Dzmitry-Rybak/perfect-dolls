import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import SectionCard from '../components/home/SectionCard.jsx';
import SquidCanvas from '../components/squid/SquidCanvas.jsx';
import { defaultBuild } from '../data/squidBuilder.js';
import { getHome } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { SECTIONS } from '../data/nav.js';
import { EMAIL, SOCIAL } from '../data/site.js';
import styles from './Home.module.css';

/** Цвета нетронутого сквида — те же, с которых начинается конструктор. */
const blankColor = (partId, group) => {
  if (group === 'button') return defaultBuild.button;
  if (group === 'thread') return defaultBuild.thread;
  return defaultBuild.fur[group] ?? defaultBuild.ribbonColor;
};

export default function Home() {
  /* Снимки карточек разделов из админки, см. getHome(). */
  const { data } = useAsync(getHome, []);

  /* Снимки разделов из админки перекрывают вшитые в сборку. Берём
     карточку целиком, а не по полю: второй кадр без первого — это
     наплыв с одной работы на другую, и выглядел бы он как ошибка. */
  /* Все разделы показываются всегда. Где снимка нет (пока «Other
     creations»), SectionCard рисует заглушку — до тех пор, пока
     снимок не загрузят в админке («Главная»). */
  const sections = SECTIONS
    .map((s) => ({ ...s, ...(data?.cards[s.id] ?? {}) }));

  return (
    <>
      <section className={styles.hero}>
        <div className={`page ${styles.heroInner}`}>
          {/* Аватар Риты — круглая наклейка на прозрачном фоне, поэтому
              без рамки и скотча: на листе она смотрелась бы вклеенной
              в чужую карточку. Обёртка срезает пустые прозрачные поля
              файла (он квадратный 2000×2000, сама наклейка уже). */}
          <figure className={styles.avatar}>
            <img
              src="/art/hero-doll.webp"
              alt="cutesmokey — doll with button eyes"
              width="2000"
              height="2000"
              decoding="async"
              fetchpriority="high"
            />
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

      <section className={`page ${styles.section} ${styles.cardsSection}`}>
        <h2 className="visually-hidden">What I make</h2>
        <ul className={styles.grid}>
          {sections.map((s) => (
            <li key={s.id}><SectionCard section={s} /></li>
          ))}
        </ul>
      </section>

      <Spiral size={52} unwind className={styles.divider} />


      <section className={`page ${styles.section} ${styles.stripSection}`}>
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
          {/* Чистый лист из конструктора — белый сквид с чёрным контуром,
              как он встречает в /builder. Только картинка: inert — без
              фокуса и нажатий по деталям. */}
          <div className={styles.stripHanger} aria-hidden="true" inert="">
            <span className={styles.stripPin} />
            <span className={styles.stripThread} />
            <div className={styles.stripSquid}>
              <SquidCanvas build={defaultBuild} colorOf={blankColor} onPick={() => {}} />
            </div>
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
