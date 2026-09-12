import styles from './Photo.module.css';

/**
 * Настоящий снимок работы — там, где раньше стояла заглушка DollPortrait.
 *
 * Рамка та же (200×260, как viewBox заглушки), поэтому подменяется
 * один в один и вёрстка страниц не меняется. Снимки вертикальные 3:4,
 * лишнее срезается по центру.
 */
export default function Photo({ src, alt = '', className = '', ...rest }) {
  return (
    <img
      className={`${styles.photo} ${className}`}
      src={src}
      alt={alt}
      {...rest}
      /* width/height не ставим: снимки бывают разного размера (675px
         в галерее, 525px на главной), а рамку всё равно задаёт CSS
         через aspect-ratio — атрибуты только врали бы. */
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}
