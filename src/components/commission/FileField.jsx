import { useEffect, useId, useRef, useState } from 'react';
import { MAX_FILES, MAX_FILE_MB, MAX_TOTAL_MB, ACCEPT } from '../../data/commissionForm.js';
import styles from './FileField.module.css';

const mb = (bytes) => bytes / 1024 / 1024;
const fmt = (bytes) => `${mb(bytes).toFixed(1)} MB`;

export default function FileField({ files, onChange }) {
  const id = useId();
  const inputRef = useRef(null);
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState(false);

  // Превью живут в памяти браузера — их нужно освобождать,
  // иначе при долгом заполнении анкеты утекает память
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const urls = files.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : null));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  const accept = (incoming) => {
    const next = [...files];
    const rejected = [];

    for (const f of incoming) {
      if (next.length >= MAX_FILES) { rejected.push(`${f.name} — more than ${MAX_FILES} files won't fit`); continue; }
      if (mb(f.size) > MAX_FILE_MB) { rejected.push(`${f.name} — heavier than ${MAX_FILE_MB} MB`); continue; }
      // Дубли по имени и размеру: люди часто кидают один файл дважды
      if (next.some((n) => n.name === f.name && n.size === f.size)) { rejected.push(`${f.name} — already added`); continue; }
      const total = next.reduce((s, n) => s + n.size, 0) + f.size;
      if (mb(total) > MAX_TOTAL_MB) { rejected.push(`${f.name} — together that is over ${MAX_TOTAL_MB} MB`); continue; }
      next.push(f);
    }

    setNotice(rejected.join(' · '));
    onChange(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    accept([...e.dataTransfer.files]);
  };

  const totalMb = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className={styles.wrap}>
      <label
        htmlFor={id}
        className={`${styles.drop} ${dragging ? styles.over : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span className={styles.dropTitle}>Drop files here</span>
        <span className={styles.dropHint}>
          or tap to choose · up to {MAX_FILES} files, {MAX_FILE_MB} MB each
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={ACCEPT}
          className="visually-hidden"
          onChange={(e) => { accept([...e.target.files]); e.target.value = ''; }}
        />
      </label>

      {notice && <p className={styles.notice} role="alert">{notice}</p>}

      {files.length > 0 && (
        <>
          <ul className={styles.list}>
            {files.map((f, i) => (
              <li key={`${f.name}-${f.size}`} className={styles.item}>
                {previews[i]
                  ? <img src={previews[i]} alt="" className={styles.thumb} />
                  : <span className={styles.thumbDoc} aria-hidden="true">PDF</span>}
                <span className={styles.name} title={f.name}>{f.name}</span>
                <span className={styles.size}>{fmt(f.size)}</span>
                <button
                  type="button"
                  className={styles.drop_}
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                >
                  <span className="visually-hidden">Remove {f.name}</span>
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.total}>
            {files.length} of {MAX_FILES} · {fmt(totalMb)} of {MAX_TOTAL_MB} MB
          </p>
        </>
      )}
    </div>
  );
}
