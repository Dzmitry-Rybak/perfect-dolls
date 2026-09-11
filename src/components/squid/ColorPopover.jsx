import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './ColorPopover.module.css';

/**
 * Мини-палитра, всплывающая рядом с нажатой деталью.
 *
 * Позиционируется по точке клика и сама подвигается, если не влезает
 * в экран — иначе у края страницы половина палитры оказывалась бы
 * за кадром.
 */
export default function ColorPopover({ at, title, hint, colors, value, free, onChoose, onClose, onRemove }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: at.x, top: at.y });
  // С какой стороны от детали встала палитра: оттуда она и разворачивается.
  const [flipped, setFlipped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 10, gap = 22;

    // Вбок, а не под курсор: снизу палитра накрывала ту самую деталь,
    // цвет которой выбираешь, и результат было не видно.
    let left = at.x + gap;
    const flip = left + r.width > window.innerWidth - pad;
    if (flip) left = at.x - r.width - gap;
    left = Math.max(pad, Math.min(left, window.innerWidth - r.width - pad));

    let top = at.y - r.height / 2;
    top = Math.max(pad, Math.min(top, window.innerHeight - r.height - pad));
    setPos({ left, top });
    setFlipped(flip);
  }, [at]);

  /**
   * Переезд включаем со второго кадра.
   *
   * Первая позиция вычисляется уже после монтирования (надо знать размер),
   * и если разрешить переход сразу, палитра каждый раз приезжала бы из
   * точки нажатия. А вот когда с открытой палитрой нажимают другую деталь,
   * компонент остаётся тем же — и плавный переезд на новое место как раз
   * то, что нужно: видно, что это та же палитра, просто про другую деталь.
   */
  const [glide, setGlide] = useState(false);
  useEffect(() => {
    // Таймер, а не requestAnimationFrame: кадры идут не всегда (вкладка
    // в фоне, окно свёрнуто), и тогда переезд просто молча не включался бы.
    const id = setTimeout(() => setGlide(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onDown = (e) => {
      if (ref.current?.contains(e.target)) return;
      // Нажатие на другую деталь — не «мимо»: она сама откроет свою
      // палитру на этом же pointerdown, и новая встанет на место старой.
      // Если закрывать здесь, на сенсорном экране первый тап пропадал:
      // click браузер синтезирует позже, и открывать было уже нечему.
      if (e.target?.closest?.('[data-colour-zone]')) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`${styles.pop} ${flipped ? styles.fromRight : ''} ${glide ? styles.glide : ''}`}
      style={pos}
      role="dialog"
      aria-label={title}
    >
      {/* Корзина — только у добавок: снять деталь прямо отсюда, не
          возвращаясь к списку в панели. У меха и пуговицы снимать нечего. */}
      {onRemove && (
        <button className={styles.remove} onClick={onRemove} title="Remove this add-on">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path d="M2.5 4h11M6.5 4V2.6h3V4M4 4l.7 9.4h6.6L12 4M6.6 6.4v5M9.4 6.4v5"
                  fill="none" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="visually-hidden">Remove this add-on</span>
        </button>
      )}
      <p className={styles.title}>{title}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.grid}>
        {colors.map((c, i) => (
          <button
            key={c.id}
            className={`${styles.swatch} ${value === c.hex ? styles.on : ''}`}
            style={{ '--c': c.hex, '--i': i }}
            onClick={() => onChoose(c.hex)}
            title={c.label}
          >
            <span className="visually-hidden">{c.label}</span>
          </button>
        ))}
      </div>
      {/* Пуговицу, нитку и рисунок Рита красит вручную, поэтому там
          цвет не ограничен образцами. У меха выбора нет — там ткань. */}
      {free && (
        <label className={styles.free}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChoose(e.target.value.toUpperCase())}
          />
          <span>Any colour</span>
          <code className={styles.hex}>{value}</code>
        </label>
      )}
    </div>
  );
}
