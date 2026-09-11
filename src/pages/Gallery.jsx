import { useState } from 'react';
import PageShell from '../components/layout/PageShell.jsx';
import GalleryCard from '../components/gallery/GalleryCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getGallery } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { GALLERY_FILTERS } from '../data/gallery.js';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { data: items, loading } = useAsync(() => getGallery(), []);
  const [filter, setFilter] = useState('all');

  const shown = items?.filter((i) => filter === 'all' || i.kind === filter);

  return (
    <PageShell
      eyebrow="Archive"
      title="Everything that left"
      lead="Past work — sold, exhibited, or still sitting on my shelf. Swipe or use the arrows to see more shots of each piece."
    >
      <div className={styles.filters} role="group" aria-label="Filter by type">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`${styles.chip} ${filter === f.id ? styles.on : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >{f.label}</button>
        ))}
      </div>

      {loading ? <Loader label="Digging through the archive…" /> : (
        <ul className={styles.grid}>
          {shown.map((item) => (
            <li key={item.id}><GalleryCard item={item} /></li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
