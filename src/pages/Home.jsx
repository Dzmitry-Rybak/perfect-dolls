import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import SectionCard from '../components/home/SectionCard.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import PriceTag from '../components/ui/PriceTag.jsx';
import { SECTIONS } from '../data/nav.js';
import { EMAIL } from '../data/site.js';
import styles from './Home.module.css';

/**
 * Полка готовых вещей: то, что можно забрать сразу, без анкеты и
 * ожидания. Обычно пусто — почти всё разбирают до того, как дошито.
 *
 * Чтобы выставить вещь, добавь сюда запись:
 *   { id, name, kind, price, accent, note }
 * id     — любой уникальный ярлык, от него зависит наклон карточки
 * kind   — подпись сверху: 'Doll', 'Squid', 'Portrait', что угодно
 * price  — число, валюта подставится сама
 * accent — цвет заглушки-портрета, пока нет фото
 * note   — необязательная строка: «one of a kind», «ready to ship»
 *
 * Убрать вещь — удалить запись. Пустой список сам вернёт заглушку.
 * TODO: переедет в админку вместе с окнами заказов.
 *
 * ЗАПОЛНЕНО РЫБОЙ — чтобы Рита видела, как полка выглядит непустой.
 * Заменить на настоящие вещи или очистить список перед запуском.
 */
const AVAILABLE = [
  {
    id: 'av-wren', name: 'Wren', kind: 'Doll', price: 195,
    accent: '#C9BFD6', note: 'one of a kind · ready to ship',
  },
  {
    id: 'av-inkling', name: 'Little Inkling', kind: 'Squid', price: 120,
    accent: '#A5677E', note: 'came out too small to sell as standard',
  },
  {
    id: 'av-hollow', name: 'Hollow', kind: 'Doll', price: 210,
    accent: '#E8C46A', note: 'someone changed their mind',
  },
];

/**
 * Наклоны приколотых вещей. Заданы списком, а не случайно: список
 * видно целиком, и соседние карточки не сваливаются в одну сторону.
 */
const TILTS = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2];

export default function Home() {
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
            {/* TODO: заменить на аватарку Риты */}
            <DollPortrait seed="cutesmokey" accent="#FF96C9" alt="cutesmokey" />
          </figure>

          <div className={styles.heroCopy}>
            <p className="eyebrow">Handmade, one at a time</p>
            <h1 className={styles.title}>
              Sewn from the dark
              <span className={styles.and}>and</span>
              something softer
            </h1>
            <p className={`prose ${styles.lead}`}>
              I'm Margarita. I make plush squids with button faces, cloth dolls that
              stare back, and portraits of people and their animals. Everything
              is made to order, and no two come out the same.
            </p>
            <div className={styles.actions}>
              <Button to="/builder" size="lg">Build a squid</Button>
              <Button to="/gallery" size="lg" variant="stitched">See past work</Button>
            </div>
          </div>
        </div>
      </section>

      <section className={`page ${styles.section}`}>
        <h2 className="visually-hidden">What I make</h2>
        <ul className={styles.grid}>
          {SECTIONS.map((s) => (
            <li key={s.id}><SectionCard section={s} /></li>
          ))}
        </ul>
      </section>

      <Spiral size={52} className={styles.divider} />

      <section className={`page ${styles.section}`}>
        <div className={styles.availHead}>
          <div>
            <p className="eyebrow">Ready to go</p>
            <h2>Available now</h2>
          </div>
        </div>

        {AVAILABLE.length > 0 ? (
          <div className={styles.board}>
            <span className={styles.boardMargin} aria-hidden="true" />
            <ul className={styles.shelf}>
              {AVAILABLE.map((it, i) => (
                <li key={it.id} className={styles.pinned} style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}>
                  <span className={styles.pin} aria-hidden="true" />
                  <StitchCard seed={it.id} tilt={false} className={styles.shelfCard}>
                    <DollPortrait seed={it.id} accent={it.accent} alt={it.name} />
                    <div className={styles.shelfBody}>
                      {it.kind && <p className="eyebrow">{it.kind}</p>}
                      <p className={styles.shelfName}>{it.name}</p>
                      {it.note && <p className={styles.shelfNote}>{it.note}</p>}
                      <div className={styles.shelfFoot}>
                        <PriceTag value={it.price} size="sm" />
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
              ))}
            </ul>
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
              Tap the parts, choose the fur, paint the button, add horns or a
              corset ribbon. The price adds up as you go, so there are no
              surprises when you write to me.
            </p>
            <Button to="/builder" size="lg">Open the builder</Button>
          </div>
        </div>
      </section>
    </>
  );
}
