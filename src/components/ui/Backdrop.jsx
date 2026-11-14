import styles from './Backdrop.module.css';

/**
 * Фон сайта — одна картина Риты (спираль со звёздами).
 *
 * Отдельный fixed-слой, а не background-attachment: fixed —
 * Safari на iPhone fixed-фон у body не поддерживает и растягивает
 * картинку на всю высоту страницы.
 */
export default function Backdrop() {
  return <div className={styles.wrap} aria-hidden="true" />;
}
