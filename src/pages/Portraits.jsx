import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import Button from '../components/ui/Button.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import { worksOf } from '../data/gallery.js';
import styles from './Section.module.css';

/* Три работы из архива, тем же порядком. */
const SHOWN = 3;
const EXAMPLES = worksOf('portrait', SHOWN);
/* Кнопку показываем, только если в архиве и правда осталось что-то ещё. */
const MORE = worksOf('portrait').length > SHOWN;

export default function Portraits() {
  return (
    <PageShell
      eyebrow="Drawn portraits"
      title="Portraits"
      lead="Portraits of people and the animals that live with them, drawn in the same slightly haunted register as everything else here."
      aside={<OrderGate topic="portraits" kind="portrait" label="Order a portrait" />}
    >
      <section>
        <h2 className={styles.gridTitle}>Past portraits</h2>
        <ul className={styles.tiles}>
          {EXAMPLES.map((e) => (
            <li key={e.id}>
              <StitchCard seed={e.id} className={styles.tile}>
                <Photo src={e.shots[0].src} alt={e.shots[0].alt} />
                <p className={styles.tileName}>{e.title}</p>
              </StitchCard>
            </li>
          ))}
        </ul>

        {MORE && (
          <div className={styles.more}>
            <Button to="/gallery?kind=portrait" variant="stitched">See the rest →</Button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
