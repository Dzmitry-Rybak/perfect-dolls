/**
 * Архив работ. У каждой — несколько кадров: карточка листается
 * на месте, отдельная страница под каждую работу не нужна.
 *
 * shots — пока процедурные заглушки (seed + accent). Когда придут
 * настоящие фото, каждый кадр станет { src, alt }.
 */
export const galleryItems = [
  { id: 'g1', title: 'Button Moon', year: 2025, note: 'Went to Ghent', kind: 'doll',
    shots: [{ seed: 'g1a', accent: '#E8C46A' }, { seed: 'g1b', accent: '#C9BFD6' }, { seed: 'g1c', accent: '#8FB3AE' }] },
  { id: 'g2', title: 'First Soot Sprite', year: 2024, note: 'Stayed in the workshop', kind: 'squid',
    shots: [{ seed: 'g2a', accent: '#FFD3E2' }, { seed: 'g2b', accent: '#F0A9C6' }] },
  { id: 'g3', title: 'Porcelain Tear', year: 2025, note: 'Private collection', kind: 'doll',
    shots: [{ seed: 'g3a', accent: '#C9BFD6' }, { seed: 'g3b', accent: '#EFE9DE' }, { seed: 'g3c', accent: '#A5677E' }, { seed: 'g3d', accent: '#8FB2DC' }] },
  { id: 'g4', title: 'Moth Sisters', year: 2024, note: 'A pair, never separated', kind: 'doll',
    shots: [{ seed: 'g4a', accent: '#A5677E' }, { seed: 'g4b', accent: '#B93B3B' }] },
  { id: 'g5', title: 'November Bride', year: 2023, note: 'Shown at "Seam"', kind: 'doll',
    shots: [{ seed: 'g5a', accent: '#EFE9DE' }, { seed: 'g5b', accent: '#C9BFD6' }, { seed: 'g5c', accent: '#E2853C' }] },
  { id: 'g6', title: 'Red Squid', year: 2026, note: 'Sold before it was finished', kind: 'squid',
    shots: [{ seed: 'g6a', accent: '#B93B3B' }, { seed: 'g6b', accent: '#E2853C' }] },
  { id: 'g7', title: 'Candle Boy I', year: 2025, note: 'Prototype', kind: 'doll',
    shots: [{ seed: 'g7a', accent: '#E8C46A' }] },
  { id: 'g8', title: 'Matilda the Spider', year: 2024, note: 'Went to Prague', kind: 'squid',
    shots: [{ seed: 'g8a', accent: '#8FB2DC' }, { seed: 'g8b', accent: '#B6A3D6' }, { seed: 'g8c', accent: '#1C1A1F' }] },
];

export const GALLERY_FILTERS = [
  { id: 'all',   label: 'Everything' },
  { id: 'squid', label: 'Squids' },
  { id: 'doll',  label: 'Dolls' },
];
