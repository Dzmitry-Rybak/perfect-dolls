import { useSearchParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import Filters from '../components/catalog/Filters.jsx';
import ProductGrid from '../components/catalog/ProductGrid.jsx';
import Loader from '../components/ui/Loader.jsx';
import OrderCta from '../components/commission/OrderCta.jsx';
import { getDolls, getCategories } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Catalog.module.css';

export default function Catalog() {
  // Фильтр живёт в URL — ссылку на «только art toys» можно переслать
  const [params, setParams] = useSearchParams();
  const category = params.get('cat') || 'all';

  const { data: categories } = useAsync(() => getCategories(), []);
  const { data: dolls, loading } = useAsync(() => getDolls({ category }), [category]);

  const setCategory = (id) => {
    setParams(id === 'all' ? {} : { cat: id }, { replace: true });
  };

  return (
    <PageShell
      eyebrow="Каталог"
      title="Работы мастерской"
      lead="Всё это уже уехало к своим людям — готовых кукол не бывает. Смотрите как примеры: любую можно взять за отправную точку и заказать свою."
    >
      <div className={styles.cta}><OrderCta compact /></div>

      {categories && (
        <Filters categories={categories} active={category} onChange={setCategory} />
      )}

      {loading
        ? <Loader />
        : <ProductGrid dolls={dolls} empty="В этой категории пока никого нет." />}
    </PageShell>
  );
}
