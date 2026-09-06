import { Link } from 'react-router-dom';
import StitchCard from '../ui/StitchCard.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import { useCommission } from '../../context/CommissionContext.jsx';
import { formatPrice } from '../../lib/format.js';
import styles from './ProductCard.module.css';

export default function ProductCard({ doll }) {
  const { open } = useCommission();

  return (
    <StitchCard
      as="article"
      seed={doll.slug}
      interactive
      className={`${styles.card} eye-host`}
    >
      <div className={styles.media}>
        <DollPortrait seed={doll.slug} accent={doll.accent} alt={doll.name} />
        <span className={styles.year}>{doll.year}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          {/* Растянутая ссылка: кликабельна вся карточка, но в DOM одна ссылка */}
          <Link to={`/doll/${doll.slug}`} className={styles.stretch}>{doll.name}</Link>
        </h3>
        <p className={styles.tagline}>{doll.tagline}</p>

        <div className={styles.foot}>
          <span className={styles.price}>
            <span className={styles.priceLabel}>ориентир</span>
            {formatPrice(doll.price)}
          </span>

          {/* z-index обязателен: иначе растянутая ссылка карточки
              перекрывает кнопку и «Хочу такую же» не нажимается */}
          <button
            className={styles.want}
            onClick={() => open({ name: doll.name, slug: doll.slug })}
          >
            Хочу такую же
          </button>
        </div>
      </div>
    </StitchCard>
  );
}
