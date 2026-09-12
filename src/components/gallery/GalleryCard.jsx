import { useEffect, useState } from 'react';
import StitchCard from '../ui/StitchCard.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';
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
  const [zoom, setZoom] = useState(false);
  const [touch, setTouch] = useState(null);
  const many = item.shots.length > 1;
  const shot = item.shots[i];

  /**
   * Соседние кадры подтягиваем заранее.
   *
   * Каждый кадр — отдельный <img>, который создаётся в момент показа,
   * поэтому без этого при нажатии «дальше» карточка на миг оставалась
   * пустой, пока грузится следующий снимок. Сам текущий кадр браузер
   * уже держит в кеше, так что запрос уходит ровно один — за соседним.
   */
  useEffect(() => {
    if (!many) return;
    const n = item.shots.length;
    for (const j of [(i + 1) % n, (i - 1 + n) % n]) {
      const src = item.shots[j]?.src;
      if (src) { const img = new Image(); img.src = src; }
    }
  }, [i, item.shots, many]);

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
        {/* Настоящий снимок, если он есть; иначе процедурная заглушка.
            key={i} перезапускает проявление при листании. */}
        {shot.src ? (
          <img
            key={i}
            className={styles.photo}
            src={shot.src}
            alt={`${shot.alt}. Photo ${i + 1} of ${item.shots.length}`}
            width="675"
            height="900"
            /* lazy у всех: те карточки, что попали на первый экран,
               браузер грузит сразу, остальные — когда до них доскроллят.
               Кадры внутри карточки берёт на себя предзагрузка выше. */
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <DollPortrait
            key={i}
            seed={shot.seed}
            accent={shot.accent}
            alt={`${item.title}, photo ${i + 1} of ${item.shots.length}`}
          />
        )}

        {/* Прозрачная кнопка на весь кадр — открывает работу крупно.
            Лежит ПОД стрелками и точками (см. z-index в стилях), иначе
            перехватывала бы листание. */}
        <button className={styles.zoom} onClick={() => setZoom(true)}>
          <span className="visually-hidden">Open {item.title} larger</span>
        </button>

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

      {zoom && (
        <GalleryLightbox item={item} i={i} setI={setI} onClose={() => setZoom(false)} />
      )}

      <div className={styles.caption}>
        <h3 className={styles.title}>{item.title}</h3>
        {/* Год и судьба известны не про каждую работу: у сквидов их пока
            нет, и точку-разделитель между пустотами рисовать незачем. */}
        {(item.year || item.note) && (
          <p className={styles.note}>
            {item.year && <span>{item.year}</span>}
            {item.year && item.note && <span aria-hidden="true">·</span>}
            {item.note && <span>{item.note}</span>}
          </p>
        )}
      </div>
    </StitchCard>
  );
}
