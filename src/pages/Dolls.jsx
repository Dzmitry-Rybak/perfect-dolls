import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import Button from '../components/ui/Button.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import { worksOf } from '../data/gallery.js';
import styles from './Section.module.css';

/* Три работы из архива, тем же порядком. Здесь витрина, а не листалка:
   показываем один кадр, за остальными — в галерею. */
const SHOWN = 3;
const PAST = worksOf('doll', SHOWN);
/* Кнопку показываем, только если в архиве и правда осталось что-то ещё. */
const MORE = worksOf('doll').length > SHOWN;

export default function Dolls() {
  return (
    <PageShell
      eyebrow="Collectible dolls"
      title="Dolls"
      lead="Cloth dolls with vintage buttons for eyes and faces stitched by hand. One at a time, never repeated — even when someone asks for the same one twice."
      aside={<OrderGate topic="dolls" kind="doll" label="Order a doll" />}
    >
      <section>
        <h2 className={styles.gridTitle}>Dolls that already found homes</h2>
        <ul className={styles.tiles}>
          {PAST.map((d) => (
            <li key={d.id}>
              <StitchCard seed={d.id} className={styles.tile}>
                <Photo src={d.shots[0].src} alt={d.shots[0].alt} />
                <p className={styles.tileName}>{d.title}</p>
              </StitchCard>
            </li>
          ))}
        </ul>

        {MORE && (
          <div className={styles.more}>
            <Button to="/gallery?kind=doll" variant="stitched">See the rest →</Button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
