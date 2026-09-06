import PageShell from '../components/layout/PageShell.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getGallery } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { data: items, loading } = useAsync(() => getGallery(), []);

  return (
    <PageShell
      eyebrow="Архив"
      title="Те, кто уже уехал"
      lead="Работы прошлых лет: проданные, выставочные и оставшиеся в мастерской. Купить их нельзя, но по ним видно, куда всё движется."
    >
      {loading ? <Loader label="Разбираю архив…" /> : (
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles[item.span]}>
              <StitchCard seed={item.id} interactive className={styles.card}>
                <div className={styles.media}>
                  <DollPortrait seed={item.id} accent={item.accent} alt={item.title} />
                </div>
                <div className={styles.caption}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.note}>
                    <span>{item.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.note}</span>
                  </p>
                </div>
              </StitchCard>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
