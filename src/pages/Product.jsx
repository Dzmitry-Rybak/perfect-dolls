import { useParams, Link } from 'react-router-dom';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import PriceTag from '../components/ui/PriceTag.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getDoll } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { useCommission } from '../context/CommissionContext.jsx';
import styles from './Product.module.css';

export default function Product() {
  const { slug } = useParams();
  const { data: doll, loading, error } = useAsync(() => getDoll(slug), [slug]);
  const { open } = useCommission();

  if (loading) return <div className="page"><Loader /></div>;

  if (error) {
    return (
      <div className={`page ${styles.missing}`}>
        <h1>Такой куклы нет</h1>
        <p className="prose">Возможно, она уже уехала и страницу убрали.</p>
        <Button to="/catalog" variant="stitched">Вернуться в каталог</Button>
      </div>
    );
  }

  return (
    <div className={`page ${styles.page}`}>
      <nav className={styles.crumbs} aria-label="Хлебные крошки">
        <Link to="/catalog">Каталог</Link>
        <span aria-hidden="true">·</span>
        <span>{doll.name}</span>
      </nav>

      <div className={styles.layout}>
        <figure className={styles.figure}>
          <div className={styles.tape} aria-hidden="true" />
          <DollPortrait seed={doll.slug} accent={doll.accent} alt={doll.name} />
        </figure>

        <div className={styles.info}>
          <span className={styles.made}>Сшита в {doll.year} году · в одном экземпляре</span>
          <h1 className={styles.name}>{doll.name}</h1>
          <p className={styles.tagline}>{doll.tagline}</p>

          <div className={styles.priceRow}>
            <PriceTag value={doll.price} size="lg" />
            <span className={styles.priceNote}>
              столько стоила эта работа — ваша будет своей
            </span>
          </div>

          <div className={styles.actions}>
            <Button size="lg" onClick={() => open({ name: doll.name, slug: doll.slug })}>
              Хочу такую же
            </Button>
            <Button variant="stitched" onClick={() => open()}>
              Заказать другую
            </Button>
          </div>

          <p className={`prose ${styles.story}`}>{doll.story}</p>

          <dl className={styles.specs}>
            {doll.height && (
              <div className={styles.spec}>
                <dt>Рост</dt><dd>{doll.height} см</dd>
              </div>
            )}
            <div className={styles.spec}>
              <dt>Год</dt><dd>{doll.year}</dd>
            </div>
            <div className={styles.spec}>
              <dt>Тираж</dt><dd>единственный экземпляр</dd>
            </div>
          </dl>

          <div className={styles.materials}>
            <h2 className={styles.matTitle}>Из чего сделана</h2>
            <ul className={styles.matList}>
              {doll.materials.map((m) => (
                <li key={m} className="eye-host">
                  <ButtonEye size={13} color="var(--plum)" holes={2} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
