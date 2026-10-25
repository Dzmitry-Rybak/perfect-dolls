import { useEffect, useId, useRef, useState } from 'react';
import { MAX_FILES, MAX_FILE_MB, MAX_TOTAL_MB, ACCEPT } from '../../data/commissionForm.js';
import styles from './FileField.module.css';

const mb = (bytes) => bytes / 1024 / 1024;
const fmt = (bytes) => `${mb(bytes).toFixed(1)} MB`;

/**
 * Чем именно можно поделиться.
 *
 * Атрибут accept у поля — только подсказка системному окну выбора:
 * он сужает список в диалоге и ровно ничего не проверяет. Файл,
 * перетащенный мышью на рамку, минует его целиком, и до этой правки
 * в анкету можно было положить что угодно — архив, документ,
 * исполняемый файл, — а узнали бы об этом уже на почте.
 *
 * Расширение здесь не про безопасность, а про запасной путь: у части
 * файлов (особенно heic с телефона и файлов из архивов) браузер не
 * определяет тип и отдаёт пустую строку. Настоящая проверка — по
 * содержимому и на сервере, про это написано в api/CONTRACT.md.
 */
const BY_EXT = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', heic: 'image/heic', heif: 'image/heic',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const typeOf = (f) =>
  f.type || BY_EXT[f.name.split('.').pop()?.toLowerCase()] || '';

/** Что сказать про файл не того типа — по тому, что поле принимает. */
const wrongType = (allowed) => {
  const photos = allowed.some((t) => t.startsWith('image/'));
  const docs = allowed.some((t) => !t.startsWith('image/'));
  if (photos && docs) {
    return allowed.includes('application/msword') ? 'photos, PDF or Word only' : 'photos and PDF only';
  }
  return photos ? 'photos only' : 'PDF or Word only';
};

/**
 * accept — у каждого поля свой: у кукол на шагах внешности только
 * снимки, на развилке «всё собрано» — только документ.
 */
export default function FileField({ files, onChange, accept: types = ACCEPT, invalid = false }) {
  const allowed = types.split(',');
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
      /* Тип проверяем первым: отказ «не та картинка» понятнее, чем
         отказ «слишком тяжёлый» у файла, который всё равно не нужен. */
      if (!allowed.includes(typeOf(f))) { rejected.push(`${f.name} — ${wrongType(allowed)}`); continue; }
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
        /* invalid — шаг не пропустил: рамка розовая, как у поля с
           ошибкой, чтобы было видно, что здесь тоже можно заполнить. */
        className={`${styles.drop} ${dragging ? styles.over : ''} ${invalid ? styles.bad : ''}`}
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
          aria-invalid={invalid || undefined}
          accept={types}
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
                  : <span className={styles.thumbDoc} aria-hidden="true">{f.name.split('.').pop()?.toUpperCase().slice(0, 4)}</span>}
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
