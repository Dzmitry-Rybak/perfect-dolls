import { Link } from 'react-router-dom';
import StitchCard from '../ui/StitchCard.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import styles from './SectionCard.module.css';

/**
 * Блок продукта на главной. Пока вместо фото — процедурная заглушка;
 * когда Рита пришлёт снимки, здесь меняется на <img>.
 */
export default function SectionCard({ section }) {
  return (
    <StitchCard as="article" seed={section.id} interactive className={styles.card}>
      <div className={styles.media}>
        <DollPortrait seed={section.id} accent={section.accent} alt="" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={section.to} className={styles.stretch}>{section.label}</Link>
        </h3>
        <p className={styles.blurb}>{section.blurb}</p>
        <span className={styles.go} aria-hidden="true">look →</span>
      </div>
    </StitchCard>
  );
}
