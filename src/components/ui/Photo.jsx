import styles from './Photo.module.css';

/**
 * Настоящий снимок работы — там, где раньше стояла заглушка DollPortrait.
 *
 * Рамка та же (200×260, как viewBox заглушки), поэтому подменяется
 * один в один и вёрстка страниц не меняется. Снимки вертикальные 3:4,
 * лишнее срезается по центру.
 */
export default function Photo({ src, srcSet, sizes, alt = '', className = '', ...rest }) {
  return (
    <img
      className={`${styles.photo} ${className}`}
      src={src}
      /* Набор ширин, если снимок пришёл из админки: браузер возьмёт
         файл под размер плитки, а не самый большой из имеющихся.
         У запасных снимков из сборки его нет — тогда атрибутов
         просто не будет. */
      srcSet={srcSet}
      sizes={sizes}
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
