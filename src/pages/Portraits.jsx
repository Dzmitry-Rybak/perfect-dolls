import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import styles from './Section.module.css';

/** TODO: заменить на настоящие примеры работ */
const EXAMPLES = [
  { id: 'p1', accent: '#F0A9C6' },
  { id: 'p2', accent: '#8FB3AE' },
  { id: 'p3', accent: '#E8C46A' },
];

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
                <DollPortrait seed={e.id} accent={e.accent} alt="" />
              </StitchCard>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
