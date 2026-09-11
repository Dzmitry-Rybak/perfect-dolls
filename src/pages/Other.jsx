import PageShell from '../components/layout/PageShell.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import { EMAIL } from '../data/site.js';
import styles from './Section.module.css';

export default function Other() {
  return (
    <PageShell
      eyebrow="Everything else"
      title="Other creations"
      lead="Clay pieces, little boxes, odds and ends that don't belong anywhere else on this site."
    >
      <div className={styles.empty}>
        <ButtonEye size={26} color="var(--fog)" />
        <p className={styles.emptyText}>
          Nothing here yet. This is where the strays will go — the sculpted
          things, the painted boxes, whatever I get curious about next.
        </p>
        <p className={styles.emptyHint}>
          If you want something like that made, write to{' '}
          <a href={`mailto:${EMAIL.main}`}>{EMAIL.main}</a>
        </p>
      </div>
    </PageShell>
  );
}
