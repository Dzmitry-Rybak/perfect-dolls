import ProductCard from './ProductCard.jsx';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ dolls, empty = 'Здесь пока пусто.' }) {
  if (!dolls?.length) return <p className={styles.empty}>{empty}</p>;
  return (
    <ul className={styles.grid}>
      {dolls.map((doll) => (
        <li key={doll.id}><ProductCard doll={doll} /></li>
      ))}
    </ul>
  );
}
