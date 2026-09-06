import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import Button from '../components/ui/Button.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, plural } from '../lib/format.js';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, total, remove, clear } = useCart();

  if (!items.length) {
    return (
      <PageShell eyebrow="Корзина" title="Пока пусто">
        <p className={`prose ${styles.emptyText}`}>
          Ни одна кукла ещё не выбрала вас. Или вы её — тут как посмотреть.
        </p>
        <div className={styles.emptyActions}>
          <Button to="/catalog">Посмотреть кукол</Button>
          <Button to="/constructor" variant="stitched">Собрать свою</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={`Корзина · ${items.length} ${plural(items.length, 'кукла', 'куклы', 'кукол')}`}
      title="Собираются в дорогу"
    >
      <div className={styles.layout}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <StitchCard seed={item.slug} className={styles.row}>
                {/* Соседняя ссылка с названием ведёт туда же, поэтому
                    миниатюру убираем из таб-порядка и из дерева доступности —
                    иначе скринридер объявляет один товар дважды */}
                <Link
                  to={`/doll/${item.slug}`}
                  className={styles.thumb}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <DollPortrait seed={item.slug} accent={item.accent} alt="" />
                </Link>

                <div className={styles.rowBody}>
                  <h3 className={styles.rowName}>
                    <Link to={`/doll/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p className={styles.rowNote}>единственный экземпляр</p>
                </div>

                <span className={styles.rowPrice}>{formatPrice(item.price)}</span>

                <button
                  className={styles.remove}
                  onClick={() => remove(item.id)}
                >
                  <span className="visually-hidden">Убрать {item.name} из корзины</span>
                  <span aria-hidden="true">✕</span>
                </button>
              </StitchCard>
            </li>
          ))}
        </ul>

        <aside className={styles.summary}>
          <StitchCard tilt={false} className={styles.summaryCard}>
            <h2 className={styles.sumTitle}>Итого</h2>

            <dl className={styles.sumRows}>
              <div>
                <dt>Кукол</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd className={styles.dim}>считается при оформлении</dd>
              </div>
            </dl>

            <div className={styles.grand}>
              <span>К оплате</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <Button className={styles.checkout} size="lg">Оформить заказ</Button>
            <p className={styles.mockNote}>
              Оплата появится вместе с бэкендом — сейчас это макет.
            </p>

            <button className={styles.clear} onClick={clear}>Очистить корзину</button>
          </StitchCard>
        </aside>
      </div>
    </PageShell>
  );
}
