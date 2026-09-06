import Button from '../ui/Button.jsx';
import { useCommission } from '../../context/CommissionContext.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import styles from './Hero.module.css';

export default function Hero() {
  const { open } = useCommission();

  return (
    <section className={styles.hero}>
      {/* Акварельные пятна-подложки */}
      <div className={styles.bleed} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
      </div>

      <div className={`page ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Мастерская авторских кукол</p>
          <h1 className={styles.title}>
            Сшиты из&nbsp;темноты
            <span className={styles.and}>и</span>
            нежности
          </h1>
          <p className={`prose ${styles.lead}`}>
            Тряпичные куклы и art toys, у которых пуговицы вместо глаз
            и характер вместо инструкции. Каждая существует в одном
            экземпляре — второй такой не будет, даже если очень попросить.
          </p>
          <div className={styles.actions}>
            <Button size="lg" onClick={() => open()}>Заказать куклу</Button>
            <Button to="/catalog" size="lg" variant="stitched">Посмотреть работы</Button>
          </div>
        </div>

        <div className={styles.figure}>
          <div className={styles.tape} aria-hidden="true" />
          <DollPortrait seed="hero-doll" accent="#FF96C9" alt="Кукла мастерской Rita Dolls" />
        </div>
      </div>
    </section>
  );
}
