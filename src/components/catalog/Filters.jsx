import styles from './Filters.module.css';

export default function Filters({ categories, active, onChange }) {
  return (
    <div className={styles.row} role="group" aria-label="Фильтр по типу">
      {categories.map((c) => (
        <button
          key={c.id}
          className={`${styles.chip} ${active === c.id ? styles.on : ''}`}
          aria-pressed={active === c.id}
          onClick={() => onChange(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
