import { useState } from 'react';
import StitchCard from '../ui/StitchCard.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import styles from './GalleryCard.module.css';

/**
 * Карточка работы с несколькими кадрами.
 *
 * Листается прямо на месте — стрелками, точками и свайпом, — чтобы
 * не заводить отдельную страницу под каждую работу.
 */
export default function GalleryCard({ item }) {
  const [i, setI] = useState(0);
  const [touch, setTouch] = useState(null);
  const many = item.shots.length > 1;

  const go = (d) => setI((v) => (v + d + item.shots.length) % item.shots.length);

  // Свайп: порог 40px, иначе обычная прокрутка страницы срабатывала
  // бы как листание
  const onTouchEnd = (e) => {
    if (touch === null) return;
    const dx = e.changedTouches[0].clientX - touch;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    setTouch(null);
  };

  return (
    <StitchCard as="article" seed={item.id} className={styles.card}>
      <div
        className={styles.media}
        onTouchStart={(e) => setTouch(e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <DollPortrait
          key={i}
          seed={item.shots[i].seed}
          accent={item.shots[i].accent}
          alt={`${item.title}, photo ${i + 1} of ${item.shots.length}`}
        />

        {many && (
          <>
            <button className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)}>
              <span className="visually-hidden">Previous photo of {item.title}</span>
              <span aria-hidden="true">‹</span>
            </button>
            <button className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)}>
              <span className="visually-hidden">Next photo of {item.title}</span>
              <span aria-hidden="true">›</span>
            </button>

            <div className={styles.dots} role="tablist" aria-label={`Photos of ${item.title}`}>
              {item.shots.map((_, n) => (
                <button
                  key={n}
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Photo ${n + 1}`}
                  className={`${styles.dot} ${n === i ? styles.dotOn : ''}`}
                  onClick={() => setI(n)}
                />
              ))}
            </div>

            <span className={styles.count}>{i + 1}/{item.shots.length}</span>
          </>
        )}
      </div>

      <div className={styles.caption}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.note}>
          <span>{item.year}</span><span aria-hidden="true">·</span><span>{item.note}</span>
        </p>
      </div>
    </StitchCard>
  );
}
