import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './GalleryLightbox.module.css';

const FOCUSABLE = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Работа во весь экран.
 *
 * Индекс кадра не свой, а тот же, что у карточки: пролистал здесь —
 * закрыл — карточка осталась на том же снимке. Поэтому окно рисует
 * сама карточка, а не страница галереи: состояние уже под рукой,
 * прокидывать его через два уровня незачем.
 *
 * Снимок вписывается целиком (contain), а не обрезается по рамке, как
 * в карточке: сюда приходят именно затем, чтобы разглядеть работу, и
 * широкие рисунки портретов должны быть видны от края до края.
 */
export default function GalleryLightbox({ item, i, setI, onClose }) {
  const trapRef = useRef(null);
  const closeRef = useRef(null);
  const touch = useRef(null);
  const many = item.shots.length > 1;
  const shot = item.shots[i];

  const go = (d) => setI((v) => (v + d + item.shots.length) % item.shots.length);

  /* Escape закрывает, стрелки листают, Tab не выпускает фокус наружу. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (many && e.key === 'ArrowRight') { e.preventDefault(); go(1); return; }
      if (many && e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); return; }
      if (e.key !== 'Tab') return;
      const nodes = [...(trapRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
        .filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  /* Фон не должен прокручиваться под открытым окном. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => { closeRef.current?.focus(); }, []);

  /* Соседние кадры подтягиваем заранее — иначе при листании окно
     на миг пустеет, а здесь это заметнее, чем в маленькой карточке. */
  useEffect(() => {
    if (!many) return;
    const n = item.shots.length;
    for (const j of [(i + 1) % n, (i - 1 + n) % n]) {
      const src = item.shots[j]?.src;
      if (src) { const img = new Image(); img.src = src; }
    }
  }, [i, item.shots, many]);

  const onTouchEnd = (e) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return createPortal(
    <div
      ref={trapRef}
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        {/* Скотч по верхним углам — тот же приём, что у тетрадного листа
            в конструкторе: работа выглядит приклеенной, а не вставленной
            в системное окно. */}
        <span className={styles.tapeL} aria-hidden="true" />
        <span className={styles.tapeR} aria-hidden="true" />

        {/* Крестик сидит на углу самой панели, а не в углу экрана:
            там его не находили глазами. position: absolute, а не fixed —
            fixed внутри overlay с backdrop-filter считается от панели,
            и кнопка уезжала на снимок. */}
        <button ref={closeRef} className={styles.close} onClick={onClose}>
          <span className="visually-hidden">Close</span>
          <span aria-hidden="true">✕</span>
        </button>

        <p className={styles.scribble}>a closer look</p>

        <div
          className={styles.stage}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={onTouchEnd}
        >
          <img
            key={i}
            className={styles.shot}
            src={shot.src}
            alt={`${shot.alt}. Photo ${i + 1} of ${item.shots.length}`}
            decoding="async"
            draggable="false"
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
            </>
          )}
        </div>

        <div className={styles.caption}>
          <div>
            <p className={styles.title}>{item.title}</p>
            {(item.year || item.note) && (
              <p className={styles.note}>
                {item.year && <span>{item.year}</span>}
                {item.year && item.note && <span aria-hidden="true">·</span>}
                {item.note && <span>{item.note}</span>}
              </p>
            )}
          </div>

          {many && (
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
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
