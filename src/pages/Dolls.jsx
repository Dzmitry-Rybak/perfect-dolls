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

export default function Dolls() {
  const { data, loading } = useAsync(() => getWorks('doll', SHOWN), []);

  return (
    <PageShell
      eyebrow="Collectible dolls"
      title="Dolls"
      lead="Cloth dolls with vintage buttons for eyes and faces stitched by hand. One at a time, never repeated — even when someone asks for the same one twice."
      aside={<OrderGate topic="dolls" kind="doll" label="Order a doll" />}
    >
      <section>
        <h2 className={styles.gridTitle}>Dolls that already found homes</h2>

        {loading ? <Loader label="Opening the drawers…" /> : (
          <>
            <ul className={styles.tiles}>
              {data.shown.map((d) => (
                <li key={d.id}>
                  <StitchCard seed={d.id} className={styles.tile}>
                    <Photo src={d.shots[0].tile ?? d.shots[0].src} alt={d.shots[0].alt} />
                    <p className={styles.tileName}>{d.title}</p>
                  </StitchCard>
                </li>
              ))}
            </ul>

            {/* Ссылку показываем, только если в архиве и правда осталось ещё. */}
            {data.total > SHOWN && (
              <div className={styles.more}>
                <Button to="/gallery?kind=doll" variant="stitched">See the rest →</Button>
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
