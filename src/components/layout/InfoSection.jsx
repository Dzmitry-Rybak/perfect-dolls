import styles from './InfoSection.module.css';

/** Блок текста с заголовком — из таких собраны страницы разделов. */
export default function InfoSection({ title, children, aside }) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        <div className={`prose ${styles.body}`}>{children}</div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </section>
  );
}
