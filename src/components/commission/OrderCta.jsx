import Button from '../ui/Button.jsx';
import ButtonEye from '../ui/ButtonEye.jsx';
import { useCommission } from '../../context/CommissionContext.jsx';
import styles from './OrderCta.module.css';

const HOW = [
  'Отвечаете на несколько вопросов',
  'Прикладываете картинки, которые нравятся',
  'Рита пишет вам в тот же день',
];

export default function OrderCta({ compact = false }) {
  const { open } = useCommission();

  return (
    <section className={`${styles.panel} ${compact ? styles.compact : ''}`}>
      <div className={styles.bleed} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.scribble}>каждая — единственная</p>
        <h2 className={styles.title}>Закажите свою куклу</h2>
        <p className={`prose ${styles.lead}`}>
          Готовых кукол не бывает: всё, что вы видите на сайте, — уже уехало
          к своим людям. Зато можно рассказать про свою, и Рита сошьёт её
          с нуля.
        </p>

        {!compact && (
          <ul className={styles.how}>
            {HOW.map((h) => (
              <li key={h} className="eye-host">
                <ButtonEye size={14} holes={2} color="var(--moon)" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <Button size="lg" onClick={() => open()}>Заказать куклу</Button>
      </div>
    </section>
  );
}
