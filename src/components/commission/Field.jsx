import { useId } from 'react';
import styles from './Field.module.css';

/** Одно поле анкеты. Тип берётся из описания в data/commissionForm.js. */
export default function Field({ field, value, error, onChange }) {
  const id = useId();
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy = [field.hint && hintId, error && errId].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    className: `${styles.control} ${error ? styles.bad : ''}`,
    onChange: (e) => onChange(field.name, e.target.value),
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={field.type === 'chips' ? undefined : id}>
        {field.label}
        {field.required && <span className={styles.req} aria-hidden="true"> *</span>}
        {field.required && <span className="visually-hidden"> — required</span>}
      </label>

      {field.hint && <p id={hintId} className={styles.hint}>{field.hint}</p>}

      {field.type === 'textarea' && (
        <textarea {...common} value={value} rows={field.rows ?? 4} placeholder={field.placeholder} />
      )}

      {(field.type === 'text' || field.type === 'email') && (
        <input {...common} type={field.type} value={value} placeholder={field.placeholder}
               autoComplete={field.type === 'email' ? 'email' : field.name === 'name' ? 'name' : 'off'} />
      )}

      {field.type === 'select' && (
        <select {...common} value={value}>
          <option value="">Not chosen</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {field.type === 'chips' && (
        <div className={styles.chips} role="group" aria-label={field.label} aria-describedby={describedBy}>
          {field.options.map((o) => {
            const on = value.includes(o.value);
            return (
              <label key={o.value} className={`${styles.chip} ${on ? styles.chipOn : ''}`}>
                <input
                  type="checkbox"
                  className="visually-hidden"
                  checked={on}
                  onChange={() => onChange(
                    field.name,
                    on ? value.filter((v) => v !== o.value) : [...value, o.value]
                  )}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      )}

      {error && <p id={errId} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
