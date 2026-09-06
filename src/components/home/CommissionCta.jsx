import Button from '../ui/Button.jsx';
import styles from './CommissionCta.module.css';

export default function CommissionCta() {
  return (
    <section className={`page ${styles.section}`}>
      <div className={styles.panel}>
        {/* Тетрадная клетка — намёк на конструктор ещё до перехода */}
        <div className={styles.paper} aria-hidden="true" />
        <div className={styles.content}>
          <p className={styles.scribble}>а можно свою?</p>
          <h2 className={styles.title}>Соберите куклу сами</h2>
          <p className={`prose ${styles.lead}`}>
            Выберите тело, волосы, глаза-пуговицы, наряд и спутника —
            сборка складывается прямо на листе в клеточку, а цена
            пересчитывается на ходу. Ссылку можно скинуть мне или
            показать подруге.
          </p>
          <Button to="/constructor" size="lg">Открыть конструктор</Button>
        </div>
      </div>
    </section>
  );
}
