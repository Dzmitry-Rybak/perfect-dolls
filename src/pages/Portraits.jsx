import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import Button from '../components/ui/Button.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getWorks } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Section.module.css';

/* Три работы из архива. Здесь витрина, а не листалка: показываем
   один кадр, за остальными — в галерею.
   Какие именно три, выбирается в админке («Страницы разделов»);
   ничего не выбрано — берутся первые три по полю «Порядок в галерее». */
const SHOWN = 3;

export default function Portraits() {
  const { data, loading } = useAsync(() => getWorks('portrait', SHOWN), []);

  return (
    <PageShell
      eyebrow="Drawn portraits"
      title="Portraits"
      lead="Portraits of people and the animals that live with them, drawn in the same slightly haunted register as everything else here."
      aside={<OrderGate topic="portraits" kind="portrait" label="Order a portrait" />}
    >
      <section>
        <h2 className={styles.gridTitle}>Past portraits</h2>

        {loading ? <Loader label="Leafing through the folder…" /> : (
          <>
            <ul className={styles.tiles}>
              {data.shown.map((e) => (
                <li key={e.id}>
                  <StitchCard seed={e.id} className={styles.tile}>
                    <Photo
                      src={e.shots[0].tile ?? e.shots[0].src}
                      srcSet={e.shots[0].tileSrcSet}
                      sizes={e.shots[0].tileSizes}
                      alt={e.shots[0].alt}
                    />
                    <p className={styles.tileName}>{e.title}</p>
                  </StitchCard>
                </li>
              ))}
            </ul>

            {data.total > SHOWN && (
              <div className={styles.more}>
                <Button to="/gallery?kind=portrait" variant="stitched">See the rest →</Button>
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
