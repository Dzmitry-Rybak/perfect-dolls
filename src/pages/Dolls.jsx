import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import styles from './Section.module.css';

/** TODO: заменить на настоящие фото прошлых кукол */
const PAST = [
  { id: 'd1', name: 'Mothwing',    accent: '#C9BFD6' },
  { id: 'd2', name: 'Plum Vesper', accent: '#A5677E' },
  { id: 'd3', name: 'Button Moon', accent: '#E8C46A' },
];

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
                <DollPortrait seed={d.id} accent={d.accent} alt={d.name} />
                <p className={styles.tileName}>{d.name}</p>
              </StitchCard>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
