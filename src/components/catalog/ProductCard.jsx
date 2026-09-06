import { Link } from 'react-router-dom';
import StitchCard from '../ui/StitchCard.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import PriceTag from '../ui/PriceTag.jsx';
import { StatusTag } from '../ui/Tag.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ doll }) {
  const sold = doll.status === 'sold';

  return (
    <StitchCard
      as="article"
      seed={doll.slug}
      interactive
      className={`${styles.card} eye-host ${sold ? styles.sold : ''}`}
    >
      <div className={styles.media}>
        <DollPortrait seed={doll.slug} accent={doll.accent} alt={doll.name} />
        <div className={styles.status}><StatusTag status={doll.status} /></div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          {/* Растянутая ссылка: кликабельна вся карточка, но в DOM одна ссылка */}
          <Link to={`/doll/${doll.slug}`} className={styles.stretch}>{doll.name}</Link>
        </h3>
        <p className={styles.tagline}>{doll.tagline}</p>

        <div className={styles.meta}>
          <PriceTag value={doll.price} size="sm" />
          {doll.height && <span className={styles.height}>{doll.height} см</span>}
        </div>
      </div>
    </StitchCard>
  );
}
