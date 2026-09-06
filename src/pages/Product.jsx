import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import PriceTag from '../components/ui/PriceTag.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import { StatusTag } from '../components/ui/Tag.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getDoll } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { useCart } from '../context/CartContext.jsx';
import styles from './Product.module.css';

export default function Product() {
  const { slug } = useParams();
  const { data: doll, loading, error } = useAsync(() => getDoll(slug), [slug]);
  const cart = useCart();
  const [justAdded, setJustAdded] = useState(false);

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

  const sold = doll.status === 'sold';
  const inCart = cart.has(doll.id);

  const handleAdd = () => {
    cart.add({ id: doll.id, slug: doll.slug, name: doll.name,
               price: doll.price, accent: doll.accent });
    setJustAdded(true);
  };

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
          <StatusTag status={doll.status} />
          <h1 className={styles.name}>{doll.name}</h1>
          <p className={styles.tagline}>{doll.tagline}</p>

          <div className={styles.priceRow}>
            <PriceTag value={doll.price} size="lg" />
          </div>

          <div className={styles.actions}>
            {sold ? (
              <>
                <Button disabled>Нашла дом</Button>
                <Button to="/constructor" variant="stitched">Собрать похожую</Button>
              </>
            ) : (
              <>
                <Button onClick={handleAdd} disabled={inCart}>
                  {inCart ? 'Уже в корзине' : 'В корзину'}
                </Button>
                {justAdded && !sold && (
                  <Link to="/cart" className={styles.toCart}>Перейти в корзину →</Link>
                )}
              </>
            )}
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
