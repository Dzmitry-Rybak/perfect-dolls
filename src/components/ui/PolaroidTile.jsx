import Photo from './Photo.jsx';
import styles from './PolaroidTile.module.css';

/**
 * Пустые полароиды Риты — рамки для плиток работ на страницах разделов.
 * Чередуются по порядку, чтобы соседние плитки не были близнецами.
 *
 * win   — прозрачное окно под снимок, в % от размеров файла:
 *         [слева, сверху, ширина, высота]. С запасом 10px внутрь
 *         бумаги: рамки сняты чуть наискось, и снимок впритык оставлял
 *         бы светлые щели по краям.
 * label — нижнее поле полароида, куда пишется название работы.
 */
const FRAMES = [
  { src: '/art/frames/blank-1.webp', w: 1313, h: 2000, win: [13.33, 12.40, 73.95, 65.20], label: [11, 79.5, 78, 13] },
  { src: '/art/frames/blank-2.webp', w: 1339, h: 2000, win: [12.62, 12.95, 75.13, 66.35], label: [11, 81, 78, 14] },
  { src: '/art/frames/blank-3.webp', w: 1313, h: 2000, win: [13.10, 13.50, 74.11, 65.40], label: [11, 81, 78, 13.5] },
];

const box = ([l, t, w, h]) => ({ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` });

/** Снимок работы в полароиде, название — от руки на нижнем поле. */
export default function PolaroidTile({ shot, title, index = 0 }) {
  const frame = FRAMES[index % FRAMES.length];

  return (
    <figure className={styles.tile} style={{ aspectRatio: `${frame.w} / ${frame.h}` }}>
      <div className={styles.media} style={box(frame.win)}>
        <Photo
          src={shot.tile ?? shot.src}
          srcSet={shot.tileSrcSet}
          sizes={shot.tileSizes}
          alt={shot.alt}
        />
      </div>
      <img
        className={styles.frame}
        src={frame.src}
        alt=""
        aria-hidden="true"
        width={frame.w}
        height={frame.h}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
      {title && (
        <figcaption className={styles.label} style={box(frame.label)}>
          <span>{title}</span>
        </figcaption>
      )}
    </figure>
  );
}
