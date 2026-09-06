import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero.jsx';
import WorkshopIntro from '../components/home/WorkshopIntro.jsx';
import CommissionCta from '../components/home/CommissionCta.jsx';
import OrderCta from '../components/commission/OrderCta.jsx';
import ProductGrid from '../components/catalog/ProductGrid.jsx';
import Loader from '../components/ui/Loader.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import { getFeatured } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Home.module.css';

export default function Home() {
  const { data: featured, loading } = useAsync(() => getFeatured(4), []);

  return (
    <>
      <Hero />

      <section className={`page ${styles.section}`}>
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Только что из мастерской</p>
            <h2>Новые жители</h2>
          </div>
          <Link to="/catalog" className={styles.all}>Все куклы →</Link>
        </div>

        {loading ? <Loader /> : <ProductGrid dolls={featured} />}
      </section>

      <Spiral size={56} className={styles.divider} />

      <WorkshopIntro />

      <div className={`page ${styles.section}`}>
        <OrderCta />
      </div>

      <CommissionCta />
    </>
  );
}
