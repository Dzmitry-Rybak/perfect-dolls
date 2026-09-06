import { useSearchParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import Filters from '../components/catalog/Filters.jsx';
import ProductGrid from '../components/catalog/ProductGrid.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getDolls, getCategories } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';

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
      title="Кто сейчас ищет дом"
      lead="Всё, что стоит на полке прямо сейчас. Проданные работы остаются в списке — по ним видно, что мастерская умеет."
    >
      {categories && (
        <Filters categories={categories} active={category} onChange={setCategory} />
      )}

      {loading
        ? <Loader />
        : <ProductGrid dolls={dolls} empty="В этой категории пока никого нет." />}
    </PageShell>
  );
}
